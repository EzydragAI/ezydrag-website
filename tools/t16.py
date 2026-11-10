import asyncio
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    pg=await b.new_page(viewport={"width":1440,"height":900}); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.route("https://**",lambda r:r.abort())
    await pg.goto("file:///home/claude/site/ezydrag-site.html"); await pg.wait_for_timeout(3000)
    await pg.screenshot(path=OUT+"single-home.png"); print(await pg.title())
    f=pg.frame_locator("#site")
    await f.locator("nav a[href='pricing.html']").first.click(); await pg.wait_for_timeout(2000)
    print(await pg.title(), pg.url[-30:])
    await f.locator("a[href='about.html']").first.click(); await pg.wait_for_timeout(2000)
    await pg.screenshot(path=OUT+"single-about.png"); print(await pg.title())
    await pg.go_back(); await pg.wait_for_timeout(1500); print("back:",await pg.title())
    fr=pg.frames[1]; print("frame errs?", await fr.evaluate("typeof gsap"))
    print(errs); await b.close()
asyncio.run(main())
