# Outbound calling

Agent-initiated calls — reminders, follow-ups, campaigns. Triggered via REST API with a phone number and metadata. The agent classifies the answering party (human / IVR / voicemail) at the first turn and adapts.

## Where it lives

- **Studio:** documentation under `Configure > Numbers`.
- **API:** [Outbound Calling API](https://docs.poly.ai/api-reference/outbound/introduction) — `trigger-call`, `get-call-status`.

## Common failure modes

- **Call status retained only ~2 hours.** Poll and store the status before it expires, or implement retry logic with exponential backoff.
- **Recipient detection misfires.** The flow must classify the answering party in the first turn. If barge-in is off, the agent may speak over a voicemail prompt before detection completes. Enable barge-in and per-turn ASR biasing for low-quality audio.
- **IVR traversal loops.** The agent gets stuck in a menu. Always include an exit condition (BYE / hangup) so the agent can give up and try later.
- **DTMF not sending.** Many IVRs only accept keypress input, not speech. Use DTMF outputs (not utterances) for menu selection. See [DTMF](https://docs.poly.ai/flows/dtmf).
- **Number format wrong.** E.164 with country code, e.g. `+14155551234`. Anything else is rejected.
- **Caller timezone ignored.** Reminder calls at 3am for the recipient go badly. Respect timezone in the trigger logic.

## Related

- [Telephony](telephony.md), [Call handoff](call-handoff.md), [Voice](voice.md), [Speech recognition](../concepts/speech-recognition.md).

## Authoritative docs

- [Outbound calling](https://docs.poly.ai/telephony/outbound-calling)
- [Outbound Calling API: trigger call](https://docs.poly.ai/api-reference/outbound/endpoint/trigger-call)
- [Outbound Calling API: call status](https://docs.poly.ai/api-reference/outbound/endpoint/get-call-status)
