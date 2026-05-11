# Implementation paths — how this actually gets built

Christopher described what the LLM-powered support page should _do_. This page is about how it gets _built_. Written for Aaron (Technical Writer) so the next conversation with Frances, Christopher, and engineering starts from a concrete map rather than from scratch.

The good news: most of the heavy lifting is already in PolyAI's stack. The wiki you've just compiled is essentially the knowledge content the agent would consume. The build is mostly assembly, not invention.

## The four realistic options

### Option A — Embed docs.poly.ai's AI-assisted search

**What it is.** Drop the existing Mintlify-powered AI search widget into a customer's support page as an iframe or web component. Users get a search-bar-with-LLM experience over PolyAI's docs.

**Effort.** Hours to days. Mostly front-end embedding work.

**What it gives Christopher's brief.**

- ✅ Conversational interface (single-turn-ish, depending on the widget)
- ⚠️  Guides to a solution — kind of, but it tends to surface excerpts rather than walk you through a fix
- ❌ Image upload — Mintlify search isn't multimodal
- ❌ Language switching — limited
- ❌ Human handoff with context — none

**What it can't do.** Customer-supplied knowledge. The agent only knows docs.poly.ai content. Useful as a demo over PolyAI's own docs; not useful as Quicken's actual support page.

**When to pick it.** As a fast demo to show "what an LLM-powered support page _feels_ like" while a real prototype is being built. Not as the productised answer.

---

### Option B — Build it on PolyAI's own platform (the obvious one)

**What it is.** Use [Webchat widget](../../channels/webchat-widget.md) on the customer's support page. The agent is a normal PolyAI [Agent](../../entities/agent.md) built in Studio. Customer's knowledge feeds it via [Topics](../../entities/topic.md) and [Connected Knowledge](../../entities/connected-knowledge.md). Tool calls handle anything dynamic. [Call Handoff](../../channels/call-handoff.md) (or a calendar-booking [Tool](../../entities/tool.md)) handles the human-handoff requirement.

**Effort.** Days to a couple of weeks for a credible build, depending on the customer's content fidelity.

**What it gives Christopher's brief.**

- ✅ **Conversational interface** — webchat widget, exactly the right UX shape.
- ✅ **Guides to a solution** — Topics + Rules can be set up to walk the user through troubleshooting rather than dumping links.
- ✅ **Image upload** — webchat widget supports attachments; the agent can be backed by a vision-capable model (Raven supports multimodal; confirm with engineering).
- ✅ **Language switching** — _shipped in release 26.04_. Up to 10 languages, automatic detection, content tags `<language:xx>`. See [Multilingual](../../entities/multilingual.md).
- ✅ **Human handoff with context** — built-in. The handoff carries the transcript, any uploaded files, the agent's hypothesis. See [Call handoff](../../channels/call-handoff.md). For "schedule a callback rather than transfer live", a Tool call into the customer's calendar system (Salesforce, Zendesk, custom) does it.

**What it gives the customer (Quicken in the first instance).** This is the version of "you already have the support agent built" — it's the product PolyAI sells, applied to the customer's own support content. The wiki we've built is a working example of what their content layer would look like.

**When to pick it.** Always, for productisation. Also for the Quicken demo if engineering can wire up a credible build in the time available.

---

### Option C — Custom app from scratch

**What it is.** Build a bespoke React (or similar) front-end with a chat UI; back it with a wrapped LLM that does RAG over the wiki markdown directly. No PolyAI platform involvement.

**Effort.** Weeks. Maximum effort.

**Why I'm flagging it.** For completeness. PolyAI shouldn't be the company that pitches a custom app over its own platform — that would defeat the point. Mentioning it so when an engineer suggests it during ideation, the trade-off is named.

**When to pick it.** Almost never. The exception: a research / proof-of-concept that explicitly wants to demonstrate something the product doesn't yet support.

---

### Option D — Embed AI search with a custom shell around it

**What it is.** Use docs.poly.ai's AI search underneath, but wrap it in a custom support-page UI with extra capabilities (image upload, callback scheduling) layered on.

**Effort.** Mid — somewhere between A and B.

**Why it's tempting and why it's probably wrong.** Tempting because it lets the team move fast on the front-end while not building a knowledge layer. Wrong because it splits the agent in two: the AI search handles questions, but image/language/handoff sit outside it and don't share state. The customer experience fragments.

**When to pick it.** A demo where a customer specifically asks for the search-plus-extras shape. Not as productisation.

---

## Recommendation

For both the Quicken pitch and the longer-term product, **Option B**: build on PolyAI's own platform.

- It's the dogfooding story.
- It demonstrates what Quicken would actually buy.
- The pieces already exist — most of the brief is configuration, not engineering.
- The wiki we've built is exactly the shape of content that feeds it.

