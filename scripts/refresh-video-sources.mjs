import fs from "node:fs/promises";

const postsSource = await fs.readFile("posts.js", "utf8");
const allEntries = [...postsSource.matchAll(/\["([A-Za-z0-9_-]+)","([^"]+)",(1|0)\]/g)]
  .filter((match) => match[3] === "1")
  .map((match) => match[1]);
// Always refresh the newest posts first, then rotate through the archive.
const newest = allEntries.slice(-20).reverse();
const older = allEntries.slice(0, -20);
const shift = older.length ? Math.floor(Date.now() / 21_600_000) % older.length : 0;
const entries = [...newest, ...older.slice(shift), ...older.slice(0, shift)];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSource(code) {
  const url = `https://www.threads.com/@yamae.film/post/${code}/embed/`;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; YAMAE-Film-Archive/1.0)",
          "accept-language": "ko-KR,ko;q=0.9,en;q=0.7",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const match = html.match(/<video\b[^>]*>[\s\S]*?<source\b[^>]*\bsrc=(?:"([^"]+)"|'([^']+)')[^>]*>/i);
      const source = match?.[1] ?? match?.[2] ?? "";
      if (!source) return null;
      return source
        .replaceAll("&amp;", "&")
        .replaceAll("&#38;", "&")
        .replaceAll("&#x26;", "&");
    } catch (error) {
      if (attempt === 4) return null;
      await sleep(attempt * 350);
    }
  }
  return null;
}

let sources = {};
try {
  const previous = await fs.readFile("video-sources.js", "utf8");
  sources = JSON.parse(previous.slice(previous.indexOf("=") + 1).replace(/;\s*$/, ""));
} catch {}
const refreshed = new Set();
const concurrency = 8;
let cursor = 0;
async function worker() {
  while (cursor < entries.length) {
    const code = entries[cursor++];
    const source = await fetchSource(code);
    if (source) {
      sources[code] = source;
      refreshed.add(code);
    }
    await sleep(40);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

const output = `// Generated automatically from public Threads embeds.\nwindow.YAMAE_VIDEO_SOURCES = ${JSON.stringify(sources, null, 2)};\n`;
await fs.writeFile("video-sources.js", output, "utf8");
console.log(`영상 주소 ${refreshed.size}/${entries.length}개 갱신, 총 ${Object.keys(sources).length}개 저장 완료`);
