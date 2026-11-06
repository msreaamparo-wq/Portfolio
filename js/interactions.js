(function () {
  "use strict";
  const toggle = document.querySelector("#menuToggle");
  const nav = document.querySelector("#siteNav");

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    }, { passive: true });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!reduceMotion && finePointer) {
    document.querySelectorAll(".tile").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 7;
        const rotateX = (0.5 - y) * 7;
        card.style.setProperty("--mx", (x * 100) + "%");
        card.style.setProperty("--my", (y * 100) + "%");
        card.style.transform = "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }
})();
