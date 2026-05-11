# Connected Knowledge

External knowledge sources auto-synced into the agent — URLs, PDFs, Zendesk help centres, Gladly knowledge bases, etc. Chunked and RAG-matched at runtime. Read-only: cannot trigger actions.

The fast way to get a lot of unstructured FAQ content into the agent without curating it as [Topics](topic.md). Trade-off: less control over how it's matched and presented.

## Where it lives

- **Studio:** `Build > Knowledge > Connected`.
- Supported source types: file upload, URL scrape, Zendesk, Gladly, others.

## How it differs from Topics

[Topic](topic.md) always wins over Connected Knowledge when both exist for a query. If the agent isn't using Connected Knowledge content you expect, check whether a Topic is being matched first.

## Common failure modes

- **Source not synced after editing.** Sources need a manual `Update` / `Sync` then a republish; the agent doesn't see new content automatically.
- **Large documents with scattered relevant sections.** Connected Knowledge chunks at ~2000 chars with ~500-char overlap. Wide-ranging documents whose relevant sections are far apart don't reassemble well at retrieval time. Restructure into smaller, tighter docs.
- **URL scraping limits.** Crawl depth is one level, max ~10 pages. For full coverage, use the integration (Zendesk, Gladly) instead of generic scraping.
- **Source disabled in environment / variant.** The source must be enabled for the [Environment](environment.md) and [Variant](variant.md) where the agent is being tested.
- **Expecting actions.** Connected Knowledge is read-only. To trigger SMS, a tool call, or a handoff you need a [Topic](topic.md) with [Actions](action.md).

## Related

- [Topic](topic.md), [Environment](environment.md), [Variant](variant.md).

## Authoritative docs

- [Connected knowledge introduction](https://docs.poly.ai/connected-knowledge/introduction)
- [Maintain: connected knowledge](https://docs.poly.ai/learn/maintain/knowledge-connected-knowledge)
- Integration-specific: [Gladly](https://docs.poly.ai/integrations/gladly), [Zendesk](https://docs.poly.ai/integrations/zendesk)
