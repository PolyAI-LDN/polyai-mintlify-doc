#!/usr/bin/env python3
"""Convert the PolyAI ADK mkdocs (.md) docs into Mintlify MDX under adk/."""
import os, re, sys

# mkdocs project dir; override with ADK_SRC to convert a different checkout/export
SRC = os.environ.get("ADK_SRC", "/Users/aaronforinton/Documents/adk/docs")
SRC_DOCS = os.path.join(SRC, "docs")
# repo root is the parent of this script's .migration/ dir
DEST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "adk")
PREFIX = "/adk"

EXT_LANG = {
    ".py": "python", ".ts": "typescript", ".js": "javascript", ".go": "go",
    ".java": "java", ".sh": "bash", ".bash": "bash", ".yaml": "yaml",
    ".yml": "yaml", ".json": "json", ".md": "markdown", ".txt": "text",
    ".xml": "xml", ".html": "html", ".proto": "proto", ".tf": "hcl",
}
VOID = ["img", "br", "hr", "input", "link", "meta", "source", "col", "area", "embed"]
ADMON = {
    "note": "Note", "tip": "Tip", "warning": "Warning", "caution": "Warning",
    "danger": "Warning", "info": "Info", "example": "Info", "success": "Check",
    "question": "Info", "abstract": "Info", "quote": "Info", "bug": "Warning",
    "failure": "Warning", "important": "Info",
}

# Fixups for malformed upstream source (unclosed code fences, etc.).
SOURCE_FIXUPS = {}

FENCE_RE = re.compile(r'^(\s*)(```+|~~~+)(.*)$')

def fence_delim(line):
    """Return (char, length, info) if line is a fence delimiter, else None."""
    m = FENCE_RE.match(line)
    if not m:
        return None
    ticks = m.group(2)
    return ticks[0], len(ticks), m.group(3).strip()

def is_closer(delim, open_char, open_len):
    """A closer: same char, length >= opener, no info string."""
    ch, ln, info = delim
    return ch == open_char and ln >= open_len and info == ""

def max_backtick_run(text):
    runs = re.findall(r'`+', text)
    return max((len(r) for r in runs), default=0)

# ---------- snippet resolution ----------
def read_snippet(spec):
    section = None
    path = spec
    m = re.match(r'^(.*?):([A-Za-z0-9_\-]+)$', spec)
    if m and os.path.splitext(m.group(1))[1]:
        path, section = m.group(1), m.group(2)
    full = os.path.join(SRC, path)
    if not os.path.exists(full):
        return None, None
    with open(full, encoding="utf-8") as f:
        lines = f.read().split("\n")
    ext = os.path.splitext(path)[1]
    lang = EXT_LANG.get(ext, "")
    if section:
        out, capture = [], False
        start_re = re.compile(r'--8<--\s*\[start:%s\]' % re.escape(section))
        end_re = re.compile(r'--8<--\s*\[end:%s\]' % re.escape(section))
        for ln in lines:
            if end_re.search(ln):
                capture = False; continue
            if start_re.search(ln):
                capture = True; continue
            if capture:
                if re.search(r'--8<--\s*\[(start|end):', ln):
                    continue
                out.append(ln)
        lines = out
    else:
        lines = [l for l in lines if not re.search(r'--8<--\s*\[(start|end):', l)]
    return dedent_block("\n".join(lines)), lang

def dedent_block(text):
    lines = text.split("\n")
    indents = [len(l) - len(l.lstrip()) for l in lines if l.strip()]
    if not indents:
        return text
    m = min(indents)
    return "\n".join(l[m:] if l.strip() else "" for l in lines)

