import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",route); pg=await ctx.new_page()
    await pg.goto("file:///home/claude/site/dist/blog-approval-is-not-a-button.html"); await pg.wait_for_timeout(1000)
    for i in range(6):
      await pg.wait_for_timeout(900)
      m=await pg.query_selector('.meme-fig'); await m.scroll_into_view_if_needed(); await pg.wait_for_timeout(300)
      await m.screenshot(path=OUT+f"mb{i}.png") if i in (0,4) else None
    el=await pg.query_selector('.teardown-list'); await el.scroll_into_view_if_needed(); await el.screenshot(path=OUT+"td.png")
    await pg.goto("file:///home/claude/site/dist/agents.html"); await pg.wait_for_timeout(2000)
    el=await pg.query_selector('.pf-grid'); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(5000); await el.screenshot(path=OUT+"pf.png")
    await b.close()
asyncio.run(main())
