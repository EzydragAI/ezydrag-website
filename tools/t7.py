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
    last=0
    for t in [1000,2000,3000,4000,5500,8500,11000]:
      await pg.wait_for_timeout(t-last); last=t; await pg.screenshot(path=OUT+f"h{t}.png")
    st=await pg.query_selector("#story"); await st.scroll_into_view_if_needed()
    y=await pg.evaluate("document.querySelector('#story').getBoundingClientRect().top+scrollY")
    for k,dy in enumerate([200,900,1700,2400]):
      await pg.evaluate(f"scrollTo(0,{y+dy})"); await pg.wait_for_timeout(900); await pg.screenshot(path=OUT+f"story{k}.png")
    for yy in range(int(y)+2600,int(y)+9000,500): await pg.evaluate(f"scrollTo(0,{yy})"); await pg.wait_for_timeout(120)
    await pg.wait_for_timeout(500); await pg.screenshot(path=OUT+"v6-full.png",full_page=True)
    for n in ["pricing.html","customers.html","security.html"]:
      await pg.goto("file:///home/claude/site/dist/"+n); await pg.wait_for_timeout(2200)
      for yy in range(0,4000,500): await pg.mouse.wheel(0,500); await pg.wait_for_timeout(100)
      await pg.wait_for_timeout(400); await pg.screenshot(path=OUT+"v6-"+n[:-5]+".png",full_page=True)
    m=await (await b.new_context(viewport={"width":390,"height":844})).new_page(); await m.context.route("**/*",route)
    await m.goto("file:///home/claude/site/dist/index.html"); await m.wait_for_timeout(9000); await m.screenshot(path=OUT+"m-hero.png")
    y=await m.evaluate("document.querySelector('#story').getBoundingClientRect().top+scrollY")
    await m.evaluate(f"scrollTo(0,{y+1300})"); await m.wait_for_timeout(900); await m.screenshot(path=OUT+"m-story.png")
    print(errs); await b.close()
asyncio.run(main())
