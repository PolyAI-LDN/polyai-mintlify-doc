# LLM support page

The core concept of this initiative. A customer support page redesigned around a chat-first, LLM-driven experience instead of the standard search-bar-plus-FAQ-cards pattern.

## What it isn't

A webchat widget bolted onto an otherwise-traditional support page. [Christopher Osborne](people-christopher-osborne.md) was explicit: _"not just add a webchat widget to the site."_ The chat is the page, not a tab on the page.

## What it is

A GPT/Claude-style conversational surface where the user prompts and converses, and the system:

1. **Guides the user to a solution** rather than handing them an FAQ to read. Troubleshoots step-by-step.
2. **Accepts images.** User uploads a photo or screenshot of the error they're getting; the agent reads it. See [image upload for troubleshooting](concept-image-upload.md).
3. **Switches languages on the fly.** Translates existing knowledge content into the user's language. See [multilingual / translation](concept-multilingual-translation.md).
4. **Schedules a human callback when stuck.** Hands the conversation context to the human agent so the user doesn't repeat themselves. See [human handoff](concept-human-handoff.md).

## What's underneath

The agent runs on PolyAI's [web agent technology](concept-web-agent-technology.md). The knowledge it draws on can come from:

- A customer's existing FAQ / help content, ingested into agent-readable form.
- PolyAI's own [`/maintain/` content](concept-maintain-content.md) as a reference for self-hosted deployments.
- Embeddable [docs.poly.ai AI-assisted search](concept-docs-polyai-ai-search.md) as a fast-path demo for technical audiences.

## Why now

[Frances Erasmus](people-frances-erasmus.md): _"a space that's been pretty static for years."_ Most support pages still look like they did in 2014. The LLM era makes the whole pattern up for grabs — and PolyAI has both the agent tech and a target customer ([Quicken](quicken.md), pitching Wed 6 May 2026).

## Design tensions to resolve

- **Conversation vs. browse.** Some users will still want to scan a list of articles. Does the redesigned page accommodate both, or commit fully to conversation?
- **Solution-finding vs. expectation-setting.** When the agent can't solve something, how does it gracefully escalate without feeling like a dead end?
- **Knowledge fidelity.** The agent is only as good as its sources. See [`/maintain/` content](concept-maintain-content.md) for the fidelity question.

These tensions are tracked in [design principles](design-principles.md) and [open questions](../open-questions.md).

_Sources: [Slack thread, 2026-04-27](../../../raw/2026-04-27-slack-support-page-redesign.md)._
