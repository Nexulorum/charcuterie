
// Footer year 
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Image rotator
document.querySelectorAll("[data-rotator]").forEach((rotator) => {
  const slides = Array.from(rotator.querySelectorAll(".rotator-img"));
  let i = slides.findIndex(s => s.classList.contains("is-active"));
  if (i < 0) i = 0;

  setInterval(() => {
    slides[i].classList.remove("is-active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-active");
  }, 3500);
});
//photo scroll 
(() => {
  const bands = document.querySelectorAll("[data-parallax]");
  if (!bands.length) return;

  const speed = 0.18; // 0.10–0.25 subtle range

  const update = () => {
    const vh = window.innerHeight;

    bands.forEach((band) => {
      const rect = band.getBoundingClientRect();
      const img = band; // the ::before is what moves, but we set CSS variable on band
      const center = rect.top + rect.height / 2;
      const delta = (center - vh / 2) * speed;

      band.style.setProperty("--parallaxY", `${-delta}px`);
    });
  };

  // Use a CSS variable to control ::before transform
  const style = document.createElement("style");
  style.textContent = `
    [data-parallax]::before { transform: translate3d(0, var(--parallaxY, 0px), 0); }
  `;
  document.head.appendChild(style);

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
})();


//toggle switch

(() => {
  const root = document.querySelector(".gc-order");
  if (!root) return;

  const tabs = root.querySelectorAll(".gc-tab");
  const panels = root.querySelectorAll(".gc-rows");

  root.querySelector(".gc-toggle").addEventListener("click", (e) => {
    const btn = e.target.closest(".gc-tab");
    if (!btn) return;

    const mode = btn.dataset.mode;

    tabs.forEach(t => {
      const active = t.dataset.mode === mode;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(p => p.hidden = p.dataset.panel !== mode);
  });
})();



// Hamburger mobile menu (bulletproof minimal)
(() => {
  const btn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };

  // Force initial closed state every load
  setOpen(false);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (menu.hidden) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Close after clicking a link
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // If user resizes to desktop, force close
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) setOpen(false);
  });
})();