def resolve_snippets(text):
    out = []
    open_char = None      # fence char if inside a fence
    open_len = 0          # authored delimiter length
    open_idx = -1         # index in `out` of the opening fence line
    need_len = 0          # delimiter length required (may grow)
    open_indent = ""
    open_info = ""
    for line in text.split("\n"):
        delim = fence_delim(line)
        m = re.match(r'^(\s*)--8<--\s+"([^"]+)"\s*$', line)
        if not m:
            m = re.match(r"^(\s*)--8<--\s+'([^']+)'\s*$", line)
        if m:
            indent, spec = m.group(1), m.group(2)
            body, lang = read_snippet(spec)
            if body is None:
                out.append(line); continue
            run = max_backtick_run(body)
            if open_char is not None:
                # inside a fence: inline raw, upgrading the fence if the body
                # contains a backtick run >= the current delimiter length.
                if run >= need_len:
                    need_len = run + 1
                    out[open_idx] = open_indent + ("`" * need_len) + open_info
                for bl in body.split("\n"):
                    out.append((indent + bl) if bl else "")
            else:
                flen = max(3, run + 1)
                fence = "`" * flen
                out.append(indent + fence + lang)
                for bl in body.split("\n"):
                    out.append((indent + bl) if bl else "")
                out.append(indent + fence)
            continue
        if delim:
            ch, ln, info = delim
            if open_char is None:
                open_char, open_len, need_len = ch, ln, ln
                open_idx = len(out)
                open_indent = re.match(r'^(\s*)', line).group(1)
                open_info = line.strip()[ln:]  # language/info after the ticks
            elif is_closer(delim, open_char, open_len):
                out.append(open_indent + (open_char * need_len))
                open_char = None; open_idx = -1; need_len = 0
                continue
        out.append(line)
    return "\n".join(out)

# ---------- fence-aware iteration ----------
def iter_lines_with_fence_state(lines):
    open_char = None
    open_len = 0
    for line in lines:
        delim = fence_delim(line)
        if delim:
            if open_char is None:
                open_char, open_len = delim[0], delim[1]
                yield line, True; continue
            elif is_closer(delim, open_char, open_len):
                open_char = None
                yield line, True; continue
            else:
                yield line, True; continue
        yield line, open_char is not None

# ---------- block parser: admonitions + tabs ----------
def parse_blocks(text):
    return "\n".join(_parse(text.split("\n")))

def _leading(s):
    return len(s) - len(s.lstrip(" "))

def _parse(lines):
    out = []
    i = 0
    open_char = None
    open_len = 0
    while i < len(lines):
        line = lines[i]
        delim = fence_delim(line)
        if delim:
            if open_char is None:
                open_char, open_len = delim[0], delim[1]
            elif is_closer(delim, open_char, open_len):
                open_char = None
            out.append(line); i += 1; continue
        if open_char is not None:
            out.append(line); i += 1; continue

        am = re.match(r'^(\s*)(!!!|\?\?\?\+?)\s*([A-Za-z]+)?\s*(?:"([^"]*)"|\'([^\']*)\'|“([^”]*)”|‘([^’]*)’)?\s*$', line)
        if am:
            indent = len(am.group(1))
            marker = am.group(2)
            atype = (am.group(3) or "note").lower()
            title = am.group(4) or am.group(5) or am.group(6) or am.group(7) or ""
            collapsible = marker.startswith("???")
            body_lines = []
            j = i + 1
            while j < len(lines):
                nl = lines[j]
                if nl.strip() == "":
                    body_lines.append(""); j += 1; continue
                if _leading(nl) > indent:
                    body_lines.append(nl[indent+4:] if len(nl) >= indent+4 else nl.lstrip())
                    j += 1
                else:
                    break
            while body_lines and body_lines[-1] == "":
                body_lines.pop()
            inner = "\n".join(_parse(body_lines))
            comp = ADMON.get(atype, "Note")
            if collapsible:
                t = title or atype.capitalize()
                out.append(f'<Accordion title="{esc_attr(t)}">')
                out.append("")
                out.extend(inner.split("\n"))
                out.append("")
                out.append("</Accordion>")
            else:
                out.append(f"<{comp}>")
                out.append("")
                if title:
                    out.append(f"**{title}**")
                    out.append("")
                out.extend(inner.split("\n"))
                out.append("")
                out.append(f"</{comp}>")
            out.append("")
            i = j; continue

        tm = re.match(r'^(\s*)===\s+(?:"([^"]*)"|\'([^\']*)\')\s*$', line)
        if tm:
            indent = len(tm.group(1))
            tabs = []
            j = i
            while j < len(lines):
                tmm = re.match(r'^(\s*)===\s+(?:"([^"]*)"|\'([^\']*)\')\s*$', lines[j])
                if tmm and len(tmm.group(1)) == indent:
                    ttitle = tmm.group(2) or tmm.group(3) or ""
                    body_lines = []
                    k = j + 1
                    while k < len(lines):
                        nl = lines[k]
                        if nl.strip() == "":
                            body_lines.append(""); k += 1; continue
                        if _leading(nl) > indent:
                            body_lines.append(nl[indent+4:] if len(nl) >= indent+4 else nl.lstrip())
                            k += 1
                        else:
                            break
                    while body_lines and body_lines[-1] == "":
                        body_lines.pop()
                    tabs.append((ttitle, "\n".join(_parse(body_lines))))
                    j = k
                else:
                    break
            out.append("<Tabs>")
            for ttitle, tbody in tabs:
                out.append(f'<Tab title="{esc_attr(ttitle)}">')
                out.append("")
                out.extend(tbody.split("\n"))
                out.append("")
                out.append("</Tab>")
            out.append("</Tabs>")
            out.append("")
            i = j; continue

        out.append(line); i += 1
    return out

