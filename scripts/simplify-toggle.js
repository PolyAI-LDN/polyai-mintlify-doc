(function () {
  // ── Simplify view toggle ──────────────────────────────────────────────────
  // Injects a button into the site header that toggles a "simplified" mode.
  // Persists the preference in localStorage.

  var STORAGE_KEY = 'polyai-docs-simplified';

  // Sidebar group names to hide entirely in simplified mode.
  // These match the <h5> text inside .sidebar-group-header elements.
  var HIDDEN_GROUPS = ['Developer tools', 'Secrets', 'Code-driven flows'];

  // Individual collapsed-group buttons (sub-groups within a section) to hide.
  // These match button text inside .sidebar-group <li> elements.
  var HIDDEN_SUBGROUPS = [
    'Tools', 'Configuration builder',
    'Speech recognition', 'Response control', 'Audio management',
    'Variant management'
  ];

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

  // Mark sidebar section headers and sub-group items so CSS can hide them.
  // Runs after each navigation since Mintlify re-renders the sidebar.
  function markSidebarGroups() {
    // Top-level section headers: <div class="sidebar-group-header"><h5>Name</h5>…
    document.querySelectorAll('.sidebar-group-header').forEach(function (header) {
      var h5 = header.querySelector('h5');
      if (!h5) return;
      var name = h5.textContent.trim();
      if (HIDDEN_GROUPS.indexOf(name) !== -1) {
        header.dataset.simplifiedHide = 'true';
        // Also mark the sibling <ul class="sidebar-group"> that follows
        var sibling = header.nextElementSibling;
        if (sibling) sibling.dataset.simplifiedHide = 'true';
      }
    });

    // Collapsed sub-group buttons: <button>Name</button> inside sidebar-group <li>
    document.querySelectorAll('.sidebar-group li > button').forEach(function (btn) {
      var name = btn.textContent.trim();
      if (HIDDEN_SUBGROUPS.indexOf(name) !== -1) {
        var li = btn.closest('li');
        if (li) li.dataset.simplifiedHide = 'true';
      }
    });

    // Individual expanded page items: <li id="/tools/…">
    document.querySelectorAll('li[id]').forEach(function (li) {
      var id = li.id;
      if (
        id.startsWith('/tools/') || id.startsWith('/secrets/') ||
        id.startsWith('/extend/') || id.startsWith('/configuration-builder/') ||
        id.startsWith('/speech-recognition/') || id.startsWith('/response-control/') ||
        id.startsWith('/audio-management/') || id.startsWith('/variant-management/') ||
        id.startsWith('/telephony/twilio/') ||
        id.startsWith('/flows/transition-functions') || id.startsWith('/flows/object') ||
        id.startsWith('/flows/asr-biasing') || id.startsWith('/flows/dtmf') ||
        id.startsWith('/flows/few-shot-prompting') ||
        id.startsWith('/call-data/conversations-api/') || id === '/call-data/s3-to-s3'
      ) {
        li.dataset.simplifiedHide = 'true';
      }
    });
  }

  function injectToggle() {
    if (document.querySelector('.simplify-toggle')) return;

    var navbarList = document.querySelector('li.navbar-link') &&
      document.querySelector('li.navbar-link').parentElement;

    var btn = document.createElement('button');
    btn.className = 'simplify-toggle';
    btn.type = 'button';
    updateButton(btn, isSimplified());

    btn.addEventListener('click', function () {
      var next = document.documentElement.dataset.simplified !== 'true';
      setSimplified(next);
      updateButton(btn, next);
    });

    if (navbarList) {
      var li = document.createElement('li');
      li.appendChild(btn);
      navbarList.insertBefore(li, navbarList.firstChild);
    } else {
      var header = document.getElementById('header') || document.querySelector('header');
      if (header) header.appendChild(btn);
    }
  }

  function onNav() {
    setTimeout(function () {
      injectToggle();
      markSidebarGroups();
    }, 150);
  }

  // Apply stored preference immediately (before paint)
  setSimplified(isSimplified());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectToggle();
      markSidebarGroups();
    });
  } else {
    injectToggle();
    markSidebarGroups();
  }

  // Re-run on Mintlify SPA navigations
  var _push = history.pushState;
  history.pushState = function () {
    _push.apply(history, arguments);
    onNav();
  };
  window.addEventListener('popstate', onNav);

  // ── Tab class injection ───────────────────────────────────────────────────
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
  window.addEventListener('popstate', applyTabClass);
}());
