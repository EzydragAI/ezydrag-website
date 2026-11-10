import asyncio
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    pg=await (await b.new_context(viewport={"width":1280,"height":900})).new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    for k in range(3):
      await pg.goto("file:///home/claude/site/dist/context.html#pipeline"); await pg.wait_for_timeout(9000)
      el=await pg.query_selector("[data-live]"); await el.screenshot(path=OUT+f"term{k}.png")
    await pg.goto("file:///home/claude/site/dist/academy.html#demo"); await pg.wait_for_timeout(2500)
    await pg.click(".lms aside button:nth-of-type(3)"); await pg.wait_for_timeout(300)
    await (await pg.query_selector(".lms")).screenshot(path=OUT+"lms-load.png")
    await pg.wait_for_timeout(1200); await (await pg.query_selector(".lms")).screenshot(path=OUT+"lms-err.png")
    await pg.goto("file:///home/claude/site/dist/contact.html"); await pg.wait_for_timeout(2200)
    await pg.click("[data-next]"); await pg.click("[data-next]"); await pg.wait_for_timeout(300)
    await (await pg.query_selector("[data-quote]")).screenshot(path=OUT+"form-err.png")
    print(errs); await b.close()
asyncio.run(main())
