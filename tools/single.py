"""Bundle the whole built site (dist/) into ONE self-contained HTML file.
Every page, script, style and image is embedded. Pages open in a full-screen frame;
internal links switch pages without leaving the file. Only Google Fonts load from the web."""
import base64, json, os, re
D = "/home/claude/site/dist"
OUT = "/home/claude/site/ezydrag-site.html"
MIME = {".css":"text/css",".js":"text/javascript",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"}
assets = {}
for root, _, fs in os.walk(os.path.join(D, "assets")):
    for f in fs:
        p = os.path.join(root, f); rel = os.path.relpath(p, D); ext = os.path.splitext(f)[1]
        if ext not in MIME or rel.startswith("assets/clients/"): continue
        b = open(p, "rb").read()
        assets[rel] = {"t": MIME[ext], "b": base64.b64encode(b).decode()} if ext in (".png", ".jpg") else {"t": MIME[ext], "s": b.decode()}
G = "/home/claude/site/tools/node_modules/gsap/dist/"
assets["gsap.min.js"] = {"t": "text/javascript", "s": open(G + "gsap.min.js").read()}
assets["ScrollTrigger.min.js"] = {"t": "text/javascript", "s": open(G + "ScrollTrigger.min.js").read()}
pages = {}
for f in sorted(os.listdir(D)):
    if not f.endswith(".html"): continue
    h = open(os.path.join(D, f)).read()
    h = h.replace("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", "gsap.min.js")
    h = h.replace("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", "ScrollTrigger.min.js")
    h = re.sub(r'<link rel="manifest"[^>]*>', "", h)
    pages[f] = h
def js(o): return json.dumps(o, separators=(",", ":")).replace("</", "<\\/")
shell = r"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ezydrag</title>
<meta name="description" content="Ezydrag Sales Nurture Agent: turn more leads into customers. Single-file build of the full website.">
<style>html,body{margin:0;height:100%;background:#fff}iframe{position:fixed;inset:0;width:100%;height:100%;border:0;display:block}</style>
</head><body>
<iframe id="site" title="Ezydrag website"></iframe>
<script>
/* Ezydrag website, single-file build. Every page and asset is embedded below, stored once. */
const A=__ASSETS__;
const P=__PAGES__;
const DATA={};
for(const [k,v] of Object.entries(A)) if(v.b) DATA[k]="data:"+v.t+";base64,"+v.b;
  else if(v.t==="image/svg+xml") DATA[k]="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(v.s);
const safe=t=>t.replace(/<\/script/gi,"<\\/script");
const NAV="<script>(function(){document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented)return;var h=a.getAttribute('href');"+
 "if(/^https?:/.test(h)){e.preventDefault();window.open(h,'_blank','noopener');return}"+
 "if(h.charAt(0)==='#'){var t=document.getElementById(h.slice(1));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}return}"+
 "var m=h.match(/^([a-z0-9-]+[.]html)([?][^#]*)?(#.*)?$/i);if(m){e.preventDefault();parent.ezyGo(m[1],m[3]||'',true)}},false)})();<\/script>";
function build(name){
  let h=P[name]||P["404.html"];
  h=h.replace(/<link rel="stylesheet" href="assets\/style\.css"[^>]*>/,()=>"<style>"+A["assets/style.css"].s+"</style>");
  h=h.replace(/<script([^>]*) src="((?:assets\/)?[\w\/.-]+\.js)"([^>]*)><\/script>/g,(m,a,path,b)=>A[path]?"<script>"+safe(A[path].s)+"<\/script>":m);
  h=h.replace(/(src|href)="(assets\/[^"]+)"/g,(m,attr,path)=>DATA[path]?attr+'="'+DATA[path]+'"':m);
  h=h.replace("<head>","<head>"+NAV);
  return h;
}
const frame=document.getElementById("site");
let pendingHash="";
window.ezyGo=function(name,hash,push){
  if(!P[name])name="404.html";
  pendingHash=hash||"";
  frame.srcdoc=build(name);
  const want="#/"+name+(hash||"");
  if(push&&location.hash!==want)history.pushState(null,"",want);
};
frame.addEventListener("load",()=>{try{const d=frame.contentDocument;document.title=d.title;
  if(pendingHash){const t=d.getElementById(pendingHash.slice(1));if(t)setTimeout(()=>t.scrollIntoView(),50)}}catch(e){}});
function fromHash(){const m=location.hash.match(/^#\/([a-z0-9-]+\.html)(#.*)?$/i);return m?[m[1],m[2]||""]:["index.html",""]}
window.addEventListener("popstate",()=>{const [n,h]=fromHash();ezyGo(n,h,false)});
{const [n,h]=fromHash();ezyGo(n,h,false)}
</script>
</body></html>"""
shell = shell.replace("__ASSETS__", js(assets)).replace("__PAGES__", js(pages))
open(OUT, "w").write(shell)
print(OUT, round(len(shell)/1e6, 2), "MB", len(pages), "pages", len(assets), "assets")
