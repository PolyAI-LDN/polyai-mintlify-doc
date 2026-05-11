# ASR biasing from `conv`

Runtime ASR tuning from inside a [Tool](../tool.md). Bias the speech recogniser toward terms you know are about to appear — typically pulled from an API call (a known booking reference, a customer's name) or domain vocabulary.

## Methods

- `conv.set_asr_biasing(keywords=None, custom_biases=None)` — apply biasing.
- `conv.clear_asr_biasing()` — clear it.

## Common gotchas

- **Biasing persists across turns** until cleared or overwritten. Best practice: clear after the verification step that needed it.
- **Function-level biasing has highest priority** — over global and flow-level settings.
- **Cannot be configured at the flow level itself.** Use global or per-step settings, with function-level override when needed.
- **`keywords` are biased equally; `custom_biases` lets you weight terms.**
- **Invalid inputs raise `ValueError`** at runtime.

## Common patterns

```python
# Equal weight on a list of terms
conv.set_asr_biasing(keywords=["booking", "cancellation", "refund"])

# Weighted biases
conv.set_asr_biasing(custom_biases={
    "booking_reference": 3.0,
    "surname": 3.0,
    "cancellation": 2.0,
})

# Bias on data fetched from an API
booking = conv.api.reservations.get_booking().json()
conv.set_asr_biasing(custom_biases={
    booking["surname"]: 3.0,
    booking["reference"]: 3.0,
})
conv.say("Confirm your surname and reference, please.")
# ... after the verification step
conv.clear_asr_biasing()
```

## Related

- [conv-object](conv-object.md), [Speech recognition](../../concepts/speech-recognition.md), [Flow](../flow.md).

## Authoritative docs

- [ASR from `conv`](https://docs.poly.ai/tools/classes/asr-from-conv)
