import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",route)
    pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    for page in ["agents","product","pricing","customers","trends","about","faq","demo"]:
      await pg.goto(f"file:///home/claude/site/dist/{page}.html"); await pg.wait_for_timeout(900)
      if page=="agents":
        await pg.evaluate("document.querySelector('#portfolio').scrollIntoView()"); await pg.wait_for_timeout(700)
        await pg.hover(".ag-row >> nth=0"); await pg.wait_for_timeout(700); await pg.screenshot(path=OUT+"v9-agents-hover.png")
      await pg.evaluate("scrollTo(0,0)"); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT+f"v9-{page}.png")
    print(errs); await b.close()
asyncio.run(main())
