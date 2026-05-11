# Troubleshooting: connected knowledge issues

See [Connected Knowledge](../entities/connected-knowledge.md) for the entity definition. Connected sources are powerful but lossy — most issues come from chunking and sync semantics that aren't obvious.

---

## Symptom: Connected knowledge source isn't being used

**Likely causes (ranked):**

1. Source not synced after the upstream content changed.
2. Source disabled in the active environment or variant.
3. Document chunks poorly — relevant content split across chunks the retriever doesn't reassemble.
4. A [Topic](../entities/topic.md) is matching first and winning. Topics always beat Connected Knowledge on conflict.

**Fix:**

1. `Build > Knowledge > Connected` → click `Update` / `Sync` on the source.
2. Verify the source is enabled for the [environment](../entities/environment.md) and [variant](../entities/variant.md) under test.
3. If sync looks fine, restructure the source: smaller, tighter docs whose related content sits together. Avoid sprawling docs with relevant sections far apart.
4. Use [Conversation Diagnosis](../concepts/conversation-review.md) to confirm whether a Topic is winning.

**Prevention:** sync before publishing. Avoid loosely structured documents. Audit source freshness weekly for high-traffic sources.

**Source:** [Troubleshoot: connected knowledge](https://docs.poly.ai/troubleshoot/faq-connected-knowledge), [Maintain: connected knowledge](https://docs.poly.ai/learn/maintain/knowledge-connected-knowledge).

---

## Symptom: "Failed to sync" error

**Likely causes:**

1. URL inaccessible / requires auth.
2. File too large.
3. Integration credential expired (Zendesk, Gladly, etc.).

**Fix:** test the URL in incognito; check the file size limit; rotate the integration credential.

**Prevention:** monitor integration credential expiry; document source purposes for the team so credentials get refreshed before they break.

**Source:** [Maintain: connected knowledge](https://docs.poly.ai/learn/maintain/knowledge-connected-knowledge).

---

## Symptom: Content seems outdated even after sync

**Likely cause:** cached version still being served, or the source URL itself is serving stale content.

**Fix:** wait 5 minutes and sync again. Check the source URL directly to confirm freshness.

**Prevention:** use stable source URLs; document each source's update cadence.

**Source:** [Maintain: connected knowledge](https://docs.poly.ai/learn/maintain/knowledge-connected-knowledge).

---

## Symptom: Customer expects an SMS / handoff to fire from a connected source

**Cause:** Connected Knowledge is read-only — no actions.

**Fix:** if an action is needed, create a [Topic](../entities/topic.md) for the same content with the appropriate [Action](../entities/action.md).

**Prevention:** Connected Knowledge for static FAQ; Topics for anything with a side effect.

**Source:** [Troubleshoot: connected knowledge](https://docs.poly.ai/troubleshoot/faq-connected-knowledge).
