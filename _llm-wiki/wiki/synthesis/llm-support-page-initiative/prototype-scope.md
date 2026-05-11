# Prototype scope

What goes into the [Quicken pitch](quicken-pitch-plan.md) demo on 6 May 2026, and — equally important — what stays out.

## In scope (must-have for the pitch)

The four capabilities [Christopher Osborne](people-christopher-osborne.md) named:

- Conversational troubleshooting that walks the user to a solution. ([LLM support page](concept-llm-support-page.md))
- Image upload — user drags a screenshot, agent reads it. ([image upload for troubleshooting](concept-image-upload.md))
- Language switching mid-conversation. ([multilingual / translation](concept-multilingual-translation.md))
- Human handoff with conversation context preserved. ([human handoff](concept-human-handoff.md))

A live, click-through demo of those four flows is the minimum credible thing to show.

## Out of scope (deliberately, for the pitch)

- **Real integration with Quicken's content.** A demo over generic or PolyAI-owned content is fine for the pitch; tuning to Quicken-specific knowledge is post-pitch work.
- **Real integration with Quicken's scheduling system.** The handoff demo can mock the calendar pick — what matters is showing the context-handoff pattern, not the integration.
- **Production-quality multilingual coverage.** Showing one language switch is enough to demonstrate the capability. Fully audited translations across N languages is post-pitch.
- **Authentication, account context, personalisation.** All real product work; unnecessary for a pitch demo.
- **Brand customisation, white-labelling, theming.** Pitch demo can use PolyAI styling; brand-fit is a deployment-phase question.
- **Any KPI claims.** Resist the temptation to say things like "reduces tickets by X%." We don't have the data.

## Why these out-of-scope calls

The pitch's job is to make Quicken want to do a paid pilot. The pilot's job is to deliver the production-quality version. Cramming pilot-level work into the pitch demo would either miss the date or arrive shaky.

## Build approach (working hypothesis)

Two paths Aaron flagged:

1. **Embed [docs.poly.ai AI-assisted search](concept-docs-polyai-ai-search.md)** into a mocked-up support page for Quicken. Fastest path. Limitation: the knowledge is PolyAI's own docs, which may feel off-topic for a personal-finance customer — could be sold as "our docs as a stand-in for what your content would feed."
2. **Build a custom agent over generic personal-finance / Quicken-shaped content** (synthetic FAQs scraped from public Quicken help, perhaps). More credible feel; more engineering work.

The right choice depends on what the engineering team can do in the time available, and which feels more honest in the pitch. _(decision pending — flag for the ideation session.)_

## Open questions for the ideation session

Before this scope is final, the design and engineering teams need to weigh in. Move resolved questions out of [open questions](../open-questions.md) and into this page as decisions.

_Sources: [Slack thread, 2026-04-27](../../../raw/2026-04-27-slack-support-page-redesign.md). Scope decisions here are proposals, not yet confirmed._
