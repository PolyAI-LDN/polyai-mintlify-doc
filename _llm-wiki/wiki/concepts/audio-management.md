# Audio management

Caching of TTS audio for faster playback, plus interaction-style and barge-in tuning. Lives under `Channels > Voice > Audio management`.

## Caching

The cache stores phrases generated 2 or more times in 24 hours. Caching greetings, transfer messages, and other repeated lines cuts perceived latency dramatically.

**Common issue: expected audio not in cache.** It hasn't been generated twice in 24 hours. Manually upload, or generate it through repeated test calls.

**Cache invalidation gotcha.** Changing the model ID does **not** auto-clear cached audio. Either delete cache entries manually, or include the model ID as a prefix on the voice ID (e.g. `eleven_turbo_v2_5/<voice-id>`) so a model change implicitly produces a new cache key.

## Interaction style

Three modes trade latency for accuracy:

| Mode | Approx. latency | When to use |
|---|---|---|
| Turbo | ~400 ms | Highly responsive feel; requires barge-in for caller control |
| Balanced | ~1600 ms | Default; good general-purpose |
| Precise | ~2000 ms | Higher LLM quality, slower turns |

## Barge-in

Lets the caller interrupt the agent mid-utterance. On by default in Turbo. Two failure modes:

- **Sensitive agent steps cut off.** The caller (or background noise) interrupts during a booking confirmation or payment step. Disable barge-in per-flow or per-step for these.
- **Noisy environments trigger false barge-in.** Background sound interrupts the agent. Either disable barge-in entirely or use noise filtering.

## Related

- [Voice](../channels/voice.md), [Speech recognition](speech-recognition.md), [Response control](response-control.md).

## Authoritative docs

- [Audio management introduction](https://docs.poly.ai/audio-management/introduction)
