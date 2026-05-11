# /maintain/ content

The pages under the `/maintain/` section of `docs.poly.ai`. Per [Aaron Forinton](people-aaron-forinton.md), this content is "designed less to be human-readable and more to solve maintenance related issues."

## Why it matters

It's the closest thing PolyAI already owns to an **agent-readable knowledge base** — content shaped for problem-solving rather than browsing. That makes it a natural seed for any LLM support agent that needs to handle PolyAI-product issues.

For a third-party product (e.g. [Quicken](quicken.md)), this content isn't directly usable as the agent's knowledge — but its **shape** is a useful template for what their content should look like, and PolyAI itself can use this content for any internal-product or partner-facing demo.

## Fidelity

Aaron noted it could be "brushed up" — the content was written to a maintenance-task standard, not a customer-facing standard. Implications:

- Some pages may be terse, jargon-heavy, or assume PolyAI internals knowledge.
- Treating these directly as user-facing answers (without cleanup) risks the agent giving brittle or confusing replies.
- A pre-pitch fidelity sweep is probably worth it for any page the demo touches.

This cost — content cleanup before agent ingestion — applies to **any** customer that wants to deploy this pattern. It's a real line item in [prototype scope](prototype-scope.md), not a footnote.

## As a feed for a Poly widget

Aaron also flagged: if the team wants a Poly-branded widget specifically, the `/maintain/` content is the starting point for the `.md` files that would inform it. That's a different deliverable from "embed the AI-assisted search" — it implies a custom agent with PolyAI knowledge, deployable to PolyAI's own surfaces or partners.

_Source: [Slack thread, 2026-04-27](../../../raw/2026-04-27-slack-support-page-redesign.md)._
