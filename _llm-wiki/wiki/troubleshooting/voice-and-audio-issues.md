# Troubleshooting: voice and audio issues

See [Voice](../channels/voice.md), [Audio management](../concepts/audio-management.md), [Speech recognition](../concepts/speech-recognition.md), [Response control](../concepts/response-control.md).

---

## Symptom: Voice mispronounces words / brand names

**Cause:** TTS doesn't recognise the term.

**Fix:** add a pronunciation rule under `Channels > Voice > Response Control > Pronunciations`. Use IPA notation or SSML where appropriate.

**Prevention:** review recent calls for pronunciation issues; document rule additions for the team.

**Source:** [Maintain: voice and audio updates](https://docs.poly.ai/learn/maintain/voice-audio-updates), [Pronunciations](https://docs.poly.ai/response-control/pronunciations).

---

## Symptom: Voice sounds robotic or quality has degraded

**Likely causes:** TTS provider quality; speech rate too high; uncached audio for repeated phrases.

**Fix:** switch TTS provider (Cartesia or ElevenLabs); adjust speech rate in Agent Voice settings; cache frequently-used phrases via [Audio Management](../concepts/audio-management.md).

**Prevention:** monthly audio quality review. For non-English projects, use multilingual voice models (e.g. ElevenLabs `eleven_multilingual_v2`).

**Source:** [Maintain: voice and audio updates](https://docs.poly.ai/learn/maintain/voice-audio-updates).

---

## Symptom: Agent speaks too fast / interrupts too much

**Cause:** Turbo mode with barge-in enabled; rate too high.

**Fix:** switch to Balanced (~1600ms) or tune barge-in per step. Adjust speech rate via the voice settings cog.

**Prevention:** test with real callers. Watch interruption patterns in analytics.

**Source:** [Maintain: voice and audio updates](https://docs.poly.ai/learn/maintain/voice-audio-updates), [Audio management](https://docs.poly.ai/audio-management/introduction).

---

## Symptom: Voice speed change isn't being heard

**Cause:** cached audio is playing.

**Fix:** `Channels > Voice > Audio management` → find the cached clip → update speed → Sync to regenerate.

**Source:** [Maintain: common issues](https://docs.poly.ai/learn/maintain/common-issues).

---

## Symptom: Disclaimer voice sounds different from agent voice

**Cause:** Disclaimer has its own voice configuration.

**Fix:** `Channels > Voice > Agent Voice > Disclaimer`. Match it to the main voice (or intentionally use a different voice for emphasis — but be deliberate).

**Source:** [Maintain: common issues](https://docs.poly.ai/learn/maintain/common-issues).

---

## Symptom: Low ASR accuracy / words misheard

**Likely causes:** background noise, strong accent, uncommon words, poor connection.

**Fix:**

1. Check raw transcripts in [Conversation Diagnosis](../concepts/conversation-review.md) → Transcription layer.
2. Add domain terms to keyphrase boosting under `Channels > Voice > Speech recognition`.
3. Add transcript correction rules for branded terms.
4. Annotate transcription errors during review so improvements feed back.

**Prevention:** monitor accuracy regularly. Update biasing as new branded terms appear.

**Source:** [Maintain: performance monitoring](https://docs.poly.ai/learn/maintain/performance-monitoring), [Annotations](https://docs.poly.ai/analytics/conversations/annotations), [Speech recognition](https://docs.poly.ai/speech-recognition/introduction).

---

## Symptom: Diacritics being stripped or mangled

**Cause:** ASR language model doesn't support the diacritics natively.

**Fix:** **Not customer-self-serve.** Contact PolyAI to configure the right ASR language model. Transcript corrections can't compensate for what the ASR never produced.

**Source:** [Speech recognition](https://docs.poly.ai/speech-recognition/introduction).
