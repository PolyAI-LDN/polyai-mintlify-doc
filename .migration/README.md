# ADK docs migration

Reproducible pipeline that converts the PolyAI ADK mkdocs site
(`~/Documents/adk/docs`, repo `github.com/polyai/adk`) into Mintlify MDX under
[`../adk/`](../adk) and wires it into `docs.json` as the top-level **ADK** tab.

## Scripts

| Script | Purpose |
|---|---|
| `convert.py` | Convert every `docs/**/*.md` → `adk/**/*.mdx`. Handles frontmatter, `!!!`/`???` admonitions → callouts/accordions, `=== "X"` tabs → `<Tabs>`/`<Tab>`, Material `grid cards` → `<CardGroup>`, HTML→JSX safety (`class`→`className`, `style` object, void self-close, angle/brace escaping — the last keeps literal `{{fn:…}}`/`{{ho:…}}` agent-template syntax intact), icon-shortcode stripping, heading/image attr-list stripping, and link/image rewriting to `/adk/...`. |
| `build_nav.py` | Insert/refresh the **ADK** tab in `docs.json`, mirroring the mkdocs nav. Validates every referenced page exists and reports orphans. Run with `--write` to persist. |

Paths (`SRC`, `DEST`, `REPO`) resolve relative to the script location, so the
pipeline runs unchanged from either the main checkout or a worktree.

## Re-running (e.g. to sync upstream changes)

```bash
# from repo root
rm -rf adk
python3 .migration/convert.py            # regenerate MDX (idempotent)
python3 .migration/build_nav.py --write   # refresh the ADK tab in docs.json
mint broken-links                         # validate MDX + links

# recopy images (preserving relative paths)
cd ~/Documents/adk/docs
find docs -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.svg' \
  -o -iname '*.gif' -o -iname '*.jpeg' -o -iname '*.webp' \) | while read -r f; do
  dest="/path/to/repo/adk/${f#docs/}"; mkdir -p "$(dirname "$dest")"; cp "$f" "$dest"
done
```

## Notes

- Scope: full mirror of the upstream nav (Get started, Tutorials, Core concepts,
  Examples, Reference, Community, Legal).
- Branding and wording kept as-is from the PolyAI ADK source.
- `SOURCE_FIXUPS` in `convert.py` is available for patching malformed-upstream
  sources (currently empty).
