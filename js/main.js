
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


//dilivery pick up selector
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".gc-tab");
  const panels = document.querySelectorAll("[data-panel]");
  const actionButtons = document.querySelectorAll(".gc-row[data-action]");
  const continueBtn = document.getElementById("gcContinueBtn");

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const mode = tab.dataset.mode;

      tabs.forEach((btn) => {
        const active = btn === tab;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });

      panels.forEach((panel) => {
        const match = panel.dataset.panel === mode;
        panel.hidden = !match;
        panel.classList.toggle("is-active", match);

        // close inline panels inside inactive tab
        if (!match) {
          panel.querySelectorAll(".gc-inline-panel").forEach((inline) => {
            inline.hidden = true;
          });
        }
      });
    });
  });

  // Inline panel toggles
  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const target = document.querySelector(`[data-inline="${action}"]`);
      if (!target) return;

      target.hidden = !target.hidden;
    });
  });

  // Continue button: pass data to order page
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      const activeTab = document.querySelector(".gc-tab.is-active");
      const mode = activeTab ? activeTab.dataset.mode : "delivery";

      const params = new URLSearchParams();
      params.set("order_type", mode);

      if (mode === "delivery") {
        params.set("street", document.getElementById("deliveryStreet")?.value || "");
        params.set("city", document.getElementById("deliveryCity")?.value || "");
        params.set("state", document.getElementById("deliveryState")?.value || "");
        params.set("zip", document.getElementById("deliveryZip")?.value || "");
        params.set("date", document.getElementById("deliveryDate")?.value || "");
        params.set("time", document.getElementById("deliveryTime")?.value || "");
        params.set("notes", document.getElementById("deliveryNotes")?.value || "");
      } else {
        params.set("pickup_location", "123 Example Street, St. Louis, MO 63101");
        params.set("date", document.getElementById("pickupDate")?.value || "");
        params.set("time", document.getElementById("pickupTime")?.value || "");
        params.set("notes", document.getElementById("pickupNotes")?.value || "");
      }

      window.location.href = `order.html?${params.toString()}`;
    });
  }
});

// prefill the order page 
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const orderType = params.get("order_type");
  const date = params.get("date");
  const time = params.get("time");
  const notes = params.get("notes");

  const orderTypeField = document.querySelector('select[name="order_type"]');
  const logisticsNotes = document.querySelector('input[name="logistics_notes"]');
  const extraNotes = document.querySelector('input[name="extra_notes"]');

  if (orderTypeField && orderType) {
    orderTypeField.value = orderType;
  }

  let logistics = "";

  if (orderType === "delivery") {
    const street = params.get("street") || "";
    const city = params.get("city") || "";
    const state = params.get("state") || "";
    const zip = params.get("zip") || "";

    const address = [street, city, state, zip].filter(Boolean).join(", ");
    if (address) logistics += `Delivery address: ${address}. `;
  }

  if (orderType === "pickup") {
    const pickupLocation = params.get("pickup_location") || "";
    if (pickupLocation) logistics += `Pickup location: ${pickupLocation}. `;
  }

  if (date) logistics += `Preferred date: ${date}. `;
  if (time) logistics += `Preferred time: ${time}. `;

  if (logisticsNotes && logistics) {
    logisticsNotes.value = logistics.trim();
  }

  if (extraNotes && notes) {
    extraNotes.value = notes;
  }
});


//==========
//gallery page 
//===========
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-gallery-slider]");
  if (!slider) return;

  const track = slider.querySelector(".gallery-slider-track");
  const slides = Array.from(slider.querySelectorAll(".gallery-slide"));
  const prevBtn = slider.querySelector(".gallery-arrow-prev");
  const nextBtn = slider.querySelector(".gallery-arrow-next");
  const dotsWrap = document.querySelector("[data-gallery-dots]");

  let currentIndex = 0;
  let autoRotate;

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot" + (index === currentIndex ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(index);
        restartAutoRotate();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    if (dotsWrap) {
      const dots = dotsWrap.querySelectorAll(".gallery-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoRotate() {
    autoRotate = setInterval(nextSlide, 6000);
  }

  function stopAutoRotate() {
    clearInterval(autoRotate);
  }

  function restartAutoRotate() {
    stopAutoRotate();
    startAutoRotate();
  }

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    restartAutoRotate();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    restartAutoRotate();
  });

  slider.addEventListener("mouseenter", stopAutoRotate);
  slider.addEventListener("mouseleave", startAutoRotate);

  renderDots();
  updateSlider();
  startAutoRotate();
});


//==============================
// premium page motion
//==============================
document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(
    ".hero .container, .card, .board-card, .grazing-card, .addon-card, .callout, .about-owner-photo, .gallery-slider, .section-heading, .section-title, .section-subtitle"
  );

  if (!revealItems.length) return;

  revealItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => observer.observe(item));
});


//==============================
// premium header shadow
//==============================
(() => {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  const updateHeader = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();


//==============================
// premium form focus
//==============================
document.addEventListener("DOMContentLoaded", () => {
  const fields = document.querySelectorAll(".field input, .field select");

  fields.forEach((field) => {
    field.addEventListener("focus", () => {
      field.closest(".field")?.classList.add("is-focused");
    });

    field.addEventListener("blur", () => {
      field.closest(".field")?.classList.remove("is-focused");
    });
  });
});