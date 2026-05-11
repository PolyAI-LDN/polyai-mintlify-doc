# `conv.utils`

Utility helpers attached to the [`conv`](conv-object.md) object. Secret retrieval, address parsing, entity validation, ad-hoc LLM calls, geocoding.

## Most useful methods

- `conv.utils.get_secret(name)` — retrieve a [secret](../../concepts/secrets-and-api-keys.md) (string or dict depending on storage type).
- `conv.utils.extract_address(addresses=None, country="US")` — parse a postal address from the most recent user input. Returns an `Address` dataclass.
- `conv.utils.extract_city(city_spellings=None, states=None, country="US")` — extract city + optional state.
- `conv.utils.prompt_llm(prompt, show_history=False, return_json=False, model="gpt-4o")` — standalone LLM request from inside a tool.
- `conv.utils.validate_entity(value, entity_config)` — validate against an entity schema (Email, Phone, Date).
- `conv.utils.geocode_address(address_string)` — address → coordinates.

## Common gotchas

- **Latency.** Each call adds seconds (LLM or external service). Add [`delay-control`](https://docs.poly.ai/tools/delay-control) filler phrases.
- **`extract_address()` without an `addresses` list can miss street numbers/names.** Always confirm with the caller before committing.
- **`extract_city()` only guarantees the `city` field.** State and others may be `None`.
- **`prompt_llm()` requires account activation.** Raises `NotImplementedError` if disabled — confirm with PolyAI before using.
- **Validated entity values come back as strings**, even for numeric types. Cast before comparing.
- **`get_secret()` raises `SecretNotFound` or `MissingAccess`.** Wrap or pre-check.
- **Operations only see the most recent user input.** Don't expect them to read further back.

## Common patterns

```python
# Extract and confirm an address
addr = conv.utils.extract_address(country="US")
conv.state["street"] = addr.street_name
conv.say(f"I have {addr.street_number} {addr.street_name}. Right?")

# Validate before storing
result = conv.utils.validate_entity("user@example.com", conv.utils.EmailConfig())
if result.valid:
    conv.state["email"] = result.value

# Quick standalone LLM summary
summary = conv.utils.prompt_llm(
    "Summarise the conversation so far in two sentences.",
    show_history=True,
    model="gpt-4o-mini",
)

# Get secret for outbound API
api_key = conv.utils.get_secret("stripe_api_key")
```

## Related

- [conv-object](conv-object.md), [Secrets and API keys](../../concepts/secrets-and-api-keys.md), [Tool](../tool.md).

## Authoritative docs

- [`conv.utils`](https://docs.poly.ai/tools/classes/conv-utils)
