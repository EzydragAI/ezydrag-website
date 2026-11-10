import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    errs=[]
    for name,vp,mob in [("d",{"width":1440,"height":900},False),("m",{"width":390,"height":844},True)]:
      ctx=await b.new_context(viewport=vp,is_mobile=mob,has_touch=mob,device_scale_factor=1); await ctx.route("**/*",route)
      await ctx.add_init_script("window.__fast=1")
      pg=await ctx.new_page(); pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
      await pg.goto("file:///home/claude/site/dist/index.html")
      await pg.wait_for_timeout(1500); await pg.screenshot(path=OUT+f"v9-{name}-1500ms.png")
      await pg.evaluate("scrollTo(0,1400)"); await pg.wait_for_timeout(900); await pg.screenshot(path=OUT+f"v9-{name}-bar.png")
      await pg.evaluate("document.querySelector('#nudge-pill')||0; (function(){var n=document.getElementById('nudge');n.hidden=false;n.classList.add('on')})()")
      await pg.wait_for_timeout(500); await pg.screenshot(path=OUT+f"v9-{name}-nudge.png")
      await ctx.close()
    print(errs); await b.close()
asyncio.run(main())
