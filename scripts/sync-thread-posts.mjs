import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiHost = "https://graph.threads.net";
const account = "yamae.film";
const fields = "id,media_type,media_url,permalink,username,text,timestamp,shortcode,thumbnail_url,is_quote_post,quoted_post,reposted_post";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listAllThreads(getJson, firstUrl, maxPages = 100) {
  const all = [];
  const visited = new Set();
  let next = firstUrl;
  for (let page = 0; next; page += 1) {
    if (page >= maxPages) throw new Error(`Threads 목록이 ${maxPages}페이지를 넘어 중단했습니다. 일부만 반영하지 않습니다.`);
    const url = new URL(next, apiHost);
    if (url.origin !== apiHost || visited.has(url.href)) throw new Error("Threads 페이지 주소 또는 순환이 올바르지 않습니다.");
    visited.add(url.href);
    const result = await getJson(url.href);
    if (!Array.isArray(result.data)) throw new Error("Threads 목록 응답에 data 배열이 없습니다.");
    all.push(...result.data);
    next = result.paging?.next ?? "";
  }
  if (!all.length) throw new Error("Threads 계정 목록이 비어 있습니다. 일부만 반영하지 않습니다.");
  return all;
}

export function classifyThread(item) {
  const code = item.shortcode || item.permalink?.match(/\/post\/([A-Za-z0-9_-]+)/)?.[1];
  if (!code || !/^[A-Za-z0-9_-]+$/.test(code)) return { reason: "missing-code" };
  if (item.username?.toLowerCase() !== account) return { code, reason: "other-author" };
  if (item.is_reply === true || item.replied_to) return { code, reason: "reply" };
  if (item.is_quote_post === true || item.quoted_post) return { code, reason: "quote" };
  if (item.media_type === "REPOST_FACADE" || item.reposted_post) return { code, reason: "repost" };
  if (item.media_type !== "VIDEO") return { code, reason: "non-video" };
  if (item.is_quote_post !== false) throw new Error(`${code}: 인용 여부를 확인할 수 없습니다.`);
  const date = new Date(item.timestamp);
  if (!Number.isFinite(date.getTime())) throw new Error(`${code}: 작성 시각이 올바르지 않습니다.`);
  if (!item.thumbnail_url || !item.media_url) throw new Error(`${code}: 영상 또는 썸네일 주소가 없습니다.`);
  return { code, date: date.toISOString(), item };
}

export function planNewPosts(items, knownCodes) {
  const seen = new Set();
  const selected = [];
  const skipped = {};
  for (const item of items) {
    const result = classifyThread(item);
    if (result.reason) {
      skipped[result.reason] = (skipped[result.reason] ?? 0) + 1;
      continue;
    }
    if (seen.has(result.code)) throw new Error(`Threads 목록에 중복 게시물이 있습니다: ${result.code}`);
    seen.add(result.code);
    if (!knownCodes.has(result.code)) selected.push(result);
  }
  selected.sort((a, b) => a.date.localeCompare(b.date) || a.code.localeCompare(b.code));
  return { selected, skipped };
}

function checkedMediaUrl(value) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || !(host.endsWith(".fbcdn.net") || host.endsWith(".cdninstagram.com"))) {
    throw new Error(`허용되지 않은 Threads 미디어 주소: ${host}`);
  }
  return url.href;
}

async function getJson(url, token) {
  const parsed = new URL(url, apiHost);
  if (parsed.origin !== apiHost) throw new Error("허용되지 않은 Threads API 주소입니다.");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(parsed, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) return response.json();
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 3) {
      throw new Error(`Threads API HTTP ${response.status} (${parsed.pathname})`);
    }
    await sleep(attempt * 1000);
  }
}

async function getThumbnail(url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(checkedMediaUrl(url), { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (response.headers.get("content-type")?.split(";")[0].toLowerCase() !== "image/jpeg") {
        throw new Error("썸네일이 JPEG 형식이 아닙니다.");
      }
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 100 || bytes.length > 15 * 1024 * 1024) throw new Error("썸네일 크기가 올바르지 않습니다.");
      return bytes;
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(attempt * 1000);
    }
  }
}

