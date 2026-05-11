# PolyAI Support-Agent Knowledge Wiki — Schema

This wiki is the **structured knowledge layer** for an embedded LLM support agent that helps PolyAI customers fix errors in their own agents. It's a synthesis of `docs.poly.ai` (the Mintlify source for which sits in the parent `polyai-mintlify-doc/` folder), reshaped into the form an LLM agent actually wants to consume: entity pages, troubleshooting articles, capability concepts.

The published Mintlify docs are the **raw layer** — immutable, canonical, human-readable. This wiki is the **compiled layer** — agent-readable, troubleshooting-shaped, cross-referenced. Customer-facing answers ultimately cite back into the published docs.

This wiki is internal. It lives under `_llm-wiki/` so the underscore prefix keeps it out of the Mintlify build. **Do not add anything here to `docs.json`.**

## Purpose

Be the knowledge a customer-facing LLM agent reads when answering: _"my PolyAI agent is doing X, why and how do I fix it?"_

Adjacent (less primary): be a useful internal map of the product for anyone at PolyAI.

## Three layers

| Layer | Lives at | Mutable? | Owner |
|---|---|---|---|
| **Raw** | the parent `polyai-mintlify-doc/` Mintlify content (sibling of this folder), plus anything we drop into `_llm-wiki/raw/` | No — read-only canonical source | Tech writing team owns the published docs |
| **Wiki** | `_llm-wiki/wiki/` | Yes — LLM-maintained | Future ingest sessions |
| **Schema** | this file (`CLAUDE.md`) | Co-evolved with humans | Aaron / whoever maintains the wiki |

## Wiki structure

```
wiki/
  index.md                ← catalog of every page, one-liner each
  log.md                  ← chronological ingests / queries / lint passes
  entities/               ← stable nouns the agent refers to constantly
                            (Agent, Topic, Flow, Tool, Variant, etc.)
  concepts/               ← capabilities, design patterns, cross-cutting ideas
  troubleshooting/        ← error → cause → fix articles, the agent's bread & butter
  channels/               ← surfaces (webchat widget, voice, telephony, SMS)
  api/                    ← API surface summaries (one page per API)
  reference/              ← shallow stubs for sections we haven't deep-ingested yet
  synthesis/              ← cross-cutting thinking, project notes, open questions
```

### Entity page shape

Every entity page should have the same shape so the agent can rely on it:

1. **What it is.** One paragraph, plain language.
2. **Where it lives in the product.** Studio location, API endpoints.
3. **Common failure modes.** Bullet list — "If the customer reports X, the cause is usually Y."
4. **Authoritative docs.** Links to the canonical Mintlify pages (`https://docs.poly.ai/<path>`).
5. **Related.** Links to other wiki pages.

### Troubleshooting article shape

1. **Symptom.** What the customer sees / reports.
2. **Likely causes.** Ranked, with diagnostics for each.
3. **Fix.** Step-by-step.
4. **Prevention.** What to check next time.
5. **Source.** Links to the canonical Mintlify content this distills.

## Operations

**Ingest.** A new section of the docs — or a customer support thread, retrospective, or release note — gets read; the LLM identifies entity / concept / troubleshooting pages it touches; it updates them and appends a log entry.

**Query.** Read `index.md`, then drill into the right page. Customer-facing answers cite back to canonical docs URLs (`https://docs.poly.ai/<path>`), not to wiki pages, since wiki pages may diverge slightly from canonical.

**Lint.** Periodic health check: orphan pages, broken links, contradictions, stale claims, troubleshooting articles that reference deleted features.

## Conventions

- **Cite back to docs.poly.ai.** Every claim that came from the published docs gets a link. Format: `_See: [<page title>](https://docs.poly.ai/<path>)._`
- **Don't paraphrase the docs into a new authoritative page.** The published docs are canonical; this wiki distills, organises, and cross-references — it doesn't replace.
- **Wiki page urls are local relative paths.** `[Agent entity](../entities/agent.md)`. Doc URLs are absolute `https://docs.poly.ai/...`.
- **Confidence tags inline:** `_(unverified)_`, `_(speculative)_`, `_(decision pending)_`.
- **Open questions go in `synthesis/open-questions.md`** rather than getting guessed.
- **Coverage discipline:** when a page is a stub, label it `_Status: stub — extend in next ingest pass._`

## What's covered (as of the latest ingest)

See [`wiki/log.md`](wiki/log.md) for the running record. Honest summary: the corpus is 305 .md/.mdx files, 33,486 lines. No single ingest pass can do them all justice. The wiki is built incrementally; pages are tagged with their depth status.

## Relationship to the LLM-support-page initiative

The Quicken pitch / support-page-redesign material — which is what kicked this wiki off — lives folded into [`wiki/synthesis/llm-support-page-initiative/`](wiki/synthesis/llm-support-page-initiative/). This wiki **is** the knowledge base such an embedded support agent would draw on. The initiative pages there describe the productisation thinking; the rest of this wiki is the substance the agent would actually read.
