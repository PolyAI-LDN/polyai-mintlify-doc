# Call handoff

Transferring a live inbound call to a human agent or another destination. Two configuration paths, with different flexibility.

## Two methods

| | Studio Call Handoff UI | `transfer_call()` in a [Tool](../entities/tool.md) |
|---|---|---|
| Routing | Static destination | Dynamic — code can pick destination at runtime |
| SIP method | REFER / INVITE / BYE selectable | Configurable per call |
| Custom SIP headers | No | Yes |
| Soft handoff (warm transfer) | Limited | Full support |
| Best for | Simple, fixed transfer | Conditional routing, context-rich handoffs, integrations like Zendesk |

## Where it lives

- **Studio:** `Build > Call Handoffs`.
- **In code:** `conv.call_handoff()` or `transfer_call()` from a [Tool](../entities/tool.md).
- **API:** [Handoff API](https://docs.poly.ai/api-reference/handoff/introduction).

## SIP method behaviour

- **SIP REFER.** PolyAI drops; the carrier completes the transfer. Fast, but the agent's pre-handoff utterance may be cut off.
- **SIP INVITE.** PolyAI bridges and the call stays connected through PolyAI. Use when a pre-handoff utterance must finish playing.
- **SIP BYE.** PolyAI ends the call after handoff is initiated. No SIP headers can be passed.

## Common failure modes

- **Call drops during transfer.** SIP method mismatch with the upstream carrier, destination unreachable, no default handoff configured. Verify method compatibility and destination format.
- **Pre-handoff utterance not heard by caller.** SIP REFER fires before the utterance finishes. Switch to SIP INVITE for reliable pre-handoff messaging.
- **Handoff reason or utterance not logged.** Plain Studio handoff cards don't capture these. Use `conv.call_handoff(destination=..., reason=..., utterance=...)` or the `builtin-handoff` flow step.
- **Voicemail detection unavailable on inbound.** Detection only works on **outbound** calls (via flow detection). Inbound SIP handoffs don't auto-detect voicemail on the destination side.
- **Custom SIP headers required.** Only the function-based `transfer_call()` supports dynamic headers. The Call Handoff UI does not. Refactor to function-based if `$caller_id` substitution is needed.

## Related

- [Telephony](telephony.md), [Twilio](twilio.md), [Outbound calling](outbound-calling.md), [Action](../entities/action.md).

## Authoritative docs

- [Call handoff introduction](https://docs.poly.ai/call-handoff/introduction)
- [Twilio handoff](https://docs.poly.ai/telephony/twilio/how-to-handoff)
- [Action: handoff](https://docs.poly.ai/managed-topics/how-to-setup-action/handoff)
- [Maintain: routing and handoffs](https://docs.poly.ai/learn/maintain/routing-handoffs)
