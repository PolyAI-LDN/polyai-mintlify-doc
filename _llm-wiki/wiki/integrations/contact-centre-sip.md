# Contact-centre SIP integrations

PolyAI's SIP-based contact-centre integrations: Five9, Genesys Cloud (BYOC), NICE CXone, and Amazon Connect. All four are voice-layer integrations that route inbound calls into PolyAI and enable hand-off back to live human agents in the contact centre.

This page summarises the integration shape and the per-vendor specifics. Twilio is in its own page — see [Twilio Flex](twilio-flex.md).

## Shape they all share

- Inbound call hits the contact-centre platform first.
- The platform forwards (via SIP INVITE) to PolyAI.
- PolyAI handles the early conversation.
- When escalation is needed, PolyAI hands off back into the platform — usually with metadata attached so the human agent has context.
- IP allowlisting (and/or TLS) secures the SIP leg.

## Five9

[`integrations/voice/sip/five9`](https://docs.poly.ai/integrations/voice/sip/five9)

- **Routing**: two methods — by authentication token (`X-PolyAi-Auth-Token` SIP header on INVITE) or by dialled extension.
- **Transfer back**: two methods — SIP BYE with `X-contained` and `X-destination` headers (simple, max 10 custom headers), or query the [Handoff API](https://docs.poly.ai/api-reference/handoff/introduction) (no header-count limit, supports larger payloads).
- **Common failure**: hitting the 10-header limit on SIP BYE — switch to the Handoff API path.

## Genesys Cloud (BYOC)

[`integrations/voice/sip/genesys`](https://docs.poly.ai/integrations/voice/sip/genesys)

- Bring Your Own Carrier SIP trunk to Genesys Cloud.
- Pre-configured multi-tenant trunk; PolyAI provides UAT and Production tokens.
- **Region-specific SIP servers** — e.g. `kam.us-1.polyai.app` for US — over **TLS**.
- **Handoff**: SIP REFER with hex-encoded `X-User-to-User` data for context passthrough.
- **Common failure**: wrong regional SIP server endpoint, or PolyAI IP not allowlisted in the Genesys trunk config. UUI passthrough must be enabled for context to reach the agent.

## NICE CXone (Signal API)

[`integrations/voice/sip/NICECXone`](https://docs.poly.ai/integrations/voice/sip/NICECXone)

- Uses NICE's **Signal API** (REST) for handoffs rather than SIP BYE headers — supports up to 9 additional parameters for larger payloads.
- Shared connector service with pseudo numbers for routing.
- **Setup**: obtain NICE credentials (`client_id`, `client_secret`) via NICE's API application form (takes several business days), provide to PolyAI; PolyAI passes `contact_id` in the SIP INVITE X-header.
- **Form gotcha**: the application form needs the business unit number, tenant selection (Single / Global), `secret_basic` auth method, Back-End app type.

## Amazon Connect

[`integrations/voice/amazon-connect/amazon-connect`](https://docs.poly.ai/integrations/voice/amazon-connect/amazon-connect)

- Fully AWS-integrated. Uses Amazon Connect contact flows + DynamoDB + Lambda + S3.
- Call routing: Connect routes inbound → PolyAI node → PolyAI fetches contact attributes from DynamoDB via IAM role → handoff back to a Connect queue when needed → call data exported to S3.
- **Setup**: CloudFormation template + IAM role with DynamoDB / Lambda / S3 / IAM permissions, account ID and region.
- **Common failure**: IAM role policy too narrow — needs CloudFormation, S3, Lambda, DynamoDB, and IAM operations to deploy the PolyAI stack.

## Cross-references

- [Twilio Flex](twilio-flex.md) — Twilio's contact-centre integration.
- [Telephony](../channels/telephony.md), [Call handoff](../channels/call-handoff.md), [Outbound calling](../channels/outbound-calling.md).
- [Integrations overview](../concepts/integrations-overview.md).

## Authoritative docs

- [Five9 (SIP)](https://docs.poly.ai/integrations/voice/sip/five9)
- [Genesys Cloud (BYOC)](https://docs.poly.ai/integrations/voice/sip/genesys)
- [NICE CXone](https://docs.poly.ai/integrations/voice/sip/NICECXone)
- [Amazon Connect](https://docs.poly.ai/integrations/voice/amazon-connect/amazon-connect)
