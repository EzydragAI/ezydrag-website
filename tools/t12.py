import asyncio
from playwright.async_api import async_playwright
import importlib.util,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",route)
    pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/agents.html"); await pg.wait_for_timeout(4000)
    for y in range(0,6000,500): await pg.mouse.wheel(0,500); await pg.wait_for_timeout(100)
    await pg.wait_for_timeout(800); await pg.screenshot(path=OUT+"v8-agents.png",full_page=True)
    print(errs); await b.close()
asyncio.run(main())
