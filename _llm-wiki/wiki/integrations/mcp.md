# MCP (Model Context Protocol)

Connect any MCP-compliant server as a tool source. Studio discovers the tools the server exposes; the agent can call them in conversation. No custom tool code needed.

Got promoted to a first-class UI in **release 26.04** — see [release notes](../reference/releases.md). Older experimental MCP config still works but is hidden once you add a new server through the UI.

## What it enables

- Connect external services that already speak MCP — internal company servers, third-party MCP gateways, data lookup services, action triggers.
- Auto-discovery of available tools from the server.
- Granular per-tool toggling — only the tools you enable are visible to the agent.
- Use those tools directly in step prompts (basic mode: LLM infers inputs from schema; advanced mode: specify inputs explicitly).
- Wrap MCP tool calls in PolyAI [Tools](../entities/tool.md) when you want logging or state updates around them.

## Setup

1. **`Configure > Integrations > MCP`** → `Add MCP integration`.
2. **MCP server URL** — must be HTTPS.
3. **Timeout** — 1–30 seconds, default 15. Set this to comfortably exceed the slowest tool the server exposes.
4. **Authentication** — pick one:
   - **Header** — header name (e.g. `X-API-Key`) + secret from the [Secrets vault](../concepts/secrets-and-api-keys.md).
   - **Query parameter** — parameter name (e.g. `api_key`) + secret.
   - **OAuth** — client ID, client secret (vault), token URL, optional audience and scope.
5. `Connect`. Studio queries the server and lists discovered tools.
6. Toggle tools on/off — disabled tools aren't exposed to the agent.

Optionally limit discovery with the `tools` query parameter on the server URL: `?tools=join_session,get_html`.

## Authentication

- Three modes: HTTP header, URL query parameter, OAuth 2.0 client credentials.
- All credentials live in the [Secrets vault](../concepts/secrets-and-api-keys.md). The agent must be granted access to the secret.
- OAuth uses standard client-credentials flow — token exchange at the configured URL.
- No tool-schema setup is needed; the LLM reads the schema directly from the MCP server's discovery response.

## Common failure modes

- **Connection fails.** HTTPS-only — verify the URL is reachable; check auth credentials and that the configured secret has agent access.
- **No tools discovered.** Server may expose none, or the discovery request timed out. Increase timeout; click `Refresh`.
- **Tools enabled but not usable by the agent.** Toggle state matters; double-check the per-tool toggle is on.
- **Discovery shows tools you don't want.** Use the `?tools=...` query parameter on the URL to whitelist.
- **Old experimental MCP config disappeared.** Adding a new MCP server via the new UI hides the old config (it keeps running in background, but stop relying on it — migrate).

## Cross-references

- [Tool](../entities/tool.md) — wrap MCP calls when you want extra logging or state.
- [Secrets and API keys](../concepts/secrets-and-api-keys.md) — auth credentials.
- [Integrations overview](../concepts/integrations-overview.md).

## Authoritative docs

- [MCP integration](https://docs.poly.ai/integrations/mcp)
