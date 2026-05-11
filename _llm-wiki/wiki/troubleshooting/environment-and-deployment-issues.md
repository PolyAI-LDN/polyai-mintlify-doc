# Troubleshooting: environment and deployment issues

See [Environment](../entities/environment.md) and [Deployment](../entities/deployment.md). Most "I changed it but it isn't live" tickets are pipeline-promotion issues.

---

## Symptom: Changes work in Sandbox but not in Live

**Cause:** version not promoted Sandbox → Pre-release → Live.

**Fix:** `Deployments > Environments` → select Sandbox version → Promote to Pre-release → Promote to Live.

**Prevention:** know the full pipeline. Save ≠ Publish ≠ Promote.

**Source:** [Troubleshoot: environments](https://docs.poly.ai/troubleshoot/faq-environments), [Maintain: version management](https://docs.poly.ai/learn/maintain/version-management).

---

## Symptom: Promoted but old behaviour still active

**Likely causes:**

1. Promotion still propagating (give it 2–5 minutes).
2. Wrong version was promoted.
3. The phone number is pointing at a different environment than expected.

**Fix:** verify the active version number under Environments. Compare against expected. Check phone-number environment binding under `Configure > Numbers`.

**Prevention:** [diff](https://docs.poly.ai/environments-and-versions/diffs) versions before promoting. Keep descriptive version notes so the right version is unambiguous.

**Source:** [Troubleshoot: environments](https://docs.poly.ai/troubleshoot/faq-environments), [Maintain: version management](https://docs.poly.ai/learn/maintain/version-management).

---

## Symptom: Need to revert quickly

**Cause:** the new version has a bug or breaks something.

**Fix:** rollback is fast.

1. `Deployments > Environments`.
2. Find the last known-good version.
3. Promote it to Live.

Time: 2–5 minutes.

**Prevention:** before every promotion, identify the rollback target. Have a passing test set as part of the [pre-deployment checklist](../concepts/maintenance-playbook.md).

**Source:** [Maintain: version management](https://docs.poly.ai/learn/maintain/version-management).

---

## Symptom: Call drops immediately after the disclaimer

**Cause:** No topics published to the Live environment.

**Fix:** ensure at least one topic is published and promoted to Live before going live.

**Prevention:** complete a full pipeline test (Draft → Publish → Sandbox → Pre-release → Live) before production traffic.

**Source:** [Maintain: common issues](https://docs.poly.ai/learn/maintain/common-issues).
