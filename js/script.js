/**
 * Frome Media & Design — Main Script
 * Dependencies: GSAP, ScrollTrigger, Lenis (loaded via CDN in home.html / work.html)
 *
 * To disable animations: users with prefers-reduced-motion get a static fallback.
 * To edit scroll animation timing: search for "REVEAL" and "HERO" sections below.
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Environment checks
     -------------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function getRevealStart(defaultDesktop = '80%') {
    return window.innerWidth < 768 ? 'top 92%' : `top ${defaultDesktop}`;
  }

  /* --------------------------------------------------------------------------
     Work page — render project cards from js/work-data.js
     -------------------------------------------------------------------------- */
  function renderWorkGrid() {
    const grid = document.getElementById('work-grid');
    if (!grid || typeof WORK_PROJECTS === 'undefined') return;

    grid.innerHTML = WORK_PROJECTS.map((project) => {
      const color = project.imageColor || 'blue';
      const mediaClass = `work-card__media--${color}`;
      const mediaContent = project.image
        ? `<img src="${project.image}" alt="" loading="lazy">`
        : '<span class="work-card__pattern" aria-hidden="true"></span>';

      return `
        <article class="work-card reveal">
          <div class="work-card__media ${mediaClass}">
            ${mediaContent}
          </div>
          <div class="work-card__body">
            <span class="work-card__tag">${project.category}</span>
            <h2 class="work-card__title">${project.title}</h2>
            <p class="work-card__status">${project.status}</p>
            <p class="work-card__text">${project.description}</p>
          </div>
        </article>
      `;
    }).join('');
  }

  renderWorkGrid();

  /* --------------------------------------------------------------------------
     Footer year
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------------------------------------------------------
     Mobile navigation
     -------------------------------------------------------------------------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  function closeMobileMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      navMenu.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* --------------------------------------------------------------------------
     Nav scroll state
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');
  /* --------------------------------------------------------------------------
     Hero video — mobile poster toggle
     Set true to show poster image only on viewports under 768px (no autoplay).
     Useful for testing performance/data on small devices.
     -------------------------------------------------------------------------- */
  const USE_POSTER_ON_MOBILE = false;

  const hero = document.getElementById('hero');
  const heroVideo = document.querySelector('.hero__video');

  function initHeroVideoMode() {
    if (!hero) return;
    const usePoster = USE_POSTER_ON_MOBILE && window.innerWidth < 768;

    hero.classList.toggle('hero--poster-only', usePoster);

    if (heroVideo) {
      if (usePoster) {
        heroVideo.pause();
        heroVideo.removeAttribute('autoplay');
      } else if (!heroVideo.hasAttribute('autoplay')) {
        heroVideo.setAttribute('autoplay', '');
        heroVideo.play().catch(() => {});
      }
    }
  }

  initHeroVideoMode();
  window.addEventListener('resize', debounce(initHeroVideoMode, 250));

  function updateNavState() {
    if (!siteHeader) return;
    const scrollY = window.scrollY;

    if (!hero) {
      siteHeader.classList.toggle('is-scrolled', scrollY > 20);
      siteHeader.classList.toggle('is-deep', scrollY > 280);
      return;
    }

    const heroBottom = hero.offsetHeight * 0.6;

    siteHeader.classList.toggle('is-scrolled', scrollY > 60);
    siteHeader.classList.toggle('is-deep', scrollY > heroBottom);
  }

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  /* --------------------------------------------------------------------------
     Smooth scroll — Lenis + ScrollTrigger sync
     -------------------------------------------------------------------------- */
  let lenis = null;

  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* Anchor links — same-page only; cross-page hashes handled by the browser */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     GSAP registration
     -------------------------------------------------------------------------- */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.hero__title .word, .hero__subhead, .hero__actions, .hero__scroll-hint').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* --------------------------------------------------------------------------
     Reduced motion fallback — make everything visible immediately
     -------------------------------------------------------------------------- */
  function showAllContent() {
    gsap.set('.hero__title .word, .hero__subhead, .hero__actions, .hero__scroll-hint', {
      opacity: 1,
      y: 0,
    });
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  if (prefersReducedMotion) {
    showAllContent();
  } else {
    /* --------------------------------------------------------------------------
       HERO — load-in animation (on page load, not scroll)
       -------------------------------------------------------------------------- */
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
      .to('.hero__title .word', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
      })
      .to('.hero__subhead', {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.4')
      .to('.hero__actions', {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.5')
      .to('.hero__scroll-hint', {
        opacity: 1,
        duration: 0.6,
      }, '-=0.2');
  }

  /* --------------------------------------------------------------------------
     HERO — cinematic scroll (scale + darken); skipped for reduced motion
     -------------------------------------------------------------------------- */
  if (!prefersReducedMotion && hero) {
    const videoWrap = document.querySelector('.hero__video-wrap');
    const scrimDarken = document.querySelector('.hero__scrim-darken');

    if (videoWrap) {
      gsap.to(videoWrap, {
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    if (scrimDarken) {
      gsap.to(scrimDarken, {
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  /* --------------------------------------------------------------------------
     SECTION REVEALS — fade/slide up at ~80% viewport
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal:not(.service-card):not(.work-card)');

  revealElements.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: () => getRevealStart(),
        toggleActions: 'play none none none',
      },
      onComplete: () => el.classList.add('is-visible'),
    });
  });

  /* Services cards — staggered grid reveal */
  ScrollTrigger.batch('.service-card.reveal', {
    start: () => (window.innerWidth < 768 ? 'top 92%' : 'top 85%'),
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
      });
    },
    once: true,
  });

  /* Work page cards — staggered grid reveal */
  ScrollTrigger.batch('.work-card.reveal', {
    start: () => (window.innerWidth < 768 ? 'top 92%' : 'top 85%'),
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
      });
    },
    once: true,
  });

  /* --------------------------------------------------------------------------
     DOODLES — stroke draw-on reveal (runs with or without reduced motion)
     -------------------------------------------------------------------------- */
  const doodleElements = document.querySelectorAll('.doodle');

  doodleElements.forEach((doodle, index) => {
    const paths = doodle.querySelectorAll('.doodle-path');

    paths.forEach((path) => {
      if (typeof path.getTotalLength !== 'function') return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    ScrollTrigger.create({
      trigger: doodle,
      start: () => (window.innerWidth < 768 ? 'top 94%' : 'top 88%'),
      once: true,
      onEnter: () => {
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: prefersReducedMotion ? 0.01 : 1.1,
          stagger: prefersReducedMotion ? 0 : 0.12,
          ease: 'power2.out',
          delay: prefersReducedMotion ? 0 : index * 0.1,
        });
      },
    });
  });

  /* --------------------------------------------------------------------------
     MAGNETIC BUTTONS — subtle cursor follow with spring-back
     -------------------------------------------------------------------------- */
  if (!isTouchDevice && !prefersReducedMotion) {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    const magneticStrength = 0.35;
    const magneticRadius = 80;

    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < magneticRadius) {
          gsap.to(btn, {
            x: deltaX * magneticStrength,
            y: deltaY * magneticStrength,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     CUSTOM CURSOR — dot + ring (desktop, non-touch only)
     -------------------------------------------------------------------------- */
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor__dot');
  const cursorRing = document.querySelector('.cursor__ring');

  if (cursor && cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
    document.body.classList.add('has-custom-cursor');
    cursor.classList.add('is-active');

    const cursorPos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
      cursorPos.x = e.clientX;
      cursorPos.y = e.clientY;

      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    });

    gsap.set([cursorDot, cursorRing], { xPercent: -50, yPercent: -50 });

    gsap.ticker.add(() => {
      ringPos.x += (cursorPos.x - ringPos.x) * 0.15;
      ringPos.y += (cursorPos.y - ringPos.y) * 0.15;

      gsap.set(cursorRing, { x: ringPos.x, y: ringPos.y });
    });

    const interactiveSelectors = 'a, button, .magnetic-btn, input, textarea, select';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    document.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
  }

  /* Refresh ScrollTrigger after fonts/images load and on resize */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  window.addEventListener('resize', debounce(() => ScrollTrigger.refresh(), 300));

})();
