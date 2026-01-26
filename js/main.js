//Footer year
document.getElementById("year").textContent = new Date().getFullYear();
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