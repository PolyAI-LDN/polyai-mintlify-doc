# OpenTable, Stripe, and adjacent service integrations

Single page summarising vertical-specific service integrations that share the same shape: credentials in the vault, OAuth or API-key auth, and a small surface of operations the agent reaches via [`conv.api`](../entities/tool-classes/conv-api.md).

## OpenTable

[`integrations/opentable`](https://docs.poly.ai/integrations/opentable)

- Restaurant reservations for OpenTable Core / Pro customers.
- **Auth**: OAuth 2.0 client credentials. Token endpoint: `POST https://oauth.opentable.com/api/v2/oauth/token?grant_type=client_credentials` with `Authorization: Basic <base64(client_id:client_secret)>`.
- **Setup**: log into OpenTable for Groups dashboard → find PolyAI in the marketplace → provide a unique identifier from PolyAI.
- **Booking payload**: `first_name`, `last_name`, `phone` (with `country_code`), `restaurant_id`, `reservation_token`, optional `special_request`.
- **Common gotcha**: client secret displayed once; must be base64-encoded for Basic Auth.
- **Webhook support** for real-time notifications.

## Stripe

[`integrations/stripe`](https://docs.poly.ai/integrations/stripe)

- Payment status lookup, refunds, coupon creation, subscription management.
- **Managed integration** — contact PolyAI account manager with the API secret key.
- **Capabilities**: query charges by customer email/phone; initiate refunds; create promotional coupons.
- **Limitation**: direct card collection requires PCI compliance — use [PCI Pal](https://docs.poly.ai/integrations/pci-pal) for secure card capture.
- **Credentials**: Publishable key (client-side, fine to expose), Secret key (server-side, never share), Webhook secret (optional).
- **Test mode** available for development.
- **Scope**: focus on payment status and simple refunds — disputes and complex account changes require humans.

## Other adjacent services

- [Tripleseat](https://docs.poly.ai/integrations/tripleseat) — large-party / events bookings for hospitality.
- [HotSOS](https://docs.poly.ai/integrations/hotSOS) — hospitality property management.
- [Design My Night](https://docs.poly.ai/integrations/design-my-night), [Liveres](https://docs.poly.ai/integrations/liveres) — restaurant / venue booking.
- [Epic](https://docs.poly.ai/integrations/epic) — healthcare EHR.
- [Gladly](https://docs.poly.ai/integrations/gladly) — feeds [Connected Knowledge](../entities/connected-knowledge.md).
- [Google Sheets](https://docs.poly.ai/integrations/google-sheets) — data lookup against simple sheets.
- [Ideal Postcode](https://docs.poly.ai/integrations/ideal-postcode) — UK address lookup.
- [DeepL](https://docs.poly.ai/integrations/deepl) — translation.
- [PCI Pal](https://docs.poly.ai/integrations/pci-pal) — PCI-compliant card capture.
- [Zoom](https://docs.poly.ai/integrations/zoom) — conferencing.

## Cross-references

- [Integrations overview](../concepts/integrations-overview.md), [Tool](../entities/tool.md), [`conv.api`](../entities/tool-classes/conv-api.md), [Secrets and API keys](../concepts/secrets-and-api-keys.md).

## Authoritative docs

See per-integration links above.
