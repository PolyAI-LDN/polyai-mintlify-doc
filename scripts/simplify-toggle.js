(function () {
  // ── Simplify view toggle ──────────────────────────────────────────────────
  // URL-based simplified mode: adds ?view=simplified to the URL.
  // The preference travels with the link so it can be shared/bookmarked.

  // Sidebar group names to hide entirely in simplified mode.
  var HIDDEN_GROUPS = ['Developer tools', 'Secrets', 'Code-driven flows'];

  // Collapsed sub-group button labels to hide in simplified mode.
  var HIDDEN_SUBGROUPS = [
    'Tools', 'Configuration builder',
    'Speech recognition', 'Response control', 'Audio management',
    'Variant management',
    'Flows', 'SMS', 'Call handoffs'
  ];

  // Top-nav tab labels to hide in simplified mode.
  var HIDDEN_TABS = ['Developer', 'API reference'];

  // Path prefixes that are "complex" — clicking a link to these exits simplified mode.
  // Must stay in sync with the li[id] checks in markSidebarGroups().
  var COMPLEX_PREFIXES = [
    '/tools/', '/secrets/', '/extend/', '/configuration-builder/',
    '/speech-recognition/', '/response-control/', '/audio-management/', '/variant-management/',
    '/telephony/twilio/',
    '/flows/', '/sms/', '/call-handoff/',
    '/call-data/conversations-api/',
    '/api-reference/', '/api/'
  ];
  var COMPLEX_EXACT = ['/call-data/s3-to-s3'];

  function isComplexPath(pathname) {
    if (COMPLEX_EXACT.indexOf(pathname) !== -1) return true;
    return COMPLEX_PREFIXES.some(function (p) { return pathname.startsWith(p); });
  }

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

  // Mark sidebar section headers, sub-groups, tagged items, and path-matched items.
  // Runs after each navigation since Mintlify re-renders the sidebar.
  function markSidebarGroups() {
    // Top-level section headers
    document.querySelectorAll('.sidebar-group-header').forEach(function (header) {
      var h5 = header.querySelector('h5');
      if (!h5) return;
      var name = h5.textContent.trim();
      if (HIDDEN_GROUPS.indexOf(name) !== -1) {
        header.dataset.simplifiedHide = 'true';
        var sibling = header.nextElementSibling;
        if (sibling) sibling.dataset.simplifiedHide = 'true';
      }
    });

    // Collapsed sub-group buttons
    document.querySelectorAll('.sidebar-group li > button').forEach(function (btn) {
      var name = btn.textContent.trim();
      if (HIDDEN_SUBGROUPS.indexOf(name) !== -1) {
        var li = btn.closest('li');
        if (li) li.dataset.simplifiedHide = 'true';
      }
    });

    // Expanded individual page items — hide by path prefix or Code/Advanced tag
    document.querySelectorAll('li[id]').forEach(function (li) {
      var id = li.id;
      var pathMatch = isComplexPath(id);
      var tagEl = li.querySelector('[data-nav-tag="Code"], [data-nav-tag="Advanced"]');
      if (pathMatch || tagEl) {
        li.dataset.simplifiedHide = 'true';
      }
    });
  }

  // Mark top-nav tab links (Developer, API reference) for hiding.
  function markNavbarTabs() {
    document.querySelectorAll('a[class*="nav-tabs-item"]').forEach(function (a) {
      var text = a.textContent.trim();
      if (HIDDEN_TABS.indexOf(text) !== -1) {
        a.dataset.simplifiedHide = 'true';
      } else {
        delete a.dataset.simplifiedHide;
      }
    });
  }

  // Wrap .developer-only sections in a <details> accordion in simplified mode.
  // Unwrap them in full-docs mode.
  function applyDeveloperContent() {
    var simplified = document.documentElement.dataset.simplified === 'true';

    if (simplified) {
      document.querySelectorAll('.developer-only:not([data-accordion-wrapped])').forEach(function (div) {
        var heading = div.querySelector('h2, h3');
        var title = heading ? heading.textContent.trim() : 'Developer details';

        var details = document.createElement('details');
        details.className = 'dev-accordion';

        var summary = document.createElement('summary');
        summary.className = 'dev-accordion-summary';
        summary.textContent = title;

        div.dataset.accordionWrapped = 'true';
        div.parentNode.insertBefore(details, div);
        details.appendChild(summary);
        details.appendChild(div);
      });
    } else {
      // Unwrap accordions back to plain divs
      document.querySelectorAll('.dev-accordion').forEach(function (details) {
        var div = details.querySelector('.developer-only');
        if (div) {
          delete div.dataset.accordionWrapped;
          details.parentNode.insertBefore(div, details);
          details.remove();
        }
      });
    }
  }

  // Intercept clicks on links to complex pages while in simplified mode —
  // exit simplified mode and navigate to the page in full-docs view.
  document.addEventListener('click', function (e) {
    if (document.documentElement.dataset.simplified !== 'true') return;
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    var destPath;
    try {
      var destUrl = new URL(href, window.location.origin);
      if (destUrl.origin !== window.location.origin) return; // external
      destPath = destUrl.pathname;
    } catch (err) { return; }
    if (isComplexPath(destPath)) {
      e.preventDefault();
      e.stopPropagation();
      setSimplified(false);
      var btn = document.querySelector('.simplify-toggle');
      if (btn) updateButton(btn, false);
      markNavbarTabs();
      window.location.href = destPath;
    }
  }, true);

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
      applyDeveloperContent();
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
      applyDeveloperContent();
    }, 150);
  }

  // Apply preference immediately (before paint)
  setSimplified(isSimplified());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectToggle();
      markSidebarGroups();
      markNavbarTabs();
      applyDeveloperContent();
    });
  } else {
    injectToggle();
    markSidebarGroups();
    markNavbarTabs();
    applyDeveloperContent();
  }

  // Re-run on Mintlify SPA navigations, preserving ?view=simplified in URL.
  var _push = history.pushState;
  history.pushState = function (state, title, url) {
    if (url && document.documentElement.dataset.simplified === 'true') {
      try {
        var u = new URL(url, window.location.origin);
        // Don't inject ?view=simplified when navigating to a complex page
        if (!isComplexPath(u.pathname)) {
          u.searchParams.set('view', 'simplified');
          url = u.pathname + u.search + u.hash;
        }
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
