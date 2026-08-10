(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header interactions */
  const header = document.querySelector(".lp-header");
  const toggle = document.getElementById("isToggle");

  const syncHeaderOffset = () => {
    if (!header) return;
    document.documentElement.style.setProperty(
      "--lp-header-h",
      `${header.offsetHeight}px`,
    );
  };
  syncHeaderOffset();
  window.addEventListener("resize", syncHeaderOffset, { passive: true });

  const closeHeaderMenu = () => {
    if (!header) return;
    header.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    syncHeaderOffset();
  };

  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      /* Menu dropdown overlays content; keep offset as closed bar height */
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    },
    { passive: true },
  );

  /* Map existing .reveal blocks → AOS attributes */
  const setAos = (el, animation, extras = {}) => {
    if (!el || el.hasAttribute("data-aos")) return;
    el.setAttribute("data-aos", animation);
    Object.entries(extras).forEach(([k, v]) => {
      el.setAttribute(`data-aos-${k}`, String(v));
    });
  };

  const aosBase = {
    duration: 820,
    easing: "ease-out-cubic",
  };

  document.querySelectorAll(".reveal").forEach((el) => {
    /* Avoid fade-left/right — they translateX and cause mobile horizontal overflow */
    let anim = "fade-up";
    if (el.classList.contains("reveal-scale")) anim = "zoom-in";

    let delay = 0;
    if (el.classList.contains("reveal-delay-1")) delay = 100;
    if (el.classList.contains("reveal-delay-2")) delay = 180;
    if (el.classList.contains("reveal-delay-3")) delay = 260;
    if (el.classList.contains("reveal-delay-4")) delay = 340;
    if (el.classList.contains("reveal-delay-5")) delay = 420;

    setAos(el, anim, {
      ...aosBase,
      ...(delay ? { delay } : {}),
    });
  });

  const staggerParents = [
    ".lp-proof-grid",
    ".lp-day-sessions",
    ".lp-gifts-list",
    ".lp-gifts-finale",
    ".lp-compare-grid",
    ".lp-offer-meta",
    ".lp-why-list",
    ".promise-stats",
    ".lp-offer-list",
    ".lp-check-list",
    ".lp-urgency-list",
    ".lp-agenda",
  ];
  staggerParents.forEach((sel) => {
    document.querySelectorAll(sel).forEach((parent) => {
      [...parent.children].forEach((child, i) => {
        setAos(child, "fade-up", {
          ...aosBase,
          duration: 760,
          delay: Math.min(i * 100, 500),
        });
      });
    });
  });

  document
    .querySelectorAll(
      ".lp-coach-media, .lp-form-media, .lp-model-media, .lp-coach-copy, .lp-form-panel, .lp-model-copy, .lp-letter, .lp-truth-copy, .lp-truth-outcome, .lp-side-img, .lp-compare-media, .lp-urgency-aside, .lp-urgency-main",
    )
    .forEach((el) => setAos(el, "fade-up", { ...aosBase, duration: 900 }));

  document
    .querySelectorAll(
      ".lp-gifts-value, .lp-offer-box, .lp-form-card, .lp-gifts-cta, .lp-gift, .lp-gift-bonus",
    )
    .forEach((el) => setAos(el, "zoom-in", { ...aosBase, duration: 780 }));

  document
    .querySelectorAll(
      ".lp-curriculum-head, .lp-gifts-head, .lp-compare-head, .lp-offer-head, .lp-model-head, .lp-urgency-title, .cta-band, .section-title, .lp-form-head, .footer .container",
    )
    .forEach((el) => setAos(el, "fade-up", aosBase));

  /* Hero entrance — staggered rise */
  setAos(document.querySelector(".lp-hero-hook"), "fade-up", {
    ...aosBase,
    duration: 700,
    delay: 40,
  });
  setAos(document.querySelector(".lp-hero h1"), "fade-up", {
    ...aosBase,
    duration: 850,
    delay: 120,
  });
  document
    .querySelectorAll(".lp-hero-lead")
    .forEach((el, i) =>
      setAos(el, "fade-up", { ...aosBase, duration: 720, delay: 200 + i * 70 }),
    );
  setAos(document.querySelector(".lp-hero-actions"), "fade-up", {
    ...aosBase,
    duration: 720,
    delay: 320,
  });
  setAos(document.querySelector(".lp-hero-visual"), "zoom-in", {
    ...aosBase,
    duration: 1000,
    delay: 180,
  });

  /* Catch remaining section blocks without AOS */
  document.querySelectorAll("main .section .container > *").forEach((el) => {
    if (el.hasAttribute("data-aos")) return;
    if (el.querySelector("[data-aos]")) return;
    setAos(el, "fade-up", aosBase);
  });

  if (typeof AOS !== "undefined" && !reduced) {
    AOS.init({
      once: true,
      offset: 72,
      duration: 820,
      easing: "ease-out-cubic",
      anchorPlacement: "top-bottom",
      disableMutationObserver: false,
    });
  }

  /* Subtle hero parallax (desktop only) */
  const heroVisual = document.querySelector(".lp-hero-visual img");
  if (
    heroVisual &&
    !reduced &&
    window.matchMedia("(min-width: 992px)").matches
  ) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = Math.min(window.scrollY * 0.08, 36);
          heroVisual.style.translate = `0 ${y}px`;
          ticking = false;
        });
      },
      { passive: true },
    );
  }

  /* Number rise for promise stats when in view */
  const stats = document.querySelectorAll(".promise-stats .item strong");
  if (stats.length && !reduced && "IntersectionObserver" in window) {
    const animateValue = (el) => {
      const raw = el.textContent.trim();
      const numMatch = raw.match(/[\d.]+/);
      if (!numMatch) {
        el.classList.add("is-counted");
        return;
      }
      const targetStr = numMatch[0];
      const target = parseFloat(targetStr.replace(/\./g, ""));
      if (!Number.isFinite(target) || target <= 0 || target > 1e9) {
        el.classList.add("is-counted");
        return;
      }
      /* Only animate small headline numbers (2 ngày, 9 suất), not money */
      if (target > 100) {
        el.classList.add("is-counted");
        return;
      }
      const suffix = raw.slice(raw.indexOf(targetStr) + targetStr.length);
      const prefix = raw.slice(0, raw.indexOf(targetStr));
      const duration = 900;
      const start = performance.now();
      const frame = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(frame);
        else {
          el.textContent = raw;
          el.classList.add("is-counted");
        }
      };
      requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateValue(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.55 },
    );
    stats.forEach((el) => io.observe(el));
  }

  const sticky = document.querySelector(".sticky-cta");
  const hero = document.querySelector("#home");
  if (sticky && hero) {
    const isMobile = () => window.matchMedia("(max-width: 767.98px)").matches;
    const toggleSticky = () => {
      const show = isMobile() && window.scrollY > hero.offsetHeight * 0.55;
      sticky.classList.toggle("show", show);
      document.body.classList.toggle("has-sticky", show);
    };
    toggleSticky();
    window.addEventListener("scroll", toggleSticky, { passive: true });
    window.addEventListener("resize", toggleSticky, { passive: true });
  }

  const modal = document.getElementById("modal-register");
  const modalFormView = modal?.querySelector('[data-modal-view="form"]');
  const modalSuccessView = modal?.querySelector('[data-modal-view="success"]');
  const modalForm = modal?.querySelector(".js-register-form");

  const showModalForm = () => {
    if (modalFormView) modalFormView.hidden = false;
    if (modalSuccessView) modalSuccessView.hidden = true;
  };

  const showModalSuccess = () => {
    if (modalFormView) modalFormView.hidden = true;
    if (modalSuccessView) modalSuccessView.hidden = false;
  };

  const openModal = () => {
    if (!modal) return;
    closeLightbox();
    closeHeaderMenu();
    showModalForm();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lp-modal-open");
    const first = modal.querySelector(
      '[data-modal-view="form"]:not([hidden]) input, [data-modal-view="form"]:not([hidden]) button',
    );
    if (first) first.focus({ preventScroll: true });
  };
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lp-modal-open");
    showModalForm();
    if (modalForm) modalForm.reset();
  };

  document.querySelectorAll(".js-open-register").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modal) {
    modal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
  }

  /* Proof image lightbox */
  const lightbox = document.getElementById("lp-lightbox");
  const lightboxImg = lightbox?.querySelector(".lp-lightbox-img");
  const lightboxCap = lightbox?.querySelector(".lp-lightbox-cap");
  const proofZooms = Array.from(document.querySelectorAll(".lp-proof-zoom"));
  let lightboxIndex = 0;

  const showLightboxImage = (index) => {
    if (!lightbox || !lightboxImg || !proofZooms.length) return;
    lightboxIndex = (index + proofZooms.length) % proofZooms.length;
    const img = proofZooms[lightboxIndex].querySelector("img");
    if (!img) return;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    if (lightboxCap) {
      lightboxCap.textContent = img.alt || "";
    }
  };

  const openLightbox = (index) => {
    if (!lightbox) return;
    closeModal();
    closeHeaderMenu();
    showLightboxImage(index);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lp-modal-open");
    lightbox
      .querySelector(".lp-lightbox-close")
      ?.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImg) lightboxImg.removeAttribute("src");
    if (!modal || modal.hidden) {
      document.body.classList.remove("lp-modal-open");
    }
  };

  proofZooms.forEach((btn, index) => {
    btn.addEventListener("click", () => openLightbox(index));
  });

  if (lightbox) {
    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });
    lightbox
      .querySelector(".lp-lightbox-prev")
      ?.addEventListener("click", () => {
        showLightboxImage(lightboxIndex - 1);
      });
    lightbox
      .querySelector(".lp-lightbox-next")
      ?.addEventListener("click", () => {
        showLightboxImage(lightboxIndex + 1);
      });
  }

  document.addEventListener("keydown", (e) => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === "Escape") {
        closeLightbox();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showLightboxImage(lightboxIndex - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        showLightboxImage(lightboxIndex + 1);
      }
      return;
    }
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  document.querySelectorAll(".js-register-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.reset();
      showModalSuccess();
      modalSuccessView
        ?.querySelector("button, [data-close-modal]")
        ?.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#" || id === "#modal-register") return;
      if (link.classList.contains("js-open-register")) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeHeaderMenu();
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* Back to top */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    const syncBackToTop = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    };
    syncBackToTop();
    window.addEventListener("scroll", syncBackToTop, { passive: true });
  }
})();
