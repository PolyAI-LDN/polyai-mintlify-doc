# Troubleshooting: performance and technical issues

For latency, error rates, containment drops, and analytics anomalies. See [Maintenance playbook](../concepts/maintenance-playbook.md) for the ongoing rhythm; this page is for the specific issues.

---

## Symptom: High response latency (> 2 seconds)

**Likely causes:** slow function execution; external API delays; complex knowledge retrieval; wrong model selected.

**Fix:**

1. Open [Conversation Diagnosis](../concepts/conversation-review.md) → Turn latency layer. Identify which stage is slow.
2. If it's a tool, optimise or [add a delay-control filler phrase](https://docs.poly.ai/tools/delay-control) so the agent feels responsive while waiting.
3. If it's the LLM, check the model — Raven is faster than general-purpose LLMs for customer-service patterns.
4. Cache repeated audio.

**Prevention:** monitor latency on dashboards; alert on anomalies.

**Source:** [Maintain: performance monitoring](https://docs.poly.ai/learn/maintain/performance-monitoring), [Maintain: health checks](https://docs.poly.ai/learn/maintain/health-checks).

---

## Symptom: Low containment rate (high handoff %)

**Likely causes:** knowledge gaps; complex queries; technical errors; caller preference.

**Fix:**

1. Use [Smart Analyst](../concepts/smart-analyst-vs-agent-analysis.md) to deep-sample 500 calls. Ask: "What are the top handoff reasons this week?"
2. Add missing topics or expand existing ones based on findings.
3. Adjust handoff rules.
4. Add self-service options for common requests that currently escalate.

**Prevention:** weekly Smart Analyst review of handoff patterns.

**Source:** [Maintain: performance monitoring](https://docs.poly.ai/learn/maintain/performance-monitoring), [Smart Analyst](https://docs.poly.ai/smart-analyst/introduction).

---

## Symptom: Tool / API errors at runtime

**Likely causes:** expired credential; timeout; missing parameter; wrong endpoint.

**Fix:**

1. Verify the [secret](../concepts/secrets-and-api-keys.md) is current and the right environment.
2. Add delay control if the API is slow.
3. Validate input parameters in the tool.
4. Test the external API directly.
5. Use `conv.log_api_response()` to capture responses for debugging.

**Prevention:** rotate credentials every ~90 days. Log API responses. Monitor function errors on dashboards.

**Source:** [Maintain: tool maintenance](https://docs.poly.ai/learn/maintain/tool-maintenance), [Maintain: performance monitoring](https://docs.poly.ai/learn/maintain/performance-monitoring).

---

## Symptom: Analytics show zero calls

**Cause:** dashboard filtered to wrong environment or date range.

**Fix:** switch the environment filter to Live; widen the date range to include recent calls.

**Prevention:** set sensible default filters (Live environment, last 7 days).

**Source:** [Maintain: common issues](https://docs.poly.ai/learn/maintain/common-issues).

---

## Symptom: Can't find a specific conversation or pattern

**Cause:** filter mismatch or just too much volume to scroll through.

**Fix:** use [Smart Analyst](../concepts/smart-analyst-vs-agent-analysis.md) for natural-language queries: "What are the top failure reasons?" "Why are calls being handed off?"

**Prevention:** Smart Analyst beats manual review for pattern finding once volume is non-trivial.

**Source:** [Smart Analyst](https://docs.poly.ai/smart-analyst/introduction), [Conversations](https://docs.poly.ai/analytics/conversations/introduction).

---

## Symptom: PolyScore looks wrong on a specific call

**Cause:** [PolyScore](../concepts/polyscore.md) measures conversational quality from the transcript only. It can't verify whether external actions actually succeeded, and it doesn't have access to the customer's knowledge base.

**Fix:** treat PolyScore as a screening signal, not a verdict. Manually review low-score calls (0–3) and confirm what actually happened.

**Prevention:** pair PolyScore with custom metrics and manual QA. Don't rely on it alone.

**Source:** [PolyScore](https://docs.poly.ai/analytics/polyscore).
