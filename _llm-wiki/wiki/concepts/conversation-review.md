# Conversation review and annotation

Where customers diagnose what went wrong on real calls. The upstream of every troubleshooting question — most "fix my agent" tickets start by reviewing a problematic conversation.

## Where it lives

- **Studio:** `Analytics > Conversations`.

## Workflow

1. Filter by environment, date range, topic, status.
2. Open the transcript — review turn by turn.
3. Toggle the **Diagnosis panel** to layer:
   - **Topic citations** — which Topics matched this turn.
   - **Sources** — which [Connected Knowledge](../entities/connected-knowledge.md) chunks were retrieved.
   - **Tool calls** — which tools fired, with inputs/outputs.
   - **Turn latency** — response time per turn.
   - **Logs** — `conv.log` entries and API responses.
4. Tag the conversation with categories ("Needs KB fix", "Escalated unnecessarily", etc.).

## Sources preview

Since [release 26.03](../reference/releases.md), clicking a Sources tag in the Diagnosis panel previews the retrieved document chunks inline. An `Open in Knowledge` deep-link jumps to the Connected Knowledge entry. Saves a step when triaging "did we have the right content?" questions.

## Annotations

Per-turn flags for continuous improvement:

- **Wrong transcription** — feeds ASR improvement.
- **Missing topic** — flags a knowledge gap to add.

## Common pattern

1. Standard dashboard shows containment dropping.
2. Filter conversations to that period.
3. Use Diagnosis to see which topics / functions were called.
4. Tag systematic issues.
5. Update Topics or fix Tools.
6. Test in Sandbox before promoting.

## Related

- [PolyScore](polyscore.md), [Smart Analyst vs Agent Analysis](smart-analyst-vs-agent-analysis.md), [Test suite](test-suite.md), [Maintenance playbook](maintenance-playbook.md).

## Authoritative docs

- [Conversations introduction](https://docs.poly.ai/analytics/conversations/introduction)
- [Conversation review](https://docs.poly.ai/analytics/conversations/review)
- [Annotations](https://docs.poly.ai/analytics/conversations/annotations)
- [Diagnosis](https://docs.poly.ai/analytics/conversations/diagnosis)
- [Studio transcripts](https://docs.poly.ai/call-data/studio-transcripts)
