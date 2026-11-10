"""Builds server/kb.json: the only knowledge the Ask Ezydrag LLM is ever given.
Chunks come from the built site (dist/*.html main text) plus the approved Q&A. Run after the pages are built.
Nothing outside the site goes in, so the assistant cannot answer from anywhere else."""
import html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST, OUT = ROOT / "dist", ROOT / "server" / "kb.json"
SKIP = {"404.html", "brand.html", "privacy.html"}
MAXC = 650  # characters per chunk: keeps retrieved context small


def text(h):
    h = re.sub(r"<(script|style|svg|template|noscript)\b.*?</\1>", " ", h, flags=re.S | re.I)
    h = re.sub(r"<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", html.unescape(h)).strip()


def chunks_of(page, h):
    title = text(re.search(r"<title>(.*?)</title>", h, re.S).group(1)).split(" | ")[0].split(" - ")[0]
    m = re.search(r"<main\b.*?</main>", h, re.S)
    body = m.group(0) if m else h
    parts = re.split(r"(<h[23]\b[^>]*>.*?</h[23]>)", body, flags=re.S)
    out, head, buf = [], title, [parts[0]]
    def flush():
        t = text(" ".join(buf))
        while len(t) > 40:
            cut = t[:MAXC]
            if len(t) > MAXC and " " in cut: cut = cut[:cut.rfind(" ")]
            out.append({"p": page, "h": head, "t": cut}); t = t[len(cut):].strip()
    for seg in parts[1:]:
        if re.match(r"<h[23]\b", seg):
            flush(); head, buf = title + " / " + text(seg), []
        else: buf.append(seg)
    flush()
    return out


def main():
    kb = []
    for p in sorted(DIST.glob("*.html")):
        if p.name in SKIP: continue
        h = p.read_text()
        if p.name.startswith("blog-"):  # posts: title + summary only, to stay small
            t = text(re.search(r"<title>(.*?)</title>", h, re.S).group(1)).split(" | ")[0]
            d = re.search(r'<meta name="description" content="(.*?)"', h)
            kb.append({"p": p.name, "h": "Blog post", "t": f"Field Notes blog post: {t}. {html.unescape(d.group(1)) if d else ''}"})
        elif p.name in ("faq.html", "blog.html"): continue  # FAQ is added from the approved answers below
        else: kb += chunks_of(p.name, h)
    full = (DIST / "llms-full.txt").read_text()
    head, _, faq = full.partition("## Approved answers")
    kb.insert(0, {"p": "index.html", "h": "Company facts", "t": text(head.replace("\n- ", " ").replace("\n", " "))[:1400]})
    for q, a in re.findall(r"### (.*?)\n\n(.*?)(?=\n\n###|\Z)", faq, re.S):
        a = re.sub(r"\n\nSource:.*", "", a, flags=re.S).strip()
        kb.append({"p": "faq.html", "h": "FAQ: " + q.strip(), "t": q.strip() + " " + a, "faq": 1})
    seen, uniq = set(), []
    for c in kb:  # drop repeated nav/footer-style chunks
        key = c["t"][:80]
        if key in seen: continue
        seen.add(key); uniq.append(c)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(uniq, ensure_ascii=False))
    # same data as a plain ES module: bundles reliably in Netlify Functions
    (OUT.parent / "kb.mjs").write_text("export default " + json.dumps(uniq, ensure_ascii=False) + ";\n")
    print(f"kb.json: {len(uniq)} chunks, {sum(len(c['t']) for c in uniq)} chars")


if __name__ == "__main__":
    main()
