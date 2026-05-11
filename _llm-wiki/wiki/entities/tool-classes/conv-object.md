# `Conversation` (`conv`)

The runtime context object passed as the first argument to every [Tool](../tool.md) function. Everything else — utils, api, log, memory — hangs off it.

## Most useful methods and properties

**Speech and flow control.**

- `conv.say(text)` — override the next agent utterance.
- `conv.goto_flow(name)`, `conv.exit_flow()` — flow transitions.
- `conv.call_handoff(destination, reason, utterance, sip_headers, route)` — transfer the call.

**State and identity.**

- `conv.state` — persistent dict across turns of this conversation.
- `conv.memory` — persistent dict scoped to the caller, surviving across conversations. See [agent-memory](agent-memory.md).
- `conv.id`, `conv.account_id`, `conv.project_id`, `conv.env`, `conv.channel_type`.
- `conv.caller_number`, `conv.callee_number` — E.164 for voice; email/ID for chat.
- `conv.entities` — dict of validated entity values from flow steps.
- `conv.sip_headers`, `conv.integration_attributes` — carrier / integration metadata.
- `conv.current_flow`, `conv.current_step`, `conv.variant`, `conv.variants`.

**Speech, ASR, voice.**

- `conv.set_voice(voice)`, `conv.randomize_voice([VoiceWeighting...])` — see [voice](voice.md).
- `conv.set_asr_biasing(...)`, `conv.clear_asr_biasing()` — see [asr-from-conv](asr-from-conv.md).

**Helpers.**

- `conv.api` — calls to Studio-configured APIs. See [conv-api](conv-api.md).
- `conv.utils` — utilities (secrets, validation, LLM, geocoding). See [conv-utils](conv-utils.md).
- `conv.log` — structured logging. See [conv-log](conv-log.md).
- `conv.history` — conversation transcript. See [history](history.md).
- `conv.functions` — call other project functions: `conv.functions.{name}()`.

**Output side-channels.**

- `conv.send_sms()`, `conv.send_sms_template()`, `conv.send_email()`.
- `conv.add_attachments([Attachment])` — visual tiles (webchat only).
- `conv.set_response_suggestions([...])` — quick-reply chips (webchat only).
- `conv.write_metric(name, value, write_once)` — custom analytics.
- `conv.discard_recording()` — suppress call recording (PII protection).
- `conv.generate_external_event(send_to_llm)` — event ID for async / webhook data.
- `conv.log_api_response(response)` — log HTTP responses for diagnosis.

## Common gotchas

- **`conv.state` is per-conversation; `conv.memory` is per-caller across conversations.** Easy to confuse.
- **Memory is read once per turn and cached.** Multiple `.get()` calls in one turn don't re-fetch.
- **Memory writes happen at the end of the conversation**, not per turn. Setting `conv.state[key] = value` only persists if `key` is in the agent's `state_keys` config.
- **`UserInput.text` can be empty** (silence, no speech detected). Guard with `.strip()`.
- **Use `isinstance()` on history events**, not `event.role` comparisons — new event types may be added.
- **`conv.api` uses environment-specific base URLs automatically.** Don't branch on `conv.env` to switch URLs.
- **`conv.set_asr_biasing()` persists across turns** until explicitly cleared or overwritten.
- **`write_metric(write_once=True)` only fires once per conversation**, even if called repeatedly.

## Common patterns

```python
# Environment / channel branching
if conv.env == "live" and conv.channel_type == "sip.polyai":
    # Voice call in production
    ...

# State accumulation across turns
conv.state["attempts"] = conv.state.get("attempts", 0) + 1

# API call with explicit error handling
response = conv.api.bookings.create_booking(json={"party_size": 4})
if response.status_code == 201:
    conv.state["booking_id"] = response.json()["id"]
else:
    conv.log.error("Booking failed", status=response.status_code)
    conv.say("I couldn't complete that just now.")

# Returning-caller greeting
name = conv.memory.get("caller_name")
if name:
    conv.say(f"Welcome back, {name}.")
conv.state["caller_name"] = name  # persists at end of call
```

## Related

- [Tool](../tool.md), [conv-utils](conv-utils.md), [conv-api](conv-api.md), [conv-log](conv-log.md), [history](history.md), [agent-memory](agent-memory.md), [voice](voice.md), [asr-from-conv](asr-from-conv.md).

## Authoritative docs

- [`conv` object](https://docs.poly.ai/tools/classes/conv-object)
