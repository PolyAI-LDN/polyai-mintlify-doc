# Twilio integration

PolyAI's first-class telephony partnership with Twilio. Three integration points:

1. **Voice** — connect existing Twilio numbers to a PolyAI agent via SIP.
2. **SMS** — send text messages backed by Twilio. See [SMS](sms.md).
3. **Twilio Flex** — escalate live calls into Flex for human-agent takeover.

## Where it lives

- **Studio:** `Configure > Numbers > Connect Twilio Phone Number` (voice); `Build > SMS` (messaging); `Configure > Integrations` for Flex.

## Common failure modes (voice)

- **Call doesn't reach the agent.** SIP address from `Configure > Numbers` not pasted into the Twilio number's voice configuration. Twilio dials its own routing, never reaches PolyAI.
- **Handoff dial fails.** Destination not in E.164 format (must start with `+`), or destination unreachable, or a SIP method mismatch (Twilio may be locked to SIP REFER while PolyAI is configured for INVITE).

## Common failure modes (SMS)

See [SMS](sms.md) for full detail. The Twilio-specific gotchas:

- **A2P 10DLC registration incomplete.** Required for US/Canada SMS. Approval can take weeks — start as early as possible.
- **Error 30034 Unregistered Number** — A2P registration not complete on this number.
- **Error 30035 Still Being Configured** — number is provisioning; wait or use a different number.
- **Live SMS from production number while testing.** Each environment needs its own SMS phone number; otherwise Sandbox tests send from the Live number.

## Related

- [Telephony](telephony.md), [SMS](sms.md), [Call handoff](call-handoff.md), [Outbound calling](outbound-calling.md).

## Authoritative docs

- [Twilio introduction](https://docs.poly.ai/telephony/twilio/introduction)
- [Integrate voice via SIP](https://docs.poly.ai/telephony/twilio/how-to-integrate-voice)
- [Twilio handoff](https://docs.poly.ai/telephony/twilio/how-to-handoff)
- [Integrations: Twilio](https://docs.poly.ai/integrations/voice/twilio)