def esc_attr(s):
    return s.replace('"', "&quot;")

# ---------- mkdocs Material "grid cards" -> Mintlify CardGroup ----------
GRID_RE = re.compile(r'<div[^>]*grid cards[^>]*>\n(.*?)\n</div>', re.S)
ICON_SHORTCODE = re.compile(r':(?:fontawesome|octicons|material|simple|emoji)[\w./-]*:(?:\{[^}]*\})?')

def strip_icons(s):
    return ICON_SHORTCODE.sub("", s)

def convert_grid_cards(text, cur_dir):
    def repl(m):
        inner = m.group(1)
        items = re.split(r'(?m)^\s*-\s+', inner)
        cards = []
        for it in items:
            it = it.strip()
            if not it:
                continue
            mt = re.search(r'\*\*(.+?)\*\*', it)
            title = strip_icons(mt.group(1)).strip() if mt else "Learn more"
            ml = re.search(r'\[([^\]]*)\]\(([^)]+)\)', it)
            href = rewrite_target(ml.group(2).strip(), cur_dir) if ml else ""
            body = []
            seen_sep = False
            for ln in it.split("\n"):
                s = ln.strip()
                if s == "---":
                    seen_sep = True; continue
                if not seen_sep:
                    continue
                if re.match(r'^\[.*\]\(.*\)', s):
                    continue
                s = re.sub(r'<br\s*/?>', '', s)
                s = re.sub(r'<!--.*?-->', '', s)
                s = strip_icons(s).strip()
                if s:
                    body.append(s)
            attr = f' href="{href}"' if href else ""
            cards.append(f'  <Card title="{esc_attr(title)}"{attr}>\n    {" ".join(body)}\n  </Card>')
        if not cards:
            return ""
        return "<CardGroup>\n" + "\n".join(cards) + "\n</CardGroup>"
    return GRID_RE.sub(repl, text)

# ---------- inline transforms ----------
INLINE_CODE_RE = re.compile(r'(`+)(.+?)\1')

def protect_inline_code(line):
    spans = []
    def repl(m):
        spans.append(m.group(0))
        return f"\x00{len(spans)-1}\x00"
    return INLINE_CODE_RE.sub(repl, line), spans

def restore_inline_code(line, spans):
    return re.sub(r'\x00(\d+)\x00', lambda m: spans[int(m.group(1))], line)

def escape_braces(line):
    return line.replace("{", "&#123;").replace("}", "&#125;")

