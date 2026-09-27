import fs from "node:fs/promises";
import path from "node:path";

const inputUrl = process.env.THREADS_POST_URL?.trim();
if (!inputUrl) throw new Error("Threads 게시물 링크를 입력하세요.");

const parsedUrl = new URL(inputUrl);
const allowedHosts = new Set(["threads.com", "www.threads.com", "threads.net", "www.threads.net"]);
if (!allowedHosts.has(parsedUrl.hostname.toLowerCase())) {
  throw new Error("threads.com 또는 threads.net 링크만 사용할 수 있습니다.");
}
const pathMatch = parsedUrl.pathname.match(/^\/@yamae\.film\/post\/([A-Za-z0-9_-]+)\/?$/i);
if (!pathMatch) throw new Error("@yamae.film 게시물 링크 형식이 아닙니다.");

const postCode = pathMatch[1];
const postUrl = `https://www.threads.com/@yamae.film/post/${postCode}`;
const postsPath = path.resolve("posts.js");
const metaPath = path.resolve("post-meta.json");
const thumbsDir = path.resolve("thumbs");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: "follow", ...options });
      if (response.ok) return response;
      if (response.status !== 429 && response.status < 500) throw new Error(`HTTP ${response.status}`);
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < 5) await sleep(3000 * attempt);
  }
  throw lastError;
}

function decodeHtml(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
function readAttributes(tag) {
  const attributes = new Map();
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g)) {
    attributes.set(match[1].toLowerCase(), match[3]);
  }
  return attributes;
}
function metaContent(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = readAttributes(tag);
    if ((attributes.get("property") ?? attributes.get("name"))?.toLowerCase() === key.toLowerCase()) {
      return decodeHtml(attributes.get("content") ?? "");
    }
  }
  return "";
}
function shortcodeTimestamp(code) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let mediaId = 0n;
  for (const character of code) {
    const value = alphabet.indexOf(character);
    if (value < 0) throw new Error("게시물 코드가 올바르지 않습니다.");
    mediaId = mediaId * 64n + BigInt(value);
  }
  return new Date(Number((mediaId >> 23n) + 1314220021721n)).toISOString();
}

const postsSource = await fs.readFile(postsPath, "utf8");
if (process.env.THREADS_VALIDATE_ONLY !== "1" && postsSource.includes(`"${postCode}"`)) {
  console.log(`이미 등록된 게시물입니다: ${postCode}`);
  process.exit(0);
}

const pageResponse = await fetchWithRetry(`${postUrl}?hl=ko`, {
  headers: {
    "user-agent": "Mozilla/5.0 (compatible; YAMAE-Film-Archive-Updater/1.0)",
    accept: "text/html,application/xhtml+xml",
  },
});
const html = await pageResponse.text();
if (/Thread not available/i.test(html)) throw new Error("공개되지 않았거나 사용할 수 없는 게시물입니다.");

// Only the permalink route flag describes the requested post; other flags can
// belong to related posts included in the response.
const routeFlags = [...html.matchAll(/"is_self_post":(?:true|false),"is_reply":(true|false),"is_close_threads":(?:true|false)/g)];
if (!routeFlags.length || routeFlags.some((flag) => flag[1] !== routeFlags[0][1])) {
  throw new Error("게시물 유형을 확인하지 못해 등록하지 않았습니다.");
}
if (routeFlags[0][1] === "true") throw new Error("댓글 게시물은 등록할 수 없습니다.");

if (metaContent(html, "og:url") !== postUrl) {
  throw new Error("원본 작성자 또는 게시물 주소가 일치하지 않아 등록하지 않았습니다.");
}