async function run() {
  const token = process.env.THREADS_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("THREADS_ACCESS_TOKEN이 없습니다. 자동 동기화를 성공 처리하지 않습니다.");
  const profile = await getJson("/me?fields=id,username", token);
  if (profile.username?.toLowerCase() !== account) throw new Error("토큰이 @yamae.film 계정의 것이 아닙니다.");

  const first = new URL("/me/threads", apiHost);
  first.searchParams.set("fields", fields);
  first.searchParams.set("limit", "100");
  const items = await listAllThreads((url) => getJson(url, token), first.href);
  const postsPath = path.resolve("posts.js");
  const metaPath = path.resolve("post-meta.json");
  const sourcePath = path.resolve("video-sources.js");
  const htmlPath = path.resolve("index.html");
  const postsSource = await fs.readFile(postsPath, "utf8");
  const metadata = JSON.parse(await fs.readFile(metaPath, "utf8"));
  const rawCodes = [...postsSource.matchAll(/\["([A-Za-z0-9_-]+)","[^"]+",[01]\]/g)].map((match) => match[1]);
  const knownCodes = new Set(rawCodes);
  if (!Array.isArray(metadata) || knownCodes.size !== rawCodes.length) throw new Error("기존 게시물 목록이 중복되거나 손상됐습니다.");
  const metaCodes = new Set(metadata.map((post) => post.code));
  for (const code of metaCodes) if (!knownCodes.has(code)) throw new Error(`메타데이터에만 있는 게시물: ${code}`);
  const { selected, skipped } = planNewPosts(items, knownCodes);
  console.log(`Threads ${items.length}건 확인; 추가 ${selected.length}건; 제외 ${JSON.stringify(skipped)}`);
  if (!selected.length) return;

  const sourcesText = await fs.readFile(sourcePath, "utf8");
  const sources = JSON.parse(sourcesText.slice(sourcesText.indexOf("=") + 1).replace(/;\s*$/, ""));
  const prepared = [];
  let number = Math.max(0, ...metadata.map((post) => Number(post.number) || 0));
  for (const { code, date, item } of selected) {
    const source = checkedMediaUrl(item.media_url);
    const thumbnail = await getThumbnail(item.thumbnail_url);
    number += 1;
    prepared.push({ code, date, number, source, thumbnail, description: String(item.text ?? "").trim() });
  }

  const newline = postsSource.includes("\r\n") ? "\r\n" : "\n";
  const rows = prepared.map(({ code, date }) => `    [${JSON.stringify(code)},${JSON.stringify(date)},1]`).join(`,${newline}`);
  const endPattern = /(    \["[A-Za-z0-9_-]+","[^"]+",[01]\])(\r?\n  \];)/g;
  if ([...postsSource.matchAll(endPattern)].length !== 1) throw new Error("posts.js 배열의 끝을 찾지 못했습니다.");
  const updatedPosts = postsSource.replace(endPattern, (_, last, end) => `${last},${newline}${rows}${end}`);
  for (const post of prepared) {
    metadata.push({ code: post.code, date: post.date, video: true, number: post.number,
      url: `https://www.threads.com/@yamae.film/post/${post.code}`,
      thumbnail: `./thumbs/${String(post.number).padStart(3, "0")}.jpg`,
      description: post.description });
    sources[post.code] = post.source;
  }
  const stamp = `sync-${Date.now()}`;
  const html = (await fs.readFile(htmlPath, "utf8"))
    .replace(/\.\/posts\.js\?v=[^" ]+/, `./posts.js?v=${stamp}`)
    .replace(/\.\/video-sources\.js\?v=[^" ]+/, `./video-sources.js?v=${stamp}`);
  await fs.mkdir("thumbs", { recursive: true });
  for (const post of prepared) await fs.writeFile(path.join("thumbs", `${String(post.number).padStart(3, "0")}.jpg`), post.thumbnail);
  await fs.writeFile(postsPath, updatedPosts);
  await fs.writeFile(metaPath, `${JSON.stringify(metadata, null, 2)}\n`);
  await fs.writeFile(sourcePath, `// Generated automatically from Threads API and public embeds.\nwindow.YAMAE_VIDEO_SOURCES = ${JSON.stringify(sources, null, 2)};\n`);
  await fs.writeFile(htmlPath, html);
  console.log(`원본 영상 ${prepared.length}개 추가: ${prepared.map((post) => post.code).join(", ")}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run();
}
