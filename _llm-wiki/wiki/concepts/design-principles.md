# Design principles

PolyAI's distilled guidance on building agents that work. Quotable, useful for the support agent to lean on when answering "what should I do here?".

The canonical source — [`learn/guides/design-principles`](https://docs.poly.ai/learn/guides/design-principles) — is the single most quotable doc in the corpus.

## Priority order (earlier wins)

1. **Complete the task.** The user must be able to finish what they came for. Right integrations, edge-case fallbacks, no dead ends.
2. **Make it easy.** Remove friction. Obvious next step. Cut unnecessary turns. Short path to completion.
3. **Add delight.** Polish — pacing, warmth, turn-taking.

If those conflict, earlier principles win. Don't sacrifice task completion for charm.

## Ten rules

1. **Guide the user.** Implicit ("be conversational") or explicit ("Your reference is six characters — two letters, four numbers"). The latter is often better than people think.
2. **Listen robustly.** Accept information in any order. Handle "both" or "neither". Allow topic switches mid-flow. Anticipate predictable out-of-scope requests.
3. **Give feedback.** Implicit confirmation ("For order 12345, I'll need your surname") beats explicit ("You said 12345, is that correct?"). Reserve explicit confirmation for high-stakes values: payments, medical details. When the agent is slow, signal it: "Let me pull that up."
4. **Support correction.** "Actually 7pm not 6" should update only that field, keep everything else. Don't restart the flow.
5. **Prevent errors.** Confirm before irreversible actions (booking, payment, cancellation). Plan for API timeouts, ASR failures, unexpected answers.
6. **Act efficiently.** Don't re-ask what the user just gave you. Don't explain what you're about to do — do it. "What's your booking reference?" not "Could you please provide me with your booking reference?"
7. **Speak clearly and naturally.** Contractions, short sentences, no filler preambles. Match how real humans speak, not how documents read.
8. **Behave consistently.** Voice, phrasing style, response length, turn-taking — uniform across the conversation. Exception: deliberate mode shifts (e.g. legal disclaimer).
9. **Be flexible.** Design for the edges. Can't spell their name? Offer phonetic. Information missing? Offer alternative lookups. Accessibility needs? Be patient.
10. **Adapt to the user.** Use what you already have (account history, recent activity, location) to skip steps and personalise. "I can see your flight was cancelled — are you calling about rebooking?"

## What this means for the support agent

When a customer asks "should I do X or Y?", these principles are the tiebreaker. They're also the right tone for the agent's own answers — short, helpful, actionable, no preamble.

## Related

- [Rule](../entities/rule.md), [Maintenance playbook](maintenance-playbook.md).

## Authoritative docs

- [Design principles](https://docs.poly.ai/learn/guides/design-principles)
- [Get started](https://docs.poly.ai/learn/guides/get-started)
- [PolyAcademy](https://docs.poly.ai/learn/guides/polyacademy)
