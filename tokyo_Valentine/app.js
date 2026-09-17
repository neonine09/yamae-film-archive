(() => {
  "use strict";
  const posts = window.TOKYO_VALENTINE_POSTS || [];
  const $ = (selector) => document.querySelector(selector);
  const grid = $("#film-grid");
  const loadZone = $("#load-zone");
  const status = $("#load-status");
  const empty = $("#empty-state");
  const search = $("#search-input");
  const count = $("#shown-count");
  const sortLabel = $("#sort-label");
  const mobile = matchMedia("(max-width: 640px)").matches;
  const batch = mobile ? 8 : 15;
  const fmt = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });
  const fmtTime = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  let sort = "desc";
  let query = "";
  let visible = 0;
  let filtered = [];
  let active = null;

  const modal = document.createElement("div");
  modal.className = "preview-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = '<div class="modal-backdrop" data-close></div><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" type="button" aria-label="미리보기 닫기" data-close>×</button><div class="modal-heading"><div><p class="modal-kicker">X FILM PREVIEW</p><h2 id="modal-title">FILM 001</h2></div><time class="modal-date"></time></div><div class="modal-content"><div class="modal-player"><div class="modal-player-top"><span>ORIGINAL VIDEO</span><span class="live-dot"></span></div><video controls playsinline preload="metadata"></video><p class="video-error" hidden>영상 링크를 불러오지 못했습니다. 아래 원문 링크에서 확인하세요.</p></div><div class="modal-details"><div class="modal-details-top"><span class="modal-details-label">POST CONTENT</span><span class="modal-details-type">VIDEO</span></div><h3 class="modal-post-title"></h3><p class="modal-caption"></p><div class="modal-details-meta"><span class="modal-code"></span><time class="modal-date-bottom"></time></div><a class="modal-original" target="_blank" rel="noopener noreferrer">X에서 원문 열기 ↗</a></div></div></section>';
  document.body.append(modal);

  const n = (post) => String(post.number).padStart(3, "0");
  const d = (value) => fmt.format(new Date(value)).replaceAll(" ", "");
  const dt = (value) => fmtTime.format(new Date(value)).replaceAll(" ", "");
  const ordered = () => {
    const q = query.trim().toLowerCase();
    let result = posts.filter((post) => !q || [n(post), post.code, post.date.slice(0, 10), post.title, post.caption].some((value) => String(value).toLowerCase().includes(q)));
    return sort === "desc" ? [...result].reverse() : result;
  };

  function fillModal(post) {
    $("#modal-title").textContent = "FILM " + n(post);
    $(".modal-date").textContent = d(post.date);
    $(".modal-date-bottom").textContent = dt(post.date);
    $(".modal-code").textContent = "@tokyo_Valentine/status/" + post.code;
    $(".modal-post-title").textContent = post.title;
    $(".modal-caption").textContent = post.caption;
    $(".modal-original").href = post.url;
  }

  function open(post) {
    active = post;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    fillModal(post);
    const video = modal.querySelector("video");
    $(".video-error").hidden = true;
    video.poster = post.thumbnail;
    video.src = post.video;
    video.load();
    setTimeout(() => $(".modal-close")?.focus(), 0);
  }

  function close() {
    if (!active) return;
    active = null;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    const video = modal.querySelector("video");
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  function tile(post) {
    const article = document.createElement("article");
    article.className = "film-card";
    article.innerHTML = '<button class="tile-preview" type="button" aria-label="FILM ' + n(post) + ' 미리보기 열기"><img loading="lazy" alt=""><span class="tile-shade"></span><span class="tile-index">' + n(post) + '</span><span class="tile-play"><i></i></span><span class="tile-hover-label">미리보기</span></button><div class="tile-details"><div class="tile-title-row"><span class="tile-label">FILM</span><strong>' + n(post) + '</strong><time></time></div><h3 class="tile-post-title"></h3><p class="tile-caption"></p><div class="tile-meta-row"><span class="tile-type">X VIDEO</span><button class="tile-open" type="button">재생 보기 <span>↗</span></button></div></div>';
    const image = article.querySelector("img");
    image.src = post.thumbnail;
    image.alt = post.title + " 영상 썸네일";
    image.addEventListener("error", () => { image.removeAttribute("src"); article.classList.add("no-thumbnail"); }, { once: true });
    article.querySelector("time").textContent = d(post.date);
    article.querySelector(".tile-post-title").textContent = post.title;
    article.querySelector(".tile-caption").textContent = post.caption;
    article.querySelector(".tile-preview").addEventListener("click", () => open(post));
    article.querySelector(".tile-open").addEventListener("click", () => open(post));
    return article;
  }

  function render(reset) {
    if (reset) { grid.replaceChildren(); visible = 0; filtered = ordered(); }
    const part = filtered.slice(visible, visible + batch);
    const fragment = document.createDocumentFragment();
    part.forEach((post) => fragment.append(tile(post)));
    grid.append(fragment);
    visible += part.length;
    count.textContent = filtered.length.toLocaleString("ko-KR");
    empty.hidden = filtered.length > 0;
    loadZone.hidden = filtered.length === 0;
    const done = visible >= filtered.length;
    loadZone.classList.toggle("is-complete", done);
    status.textContent = done ? "전체 " + filtered.length.toLocaleString("ko-KR") + "개 영상을 모두 불러왔습니다" : visible + " / " + filtered.length + " · 계속 스크롤하세요";
  }

  const first = posts[0];
  const last = posts[posts.length - 1];
  $("#total-count").textContent = posts.length.toLocaleString("ko-KR");
  $("#date-range").textContent = first && last ? d(first.date) + " — " + d(last.date) : "—";
  document.querySelectorAll("[data-sort]").forEach((button) => button.addEventListener("click", () => {
    sort = button.dataset.sort;
    document.querySelectorAll("[data-sort]").forEach((item) => item.classList.toggle("is-active", item === button));
    sortLabel.textContent = sort === "asc" ? "오래된 순" : "최신 순";
    render(true);
  }));
  let timer;
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { query = search.value; render(true); }, 120);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== search && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) { event.preventDefault(); search.focus(); }
    if (event.key === "Escape") {
      if (active) close();
      else if (document.activeElement === search) { search.value = ""; query = ""; search.blur(); render(true); }
    }
  });
  modal.addEventListener("click", (event) => { if (event.target.matches("[data-close]")) close(); });
  modal.querySelector("video").addEventListener("error", () => { $(".video-error").hidden = false; });
  new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting) && visible < filtered.length) render(false); }, { rootMargin: "900px 0px" }).observe(loadZone);
  $("#back-to-top").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  addEventListener("scroll", () => $("#back-to-top").classList.toggle("is-visible", scrollY > 700), { passive: true });
  render(true);
})();
