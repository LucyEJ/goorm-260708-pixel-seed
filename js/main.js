(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STORAGE_LANG = "pixel-seed-lang";
  const STORAGE_THEME = "pixel-seed-theme";
  const SUPPORTED_LANGS = ["ko", "en", "ja"];

  /* ===== i18n ===== */
  let currentLang = document.documentElement.lang || "ko";
  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = "ko";

  function t(key) {
    const dict = (window.PIXEL_SEED_I18N && window.PIXEL_SEED_I18N[currentLang]) || {};
    const fallback = (window.PIXEL_SEED_I18N && window.PIXEL_SEED_I18N.ko) || {};
    return dict[key] != null ? dict[key] : fallback[key] != null ? fallback[key] : key;
  }

  function applyLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    try {
      localStorage.setItem(STORAGE_LANG, lang);
    } catch (e) {}

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(key);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(key));
    });

    document.querySelectorAll("[data-i18n-content]").forEach((el) => {
      const key = el.getAttribute("data-i18n-content");
      if (key) el.setAttribute("content", t(key));
    });

    document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    syncNavToggleLabel();
    syncThemeToggleLabel();
  }

  /* ===== Theme ===== */
  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncThemeToggleLabel() {
    const themeToggle = document.querySelector("[data-theme-toggle]");
    if (!themeToggle) return;
    const isDark = getTheme() === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? t("themeToLight") : t("themeToDark"));
  }

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_THEME, next);
    } catch (e) {}
    syncThemeToggleLabel();
  }

  function toggleTheme() {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  }

  /* ===== Mobile Navigation ===== */
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  function syncNavToggleLabel() {
    if (!navToggle || !siteNav) return;
    const isOpen = siteNav.classList.contains("is-open");
    navToggle.setAttribute("aria-label", isOpen ? t("menuClose") : t("menuOpen"));
  }

  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  const themeToggleBtn = document.querySelector("[data-theme-toggle]");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Apply after nav refs exist — syncNavToggleLabel closes over navToggle/siteNav
  applyLanguage(currentLang);
  applyTheme(getTheme());

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      syncNavToggleLabel();
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        syncNavToggleLabel();
      });
    });
  }

  /* ===== Smooth Scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* ===== Coming Soon Modal ===== */
  const modal = document.getElementById("coming-soon-modal");
  const openButtons = document.querySelectorAll('[data-open-modal="coming-soon"]');
  const closeButton = document.querySelector("[data-close-modal]");
  let previouslyFocused = null;

  function getFocusableElements(container) {
    return container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openModal() {
    if (!modal) return;
    previouslyFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const focusable = getFocusableElements(modal);
    if (focusable.length) focusable[0].focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
    }
  }

  openButtons.forEach((btn) => btn.addEventListener("click", openModal));
  if (closeButton) closeButton.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = Array.from(getFocusableElements(modal));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ===== Scroll Reveal ===== */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ===== Art Rotator ===== */
  const rotator = document.querySelector(".art-rotator");
  if (rotator) {
    const slides = rotator.querySelectorAll(".art-rotator__slide");
    const dots = rotator.querySelectorAll(".art-rotator__dot");
    let currentSlide = 0;
    let rotatorInterval = null;

    function goToSlide(index) {
      currentSlide = index;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", String(i === index));
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.slideTo);
        goToSlide(index);
        resetRotatorInterval();
      });
    });

    function startRotatorInterval() {
      if (prefersReducedMotion) return;
      rotatorInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
      }, 4000);
    }

    function resetRotatorInterval() {
      if (rotatorInterval) clearInterval(rotatorInterval);
      startRotatorInterval();
    }

    startRotatorInterval();
  }

  /* ===== Evolution Strip Highlight ===== */
  const evolutionStrip = document.querySelector(".evolution-strip");
  if (evolutionStrip && !prefersReducedMotion) {
    const steps = evolutionStrip.querySelectorAll(".evolution-step");
    let highlightIndex = 0;
    let highlightInterval = null;

    function highlightStep(index) {
      steps.forEach((step, i) => {
        step.classList.toggle("is-highlighted", i === index);
      });
    }

    function startHighlightInterval() {
      highlightInterval = setInterval(() => {
        highlightIndex = (highlightIndex + 1) % steps.length;
        highlightStep(highlightIndex);
      }, 2000);
    }

    const stripObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            highlightStep(0);
            startHighlightInterval();
          } else if (highlightInterval) {
            clearInterval(highlightInterval);
            highlightInterval = null;
            steps.forEach((step) => step.classList.remove("is-highlighted"));
          }
        });
      },
      { threshold: 0.3 }
    );

    stripObserver.observe(evolutionStrip);
  }
})();
