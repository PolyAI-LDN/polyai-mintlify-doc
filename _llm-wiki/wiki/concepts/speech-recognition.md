# Speech recognition (ASR)

Two layers of tuning:

1. **Keyphrase boosting** — bias the ASR model toward domain-specific terms during transcription.
2. **Transcript corrections** — post-process misheard text via regex.

Lives under `Channels > Voice > Speech recognition`. Per-step biasing also configurable inside [Flows](../entities/flow.md). Dynamic biasing from a [Tool](../entities/tool.md) via `conv.set_asr_biasing()`.

## Boost levels

`Default → Boosted → Maximum`. Higher boosts increase the chance the term wins, but also increase false positives on similar-sounding words. Start at `Default` or `Boosted`; only escalate to `Maximum` after measuring.

**Failure mode:** boost a term too aggressively and it eats other words. "flimsy" at Maximum makes "Lindsay" come out as "flimsy". Use transcript corrections as the safer fallback for brand-name fixes.

## Per-step vs global vs dynamic biasing

Precedence: **Dynamic > Per-step > Global**. If global bias is overriding when you don't want it to, set the bias dynamically from a function instead.

## Transcript corrections

Regex-based post-processing. `"blue star"` → `"BlueStar"` etc. Use `\b` word boundaries to avoid catching legitimate uses. Verify against the raw ASR output in `Conversation Diagnosis > Transcript Corrections`.

## Diacritics

ASR support for diacritics depends on the configured language model. If `č`, `ć`, `š` etc. are stripped or mangled, the fix isn't transcript corrections — PolyAI needs to set the ASR language model. **This is not customer-self-serve.**

## Related

- [Voice](../channels/voice.md), [Flow](../entities/flow.md), [Tool](../entities/tool.md), [Multilingual](../entities/multilingual.md).

## Authoritative docs

- [Speech recognition introduction](https://docs.poly.ai/speech-recognition/introduction)
- [Flow ASR biasing](https://docs.poly.ai/flows/asr-biasing)
