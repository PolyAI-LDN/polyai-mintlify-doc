# Voice classes

TTS provider configuration objects you pass to `conv.set_voice()` or `conv.randomize_voice()` to change the agent's voice from inside a [Tool](../tool.md).

One class per provider. Each takes provider-specific tuning parameters.

## Supported providers

- `ElevenLabsVoice`
- `CartesiaVoice`
- `PlayHTVoice`
- `RimeVoice`
- `MinimaxVoice`
- `HumeVoice`
- `GoogleVoice`
- `CustomVoice`

## Key parameters by provider

**ElevenLabs.**

- `provider_voice_id`
- `model_id` — e.g. `eleven_turbo_v2_5`, `eleven_v3`
- `stability` — 0.0–1.0 (but see gotcha for `eleven_v3`)
- `similarity_boost` — 0.0–1.0
- `speed` — 0.7–1.2

**Cartesia.**

- `provider_voice_id`
- `speed` — -1.0 to 1.0
- `emotions` — list of `Emotion(kind, intensity)`
- `model_id` — `sonic`, `sonic-preview`

**Rime.**

- `provider_voice_id`
- `speech_alpha` — < 1.0 = faster, > 1.0 = slower
- `model_id` — `mistv2`, `mist`

**Minimax.**

- `model_id`, `voice_id`
- `speed` — 0.5–2.0
- `emotion` — `happy`, `sad`, `angry`, etc.

**Hume.**

- `provider_voice_id`, `voice_description`
- `version` — 1 or 2
- `instant_mode` — ultra-low-latency

**`VoiceWeighting`** for `randomize_voice`:

- `voice` — a TTSVoice instance
- `weight` — 0.0–1.0 (weights should sum to 1.0)

## Common gotchas

- **`eleven_v3` stability is discrete: `0.0`, `0.5`, `1.0` only.** Continuous values silently misbehave.
- **`eleven_v3` does not support `optimize_streaming_latency`.**
- **Cartesia voices may render faster than expected at default speed.** Test before deploying.
- **Changing `model_id` does not invalidate the audio cache.** Either delete cache entries manually, or prepend the model ID to the voice ID. See [Audio management](../../concepts/audio-management.md).
- **Voice locale matters.** `en-GB` vs `en-IE` vs `en-US` actually changes the accent.
- **`VoiceWeighting` weights must sum to 1.0.** Voices without explicit weights share the remainder.

## Common patterns

```python
from polyai.voice import (
    ElevenLabsVoice, CartesiaVoice, Emotion, EmotionKind, EmotionIntensity, VoiceWeighting,
)

# Set a single ElevenLabs voice
conv.set_voice(ElevenLabsVoice(
    provider_voice_id="abc123",
    model_id="eleven_turbo_v2_5",
    stability=1.0,
    similarity_boost=0.7,
))

# Cartesia with emotion
conv.set_voice(CartesiaVoice(
    provider_voice_id="a1b2c3d4",
    speed=0.0,
    emotions=[Emotion(EmotionKind.POSITIVITY, EmotionIntensity.HIGH)],
))

# Randomise for repeat callers
conv.randomize_voice([
    VoiceWeighting(voice=ElevenLabsVoice(provider_voice_id="v1"), weight=0.7),
    VoiceWeighting(voice=ElevenLabsVoice(provider_voice_id="v2"), weight=0.3),
])
```

## Related

- [conv-object](conv-object.md), [Voice](../../channels/voice.md), [Voice library](../../channels/voice-library.md), [Audio management](../../concepts/audio-management.md).

## Authoritative docs

- [Voice classes](https://docs.poly.ai/tools/classes/voice)
