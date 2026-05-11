# Secrets and API keys

Two distinct things that customers easily confuse.

## Secrets

Account-level encrypted storage for credentials a [Tool](../entities/tool.md) needs at runtime — third-party API keys, integration tokens, etc. Retrieved in code via `conv.utils.get_secret()`.

- **Studio:** `Secrets` tab on the workspace homepage. Values are masked by default since [release 26.02](../reference/releases.md); click into a field to unmask.
- Per-agent access control: a secret must be granted to the agent that uses it.

**Common failure modes:**

- **Function can't access secret** → agent hasn't been granted access in `Secrets > Agent Access`. Update there; takes effect immediately.
- **Stored as key/value but expecting a string** → key/value secrets return a dict; single-value secrets return a string. Match the storage type.
- **Hardcoded credentials in tool code.** Never commit secrets in code; always retrieve via `get_secret()`.
- **Botched rotation.** Always: update the new value in the Secrets vault → test → then revoke the old credentials in the external service. Don't pre-revoke.

## API keys

Project-level tokens used by external systems to call PolyAI's APIs (Conversations, Handoff, External Events).

- **Studio:** `API Keys` tab.
- Scoped to all agents or to specific agents.

**Common failure modes:**

- **Key visible only at creation** — copy immediately. Cannot retrieve afterwards.
- **Expired key.** Keys have expiry dates; create new before old expires.
- **Metrics not in API responses.** Two requirements: (a) the API key has metrics permission, (b) the project has the metric enabled. Both must be true.
- **401 Unauthorized.** Pass the key in the `x-api-key` header (not `Authorization`).

## Related

- [Tool](../entities/tool.md), [User management](user-management.md), [Integrations overview](integrations-overview.md).

## Authoritative docs

- [Secrets introduction](https://docs.poly.ai/secrets/introduction)
- [How to set up secrets](https://docs.poly.ai/secrets/how-to-setup)
- [Access control for secrets](https://docs.poly.ai/secrets/how-to-access-control)
- [API keys](https://docs.poly.ai/secrets/api-keys)
