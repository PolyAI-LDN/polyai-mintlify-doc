# Multilingual and translation

[Christopher Osborne](people-christopher-osborne.md): _"It can switch languages and translate any existing content into the language you know."_

## Two distinct capabilities

These are often conflated; they're not the same:

1. **Language switching of the conversation.** The user types in Spanish, the agent replies in Spanish. The conversational thread is in their language. This is a conversation-layer concern.
2. **Translation of source content.** Existing FAQ / help content was written in English (or whatever the customer's primary language is) and the agent serves it in another language. This is a knowledge-layer concern.

LLMs do both reasonably well, but the failure modes differ. Conversation-layer mistakes are recoverable in the next turn. Knowledge-layer mistakes can give wrong answers with the same confidence as right ones — translating a help article badly might reverse a procedural step. _(Worth flagging in [design principles](design-principles.md).)_

## Why this matters competitively

Most support pages today either:

- Maintain separate language versions (expensive to keep in sync, almost always partial), or
- Use generic browser translation (lossy and not aware of product-specific terms).

An LLM-powered page collapses the cost and gives every language equal coverage. That's a real differentiator vs. the static FAQ pattern.

## For the Quicken pitch

Worth knowing: what languages do Quicken's users actually speak? Without that, demoing language switch is generic; with it, the demo is pointed. See [Quicken pitch plan](quicken-pitch-plan.md).

_Source: [Slack thread, 2026-04-27](../../../raw/2026-04-27-slack-support-page-redesign.md)._
