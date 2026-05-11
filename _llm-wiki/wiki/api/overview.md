# API surface overview

_Status: shallow — extend in next ingest pass._

The PolyAI API surface is large (≈ 86 docs in `api-reference/`). This page summarises the top-level shape so the support agent can route customers to the right reference. Per-endpoint detail belongs in the canonical Mintlify docs.

## API families

| Family | What it covers | Canonical docs |
|---|---|---|
| **Agents API** | CRUD for agents, branches, knowledge base topics, behaviour rules, variants, deployments, connectors, phone numbers, real-time configs | [agents/introduction](https://docs.poly.ai/api-reference/agents/introduction) |
| **Chat API** | Programmatic chat sessions: create, respond, close | [chat/introduction](https://docs.poly.ai/api-reference/chat/introduction) |
| **Conversations API v3** (current) | Read past conversations | [conversations/introduction](https://docs.poly.ai/api-reference/conversations/introduction) |
| **Conversations API v1** (legacy) | Older conversation history endpoint; new builds should use v3 | [v1 endpoint](https://docs.poly.ai/api-reference/conversations/v1/endpoint/get-conversations) |
| **Handoff API** | Read handoff records — destination, reason, utterance | [handoff/introduction](https://docs.poly.ai/api-reference/handoff/introduction) |
| **Concurrent Calls API** | Capacity / max concurrent | [concurrent-calls/introduction](https://docs.poly.ai/api-reference/concurrent-calls/introduction) |
| **DNI API** | Dynamic number insertion / reservation | [dni/introduction](https://docs.poly.ai/api-reference/dni/introduction) |
| **Alerts API** | Create and manage alert rules; list active alerts | [alerts/introduction](https://docs.poly.ai/api-reference/alerts/introduction) |
| **Webhooks API** | Manage webhook endpoints, rotate signing secrets | [webhooks/introduction](https://docs.poly.ai/api-reference/webhooks/introduction) |
| **External Events API** | Receive external webhook events; bridge-ended notifications | [external-events/introduction](https://docs.poly.ai/api-reference/external-events/introduction) |
| **Outbound Calling API** | Trigger outbound calls; poll status | [outbound/introduction](https://docs.poly.ai/api-reference/outbound/introduction) |
| **WebRTC Gateway** | WebRTC signalling for in-browser voice (AsyncAPI spec) | [webrtc-gateway/introduction](https://docs.poly.ai/api-reference/webrtc-gateway/introduction) |

## Authentication

API keys go in the `x-api-key` header (not `Authorization`). Keys are project-scoped or agent-scoped; see [Secrets and API keys](../concepts/secrets-and-api-keys.md).

## Error codes

Centralised at [api-reference/error-codes](https://docs.poly.ai/api-reference/error-codes). When a customer reports an unknown API error, look here first.

## Open follow-ups for the next ingest

- Per-endpoint pages for the high-traffic endpoints (publish deployment, promote, rollback, list conversations, get handoff).
- Worked examples for common automations (publish-then-test-then-promote pipeline; webhook receiver).

_Status: shallow — extend in next ingest pass._
