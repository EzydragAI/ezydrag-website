import asyncio
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
G="/home/claude/site/tools/node_modules/gsap/dist/"
async def route(r):
  u=r.request.url
  if "gsap.min.js" in u: await r.fulfill(path=G+"gsap.min.js",content_type="application/javascript")
  elif "ScrollTrigger.min.js" in u: await r.fulfill(path=G+"ScrollTrigger.min.js",content_type="application/javascript")
  elif u.startswith("http"): await r.abort()
  else: await r.continue_()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",route)
    pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/index.html")
    for t,n in [(2300,"a"),(3600,"b"),(5600,"c"),(9500,"d")]:
      await pg.wait_for_timeout(t-(0 if n=="a" else [0,2300,3600,5600][["a","b","c","d"].index(n)]))
      await pg.screenshot(path=OUT+f"seq-{n}.png")
    # scroll whole page to trigger reveals, then full shot
    for y in range(0,8000,500): await pg.mouse.wheel(0,500); await pg.wait_for_timeout(120)
    await pg.wait_for_timeout(800); await pg.screenshot(path=OUT+"v4-home.png",full_page=True)
    await pg.goto("file:///home/claude/site/dist/about.html"); await pg.wait_for_timeout(2600)
    for y in range(0,5000,500): await pg.mouse.wheel(0,500); await pg.wait_for_timeout(100)
    await pg.wait_for_timeout(600); await pg.screenshot(path=OUT+"v4-about.png",full_page=True)
    await pg.goto("file:///home/claude/site/dist/academy.html#demo"); await pg.wait_for_timeout(2500)
    await pg.click("[data-demo]"); await pg.wait_for_timeout(2600)
    await (await pg.query_selector("[data-sim]")).screenshot(path=OUT+"sim-demo-mid.png")
    await pg.wait_for_timeout(5500)
    await (await pg.query_selector("[data-sim]")).screenshot(path=OUT+"sim-demo-end.png")
    print(errs); await b.close()
asyncio.run(main())
