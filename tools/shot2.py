import asyncio,sys
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); pg=await ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/index.html"); await pg.wait_for_timeout(700)
    await pg.screenshot(path=OUT+"v2-curtain.png")
    await pg.wait_for_timeout(9000)
    await pg.screenshot(path=OUT+"v2-home-top.png")
    await pg.screenshot(path=OUT+"v2-home-full.png",full_page=True)
    for n in ["context.html","agents.html","academy.html","about.html"]:
      await pg.goto("file:///home/claude/site/dist/"+n); await pg.wait_for_timeout(2500)
      await pg.screenshot(path=OUT+"v2-"+n.replace(".html","")+".png",full_page=True)
    m=await (await b.new_context(viewport={"width":390,"height":844})).new_page()
    await m.goto("file:///home/claude/site/dist/index.html"); await m.wait_for_timeout(8000); await m.screenshot(path=OUT+"v2-m-home.png",full_page=False)
    await m.goto("file:///home/claude/site/dist/academy.html#demo"); await m.wait_for_timeout(2500); await m.screenshot(path=OUT+"v2-m-academy.png")
    print(errs); await b.close()
asyncio.run(main())
