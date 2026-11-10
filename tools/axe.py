import asyncio,sys,json
from playwright.async_api import async_playwright
AXE=open("/home/claude/site/tools/node_modules/axe-core/axe.min.js").read()
async def main(pages):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1280,"height":900},reduced_motion="reduce")
    pg=await ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    total=0
    for n in pages:
      await pg.goto(f"file:///home/claude/site/dist/{n}"); await pg.wait_for_timeout(700)
      await pg.add_script_tag(content=AXE)
      r=await pg.evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}).then(r=>r.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,t:v.nodes.slice(0,3).map(x=>x.target.join(' ')+' :: '+(x.failureSummary||'').slice(0,160))})))")
      total+=len(r); print(f"== {n}: {len(r)} violations", ("JS ERR: "+str(errs)) if errs else ""); errs.clear()
      for v in r: print("  -",v["id"],v["impact"],v["n"]); [print("      ",t) for t in v["t"]]
    print("TOTAL",total); await b.close()
asyncio.run(main(sys.argv[1].split(",")))