For the Quicken pitch specifically, if engineering can't fully wire up Option B in the days available, **fall back to a hybrid: an Option-B demo for the parts that work end-to-end (chat, language switch, handoff), with shorter video clips of the parts that don't.** Better than a polished-looking Option-A demo that wouldn't be the actual product.

---

## How this wiki slots into Option B

The wiki you've just built isn't the agent's runtime knowledge layer — but it _is_ the right shape for it. Specifically:

- **[Topic](../../entities/topic.md) pages.** Each entity / concept page in the wiki is a candidate for a Managed Topic in the customer's PolyAI agent: a customer-facing answer with sample questions, optional actions. The agent's "what is a Flow?" topic content can come straight from the wiki's `entities/flow.md`.
- **[Connected Knowledge](../../entities/connected-knowledge.md).** The whole wiki — or selected sections — can be ingested as Connected Knowledge for fall-through Q&A. Markdown is the format Connected Knowledge already accepts.
- **Troubleshooting articles.** These map almost 1:1 to Topics with troubleshooting actions. Symptom → Cause → Fix is exactly what a Topic looks like when it has a Flow as its action.
- **Authoritative-doc links.** When the agent answers, citing back to `docs.poly.ai/<path>` gives users the canonical source — exactly what we set the wiki up to do.

In other words: building the agent on PolyAI's platform, with this wiki content, is mostly **copying and re-shaping existing content into Studio**, not writing new content.

---

## What does Aaron own here

You — as Technical Writer — own the **content layer**. That breaks down as:

1. **Wiki maintenance.** Keep it fresh as docs.poly.ai changes. Use the [maintenance playbook](../../concepts/maintenance-playbook.md) — but applied to wiki maintenance, not agent maintenance.
2. **Content fidelity for the agent.** When the agent ships, real customers will hit edges the wiki doesn't cover. Funnel those gaps back into the wiki and into docs.poly.ai. This is the [Conversation review](../../concepts/conversation-review.md) → annotation → content fix loop, applied to the support-page agent itself.
3. **Translation review.** Multilingual is an LLM strength but a precision risk — translated procedural steps can be subtly wrong. For any languages Quicken or other customers want, plan a human review pass.
4. **Voice in writing.** Topics and rules have to be written in spoken-feeling English. The [design principles](../../concepts/design-principles.md) page is a useful crib. Push back on engineers / PMs writing topic content like internal docs.

You don't own:

- Engineering wire-up (eng team).
- Studio configuration of the agent (PolyAI Solution Engineer or whoever owns customer setup).
- Webchat widget embedding on the customer's site (customer's web team, or a PolyAI managed service).
- Telephony/handoff routing decisions (eng + customer's contact-centre team).
- The pitch deck (Frances).

---

## Concrete next steps

In rough order:

1. **Get this on Frances and Christopher's radar.** Share this page (or a 5-bullet TL;DR of it) so the ideation session this week starts on solid ground rather than ranging over options A–D from scratch.
2. **Pull in engineering.** Specifically: who's going to build the Quicken demo? Once that person is named, route them to the wiki's [entities](../../entities/) and [troubleshooting](../../troubleshooting/) folders as the starting content.
3. **Discovery on Quicken.** Frances — or whoever owns the account — needs to surface what we [open-questioned](../open-questions.md): their content situation, languages, support stack. None of the implementation paths can be properly costed without that.
4. **Confirm the multimodal capability.** The brief includes image upload. The platform supports Raven and BYOM — confirm with engineering that an image attached in the webchat widget actually reaches a vision-capable model in the active configuration. If not, that's a build, not a configuration.
5. **Decide the demo scope.** See [prototype scope](prototype-scope.md). The four headline capabilities (chat, image, language, handoff) are the must-show; everything else is a stretch goal.
6. **After Quicken, retro.** Whatever happens, file the lessons here. The next pitch (and the productised version) starts from this wiki, not from zero.

---

## What this is _not_ saying

- Not saying "Aaron should build this." You shouldn't.
- Not saying engineering should drop everything. The realistic ask is configuration on top of existing platform — not a from-scratch build.
- Not saying the wiki is finished. See [open-questions](../open-questions.md) for what's shallow.
- Not saying Option B is risk-free. If Quicken's content is in poor shape, the demo will reflect that. Their content situation is the dominant unknown.

## Related

- [Project brief](project-brief.md) — what the initiative is.
- [Quicken pitch plan](quicken-pitch-plan.md) — timeline and ownership.
- [Prototype scope](prototype-scope.md) — must-have vs out-of-scope.
- [Concept: LLM support page](concept-llm-support-page.md) — the capability decomposition.
- [Open questions](../open-questions.md) — what we still don't know.
