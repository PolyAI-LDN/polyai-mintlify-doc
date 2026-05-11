# Smart Analyst vs Agent Analysis

Two analytics features that look similar but are used differently. **Most teams should default to Smart Analyst.**

## Smart Analyst

Natural-language analysis over up to **500 conversations per query** _(scaled up 10× from 50 in [release 26.03](../reference/releases.md))_. Ask questions in plain English: "Why are calls failing?" "Top handoff reasons this week?" "What do low-PolyScore calls have in common?"

Two sampling modes:

- **Random** — broad trend discovery.
- **Metric-based** — targeted (e.g. only conversations with PolyScore < 4).

The reasoning steps stream in real time; the final answer is a structured response. Integrates with dashboards (`Generate insights` buttons populate prompts).

**Best for:** exploratory analysis, pattern finding, continuous improvement loops, ad-hoc investigations.

## Agent Analysis

Categorises calls using a fixed LLM prompt with up to **10 mutually exclusive categories** per analysis. Up to **250 calls per batch**.

Provides a visual breakdown plus per-call category assignments (which can be edited). Can run one-off or scheduled (daily / weekly) with trend charts.

**Best for:** repeatable structured categorisation when you need the same taxonomy over time. ("Was this call successful?" with consistent definitions month over month.)

## When to use which

- **Default:** Smart Analyst.
- **If you specifically need a fixed, stable taxonomy you'll track over months:** Agent Analysis.

Most "tell me what's going wrong" investigations are exploratory and belong in Smart Analyst, not Agent Analysis.

## Related

- [PolyScore](polyscore.md), [Conversation review](conversation-review.md), [Maintenance playbook](maintenance-playbook.md).

## Authoritative docs

- [Smart Analyst](https://docs.poly.ai/smart-analyst/introduction)
- [Agent analysis](https://docs.poly.ai/agent-analysis/introduction)
