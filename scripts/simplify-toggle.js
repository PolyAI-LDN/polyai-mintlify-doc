(function () {
  // ── Simplify view toggle ──────────────────────────────────────────────────
  // Injects a button into the site header that toggles a "simplified" mode.
  // In simplified mode the developer/advanced sidebar items are dimmed and
  // audience-callout blocks aimed at developers are hidden.
  //
  // Persists the preference in localStorage.

  var STORAGE_KEY = 'polyai-docs-simplified';

  function isSimplified() {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch (e) { return false; }
  }

  function setSimplified(on) {
    try { localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false'); } catch (e) {}
    document.documentElement.dataset.simplified = on ? 'true' : 'false';
  }

  function updateButton(btn, simplified) {
    btn.setAttribute('aria-pressed', simplified);
    btn.title = simplified
      ? 'Switch to full docs (show all content)'
      : 'Simplified view — hide developer-only content';
    btn.innerHTML = simplified
      ? '<span>\u2699\uFE0E Full docs</span>'
      : '<span>\u2726 Simplified view</span>';
  }

  function injectToggle() {
    if (document.querySelector('.simplify-toggle')) return;

    // Use the confirmed Mintlify header element id
    var header = document.getElementById('header');
    if (!header) {
      header = document.querySelector('header');
    }
    if (!header) return;

    // Find the inner flex row to append into
    var row = header.querySelector('[class*="flex"]') || header;

    var btn = document.createElement('button');
    btn.className = 'simplify-toggle';
    btn.type = 'button';
    updateButton(btn, isSimplified());

    btn.addEventListener('click', function () {
      var next = document.documentElement.dataset.simplified !== 'true';
      setSimplified(next);
      updateButton(btn, next);
    });

    row.appendChild(btn);
  }

  // Apply stored preference immediately (before paint) to avoid flash
  setSimplified(isSimplified());

  // Inject button once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }

  // Re-inject on Mintlify SPA navigations
  var _push = history.pushState;
  history.pushState = function () {
    _push.apply(history, arguments);
    setTimeout(injectToggle, 150);
  };
  window.addEventListener('popstate', function () { setTimeout(injectToggle, 150); });

  // ── Tab class injection ───────────────────────────────────────────────────
  // Adds data-tab to <html> based on the current URL path.

  function applyTabClass() {
    var path = window.location.pathname;
    var tab = 'helpcenter';

    if (/^\/(tools|secrets|extend|configuration-builder|call-handoff|call-data|flows\/(transition|object|asr|dtmf|few-shot)|api\/|developer)/.test(path)) {
      tab = 'developer';
    } else if (/^\/learn\//.test(path)) {
      tab = 'academy';
    } else if (/^\/api-reference\//.test(path)) {
      tab = 'api';
    } else if (/^\/integrations\//.test(path)) {
      tab = 'integrations';
    } else if (/^\/releases\//.test(path)) {
      tab = 'releases';
    }

    document.documentElement.dataset.tab = tab;
  }

  applyTabClass();
  document.addEventListener('DOMContentLoaded', applyTabClass);

  var _push2 = history.pushState;
  history.pushState = (function (orig) {
    return function () {
      orig.apply(history, arguments);
      applyTabClass();
    };
  }(_push2));

  window.addEventListener('popstate', applyTabClass);
}());
