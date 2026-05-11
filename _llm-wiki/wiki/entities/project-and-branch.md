# Project, Agent, and Branch

These three terms are easy to confuse. The wiki separates them deliberately so the support agent can answer "what's the difference" cleanly.

## Project

The complete agent configuration — knowledge, flows, tools, variants, settings — for one use case. Most customers have one project per agent ("Customer Support Agent", "Outbound Reminder Agent"). In Studio the term "Project" and the term "Agent" are used roughly interchangeably; for purposes of this wiki, treat them as synonyms in the user-facing sense, and use [Agent](agent.md) for capability-talk and Project for configuration-and-versioning talk.

## Branch

A parallel working copy of the project's draft. Lets multiple team members edit different aspects simultaneously without conflicts. Branches can be merged back to main, with visual conflict resolution.

This is distinct from a [Deployment](deployment.md) — branches are pre-publish, deployments are published versions in an [Environment](environment.md).

## Common failure modes

- **Confusing draft with branch.** A draft is the unsaved work-in-progress on the main line; a branch is a parallel, named copy. Drafts become the next version on publish; branches stay parallel until merged.
- **Confusing "Save" with "Publish".** Save = persist the draft. Publish = create a version and push it to Sandbox. New users routinely think Save means "go live"; it doesn't.
- **Merging branches without resolving conflicts.** The visual merge UI shows differences side-by-side — skip review and you can overwrite knowledge or rules silently.

## Related

- [Agent](agent.md), [Deployment](deployment.md), [Environment](environment.md).

## Authoritative docs

- [Glossary introduction](https://docs.poly.ai/glossary/introduction)
- [Glossary architecture](https://docs.poly.ai/glossary/architecture)
- [Platform introduction](https://docs.poly.ai/platform/introduction)
- [Environments and versions](https://docs.poly.ai/environments-and-versions/introduction)
- [Project history](https://docs.poly.ai/environments-and-versions/project-history)
- API endpoints: [Branches](https://docs.poly.ai/api-reference/agents/introduction)
