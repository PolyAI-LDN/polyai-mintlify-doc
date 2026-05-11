# PolyScore

PolyAI's automatic conversation quality score. Every voice conversation is scored 0–10 by an LLM evaluator (GPT-5 since [release 26.02](../reference/releases.md)). Colour-coded: green 7–10, amber 4–6, red 0–3.

## How it's computed

Three weighted dimensions:

- **Conversation quality (40%)** — agent understanding, naturalness of flow.
- **Task success (40%)** — whether the user's request was resolved.
- **Customer experience (20%)** — frustration signals, repetition.

Each dimension is rated Poor / Fair / Good with a written explanation. The score itself is the rolled-up rating.

## Eligibility

- Voice only (not chat).
- Minimum 3 turns.
- Conversation must show engagement.

## What it's good for

- Building a triage queue: filter by red (0–3) first.
- Spot-checking green: high score doesn't guarantee the agent did the right thing — it means the conversation read well.
- Trending over time on the home page.
- Sampling criterion in [Smart Analyst](smart-analyst-vs-agent-analysis.md).

## What it can't do

PolyScore reads transcripts, nothing else. It does not:

- Verify external actions (was the booking actually created?).
- Know what the agent **should** have said.
- Have access to the customer's knowledge base.

Use it as a screening signal, not as definitive QA. Pair with custom metrics and manual review.

## Where it surfaces

- **Conversation Review** — score badge plus per-dimension breakdown.
- **Conversations table** — sortable column.
- **Home page** — trend chart.
- **Smart Analyst** — sampling parameter.
- **Conversations API** — score in the API response.

## Related

- [Conversation review](conversation-review.md), [Smart Analyst vs Agent Analysis](smart-analyst-vs-agent-analysis.md), [Maintenance playbook](maintenance-playbook.md).

## Authoritative docs

- [PolyScore](https://docs.poly.ai/analytics/polyscore)
