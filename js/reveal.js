/**
 * Subtle scroll reveal for below-fold content blocks.
 * Hero (.hero-section) is intentionally excluded — keeps LCP clean.
 * Without this script (or with reduced motion), content stays fully visible.
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var targets = document.querySelectorAll(
    '#program .section-inner, #dresscode .section-inner, #gallery .section-inner'
  );
  if (!targets.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -6% 0px',
      threshold: 0.1
    }
  );

  var viewportBottom = window.innerHeight * 0.94;

  targets.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    // Already on screen — leave visible (no hide/flash)
    if (rect.top < viewportBottom && rect.bottom > 0) {
      return;
    }
    el.classList.add('reveal-ready');
    observer.observe(el);
  });
})();
