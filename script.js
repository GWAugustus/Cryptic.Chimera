(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const masonry = document.getElementById("masonry");
  const chips = Array.from(document.querySelectorAll(".chip"));
  const allTiles = () => Array.from(masonry.querySelectorAll(".tile"));

  let activeFilter = "all";

  function visibleTiles() {
    return allTiles().filter((t) => !t.classList.contains("is-hidden"));
  }

  function setFilter(filter) {
    activeFilter = filter;
    chips.forEach((chip) => {
      const on = chip.dataset.filter === filter;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
    allTiles().forEach((tile) => {
      const cats = (tile.dataset.category || "").split(/\s+/);
      const show = filter === "all" || cats.includes(filter);
      tile.classList.toggle("is-hidden", !show);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => setFilter(chip.dataset.filter));
  });

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lightbox-image");
  const lbTitle = document.getElementById("lightbox-title");
  const lbMeta = document.getElementById("lightbox-meta");
  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");
  let index = 0;
  let lastFocus = null;

  function openAt(i) {
    const tiles = visibleTiles();
    if (!tiles.length) return;
    index = ((i % tiles.length) + tiles.length) % tiles.length;
    const tile = tiles[index];
    const img = tile.querySelector("img");
    lbImage.src = img.currentSrc || img.src;
    lbImage.alt = img.alt || tile.dataset.title || "";
    lbTitle.textContent = tile.dataset.title || "";
    const medium = tile.dataset.medium || "";
    const year = tile.dataset.year || "";
    lbMeta.textContent = [medium, year].filter(Boolean).join(" · ");
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lastFocus = document.activeElement;
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lbImage.removeAttribute("src");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function step(delta) {
    openAt(index + delta);
  }

  masonry.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile || tile.classList.contains("is-hidden")) return;
    const tiles = visibleTiles();
    openAt(tiles.indexOf(tile));
  });

  masonry.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tile = e.target.closest(".tile");
    if (!tile) return;
    e.preventDefault();
    const tiles = visibleTiles();
    openAt(tiles.indexOf(tile));
  });

  lightbox.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });
  btnPrev.addEventListener("click", () => step(-1));
  btnNext.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  /* Expose for screenshot hover demo */
  window.__cc = { setFilter, openAt, closeLightbox, visibleTiles, allTiles };
})();
