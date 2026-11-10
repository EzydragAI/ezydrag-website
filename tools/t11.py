import asyncio
from playwright.async_api import async_playwright
G="/home/claude/site/tools/node_modules/gsap/dist/"
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def route(r):
  u=r.request.url
  if "gsap.min.js" in u: await r.fulfill(path=G+"gsap.min.js",content_type="application/javascript")
  elif "ScrollTrigger" in u: await r.fulfill(path=G+"ScrollTrigger.min.js",content_type="application/javascript")
  elif u.startswith("http"): await r.abort()
  else: await r.continue_()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",route)
    pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/index.html")
    await pg.wait_for_timeout(5200); await pg.screenshot(path=OUT+"v8-mid.png")
    await pg.wait_for_timeout(6500); await pg.screenshot(path=OUT+"v8-hero.png")
    for y in range(0,9000,500): await pg.mouse.wheel(0,500); await pg.wait_for_timeout(120)
    await pg.wait_for_timeout(800); await pg.screenshot(path=OUT+"v8-full.png",full_page=True)
    m=await (await b.new_context(viewport={"width":390,"height":844})).new_page(); await m.context.route("**/*",route)
    m.on("pageerror",lambda e:errs.append(str(e)))
    await m.goto("file:///home/claude/site/dist/index.html"); await m.wait_for_timeout(11500); await m.evaluate("scrollTo(0,520)"); await m.wait_for_timeout(500); await m.screenshot(path=OUT+"v8-m.png")
    print(errs); await b.close()
if __name__=="__main__": asyncio.run(main())
