# Twilio Flex

Twilio's contact-centre platform. PolyAI Flex integration routes inbound calls through Flex, automates the early conversation, and escalates to live Flex agents with the conversation context attached.

This is the deeper companion to [Twilio voice / SMS](../channels/twilio.md). Flex is the contact-centre layer; the [Twilio channel page](../channels/twilio.md) covers the voice/SMS basics.

## What it enables

- Inbound calls routed through Flex are automated by the PolyAI agent first.
- Hand off to a Flex agent only when needed.
- The Flex agent UI receives the handoff context — transcript, identified problem, tickets — via the [Handoff API](https://docs.poly.ai/api-reference/handoff/introduction).
- Choice of TwiML (simple) or Twilio Studio Flow (richer routing with HTTP requests).

## Setup

1. **Request connector setup from PolyAI.** Provide:
   - Friendly name
   - Account ID (PolyAI)
   - Project ID (PolyAI)
   - Client environment (`live` / `pre-release` / `sandbox`)
   - Variant ID (if applicable)
   - Language codes for ASR/TTS (e.g. `en-GB`, `en-US`)
2. PolyAI returns a **Connector ID** (for debugging) and a **Connector Token** (for linking in Twilio).
3. **Choose a routing path:**
   - **TwiML** — minimal:
     ```xml
     <Response>
       <Say>Connecting your call...</Say>
       <Connect connectorId="[Your Connector ID]" />
     </Response>
     ```
   - **Twilio Studio Flow** — add a `Make HTTP Request` widget that fetches handoff context from the PolyAI Handoff API, then a `Send To Flex` widget that routes with the context attached.
4. **Handoff handling.** PolyAI captures handoff data in `context.state.handoff`; a Twilio Function fetches it via the Handoff API using the call SID and forwards it to the Flex UI.

## Authentication

- The **Connector Token** authenticates Twilio → PolyAI.
- The Handoff API needs an `x-api-key` header with a PolyAI [API key](../concepts/secrets-and-api-keys.md). Twilio Functions read it via:
  ```javascript
  const config = { headers: { "x-api-key": "<polyai-api-key>" } };
  const response = await axios.get(
    `https://api.polyai.app/v1/handoff_state?id=${event.call_sid}`,
    config,
  );
  ```

## Common failure modes

- **Invalid Connector Token** → the `<Connect>` step fails. Verify the token PolyAI returned matches what's pasted in.
- **Connector ID mismatch.** Routes to the wrong PolyAI agent. Verify the Connector ID in the TwiML matches the one PolyAI gave you.
- **Handoff API 401.** API key missing or wrong header. Must be `x-api-key`, not `Authorization`.
- **Studio Flow hangs.** `Make HTTP Request` widget timeout too short, or the PolyAI API endpoint is blocked from Twilio's outbound. Increase timeout; verify reachability.
- **Call SID not passed to the Function.** The Studio flow has to forward `event.call_sid` explicitly.
- **Wrong language codes.** `en-GB` vs `en-US` actually changes ASR/TTS behaviour. Specify deliberately.
- **Flex UI shows no context.** Studio flow extracts the handoff data but doesn't pass it to `Send To Flex`. Verify the variable wiring.

## Cross-references

- [Twilio (channel page)](../channels/twilio.md) — voice/SMS basics.
- [Call handoff](../channels/call-handoff.md) — the SIP-method choice that affects whether pre-handoff utterances complete.
- [SMS](../channels/sms.md) — A2P 10DLC notes for production SMS.
- [Telephony](../channels/telephony.md).

## Authoritative docs

- [Twilio integration](https://docs.poly.ai/integrations/voice/twilio)
- [Twilio voice via SIP](https://docs.poly.ai/telephony/twilio/how-to-integrate-voice)
- [Twilio handoff](https://docs.poly.ai/telephony/twilio/how-to-handoff)
- [Handoff API](https://docs.poly.ai/api-reference/handoff/introduction)
