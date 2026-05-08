// ProjectHome.sg — site interactions (vanilla JS, no build step)

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(links.classList.contains('open')));
    });
  }

  // Lead form: client-side validation + open user's mail client with mailto:
  // submissions are routed to projecthome.sg@gmail.com
  var form = document.querySelector('#lead-form');
  if (form) {
    var success = form.querySelector('.form-success');

    var fieldValue = function (name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? (el.value || '').trim() : '';
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailInput = form.querySelector('[name="email"]');
      var email = emailInput ? emailInput.value.trim() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailInput) emailInput.focus();
        return;
      }

      var name = fieldValue('name');
      var phone = fieldValue('phone');
      var interest = fieldValue('interest');
      var timeline = fieldValue('timeline');
      var message = fieldValue('message');
      var updatesEl = form.querySelector('[name="updates"]');
      var wantsUpdates = updatesEl ? updatesEl.checked : false;

      // Subscribe-variant form has no name/message field
      var isSubscribe = !form.querySelector('[name="name"]') && !form.querySelector('[name="message"]');

      var subject;
      var bodyLines = [];

      if (isSubscribe) {
        subject = 'New newsletter subscription — ProjectHome.sg';
        bodyLines.push('New subscription submitted via the website.');
        bodyLines.push('');
        bodyLines.push('Email: ' + email);
        if (interest) bodyLines.push('Most interested in: ' + interest);
        bodyLines.push('Wants updates: ' + (wantsUpdates ? 'Yes' : 'No'));
      } else {
        subject = 'New enquiry from ProjectHome.sg' + (name ? ' — ' + name : '');
        bodyLines.push('New enquiry submitted via the website.');
        bodyLines.push('');
        if (name) bodyLines.push('Name: ' + name);
        bodyLines.push('Email: ' + email);
        if (phone) bodyLines.push('Phone: ' + phone);
        if (interest) bodyLines.push('Interested in: ' + interest);
        if (timeline) bodyLines.push('Timeline: ' + timeline);
        bodyLines.push('Wants updates: ' + (wantsUpdates ? 'Yes' : 'No'));
        if (message) {
          bodyLines.push('');
          bodyLines.push('Message:');
          bodyLines.push(message);
        }
      }

      bodyLines.push('');
      bodyLines.push('---');
      bodyLines.push('Sent from https://projecthome.sg/');

      var body = bodyLines.join('\n');
      var mailtoUrl =
        'mailto:projecthome.sg@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      // Open the user's email client. Some browsers block top-level
      // navigation to mailto: from a script outside a click handler —
      // we're inside the submit handler so this is allowed.
      window.location.href = mailtoUrl;

      if (success) {
        success.classList.add('show');
        success.innerHTML =
          'Your email client should now open with your enquiry pre-filled — please click <strong>Send</strong> to deliver it. ' +
          'If nothing opened (some desktops without a default mail client), please WhatsApp <strong>+65 8282 2486</strong> instead.';
      }
      form.reset();
      window.setTimeout(function () {
        if (success) success.classList.remove('show');
      }, 12000);
    });
  }

  // Blog category filter
  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = document.querySelectorAll('.post-card[data-category]');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var filter = chip.getAttribute('data-filter');
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          card.style.display = filter === 'all' || cat === filter ? '' : 'none';
        });
      });
    });
  }

  // Reveal-on-scroll
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    var revealEls = document.querySelectorAll(
      '.feature-card, .step, .post-card, .testimonial-card, .faq-item'
    );
    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(el);
    });
  }

  // Animated counters
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var animate = function (el) {
      var target = parseInt(el.getAttribute('data-counter') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }
      var duration = 1400;
      var startTime = performance.now();
      var tick = function (now) {
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      var counterObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animate(entry.target);
              counterObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { counterObs.observe(el); });
    } else {
      counters.forEach(animate);
    }
  }

  // FAQ accordion: only one open at a time per list
  document.querySelectorAll('.faq-list').forEach(function (list) {
    var items = list.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item && other.open) other.open = false;
          });
        }
      });
    });
  });
})();
