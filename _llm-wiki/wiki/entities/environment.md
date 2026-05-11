# Environment

The deployment stage of the agent. Three environments, in order:

1. **Sandbox** — for development and internal testing.
2. **Pre-release** — UAT / staging for stakeholder validation.
3. **Live** — production.

Each environment has its own phone number, configuration, and active version (a [Deployment](deployment.md)).

## Where it lives

- **Studio:** `Deployments > Environments`.
- **API:** [Deployment endpoints](https://docs.poly.ai/api-reference/agents/introduction) — list, get active, publish, promote, rollback.

## The promotion pipeline

```
Draft  ──Save──▶  Draft (saved)
              ──Publish──▶  Sandbox
                                ──Promote──▶  Pre-release
                                                  ──Promote──▶  Live
```

`Save` does **not** publish. `Publish` creates a version and sends it to Sandbox. `Promote` moves a Sandbox version to Pre-release, and a Pre-release version to Live.

## Common failure modes

- **Confusing Save with Publish.** Saving keeps the work in the draft; the agent on Sandbox/Live still serves the previous version. New users routinely think Save = go live.
- **Skipping Pre-release.** Going Sandbox → Live without UAT means the first real users hit untested behaviour. Use Pre-release.
- **Per-environment config drift.** Each environment can have its own phone number, variant settings, secrets, integration credentials. Promoting a version doesn't auto-promote those — verify each environment.
- **Source updates not propagating.** Connected Knowledge sources must be `Update`/`Sync`'d **and** the agent republished for changes to appear in any environment.
- **Phone number pointed at wrong environment.** A common cause of "I changed it but live still uses the old version" — the live phone number may be pointing at Pre-release.

## Diagnostics

The [diff tool](https://docs.poly.ai/environments-and-versions/diffs) compares any two versions side by side. Use it before every promotion.

## Related

- [Deployment](deployment.md), [Project and Branch](project-and-branch.md), [Variant](variant.md).

## Authoritative docs

- [Environments and versions introduction](https://docs.poly.ai/environments-and-versions/introduction)
- [Diffs](https://docs.poly.ai/environments-and-versions/diffs)
- [Project history](https://docs.poly.ai/environments-and-versions/project-history)
- [Maintain: version management](https://docs.poly.ai/learn/maintain/version-management)
