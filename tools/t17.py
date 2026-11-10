import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    errs=[]
    for name,vp in [("d",{"width":1440,"height":900}),("m",{"width":390,"height":844})]:
      ctx=await b.new_context(viewport=vp); await ctx.route("**/*",route); pg=await ctx.new_page()
      pg.on("pageerror",lambda e:errs.append(str(e)))
      for page in ["blog","blog-workflow-or-agent"]:
        await pg.goto(f"file:///home/claude/site/dist/{page}.html"); await pg.wait_for_timeout(800)
        for y in range(0,9000,600): await pg.mouse.wheel(0,600); await pg.wait_for_timeout(60)
        await pg.wait_for_timeout(500); await pg.screenshot(path=OUT+f"blog-{name}-{page[:12]}.png",full_page=True)
      await ctx.close()
    print(errs); await b.close()
asyncio.run(main())
