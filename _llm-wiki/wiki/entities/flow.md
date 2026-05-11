# Flow

Multi-step conversation orchestration for tasks that don't fit a single Topic + Action — bookings, verifications, form filling, anything with branching logic and entity collection. A Flow is a sequence of steps (nodes) with transitions, optional [entity](#entities) extraction, and conditional branching.

Flows can be **no-code** (visual canvas, default steps with rule-based routing) or **code-driven** (Python [transition functions](https://docs.poly.ai/flows/transition-functions)).

## Where it lives

- **Studio:** `Build > Flows`. Visual canvas with drag-and-drop steps.
- **No API yet.** Managed via Studio UI or via the [Agent Development Kit (ADK)](https://docs.poly.ai/extend/adk).

## How they're triggered

A Topic's [Action](action.md) routes to a Flow (`/Flow` action). A flow runs to completion (or to its exit step) before control returns to the main agent.

## Entities

In Flows, **entities** are typed values extracted from user input — a name, a phone number, a date. Entities are always strings even when they look numeric. **`"9" > "10"` evaluates to `True`.** Cast with `int()` before any numeric comparison.

## Common failure modes

- **No exit step.** Flows that don't terminate cleanly cause hallucinations; the agent wanders. Always include an exit.
- **Mixing text + tool call in the same step.** The agent picks one. Split into two steps.
- **Each step is context-isolated.** The LLM in step 2 doesn't see step 1's prompt unless you pass state explicitly. Each step must be self-contained, or pass needed values via variables.
- **Entity validation with no fallback.** If the entity can't be parsed, the flow re-asks indefinitely. Always design a fallback condition ("caller can't provide → escalate").
- **Condition labels on Function steps don't auto-route.** Labels are decorative — code must call `flow.goto_step()` explicitly.
- **String comparison on numeric entities** (the `"9" > "10"` trap above).
- **Tool referenced in flow Action may not be in LLM's tool context.** Workaround: also reference the tool in the agent's [Behaviour](rule.md) section so the LLM is aware of it.

## Related

- [Topic](topic.md), [Tool](tool.md), [Action](action.md), [Rule](rule.md).

## Authoritative docs

- [Flows introduction](https://docs.poly.ai/flows/introduction)
- [Triggering flows](https://docs.poly.ai/flows/triggering-flows)
- [Flow example](https://docs.poly.ai/flows/example)
- No-code: [introduction](https://docs.poly.ai/flows/no-code/introduction), [entities](https://docs.poly.ai/flows/no-code/entities), [quickstart](https://docs.poly.ai/flows/no-code/quickstart), [advanced steps](https://docs.poly.ai/flows/no-code/advanced-steps)
- Code-driven: [transition functions](https://docs.poly.ai/flows/transition-functions), [object](https://docs.poly.ai/flows/object), [ASR biasing](https://docs.poly.ai/flows/asr-biasing), [DTMF](https://docs.poly.ai/flows/dtmf), [few-shot prompting](https://docs.poly.ai/flows/few-shot-prompting)
