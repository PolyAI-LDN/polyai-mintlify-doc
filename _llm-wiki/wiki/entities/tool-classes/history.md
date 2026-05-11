# `conv.history`

Chronological list of `UserInput` and `AgentResponse` events for the current conversation. Read-only inside a tool turn.

## Event shapes

**`UserInput`** — what the caller said.

- `text` (`str`) — may be empty (silence, no speech detected).
- `role` — always `"user"`.
- `to_dict()`, `to_string()`.

**`AgentResponse`** — what the agent said.

- `text` (`str`).
- `role` — always `"agent"`.
- `to_dict()`, `to_string()`.

## Common gotchas

- **`UserInput.text` can be empty.** Guard with `.strip()`.
- **Use `isinstance()` for filtering**, not `event.role == "user"`. New event types may be added; the role check breaks silently when they appear.
- **Metrics are not in history.** Use `conv.metric_events` if you need them.
- **History is immutable within a function turn.**

## Common patterns

```python
from polyai.history import UserInput, AgentResponse

# Last non-empty user input
def last_user_text(conv):
    for event in reversed(conv.history):
        if isinstance(event, UserInput) and event.text.strip():
            return event.text
    return ""

# Filter by role
user_turns = [e for e in conv.history if isinstance(e, UserInput)]

# Log the full transcript
for event in conv.history:
    conv.log.info(event.to_string())
```

## Related

- [conv-object](conv-object.md), [Conversation review](../../concepts/conversation-review.md).

## Authoritative docs

- [`history`](https://docs.poly.ai/tools/classes/history)
