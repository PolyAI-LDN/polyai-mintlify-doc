# Multilingual

A single agent serving callers in multiple languages. The agent auto-detects the caller's language via ASR, switches mid-conversation if the user does, and applies language-specific voices and knowledge content.

## Where it lives

Configuration is spread across several Studio sections:

- `Configure > General` — add languages.
- `Channels > Voice > Agent Voice` — pick a voice per language.
- `Channels > Voice > Response Control > Translations` — manual translation overrides.
- `Build > Knowledge > Managed Topics` — language variants on individual topics.

## How language-tagged content works

`<language:xx>` tags can be embedded in behaviour rules, topic content, and flow steps. The agent serves the matching block when the caller is in language `xx`.

## Common failure modes

- **Sample questions only in the primary language.** Retrieval uses the user's input language; English sample questions don't match Spanish utterances. Translate sample questions for every supported language.
- **Hardcoded responses scattered everywhere.** Translation strings copy-pasted into behaviour rules, function returns, prompts. Use the central `Translations` page and reference `conv.translations.<key>` from code.
- **Pronunciation rules with no language specified.** Apply globally across every language — fine for proper nouns, dangerous for words that exist in multiple languages.
- **Generic multilingual TTS instead of native voices.** An English-accented Spanish voice sounds wrong to native Spanish speakers. Use voices native to the target locale (e.g. Mexican Spanish for Mexico).
- **ASR diacritics stripped or mangled.** ASR has language-model dependencies that customers can't self-serve — requires PolyAI team to configure the right ASR language model.

## Related

- [Agent](agent.md), [Rule](rule.md), [Topic](topic.md), [Response control](../concepts/response-control.md), [Voice library and selection](../channels/voice-library.md).

## Authoritative docs

- [Multilingual](https://docs.poly.ai/agent-settings/multilingual)
- [Translations](https://docs.poly.ai/response-control/translations)
- [Pronunciations](https://docs.poly.ai/response-control/pronunciations)
- [Maintain: multi-language updates](https://docs.poly.ai/learn/maintain/multi-language-updates)
