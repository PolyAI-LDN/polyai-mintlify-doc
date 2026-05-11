# Action

Behaviour attached to a [Topic](topic.md) that fires when the topic is matched. Three types: **Send SMS**, **Tool call**, **Handoff**. Actions are optional — many topics are pure FAQ with no action.

## Where it lives

- **Studio:** Inside each Topic's `Actions` field. Add via `/` shortcut or right-click menu.
- **API:** Actions are part of the topic schema in the [Knowledge base endpoints](https://docs.poly.ai/api-reference/agents/introduction).

## The three types

| Type | What it does | Authoritative docs |
|---|---|---|
| **Send SMS** | Text the caller mid-conversation (confirmation, link, follow-up) | [send-sms](https://docs.poly.ai/managed-topics/how-to-setup-action/send-sms) |
| **Tool call** | Invoke a Python [Tool](tool.md) | [tool-call](https://docs.poly.ai/managed-topics/how-to-setup-action/tool-call) |
| **Handoff** | Transfer to a human / queue ([Call Handoff](../channels/call-handoff.md)) | [handoff](https://docs.poly.ai/managed-topics/how-to-setup-action/handoff) |

## Common failure modes

- **Tool reference in the Content field instead of Actions.** No error is shown; tool simply doesn't trigger. **Always use the Actions field for tool calls.**
- **Multiple actions in one turn.** Mixing types (e.g. SMS + handoff in the same turn) is unreliable — only one fires. Split across turns.
- **No consent step before SMS.** Regulatory requirement — always ask before sending. (See [SMS](../channels/sms.md) and the A2P 10DLC notes.)
- **Bare handoff with no utterance.** The caller hears nothing while the call transfers. Include a handoff utterance or set up the message in the topic Content immediately before.

## Related

- [Topic](topic.md), [Tool](tool.md), [SMS](../channels/sms.md), [Call Handoff](../channels/call-handoff.md).

## Authoritative docs

- [Actions introduction](https://docs.poly.ai/managed-topics/how-to-setup-action/introduction)
