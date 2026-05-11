# Support-agent knowledge shape

What does an LLM agent that helps customers fix their PolyAI agents actually need to read?

This synthesis distils what we learned during the first deep ingest into a working answer.

## The seven shapes that matter

1. **Entity pages — stable nouns.** Every PolyAI concept the customer talks about (Topic, Flow, Tool, Variant, etc.) needs one canonical page the agent can refer to. Fixed structure: what it is → where it lives → common failure modes → authoritative docs.
2. **Troubleshooting articles — symptom → cause → fix.** This is the agent's bread and butter. Customers describe symptoms; the agent matches to a likely cause and walks them through the fix. The existing `troubleshoot/faq-*.mdx` files are already in this shape — that's the template.
3. **Concept pages — capabilities and patterns.** Cross-cutting things that aren't a single noun: PolyScore, response control, the maintenance playbook, design principles. The agent uses these for "how should I think about X?" questions.
4. **Channel pages — the surfaces.** Webchat widget, voice, telephony, SMS, call handoff. These are where the integration-shaped issues live (CSP, SIP methods, A2P 10DLC, etc.).
5. **API surface map.** A summary of the API families, with links into per-endpoint canonical docs. Most customers won't read API docs in chat — but enough will that it needs to exist.
6. **Reference pages — shallow but linked.** Dashboards, call data, ADK, releases, legal. The agent doesn't go deep here in chat but needs to know what each is and where to point.
7. **Synthesis — internal thinking.** Open questions, project plans, the LLM-support-page initiative material. The agent doesn't typically draw on these for customer answers, but they keep the wiki coherent for humans maintaining it.

## What the agent should and shouldn't do

**Should:** match a customer's problem to a troubleshooting article, walk them through the fix step by step, cite back to canonical Mintlify docs at the end, escalate cleanly when stuck.

**Should not:** invent fixes that aren't in the wiki; answer commercial questions; answer compliance / legal questions; speculate on roadmap; confidently give wrong advice when sources disagree.

## The fidelity question

Aaron flagged early on that some of the existing PolyAI content was written for maintenance-task readers, not customer-facing readers. That fidelity gap matters here:

- **Troubleshoot/FAQ pages** — already customer-shaped. Use as-is.
- **Maintain/ pages** — internally focused. Useful but need editing for tone before they're customer-facing.
- **API reference** — fine for technical audiences, less useful in conversational flow.
- **Release notes** — terse; the agent should summarise rather than quote.

## What's missing

A lot. The wiki is honest about depth (see `index.md` and the `_Status: stub_` markers). Highest-value gaps to close in subsequent ingest passes:

- Worked examples — concrete, runnable end-to-end recipes for common builds (a complete topic with action, a complete flow with entities, a complete handoff).
- Per-endpoint API pages for the most-used endpoints.
- Specific integration deep-dives for Twilio, Salesforce, Zendesk.
- Known-issues snapshot from current release.

## Related

- [Maintenance playbook](../concepts/maintenance-playbook.md)
- [Top failure modes](top-failure-modes.md)
- [Open questions](open-questions.md)
- [LLM support page initiative](llm-support-page-initiative/project-brief.md) — the customer-facing productisation thinking
