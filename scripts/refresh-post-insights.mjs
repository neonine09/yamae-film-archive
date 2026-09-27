import fs from "node:fs/promises";

const token = process.env.THREADS_ACCESS_TOKEN;
if (!token) throw new Error("THREADS_ACCESS_TOKEN GitHub Secret이 필요합니다.");

const apiHost = "https://graph.threads.net";
const knownCodes = new Set(
  [...(await fs.readFile("posts.js", "utf8")).matchAll(/\["([A-Za-z0-9_-]+)","[^"]+",[01]\]/g)]
    .map((match) => match[1]),
);
const previous = JSON.parse(await fs.readFile("post-insights.json", "utf8"));
const views = { ...(previous.views ?? {}) };
const excluded = new Set(previous.excludedCodes ?? []);

async function getJson(url) {
  const parsed = new URL(url, apiHost);
  if (parsed.origin !== apiHost) throw new Error("허용되지 않은 Threads API 주소입니다.");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(parsed, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) return response.json();
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 3) {
      throw new Error(`Threads API HTTP ${response.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
}

const profile = await getJson("/me?fields=id,username");
if (profile.username?.toLowerCase() !== "yamae.film") {
  throw new Error("토큰이 @yamae.film 계정의 것이 아닙니다.");
}

const firstPage = new URL("/me/threads", apiHost);
firstPage.searchParams.set("fields", "id,shortcode,permalink,is_quote_post,quoted_post,reposted_post");
firstPage.searchParams.set("limit", "100");
const media = [];
let pageUrl = firstPage.href;
for (let page = 0; page < 20 && pageUrl; page += 1) {
  const result = await getJson(pageUrl);
  if (!Array.isArray(result.data)) throw new Error("Threads 게시물 목록 응답 형식이 올바르지 않습니다.");
  media.push(...result.data);
  pageUrl = result.paging?.next ?? "";
}
if (!media.length) throw new Error("@yamae.film 게시물 목록을 가져오지 못했습니다.");

const eligible = [];
for (const item of media) {
  const code = item.shortcode || item.permalink?.match(/\/post\/([A-Za-z0-9_-]+)/)?.[1];
  if (!code || !knownCodes.has(code)) continue;
  if (item.is_quote_post === true || item.quoted_post || item.reposted_post) {
    excluded.add(code);
    delete views[code];
  } else if (item.id && !excluded.has(code)) {
    eligible.push({ code, id: item.id });
  }
}
if (!eligible.length) throw new Error("아카이브 게시물과 Threads API 목록이 일치하지 않습니다.");

let succeeded = 0;
let cursor = 0;
async function worker() {
  while (cursor < eligible.length) {
    const { code, id } = eligible[cursor++];
    try {
      const result = await getJson(`/${encodeURIComponent(id)}/insights?metric=views`);
      const metric = result.data?.find((entry) => entry.name === "views");
      const value = metric?.values?.[0]?.value ?? metric?.total_value?.value ?? metric?.value;
      if (Number.isSafeInteger(value) && value >= 0) {
        views[code] = value;
        succeeded += 1;
      }
    } catch {
      // Keep the last verified value when one post's insights are unavailable.
    }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
if (!succeeded) throw new Error("게시물 조회수를 가져오지 못했습니다. Insights 권한을 확인하세요.");

await fs.writeFile("post-insights.json", `${JSON.stringify({
  updatedAt: new Date().toISOString(),
  views,
  excludedCodes: [...excluded].sort(),
}, null, 2)}\n`);
console.log(`원본 조회수 ${succeeded}개 갱신, 인용/리포스트 ${excluded.size}개 제외`);
