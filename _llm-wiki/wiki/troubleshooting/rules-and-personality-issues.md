# Troubleshooting: rules and personality issues

See [Rule](../entities/rule.md) and [Design principles](../concepts/design-principles.md). Most personality complaints trace back to rules that don't actually shape behaviour.

---

## Symptom: Agent sounds inconsistent / gives conflicting responses

**Likely cause:** Rules are too long, contradict each other, or are abstract instructions without examples.

**Fix:**

1. Consolidate overlapping rules.
2. Replace vague instructions ("Be helpful") with quantified ones ("Answer in ≤2 sentences").
3. Add few-shot examples of good/bad responses.
4. Review against real conversations to confirm rules are landing.

**Prevention:** keep rules concise and ranked by importance. Use [Conversation Review](../concepts/conversation-review.md) to spot drift.

**Source:** [Troubleshoot: rules](https://docs.poly.ai/troubleshoot/faq-rules), [Design principles](https://docs.poly.ai/learn/guides/design-principles).

---

## Symptom: Agent repeats things back too much; conversation feels robotic

**Cause:** too much explicit confirmation; bad turn-taking rhythm.

**Fix:** switch to **implicit confirmation** — weave the input into the next question. "To check the booking under 0770 0900 123, I'll need your surname." Reserve explicit confirmation for high-stakes values: payment amounts, medical details.

**Prevention:** test with real users; review conversations for redundant confirmation loops.

**Source:** [Design principles](https://docs.poly.ai/learn/guides/design-principles).

---

## Symptom: Agent doesn't handle small talk, silence, or unintelligible input

**Cause:** no rules for these patterns.

**Fix:** explicit rules for each:

- **Silence:** "After two prompts with no response, offer to transfer to a human."
- **Small talk:** "Briefly acknowledge and redirect to the task at hand."
- **Unintelligible input:** "After two failed attempts, offer handoff."

**Prevention:** plan for risky scenarios up front (refunds, cancellations, emergencies). Test in Sandbox.

**Source:** [Troubleshoot: rules](https://docs.poly.ai/troubleshoot/faq-rules).

---

## Symptom: Agent sounds robotic / formal / inconsistent in tone

**Cause:** long formal sentences, no contractions, filler preambles ("In order to assist you..."), document-style writing.

**Fix:** rewrite for spoken delivery. Contractions ("I'll", "we're"). Short sentences. No preamble: "What's your reference?" beats "Could you please provide me with your reference?"

**Prevention:** write conversationally from the start. Err on informality.

**Source:** [Troubleshoot: personality](https://docs.poly.ai/troubleshoot/faq-personality), [Design principles](https://docs.poly.ai/learn/guides/design-principles).
