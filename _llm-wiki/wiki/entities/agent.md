# Agent

The customer's voice or chat assistant — the thing they're building in Studio. A self-contained unit with its own knowledge, flows, tools, voice configuration, and behavioural rules. In the Studio UI "Agent" and "Project" are used roughly synonymously; see [Project and Branch](project-and-branch.md) for the distinction that matters.

## Where it lives

- **Studio:** `Build > Agent`. Agent settings live under `Build > Agent > Personality and role`, with sub-sections for Models, Behavior, and Multilingual.
- **API:** [`Agents` endpoints](https://docs.poly.ai/api-reference/agents/introduction).

## Common failure modes

- **Greeting writing problems.** The greeting bypasses the LLM and goes directly to TTS. Unclear or grammatically odd text is read verbatim. If a dynamic greeting is needed (e.g. "Welcome back, Aaron"), set it via the start function returning `utterance`, not by relying on the LLM to rewrite it.
- **Response + action in the same turn.** The agent will skip one of them. Always split into separate turns: respond first, action next.
- **Overly broad behavioural rules.** "Be helpful" or "Be empathetic" without examples produces inconsistent tone. See [Rule](rule.md) for how to write rules that actually shape behaviour.
- **Wrong model selected.** Using a general-purpose LLM (GPT/Claude) instead of Raven causes slow latency, more hallucinations, and weaker grounding for customer-service conversations. Raven is the recommended default.

## Related

- [Rule](rule.md), [Topic](topic.md), [Flow](flow.md), [Tool](tool.md), [Variant](variant.md), [Multilingual](multilingual.md), [Deployment](deployment.md), [Project and Branch](project-and-branch.md).

## Authoritative docs

- [Agent settings introduction](https://docs.poly.ai/agent-settings/introduction)
- [Personality and role](https://docs.poly.ai/agent-settings/agent)
- [Model use](https://docs.poly.ai/agent-settings/model-use), [Raven](https://docs.poly.ai/agent-settings/raven), [BYOM](https://docs.poly.ai/agent-settings/byom)
- [Order of operations](https://docs.poly.ai/essentials/order) — what runs before what; where the greeting fits
