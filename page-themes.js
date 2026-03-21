// Per-page background theming for PolyAI docs.
// Technical (code-focused) pages get a barely-there warm tint in light mode.
// Standard (no-code / UI-focused) pages get a barely-there cool tint in light mode.
// Dark mode is left completely untouched — no tinting.
//
// Maintenance: when adding new pages, add the path to the appropriate list below.
// Paths should match the URL path without trailing slash (e.g., '/function/introduction').
(function () {
  var technicalPaths = [
    // Developer landing
    '/extend/introduction',

    // Tools / Functions
    '/function/introduction',
    '/function/how-to-setup',
    '/function/using-functions-in-knowledge-base',
    '/function/start-function',
    '/function/end-function',
    '/function/return-values',
    '/function/delay-control',
    '/function/variables',
    '/function/import-library',

    // Function classes
    '/function/classes',
    '/function/classes/conv-object',
    '/function/classes/conv-utils',
    '/function/classes/conv-api',
    '/function/classes/conv-log',
    '/function/classes/asr-from-conv',
    '/function/classes/history',
    '/function/classes/voice',
    '/function/classes/agent-memory',

    // Secrets
    '/secrets/introduction',
    '/secrets/how-to-setup',
    '/secrets/how-to-access-control',
    '/secrets/how-to-invoke-from-kb',

    // Code-driven flows
    '/flows/transition-functions',
    '/flows/object',
    '/flows/asr-biasing',
    '/flows/dtmf',
    '/flows/few-shot-prompting',

    // Flows pages that explicitly require Python
    '/flows/triggering-flows',
    '/flows/example',

    // Configuration builder (schema definition requires code)
    '/configuration-builder/introduction',

    // Voice pages requiring Python
    '/voice/add-a-new-voice',

    // API integrations (used with conv.api in functions)
    '/api/introduction',

    // Knowledge action: invoke function
    '/managed-topics/how-to-setup-action/function-call',

    // Call data — API and export pages
    '/call-data/conversations-api/handoff-states',
    '/call-data/conversations-api/list-conversations',
    '/call-data/s3-to-s3',

    // Academy — function maintenance
    '/learn/maintain/function-maintenance',

    // API reference — all endpoints and introductions
    '/api-reference/introduction',
    '/api-reference/chat/introduction',
    '/api-reference/chat/endpoint/create-a-chat',
    '/api-reference/chat/endpoint/respond-to-a-chat',
    '/api-reference/chat/endpoint/close-a-chat',
    '/api-reference/conversations/introduction',
    '/api-reference/conversations/v3/endpoint/get-conversations',
    '/api-reference/conversations/v1/endpoint/get-conversations',
    '/api-reference/handoff/introduction',
    '/api-reference/handoff/endpoint/get-handoff',
    '/api-reference/concurrent-calls/introduction',
    '/api-reference/concurrent-calls/endpoint/get-max-concurrent',
    '/api-reference/dni/introduction',
    '/api-reference/dni/endpoint/dni-reservation',
    '/api-reference/alerts/introduction',
    '/api-reference/alerts/endpoint/create-alert-rule',
    '/api-reference/alerts/endpoint/list-alert-rules',
    '/api-reference/alerts/endpoint/get-alert-rule',
    '/api-reference/alerts/endpoint/update-alert-rule',
    '/api-reference/alerts/endpoint/delete-alert-rule',
    '/api-reference/alerts/endpoint/list-active-alerts',
    '/api-reference/webhooks/introduction',
    '/api-reference/webhooks/endpoint/create-webhook-endpoint',
    '/api-reference/webhooks/endpoint/list-webhook-endpoints',
    '/api-reference/webhooks/endpoint/get-webhook-endpoint',
    '/api-reference/webhooks/endpoint/update-webhook-endpoint',
    '/api-reference/webhooks/endpoint/delete-webhook-endpoint',
    '/api-reference/webhooks/endpoint/rotate-webhook-signing-secret',
    '/api-reference/external-events/introduction',
    '/api-reference/external-events/endpoint/webhook',
    '/api-reference/external-events/endpoint/bridge-ended',
    '/api-reference/outbound/introduction',
    '/api-reference/outbound/endpoint/trigger-call',
    '/api-reference/outbound/endpoint/get-call-status',
    '/api-reference/webrtc-gateway/introduction',
    '/api-reference/webrtc-gateway/ws/signaling'
  ];

  // Convert to a Set for fast lookup
  var technicalSet = {};
  for (var i = 0; i < technicalPaths.length; i++) {
    technicalSet[technicalPaths[i]] = true;
  }

  // Light-mode tint colors (nearly imperceptible)
  var TECHNICAL_BG = '#fdfcfc'; // warm
  var STANDARD_BG  = '#fcfdfc'; // cool

  function isDarkMode() {
    return document.documentElement.classList.contains('dark') ||
           (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches &&
            !document.documentElement.classList.contains('light'));
  }

  function applyPageTheme() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var body = document.body;
    var html = document.documentElement;
    body.classList.remove('page-technical', 'page-standard');
    html.classList.remove('page-technical', 'page-standard');

    var isTechnical = !!technicalSet[path];
    var cls = isTechnical ? 'page-technical' : 'page-standard';
    body.classList.add(cls);
    html.classList.add(cls);

    // Apply background inline for reliability — CSS may not
    // win specificity against Mintlify's own styles.
    if (isDarkMode()) {
      html.style.removeProperty('background-color');
    } else {
      html.style.setProperty('background-color', isTechnical ? TECHNICAL_BG : STANDARD_BG, 'important');
    }
  }

  // Apply on initial load
  applyPageTheme();

  // Re-apply on client-side navigation (Mintlify uses SPA-style routing)
  // and when dark/light mode toggles (class change on <html>)
  var lastPath = window.location.pathname;
  var lastDark = isDarkMode();
  var observer = new MutationObserver(function () {
    var pathChanged = window.location.pathname !== lastPath;
    var darkChanged = isDarkMode() !== lastDark;
    if (pathChanged || darkChanged) {
      lastPath = window.location.pathname;
      lastDark = isDarkMode();
      applyPageTheme();
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.body, { childList: true, subtree: true });

  // Also handle system dark mode changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      lastDark = isDarkMode();
      applyPageTheme();
    });
  }
})();
