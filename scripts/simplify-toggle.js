(function () {
  // ── Open platform mode toggle ─────────────────────────────────────────────
  // Persistent "Open platform mode" view backed by localStorage. Once on, it
  // stays on across page loads and sessions until the user clicks
  // "Exit Open platform mode" via the floating pill or the landing page button.
  //
  // CSS class names and DOM ids keep their legacy "free-trial-enterprise-banner"
  // tokens so the styles.css selectors continue to match; only the visible
  // labels read as "Open platform" externally.
  //
  // In Open platform mode:
  //  - Sidebar entries for enterprise/developer content are visually dimmed
  //    so the user can see at a glance what's part of the Open platform and
  //    what isn't — but they remain fully clickable. No inline "Enterprise"
  //    pill; the dim state alone is the signal.
  //  - When the user lands on an enterprise/developer page (via sidebar,
  //    search, deep-link, or URL bar), the page renders with a sticky banner
  //    pinned to the top of the content area, and the rest of the page
  //    content is grayed out and pointer-events: none — readable and
  //    scrollable, but not interactive.
  //  - Top-nav tabs that are wholly developer/API focused are still hidden
  //    (graying a tab looks broken).
  //  - .developer-only sections inside otherwise-mixed pages are wrapped in
  //    a collapsed accordion so the page stays readable without code.
  //
  // ?view=simplified is still honoured as a one-shot entry point and is
  // mirrored back into the URL on navigations so links can be shared.
  var STORAGE_KEY = 'polyai-simplified-mode';
  var POSITION_KEY = 'polyai-simplified-pill-position';
  var BANNER_POSITION_KEY = 'polyai-lock-banner-position';
  var DRAG_THRESHOLD = 4; // px — movement before we treat a pointerdown as a drag

  // Sidebar group names to dim in Open platform mode.
  var ENTERPRISE_GROUPS = ['Developer tools', 'Secrets', 'Code-driven flows'];

  // Sidebar groups that should render ONLY when Open platform mode is on,
  // hidden completely otherwise. This is the dedicated "separate product"
  // landing area — a curated path that becomes the entire sidebar for
  // self-serve users so they don't see the rest of the enterprise IA.
  // Marked with data-open-platform-only="true".
  var OPEN_PLATFORM_ONLY_GROUPS = ['Agent Builder'];

  // When Open platform mode is on, every sidebar group whose name is NOT in
  // this list gets hidden. Keeping the list to just ['Open platform'] makes
  // the experience a single focused group; add 'FAQ' / 'Glossary' here if we
  // ever want to keep those visible to self-serve users.
  var OPEN_PLATFORM_KEEP_GROUPS = ['Agent Builder'];

  // Collapsed sub-group button labels to dim in Open platform mode.
  //
  // Derived from the live PLG sidebar component in platform_ui:
  //   apps/jupiter/src/components/organisms/ProjectSidebar/index.tsx (PlgContent)
  //   apps/jupiter/src/components/organisms/ProjectNavigation/components/{Build,Settings,Analytics}Section.tsx
  // The actual PLG sidebar renders:
  //   Home · Analytics (= standard Dashboard only) · Conversations ·
  //   Build {Agent, Knowledge, Flows, Tools} ·
  //   Configure {General, Agent voice, Web Calling, Numbers, Integrations} ·
  //   Operations (= Environments).
  // Everything not in that list is dimmed in the docs sidebar below.
  //
  // Intentionally excluded:
  //  - SMS, Call handoffs, Flows — intro pages are visible with developer
  //    content behind an accordion; Flows contains a No-code sub-group that
  //    must stay visible.
  //  - Tools, Knowledge — both are part of the Open platform Build sidebar
  //    (BuildSection.tsx renders these even when isPlgProd is true); custom
  //    Python tools and managed-topic knowledge bases are first-class
  //    self-serve features.
  //  - Conversations — surfaced as a top-level item in the PLG sidebar.
  var ENTERPRISE_SUBGROUPS = [
    // Build group — enterprise-only sub-groups (BuildSection.tsx gates these
    // on !isPlgProd)
    'Variant management',
    'Test suite',
    // Channels group — entirely absent from the PLG sidebar; voice settings
    // move into Configure (Agent voice + Web Calling).
    'Chat', 'Widgets',
    'Speech recognition', 'Response control', 'Audio management',
    // Configure group — enterprise-only sub-groups (SettingsSection.tsx
    // renders a stripped-down Configure for PLG with General, Agent voice,
    // Web Calling, Numbers, and Integrations). Numbers is rendered but gated:
    // the page opens with an enterprise banner because PSTN provisioning
    // is contracted on the enterprise cluster.
    'Numbers',
    'APIs', 'API and export',
    'Configuration builder',
    'Metrics', 'Dashboards', 'CSAT',
    'User management', 'API keys',
    'Call data',
    // Analytics group — only Conversations and the standard Dashboard appear
    // in the PLG sidebar; everything else under Analytics is enterprise-only.
    'Smart analyst', 'Agent analysis', 'PolyScore',
    // PolyAcademy levels 2/3 are enterprise-tier training content.
    'PolyAcademy level 2', 'PolyAcademy level 3',
    // Integration directories that only apply to enterprise managed services.
    'Managed services',
    'Amazon Connect',
    'CRM',
    'Hospitality',
    'Healthcare'
  ];

  // Top-nav tab labels — these stay hidden (a grayed-out tab looks broken).
  // Release notes is a documentation surface for monthly enterprise feature
  // launches and tier-rollout milestones — none of which apply to a self-serve
  // user mid-trial. Academy is PolyAcademy training built around the
  // enterprise IA (Level 2/3 are explicitly enterprise-tier content). Both
  // hidden in Open platform mode.
  var HIDDEN_TABS = ['Developer', 'API reference', 'Advanced', 'Release notes', 'Academy'];

  // Path prefixes for "enterprise/developer" pages. Visiting one in
  // Open platform mode shows the page with the content grayed out behind a
  // sticky banner.
  // Note: /extend/, /secrets/, /tools/, /studio-assistant/, and
  // /managed-topics/ are intentionally NOT in this list — the ADK, personal
  // access tokens, the Secrets Vault, custom Python tools/functions, Studio
  // Assistant, and managed-topic knowledge bases are all available to
  // Open platform users. Specific sub-pages that are enterprise-only
  // (e.g. /secrets/api-keys) are listed in ENTERPRISE_EXACT below.
  var ENTERPRISE_PREFIXES = [
    // Build — enterprise-only sub-groups
    '/configuration-builder/',
    '/variant-management/',
    '/analytics/test-suite/',
    // Channels (entire group is absent from the PLG sidebar) — voice tuning
    // pages, audio management, and webchat all land here. /widgets/ is
    // explicitly NOT locked: it covers Web Calling configuration, install,
    // test, and troubleshooting, which are the primary OP deployment flow.
    '/speech-recognition/', '/response-control/', '/audio-management/',
    '/webchat/',
    // Configure — enterprise-only sub-groups. Numbers is rendered in the
    // PLG sidebar but every telephony page (the Numbers landing page and
    // its sub-pages, including the Twilio guide) opens with an enterprise
    // banner because PSTN provisioning is enterprise-only.
    '/telephony/',
    '/call-data/conversations-api/',
    // API reference: lock the whole tree. PATs authenticate the Agents API
    // for OP users from the CLI, but the API reference pages themselves are
    // documentation we don't want self-serve users acting on directly.
    // /api/ is the older custom-integration doc set, also all enterprise.
    '/api-reference/',
    '/api/',
    '/analytics/csat/',
    '/user-management/',
    // Analytics — services not deployed on the Open platform cluster
    '/smart-analyst/',
    '/agent-analysis/',
    // Connected Knowledge is the Source Hub: live document syncing from
    // Confluence, SharePoint, Google Drive, etc. Enterprise-only — Open
    // platform users build knowledge with Managed Topics instead.
    '/connected-knowledge/',
    // Telephony providers under /integrations/voice/ — same gating as
    // /telephony/ (PSTN provisioning is contracted). Sub-pages under
    // amazon-connect/, sip/, etc. all locked by this prefix.
    '/integrations/voice/',
    // Agent settings: on the Open platform you change personality, rules,
    // model, etc. through Studio Assistant rather than the direct config
    // pages. The pages themselves are enterprise-flavoured (model picker,
    // BYOM, Language Hub, Agents API automation), so the whole directory
    // is locked. The Raven page is allowlisted below in SIMPLIFIED_INTROS
    // because it appears in the OP sidebar as 'What model does PolyAI use?'.
    '/agent-settings/'
  ];
  var ENTERPRISE_EXACT = [
    '/call-data/s3-to-s3',
    // Workspace-scoped API keys are enterprise-only — Open platform users use
    // personal access tokens (/secrets/personal-access-tokens) instead.
    '/secrets/api-keys',
    // (Model selection, BYOM, Language Hub, and the rest of /agent-settings/
    // are now covered by the /agent-settings/ prefix above. Raven stays open
    // via SIMPLIFIED_INTROS.)
    // PolyScore is a single page; the underlying scoring service isn't
    // deployed on the Open platform cluster.
    '/analytics/polyscore',
    // Dashboards: only the standard dashboard is part of the Open platform
    // (per the PLG_ANALYTICS_DASHBOARD branch in PlgContent). The custom-
    // dashboard builder and the safety dashboard are enterprise-only.
    '/analytics/dashboards/custom',
    '/analytics/dashboards/safety',
    // Code-driven flow pages — the no-code subdirectory stays visible.
    '/flows/triggering-flows',
    '/flows/example',
    '/flows/transition-functions',
    '/flows/object',
    '/flows/asr-biasing',
    '/flows/dtmf',
    '/flows/few-shot-prompting',
    // Managed-topic actions that depend on enterprise channels.
    '/managed-topics/how-to-setup-action/send-sms',
    '/managed-topics/how-to-setup-action/handoff',
    // Managed-service integration pages (not in Studio UI)
    '/integrations/managed-services',
    '/integrations/zoom',
    '/integrations/design-my-night', '/integrations/liveres',
    '/integrations/zendesk-ticketing-solutions',
    '/integrations/pci-pal', '/integrations/stripe',
    '/integrations/google-sheets', '/integrations/ideal-postcode',
    '/integrations/deepl',
    '/integrations/zendesk',
    '/integrations/salesforce',
    '/integrations/opentable',
    '/integrations/hotSOS',
    '/integrations/epic',
    '/integrations/gladly',
    '/integrations/snapcall'
  ];

  // Paths the lock check should treat as Open-platform-safe even if they'd
  // match an ENTERPRISE_PREFIXES prefix. Two kinds of entries:
  //   - "Mixed" intros that show in Open platform mode with developer content
  //     tucked behind an accordion (call-handoff, sms, flows).
  //   - Allowlisted pages under an otherwise-locked prefix (Raven, which is
  //     surfaced in the OP sidebar as 'What model does PolyAI use?' even
  //     though the parent /agent-settings/ directory is locked).
  var SIMPLIFIED_INTROS = [
    '/call-handoff/introduction',
    '/sms/introduction',
    '/flows/introduction',
    '/agent-settings/raven'
  ];

  // Pages that carry a "Code" / "Advanced" tag pill in the docs but are
  // first-class self-serve features on the Open platform. The sidebar
  // dimmer normally flags anything with one of those tag pills, so these
  // paths are an explicit exception.
  var SIMPLIFIED_ALLOWED_TAGGED = ['/extend/adk'];

  // Inverse of ENTERPRISE_PREFIXES: pages that are ONLY available on the
  // Open platform tier (e.g. Studio Assistant, which ships on the Open
  // platform and reaches enterprise via separate availability). When an
  // enterprise reader (not in Open platform mode) lands on one of these
  // pages, we inject an Open-platform-only banner that mirrors the
  // enterprise banner shown in the opposite direction.
  var OPEN_PLATFORM_ONLY_PATHS = [
    '/studio-assistant/introduction',
    '/studio-assistant/prompting',
    '/studio-assistant/usage-and-limits'
  ];

  function isOpenPlatformOnlyPath(pathname) {
    return OPEN_PLATFORM_ONLY_PATHS.indexOf(pathname) !== -1;
  }

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
    // Only touch the URL when the ?view=simplified flag actually needs to
    // change. Rewriting history on every page load — even when the URL was
    // already correct — was triggering Mintlify's SPA router to re-resolve
    // the route, causing the visible "initial paint then reload" flicker on
    // docs.poly.ai. Skip the replaceState entirely if the URL already
    // matches the desired state.
    try {
      var url = new URL(window.location.href);
      var hasFlag = url.searchParams.get('view') === 'simplified';
      if (on && !hasFlag) {
        url.searchParams.set('view', 'simplified');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      } else if (!on && hasFlag) {
        url.searchParams.delete('view');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    } catch (e) {}
    document.documentElement.dataset.simplified = on ? 'true' : 'false';
  }

  function updateButton(btn, simplified) {
    btn.setAttribute('aria-pressed', simplified);
    btn.title = simplified
      ? 'Exit free trial mode (show all docs)'
      : 'Enter free trial mode (scope to Agent Builder)';
    btn.innerHTML = simplified
      ? '<span class="simplify-toggle__icon">✦</span><span class="simplify-toggle__label">Free trial — exit</span>'
      : '<span class="simplify-toggle__icon">✦</span><span class="simplify-toggle__label">Free trial</span>';
    btn.classList.toggle('simplify-toggle--active', !!simplified);
  }

  // Mark sidebar section headers, sub-groups, tagged items, and path-matched
  // items so the stylesheet can dim them. This is purely a visual hint —
  // the items remain fully clickable. The opacity cascade dims every
  // descendant of a marked element, so we deliberately skip marking
  // descendants of an already-marked ancestor (otherwise opacity multiplies
  // and sub-pages end up unreadable).
  //
  // Runs after each navigation since Mintlify re-renders the sidebar.
  function markSidebarGroups() {
    function clearAll() {
      document.querySelectorAll('[data-simplified-enterprise="true"]').forEach(function (el) {
        delete el.dataset.simplifiedEnterprise;
      });
      document.querySelectorAll('[data-open-platform-only="true"]').forEach(function (el) {
        delete el.dataset.openPlatformOnly;
      });
      document.querySelectorAll('[data-open-platform-hidden="true"]').forEach(function (el) {
        delete el.dataset.openPlatformHidden;
      });
    }
    function hasMarkedAncestor(el) {
      var p = el.parentElement;
      while (p) {
        if (p.dataset && p.dataset.simplifiedEnterprise === 'true') return true;
        p = p.parentElement;
      }
      return false;
    }

    // Re-mark from a clean slate on every nav. Mintlify re-renders the
    // sidebar but may keep some nodes; clearing first prevents stale marks.
    clearAll();

    // 1. Top-level section headers — dim header + sibling list (which
    //    cascades to every sub-page in the group). Also flag groups that
    //    belong to the dedicated Open platform area (visible only when
    //    Open platform mode is on) and groups that should be hidden when
    //    Open platform mode is on.
    //
    // Resilience note: Mintlify's sidebar DOM has changed across theme
    // versions — the original `.sidebar-group-header` + `<h5>` pattern no
    // longer matches the live site (group titles render as <h3>/<h4>/<h5>
    // inside the sidebar nav). Instead of hard-coding a class, walk every
    // heading inside `#sidebar` / `#sidebar-content` (Mintlify's stable
    // ID hooks documented in customize/custom-scripts) and match by the
    // heading's text content. We then climb to the nearest LI/section
    // wrapper so the dataset attribute hides the header AND the page list.
    var sidebarRoot =
      document.getElementById('sidebar-content') ||
      document.getElementById('sidebar') ||
      document.querySelector('aside');
    if (sidebarRoot) {
      var groupNames = []
        .concat(ENTERPRISE_GROUPS, OPEN_PLATFORM_ONLY_GROUPS, OPEN_PLATFORM_KEEP_GROUPS);
      sidebarRoot.querySelectorAll('h2, h3, h4, h5, h6').forEach(function (heading) {
        var name = (heading.textContent || '').trim();
        if (!name || groupNames.indexOf(name) === -1) return;

        // Climb to the wrapper that contains both the heading and the
        // group's page list. Try the standard LI/section/nav containers,
        // then fall back to the parentElement so we always mark something.
        var wrapper =
          heading.closest('li') ||
          heading.closest('section') ||
          heading.closest('nav > div') ||
          heading.parentElement;
        if (!wrapper) return;

        if (ENTERPRISE_GROUPS.indexOf(name) !== -1) {
          wrapper.dataset.simplifiedEnterprise = 'true';
        }

        if (OPEN_PLATFORM_ONLY_GROUPS.indexOf(name) !== -1) {
          // Hidden by default in styles.css; revealed inside [data-simplified="true"].
          wrapper.dataset.openPlatformOnly = 'true';
        } else if (OPEN_PLATFORM_KEEP_GROUPS.indexOf(name) === -1 &&
                   ENTERPRISE_GROUPS.indexOf(name) === -1) {
          // Every other named group gets hidden when Open platform mode is
          // on, so the self-serve sidebar collapses down to just the
          // dedicated area.
          wrapper.dataset.openPlatformHidden = 'true';
        }
      });
    }

    // Legacy selector kept for older Mintlify themes that still render
    // `.sidebar-group-header` / `<h5>`. No-op on current builds.
    document.querySelectorAll('.sidebar-group-header').forEach(function (header) {
      var h5 = header.querySelector('h5');
      if (!h5) return;
      var name = h5.textContent.trim();
      var sibling = header.nextElementSibling;

      if (ENTERPRISE_GROUPS.indexOf(name) !== -1) {
        header.dataset.simplifiedEnterprise = 'true';
        if (sibling) sibling.dataset.simplifiedEnterprise = 'true';
      }

      if (OPEN_PLATFORM_ONLY_GROUPS.indexOf(name) !== -1) {
        header.dataset.openPlatformOnly = 'true';
        if (sibling) sibling.dataset.openPlatformOnly = 'true';
      } else if (OPEN_PLATFORM_KEEP_GROUPS.indexOf(name) === -1) {
        header.dataset.openPlatformHidden = 'true';
        if (sibling) sibling.dataset.openPlatformHidden = 'true';
      }
    });

    // 2. Collapsed sub-group buttons — strip tag pill text before matching,
    //    since tag spans are children of the button element.
    document.querySelectorAll('.sidebar-group li > button').forEach(function (btn) {
      var li = btn.closest('li');
      if (!li || hasMarkedAncestor(li)) return;
      var clone = btn.cloneNode(true);
      clone.querySelectorAll('[data-nav-tag]').forEach(function (el) { el.remove(); });
      var name = clone.textContent.trim();
      if (ENTERPRISE_SUBGROUPS.indexOf(name) !== -1) {
        li.dataset.simplifiedEnterprise = 'true';
      }
    });

    // 3. Expanded individual page items — dim by path prefix or Code/Advanced
    //    tag. Skip if an ancestor is already marked, or if the path is on the
    //    Open-platform allowlist (so e.g. /extend/adk stays bright despite
    //    carrying a "Code" tag pill).
    document.querySelectorAll('li[id]').forEach(function (li) {
      if (hasMarkedAncestor(li)) return;
      var id = li.id;
      if (SIMPLIFIED_ALLOWED_TAGGED.indexOf(id) !== -1) return;
      var pathMatch = isEnterprisePath(id);
      var tagEl = li.querySelector('[data-nav-tag="Code"], [data-nav-tag="Advanced"]');
      if (pathMatch || tagEl) {
        li.dataset.simplifiedEnterprise = 'true';
      }
    });
  }

  // Mark the global anchors (Home / Community / Blog from
  // navigation.global.anchors in docs.json) for hiding in Open platform
  // mode, so the self-serve experience reads as a single-product surface
  // with no escape hatches into the broader docs / community.
  //
  // In the Maple theme these render at the top of the sidebar (not inside
  // a <header> or top navbar), so we match by href pattern anywhere on the
  // page and mark the link plus its enclosing <li>. The CSS rule is scoped
  // to [data-simplified="true"], so marking links in body content is safe —
  // they only hide for Open platform users.
  function markGlobalAnchors() {
    var anchorHrefs = [
      'docs.poly.ai/home',
      'polyaijupiter-uki8686.slack.com',
      'poly.ai/resources'
    ];
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var match = anchorHrefs.some(function (frag) { return href.indexOf(frag) !== -1; });
      if (!match) return;
      a.dataset.openPlatformHidden = 'true';
      var li = a.closest('li');
      if (li) li.dataset.openPlatformHidden = 'true';
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

  // Inject a sticky upsell banner at the top of an enterprise page when the
  // user is in Open platform mode. Sets data-on-enterprise-page on <html> so the
  // stylesheet can gray out and disable pointer events on everything in the
  // main content area except the banner itself. Idempotent — won't double-
  // insert across SPA navs.
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
      '<div class="free-trial-enterprise-banner__handle" aria-hidden="true" title="Drag to move">⋮⋮</div>' +
      '<div class="free-trial-enterprise-banner__icon" aria-hidden="true">✦</div>' +
      '<div class="free-trial-enterprise-banner__body">' +
        '<p class="free-trial-enterprise-banner__title"><strong>Enterprise feature</strong></p>' +
        '<p class="free-trial-enterprise-banner__text">This page is here for reference, but it isn\'t part of the Agent Builder free trial. When you\'re ready to use it, talk to sales about an enterprise plan.</p>' +
        '<p class="free-trial-enterprise-banner__actions">' +
          '<a href="https://poly.ai/request-a-demo" class="free-trial-enterprise-banner__cta" target="_blank" rel="noopener">Talk to sales</a>' +
          '<button type="button" class="free-trial-enterprise-banner__exit" id="free-trial-enterprise-banner-exit">Free trial — exit</button>' +
        '</p>' +
      '</div>';

    // Insert at top of main content. Mintlify uses #content-area / main; fall
    // back to body if neither exists yet. The CSS pins the banner to the top
    // of its scroll container with position: sticky.
    var mount = document.querySelector('main') || document.querySelector('#content-area') || document.body;
    if (mount && mount.firstChild) {
      mount.insertBefore(banner, mount.firstChild);
    } else if (mount) {
      mount.appendChild(banner);
    }

    var exitBtn = banner.querySelector('#free-trial-enterprise-banner-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', function (e) {
        if (banner.dataset.dragSuppressClick === '1') {
          banner.dataset.dragSuppressClick = '';
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        e.preventDefault();
        setSimplified(false);
        document.querySelectorAll('.simplify-toggle').forEach(function (b) {
          updateButton(b, false);
        });
        markSidebarGroups();
        markNavbarTabs();
        markGlobalAnchors();
        applyDeveloperContent();
        applyEnterpriseBanner();
        applyOpenPlatformOnlyBanner();
        updateLandingPageStatus();
      });
    }

    applyStoredBannerPosition(banner);
    makeBannerDraggable(banner);
  }

  // Inject a sticky banner at the top of an Open-platform-only page when the
  // user is NOT in Open platform mode (the enterprise default). Mirrors
  // applyEnterpriseBanner but in the opposite direction. Sets
  // data-on-open-platform-only on <html> so the stylesheet can gray out the
  // page body while keeping the banner readable.
  function applyOpenPlatformOnlyBanner() {
    var existing = document.getElementById('open-platform-only-banner');
    var simplified = document.documentElement.dataset.simplified === 'true';
    var opOnly = isOpenPlatformOnlyPath(window.location.pathname);

    if (simplified || !opOnly) {
      if (existing) existing.remove();
      document.documentElement.removeAttribute('data-on-open-platform-only');
      return;
    }
    if (existing) return;

    document.documentElement.setAttribute('data-on-open-platform-only', 'true');

    var banner = document.createElement('aside');
    banner.id = 'open-platform-only-banner';
    banner.className = 'free-trial-enterprise-banner open-platform-only-banner';
    banner.setAttribute('role', 'note');
    banner.innerHTML =
      '<div class="free-trial-enterprise-banner__handle" aria-hidden="true" title="Drag to move">⋮⋮</div>' +
      '<div class="free-trial-enterprise-banner__icon" aria-hidden="true">✦</div>' +
      '<div class="free-trial-enterprise-banner__body">' +
        '<p class="free-trial-enterprise-banner__title"><strong>Agent Builder feature</strong></p>' +
        '<p class="free-trial-enterprise-banner__text">This is part of PolyAI Agent Builder — the self-serve, 60-day free trial of Agent Studio. Switch on Free trial mode to read these docs in context, or talk to sales about getting it on enterprise.</p>' +
        '<p class="free-trial-enterprise-banner__actions">' +
          '<button type="button" class="free-trial-enterprise-banner__cta" id="open-platform-only-banner-enter">Enter Free trial mode</button>' +
          '<a href="https://poly.ai/request-a-demo" class="free-trial-enterprise-banner__exit" target="_blank" rel="noopener">Talk to sales</a>' +
        '</p>' +
      '</div>';

    var mount = document.querySelector('main') || document.querySelector('#content-area') || document.body;
    if (mount && mount.firstChild) {
      mount.insertBefore(banner, mount.firstChild);
    } else if (mount) {
      mount.appendChild(banner);
    }

    var enterBtn = banner.querySelector('#open-platform-only-banner-enter');
    if (enterBtn) {
      enterBtn.addEventListener('click', function (e) {
        if (banner.dataset.dragSuppressClick === '1') {
          banner.dataset.dragSuppressClick = '';
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        e.preventDefault();
        setSimplified(true);
        document.querySelectorAll('.simplify-toggle').forEach(function (b) {
          updateButton(b, true);
        });
        markSidebarGroups();
        markNavbarTabs();
        markGlobalAnchors();
        applyDeveloperContent();
        applyEnterpriseBanner();
        applyOpenPlatformOnlyBanner();
        updateLandingPageStatus();
      });
    }

    applyStoredBannerPosition(banner);
    makeBannerDraggable(banner);
  }

  // Wrap .developer-only sections in a <details> accordion in Open platform mode.
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
      markGlobalAnchors();
      applyDeveloperContent();
      applyEnterpriseBanner();
      applyOpenPlatformOnlyBanner();
      updateLandingPageStatus();
    });

    makeDraggable(btn);
    return btn;
  }

  // ── Drag support ──────────────────────────────────────────────────────────
  // The pill lives at a fixed top-right position by default. Users can drag
  // it anywhere in the viewport; the position is stored in localStorage and
  // restored on reload. A small movement threshold ensures a plain click still
  // toggles Open platform mode without being swallowed by the drag handler.

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

  // ── Banner drag support ─────────────────────────────────────────────────
  // The lock banner uses the same drag mechanism as the pill but with its own
  // localStorage key and a wider clamp footprint. Defaults to a centered-top
  // position (set in CSS); after the first drag the explicit left/top win.

  function readStoredBannerPosition() {
    try {
      var raw = window.localStorage.getItem(BANNER_POSITION_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (typeof parsed.left !== 'number' || typeof parsed.top !== 'number') return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeStoredBannerPosition(pos) {
    try {
      window.localStorage.setItem(BANNER_POSITION_KEY, JSON.stringify(pos));
    } catch (e) {}
  }

  function applyStoredBannerPosition(el) {
    var pos = readStoredBannerPosition();
    if (!pos) return;
    var rect = el.getBoundingClientRect();
    var clamped = clampPosition(pos.left, pos.top, rect.width || 340, rect.height || 110);
    el.style.left = clamped.left + 'px';
    el.style.top = clamped.top + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.style.transform = 'none';
  }

  function makeBannerDraggable(el) {
    // Only the handle initiates drags; clicks inside the body/buttons don't.
    var handle = el.querySelector('.free-trial-enterprise-banner__handle');
    if (!handle) return;

    var startX = 0, startY = 0;
    var originLeft = 0, originTop = 0;
    var dragging = false;
    var pointerId = null;

    handle.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      var rect = el.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      originLeft = rect.left;
      originTop = rect.top;
      pointerId = e.pointerId;
      dragging = false;
    });

    handle.addEventListener('pointermove', function (e) {
      if (pointerId === null || e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!dragging && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      if (!dragging) {
        dragging = true;
        el.classList.add('free-trial-enterprise-banner--dragging');
        try { handle.setPointerCapture(pointerId); } catch (err) {}
      }
      var rect = el.getBoundingClientRect();
      var next = clampPosition(originLeft + dx, originTop + dy, rect.width, rect.height);
      el.style.left = next.left + 'px';
      el.style.top = next.top + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.transform = 'none';
      e.preventDefault();
    });

    function endDrag(e) {
      if (pointerId === null) return;
      if (e && e.pointerId !== pointerId) return;
      try { handle.releasePointerCapture(pointerId); } catch (err) {}
      pointerId = null;
      if (dragging) {
        el.classList.remove('free-trial-enterprise-banner--dragging');
        var rect = el.getBoundingClientRect();
        writeStoredBannerPosition({ left: rect.left, top: rect.top });
        // Swallow the click that would otherwise hit any nested button after
        // a drag — banner buttons (Talk to sales, Exit, Enter) check this.
        el.dataset.dragSuppressClick = '1';
        setTimeout(function () { el.dataset.dragSuppressClick = ''; }, 0);
      }
      dragging = false;
    }

    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
  }

  // Re-clamp saved position into view on resize (e.g. orientation change,
  // browser window shrunk) so the pill and lock banner can never end up
  // off-screen.
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
    document.querySelectorAll('.free-trial-enterprise-banner').forEach(function (el) {
      var pos = readStoredBannerPosition();
      if (!pos) return;
      var rect = el.getBoundingClientRect();
      var clamped = clampPosition(pos.left, pos.top, rect.width, rect.height);
      el.style.left = clamped.left + 'px';
      el.style.top = clamped.top + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.transform = 'none';
      if (clamped.left !== pos.left || clamped.top !== pos.top) {
        writeStoredBannerPosition(clamped);
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

  // Wires up the explicit Enter / Exit buttons on the /platform/open-platform
  // landing page. Shows a confirmation panel once the user is in Open platform mode.
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
        // Land on the home page in Open platform mode so the user sees the
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
      markGlobalAnchors();
        applyDeveloperContent();
        applyEnterpriseBanner();
      applyOpenPlatformOnlyBanner();
        updateLandingPageStatus();
      });
    }
    updateLandingPageStatus();
  }

  // Run our DOM passes synchronously on nav, then once more after the next
  // animation frame in case Mintlify re-renders the sidebar after the route
  // resolves. The previous 150ms setTimeout meant every SPA navigation
  // visibly flashed the unfiltered sidebar for ~one frame before the dim/
  // hide rules kicked in. Two tight passes (sync + rAF) eliminates that
  // without the long delay.
  function runPasses() {
    injectToggle();
    markSidebarGroups();
    markNavbarTabs();
    markGlobalAnchors();
    applyDeveloperContent();
    applyEnterpriseBanner();
    applyOpenPlatformOnlyBanner();
    wireLandingPageButtons();
  }
  function onNav() {
    runPasses();
    requestAnimationFrame(runPasses);
    observeSidebar();
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
    document.addEventListener('DOMContentLoaded', onNav);
  } else {
    onNav();
  }

  // Re-run on Mintlify SPA navigations. We previously monkey-patched
  // history.pushState to (a) trigger onNav and (b) inject ?view=simplified
  // into the outgoing URL. That second behaviour was rewriting URLs Mintlify's
  // router was in the middle of resolving and produced a visible
  // "double-paint" on docs.poly.ai (and made the search bar unusable, since
  // every keystroke-driven navigation got its URL silently changed).
  //
  // Detect SPA navigations by polling location.pathname + location.search
  // instead. The check is cheap and runs only after a real URL change. The
  // preference is still kept in localStorage, so Open platform mode survives
  // navigation without needing the query param on every link.
  var _lastUrl = window.location.pathname + window.location.search;
  function checkUrlChange() {
    var current = window.location.pathname + window.location.search;
    if (current !== _lastUrl) {
      _lastUrl = current;
      onNav();
    }
  }
  // Hook the existing history methods without rewriting the URL.
  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () {
      var ret = orig.apply(this, arguments);
      checkUrlChange();
      return ret;
    };
  });
  window.addEventListener('popstate', onNav);
  // Fallback: poll for URL changes the SPA may make outside history methods.
  setInterval(checkUrlChange, 500);

  // Watch the sidebar for re-renders. When Mintlify replaces the sidebar
  // DOM after navigation (or as a result of search interactions), re-apply
  // the dim/hide marks without waiting for the next URL change. This is
  // what makes the experience feel non-flickery: as soon as the sidebar
  // exists, it's already marked.
  function observeSidebar() {
    var sidebarRoot =
      document.getElementById('sidebar-content') ||
      document.getElementById('sidebar') ||
      document.querySelector('aside');
    if (!sidebarRoot || sidebarRoot.dataset.simplifyObserved === '1') return;
    sidebarRoot.dataset.simplifyObserved = '1';
    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        markSidebarGroups();
        markNavbarTabs();
        markGlobalAnchors();
      });
    });
    observer.observe(sidebarRoot, { childList: true, subtree: true });
  }
  // Try to attach the observer immediately; onNav re-attaches on every
  // route change in case the sidebar root node itself was replaced.
  observeSidebar();

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
})();
