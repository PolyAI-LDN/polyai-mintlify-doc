#!/usr/bin/env python3
"""Insert the ADK tab into docs.json, mirroring the PolyAI ADK mkdocs nav."""
import json, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = "adk"  # page-path prefix

def g(name, pages, icon=None):
    d = {"group": name, "pages": pages}
    if icon:
        d = {"group": name, "icon": icon, "pages": pages}
    return d

# ---- ADK tab, mirroring adk/docs/mkdocs.yml nav ----
adk_tab = {
    "tab": "ADK",
    "groups": [
        g("Overview", [f"{P}/index"], icon="book-open"),
        g("Get started", [
            f"{P}/get-started/get-started",
            f"{P}/get-started/what-is-the-adk",
            f"{P}/get-started/walkthrough-video",
            f"{P}/get-started/prerequisites",
            f"{P}/get-started/first-commands",
        ], icon="rocket"),
        g("Tutorials", [
            f"{P}/tutorials/index",
            f"{P}/tutorials/build-an-agent",
            f"{P}/tutorials/restaurant-booking-agent",
        ], icon="graduation-cap"),
        g("Core concepts", [
            f"{P}/concepts/working-locally",
            f"{P}/concepts/resource-architecture",
            f"{P}/concepts/multi-user-and-guardrails",
            f"{P}/concepts/anti-patterns",
        ], icon="lightbulb"),
        g("Examples", [
            f"{P}/examples/index",
            f"{P}/examples/confirm-caller-id-before-sms",
            f"{P}/examples/venue-specific-goodbye",
            f"{P}/examples/sms-or-transfer-fallback",
        ], icon="code"),
        g("Reference", [
            f"{P}/reference/cli",
            f"{P}/reference/branch_merge",
            f"{P}/reference/tests",
            f"{P}/reference/tooling",
            g("Agent configuration", [
                f"{P}/reference/agent_settings",
                f"{P}/reference/voice_settings",
                f"{P}/reference/chat_settings",
                f"{P}/reference/safety_filters",
                f"{P}/reference/languages",
                f"{P}/reference/experimental_config",
            ]),
            g("Project resources", [
                f"{P}/reference/flows",
                f"{P}/reference/functions",
                f"{P}/reference/topics",
                f"{P}/reference/entities",
                f"{P}/reference/variables",
                f"{P}/reference/variants",
                f"{P}/reference/handoffs",
                f"{P}/reference/sms",
                f"{P}/reference/translations",
            ]),
            g("Voice controls", [
                f"{P}/reference/speech_recognition",
                f"{P}/reference/response_control",
            ]),
        ], icon="file-lines"),
        g("Community", [f"{P}/community/discord"], icon="users"),
        g("Legal", [f"{P}/legal/licensing"], icon="scale-balanced"),
    ],
}

def collect_pages(node, out):
    if isinstance(node, str):
        out.append(node)
    elif isinstance(node, dict):
        for pg in node.get("pages", []):
            collect_pages(pg, out)
        for grp in node.get("groups", []):
            collect_pages(grp, out)
    elif isinstance(node, list):
        for x in node:
            collect_pages(x, out)

pages = []
collect_pages(adk_tab, pages)
missing = [p for p in pages if not os.path.exists(os.path.join(REPO, p + ".mdx"))]
if missing:
    print("MISSING PAGE FILES:")
    for m in missing:
        print("  ", m)
    sys.exit(1)

all_mdx = []
for root, _, files in os.walk(os.path.join(REPO, "adk")):
    for fn in files:
        if fn.endswith(".mdx"):
            all_mdx.append(os.path.relpath(os.path.join(root, fn), REPO)[:-4])
orphans = sorted(set(all_mdx) - set(pages))
print(f"nav pages: {len(pages)} | mdx files: {len(all_mdx)} | orphans (not in nav): {len(orphans)}")
for o in orphans:
    print("  orphan:", o)

if "--write" in sys.argv:
    docs = json.load(open(os.path.join(REPO, "docs.json")))
    tabs = docs["navigation"]["tabs"]
    tabs = [t for t in tabs if t.get("tab") != "ADK"]
    # place ADK just before "API reference" -> ADK, API reference, MCP
    idx = next((i for i, t in enumerate(tabs) if t.get("tab") == "API reference"), len(tabs))
    tabs.insert(idx, adk_tab)
    docs["navigation"]["tabs"] = tabs
    json.dump(docs, open(os.path.join(REPO, "docs.json"), "w"), indent=2, ensure_ascii=False)
    print("docs.json updated.")
