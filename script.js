/* =========================================================
   Golden Fenix Renovations: page behaviour
   ---------------------------------------------------------
   Everything on the page works and is readable without this
   file. It only adds polish: the header background, scroll
   reveals, the expanding service panels, and the quote form.
   ========================================================= */

/* ---------------------------------------------------------
   FORM SETUP: paste your form service URL here.
   Example (Formspree): 'https://formspree.io/f/abcdwxyz'
   Leave it as '' and the form only shows the thank-you
   message (nothing is sent anywhere). See README.md.
   --------------------------------------------------------- */
const FORM_ENDPOINT = '';

(function () {
  'use strict';

  const EASE = 'cubic-bezier(.16,.84,.3,1)';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideScreen = window.matchMedia('(min-width: 1000px)');

  /* ---------- 1. Header: solid background after 40px of scrolling ---------- */
  const header = document.getElementById('site-header');

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  /* ---------- 2. Scroll reveal for elements marked data-reveal ---------- */
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));

  // Fade an element in. "order" staggers several that appear at once.
  function reveal(el, order) {
    if (el.dataset.shown) return;
    el.dataset.shown = '1';
    const delay = order * 0.08 + 's';
    el.style.transition = 'opacity 1s ' + EASE + ' ' + delay + ', transform 1s ' + EASE + ' ' + delay;
    el.classList.remove('reveal-hidden');
  }

  if (!reduceMotion) {
    // Anything already on screen stays visible; the rest is hidden until scrolled to.
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.dataset.shown = '1';
      } else {
        el.classList.add('reveal-hidden');
      }
    });

    // Safety net: after 3.5 seconds show everything, no matter what.
    setTimeout(function () {
      revealEls.forEach(function (el) { reveal(el, 0); });
    }, 3500);
  }

  function checkReveals() {
    if (reduceMotion) return;
    const limit = window.innerHeight * 0.92;
    let order = 0;
    revealEls.forEach(function (el) {
      if (!el.dataset.shown && el.getBoundingClientRect().top < limit) reveal(el, order++);
    });
  }

  // Run the scroll work at most once per animation frame
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      updateHeader();
      checkReveals();
    });
  }, { passive: true });

  updateHeader();

  /* ---------- 3. Expanding service panels (wide screens only) ---------- */
  const panels = Array.from(document.querySelectorAll('#panels .panel'));

  function openPanel(panel) {
    if (!wideScreen.matches) return; // on small screens all panels are open
    panels.forEach(function (p) {
      p.classList.toggle('is-active', p === panel);
    });
  }

  // Panels can be focused with the Tab key on wide screens only
  function setupPanelsForScreen() {
    panels.forEach(function (p) {
      if (wideScreen.matches) {
        p.setAttribute('tabindex', '0');
      } else {
        p.removeAttribute('tabindex');
      }
    });
  }

  panels.forEach(function (panel) {
    panel.addEventListener('mouseenter', function () { openPanel(panel); });
    panel.addEventListener('click', function () { openPanel(panel); });
    // Tabbing onto a panel (or into its link) opens it
    panel.addEventListener('focusin', function () { openPanel(panel); });
    panel.addEventListener('keydown', function (e) {
      if (e.target === panel && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openPanel(panel);
      }
    });
  });

  setupPanelsForScreen();
  wideScreen.addEventListener('change', setupPanelsForScreen);

  /* ---------- 4. Quote form ---------- */
  const form = document.getElementById('quote-form');
  const thanks = document.getElementById('form-thanks');
  const errorBox = document.getElementById('form-error');
  const projectType = document.getElementById('project-type');
  const chips = Array.from(form.querySelectorAll('.chip'));
  const submitBtn = form.querySelector('.submit-btn');

  // Project type chips: click to select / unselect
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const selected = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', selected ? 'false' : 'true');
      projectType.value = chips
        .filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
        .map(function (c) { return c.textContent.trim(); })
        .join(', ');
    });
  });

  function showThanks() {
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus({ preventScroll: true });
  }

  function showError() {
    errorBox.innerHTML = 'Sorry, your request could not be sent. Please try again, or call us at <a href="tel:12365128418">236-512-8418</a>.';
    errorBox.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.hidden = true;

    // No form service set up yet: just show the thank-you message.
    if (!FORM_ENDPOINT) {
      console.warn('Golden Fenix: FORM_ENDPOINT is empty in script.js, so this quote request was not sent anywhere. See README.md.');
      showThanks();
      return;
    }

    submitBtn.disabled = true;
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Form service replied with status ' + response.status);
        showThanks();
      })
      .catch(function (err) {
        console.error(err);
        showError();
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
