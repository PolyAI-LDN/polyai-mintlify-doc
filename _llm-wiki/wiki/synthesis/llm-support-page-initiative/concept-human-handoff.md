# Human handoff

[Christopher Osborne](people-christopher-osborne.md): _"Can't find a solution? It schedules a time when a human agent will call you and hands off the data."_

## Why this is the most important capability

Two reasons.

First: it's the **escalation graceful exit.** Every chat agent eventually hits a question it can't answer. The traditional pattern ("sorry, I can't help — try emailing support") is the moment users give up on chat agents forever. Scheduling a callback turns dead-end into next-step.

Second: it's the **continuity bridge.** The user has spent five minutes describing their problem, possibly uploaded an image, possibly switched languages. If the human agent calls back blind, the user repeats everything and the chat experience felt pointless. If the human agent calls back with the conversation context (transcript, image, identified problem area), the user feels heard and the call is shorter and more productive.

## What "hands off the data" means

At minimum:

- Conversation transcript.
- Any uploaded images / files.
- Any identified product, version, account context.
- The agent's best hypothesis about the problem.
- Time slot the user selected.

Realistically, this is a hand-off to whatever ticketing / scheduling system the customer already runs (Zendesk, Salesforce Service Cloud, an internal system, etc.). Each customer is a different integration. _(Worth flagging — this is the "boring" part that turns a demo into a product.)_

## For the Quicken pitch

Two questions to answer before the pitch:

- Does Quicken have a scheduling / callback system the agent could hand off to? See [Open questions](../open-questions.md).
- For the demo itself: do we mock the handoff, or wire to something real?

See [Quicken pitch plan](quicken-pitch-plan.md) and [prototype scope](prototype-scope.md).

_Source: [Slack thread, 2026-04-27](../../../raw/2026-04-27-slack-support-page-redesign.md)._
