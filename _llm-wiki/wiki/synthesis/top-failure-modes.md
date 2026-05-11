# Top failure modes (across the corpus)

The patterns that keep coming up across `troubleshoot/`, `learn/maintain/`, and the entity-level common-failure-modes lists. If you only knew ten things about PolyAI agents, these would be the ten.

## 1. Save ≠ Publish ≠ Promote

The single most common confusion. Saving keeps work in the draft. Publish creates a version and pushes it to Sandbox. Promote moves a version through Sandbox → Pre-release → Live. Customers expecting "Save" to make changes live is the most frequent "I changed it but it's not working" support ticket.

See [Environment](../entities/environment.md), [environment-and-deployment-issues](../troubleshooting/environment-and-deployment-issues.md).

## 2. Tool referenced in the topic Content field instead of Actions

No error message. Tool simply doesn't fire. Customer is confused why the agent isn't behaving as expected. **Always check the Actions field first when a tool isn't running.**

See [Action](../entities/action.md), [actions-and-tools-issues](../troubleshooting/actions-and-tools-issues.md).

## 3. Multiple things in one turn

Mixing a text response and an action in one turn — only one fires. Mixing two actions in one turn — only one fires. Mixing a flow step with both an utterance and a tool call — only one runs. **Split across turns.** This is structurally how PolyAI agents work, not a bug.

See [Topic](../entities/topic.md), [Flow](../entities/flow.md), [Action](../entities/action.md).

## 4. Sample questions weak or missing

The number-one cause of "the agent doesn't know about this topic". Topics need ≥3 sample questions varying phrasing and structure. Topic name and sample questions weight heavily in retrieval — fix these before anything else.

See [Topic](../entities/topic.md), [managed-topic-issues](../troubleshooting/managed-topic-issues.md).

## 5. Connected Knowledge expected to do things it can't

Connected Knowledge is read-only. No actions, no SMS, no handoff. If the customer wants a side effect, they need a Topic. Conflict resolution: Topics always win over Connected Knowledge.

See [Connected Knowledge](../entities/connected-knowledge.md), [connected-knowledge-issues](../troubleshooting/connected-knowledge-issues.md).

## 6. Variant default trap

Without an explicit `conv.set_variant()` in the start function, the **first variant** is used for every call. For multi-site or multi-brand agents, customers think their per-site routing isn't working when in fact they never selected the variant.

See [Variant](../entities/variant.md).

## 7. Negative rules that activate the suppressed concept

"Don't say X" primes the LLM on X. Phrase positively: "Always say Y." This isn't customer pickiness — LLM behaviour really does change.

See [Rule](../entities/rule.md), [rules-and-personality-issues](../troubleshooting/rules-and-personality-issues.md).

## 8. Entities are strings, not numbers

In a flow, entity values are always strings. `"9" > "10"` evaluates to `True` because Python compares lexicographically. Cast to `int()` before any numeric comparison. Easy bug to introduce, hard to spot in production.

See [Flow](../entities/flow.md).

## 9. SIP method mismatch on call handoff

REFER, INVITE, BYE behave differently. INVITE keeps PolyAI in the path so a pre-handoff utterance can complete; REFER drops PolyAI immediately. Choosing the wrong one breaks pre-handoff messaging. Worse, the upstream carrier may be locked to one method, requiring coordination.

See [Call handoff](../channels/call-handoff.md).

## 10. A2P 10DLC blocks SMS in production

US/Canada SMS requires A2P registration with detailed opt-in evidence. Approval can take weeks; vague applications get rejected. Customers that go to production without realising this find their SMS feature non-functional. **Start the registration as early as possible**, before development ships.

See [SMS](../channels/sms.md), [Twilio](../channels/twilio.md).

## What this list is for

When triaging a new support ticket, scan this list first — most issues match one of these patterns. If they don't, it's worth investigating more carefully before answering.

## Related

- [Maintenance playbook](../concepts/maintenance-playbook.md)
- [Support-agent knowledge shape](support-agent-knowledge-shape.md)
- [Open questions](open-questions.md)