# tags allowed to remain as JSX/HTML; any other `<...` in prose is escaped.
ALLOWED_TAGS = {
    # Mintlify components
    "Note", "Tip", "Warning", "Info", "Check", "Accordion", "AccordionGroup",
    "Tabs", "Tab", "Card", "CardGroup", "Columns", "Steps", "Step", "Frame",
    "CodeGroup", "Icon", "Tooltip", "Expandable", "ParamField", "ResponseField",
    "Panel", "Update", "Snippet",
    # HTML (lowercased)
    "a", "abbr", "b", "blockquote", "br", "button", "code", "col", "colgroup",
    "dd", "details", "div", "dl", "dt", "em", "figcaption", "figure", "footer",
    "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "iframe", "img",
    "input", "kbd", "label", "li", "main", "mark", "nav", "ol", "p", "pre",
    "section", "small", "source", "span", "strong", "sub", "summary", "sup",
    "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul", "video",
    "picture", "svg", "path", "g", "circle", "rect", "line", "polyline",
    "aside", "caption", "s", "del", "ins", "q", "cite", "time",
}
_TAG_START = re.compile(r'<(/?)([A-Za-z][A-Za-z0-9]*)')

def escape_angles(line):
    out = []
    i = 0
    n = len(line)
    while i < n:
        if line[i] == "<":
            m = _TAG_START.match(line, i)
            if m and (m.group(2) in ALLOWED_TAGS or m.group(2).lower() in ALLOWED_TAGS):
                out.append(line[i:m.end()]); i = m.end(); continue
            out.append("&lt;"); i += 1; continue
        out.append(line[i]); i += 1
    return "".join(out)

def self_close_void(line):
    for tag in VOID:
        line = re.sub(r'<(' + tag + r')(\s[^>]*?)?(?<!/)>',
                      lambda m: f"<{m.group(1)}{m.group(2) or ''} />", line)
    return line

def class_to_classname(line):
    return re.sub(r'(<[a-zA-Z][^>]*?)\bclass=', r'\1className=', line)

def style_to_jsx(line):
    def repl(m):
        props = []
        for decl in m.group(1).split(";"):
            decl = decl.strip()
            if not decl or ":" not in decl:
                continue
            k, v = decl.split(":", 1)
            ck = re.sub(r'-([a-z])', lambda mm: mm.group(1).upper(), k.strip())
            props.append(f"{ck}: '{v.strip()}'")
        return "style={{" + ", ".join(props) + "}}"
    return re.sub(r'style="([^"]*)"', repl, line)

def html_comments(text):
    # Drop HTML comments entirely (editorial notes, commented-out markup).
    # Converting them to MDX {/* */} conflicts with brace-escaping, and they
    # carry no reader value.
    return re.sub(r'<!--.*?-->', '', text, flags=re.S)

def rewrite_target(target, cur_dir):
    if re.match(r'^(https?:|mailto:|tel:|#|data:)', target):
        return target
    if target == PREFIX or target.startswith(PREFIX + "/"):
        return target  # already rewritten (idempotent)
    anchor = ""
    if "#" in target:
        target, anchor = target.split("#", 1)
        anchor = "#" + anchor
    if target == "":
        return anchor
    if target.startswith("/"):
        resolved = target.lstrip("/")
    else:
        resolved = os.path.normpath(os.path.join(cur_dir, target))
    if resolved.endswith(".md"):
        resolved = resolved[:-3]
    if resolved.endswith("/index"):
        resolved = resolved[:-6]
    elif resolved == "index":
        resolved = ""
    if resolved:
        return PREFIX + "/" + resolved + anchor
    return PREFIX + anchor

def fix_links(line, cur_dir):
    # match the `](target)` portion only, so multi-line links (where the
    # `[text]` sits on a previous line) are still rewritten.
    return re.sub(r'\]\(([^)\s]+)\)',
                  lambda m: f"]({rewrite_target(m.group(1), cur_dir)})", line)

