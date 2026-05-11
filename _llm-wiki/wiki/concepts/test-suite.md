# Test suite

Automated regression testing for the agent. Save real conversations as test cases, group into test sets, re-run against the Draft or Sandbox after every change.

## Where it lives

- **Studio:** `Build > Test suite`.

## Concepts

- **Test case** — a single scenario captured from a real conversation. Includes user messages, expected agent replies, and the function calls that should fire.
- **Test set** — a named collection of cases ("Refunds", "Shipping", "Core intents"). One case can belong to multiple sets.

## Workflow

1. **Create a test case** from `Agent Chat` or `Conversation Review` via the **Create test** button. Name it.
2. **Build a test set** under `Build > Test suite > Test Sets > New set`, then add cases.
3. **Run a single case** via Test Cases → Run, choosing Draft or Sandbox.
4. **Run a set** via Test Sets → Run set.

Each case shows Outcome and Last Run; sets show pass/fail counts and a trend chart.

## Best practices

- Name cases descriptively — "Caller cancels booking", not "Test 1".
- Build focused sets per feature.
- Cover happy paths and edge cases (silence, abusive input, ambiguous requests).
- Re-run after **any** knowledge change — topic edits can silently break flows.
- Run before every promotion.

## CI-style gating

Via the [Agents API](https://docs.poly.ai/api-reference/agents/introduction), you can publish to Sandbox, run a test set, and only promote to Pre-release on success.

## Related

- [Conversation review](conversation-review.md), [Maintenance playbook](maintenance-playbook.md), [Deployment](../entities/deployment.md), [Environment](../entities/environment.md).

## Authoritative docs

- [Test suite introduction](https://docs.poly.ai/analytics/test-suite/introduction)
