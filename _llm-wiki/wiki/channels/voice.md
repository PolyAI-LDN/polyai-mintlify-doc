# Voice

The voice channel: speech-to-text (ASR) → LLM → text-to-speech (TTS) on inbound and outbound phone calls. The agent answers a phone number, transcribes the caller, generates a response, and speaks it back.

PolyAI integrates with multiple TTS providers (ElevenLabs, Cartesia, Hume, etc.). Voice is configured per-language for [multilingual](../entities/multilingual.md) agents.

## Where it lives

- **Studio:** `Channels > Voice`.
- Voice can also be set programmatically inside [Tools](../entities/tool.md) using provider classes (`CartesiaVoice`, `ElevenLabsVoice`, `HumeVoice`).

## Common failure modes

- **Voice mismatch with audience.** Wrong accent, gender, or tone for the customer base produces distrust and hangups. Always preview in the [Voice library](voice-library.md) using realistic agent utterances before locking in.
- **TTS stability set too low (< 0.7).** Output sounds inconsistent across responses. 0.7 is a sensible floor.
- **Audio cache not invalidating after model change.** Changing `model_id` doesn't auto-clear cached audio. Workaround: prepend the model ID to the voice ID (e.g. `eleven_turbo_v2_5/<voice-id>`) or manually delete the cache via [Audio Management](../concepts/audio-management.md).
- **`eleven_v3` model parameter quirks.** Stability only supports discrete values `0.0` / `0.5` / `1.0` (not continuous). Don't pass `optimize_streaming_latency`.
- **Diacritics mangled on multilingual agents.** ASR may strip `č`, `ć`, `š`. Requires PolyAI team to configure the correct ASR language model — not a self-serve fix.

## Related

- [Voice library and multi-voice](voice-library.md), [Audio management](../concepts/audio-management.md), [Speech recognition](../concepts/speech-recognition.md), [Response control](../concepts/response-control.md), [Multilingual](../entities/multilingual.md).

## Authoritative docs

- [Voice introduction](https://docs.poly.ai/voice/introduction)
- [Agent voice](https://docs.poly.ai/voice/agent)
- [Voice configuration](https://docs.poly.ai/voice/voice-configuration)
- [Maintain: voice and audio updates](https://docs.poly.ai/learn/maintain/voice-audio-updates)