const embedResponse = await fetchWithRetry(`${postUrl}/embed/?hidecaption=1`, {
  headers: { "user-agent": "Mozilla/5.0", accept: "text/html,application/xhtml+xml" },
});
const embedHtml = await embedResponse.text();
const bodyStart = embedHtml.indexOf("<body");
const bodyEnd = embedHtml.indexOf("</body>");
const embedBody = bodyStart >= 0 ? embedHtml.slice(bodyStart, bodyEnd > bodyStart ? bodyEnd + 7 : undefined) : "";
if (!/<video\b[^>]*>\s*<source\b/i.test(embedBody)) {
  throw new Error("원본 영상이 확인되지 않아 등록하지 않았습니다.");
}
// A quote/repost embeds another post. If its identity cannot be confirmed,
// reject it before touching archive files.
const linkedPostCodes = [...embedBody.matchAll(/(?:threads\.com|threads\.net)\/(?:&#064;|@)[^/\s"']+\/post\/([A-Za-z0-9_-]+)/gi)].map((match) => match[1]);
if (!linkedPostCodes.length || linkedPostCodes.some((code) => code !== postCode)
    || /class="[^"]*(?:QuotePostContainer|QuotedPost|QuotePost|RepostedPost|RepostAttribution)[^"]*"/i.test(embedBody)) {
  throw new Error("리포스트·인용 게시물이거나 원본 여부를 확인할 수 없어 등록하지 않았습니다.");
}
if (process.env.THREADS_VALIDATE_ONLY === "1") {
  console.log(`원본 영상 게시물 확인: ${postCode}`);
  process.exit(0);
}

const imageUrlText = metaContent(html, "og:image");
const description = metaContent(html, "og:description").trim().replace(/\s+/g, " ");
if (!imageUrlText) throw new Error("게시물 미리보기 이미지를 찾지 못했습니다.");

const imageUrl = new URL(imageUrlText);
const imageHost = imageUrl.hostname.toLowerCase();
if (imageUrl.protocol !== "https:" || !(imageHost.endsWith(".fbcdn.net") || imageHost.endsWith(".cdninstagram.com"))) {
  throw new Error("허용되지 않은 미리보기 이미지 주소입니다.");
}

const metadata = JSON.parse(await fs.readFile(metaPath, "utf8"));
if (!Array.isArray(metadata)) throw new Error("post-meta.json 형식이 올바르지 않습니다.");
if (metadata.some((post) => post.code === postCode)) {
  console.log(`이미 등록된 게시물입니다: ${postCode}`);
  process.exit(0);
}

const sourceNumber = Math.max(0, ...metadata.map((post) => Number(post.number) || 0)) + 1;
const postDate = metaContent(html, "article:published_time") || shortcodeTimestamp(postCode);
const thumbnailName = `${String(sourceNumber).padStart(3, "0")}.jpg`;
const thumbnailPath = path.join(thumbsDir, thumbnailName);
const imageResponse = await fetchWithRetry(imageUrl, {
  headers: { "user-agent": "Mozilla/5.0", referer: "https://www.threads.com/" },
});
const contentType = imageResponse.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
if (contentType !== "image/jpeg") throw new Error(`미리보기 이미지 형식이 JPEG가 아닙니다: ${contentType ?? "unknown"}`);
const imageBytes = new Uint8Array(await imageResponse.arrayBuffer());
if (imageBytes.byteLength === 0 || imageBytes.byteLength > 15 * 1024 * 1024) {
  throw new Error("미리보기 이미지 크기가 올바르지 않습니다.");
}

const arrayEndPattern = /\r?\n  \];/g;
if ([...postsSource.matchAll(arrayEndPattern)].length !== 1) throw new Error("posts.js 배열 끝을 정확히 찾지 못했습니다.");
const newline = postsSource.includes("\r\n") ? "\r\n" : "\n";
const updatedPosts = postsSource.replace(arrayEndPattern, `,["${postCode}","${postDate}",1]${newline}  ];`);
metadata.push({
  code: postCode,
  date: postDate,
  video: true,
  number: sourceNumber,
  url: postUrl,
  thumbnail: `./thumbs/${thumbnailName}`,
  description,
});

await fs.mkdir(thumbsDir, { recursive: true });
await Promise.all([
  fs.writeFile(postsPath, updatedPosts, "utf8"),
  fs.writeFile(metaPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8"),
  fs.writeFile(thumbnailPath, imageBytes),
]);
console.log(`추가 완료: ${postCode}`);
console.log(`원본 번호: ${sourceNumber}`);
console.log(`작성 시각: ${postDate}`);
console.log(`썸네일: thumbs/${thumbnailName}`);
