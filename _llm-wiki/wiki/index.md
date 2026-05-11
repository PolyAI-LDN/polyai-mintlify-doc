# Wiki Index

The catalog of every page in this wiki, with a one-line summary. Read this first; drill into individual pages from here.

The wiki is a synthesis of `docs.poly.ai`, reshaped for an LLM support agent. See [`CLAUDE.md`](../CLAUDE.md) for the schema; depth status is noted on each page.

## Entities — stable nouns the agent refers to

- [Agent](entities/agent.md) — the customer's voice/chat assistant.
- [Project and Branch](entities/project-and-branch.md) — Studio configuration units and parallel editing.
- [Topic](entities/topic.md) — managed knowledge unit with optional actions.
- [Connected Knowledge](entities/connected-knowledge.md) — auto-imported external sources, read-only.
- [Action](entities/action.md) — SMS / tool call / handoff attached to a topic.
- [Rule](entities/rule.md) — global behaviour constraint.
- [Flow](entities/flow.md) — multi-step conversation orchestration.
- [Tool](entities/tool.md) — Python functions extending the agent.
- [Variant](entities/variant.md) — per-cohort / per-site configuration.
- [Environment](entities/environment.md) — Sandbox / Pre-release / Live.
- [Deployment](entities/deployment.md) — published version of the agent on an environment.
- [Multilingual](entities/multilingual.md) — multi-language operation.
- [Tool classes](entities/tool-classes/index.md) — `conv` object and helpers used inside tools (8 sub-pages).

## Channels — the surfaces the agent runs on

- [Webchat widget](channels/webchat-widget.md) — embeddable chat on customer websites.
- [Voice](channels/voice.md) — STT → LLM → TTS pipeline for phone calls.
- [Voice library and multi-voice](channels/voice-library.md) — picking and rotating voices.
- [Telephony](channels/telephony.md) — phone numbers and routing.
- [Twilio](channels/twilio.md) — first-class telephony partnership.
- [Outbound calling](channels/outbound-calling.md) — agent-initiated calls.
- [SMS](channels/sms.md) — texting (with A2P 10DLC).
- [Call handoff](channels/call-handoff.md) — transfer to humans.

## Concepts — capabilities and patterns

- [Response control](concepts/response-control.md) — stop keywords, translations, pronunciations.
- [Audio management](concepts/audio-management.md) — caching, interaction style, barge-in.
- [Speech recognition](concepts/speech-recognition.md) — keyphrase boosting, transcript corrections.
- [Secrets and API keys](concepts/secrets-and-api-keys.md) — credential storage and external API access.
- [User management](concepts/user-management.md) — team members, roles, permissions.
- [Integrations overview](concepts/integrations-overview.md) — the integration landscape.
- [PolyScore](concepts/polyscore.md) — automatic conversation quality score.
- [Conversation review](concepts/conversation-review.md) — diagnosing real conversations.
- [Smart Analyst vs Agent Analysis](concepts/smart-analyst-vs-agent-analysis.md) — when to use which.
- [Test suite](concepts/test-suite.md) — automated regression testing.
- [Design principles](concepts/design-principles.md) — distilled PolyAI guidance.
- [Maintenance playbook](concepts/maintenance-playbook.md) — daily / weekly / monthly rhythm.

## Troubleshooting — symptom → cause → fix

- [Managed topic issues](troubleshooting/managed-topic-issues.md) — agent says "I don't know", wrong topic triggered, edits not live.
- [Connected knowledge issues](troubleshooting/connected-knowledge-issues.md) — sources not used, sync failures, staleness.
- [Rules and personality issues](troubleshooting/rules-and-personality-issues.md) — inconsistent tone, robotic feel, edge-case handling.
- [Actions and tools issues](troubleshooting/actions-and-tools-issues.md) — tool not firing, slow tools, handoff failures.
- [Environment and deployment issues](troubleshooting/environment-and-deployment-issues.md) — Save/Publish/Promote confusion, rollback patterns.
- [Voice and audio issues](troubleshooting/voice-and-audio-issues.md) — pronunciations, voice quality, ASR accuracy, barge-in.
- [Multilingual issues](troubleshooting/multilingual-issues.md) — translation, language detection, diacritics.
- [Performance and technical issues](troubleshooting/performance-and-technical-issues.md) — latency, containment, errors, analytics anomalies.

