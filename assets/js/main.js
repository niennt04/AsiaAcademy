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
    if (!el) return;
    el.setAttribute("data-aos", animation);
    Object.entries(extras).forEach(([k, v]) => {
      el.setAttribute(`data-aos-${k}`, String(v));
    });
  };

  document.querySelectorAll(".reveal").forEach((el) => {
    /* Avoid fade-left/right — they translateX and cause mobile horizontal overflow */
    let anim = "fade-up";
    if (el.classList.contains("reveal-scale")) anim = "zoom-in";

    let delay = 0;
    if (el.classList.contains("reveal-delay-1")) delay = 80;
    if (el.classList.contains("reveal-delay-2")) delay = 160;
    if (el.classList.contains("reveal-delay-3")) delay = 240;
    if (el.classList.contains("reveal-delay-4")) delay = 320;
    if (el.classList.contains("reveal-delay-5")) delay = 400;

    setAos(el, anim, {
      duration: 750,
      easing: "ease-out-cubic",
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
  ];
  staggerParents.forEach((sel) => {
    document.querySelectorAll(sel).forEach((parent) => {
      [...parent.children].forEach((child, i) => {
        setAos(child, "fade-up", {
          duration: 700,
          easing: "ease-out-cubic",
          delay: i * 90,
        });
      });
    });
  });

  document
    .querySelectorAll(
      ".lp-coach-media, .lp-form-media, .lp-model-media, .lp-coach-copy, .lp-form-panel, .lp-model-copy",
    )
    .forEach((el) =>
      setAos(el, "fade-up", { duration: 800, easing: "ease-out-cubic" }),
    );
  document
    .querySelectorAll(".lp-gifts-value, .lp-offer-box, .lp-form-card")
    .forEach((el) =>
      setAos(el, "zoom-in", { duration: 700, easing: "ease-out-cubic" }),
    );

  document
    .querySelectorAll(
      ".lp-curriculum-head, .lp-gifts-head, .lp-compare-head, .lp-offer-head, .lp-model-head, .lp-urgency-title, .cta-band",
    )
    .forEach((el) =>
      setAos(el, "fade-up", { duration: 750, easing: "ease-out-cubic" }),
    );

  setAos(document.querySelector(".lp-hero .lp-brand"), "fade-up", {
    duration: 650,
  });
  setAos(document.querySelector(".lp-hero-hook"), "fade-up", {
    duration: 650,
    delay: 60,
  });
  setAos(document.querySelector(".lp-hero h1"), "fade-up", {
    duration: 750,
    delay: 120,
  });
  document
    .querySelectorAll(".lp-hero-lead")
    .forEach((el, i) =>
      setAos(el, "fade-up", { duration: 650, delay: 180 + i * 60 }),
    );
  setAos(document.querySelector(".lp-hero-actions"), "fade-up", {
    duration: 650,
    delay: 280,
  });
  setAos(document.querySelector(".lp-hero-visual"), "fade-up", {
    duration: 900,
    delay: 160,
  });

  if (typeof AOS !== "undefined" && !reduced) {
    AOS.init({
      once: true,
      offset: 80,
      duration: 700,
      easing: "ease-out-cubic",
    });
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
  const openModal = () => {
    if (!modal) return;
    closeHeaderMenu();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lp-modal-open");
    const first = modal.querySelector("input, button");
    if (first) first.focus({ preventScroll: true });
  };
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lp-modal-open");
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
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  document.querySelectorAll(".js-register-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Cảm ơn bạn! Vé miễn phí sẽ được gửi — hãy nối form với Zalo/CRM thật.",
      );
      form.reset();
      closeModal();
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
