// ProjectHome.sg - site interactions

(function () {
  'use strict';

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Lead form: client-side validation + simulated submit
  const form = document.querySelector('#lead-form');
  if (form) {
    const success = form.querySelector('.form-success');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('[name="email"]').value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.querySelector('[name="email"]').focus();
        return;
      }
      // In production wire this to a backend (Formspree, Netlify Forms, custom API).
      // For now we show the confirmation and reset the form.
      if (success) {
        success.classList.add('show');
        success.textContent = 'Thank you! Your message has been received. We will reach out within one business day.';
      }
      form.reset();
      setTimeout(() => success && success.classList.remove('show'), 6000);
    });
  }

  // Blog category filter
  const chips = document.querySelectorAll('.chip[data-filter]');
  const cards = document.querySelectorAll('.post-card[data-category]');
  if (chips.length && cards.length) {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        cards.forEach((card) => {
          const cat = card.dataset.category;
          card.style.display = filter === 'all' || cat === filter ? '' : 'none';
        });
      });
    });
  }

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal-on-scroll
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  if (observer && !prefersReducedMotion) {
    document.querySelectorAll('.feature-card, .step, .post-card, .testimonial-card, .faq-item').forEach((el) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Animated counters in hero
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animate = (el) => {
      const target = parseInt(el.dataset.counter, 10) || 0;
      const suffix = el.dataset.suffix || '';
      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1400;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach((el) => counterObs.observe(el));
    } else {
      counters.forEach(animate);
    }
  }

  // FAQ accordion: ensure only one open at a time within the same list
  const faqLists = document.querySelectorAll('.faq-list');
  faqLists.forEach((list) => {
    const items = list.querySelectorAll('.faq-item');
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item && other.open) other.open = false;
          });
        }
      });
    });
  });
})();
