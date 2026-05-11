# Open questions

Living list. Add when an ingest surfaces a gap. Remove when the question is resolved (and file the answer in the appropriate page).

Two zones: questions about the product wiki itself, and questions specific to the [LLM-support-page initiative](llm-support-page-initiative/project-brief.md).

---

## Wiki content gaps (next ingest passes)

### Where coverage is shallow

- **API reference** — only an [overview page](../api/overview.md) so far. 86 files in `api-reference/` aren't yet ingested. Highest-value endpoints for deeper coverage: publish/promote/rollback (deployments), list-conversations, get-handoff, webhook lifecycle.
- **Per-integration depth** — [`integrations-overview`](../concepts/integrations-overview.md) lists everything but goes deep on none. Twilio, Salesforce, Zendesk, OpenTable, Stripe likely deserve their own pages given customer overlap.
- **Tool classes** — the `tools/classes/*` files (`conv-object`, `conv-utils`, `conv-api`, `conv-log`, `asr-from-conv`, `history`, `voice`, `agent-memory`) are referenced from [Tool](../entities/tool.md) but not deeply ingested.
- **Worked examples** — no end-to-end recipes in the wiki yet (a complete Topic-with-action build, a complete Flow with entity collection, a complete handoff with custom SIP headers). These are the highest-leverage additions for an actual support agent.
- **Release notes** — [reference page](../reference/releases.md) is a stub; recent breaking changes from 26.04 / 26.03 / 26.02 should be sweep-checked against entity pages.
- **Test suite** — [concept page](../concepts/test-suite.md) covers the basics but doesn't go into authoring patterns or CI gating examples.

### Open factual / definitional questions surfaced during ingest

- The Studio terminology of **Project**, **Agent**, **Branch**, and **Workspace** could be clarified further — entity page is a working answer but worth reviewing with the eng/product team.
- **Connected knowledge chunking** — exact chunk size and overlap (digest said ~2000 chars / ~500 overlap) — is this still current and configurable?
- **Audio cache invalidation by model_id** — the workaround (prepend model_id to voice_id) — is this still required or has the platform improved?
- **Variant default behaviour** when the first variant is deleted — whether the next variant becomes default or whether an explicit selection is required. Worth confirming.

### Conventions to settle

- **How aggressively should the wiki paraphrase the docs?** Current convention: distil but don't replace. Consider revisiting if the wiki diverges or if customers start citing wiki paraphrasing back to PolyAI as if it were canonical.
- **Citation format.** Current: `_See: [<page>](https://docs.poly.ai/<path>)._` Could be tightened; review when there's enough volume to test the agent's behaviour.

---

## LLM-support-page initiative open questions

These tracked the original Quicken-pitch work; some still apply now that the wiki is the broader knowledge layer that initiative would feed.

### Roles and ownership

- Formal roles for [Christopher Osborne](llm-support-page-initiative/people-christopher-osborne.md) and [Frances Erasmus](llm-support-page-initiative/people-frances-erasmus.md).
- Owner of the [Quicken pitch](llm-support-page-initiative/quicken-pitch-plan.md) deck.
- Engineering owner for the prototype.
- Design lead.
- Date and attendees of the ideation session.

### PolyAI tech and content

- Does [PolyAI's web agent](llm-support-page-initiative/concept-web-agent-technology.md) currently support image input out of the box, or is that a build? See [image upload](llm-support-page-initiative/concept-image-upload.md).
- Can the [docs.poly.ai AI-assisted search](llm-support-page-initiative/concept-docs-polyai-ai-search.md) embed accept customer-supplied knowledge sources, or is it tied to docs.poly.ai content only?
- Constraints on embedding the AI-assisted search outside docs.poly.ai (auth, rate limits, branding, terms)?
- Realistic effort to brush up [`/maintain/` content](llm-support-page-initiative/concept-maintain-content.md) for agent use.

### Quicken

- What does Quicken's current support page look like?
- Languages of their users.
- Volume and quality of their existing FAQ / help content.
- Their human-support stack: agents + scheduling system (Zendesk, Salesforce Service Cloud, internal)?
- Quicken contact, how the relationship started, commercial framing of the pitch.

### Design

- Conversation-only page, or chat-plus-browse hybrid?
- How visible is the agent's reasoning?
- Free-form vs guided quick-replies.
- PolyAI-visible vs customer-only branding.
- Translation safety: human-review pass for procedural content?

### Pitch tactics

- Real demo content, generic finance content, or PolyAI's own content as placeholder? See [prototype scope](llm-support-page-initiative/prototype-scope.md).
- Mock the handoff or wire to something real for the demo?
- One presenter or two? Frances + Christopher?
