(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== Mobile Navigation ===== */
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "메뉴 열기");
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
