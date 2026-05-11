# Voice library and multi-voice

## Voice library

The searchable catalogue of TTS voices (100+) across the supported providers. Filter by language, region, gender; preview with custom text; favourite voices for reuse.

- **Studio:** `Channels > Voice > Agent Voice > Change` opens the library. Two tabs: **Explore** (all voices with filters) and **Favourites**.

### Picking a good voice

The dedicated guidance is at [choosing-a-good-voice](https://docs.poly.ai/voice/choosing-a-good-voice). Headline: preview with text typical of the agent's actual responses, not the default sample text. Match accent to caller base, not to brand vanity.

## Multi-voice

Assign 2–10 voices to a single agent with probability weights. The agent randomly picks a voice at conversation start. Use case: simulate a team, or vary voice for repeat callers so the experience feels less robotic.

- **Studio:** `Channels > Voice > Multi-voice`.
- **Code:** `conv.randomize_voice([VoiceWeighting(...)])` inside a Tool.

### Common failure modes

- **Weights don't sum to 1.0** (or 100% in the UI). Voice selection silently fails or behaves unpredictably. Check before saving.
- **More than 10 voices.** Platform limit. Drop unused.
- **One weight ≥ 0.9.** Most callers always hear the same voice — defeats the point. Rebalance.

## Authoritative docs

- [Voice library](https://docs.poly.ai/voice/voice-library)
- [Choosing a good voice](https://docs.poly.ai/voice/choosing-a-good-voice)
- [Multi-voice](https://docs.poly.ai/voice/multi-voice)
- [Add a new voice](https://docs.poly.ai/voice/add-a-new-voice)
- [Custom voice request](https://docs.poly.ai/voice/custom-voice-request)