## Integrations — per-vendor deep-dives

- [Twilio Flex](integrations/twilio-flex.md) — Twilio's contact-centre layer with handoff-context wiring.
- [Salesforce](integrations/salesforce.md) — CRM, Cases, OAuth setup.
- [Zendesk](integrations/zendesk.md) — Talk (voice / SIP) and Ticketing (REST) on one page.
- [MCP](integrations/mcp.md) — Model Context Protocol server connections.
- [Contact-centre SIP integrations](integrations/contact-centre-sip.md) — Five9, Genesys, NICE CXone, Amazon Connect.
- [OpenTable, Stripe, and adjacent services](integrations/opentable-and-payments.md) — hospitality, payments, healthcare, knowledge bases.

## API reference _(shallow)_

- [API surface overview](api/overview.md) — the API families and how to authenticate.

## Reference _(shallow stubs — extend in next ingest pass)_

- [Dashboards and metrics](reference/dashboards-and-metrics.md)
- [Extending with code (ADK)](reference/extend-with-code.md)
- [Call data](reference/call-data.md)
- [Release notes](reference/releases.md)
- [Legal and compliance](reference/legal-and-compliance.md)

## Synthesis

- [Support-agent knowledge shape](synthesis/support-agent-knowledge-shape.md) — what content does an LLM support agent actually need?
- [Top failure modes](synthesis/top-failure-modes.md) — the ten patterns that come up most often across the corpus.
- [Open questions](synthesis/open-questions.md) — coverage gaps, factual questions, and conventions to settle.

### LLM support page initiative (folded in)

The Slack-thread-driven material that kicked this wiki off — Christopher's call to redesign the support page, the Quicken pitch on Wed 6 May 2026, the design principles for that initiative.

- [Project brief](synthesis/llm-support-page-initiative/project-brief.md)
- [Implementation paths](synthesis/llm-support-page-initiative/implementation-paths.md) — how this actually gets built, and what Aaron owns vs others
- [Design principles for the support page](synthesis/llm-support-page-initiative/design-principles.md)
- [Quicken pitch plan](synthesis/llm-support-page-initiative/quicken-pitch-plan.md)
- [Prototype scope](synthesis/llm-support-page-initiative/prototype-scope.md)
- People: [Christopher Osborne](synthesis/llm-support-page-initiative/people-christopher-osborne.md), [Frances Erasmus](synthesis/llm-support-page-initiative/people-frances-erasmus.md), [Aaron Forinton](synthesis/llm-support-page-initiative/people-aaron-forinton.md), [Quicken](synthesis/llm-support-page-initiative/quicken.md)
- Concepts of the productisation: [LLM support page](synthesis/llm-support-page-initiative/concept-llm-support-page.md), [web agent technology](synthesis/llm-support-page-initiative/concept-web-agent-technology.md), [docs.poly.ai AI-assisted search](synthesis/llm-support-page-initiative/concept-docs-polyai-ai-search.md), [/maintain/ content](synthesis/llm-support-page-initiative/concept-maintain-content.md), [image upload](synthesis/llm-support-page-initiative/concept-image-upload.md), [multilingual / translation](synthesis/llm-support-page-initiative/concept-multilingual-translation.md), [human handoff](synthesis/llm-support-page-initiative/concept-human-handoff.md)

## Sources

The raw layer is the published `polyai-mintlify-doc` Mintlify content, sibling of `_llm-wiki/`. Sources captured into `_llm-wiki/raw/` directly:

- [`raw/2026-04-27-slack-support-page-redesign.md`](../raw/2026-04-27-slack-support-page-redesign.md) — Slack thread that kicked off the LLM-support-page initiative.
