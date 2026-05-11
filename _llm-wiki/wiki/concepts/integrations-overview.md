# Integrations overview

PolyAI integrates across telephony, CRM, hospitality, healthcare, knowledge, payments, and the Model Context Protocol (MCP). The list below is the headline set; canonical depth lives in the per-integration docs.

## Telephony / contact centre

- [Twilio](../channels/twilio.md) — voice (SIP) and SMS basics. **First-class.** [Twilio Flex deep-dive](../integrations/twilio-flex.md) for the contact-centre layer.
- [Contact-centre SIP integrations](../integrations/contact-centre-sip.md) — Five9, Genesys, NICE CXone, Amazon Connect.
- [Dialpad](https://docs.poly.ai/integrations/voice/dialpad).
- [Zendesk Talk](../integrations/zendesk.md) — voice routing and overflow (deep-dive).
- [Custom SIP](https://docs.poly.ai/integrations/voice/sip/custom-sip) and [DNIS pool](https://docs.poly.ai/integrations/voice/dnis-pool).

## CRM and ticketing

- [Salesforce](../integrations/salesforce.md) — case creation, OAuth (deep-dive).
- [Zendesk ticketing](../integrations/zendesk.md) — REST API for tickets (deep-dive on the same page as Zendesk Talk).

## Hospitality, payments, and adjacent services

[OpenTable, Stripe, and adjacent services](../integrations/opentable-and-payments.md) — single deep-dive page covering OpenTable, Stripe, Tripleseat, HotSOS, Gladly (which feeds [Connected Knowledge](../entities/connected-knowledge.md)), PCI Pal, DeepL, Google Sheets, Ideal Postcode, Zoom, Epic, and others. Healthcare, knowledge bases, payments, address lookup, translation, and conferencing all live there.

## MCP (Model Context Protocol)

[MCP integration deep-dive](../integrations/mcp.md). Connect any MCP-compliant server as a tool source. Got promoted to first-class UI in release 26.04.

## Custom APIs

For everything else, [custom HTTP integrations](https://docs.poly.ai/api/introduction) — `Configure > APIs`. Match the platform's auth scheme exactly (header vs query vs OAuth).

## Related

- [Tool](../entities/tool.md), [Connected knowledge](../entities/connected-knowledge.md), [Secrets and API keys](secrets-and-api-keys.md), [Twilio](../channels/twilio.md).

## Authoritative docs

- [Integrations introduction](https://docs.poly.ai/integrations/introduction)
- [Managed services](https://docs.poly.ai/integrations/managed-services)
