(() => {
  "use strict";

  const sourcePosts = Array.isArray(window.YAMAE_POSTS) ? window.YAMAE_POSTS : [];
  // Threads currently returns “Thread not available” for these public IDs.
  // Exclude them so the archive never opens a visibly broken preview.
  const unavailablePostCodes = new Set([
    "DZs2YeFk6wC",
    "Db5FYRJCfj5",
    "Db60TNgCa4M",
    "Db_6Fz7CWib",
    "DcIu0KLCWq6",
    "DcOHM1DiTwG",
    "Dcc5GYYkX1e",
    "Dc0FfUqif5I",
    "DdSXmRYifFS",
  ]);
  const posts = sourcePosts
    .filter((post) => Boolean(post.video) && !unavailablePostCodes.has(post.code))
    .map((post, index) => ({
      ...post,
      sourceNumber: post.number,
      number: index + 1,
      caption: "",
    }));
  const postByCode = new Map(posts.map((post) => [post.code, post]));

  const grid = document.querySelector("#film-grid");
  const loadZone = document.querySelector("#load-zone");
  const loadStatus = document.querySelector("#load-status");
  const emptyState = document.querySelector("#empty-state");
  const searchInput = document.querySelector("#search-input");
  const shownCount = document.querySelector("#shown-count");
  const sortLabel = document.querySelector("#sort-label");
  const backToTop = document.querySelector("#back-to-top");
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const batchSize = isMobile ? 12 : 20;
  const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  let state = { sort: "desc", query: "", visible: 0, filtered: [] };
  let activePost = null;
  let blobUrl = "";
  let videoRequest = null;
  let videoLoadId = 0;

  const modal = document.createElement("div");
  modal.className = "preview-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-backdrop" data-modal-close></div>
    <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" type="button" aria-label="미리보기 닫기" data-modal-close>×</button>
      <div class="modal-heading">
        <div>
          <p class="modal-kicker">THREADS FILM PREVIEW</p>
          <h2 id="modal-title">FILM 001</h2>
        </div>
        <time class="modal-date"></time>
      </div>
      <div class="modal-content">
        <div class="modal-player">
          <div class="modal-player-top"><span>ORIGINAL VIDEO</span><span class="live-dot"></span></div>
          <video controls playsinline preload="metadata" crossorigin="anonymous" referrerpolicy="no-referrer"></video>
          <p class="video-error" hidden>영상을 불러오지 못했습니다. 아래 원문 링크에서 확인하세요.</p>
        </div>
        <div class="modal-details">
          <div class="modal-details-top">
            <span class="modal-details-label">POST CONTENT</span>
            <span class="modal-details-type">VIDEO</span>
          </div>
          <h3 class="modal-post-title"></h3>
          <p class="modal-caption"></p>
          <div class="modal-details-meta">
            <span class="modal-code"></span>
            <time class="modal-date-bottom"></time>
          </div>
          <a class="modal-original" target="_blank" rel="noopener noreferrer">Threads에서 원문 열기 ↗</a>
        </div>
      </div>
    </section>
  `;
  document.body.append(modal);

  function postNumber(post) {
    return String(post.number).padStart(3, "0");
  }

  function sourceNumber(post) {
    return String(post.sourceNumber ?? post.number).padStart(3, "0");
  }

  function thumbnailPath(post) {
    return `./thumbs/${sourceNumber(post)}.jpg`;
  }

  function decodeEntities(value) {
    if (!value) return "";
    const decoder = document.createElement("textarea");
    decoder.innerHTML = value;
    return decoder.value.replace(/\s+/g, " ").trim();
  }

  function captionFor(post) {
    return post.caption || "";
  }

  function formatDate(date) {
    return dateFormatter.format(new Date(date)).replaceAll(" ", "");
  }

  function updateStats() {
    const first = posts[0];
    const last = posts[posts.length - 1];
    const total = document.querySelector("#total-count");
    const videoCount = document.querySelector("#video-count");
    const dateRange = document.querySelector("#date-range");
    if (total) total.textContent = posts.length.toLocaleString("ko-KR");
    if (videoCount) videoCount.textContent = posts.length.toLocaleString("ko-KR");
    if (dateRange) dateRange.textContent = first && last
      ? `${formatDate(first.date)} — ${formatDate(last.date)}`
      : "—";
  }

  function filteredPosts() {
    const q = state.query.trim().toLowerCase();
    let result = posts.filter((post) => {
      if (!q) return true;
      return [postNumber(post), String(post.number), post.code, post.date.slice(0, 10), captionFor(post)]
        .some((value) => value.toLowerCase().includes(q));
    });
    if (state.sort === "desc") result = [...result].reverse();
    return result;
  }

  function updateModalDetails(post) {
    modal.querySelector("#modal-title").textContent = `FILM ${postNumber(post)}`;
    modal.querySelector(".modal-date").textContent = formatDate(post.date);
    modal.querySelector(".modal-date-bottom").textContent = formatDate(post.date);
    modal.querySelector(".modal-code").textContent = `@yamae.film/post/${post.code}`;
    modal.querySelector(".modal-original").href = post.url;
    const caption = captionFor(post);
    const parts = caption.split(/(?<=[.!?。！？])\s+|\n+/).filter(Boolean);
    const title = parts.shift() || `YAMAE.FILM ${postNumber(post)}`;
    modal.querySelector(".modal-post-title").textContent = title;
    const captionEl = modal.querySelector(".modal-caption");
    captionEl.textContent = parts.join("\n\n") || (caption ? "" : "Threads 원문에서 전체 게시물 내용을 확인할 수 있습니다.");
    captionEl.classList.toggle("is-empty", !caption);
  }

  function openPreview(post) {
    activePost = post;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    updateModalDetails(post);
    const video = modal.querySelector("video");
    video.poster = thumbnailPath(post);
    modal.querySelector(".video-error").hidden = true;
    void loadVideo(post);
    window.setTimeout(() => modal.querySelector(".modal-close")?.focus(), 0);
  }

  function closePreview() {
    if (!activePost) return;
    activePost = null;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    clearVideo();
  }

  function clearVideo() {
    videoLoadId += 1;
    videoRequest?.abort();
    videoRequest = null;
    const video = modal.querySelector("video");
    video.pause();
    video.style.aspectRatio = "";
    video.removeAttribute("src");
    video.load();
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = "";
    }
  }

  async function loadVideo(post) {
    const video = modal.querySelector("video");
    const videoUrl = window.YAMAE_VIDEO_SOURCES?.[post.code];
    const requestId = ++videoLoadId;
    videoRequest?.abort();
    videoRequest = new AbortController();
    video.removeAttribute("src");
    video.load();

    if (!videoUrl) {
      modal.querySelector(".video-error").hidden = false;
      videoRequest = null;
      return;
    }

    try {
      const response = await fetch(videoUrl, {
        headers: { Range: "bytes=0-" },
        mode: "cors",
        referrerPolicy: "no-referrer",
        signal: videoRequest.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (requestId !== videoLoadId || !activePost) return;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      blobUrl = URL.createObjectURL(blob);
      video.src = blobUrl;
      video.load();
    } catch (error) {
      if (error.name === "AbortError" || requestId !== videoLoadId || !activePost) return;
      video.src = videoUrl;
      video.load();
      modal.querySelector(".video-error").hidden = false;
    } finally {
      if (requestId === videoLoadId) videoRequest = null;
    }
  }

  function updateTileCaption(article, post) {
    const captionEl = article.querySelector(".tile-caption");
    const quickCopy = article.querySelector(".tile-quick-copy");
    const caption = captionFor(post);
    captionEl.textContent = caption;
    captionEl.hidden = !caption;
    if (quickCopy) quickCopy.textContent = caption || "게시물 내용을 불러오는 중입니다.";
  }

  function makeTile(post) {
    const article = document.createElement("article");
    article.className = "film-card film-tile";
    article.id = `film-${postNumber(post)}`;
    article.dataset.code = post.code;
    article.classList.add("has-hover-preview");
    const hoverPreviewMarkup = `
      <span class="tile-quick-info" aria-hidden="true">
        <span class="tile-quick-kicker">내용 미리보기</span>
        <span class="tile-quick-copy">게시물 내용을 불러오는 중입니다.</span>
        <span class="tile-quick-action">클릭하면 영상 재생 <b>↗</b></span>
      </span>`;
    article.innerHTML = `
      <button class="tile-preview" type="button" aria-label="FILM ${postNumber(post)} 미리보기 열기">
        <img loading="lazy" alt="FILM ${postNumber(post)} 영상 썸네일" />
        <span class="tile-shade"></span>
        <span class="tile-index">${postNumber(post)}</span>
        ${hoverPreviewMarkup}
        <span class="tile-play"><i></i></span>
        <span class="tile-hover-label">미리보기</span>
      </button>
      <div class="tile-details">
        <div class="tile-title-row">
          <span class="tile-label">FILM</span>
          <strong>${postNumber(post)}</strong>
          <time datetime="${post.date}">${formatDate(post.date)}</time>
        </div>
        <p class="tile-caption" hidden></p>
        <div class="tile-meta-row">
          <span class="tile-type is-video">VIDEO</span>
          <button class="tile-open" type="button">재생 보기 <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    `;

    const image = article.querySelector("img");
    image.src = thumbnailPath(post);
    image.addEventListener("error", () => {
      image.removeAttribute("src");
      article.classList.add("no-thumbnail");
    }, { once: true });
    updateTileCaption(article, post);

    const open = () => openPreview(post);
    article.querySelector(".tile-preview").addEventListener("click", open);
    article.querySelector(".tile-open").addEventListener("click", open);
    return article;
  }

  function applyTileCaptions() {
    grid.querySelectorAll(".film-tile").forEach((article) => {
      const post = postByCode.get(article.dataset.code);
      if (post) updateTileCaption(article, post);
    });
  }

  function render(reset = false) {
    if (reset) {
      grid.replaceChildren();
      state.visible = 0;
      state.filtered = filteredPosts();
    }
    const chunk = state.filtered.slice(state.visible, state.visible + batchSize);
    const fragment = document.createDocumentFragment();
    chunk.forEach((post) => fragment.append(makeTile(post)));
    grid.append(fragment);
    state.visible += chunk.length;
    shownCount.textContent = state.filtered.length.toLocaleString("ko-KR");
    emptyState.hidden = state.filtered.length > 0;
    loadZone.hidden = state.filtered.length === 0;
    const complete = state.visible >= state.filtered.length;
    loadZone.classList.toggle("is-complete", complete);
    loadStatus.textContent = complete
      ? `전체 ${state.filtered.length.toLocaleString("ko-KR")}개 영상을 모두 불러왔습니다`
      : `${state.visible.toLocaleString("ko-KR")} / ${state.filtered.length.toLocaleString("ko-KR")} · 계속 스크롤하세요`;
  }

  function applyControls() {
    state.filtered = filteredPosts();
    sortLabel.textContent = state.sort === "asc" ? "오래된 순" : "최신 순";
    render(true);
  }

  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((item) => item.classList.toggle("is-active", item === button));
      applyControls();
    });
  });

  let searchTimer;
  searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.query = searchInput.value;
      applyControls();
    }, 150);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape") {
      if (activePost) closePreview();
      else if (document.activeElement === searchInput) {
        searchInput.value = "";
        state.query = "";
        searchInput.blur();
        applyControls();
      }
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-modal-close]")) closePreview();
  });
  modal.querySelector("video").addEventListener("error", () => {
    modal.querySelector(".video-error").hidden = false;
  });
  modal.querySelector("video").addEventListener("loadedmetadata", (event) => {
    const video = event.currentTarget;
    if (video.videoWidth && video.videoHeight) {
      video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting) && state.visible < state.filtered.length) render();
  }, { rootMargin: "900px 0px" });
  observer.observe(loadZone);

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => backToTop.classList.toggle("is-visible", window.scrollY > 700), { passive: true });

  updateStats();
  state.filtered = filteredPosts();
  render();

  fetch("./post-meta.json", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : [])
    .then((items) => {
      items.forEach((item) => {
        const post = postByCode.get(item.code);
        if (post) post.caption = decodeEntities(item.description || "");
      });
      applyTileCaptions();
      if (state.query) applyControls();
      if (activePost) updateModalDetails(activePost);
    })
    .catch(() => {});
})();
