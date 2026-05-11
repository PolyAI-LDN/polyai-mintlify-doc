# Telephony

Phone numbers, connectors, and routing. Three procurement paths:

1. **Buy direct from PolyAI** — fastest for greenfield deployments.
2. **Connect existing Twilio** — see [Twilio integration](twilio.md).
3. **SIP integration with a contact-centre provider** — Five9, Genesys, NICE CXone, Amazon Connect, Dialpad, etc. Configured by the PolyAI team.

## Where it lives

- **Studio:** `Configure > Numbers`. Add, assign, and route numbers per [Environment](../entities/environment.md).
- **API:** [Phone numbers and Connectors endpoints](https://docs.poly.ai/api-reference/agents/introduction) for bulk import and reassignment.

## Common failure modes

- **Number doesn't route to the agent.** Usually one of: wrong connector assigned, number not published to the target environment, or SIP peering misconfigured at the carrier side. Verify the number's environment and connector binding before debugging anything else.
- **Inbound calls dropping.** No fallback number configured, agent unavailable, or SIP REFER/INVITE method mismatch with the upstream provider. Contact PolyAI to verify the routing config.
- **New variant doesn't appear in the number assignment UI.** The project hasn't been republished after the variant was added.
- **Calls routing to the wrong agent.** SIP addresses (main + fallback) in the carrier's routing table don't match what's configured in PolyAI.

## Related

- [Twilio](twilio.md), [Outbound calling](outbound-calling.md), [Call handoff](call-handoff.md), [Variant](../entities/variant.md), [Environment](../entities/environment.md).

## Authoritative docs

- [Telephony introduction](https://docs.poly.ai/telephony/introduction)
- [How to buy a number](https://docs.poly.ai/telephony/how-to-buy-number)
- [Route management](https://docs.poly.ai/telephony/route-management)
