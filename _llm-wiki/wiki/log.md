# Log

Chronological, append-only. Each entry begins with `## [YYYY-MM-DD] <op> | <title>` so the log stays greppable: `grep "^## \[" log.md | tail -10`.

## [2026-04-27] ingest | Slack thread — support page redesign

- Source: `raw/2026-04-27-slack-support-page-redesign.md`
- Pages touched: created the wiki from scratch — schema, index, log, 4 entity pages, 7 concept pages, 5 synthesis pages.
- Notes: Initial build. Three voices in the source (Christopher Osborne, Aaron Forinton, Frances Erasmus). Concrete deadline: Quicken pitch on Wed 6 May 2026 — wiki anchored around that timeline. Roles for Christopher and Frances marked as unconfirmed.

## [2026-04-27] reshape | Re-anchored wiki on docs.poly.ai

- Source: `polyai-mintlify-doc/` (the Mintlify content sibling of `_llm-wiki/`); `docs.json` for the canonical IA.
- Purpose pivot: from "wiki about the LLM-support-page initiative" to "structured knowledge layer for an embedded support agent that helps PolyAI customers fix errors in their own agents." Initiative material folded into `synthesis/llm-support-page-initiative/`; Slack-driven entity pages (people, Quicken) moved there too — they don't belong in the product wiki proper.
- Schema: rewrote `CLAUDE.md` for the new purpose. Added new top-level `wiki/` subfolders: `entities/`, `channels/`, `concepts/`, `troubleshooting/`, `api/`, `reference/`. Synthesis subfolder retained.
- Pages touched: 38 created across the new structure. Specifically:
  - 12 entity pages: Agent, Project-and-Branch, Topic, Connected-Knowledge, Action, Rule, Flow, Tool, Variant, Environment, Deployment, Multilingual.
  - 8 channel pages: Webchat-widget, Voice, Voice-library, Telephony, Twilio, Outbound-calling, SMS, Call-handoff.
  - 12 concept pages: Response-control, Audio-management, Speech-recognition, Secrets-and-API-keys, User-management, Integrations-overview, PolyScore, Conversation-review, Smart-Analyst-vs-Agent-Analysis, Test-suite, Design-principles, Maintenance-playbook.
  - 8 troubleshooting articles: managed-topic, connected-knowledge, rules-and-personality, actions-and-tools, environment-and-deployment, voice-and-audio, multilingual, performance-and-technical.
  - 1 API overview, 5 reference stubs (dashboards-and-metrics, extend-with-code, call-data, releases, legal-and-compliance).
  - 2 new synthesis pages: support-agent-knowledge-shape, top-failure-modes; open-questions rewritten.
  - Index and this log rewritten.
- Coverage discipline: API-reference pages (86 files) are summarised in one overview only; reference stubs are explicitly marked. Per-page status tags in place.
- Sources informing this build:
  - `troubleshoot/faq*.mdx` (8 files) — primary input for troubleshooting articles.
  - `learn/maintain/*.mdx` (13 files) — primary input for maintenance playbook + troubleshooting.
  - `learn/guides/design-principles.mdx` — primary input for design-principles concept page.
  - `analytics/`, `agent-analysis/`, `smart-analyst/` — input for PolyScore, Conversation-review, Smart-Analyst pages.
  - `agent-settings/`, `managed-topics/`, `connected-knowledge/`, `flows/`, `tools/`, `variant-management/`, `environments-and-versions/`, `glossary/`, `essentials/order.mdx`, `platform/` — input for entity pages.
  - `webchat/`, `voice/`, `telephony/`, `sms/`, `call-handoff/`, `response-control/`, `audio-management/`, `speech-recognition/`, `secrets/`, `user-management/`, `integrations/` — input for channel and concept pages.
- Out of scope this pass (recorded in `synthesis/open-questions.md`): per-endpoint API pages; per-integration deep-dives; tool classes; worked examples; release-note breaking changes sweep.

## [2026-04-27] lint | First lint after the docs.poly.ai pivot

- Walked every page; verified relative cross-references resolve.
- Confirmed every wiki page is reachable from `index.md`.
- Tagged shallow pages explicitly with `_Status: stub_` so the wiki is honest about depth.

## [2026-04-27] ingest | Tool classes, integrations deep-dives, release sweep

- Sources: `tools/classes/*.mdx` (9 files), `integrations/*.mdx` and subfolders (deep on Twilio Flex, Salesforce, Zendesk Talk + Ticketing, MCP; brief on Five9, Genesys, NICE CXone, Amazon Connect, OpenTable, Stripe, etc.), `releases/notes/26.04`, `26.03`, `26.02`.
- New pages (15):
  - `entities/tool-classes/` — index + 8 class pages (conv-object, conv-utils, conv-api, conv-log, asr-from-conv, history, voice, agent-memory).
  - `integrations/` — twilio-flex, salesforce, zendesk, mcp, contact-centre-sip, opentable-and-payments.
- Edited pages (touched 26.x release facts inline):
  - `entities/topic.md` — sample-question limit raised 10 → 20 (26.02).
  - `entities/tool.md` — relinked tool-class refs to local wiki pages.
  - `concepts/polyscore.md` — GPT-5 PolyScore (26.02).
  - `concepts/smart-analyst-vs-agent-analysis.md` — 500-call sampling (26.03).
  - `concepts/conversation-review.md` — Sources preview added (26.03).
  - `concepts/secrets-and-api-keys.md` — secrets masked by default (26.02).
  - `concepts/integrations-overview.md` — restructured to point at new deep-dive pages.
  - `reference/releases.md` — promoted from stub to full overview with per-release wiki-impact mapping.
- Index updated to surface the new entity sub-section and integrations folder.
- Resolves several open-question items (per-integration depth, tool classes, release sweep). Open-questions next pass: per-endpoint API pages, worked examples (next planned write), 25.x history sweep if needed.
