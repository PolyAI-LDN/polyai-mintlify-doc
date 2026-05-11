# Rule

A global behavioural constraint applied across every interaction — tone, terminology, compliance posture, edge-case handling. Rules are interpreted by the LLM at response generation time. Without rules, the LLM improvises inconsistently.

## Where it lives

- **Studio:** `Build > Agent > Behavior`.
- **API:** [Behavior endpoints](https://docs.poly.ai/api-reference/agents/introduction) — get / update agent behavior rules.

## How to write rules that work

Rules are deceptively simple to fill in and easy to get wrong. The patterns that work:

1. **Phrase positively.** "Always do X" outperforms "Don't do Y" — negative phrasing primes the LLM on the very concept it's supposed to suppress.
2. **Be quantitative where possible.** "Answer in ≤ 2 sentences and offer a follow-up option" is more reliable than "Be concise."
3. **Give few-shot examples.** Show what good and bad responses look like; abstract instructions don't shape tone reliably on their own.
4. **One rule per concern.** Conflicting rules ("Never send unsolicited follow-ups" + "Always offer follow-ups") confuse the LLM. Collapse to one: "Send follow-ups only with user consent."

## Common failure modes

- **Negative rules** that activate the suppressed concept.
- **Vague rules** ("Be helpful", "Be empathetic") — no observable behavioural change.
- **Overlapping rules** that contradict each other.
- **No examples** — the agent doesn't internalise tone.
- **Missing edge-case rules** for silence, jailbreak attempts, ASR failures, abusive callers.

## Related

- [Agent](agent.md), [Topic](topic.md), [Flow](flow.md).

## Authoritative docs

- [Behaviour rules](https://docs.poly.ai/agent-settings/rules)
- [Agent personality and role](https://docs.poly.ai/agent-settings/agent)
- [Design principles](https://docs.poly.ai/learn/guides/design-principles) — distilled in [`concepts/design-principles.md`](../concepts/design-principles.md)
