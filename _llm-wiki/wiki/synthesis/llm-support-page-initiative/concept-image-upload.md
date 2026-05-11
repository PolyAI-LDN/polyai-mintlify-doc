# Image upload for troubleshooting

One of the five capabilities [Christopher Osborne](people-christopher-osborne.md) listed for the redesigned support page: _"You upload a photo or screenshot of the error you're getting."_

## What it enables

Most support friction starts with the user trying to describe an error in words ("it says some kind of error, I don't really get it"). Letting them just paste the screenshot collapses that step. The agent reads the image, identifies what's on screen, and proceeds — either to a known troubleshooting path or to a clarifying question.

## Implementation surface

Multimodal LLMs (vision-capable) handle this natively. Practical considerations:

- **Privacy.** Screenshots may contain personal data — account numbers, names, URLs. The interface should make it clear what gets sent and where.
- **Cropping / annotation.** Not strictly required, but useful UX — let the user circle the part they're confused about.
- **Fallback.** If the agent can't read or interpret the image, it should ask follow-up questions rather than dead-end.

## For the Quicken pitch

This is one of the most concrete "the LLM era unlocks a new pattern" capabilities — and easy to demo visually. A pitch demo that shows a user dragging a screenshot of an error into the chat and the agent immediately diagnosing it is much more striking than any text-only flow. See [Quicken pitch plan](quicken-pitch-plan.md).

## Open

- Does PolyAI's [web agent technology](concept-web-agent-technology.md) currently support image input out of the box? _(unverified.)_

_Source: [Slack thread, 2026-04-27](../../../raw/2026-04-27-slack-support-page-redesign.md)._
