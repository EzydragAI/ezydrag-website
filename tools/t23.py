import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"]); errs=[]
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",route); pg=await ctx.new_page(); pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/index.html")
    for t in (250,500,550,500,1200):
      await pg.wait_for_timeout(t); await pg.screenshot(path=OUT+f"raise-{t}-{len(errs)}.png")
    import glob
    await pg.goto("file:///home/claude/site/dist/index.html"); await pg.wait_for_timeout(300)
    print("second load raise present:", await pg.evaluate("!!document.getElementById('raise')"))
    el=await pg.query_selector('#stack'); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(500); await el.screenshot(path=OUT+"stack.png")
    await pg.goto("file:///home/claude/site/dist/blog.html"); await pg.wait_for_timeout(800)
    el=await pg.query_selector('.bl-feat'); await el.screenshot(path=OUT+"feat.png")
    await pg.goto("file:///home/claude/site/dist/faq.html"); await pg.wait_for_timeout(800)
    await pg.click("details:has-text('Is our data ready')"); await pg.wait_for_timeout(300)
    el=await pg.query_selector("details:has-text('Is our data ready')"); await el.screenshot(path=OUT+"faq1.png")
    print(errs); await b.close()
asyncio.run(main())
