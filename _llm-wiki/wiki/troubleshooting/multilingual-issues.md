# Troubleshooting: multilingual issues

See [Multilingual](../entities/multilingual.md). Multilingual problems generally fall into three buckets: knowledge translation, language detection, and pronunciation.

---

## Symptom: Translations awkward or culturally off

**Cause:** auto-translation is insufficient; cultural / regional context missing.

**Fix:** create manual overrides under `Channels > Voice > Response Control > Translations`. Use culturally-appropriate equivalents, not literal translations.

**Prevention:** translate with native speakers. Test language switching in Agent Chat. Audit monthly for parity across languages.

**Source:** [Maintain: multi-language updates](https://docs.poly.ai/learn/maintain/multi-language-updates), [Translations](https://docs.poly.ai/response-control/translations).

---

## Symptom: Agent doesn't switch language / detects too aggressively

**Cause:** language detection sensitivity.

**Fix:** use `<language:xx>` tags in behaviour rules to control detection. If users need to choose explicitly (e.g. for compliance), create a language-selection topic.

**Prevention:** test mid-conversation language switches. Document detection rules.

**Source:** [Maintain: multi-language updates](https://docs.poly.ai/learn/maintain/multi-language-updates).

---

## Symptom: Sample questions match in English but not in the user's language

**Cause:** sample questions only exist in the agent's primary language. Retrieval is language-sensitive — Spanish utterances don't match English sample questions.

**Fix:** translate sample questions for every supported language inside the topic.

**Source:** [Multilingual](https://docs.poly.ai/agent-settings/multilingual).

---

## Symptom: Pronunciation problems in non-English languages

**Cause:** TTS doesn't recognise language-specific characters or words.

**Fix:** add language-specific pronunciation rules under `Channels > Voice > Response Control > Pronunciations`. Use multilingual TTS models (ElevenLabs multilingual, Cartesia Sonic).

**Prevention:** test with native speakers; use language-specific voice models when possible.

**Source:** [Maintain: multi-language updates](https://docs.poly.ai/learn/maintain/multi-language-updates), [Pronunciations](https://docs.poly.ai/response-control/pronunciations).

---

## Symptom: Diacritics garbled (`č`, `ć`, `š`, etc.)

This is an ASR-side issue, not a translation issue. See [voice-and-audio-issues.md](voice-and-audio-issues.md) — fix is **not customer-self-serve**, requires PolyAI to configure the right ASR language model.
