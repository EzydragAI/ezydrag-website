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
    ctx=await b.new_context(viewport={"width":1280,"height":900}); await ctx.route("**/*",route)
    pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/academy.html#demo"); await pg.wait_for_timeout(2500)
    await pg.click("[data-copybtn]"); await pg.focus("#s-email")
    await pg.evaluate("""()=>{const i=document.querySelector('#s-email');const dt=new DataTransfer();dt.setData('text/plain','priya.sharma@acme.com');i.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}))}""")
    await pg.fill("#s-reason","Customer request"); await pg.press("#s-reason","Enter"); await pg.wait_for_timeout(1600)
    print("consent:", await pg.inner_text("[data-fb]"))
    await pg.click(".sim aside button:nth-of-type(2)"); await pg.wait_for_timeout(1000)
    await pg.fill("#s-q","Priya Sharma"); await pg.press("#s-q","Enter"); await pg.wait_for_timeout(1100); await pg.click("[data-export]")
    print("find:", await pg.inner_text("[data-fb]"))
    await pg.click(".sim aside button:nth-of-type(3)"); await pg.wait_for_timeout(1000)
    print("spot first:", (await pg.inner_text(".pane"))[:60].replace("\n"," "))
    await pg.click("[data-retry]"); await pg.wait_for_timeout(1000)
    await pg.click("[data-col=Revenue]"); print("wrong:", await pg.inner_text("[data-fb]"))
    for c in ["Name","Email","Phone"]: await pg.click(f"[data-col={c}]")
    await pg.click("[data-submit]"); print("spot:", await pg.inner_text("[data-fb]"))
    await pg.click(".sim aside button:nth-of-type(4)"); await pg.wait_for_timeout(1000)
    print("cert:", (await pg.inner_text(".pane"))[:40].replace("\n"," "))
    await pg.goto("file:///home/claude/site/dist/index.html"); await pg.wait_for_timeout(3200); await pg.screenshot(path=OUT+"v5-hero.png")
    print(errs); await b.close()
asyncio.run(main())
