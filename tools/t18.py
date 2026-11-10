import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"]); errs=[]
    for vp,n in [({"width":1440,"height":900},"d"),({"width":390,"height":844},"m")]:
      ctx=await b.new_context(viewport=vp); await ctx.route("**/*",route); pg=await ctx.new_page(); pg.on("pageerror",lambda e:errs.append(str(e)))
      await pg.goto("file:///home/claude/site/dist/trends.html#revops"); await pg.wait_for_timeout(600)
      await pg.evaluate("document.querySelectorAll('.rv').forEach(e=>{e.style.opacity=1;e.style.transform='none'});document.getElementById('revops').scrollIntoView()"); await pg.wait_for_timeout(400)
      el=await pg.query_selector('#revops'); await el.screenshot(path=OUT+f"ro-{n}.png")
      await pg.goto("file:///home/claude/site/dist/index.html"); await pg.wait_for_timeout(600)
      await pg.evaluate("document.querySelectorAll('.rv').forEach(e=>{e.style.opacity=1;e.style.transform='none'})")
      el=await pg.query_selector('#trends'); await el.screenshot(path=OUT+f"ro-home-{n}.png")
      await ctx.close()
    print(errs); await b.close()
asyncio.run(main())
