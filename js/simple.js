/**
 * Simple landing page (index.html) — minimal JS only
 * Edit video poster toggle: USE_POSTER_ON_MOBILE below
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const USE_POSTER_ON_MOBILE = false;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Hero video (shared assets with home.html) --- */
  const hero = document.querySelector('.simple-hero');
  const video = document.querySelector('.simple-hero__video');

  function initVideoMode() {
    if (!hero) return;
    const usePoster = USE_POSTER_ON_MOBILE && window.innerWidth < 768;
    hero.classList.toggle('simple-hero--poster-only', usePoster);
    if (!video) return;
    if (usePoster) {
      video.pause();
      video.removeAttribute('autoplay');
    } else if (!video.hasAttribute('autoplay')) {
      video.setAttribute('autoplay', '');
      video.play().catch(() => {});
    }
  }

  initVideoMode();
  window.addEventListener('resize', () => {
    clearTimeout(window.__simpleResizeTimer);
    window.__simpleResizeTimer = setTimeout(initVideoMode, 250);
  });

  /* --- Smooth anchor scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.simple-hero__title, .reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('is-visible');
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function revealStart() {
    return window.innerWidth < 768 ? 'top 92%' : 'top 80%';
  }

  if (prefersReducedMotion) {
    gsap.set('.simple-hero__title', { opacity: 1, y: 0 });
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  } else {
    gsap.to('.simple-hero__title', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  }

  document.querySelectorAll('.reveal').forEach((el) => {
    if (prefersReducedMotion) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: () => revealStart(),
        toggleActions: 'play none none none',
      },
      onComplete: () => el.classList.add('is-visible'),
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
