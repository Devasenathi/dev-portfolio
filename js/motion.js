/**
 * ==========================================================================
 * MOTION SYSTEM (Calm and Minimal)
 * Quiet, confident motion that supports reading and never asks for attention.
 * Can be switched off completely in one step by removing this script.
 * ==========================================================================
 */

(function () {
  'use strict';

  // 1. Enable JS-only motion starting states (guarantees full visibility without JS)
  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initSiteIntro();
    initScrollRevealObserver();
    initStickyHeaderScroll();
    initModalTransitions();
  });

  /* ==========================================================================
     0. SITE INTRO ANIMATION (3 to 4s Animated Intro matching Neo-Retro theme)
     ========================================================================== */
  function initSiteIntro() {
    const overlay = document.getElementById('site-intro-overlay');
    if (!overlay) {
      initPageLoadMotion();
      return;
    }

    if (prefersReducedMotion) {
      overlay.style.display = 'none';
      initPageLoadMotion();
      return;
    }

    const skipBtn = document.getElementById('intro-skip-btn');
    const counterEl = document.getElementById('intro-counter-number');
    const progressFill = document.getElementById('intro-progress-fill');
    const statusEl = document.getElementById('intro-status-phrase');
    const replayBtn = document.getElementById('replay-intro-btn');

    let isDismissed = false;
    let animFrameId = null;
    const totalDuration = 3400; // 3.4s runtime (comfortably within 3 to 4 seconds)
    let startTime = performance.now();

    const stages = [
      { at: 0, text: 'Initializing Design Archive...' },
      { at: 750, text: 'Curating Brand Systems...' },
      { at: 1600, text: 'Loading Tamil–English Typography...' },
      { at: 2450, text: 'System Calibrated // Ready' }
    ];

    function dismissIntro() {
      if (isDismissed) return;
      isDismissed = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);

      overlay.classList.add('intro-hidden');

      // Trigger hero entrance right as curtain lifts
      setTimeout(() => {
        initPageLoadMotion();
      }, 150);

      setTimeout(() => {
        overlay.style.display = 'none';
      }, 700);
    }

    function loop(now) {
      if (isDismissed) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (totalDuration - 500), 1);
      const percent = Math.round(progress * 100);

      if (counterEl) counterEl.textContent = `${percent.toString().padStart(2, '0')}%`;
      if (progressFill) progressFill.style.width = `${percent}%`;

      const currentStage = stages.slice().reverse().find(s => elapsed >= s.at);
      if (currentStage && statusEl && statusEl.textContent !== currentStage.text) {
        statusEl.textContent = currentStage.text;
      }

      if (elapsed >= totalDuration) {
        dismissIntro();
      } else {
        animFrameId = requestAnimationFrame(loop);
      }
    }

    animFrameId = requestAnimationFrame(loop);

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dismissIntro();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !isDismissed) {
        dismissIntro();
      }
    });
  }

  /* ==========================================================================
     1. PAGE LOAD ANIMATIONS (Plays once on first paint, total intro < 800ms)
     ========================================================================== */
  function initPageLoadMotion() {
    if (prefersReducedMotion) {
      revealAllImmediately();
      return;
    }

    // Trigger on next animation frame after paint
    requestAnimationFrame(() => {
      // Reveal Header
      const header = document.querySelector('header');
      if (header) {
        header.classList.add('motion-fade', 'is-revealed');
      }

      // Reveal Hero items with staggered rise
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        const heroElements = heroContent.querySelectorAll('.motion-rise');
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, index * 70); // 70ms stagger
        });
      }

      // Reveal Hero Portrait (slow fade, no movement)
      const heroImages = document.querySelectorAll('.hero-visual-col .motion-image');
      heroImages.forEach((heroImage, index) => {
        setTimeout(() => {
          heroImage.classList.add('is-revealed');
        }, 140 + index * 40);
      });
    });
  }

  /* ==========================================================================
     2. SCROLL REVEAL OBSERVER (IntersectionObserver, threshold: 0.15, plays once)
     ========================================================================== */
  function initScrollRevealObserver() {
    if (prefersReducedMotion) return;

    if (!('IntersectionObserver' in window)) {
      revealAllImmediately();
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          // If it's a stagger group (cards, tiles, timeline)
          if (target.classList.contains('motion-stagger')) {
            const items = target.children;
            const maxStagger = Math.min(items.length, 6);

            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              const delay = i < maxStagger ? i * 70 : maxStagger * 70;
              setTimeout(() => {
                item.classList.add('is-revealed');
              }, delay);
            }
            target.classList.add('is-revealed');
          } else {
            // Single heading, card, or image
            target.classList.add('is-revealed');
          }

          // Stop watching once revealed (plays strictly once)
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe all scroll elements
    const scrollElements = document.querySelectorAll(
      '.section-heading-block.motion-rise, .motion-stagger, .project-card.motion-rise, .about-card.motion-rise, .contact-card-main.motion-rise, .project-visual-frame img.motion-image, .about-photo-wrapper img.motion-image'
    );

    scrollElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================================================
     3. STICKY HEADER SCROLL STATE (Passive RAF scroll listener)
     ========================================================================== */
  function initStickyHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;
    const threshold = 24;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > threshold) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    onScroll();
  }

  /* ==========================================================================
     4. MODAL TRANSITIONS (Smooth height, opacity, and scale transitions)
     ========================================================================== */
  function initModalTransitions() {
    const modals = document.querySelectorAll('.modal-overlay');

    modals.forEach(modal => {
      const closeButtons = modal.querySelectorAll('.modal-close-btn');

      closeButtons.forEach(btn => {
        // Intercept close for clean fast exit animation
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          closeModalWithTransition(modal);
        });
      });

      // Overlay click to close
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModalWithTransition(modal);
        }
      });
    });

    // Escape key handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          closeModalWithTransition(activeModal);
        }
      }
    });
  }

  function closeModalWithTransition(modal) {
    if (!modal || !modal.classList.contains('active')) return;

    if (prefersReducedMotion) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      return;
    }

    modal.classList.add('is-closing');
    setTimeout(() => {
      modal.classList.remove('active', 'is-closing');
      document.body.style.overflow = '';
    }, 160); // matches --duration-fast
  }

  /* ==========================================================================
     REDUCED MOTION / FALLBACK HELPER
     ========================================================================== */
  function revealAllImmediately() {
    const elements = document.querySelectorAll('.motion-fade, .motion-rise, .motion-image, .motion-stagger');
    elements.forEach(el => {
      el.classList.add('is-revealed');
      if (el.children) {
        Array.from(el.children).forEach(child => child.classList.add('is-revealed'));
      }
    });
  }

})();