def fix_img_src(line, cur_dir):
    def repl(m):
        attr, val = m.group(1), m.group(2)
        if re.match(r'^(https?:|data:|#|mailto:|tel:|//)', val):
            return m.group(0)
        return f'{attr}="{rewrite_target(val, cur_dir)}"'
    return re.sub(r'\b(src|href)="([^"]+)"', repl, line)

def inline_pass(text, cur_dir):
    text = html_comments(text)
    out = []
    for line, in_fence in iter_lines_with_fence_state(text.split("\n")):
        if in_fence:
            out.append(line); continue
        # strip mkdocs attr_list from headings: "## Title { #id .class }"
        if re.match(r'^#{1,6}\s', line):
            line = re.sub(r'\s*\{[^{}]*\}\s*$', '', line)
        # strip mkdocs attr_list attached to images/links: "](x.png){: width=600}"
        line = re.sub(r'(?<=\))\{[^{}]*\}', '', line)
        protected, spans = protect_inline_code(line)
        protected = strip_icons(protected)
        protected = escape_braces(protected)
        protected = escape_angles(protected)
        protected = self_close_void(protected)
        protected = class_to_classname(protected)
        protected = style_to_jsx(protected)
        protected = fix_links(protected, cur_dir)
        protected = fix_img_src(protected, cur_dir)
        out.append(restore_inline_code(protected, spans))
    return "\n".join(out)

# ---------- frontmatter ----------
def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            return text[4:end], text[end+4:].lstrip("\n")
    return None, text

def build_frontmatter(fm_raw, body, relpath):
    title = None
    if fm_raw:
        for line in fm_raw.split("\n"):
            m = re.match(r'^title:\s*(.+)$', line)
            if m:
                title = m.group(1).strip().strip('"\'')
    h1 = None
    for line in body.split("\n"):
        m = re.match(r'^#\s+(.+)$', line)
        if m:
            h1 = m.group(1).strip(); break
    if not title:
        title = h1 or os.path.splitext(os.path.basename(relpath))[0].replace("-", " ").title()
    lines = body.split("\n")
    idx = 0
    while idx < len(lines) and lines[idx].strip() == "":
        idx += 1
    if idx < len(lines):
        m = re.match(r'^#\s+(.+)$', lines[idx])
        if m and m.group(1).strip() == (h1 or "").strip():
            del lines[idx]
    body = "\n".join(lines).lstrip("\n")
    return f'---\ntitle: "{title.replace(chr(34), chr(92)+chr(34))}"\n---\n\n' + body

# ---------- main ----------
def convert_file(src_path, rel):
    with open(src_path, encoding="utf-8") as f:
        text = f.read()
    for find, replace in SOURCE_FIXUPS.get(rel, []):
        if find in text:
            text = text.replace(find, replace)
    fm_raw, body = split_frontmatter(text)
    cur_dir = os.path.dirname(rel)
    body = body.expandtabs(4)
    body = convert_grid_cards(body, cur_dir)
    body = parse_blocks(body)
    body = resolve_snippets(body)
    body = inline_pass(body, cur_dir)
    result = build_frontmatter(fm_raw, body, rel)
    dest_rel = os.path.splitext(rel)[0] + ".mdx"
    dest_path = os.path.join(DEST, dest_rel)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(result)
    return dest_rel

def main():
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    count = 0
    for root, _, files in os.walk(SRC_DOCS):
        for fn in files:
            if not fn.endswith(".md"):
                continue
            src_path = os.path.join(root, fn)
            rel = os.path.relpath(src_path, SRC_DOCS)
            if rel.startswith("_includes/"):
                continue
            if only and not any(o in rel for o in only):
                continue
            try:
                convert_file(src_path, rel); count += 1
            except Exception as e:
                print(f"ERROR {rel}: {e}", file=sys.stderr)
    print(f"Converted {count} files -> {DEST}")

if __name__ == "__main__":
    main()
