(function () {
  // ── Simplify view toggle ──────────────────────────────────────────────────
  // URL-based simplified mode: adds ?view=simplified to the URL.
  // The preference travels with the link so it can be shared/bookmarked.

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

  // Top-nav tab labels to hide in simplified mode.
  var HIDDEN_TABS = ['Developer', 'API reference'];

  function isSimplified() {
    return new URLSearchParams(window.location.search).get('view') === 'simplified';
  }

  function setSimplified(on) {
    var url = new URL(window.location.href);
    if (on) {
      url.searchParams.set('view', 'simplified');
    } else {
      url.searchParams.delete('view');
    }
    history.replaceState(null, '', url.pathname + url.search + url.hash);
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

  // Mark top-nav tab <li> elements for Developer and API reference tabs.
  function markNavbarTabs() {
    document.querySelectorAll('li.navbar-link').forEach(function (li) {
      var text = li.textContent.trim();
      if (HIDDEN_TABS.indexOf(text) !== -1) {
        li.dataset.simplifiedHide = 'true';
      } else {
        delete li.dataset.simplifiedHide;
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
      markNavbarTabs();
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
      markNavbarTabs();
    }, 150);
  }

  // Apply stored preference immediately (before paint)
  setSimplified(isSimplified());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectToggle();
      markSidebarGroups();
      markNavbarTabs();
    });
  } else {
    injectToggle();
    markSidebarGroups();
    markNavbarTabs();
  }

  // Re-run on Mintlify SPA navigations, preserving ?view=simplified in URL.
  var _push = history.pushState;
  history.pushState = function (state, title, url) {
    if (url && document.documentElement.dataset.simplified === 'true') {
      try {
        var u = new URL(url, window.location.origin);
        u.searchParams.set('view', 'simplified');
        url = u.pathname + u.search + u.hash;
      } catch (e) {}
    }
    _push.call(history, state, title, url);
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
