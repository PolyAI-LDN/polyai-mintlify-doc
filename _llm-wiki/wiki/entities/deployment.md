# Deployment

A published version of the agent in a specific [Environment](environment.md). Each deployment is a snapshot of the agent's full configuration at a point in time. Deployments can be promoted, rolled back, or compared.

## Where it lives

- **Studio:** `Deployments > Environments`, plus `Project history`.
- **API:** [Deployment endpoints](https://docs.poly.ai/api-reference/agents/introduction) — list, get active, publish current draft, promote to next environment, rollback.

## Lifecycle

A deployment is created by `Publish` (current draft → Sandbox). Subsequent `Promote` actions move the same version to Pre-release, then Live. `Rollback` re-activates a prior version on the current environment — fast (2–5 minutes).

## Common failure modes

- **Promoting the wrong version.** Always [diff](https://docs.poly.ai/environments-and-versions/diffs) before promoting. Version numbers are easy to misread when there are many.
- **Rollback cascade misunderstood.** Rolling back Sandbox while Pre-release depends on the old Sandbox version produces an inconsistent state. Plan rollbacks intentionally — and prefer rolling back Live to a known-good prior version rather than chaining through environments.
- **Live still serves old behaviour after promote.** Usually one of: change saved but never published; promotion stalled (give it 2–5 mins); promoted version isn't the one you thought it was; phone number pointing at wrong environment.

## Related

- [Environment](environment.md), [Project and Branch](project-and-branch.md).

## Authoritative docs

- [Environments and versions introduction](https://docs.poly.ai/environments-and-versions/introduction)
- [Project history](https://docs.poly.ai/environments-and-versions/project-history)
- [Maintain: version management](https://docs.poly.ai/learn/maintain/version-management)
