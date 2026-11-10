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
async def shot_el(pg,sel,name):
  el=await pg.query_selector(sel); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(1600); await el.screenshot(path=OUT+name)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",route)
    pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/index.html"); last=0
    for t in [500,1300,2100,2700,3400,6000]:
      await pg.wait_for_timeout(t-last); last=t; await pg.screenshot(path=OUT+f"c{t}.png")
    await shot_el(pg,".statement","s-statement.png")
    await shot_el(pg,"[data-handoff]","s-handoff.png")
    await shot_el(pg,".promises","s-promises.png")
    await shot_el(pg,"#subscribe","s-nl.png")
    await pg.click("a[href='about.html'].menu-btn"); await pg.wait_for_timeout(150); await pg.screenshot(path=OUT+"wipe.png"); await pg.wait_for_timeout(4200)
    t=await pg.query_selector("#team"); await t.scroll_into_view_if_needed(); await pg.wait_for_timeout(1200); await t.screenshot(path=OUT+"s-team.png")
    await pg.goto("file:///home/claude/site/dist/report.html"); await pg.wait_for_timeout(4200); await pg.evaluate("scrollTo(0,1400)"); await pg.wait_for_timeout(800); await pg.screenshot(path=OUT+"s-report.png")
    await pg.goto("file:///home/claude/site/dist/index.html#live"); await pg.wait_for_timeout(3800); await pg.evaluate("document.querySelector('#live').scrollIntoView()"); await pg.wait_for_timeout(500); await pg.screenshot(path=OUT+"s-loader.png")
    print(errs); await b.close()
asyncio.run(main())
