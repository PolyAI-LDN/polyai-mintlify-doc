# Response control

Three tools for fine-tuning what the agent says and how it sounds. All three live under `Channels > Voice > Response Control`.

## Stop keywords

Regex-based phrase blocking. When agent output matches a stop-keyword pattern, the response is suppressed and an optional callback function fires.

**Common failure modes:**

- Pattern too narrow — doesn't match the actual ASR / LLM output. Test patterns at regex101 against real transcripts.
- Pattern too broad — false positives. Use `\b` word boundaries and consider case-insensitive flags.
- Callback function called without conversation context — the caller hears nothing. Have the callback return a static fallback or handle gracefully.

## Translations

Centralised store for language-specific content. Functions reference values via `conv.translations.<key>`. Keeps translations out of behaviour rules and function code, where they otherwise scatter and drift.

**Common failure modes:**

- Auto-translations sound unnatural. Override manually and mark as "Manually Translated" on the card.
- Editing the main-language string doesn't update overridden translations. Manual translations are sticky; main-language edits only regenerate auto-translated versions.
- Translation key not found in functions. Key mismatch or special characters in key names — use `getattr(conv.translations, "key with special chars")`.

## Pronunciations

Phonetic rules for TTS. IPA notation (e.g. `/ˈluːvrə/` for Louvre) or regex-based replacement (e.g. read phone numbers digit-by-digit).

**Common failure modes:**

- IPA symbols invalid. Use a verified IPA chart.
- Rule order matters — top-to-bottom evaluation. A broad rule above a narrow one masks the narrow one.
- Regex special characters not escaped (`.`, `-`, `()`, `*`, `+`).
- Phone numbers read as huge numbers. Use a regex like `(\d)(\d)(\d)-(\d)(\d)(\d)-(\d)(\d)(\d)(\d)` with replacement `\1 \2 \3, ...` to read digit-by-digit.
- Diacritics still mangled even after a rule. Diacritics are an ASR-side issue; pronunciation rules can't compensate. PolyAI must configure the right ASR language model.

## Related

- [Voice](../channels/voice.md), [Multilingual](../entities/multilingual.md), [Speech recognition](speech-recognition.md).

## Authoritative docs

- [Response control introduction](https://docs.poly.ai/response-control/introduction)
- [Stop keywords](https://docs.poly.ai/response-control/stop-keywords)
- [Translations](https://docs.poly.ai/response-control/translations)
- [Pronunciations](https://docs.poly.ai/response-control/pronunciations)
