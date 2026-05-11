# Design principles

A working draft. These principles were not stated explicitly in the source — they're inferences from what [Christopher Osborne](people-christopher-osborne.md) asked for, and from common failure modes of LLM-driven support experiences. Treat them as a starting point for the ideation session [Frances Erasmus](people-frances-erasmus.md) is convening, not as settled doctrine.

## 1. The conversation is the page, not a feature on the page

Christopher was explicit: not a webchat widget bolted on. The support page's primary job is to host one conversation per visitor. Every other element — search, browse, links to articles — is either folded into the chat or relegated.

## 2. Guide to a solution, don't link to one

The traditional support page's job is to retrieve the right document. The LLM page's job is to **resolve the user's problem.** Linking to an FAQ is a worse outcome than walking the user through a fix, even if both end with the same article.

## 3. Multi-modal in, multi-modal out

Images in (screenshots of errors). Text in any language. The agent should accept what users actually have, not insist on a particular shape. See [image upload for troubleshooting](concept-image-upload.md) and [multilingual / translation](concept-multilingual-translation.md).

## 4. Escalation is a feature, not a failure

When the agent hits its limit, the [human handoff](concept-human-handoff.md) shouldn't feel like the user wasted their time. Schedule the call, hand the context over, set expectations. Done well, this is the most-loved part of the experience.

## 5. Knowledge fidelity is upstream of conversation quality

The agent is only as good as what it can read. Brushing up the [`/maintain/` content](concept-maintain-content.md) (or a customer's equivalent) is real work and should be scoped, not assumed. A demo that papers over weak content with smooth language is misleading.

## 6. Translate carefully

LLM translation of support content can be subtly wrong in ways that reverse procedural steps. For knowledge-layer translation (as opposed to conversation-layer), there should probably be a human review pass for the languages the customer cares about — at least until error rates are measured.

## 7. Don't dead-end

If the agent doesn't know, doesn't understand, or can't help: ask, escalate, or schedule a callback. Never "I can't help with that" full stop.

## Tensions to resolve

- **How visible is the agent's reasoning?** Chain-of-thought style transparency vs. confident answer.
- **How much do we let the user steer?** Free-form chat vs. guided flows with quick replies.
- **Branding.** PolyAI-branded experience vs. customer-branded with PolyAI invisible underneath.

These belong in [open questions](../open-questions.md) until the ideation session resolves them.

_Sources: [Slack thread, 2026-04-27](../../../raw/2026-04-27-slack-support-page-redesign.md). Most claims here are inferences not directly attributable to the source — flagged in line where so._
