import test from "node:test";
import assert from "node:assert/strict";
import { listAllThreads, classifyThread, planNewPosts } from "../scripts/sync-thread-posts.mjs";

const original = (code, date) => ({
  shortcode: code,
  username: "yamae.film",
  media_type: "VIDEO",
  is_quote_post: false,
  timestamp: date,
  media_url: "https://example.fbcdn.net/video.mp4",
  thumbnail_url: "https://example.fbcdn.net/cover.jpg",
});

test("모든 페이지를 끝까지 확인한다", async () => {
  const pages = new Map([
    ["https://graph.threads.net/me/threads", { data: [original("B", "2026-10-26T00:00:00Z")], paging: { next: "https://graph.threads.net/page/2" } }],
    ["https://graph.threads.net/page/2", { data: [original("A", "2026-10-25T00:00:00Z")] }],
  ]);
  const items = await listAllThreads(async (url) => pages.get(url), "https://graph.threads.net/me/threads");
  assert.deepEqual(items.map((item) => item.shortcode), ["B", "A"]);
  assert.deepEqual(planNewPosts(items, new Set()).selected.map((item) => item.code), ["A", "B"]);
});

test("목록 누락이나 순환을 성공으로 처리하지 않는다", async () => {
  await assert.rejects(listAllThreads(async () => ({ data: [], paging: { next: "https://graph.threads.net/me/threads" } }), "https://graph.threads.net/me/threads"), /순환/);
  await assert.rejects(listAllThreads(async () => ({ data: [original("A", "2026-10-26T00:00:00Z")], paging: { next: "https://evil.example/" } }), "https://graph.threads.net/me/threads"), /주소/);
  await assert.rejects(listAllThreads(async () => ({}), "https://graph.threads.net/me/threads"), /data/);
});

test("본인 원본 영상만 추가하고 댓글, 인용, 리포스트를 제외한다", () => {
  const base = original("A", "2026-10-26T00:00:00Z");
  assert.equal(classifyThread(base).code, "A");
  assert.equal(classifyThread({ ...base, is_reply: true }).reason, "reply");
  assert.equal(classifyThread({ ...base, is_quote_post: true }).reason, "quote");
  assert.equal(classifyThread({ ...base, quoted_post: { id: "1" } }).reason, "quote");
  assert.equal(classifyThread({ ...base, reposted_post: { id: "1" } }).reason, "repost");
  assert.equal(classifyThread({ ...base, username: "someone.else" }).reason, "other-author");
  assert.equal(classifyThread({ ...base, media_type: "IMAGE" }).reason, "non-video");
  assert.deepEqual(planNewPosts([base], new Set(["A"])).selected, []);
  assert.throws(() => classifyThread({ ...base, is_quote_post: undefined }), /인용 여부/);
});
