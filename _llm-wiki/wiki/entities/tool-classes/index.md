# Tool classes

The Python objects available inside a [Tool](../tool.md). The central one is the `Conversation` object (always passed as the first argument, conventionally named `conv`). Everything else hangs off it.

| Class | What it gives you | Page |
|---|---|---|
| `Conversation` (`conv`) | The runtime context: state, metadata, flow control, and access to all the helpers below | [conv-object](conv-object.md) |
| `conv.utils` | Helpers: secrets, address/city extraction, entity validation, standalone LLM prompts, geocoding | [conv-utils](conv-utils.md) |
| `conv.api` | Calls to APIs configured in Studio (`conv.api.{name}.{op}()`) | [conv-api](conv-api.md) |
| `conv.log` | Structured logs that surface in Conversation Diagnosis | [conv-log](conv-log.md) |
| ASR biasing | `conv.set_asr_biasing()` and `conv.clear_asr_biasing()` for runtime ASR tuning | [asr-from-conv](asr-from-conv.md) |
| `conv.history` | The chronological conversation: `UserInput` and `AgentResponse` events | [history](history.md) |
| Voice classes | `ElevenLabsVoice`, `CartesiaVoice`, etc. — TTS configuration set via `conv.set_voice()` | [voice](voice.md) |
| `conv.memory` | Persistent caller-scoped key-value store, surviving across conversations | [agent-memory](agent-memory.md) |

## How they fit together

```
def my_tool(conv):
    # State within this conversation
    conv.state["attempts"] = conv.state.get("attempts", 0) + 1

    # Cross-conversation memory
    name = conv.memory.get("caller_name")

    # Helpers
    api_key = conv.utils.get_secret("stripe_key")

    # Configured API
    response = conv.api.bookings.create(json={"party": 4})

    # Logging
    conv.log.info("Booking attempted", status=response.status_code)
```

## Related

- [Tool](../tool.md) — the entity these classes belong to.
- [Flow](../flow.md) — tools are typically called from flow steps.
- [Action](../action.md) — tools fire from topic actions.

## Authoritative docs

- [Tools: classes overview](https://docs.poly.ai/tools/classes)
