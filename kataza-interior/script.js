(function () {
  const menuBtn = document.querySelector(".menu-btn");
  const panel = document.querySelector(".nav-panel");
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("menu-open", open);
    });
    panel.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        panel.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      })
    );
  }

  const cards = [...document.querySelectorAll(".card")];
  const filters = [...document.querySelectorAll(".filter")];
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-filter");
      filters.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      cards.forEach((card) => {
        const show = cat === "all" || card.getAttribute("data-cat") === cat;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector(".lb-cap");
  let gallery = [];
  let index = 0;

  function show(i) {
    index = (i + gallery.length) % gallery.length;
    const item = gallery[index];
    lbImg.src = item.src;
    lbImg.alt = item.alt || "";
    lbCap.textContent =
      (item.caption || "") + (gallery.length > 1 ? "  ·  " + (index + 1) + " of " + gallery.length : "");
  }

  function open(start, items) {
    gallery = items;
    show(start);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
  }

  document.querySelectorAll(".card-media").forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.getAttribute("data-gallery");
      if (!raw) return;
      const items = raw.split("|").map((s) => {
        const [src, alt] = s.split("::");
        return { src, alt, caption: alt };
      });
      open(0, items);
    });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
