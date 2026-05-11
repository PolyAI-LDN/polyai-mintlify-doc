# Troubleshooting: actions and tools issues

See [Action](../entities/action.md) and [Tool](../entities/tool.md). The most frequent silent failure is a tool referenced in the wrong place — no error appears, the tool simply never fires.

---

## Symptom: Action (SMS / tool call / handoff) doesn't execute

**Likely causes:**

1. Function name in the topic action doesn't match the function definition.
2. Tool was placed in the topic's **Content** field instead of the **Actions** field. **No error is shown** for this.
3. Required parameters missing.
4. External endpoint unreachable.

**Fix:**

1. `Build > Knowledge > Topic > Actions` — verify exact name match.
2. Move tool references from Content into the Actions field if they're misplaced.
3. Use [Conversation Diagnosis](../concepts/conversation-review.md) to inspect attempted tool calls and parameters.
4. Test the endpoint reachability and routing.

**Prevention:** test in Sandbox before promoting. Use `conv.log` in tools to make execution visible in Diagnosis.

**Source:** [Troubleshoot: actions](https://docs.poly.ai/troubleshoot/faq-actions), [Maintain: tool maintenance](https://docs.poly.ai/learn/maintain/tool-maintenance).

---

## Symptom: Tool isn't triggering when expected

**Likely causes:**

1. Tool description is unclear about when to call.
2. Conflicting tools — the LLM picks a different one.
3. Tool not referenced from any topic action.

**Fix:**

1. Rewrite the description with explicit when-to-call guidance: "Call this tool when the user wants to book. Required: date, time, party_size. Only call after confirming all three."
2. Check Diagnosis to see which tool the LLM picked.
3. Verify topics reference the tool in their Actions.

**Prevention:** descriptive function names. The LLM reads names as text — `get_available_packages` reads correctly; `start_process` is misleading.

**Source:** [Troubleshoot: actions](https://docs.poly.ai/troubleshoot/faq-actions), [Maintain: tool maintenance](https://docs.poly.ai/learn/maintain/tool-maintenance).

---

## Symptom: Tool times out or is slow

**Likely causes:** slow external API; complex logic; unnecessary work per call.

**Fix:**

1. Add [delay control](https://docs.poly.ai/tools/delay-control) with filler phrases — the agent acknowledges "Let me check that" while the tool runs.
2. Cache frequently-accessed data.
3. Profile and optimise.

**Prevention:** monitor tool latency on dashboards; alert on regressions.

**Source:** [Maintain: tool maintenance](https://docs.poly.ai/learn/maintain/tool-maintenance), [Maintain: performance monitoring](https://docs.poly.ai/learn/maintain/performance-monitoring).

---

## Symptom: Handoff fails or call drops

**Likely causes:** Wrong number format (missing `+` / country code); SIP method mismatch; destination unreachable; firewall blocking.

**Fix:** validate E.164 format; check SIP URI and headers; test in Sandbox; verify destination firewall rules.

**Prevention:** test handoffs before promoting. See [Call handoff](../channels/call-handoff.md) for SIP method choice.

**Source:** [Troubleshoot: actions](https://docs.poly.ai/troubleshoot/faq-actions), [Maintain: routing and handoffs](https://docs.poly.ai/learn/maintain/routing-handoffs).

---

## Symptom: Function returns both `utterance` and `handoff`

**Cause:** only one control action per turn is supported.

**Fix:** pick one — return `utterance` to speak, or return `handoff` to transfer. To say something then transfer, set the utterance on the handoff (`conv.call_handoff(..., utterance=...)`) or play the utterance in a previous step.

**Source:** [Tools: return values](https://docs.poly.ai/tools/return-values).
