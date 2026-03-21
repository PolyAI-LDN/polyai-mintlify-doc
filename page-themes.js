// Applies a CSS class to the page body based on whether the current page
// is a technical (code-focused) page or a non-technical page.
// Technical pages get "page-technical", all others get "page-standard".
(function () {
  var technicalPaths = [
    '/configuration-builder/introduction',
    '/extend/introduction',
    '/flows/asr-biasing',
    '/flows/dtmf',
    '/flows/few-shot-prompting',
    '/flows/object',
    '/flows/transition-functions',
    '/function/classes',
    '/function/classes/agent-memory',
    '/function/classes/asr-from-conv',
    '/function/classes/conv-api',
    '/function/classes/conv-log',
    '/function/classes/conv-object',
    '/function/classes/conv-utils',
    '/function/classes/history',
    '/function/classes/voice',
    '/function/delay-control',
    '/function/end-function',
    '/function/how-to-setup',
    '/function/import-library',
    '/function/introduction',
    '/function/return-values',
    '/function/start-function',
    '/function/using-functions-in-knowledge-base',
    '/function/variables',
    '/learn/maintain/function-maintenance',
    '/secrets/how-to-access-control',
    '/secrets/how-to-invoke-from-kb',
    '/secrets/how-to-setup',
    '/secrets/introduction',
    '/voice/add-a-new-voice'
  ];

  function applyPageTheme() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var body = document.body;
    body.classList.remove('page-technical', 'page-standard');
    if (technicalPaths.indexOf(path) !== -1) {
      body.classList.add('page-technical');
    } else {
      body.classList.add('page-standard');
    }
  }

  // Apply on initial load
  applyPageTheme();

  // Re-apply on client-side navigation (Mintlify uses SPA-style routing)
  var lastPath = window.location.pathname;
  var observer = new MutationObserver(function () {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      applyPageTheme();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
