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
    await pg.wait_for_timeout(1200); await pg.screenshot(path=OUT+"v6-curtain.png")
    await pg.wait_for_timeout(9000); await pg.evaluate("scrollTo(0,420)"); await pg.wait_for_timeout(900); await pg.screenshot(path=OUT+"v6-flow.png")
    await pg.evaluate("scrollTo(0,0)"); await pg.hover(".logo"); await pg.wait_for_timeout(600); await (await pg.query_selector(".site-header")).screenshot(path=OUT+"v6-navhover.png")
    cl=await pg.query_selector(".cl-wall"); await cl.scroll_into_view_if_needed(); await pg.hover(".cl"); await pg.wait_for_timeout(500); await cl.screenshot(path=OUT+"v6-clients.png")
    h=await pg.query_selector("#people"); await h.scroll_into_view_if_needed(); await pg.wait_for_timeout(1500); await pg.screenshot(path=OUT+"v6-people.png")
    await pg.goto("file:///home/claude/site/dist/brand.html"); await pg.wait_for_timeout(4200)
    for y in range(0,12000,600): await pg.mouse.wheel(0,600); await pg.wait_for_timeout(80)
    await pg.wait_for_timeout(600); await pg.screenshot(path=OUT+"v6-brand.png",full_page=True)
    m=await (await b.new_context(viewport={"width":390,"height":844})).new_page(); await m.context.route("**/*",route)
    await m.goto("file:///home/claude/site/dist/index.html"); await m.wait_for_timeout(9500); await m.evaluate("scrollTo(0,560)"); await m.wait_for_timeout(600); await m.screenshot(path=OUT+"v6-m-flow.png")
    print(errs); await b.close()
asyncio.run(main())
