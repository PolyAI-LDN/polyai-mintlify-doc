# Tool

A Python function that extends what the agent can do — API calls, data lookups, calculations, state changes. Tools are invoked from [Topic](topic.md) actions, [Flow](flow.md) function steps, or behaviour rules.

A tool can return:

- **A string** — fed back to the LLM as additional context.
- **A dict** — used to control the agent (e.g. `{"handoff": ..., "utterance": ...}`).

## Where it lives

- **Studio:** `Build > Tools`. Python editor.
- **API:** Knowledge base tool endpoints (managed alongside topics).

## Functions and classes

Tools come with PolyAI helper classes accessible inside the function. See the [tool-classes](tool-classes/index.md) folder for per-class wiki pages with patterns and gotchas:

- [`conv` object](tool-classes/conv-object.md) — the conversation context; speech, state, flow control.
- [`conv.utils`](tool-classes/conv-utils.md) — secrets, address parsing, entity validation, ad-hoc LLM calls.
- [`conv.api`](tool-classes/conv-api.md) — Studio-configured outbound APIs.
- [`conv.log`](tool-classes/conv-log.md) — structured logs surfaced in Conversation Diagnosis.
- [ASR biasing](tool-classes/asr-from-conv.md) — `conv.set_asr_biasing()` for runtime ASR tuning.
- [`conv.history`](tool-classes/history.md) — chronological transcript events.
- [Voice classes](tool-classes/voice.md) — TTS provider configuration.
- [`conv.memory`](tool-classes/agent-memory.md) — caller-scoped persistence across conversations.

Lifecycle hooks: a [start function](https://docs.poly.ai/tools/start-tool) runs at conversation start; [end function](https://docs.poly.ai/tools/end-tool) runs at end.

## Common failure modes

- **Non-descriptive function names.** The LLM treats function names as text. `start_process` is misleading; `get_available_packages` reads correctly. Naming changes trigger behaviour.
- **No error handling on API responses.** Distinguish a real error (500, broken integration) from a valid response with no data (404). The agent answers very differently to "service down" vs "no data found".
- **Importing libraries that aren't allowed.** Standard library plus the approved set — see [import-library](https://docs.poly.ai/tools/import-library). Custom installs aren't supported.
- **Tool referenced in a Flow Action may not be in the LLM's tool context.** Add it to the agent's [Behaviour](rule.md) so the LLM knows it exists.
- **Returning conflicting controls.** Don't return both `utterance` and `handoff` in the same dict — only one control action per turn.

## Related

- [Topic](topic.md), [Action](action.md), [Flow](flow.md), [Rule](rule.md), [Secrets and API keys](../concepts/secrets-and-api-keys.md).

## Authoritative docs

- [Tools introduction](https://docs.poly.ai/tools/introduction)
- [How to set up](https://docs.poly.ai/tools/how-to-setup)
- [Using tools in knowledge base](https://docs.poly.ai/tools/using-tools-in-knowledge-base)
- [Return values](https://docs.poly.ai/tools/return-values), [delay control](https://docs.poly.ai/tools/delay-control), [variables](https://docs.poly.ai/tools/variables), [import library](https://docs.poly.ai/tools/import-library)
- [Maintain: tools](https://docs.poly.ai/learn/maintain/tool-maintenance)
