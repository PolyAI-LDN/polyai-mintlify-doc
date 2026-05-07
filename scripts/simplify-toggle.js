(function () {
  // ── Free trial mode toggle ────────────────────────────────────────────────
  // Persistent "Free trial mode" view backed by localStorage. Once on, it stays
  // on across page loads and sessions until the user clicks "Exit free trial
  // mode" via the floating pill or the landing page button.
  //
  // In free trial mode:
  //  - Sidebar entries for enterprise-only or developer-only content are
  //    greyed out, badged "Enterprise", and made non-interactive — so users
  //    can still see what exists but understand it isn't part of the free
  //    trial.
  //  - Browsing directly to an enterprise/developer page (e.g. via search,
  //    deep-link, or the URL bar) shows the page with an enterprise upsell
  //    banner prepended to the body explaining the gating.
  //  - Top-nav tabs that are wholly developer/API focused are still hidden
  //    (greying a tab looks broken).
  //  - .developer-only sections inside otherwise-mixed pages are wrapped in
  //    a collapsed accordion so the page stays readable without code.
  //
  // ?view=simplified is still honoured as a one-shot entry point and is
  // mirrored back into the URL on navigations so links can be shared.
  var STORAGE_KEY = 'polyai-simplified-mode';
  var POSITION_KEY = 'polyai-simplified-pill-position';
  var DRAG_THRESHOLD = 4; // px — movement before we treat a pointerdown as a drag

  // Sidebar group names to grey out / badge in free trial mode.
  var ENTERPRISE_GROUPS = ['Developer tools', 'Secrets', 'Code-driven flows'];

  // Collapsed sub-group button labels to grey out in free trial mode.
  // SMS, Call handoffs, and Flows are intentionally excluded here — their intro
  // pages are visible in free trial mode with developer content behind an
  // accordion, and Flows contains a No-code sub-group that must stay visible.
  var ENTERPRISE_SUBGROUPS = [
    'Tools', 'Configuration builder',
    'Speech recognition', 'Response control', 'Audio management',
    'Variant management',
    'Test suite',
    'APIs', 'API and export',
    'PolyAcademy level 2', 'PolyAcademy level 3',
    // Managed-service integration groups
    'Managed services',
    // Non-UI integration sidebar groups
    'Amazon Connect',
    'CRM',
    'Hospitality',
    'Healthcare',
    'Knowledge base'
  ];

  // Top-nav tab labels — these stay hidden (a greyed-out tab looks broken).
  var HIDDEN_TABS = ['Developer', 'API reference', 'Advanced'];

  // Path prefixes for "enterprise/developer" pages. Visiting one in free trial
  // mode shows the page with an enterprise upsell banner prepended.
  var ENTERPRISE_PREFIXES = [
    '/tools/', '/secrets/', '/extend/', '/configuration-builder/',
    '/speech-recognition/', '/response-control/', '/audio-management/', '/variant-management/',
    '/telephony/twilio/',
    '/call-data/conversations-api/',
    '/analytics/test-suite/',
    '/api-reference/', '/api/'
  ];
  var ENTERPRISE_EXACT = [
    '/call-data/s3-to-s3',
    // Code-driven flow pages — the no-code subdirectory stays visible.
    '/flows/triggering-flows',
    '/flows/example',
    '/flows/transition-functions',
    '/flows/object',
    '/flows/asr-biasing',
    '/flows/dtmf',
    '/flows/few-shot-prompting',
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

  // These intro pages are "mixed" — they appear in free trial mode with
  // developer content tucked behind an accordion. They must NOT trigger the
  // enterprise banner.
  var SIMPLIFIED_INTROS = ['/call-handoff/introduction', '/sms/introduction', '/flows/introduction'];

  function isEnterprisePath(pathname) {
    if (SIMPLIFIED_INTROS.indexOf(pathname) !== -1) return false;
    if (ENTERPRISE_EXACT.indexOf(pathname) !== -1) return true;
    // Sub-pages of call-handoff and sms (other than introduction) are still gated
    if (pathname.startsWith('/call-handoff/') || pathname.startsWith('/sms/')) return true;
    return ENTERPRISE_PREFIXES.some(function (p) { return pathname.startsWith(p); });
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
      ? 'Exit free trial mode (show all docs)'
      : 'Enter free trial mode (grey out enterprise and developer content)';
    btn.innerHTML = simplified
      ? '<span class="simplify-toggle__icon">\u2726</span><span class="simplify-toggle__label">Free trial \u2014 exit</span>'
      : '<span class="simplify-toggle__icon">\u2726</span><span class="simplify-toggle__label">Free trial mode</span>';
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
      if (ENTERPRISE_GROUPS.indexOf(name) !== -1) {
        header.dataset.simplifiedEnterprise = 'true';
        var sibling = header.nextElementSibling;
        if (sibling) sibling.dataset.simplifiedEnterprise = 'true';
      }
    });

    // Collapsed sub-group buttons — strip tag pill text (e.g. "ToolsCode" → "Tools")
    // before matching, since tag spans are children of the button element.
    document.querySelectorAll('.sidebar-group li > button').forEach(function (btn) {
      var clone = btn.cloneNode(true);
      clone.querySelectorAll('[data-nav-tag]').forEach(function (el) { el.remove(); });
      var name = clone.textContent.trim();
      if (ENTERPRISE_SUBGROUPS.indexOf(name) !== -1) {
        var li = btn.closest('li');
        if (li) li.dataset.simplifiedEnterprise = 'true';
      }
    });

    // Expanded individual page items — grey out by path prefix or Code/Advanced tag.
    // isEnterprisePath() already handles the SIMPLIFIED_INTROS exclusion.
    document.querySelectorAll('li[id]').forEach(function (li) {
      var id = li.id;
      var pathMatch = isEnterprisePath(id);
      var tagEl = li.querySelector('[data-nav-tag="Code"], [data-nav-tag="Advanced"]');
      if (pathMatch || tagEl) {
        li.dataset.simplifiedEnterprise = 'true';
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

  // Inject an upsell banner at the top of an enterprise page when the user
  // is in free trial mode. Idempotent — won't double-insert across SPA navs.
  function applyEnterpriseBanner() {
    var existing = document.getElementById('free-trial-enterprise-banner');
    var simplified = document.documentElement.dataset.simplified === 'true';
    var enterprise = isEnterprisePath(window.location.pathname);

    if (!simplified || !enterprise) {
      if (existing) existing.remove();
      document.documentElement.removeAttribute('data-on-enterprise-page');
      return;
    }
    if (existing) return;

    document.documentElement.setAttribute('data-on-enterprise-page', 'true');

    var banner = document.createElement('aside');
    banner.id = 'free-trial-enterprise-banner';
    banner.className = 'free-trial-enterprise-banner';
    banner.setAttribute('role', 'note');
    banner.innerHTML =
      '<div class="free-trial-enterprise-banner__icon" aria-hidden="true">\u2726</div>' +
      '<div class="free-trial-enterprise-banner__body">' +
        '<p class="free-trial-enterprise-banner__title"><strong>This is an Enterprise feature.</strong></p>' +
        '<p class="free-trial-enterprise-banner__text">' +
          'You\u2019re viewing the docs in <strong>free trial mode</strong>. This page documents functionality that isn\u2019t included in the self-serve free trial \u2014 it requires an Enterprise plan.' +
        '</p>' +
        '<p class="free-trial-enterprise-banner__actions">' +
          '<a href="https://poly.ai/contact-us" class="free-trial-enterprise-banner__cta" target="_blank" rel="noopener">Talk to sales</a>' +
          '<button type="button" class="free-trial-enterprise-banner__exit" id="free-trial-enterprise-banner-exit">Exit free trial mode</button>' +
        '</p>' +
      '</div>';

    // Insert at top of main content. Mintlify uses #content-area / main; fall
    // back to body if neither exists yet.
    var mount = document.querySelector('main') || document.querySelector('#content-area') || document.body;
    if (mount && mount.firstChild) {
      mount.insertBefore(banner, mount.firstChild);
    } else if (mount) {
      mount.appendChild(banner);
    }

    var exitBtn = banner.querySelector('#free-trial-enterprise-banner-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setSimplified(false);
        document.querySelectorAll('.simplify-toggle').forEach(function (b) {
          updateButton(b, false);
        });
        markSidebarGroups();
        markNavbarTabs();
        applyDeveloperContent();
        applyEnterpriseBanner();
        updateLandingPageStatus();
      });
    }
  }

  // Wrap .developer-only sections in a <details> accordion in free trial mode.
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

  // Intercept clicks on enterprise sidebar links while in free trial mode.
  // CSS already sets pointer-events: none on the greyed-out items, but we
  // double-up here defensively for any link that slips through (e.g. inline
  // links inside body content on a free-trial page that point to an
  // enterprise destination).
  document.addEventListener('click', function (e) {
    if (document.documentElement.dataset.simplified !== 'true') return;
    var a = e.target.closest('a[href]');
    if (!a) return;
    // If the link is inside a greyed-out sidebar item, swallow the click.
    var greyed = a.closest('[data-simplified-enterprise="true"]');
    if (greyed) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Otherwise let the navigation proceed; the destination page will render
    // the enterprise banner if applicable.
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
      setSimplified(next);
      // Sync all toggle buttons on the page.
      document.querySelectorAll('.simplify-toggle').forEach(function (b) {
        updateButton(b, next);
      });
      markSidebarGroups();
      markNavbarTabs();
      applyDeveloperContent();
      applyEnterpriseBanner();
      updateLandingPageStatus();
    });

    makeDraggable(btn);
    return btn;
  }

  // ── Drag support ──────────────────────────────────────────────────────────
  // The pill lives at a fixed top-right position by default. Users can drag
  // it anywhere in the viewport; the position is stored in localStorage and
  // restored on reload. A small movement threshold ensures a plain click still
  // toggles free trial mode without being swallowed by the drag handler.

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

  // Wires up the explicit Enter / Exit buttons on the /platform/free-trial-mode
  // landing page. Shows a confirmation panel once the user is in free trial mode.
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
        // Land on the home page in free trial mode so the user sees the
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
        markSidebarGroups();
        markNavbarTabs();
        applyDeveloperContent();
        applyEnterpriseBanner();
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
      applyEnterpriseBanner();
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
      applyEnterpriseBanner();
      wireLandingPageButtons();
    });
  } else {
    injectToggle();
    markSidebarGroups();
    markNavbarTabs();
    applyDeveloperContent();
    applyEnterpriseBanner();
    wireLandingPageButtons();
  }

  // Re-run on Mintlify SPA navigations, preserving ?view=simplified in URL.
  var _push = history.pushState;
  history.pushState = function (state, title, url) {
    if (url && document.documentElement.dataset.simplified === 'true') {
      try {
        var u = new URL(url, window.location.origin);
        // Always preserve the flag — even on enterprise pages, since the user
        // stays in free trial mode and just sees the upsell banner.
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
