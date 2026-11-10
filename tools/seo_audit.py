"""Static SEO + semantics lint for dist/*.html. Prints a table and a JSON summary."""
import re, sys, json, glob, os
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s): super().__init__(); s.t=""; s.in_t=False; s.metas={}; s.links=[]; s.h=[]; s.imgs=[]; s.cur_h=None; s.ld=0; s.in_ld=False; s.landmarks=set(); s.a=[]; s.done=False
    def handle_starttag(s,tag,a):
        a=dict(a)
        if tag=="title" and not s.t and not s.done: s.in_t=True
        if tag=="meta": s.metas[a.get("name") or a.get("property") or ""]=a.get("content","")
        if tag=="link": s.links.append(a)
        if re.fullmatch(r"h[1-6]",tag): s.h.append([tag,""]); s.cur_h=tag
        if tag=="img": s.imgs.append(a)
        if tag=="script" and a.get("type")=="application/ld+json": s.ld+=1
        if tag in("header","nav","main","footer"): s.landmarks.add(tag)
        if tag=="a": s.a.append(a.get("href",""))
    def handle_endtag(s,tag):
        if tag=="title" and s.in_t: s.in_t=False; s.done=True
        if tag==s.cur_h: s.cur_h=None
    def handle_data(s,d):
        if s.in_t: s.t+=d
        if s.cur_h and s.h: s.h[-1][1]+=d
rows=[];issues=[]
pages=sorted(p for p in glob.glob("dist/*.html") if "content=\"noindex\"" not in open(p).read()[:400])  # skip redirect stubs
names={os.path.basename(p) for p in pages}
for f in pages:
    p=P(); p.feed(open(f).read()); n=os.path.basename(f)
    d=p.metas.get("description",""); h1=[h for h in p.h if h[0]=="h1"]
    canon=any(l.get("rel")=="canonical" for l in p.links)
    og=all(k in p.metas for k in("og:title","og:description","og:image"))
    tw="twitter:card" in p.metas
    noalt=[i.get("src") for i in p.imgs if "alt" not in i]
    broken=[h for h in p.a if h and not h.startswith(("http","mailto","#","tel")) and h.split("#")[0]!="" and not os.path.exists("dist/"+h.split("#")[0].split("?")[0])]
    iss=[]
    if not (30<=len(p.t.strip())<=60): iss.append(f"title {len(p.t.strip())}ch")
    if not (110<=len(d)<=160): iss.append(f"desc {len(d)}ch")
    if len(h1)!=1: iss.append(f"{len(h1)} h1")
    if not canon: iss.append("no canonical")
    if not og: iss.append("no OG")
    if not tw: iss.append("no twitter")
    if not p.ld: iss.append("no JSON-LD")
    if noalt: iss.append(f"{len(noalt)} img no alt")
    if broken: iss.append("broken:"+",".join(sorted(set(broken))))
    if not {"header","nav","main","footer"}<=p.landmarks: iss.append("landmarks")
    rows.append((n,p.t.strip(),len(d),iss)); issues+=iss
for n,t,dl,iss in rows: print(f"{n:26} | {t[:44]:44} | {'; '.join(iss) or 'OK'}")
for x in ["sitemap.xml","robots.txt","site.webmanifest","assets/og.png"]: print(x, "present" if os.path.exists("dist/"+x) else "MISSING")
print("TOTAL issues:",len(issues))
