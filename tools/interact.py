import asyncio
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    pg=await (await b.new_context(viewport={"width":390,"height":844})).new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/agents.html#qbr"); await pg.wait_for_timeout(800)
    await pg.screenshot(path=OUT+"agents-m.png")
    await pg.goto("file:///home/claude/site/dist/token-optimization.html#faq-bot"); await pg.wait_for_timeout(500)
    await pg.fill("[data-bot] input","what does a project cost?"); await pg.press("[data-bot] input","Enter")
    await pg.fill("[data-bot] input","write a poem about llamas"); await pg.press("[data-bot] input","Enter")
    await pg.click("[data-o-run]"); await pg.wait_for_timeout(1600)
    el=await pg.query_selector("[data-bot]"); await el.screenshot(path=OUT+"bot.png")
    await pg.goto("file:///home/claude/site/dist/feedback.html"); await pg.wait_for_timeout(500)
    await pg.screenshot(path=OUT+"feedback-m.png",full_page=False)
    await pg.goto("file:///home/claude/site/dist/index.html"); await pg.click(".burger"); await pg.wait_for_timeout(300)
    await pg.screenshot(path=OUT+"drawer-m.png")
    print(errs); await b.close()
asyncio.run(main())
