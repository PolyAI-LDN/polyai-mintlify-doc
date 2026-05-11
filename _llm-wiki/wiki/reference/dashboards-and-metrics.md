# Dashboards and metrics

_Status: shallow — extend in next ingest pass._

Where customers look at how the agent is performing.

## Dashboards

Three built-in dashboards plus custom:

- **Standard** — daily-operations view (volume, containment, latency, handoff rate, SMS deliverability widget). The starting point for the [daily maintenance](../concepts/maintenance-playbook.md) check.
- **Safety** — flagged-conversation dashboard.
- **Custom** — author your own from project metrics.

Each dashboard offers `Generate insights` buttons that hand off to [Smart Analyst](../concepts/smart-analyst-vs-agent-analysis.md) with pre-populated prompts.

## Metrics

Project-level numeric metrics that flow into dashboards and the Conversations API. Custom metrics are configured under `Configure > Metrics`. API access requires both API-key permission and the metric to be enabled on the project.

## CSAT

Customer-satisfaction surveys captured at conversation end and reported in the dashboard. See [CSAT introduction](https://docs.poly.ai/analytics/csat/introduction).

## Authoritative docs

- [Standard dashboard](https://docs.poly.ai/analytics/dashboards/standard)
- [Safety dashboard](https://docs.poly.ai/analytics/dashboards/safety)
- [Custom dashboards](https://docs.poly.ai/analytics/dashboards/custom)
- [Dashboards introduction](https://docs.poly.ai/analytics/dashboards/introduction)
- [Metrics](https://docs.poly.ai/settings/metrics)
- [CSAT](https://docs.poly.ai/analytics/csat/introduction)
- [Settings introduction](https://docs.poly.ai/settings/introduction)

_Status: shallow — extend in next ingest pass._
