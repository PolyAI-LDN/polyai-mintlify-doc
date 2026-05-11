# Troubleshooting: managed topic issues

The most common class of "fix my agent" tickets. Topics are PolyAI's primary knowledge primitive — when one isn't working, the agent visibly underperforms. See [Topic](../entities/topic.md) for the entity definition.

---

## Symptom: Agent says "I don't know" for a topic that exists

**Likely causes (ranked):**

1. The topic isn't published to the target [environment](../entities/environment.md).
2. Sample questions are missing, weak, or too few.
3. The topic name is too vague for the retriever to discriminate.

**Fix:**

1. Confirm the agent is talking to the right environment. Check `Deployments > Environments` and verify the topic is in the active version.
2. Open the topic in `Build > Knowledge`. Aim for 3–10 sample questions, varying phrasing and structure (not just rewording one intent).
3. Specific topic names beat broad ones — "Payment dispute resolution" beats "Billing help".

**Prevention:** sample-question coverage and topic naming weight heavily in RAG. When retrieval fails, those are the first two things to fix.

**Source:** [Troubleshoot: FAQ](https://docs.poly.ai/troubleshoot/faq), [Troubleshoot: managed topics](https://docs.poly.ai/troubleshoot/faq-managed-topics), [Maintain: knowledge base](https://docs.poly.ai/learn/maintain/knowledge-base).

---

## Symptom: Agent triggers the wrong topic / overlapping answers

**Likely cause:** Two topics with similar sample questions or names; the retriever picks a lower-priority match.

**Fix:**

1. Use [Conversation Diagnosis](../concepts/conversation-review.md) to see which topics matched the turn.
2. If the matches overlap structurally, either merge the topics or rewrite their names and sample questions to be more distinct.

**Prevention:** consistent naming conventions (prefix by category). Audit topics for overlap during the [weekly maintenance](../concepts/maintenance-playbook.md) pass.

**Source:** [Troubleshoot: managed topics](https://docs.poly.ai/troubleshoot/faq-managed-topics).

---

## Symptom: Edited answer isn't live

**Cause:** Change saved as Draft / Sandbox but not promoted to Live.

**Fix:**

1. `Deployments > Environments`.
2. Publish the version (Draft → Sandbox).
3. Promote Sandbox → Pre-release → Live.

**Prevention:** know the pipeline: **Draft → Publish → Sandbox → Promote → Pre-release → Promote → Live**. See [Environment](../entities/environment.md).

**Source:** [Troubleshoot: FAQ](https://docs.poly.ai/troubleshoot/faq), [Maintain: version management](https://docs.poly.ai/learn/maintain/version-management).

---

## Symptom: Agent gives a partial answer or misses important details

**Likely causes:** answer field too brief / ambiguous; a competing topic is being retrieved.

**Fix:** expand the answer with the missing details. Check the Diagnosis panel — if a competing topic is being matched alongside, see "Agent triggers wrong topic" above.

**Prevention:** write complete answers up front; don't rely on the LLM to fill gaps.

**Source:** [Maintain: knowledge base](https://docs.poly.ai/learn/maintain/knowledge-base).
