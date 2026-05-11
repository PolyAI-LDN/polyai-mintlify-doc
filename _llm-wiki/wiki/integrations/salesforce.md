# Salesforce

CRM integration. The agent can look up customer records, create and update Cases, and log call context — all in real time during the conversation.

## What it enables

- Look up account / contact / case records by phone, email, or ID.
- Create Cases with `Subject`, `Description`, `Origin`, `Status`, etc.
- Update Case status, priority, or comments.
- Log call summaries into Salesforce.
- Anything else the Salesforce REST API exposes is reachable.

## Setup

1. **Enable API Access on the Salesforce side.**
   1. Log in as a Salesforce admin.
   2. `Setup > Users > Profiles`.
   3. Edit the profile of the user PolyAI will connect as.
   4. Tick **API Enabled**.
2. **Create a Connected App.**
   1. `Setup > App Manager > New Connected App`.
   2. Name: `PolyAI Integration` (or similar).
   3. **Enable OAuth Settings.**
   4. **Callback URL** — any HTTPS URL you control (e.g. `https://yourcompany.com/oauth/callback`). Required by Salesforce; not actually used in the PolyAI flow.
   5. **OAuth Scopes** — `Full Access (full)` and `Perform requests at any time (refresh_token, offline_access)`.
   6. Save. Note the **Consumer Key** and **Consumer Secret**.
3. **Hand the credentials to PolyAI.** They need:
   - Client ID (Consumer Key)
   - Client Secret (Consumer Secret)
   - Username (Salesforce user)
   - Password (user's password **with the security token appended**)
   - Access Token URL — `https://login.salesforce.com/services/oauth2/token` for prod, `https://test.salesforce.com/services/oauth2/token` for sandbox
   - Base URL — your Salesforce instance root (e.g. `https://your_instance.salesforce.com`)
4. PolyAI handles token exchange and configures the integration. Custom functionality / specific endpoints get scoped with the account manager.

## Authentication

- OAuth 2.0 Username-Password flow. PolyAI exchanges username + password (with security token) + Consumer Key + Consumer Secret for an access token.
- Tokens are managed server-side by PolyAI. Tool code accesses Salesforce via [`conv.api`](../entities/tool-classes/conv-api.md), which adds the auth header automatically.
- Callback URL is required by Salesforce but not active in the flow.

## What the agent gains

- Tool calls that talk to Salesforce REST endpoints. Typical pattern:
  ```python
  response = conv.api.salesforce.create_case(json={
      "Subject": "Caller request — refund",
      "Description": call_summary,
      "Origin": "PolyAI",
      "Status": "New",
  })
  conv.log_api_response(response)
  ```
- Account-context personalisation: look up the caller by `conv.caller_number` and pull recent activity.

## Common failure modes

- **API Enabled not ticked on the user profile.** Case creation returns 403 Forbidden. Toggle it on.
- **Wrong / missing security token in the password.** Authentication fails: _"Invalid username, password, security token or user locked out."_ The password field is `<password><security_token>`, no space.
- **Callback URL invalid or non-HTTPS.** Connected App creation fails at the Salesforce side.
- **Wrong environment URL.** Sandbox creds against the production token endpoint won't work, and vice versa. Check `login.salesforce.com` vs `test.salesforce.com`.
- **OAuth scope missing.** `offline_access` and `full` are needed; without them token refresh and certain actions fail.
- **Case-creation HTTP 4xx.** 401 = token invalid; 400 = field mapping wrong (required field missing, picklist value invalid).

## Cross-references

- [Tool](../entities/tool.md), [`conv.api`](../entities/tool-classes/conv-api.md), [Secrets and API keys](../concepts/secrets-and-api-keys.md), [Call handoff](../channels/call-handoff.md).

## Authoritative docs

- [Salesforce integration](https://docs.poly.ai/integrations/salesforce)
