# Release notes

Monthly platform releases. Watch for behaviour changes that affect the wiki — when something material lands, the relevant entity / concept page should get a refresh, and the change recorded here.

## How to use this page

When a customer reports something working differently than the wiki describes, **check release notes first**. Behaviour shifts often. The note will name the release that introduced the change.

## Recent releases (last three, with wiki impact)

### April 2026 — `26.04`

[26.04 notes](https://docs.poly.ai/releases/notes/26.04)

**Headline:** First-class multilingual support, MCP integrations promoted to UI, public Agents API.

- **Multi-language UI** — add up to 10 languages with per-language voices and automatic switching. Conditional content tags `<language:en>` etc. for language-specific responses. Translations page with auto-translate + manual override. → updates [Multilingual](../entities/multilingual.md), [Response control](../concepts/response-control.md).
- **MCP integrations** — connect external MCP servers via UI with auto-discovery and per-tool toggling. Older experimental config still works but hidden once a new server is added through the UI. → covered in [MCP integration page](../integrations/mcp.md).
- **Agents API** — full CRUD for agents, knowledge base, variants, deployments, and telephony via REST. → covered in [API surface overview](../api/overview.md). Worth a per-endpoint page next pass.
- Language metadata now visible in [Conversation Review](../concepts/conversation-review.md) and [Audio management](../concepts/audio-management.md).

**Breaking changes:** none for existing single-language deployments. Translation cards require explicit configuration when adding languages.

### March 2026 — `26.03`

[26.03 notes](https://docs.poly.ai/releases/notes/26.03)

**Headline:** Deeper Conversation Review visibility, Smart Analyst scaled 10×.

- **Sources preview in Conversation Review** — click source tags to see retrieved document chunks inline; `Open in Knowledge` deep-link. → updates [Conversation review](../concepts/conversation-review.md).
- **Smart Analyst deep sampling** — analyse up to **500** conversations per query (up from 50). Random or metric-based sampling. → updates [Smart Analyst vs Agent Analysis](../concepts/smart-analyst-vs-agent-analysis.md).
- Diagnosis dropdown now toggles `Sources` alongside `Matched topics`.

**Breaking changes:** none.

### February 2026 — `26.02`

[26.02 notes](https://docs.poly.ai/releases/notes/26.02)

**Headline:** Navigation reorganisation around the Channels concept; Voice library redesign; expanded permissions and ticket capacity.

- **Sidebar reorganised** — Channels section now groups Voice, Chat, Widget. Chat configuration moved from Settings → `Channels > Chat Configuration`. Greeting / disclaimer settings moved to Voice and Chat configuration pages. Environments and Project History moved under a new Deployments section. Real-time Configuration and Configuration Builder moved to Build. → most-affected pages: [Voice](../channels/voice.md), [Webchat widget](../channels/webchat-widget.md), [Environment](../entities/environment.md), [Deployment](../entities/deployment.md).
- **Voice library** — filter by language / region / gender; preview and Explore vs Favourites tabs. → updates [Voice library](../channels/voice-library.md).
- **Latency visualisation** — LLM and function timing breakdowns surface in Conversation Review. → relevant to [Audio management](../concepts/audio-management.md), [Conversation review](../concepts/conversation-review.md), [Performance & technical issues](../troubleshooting/performance-and-technical-issues.md).
- **CSAT by voice** — in-call survey configuration with guided setup. → adds a section to [Voice](../channels/voice.md) and [Dashboards and metrics](dashboards-and-metrics.md).
- **One-click CCaaS integrations** — Dialpad, Twilio, Five9 quick setup.
- **Webchat markdown rendering** in Test Agent Chat and Conversation Review. → updates [Webchat widget](../channels/webchat-widget.md).
- **User permissions granularity** — None / Read / Edit per area, mixable. → updates [User management](../concepts/user-management.md).
- **Sample-question limit raised 10 → 20** per topic. → updates [Topic](../entities/topic.md).
- **GPT-5 PolyScore** + call summaries upgrade. → updates [PolyScore](../concepts/polyscore.md).
- **Secrets masked by default** in Studio (unmask on focus). → updates [Secrets and API keys](../concepts/secrets-and-api-keys.md).

**Breaking changes:** none for existing agents. Chat config that was edited under `Settings` will now appear under `Channels`.

## Older releases

History back to October 2024 in `releases/notes/` on the published docs site:

- [25.12](https://docs.poly.ai/releases/notes/25.12) · [25.11](https://docs.poly.ai/releases/notes/25.11) · [25.10](https://docs.poly.ai/releases/notes/25.10) · [25.09](https://docs.poly.ai/releases/notes/25.09) · [25.08](https://docs.poly.ai/releases/notes/25.08) · [25.07](https://docs.poly.ai/releases/notes/25.07)
- [25.06](https://docs.poly.ai/releases/notes/25.06) · [25.05](https://docs.poly.ai/releases/notes/25.05) · [25.04](https://docs.poly.ai/releases/notes/25.04) · [25.03](https://docs.poly.ai/releases/notes/25.03) · [25.02](https://docs.poly.ai/releases/notes/25.02) · [25.01](https://docs.poly.ai/releases/notes/25.01)
- [24.12](https://docs.poly.ai/releases/notes/24.12) · [24.11](https://docs.poly.ai/releases/notes/24.11) · [24.10](https://docs.poly.ai/releases/notes/24.10)

## Authoritative docs

- [Releases overview](https://docs.poly.ai/releases/overview)
