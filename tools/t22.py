import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900},device_scale_factor=2); await ctx.route("**/*",route); pg=await ctx.new_page()
    await pg.goto("file:///home/claude/site/dist/index.html"); await pg.wait_for_timeout(800)
    el=await pg.query_selector('#flagship .journey-wrap'); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(3600)
    await el.screenshot(path=OUT+"jr.png"); await b.close()
asyncio.run(main())
