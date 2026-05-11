# `conv.log`

Structured logging from inside a [Tool](../tool.md). Entries appear in [Conversation Diagnosis](../../concepts/conversation-review.md) and the Conversations API. Use this instead of `print()` — `print()` doesn't go anywhere useful.

## Methods

- `conv.log.info(message, **kwargs)` — routine breadcrumb.
- `conv.log.warning(message, **kwargs)` — soft failure / approaching limit.
- `conv.log.error(message, **kwargs)` — handled failure with context.
- `is_pii=True` — flag the entry as PII-sensitive (hidden from users without PII access).

## Common gotchas

- **Logs are structured, not free-form.** Don't dump entire response bodies — log identifiers and key fields.
- **`is_pii=True` matters.** PII fields not flagged are visible to anyone with conversation access.
- **`conv.log` is on `conv`, not `conv.utils`.** Easy mis-import.
- **Logs don't go to stdout/stderr.** They surface in Conversation Review and the API only.

## Common patterns

```python
# Validation breadcrumb
conv.log.info("Entity validated", entity_type="email", valid=True)

# API failure with retry context
conv.log.error(
    "CRM upsert failed",
    status=409, retriable=True, attempt=2, endpoint="contacts",
)

# PII-aware logging
conv.log.warning("Phone number provided", number="****1234", is_pii=True)

# Raw response from outbound API
conv.log_api_response(response)
```

## Related

- [conv-object](conv-object.md), [Conversation review](../../concepts/conversation-review.md).

## Authoritative docs

- [`conv.log`](https://docs.poly.ai/tools/classes/conv-log)
