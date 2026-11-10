import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    for vp,n in [({"width":1440,"height":900},"d"),({"width":390,"height":844},"m")]:
      ctx=await b.new_context(viewport=vp,device_scale_factor=1); await ctx.route("**/*",route); pg=await ctx.new_page()
      await pg.goto("file:///home/claude/site/dist/index.html"); await pg.wait_for_timeout(1500)
      el=await pg.query_selector('.clients'); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(300); await el.screenshot(path=OUT+f"cl-{n}.png")
      await ctx.close()
    await b.close()
asyncio.run(main())
