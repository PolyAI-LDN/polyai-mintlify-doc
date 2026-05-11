# SMS

Send text messages during or after a voice call — confirmations, links, follow-ups. Backed by Twilio. Supports dynamic tokens (variant attributes, entities, variables) and per-environment phone numbers.

## Where it lives

- **Studio:** `Build > SMS`.
- **In code:** `conv.send_sms()` and `conv.send_sms_template()` from inside a [Tool](../entities/tool.md).

## A2P 10DLC (US/Canada) — start early

A2P 10DLC registration is required to send SMS to US and Canadian numbers. Approval can take weeks; vague opt-in descriptions get rejected. The application should include full sample transcripts showing how the caller consents to the SMS. Begin the registration before development is complete, not after.

## Common failure modes

- **Error 30034 Unregistered Number.** Number not registered for A2P. Complete A2P registration in Twilio.
- **Error 30035 Still Being Configured.** Number provisioning still in progress. Wait or use another number.
- **Asynchronous delivery confusion.** `send_sms_template()` returns success when the template is *queued*, not when it's delivered. A failure later won't surface to the calling code. Verify delivery via the Conversation metadata or the SMS widget on the Standard dashboard.
- **SMS sent from the wrong number while testing.** Live templates use the Live environment's phone number. Configure Sandbox and Pre-release with their own SMS numbers, or every test sends from production.
- **Message split across segments.** > 160 chars splits into multiple SMS, multiplying cost. Keep templates concise.
- **Dynamic tokens not resolving.** Entity, variant attribute, or variable doesn't exist; or the syntax is off (`{{entity:name}}` vs `${attr_name}` is context-dependent — check the template type).

## Consent

Always confirm with the caller before sending: "Can I send that to you by text?" — both for caller experience and to evidence consent for A2P registration.

## Related

- [Action](../entities/action.md), [Twilio](twilio.md), [Variant](../entities/variant.md), [Tool](../entities/tool.md).

## Authoritative docs

- [SMS introduction](https://docs.poly.ai/sms/introduction)
- [Action: send SMS](https://docs.poly.ai/managed-topics/how-to-setup-action/send-sms)
