import asyncio,sys
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def main(pages,w):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    pg=await (await b.new_context(viewport={"width":w,"height":900},reduced_motion="reduce")).new_page()
    for n in pages:
      await pg.goto("file:///home/claude/site/dist/"+n); await pg.wait_for_timeout(1500)
      await pg.screenshot(path=OUT+f"v3-{n[:-5]}-{w}.png",full_page=True)
    await b.close()
asyncio.run(main(sys.argv[1].split(","),int(sys.argv[2])))
