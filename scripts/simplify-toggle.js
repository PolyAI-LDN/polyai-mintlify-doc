(function () {
  // ── Simplify view toggle ──────────────────────────────────────────────────
  // Persistent simplified mode backed by localStorage.
  // Once on, it stays on across page loads and sessions until the user clicks
  // "Exit simplified mode" or navigates to a page that's flagged as complex
  // (in which case it auto-exits and takes them there in full-docs view).
  //
  // ?view=simplified is still honoured as a one-shot entry point (e.g. from
  // the /platform/simplified-mode landing page link or an external share),
  // and is mirrored back into the URL on navigations so links can be shared.
  var STORAGE_KEY = 'polyai-simplified-mode';
  var POSITION_KEY = 'polyai-simplified-pill-position';
  var DRAG_THRESHOLD = 4; // px — movement before we treat a pointerdown as a drag

  // Sidebar group names to hide entirely in simplified mode.
  var HIDDEN_GROUPS = ['Developer tools', 'Secrets', 'Code-driven flows'];

  // Collapsed sub-group button labels to hide in simplified mode.
  // SMS and Call handoffs are intentionally excluded here — their intro pages
  // are visible in simplified mode with developer content behind an accordion.
  var HIDDEN_SUBGROUPS = [
    'Tools', 'Configuration builder',
    'Speech recognition', 'Response control', 'Audio management',
    'Variant management',
    'Flows', 'Test suite',
    'APIs', 'API and export',
    'PolyAcademy level 2', 'PolyAcademy level 3',
    // Managed-service integration groups (hidden in simplified mode)
    'Managed services',
    // Non-UI integration sidebar groups
    'Amazon Connect',
    'CRM',
    'Hospitality',
    'Healthcare',
    'Knowledge base'
  ];

  // Top-nav tab labels to hide in simplified mode.
  var HIDDEN_TABS = ['Developer', 'API reference', 'Advanced'];

  // Path prefixes that are "complex" — clicking a link to these exits simplified mode.
  // Must stay in sync with the li[id] checks in markSidebarGroups().
  var COMPLEX_PREFIXES = [
    '/tools/', '/secrets/', '/extend/', '/configuration-builder/',
    '/speech-recognition/', '/response-control/', '/audio-management/', '/variant-management/',
    '/telephony/twilio/',
    '/flows/',
    '/call-data/conversations-api/',
    '/analytics/test-suite/',
    '/api-reference/', '/api/'
  ];
  var COMPLEX_EXACT = [
    '/call-data/s3-to-s3',
    // Managed-service integration pages (not in Studio UI)
    '/integrations/managed-services',
    '/integrations/voice/sip/custom-sip', '/integrations/voice/dnis-pool',
    '/integrations/zoom',
    '/integrations/design-my-night', '/integrations/liveres',
    '/integrations/zendesk-ticketing-solutions',
    '/integrations/pci-pal', '/integrations/stripe',
    '/integrations/google-sheets', '/integrations/ideal-postcode',
    '/integrations/deepl',
    // Non-UI integrations — only Five9, Twilio, Dialpad are click-and-go
    '/integrations/voice/introduction',
    '/integrations/voice/sip/NICECXone',
    '/integrations/voice/amazon-connect/amazon-connect',
    '/integrations/voice/sip/genesys',
    '/integrations/zendesk',
    '/integrations/salesforce',
    '/integrations/opentable',
    '/integrations/hotSOS',
    '/integrations/epic',
    '/integrations/gladly',
    '/integrations/snapcall'
  ];

  // These intro pages are "mixed" — they appear in simplified mode with developer
  // content tucked behind an accordion. They must not trigger exit from simplified mode.
  var SIMPLIFIED_INTROS = ['/call-handoff/introduction', '/sms/introduction'];

  function isComplexPath(pathname) {
    if (SIMPLIFIED_INTROS.indexOf(pathname) !== -1) return false;
    if (COMPLEX_EXACT.indexOf(pathname) !== -1) return true;
    // Sub-pages of call-handoff and sms (other than introduction) are still complex
    if (pathname.startsWith('/call-handoff/') || pathname.startsWith('/sms/')) return true;
    return COMPLEX_PREFIXES.some(function (p) { return pathname.startsWith(p); });
  }

  function readStoredPreference() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function writeStoredPreference(on) {
    try {
      if (on) window.localStorage.setItem(STORAGE_KEY, '1');
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function hasUrlFlag() {
    return new URLSearchParams(window.location.search).get('view') === 'simplified';
  }

  function isSimplified() {
    return readStoredPreference() || hasUrlFlag();
  }

  function setSimplified(on) {
    writeStoredPreference(on);
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
      ? 'Exit simplified mode (show all docs)'
      : 'Enter simplified mode (hide developer and API content)';
    btn.innerHTML = simplified
      ? '<span class="simplify-toggle__icon">\u2726</span><span class="simplify-toggle__label">Simplified \u2014 exit</span>'
      : '<span class="simplify-toggle__icon">\u2726</span><span class="simplify-toggle__label">Simplified mode</span>';
    btn.classList.toggle('simplify-toggle--active', !!simplified);
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

    // Collapsed sub-group buttons — strip tag pill text (e.g. "ToolsCode" → "Tools")
    // before matching, since tag spans are children of the button element.
    document.querySelectorAll('.sidebar-group li > button').forEach(function (btn) {
      var clone = btn.cloneNode(true);
      clone.querySelectorAll('[data-nav-tag]').forEach(function (el) { el.remove(); });
      var name = clone.textContent.trim();
      if (HIDDEN_SUBGROUPS.indexOf(name) !== -1) {
        var li = btn.closest('li');
        if (li) li.dataset.simplifiedHide = 'true';
      }
    });

    // Expanded individual page items — hide by path prefix or Code/Advanced tag.
    // isComplexPath() already handles the SIMPLIFIED_INTROS exclusion.
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
      document.querySelectorAll('.simplify-toggle').forEach(function (b) {
        updateButton(b, false);
      });
      markNavbarTabs();
      updateLandingPageStatus();
      window.location.href = destPath;
    }
  }, true);

  function createToggleButton() {
    var btn = document.createElement('button');
    btn.className = 'simplify-toggle';
    btn.type = 'button';
    updateButton(btn, isSimplified());

    btn.addEventListener('click', function (e) {
      // Drag-just-ended clicks are suppressed by makeDraggable (which sets
      // suppressNextClick). Guard here too in case other code fires a click.
      if (btn.dataset.dragSuppressClick === '1') {
        btn.dataset.dragSuppressClick = '';
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      var next = document.documentElement.dataset.simplified !== 'true';
      // If switching INTO simplified mode while on a complex page, redirect home.
      // localStorage persistence means we don't need the sessionStorage flag,
      // but we still redirect so the user lands somewhere the mode makes sense.
      if (next && isComplexPath(window.location.pathname)) {
        writeStoredPreference(true);
        window.location.href = '/';
        return;
      }
      setSimplified(next);
      // Sync all toggle buttons on the page.
      document.querySelectorAll('.simplify-toggle').forEach(function (b) {
        updateButton(b, next);
      });
      markNavbarTabs();
      applyDeveloperContent();
      updateLandingPageStatus();
    });

    makeDraggable(btn);
    return btn;
  }

  // ── Drag support ──────────────────────────────────────────────────────────
  // The pill lives at a fixed top-right position by default. Users can drag
  // it anywhere in the viewport; the position is stored in localStorage and
  // restored on reload. A small movement threshold ensures a plain click still
  // toggles simplified mode without being swallowed by the drag handler.

  function readStoredPosition() {
    try {
      var raw = window.localStorage.getItem(POSITION_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (typeof parsed.left !== 'number' || typeof parsed.top !== 'number') return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeStoredPosition(pos) {
    try {
      window.localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
    } catch (e) {}
  }

  function clampPosition(left, top, width, height) {
    var maxLeft = Math.max(0, window.innerWidth - width);
    var maxTop = Math.max(0, window.innerHeight - height);
    return {
      left: Math.min(Math.max(0, left), maxLeft),
      top: Math.min(Math.max(0, top), maxTop)
    };
  }

  function applyStoredPosition(btn) {
    var pos = readStoredPosition();
    if (!pos) return;
    var rect = btn.getBoundingClientRect();
    var clamped = clampPosition(pos.left, pos.top, rect.width || 160, rect.height || 36);
    btn.style.left = clamped.left + 'px';
    btn.style.top = clamped.top + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
  }

  function makeDraggable(btn) {
    var startX = 0, startY = 0;
    var originLeft = 0, originTop = 0;
    var dragging = false;
    var pointerId = null;

    btn.addEventListener('pointerdown', function (e) {
      // Only left-button / primary touch
      if (e.button !== undefined && e.button !== 0) return;
      var rect = btn.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      originLeft = rect.left;
      originTop = rect.top;
      pointerId = e.pointerId;
      dragging = false;
    });

    btn.addEventListener('pointermove', function (e) {
      if (pointerId === null || e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!dragging && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      if (!dragging) {
        dragging = true;
        btn.classList.add('simplify-toggle--dragging');
        try { btn.setPointerCapture(pointerId); } catch (err) {}
      }
      var rect = btn.getBoundingClientRect();
      var next = clampPosition(originLeft + dx, originTop + dy, rect.width, rect.height);
      btn.style.left = next.left + 'px';
      btn.style.top = next.top + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
      e.preventDefault();
    });

    function endDrag(e) {
      if (pointerId === null) return;
      if (e && e.pointerId !== pointerId) return;
      try { btn.releasePointerCapture(pointerId); } catch (err) {}
      pointerId = null;
      if (dragging) {
        btn.classList.remove('simplify-toggle--dragging');
        var rect = btn.getBoundingClientRect();
        writeStoredPosition({ left: rect.left, top: rect.top });
        // Swallow the click event that follows pointerup after a drag so the
        // mode doesn't toggle when the user just repositioned the pill.
        btn.dataset.dragSuppressClick = '1';
        setTimeout(function () { btn.dataset.dragSuppressClick = ''; }, 0);
      }
      dragging = false;
    }

    btn.addEventListener('pointerup', endDrag);
    btn.addEventListener('pointercancel', endDrag);
  }

  // Re-clamp saved position into view on resize (e.g. orientation change,
  // browser window shrunk) so the pill can never end up off-screen.
  window.addEventListener('resize', function () {
    document.querySelectorAll('.simplify-toggle').forEach(function (btn) {
      var pos = readStoredPosition();
      if (!pos) return;
      var rect = btn.getBoundingClientRect();
      var clamped = clampPosition(pos.left, pos.top, rect.width, rect.height);
      btn.style.left = clamped.left + 'px';
      btn.style.top = clamped.top + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
      if (clamped.left !== pos.left || clamped.top !== pos.top) {
        writeStoredPosition(clamped);
      }
    });
  });

  function injectToggle() {
    // Floating fixed-position button attached to <body>. Theme-independent —
    // doesn't rely on Mintlify's navbar DOM, which has changed across versions
    // and does not expose a stable injection target in the current maple theme.
    if (document.querySelector('.simplify-toggle')) {
      // Re-apply stored position in case the DOM was re-rendered around us.
      document.querySelectorAll('.simplify-toggle').forEach(applyStoredPosition);
      return;
    }
    if (!document.body) return;
    var btn = createToggleButton();
    document.body.appendChild(btn);
    applyStoredPosition(btn);
  }

  // Wires up the explicit Enter / Exit buttons on the /platform/simplified-mode
  // landing page. Shows a confirmation panel once the user is in simplified mode.
  function updateLandingPageStatus() {
    var active = document.documentElement.dataset.simplified === 'true';
    var status = document.getElementById('simplified-mode-status');
    var enter = document.getElementById('simplified-mode-enter');
    if (status) {
      if (active) status.removeAttribute('hidden');
      else status.setAttribute('hidden', '');
    }
    if (enter) enter.classList.toggle('simplified-mode-cta--disabled', active);
  }

  function wireLandingPageButtons() {
    var enter = document.getElementById('simplified-mode-enter');
    if (enter && !enter.dataset.simplifyBound) {
      enter.dataset.simplifyBound = '1';
      enter.addEventListener('click', function (e) {
        e.preventDefault();
        writeStoredPreference(true);
        // Land on the home page in simplified mode so the user sees the
        // filtered experience immediately.
        window.location.href = '/?view=simplified';
      });
    }
    var exit = document.getElementById('simplified-mode-exit');
    if (exit && !exit.dataset.simplifyBound) {
      exit.dataset.simplifyBound = '1';
      exit.addEventListener('click', function (e) {
        e.preventDefault();
        setSimplified(false);
        document.querySelectorAll('.simplify-toggle').forEach(function (b) {
          updateButton(b, false);
        });
        markNavbarTabs();
        applyDeveloperContent();
        updateLandingPageStatus();
      });
    }
    updateLandingPageStatus();
  }

  function onNav() {
    setTimeout(function () {
      injectToggle();
      markSidebarGroups();
      markNavbarTabs();
      applyDeveloperContent();
      wireLandingPageButtons();
    }, 150);
  }

  // Apply preference immediately (before paint).
  // Precedence: localStorage preference > ?view=simplified URL flag.
  // The URL flag is still honoured as a one-shot entry point and promoted to
  // the stored preference so the mode sticks.
  if (hasUrlFlag() && !readStoredPreference()) {
    writeStoredPreference(true);
  }
  setSimplified(isSimplified());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectToggle();
      markSidebarGroups();
      markNavbarTabs();
      applyDeveloperContent();
      wireLandingPageButtons();
    });
  } else {
    injectToggle();
    markSidebarGroups();
    markNavbarTabs();
    applyDeveloperContent();
    wireLandingPageButtons();
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
