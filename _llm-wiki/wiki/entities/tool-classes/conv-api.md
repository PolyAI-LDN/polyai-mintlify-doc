# `conv.api`

Client for calling APIs that have been configured in Studio under `Configure > APIs`. The configuration (base URL, auth, operations) lives in Studio; the tool just calls them: `conv.api.{api_name}.{operation_name}(...)`.

## Calling shape

```python
response = conv.api.bookings.create_booking(
    booking_id="abc",          # path variable (named or positional)
    params={"include": "guest"},
    json={"party_size": 4},
    headers={"X-Request-ID": conv.id},
)
```

Returns a standard HTTP response: `response.status_code`, `response.json()`, `response.text`.

## Common gotchas

- **The API must be configured in Studio first.** Names use snake_case.
- **Environment-specific base URLs apply automatically.** **Don't branch on `conv.env` to switch URLs** — that's already handled.
- **HTTP errors are not raised.** Always check `status_code` explicitly. A 5xx won't throw.
- **Bodies are not parsed automatically.** Call `response.json()` or read `response.text`.
- **Auth headers (Bearer, API key, etc.) are added automatically** from the Studio config — don't add them in tool code.
- **Timeout and retry behaviour are managed internally.** No explicit control from the tool.

## Common patterns

```python
# Simple GET with status checks
response = conv.api.orders.get_order(order_id="12345")
if response.status_code == 200:
    conv.state["total"] = response.json()["amount"]
elif response.status_code == 404:
    conv.say("I couldn't find that order.")
else:
    conv.log.error("Order lookup failed", status=response.status_code)
    conv.say("That system is down right now.")

# POST with body and request id
response = conv.api.bookings.create(
    json={"party_size": 4, "date": "2026-05-01"},
    headers={"X-Request-ID": conv.id},
)
conv.log_api_response(response)
```

## Related

- [conv-object](conv-object.md), [conv-log](conv-log.md), [Secrets and API keys](../../concepts/secrets-and-api-keys.md), [Integrations overview](../../concepts/integrations-overview.md).

## Authoritative docs

- [`conv.api`](https://docs.poly.ai/tools/classes/conv-api)
