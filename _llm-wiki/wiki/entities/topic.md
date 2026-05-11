# Topic (Managed Topic)

A curated knowledge unit — sample questions, an answer, and optional [actions](action.md). Topics are matched to user input via RAG; the LLM picks the best match and grounds its response in the topic's content.

Topics are PolyAI's primary knowledge primitive. If something can be answered or actioned by the agent, it usually lives in a Topic.

## Where it lives

- **Studio:** `Build > Knowledge > Managed Topics`. Searchable, filterable list.
- **API:** [Knowledge base endpoints](https://docs.poly.ai/api-reference/agents/introduction) — list / create / get / update / delete topics.

## Topic vs Connected Knowledge

Both are RAG-matched, but they differ:

| | Topic | [Connected Knowledge](connected-knowledge.md) |
|---|---|---|
| Source | Curated by the customer in Studio | External docs auto-imported (URLs, PDFs, Zendesk, Gladly) |
| Triggers actions? | Yes — SMS, tool call, handoff | No — read-only |
| Wins on conflict | **Always** wins over Connected Knowledge | Falls back to Topics |
| Best for | High-importance answers, anything with a side effect | Long-tail, unstructured FAQ content |

## Common failure modes

- **Missing or vague sample questions.** Retrieval can't find the topic. Minimum 3, maximum 20 sample questions per topic _(limit raised from 10 to 20 in [release 26.02](../reference/releases.md))_; vary phrasing and structure, don't just reword the same intent.
- **Broad topic names.** "Billing help" over-triggers; "Payment dispute resolution" doesn't. Specific names are easier for the retriever to discriminate.
- **Mixing text response + action in one turn.** The agent may skip one. Split: respond, then action.
- **No follow-up prompt.** Without "Anything else I can help with?" the agent hallucinates the next step.
- **Tool referenced in the Content field instead of the Actions field.** No error is shown but the tool won't trigger. See [Action](action.md).

## Related

- [Connected Knowledge](connected-knowledge.md), [Action](action.md), [Rule](rule.md), [Flow](flow.md).

## Authoritative docs

- [Managed topics introduction](https://docs.poly.ai/managed-topics/introduction)
- [RAG introduction](https://docs.poly.ai/managed-topics/RAG/introduction)
- [Maintain: knowledge base](https://docs.poly.ai/learn/maintain/knowledge-base)
