import asyncio
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    pg=await (await b.new_context(viewport={"width":1280,"height":900},reduced_motion="reduce")).new_page()
    await pg.goto("file:///home/claude/site/dist/about.html"); await pg.wait_for_load_state("networkidle"); await pg.evaluate("document.querySelector('#team').scrollIntoView()"); await pg.wait_for_timeout(1500)
    t=await pg.query_selector("#team"); await t.screenshot(path=OUT+"team2.png")
    await pg.click(".member"); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT+"dlg.png")
    await b.close()
asyncio.run(main())
