# Zendesk

Two distinct Zendesk integrations:

1. **Zendesk Talk** — voice routing. SIP-based; lets PolyAI act as the overflow / first-line answer for calls coming into a Zendesk Talk number, with handoff to live Zendesk agents.
2. **Zendesk Ticketing** — REST API integration for reading and writing tickets during a conversation.

These are independent. A customer might use one, both, or neither.

## Zendesk Talk (voice)

### What it enables

- Inbound calls hitting a Zendesk Talk number get forwarded to PolyAI when no Zendesk agents are available (overflow) or outside business hours.
- PolyAI handles the call; if escalation is needed, it hands off to Zendesk agents via SIP, with the ticket ID attached as a SIP header.

### Setup

1. **Zendesk side — PSTN forwarding.**
   1. Create an empty agent group in Zendesk Talk.
   2. Set the inbound number to route only to that group.
   3. Enable **Overflow forwarding**: forward when no agents available (the empty group ensures that's always true) and/or outside business hours.
   4. **Disable voicemail** for that number — otherwise overflow calls go to voicemail instead of PolyAI.
2. **Zendesk side — SIP line.**
   1. `Admin Center > Channels > Talk > Lines > Add Line > Add SIP Line`.
   2. Register a SIP address, name it after the project / client.
   3. Add PolyAI's IP range to the allowlist for SIP traffic.
3. **PolyAI side.** Contact your account manager to set up the outbound integration. PolyAI configures the SIP routing.
4. **Handoff.** Once verified, PolyAI can hand off to Zendesk agents. The agent receives the call with `X-Zendesk-Ticket-Id` SIP header (if a ticket exists). See [Call handoff](../channels/call-handoff.md) for the SIP-method choice.

### Authentication

- SIP-only at the voice layer. No OAuth or API token.
- IP allowlisting is the security boundary.

### Common failure modes

- **Voicemail enabled on the number** → overflow goes to voicemail, not PolyAI.
- **Overflow rule not configured for both empty-group and out-of-hours** → calls don't forward.
- **PolyAI IP not allowlisted** → SIP traffic blocked.
- **SIP address not registered or verified** → PolyAI can't initiate the leg.
- **`X-Zendesk-Ticket-Id` header missing** in handoffs — Zendesk side hasn't configured ticket lookup; the agent gets the call but no ticket context.

---

## Zendesk Ticketing (REST API)

### What it enables

- Look up tickets by ID, customer email, or status.
- Create tickets (subject, description, priority, tags).
- Update existing tickets — status, priority, comments.
- Link tickets to caller context for continuity across channels.

### Setup

1. **Enable API token access.** Zendesk Admin Center → `Apps and integrations > APIs > Zendesk API` → enable **Token access** → Save.
2. **Generate an API token.** `Add API token` → name it (e.g. `polyai-integration`) → Create. **Copy the token immediately** — it's only displayed once.
3. **Provide PolyAI with:**
   - Organisation URL — `https://<subdomain>.zendesk.com` (e.g. `https://acme.zendesk.com`)
   - User Email — the email of the user who generated the token
   - API Token — from step 2.

### Authentication

- HTTP Basic Auth. Username = `<email>/token`, Password = `<api_token>`.
- Encoded as `Authorization: Basic <base64(email/token:api_token)>`.
- Tokens are rotatable from Zendesk Admin Center.

### What the agent gains

```python
# Look up a ticket
response = conv.api.zendesk.get_ticket(ticket_id="12345")
if response.status_code == 200:
    ticket = response.json()["ticket"]
    conv.say(f"That's ticket {ticket['id']} — currently {ticket['status']}.")

# Create a ticket
response = conv.api.zendesk.create_ticket(json={
    "ticket": {
        "subject": "Caller refund request",
        "description": call_summary,
        "priority": "normal",
    }
})
```

### Common failure modes

- **Token access not enabled** → 401 Unauthorized on every call.
- **Token not copied at creation** — it's not retrievable after first display. Generate a new one.
- **Wrong username format.** Must be `email/token`, not just the email. Authentication fails.
- **Wrong subdomain.** Production vs sandbox URL — easy mismatch.
- **Generating user not an admin** — couldn't enable token access in step 1 or generate a token in step 2.
- **Querying a non-existent ticket ID** → 404. Validate the ID before querying when possible.

## Cross-references

- [Twilio Flex](twilio-flex.md) — different vendor, similar routing pattern.
- [Call handoff](../channels/call-handoff.md), [Telephony](../channels/telephony.md).
- [Tool](../entities/tool.md), [`conv.api`](../entities/tool-classes/conv-api.md).

## Authoritative docs

- [Zendesk Talk integration](https://docs.poly.ai/integrations/zendesk)
- [Zendesk ticketing](https://docs.poly.ai/integrations/zendesk-ticketing-solutions)
