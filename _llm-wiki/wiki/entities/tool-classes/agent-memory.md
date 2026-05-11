# `conv.memory`

Persistent caller-scoped key-value store. Survives across separate conversations with the same caller. Identified by phone number today; cross-channel linking is planned.

Different from [`conv.state`](conv-object.md), which only persists within a single conversation.

## API

- `conv.memory.get(key)` — retrieve a value (or `None`).
- `conv.memory.fields()` — all stored fields as a dict.
- `key in conv.memory` — existence check.
- **Writes** happen via `conv.state[key] = value`, but only persist if `key` is listed in the agent's `state_keys` config.

## Common gotchas

- **Cached per turn.** Multiple `.get()` calls in a turn don't re-fetch.
- **Writes happen at the end of the conversation**, not per turn — the in-memory `conv.state` is what you see during the call.
- **Only configured keys persist.** Setting `conv.state` for a key not in `state_keys` doesn't save anything.
- **Values are JSON-encoded strings** — flat fields recommended for independent expiry.
- **Identifier is currently phone number only.** Cross-channel linking is a roadmap item.
- **Everything expires after 90 days** for GDPR compliance.
- **Latest write wins.** No native conflict resolution if the same caller has overlapping calls.
- **Don't make automated decisions that significantly affect the user from memory alone.** Memory is for personalisation, not for authoritative state.

## Common patterns

```python
# Returning-caller greeting
name = conv.memory.get("caller_name")
if name:
    conv.say(f"Welcome back, {name}!")

# Use prior context to skip steps
last_order = conv.memory.get("last_order_id")
if last_order:
    conv.say(f"Calling about order {last_order}?")

# Persist new data for next time
conv.state["caller_name"] = name
conv.state["last_order_id"] = order_id

# Don't accidentally overwrite
if "preferred_voice" not in conv.memory:
    conv.state["preferred_voice"] = chosen
```

## Related

- [conv-object](conv-object.md), [Variant](../variant.md).

## Authoritative docs

- [Agent memory](https://docs.poly.ai/tools/classes/agent-memory)
