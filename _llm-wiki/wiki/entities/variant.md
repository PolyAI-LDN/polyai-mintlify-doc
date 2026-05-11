# Variant

Per-cohort or per-site configuration for an agent. Each variant stores its own attributes (phone number, address, opening hours) while sharing the same agent logic. The same Topic content can dynamically render with location-specific values via `${variant_attribute}` syntax.

The classic use case: one agent for a 50-restaurant brand, with each location's hours and phone number as a variant.

## Where it lives

- **Studio:** `Build > Variant management`. Spreadsheet-style UI; rows are variants, columns are attributes.
- **API:** [Variants endpoints](https://docs.poly.ai/api-reference/agents/introduction) — list / create / update / delete attributes and variants.

## Selecting the right variant per call

The variant must be set explicitly in the [start function](https://docs.poly.ai/tools/start-tool), typically based on:

- `conv.callee_number` for voice (the number the caller dialled)
- `conv.metadata` for webchat (passed in via the widget)

Without an explicit `conv.set_variant()`, the **first variant** in the list is used for every call.

## Using variant attributes

In a Topic's content: `${variant_phone_number}` is substituted with that variant's value at runtime.

In SMS templates: same `${variant_attribute}` syntax.

## Common failure modes

- **Forgetting to set variant in start function.** Default (first) variant applies to every call.
- **Deleting the first variant** without explicitly choosing — the next one becomes default by accident.
- **Activating flows globally** when they're variant-specific. Each variant has `active_flows` and `inactive_flows` lists.
- **Variant attribute not appearing in topic.** Either the variant doesn't have that attribute populated, or the syntax is wrong (`${name}` not `${{name}}`).

## Bulk updates

Use [CSV import](https://docs.poly.ai/variant-management/csv-imports) for managing many variants — much faster than the UI for fleets of 20+.

## Related

- [Agent](agent.md), [Topic](topic.md), [Tool](tool.md), [Environment](environment.md).

## Authoritative docs

- [Variant management introduction](https://docs.poly.ai/variant-management/introduction)
- [CSV imports](https://docs.poly.ai/variant-management/csv-imports)
