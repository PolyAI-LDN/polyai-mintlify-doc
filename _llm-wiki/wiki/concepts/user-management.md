# User management

Inviting team members and managing role-based access. Account roles (Admin / Member) plus granular per-area permissions (None / Read / Edit) across Build, Channels, Analytics, Configure, Deployments.

Lives under the workspace `Users` tab.

## SSO

Google SSO handles **sign-in only**. It does not auto-grant Admin or Member roles, and does not auto-assign permissions. After SSO sign-in, an Admin must still configure permissions manually.

## Common failure modes

- **New member sees "Page not found".** Invited but not assigned to any project. An Admin needs to assign projects.
- **Assumed SSO grants admin.** SSO doesn't. Always check the user's permission matrix after they sign in.
- **Over-privileged team member.** Forgot to revoke Edit on a sensitive area. Use least-privilege: a knowledge editor gets Edit on Knowledge only, Read on the rest.
- **Parent-section permission cascading.** Setting an expandable section to Edit grants Edit to all sub-sections unless overridden. Use sub-section overrides to restrict.

## Common role patterns

The docs sketch a few useful starting points:

- **Read-only stakeholder** — Read on Analytics, None elsewhere.
- **Knowledge editor** — Edit on Build > Knowledge, Read on the rest.
- **Developer** — Edit on Build, Channels; Read on Configure; None on Deployments.
- **Ops manager** — Edit on Deployments, Configure; Read elsewhere.

## Related

- [Secrets and API keys](secrets-and-api-keys.md).

## Authoritative docs

- [User management introduction](https://docs.poly.ai/user-management/introduction)
- [Access control scope](https://docs.poly.ai/user-management/access-control-scope)
- [Invite users](https://docs.poly.ai/user-management/invite-users)
