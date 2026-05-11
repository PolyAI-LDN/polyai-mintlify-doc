# Maintenance playbook

The rhythm of running an agent in production. Distilled from `learn/maintain/`.

## Daily (10–15 min)

1. Glance at the **Standard dashboard** for anomalies vs baseline (volume, containment, latency, handoff rate).
2. Scan errors in the last 24 hours of conversations.
3. Ask [Smart Analyst](smart-analyst-vs-agent-analysis.md): "Top issues in last 24 hours?"
4. Verify integrations — no API errors in function logs.

**Red flags:** handoff rate > 50% or > +20% from baseline; latency > 3s; error rate > 5%; volume drop > 30%.

## Weekly (30–60 min)

1. Compare metrics to last week (volume, containment, duration, latency).
2. Run a Smart Analyst deep sample (up to 500 calls) for trends: "Top 5 handoff reasons this week?", "What questions aren't we handling?"
3. Listen to 5–10 calls — mix successful and unsuccessful.
4. Check [test set](test-suite.md) results for regressions.
5. Update topics or rules based on findings.
6. `Update` / `Sync` Connected Knowledge sources.

## Monthly (2–4 hours)

1. Full Smart Analyst pass: month-over-month metrics, containment blockers, handoff patterns, sentiment trends.
2. Audit Topics for outdated content.
3. Review function performance; optimise the slow ones.
4. Maintain test sets — add new scenarios, remove obsolete.
5. Review version history; document major changes.
6. Test and validate improvements.

## Pre-deployment (20–30 min)

1. Run all test sets — failures = don't promote.
2. Manually test critical flows and edge cases.
3. Test all external API integrations.
4. Check voice quality and pronunciations.
5. [Diff](https://docs.poly.ai/environments-and-versions/diffs) against the current Live version.
6. Identify the rollback target — the last known-good version.

## Post-deployment (first 30 min → 24 hours)

- **First 30 min** — watch [Conversation Review](conversation-review.md) live. Latency, errors, handoff rate. Be ready to roll back.
- **2–4 hours** — recheck metrics every 2–4 hours.
- **24 hours** — full day vs pre-deployment baseline. Document lessons.

## Rollback triggers (immediate)

- Error rate > 10%
- Handoff rate doubles
- Critical function failure
- Customer complaint spike

Rollback is fast (~2–5 minutes) — promote a prior known-good version on Live.

## Related

- [Conversation review](conversation-review.md), [Smart Analyst vs Agent Analysis](smart-analyst-vs-agent-analysis.md), [PolyScore](polyscore.md), [Test suite](test-suite.md), [Deployment](../entities/deployment.md), [Environment](../entities/environment.md).

## Authoritative docs

- [Maintain introduction](https://docs.poly.ai/learn/maintain/introduction)
- [Health checks](https://docs.poly.ai/learn/maintain/health-checks)
- [Performance monitoring](https://docs.poly.ai/learn/maintain/performance-monitoring)
- [Version management](https://docs.poly.ai/learn/maintain/version-management)
- [QA analytics](https://docs.poly.ai/learn/maintain/qa-analytics)
- [Common issues](https://docs.poly.ai/learn/maintain/common-issues)
- [Knowledge base maintenance](https://docs.poly.ai/learn/maintain/knowledge-base)
- [Connected knowledge maintenance](https://docs.poly.ai/learn/maintain/knowledge-connected-knowledge)
- [Tool maintenance](https://docs.poly.ai/learn/maintain/tool-maintenance)
- [Multi-language updates](https://docs.poly.ai/learn/maintain/multi-language-updates)
- [Voice and audio updates](https://docs.poly.ai/learn/maintain/voice-audio-updates)
- [Routing and handoffs](https://docs.poly.ai/learn/maintain/routing-handoffs)
- [Temporary closures](https://docs.poly.ai/learn/maintain/temporary-closures)
