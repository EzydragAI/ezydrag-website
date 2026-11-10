import asyncio,sys,json
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
posted=[]
async def r2(r):
  if "lead.test" in r.request.url: posted.append(r.request.post_data); await r.fulfill(status=200,body="ok"); return
  await route(r)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    ctx=await b.new_context(viewport={"width":1440,"height":900}); await ctx.route("**/*",r2)
    await ctx.add_init_script("""Object.defineProperty(window,'EZY_CONFIG',{configurable:true,set(v){v.nudgeAfterMs=2000;v.leadUrl='https://lead.test/x';Object.defineProperty(window,'EZY_CONFIG',{value:v,writable:true})}})""")
    pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto("file:///home/claude/site/dist/index.html"); await pg.evaluate("scrollTo(0,1500)"); await pg.wait_for_timeout(1200)
    print("bar on:", await pg.evaluate("document.querySelector('#qd').classList.contains('on')"))
    await pg.wait_for_timeout(2500)
    print("nudge open:", await pg.evaluate("!document.querySelector('#nudge').hidden"), "bar on:", await pg.evaluate("document.querySelector('#qd').classList.contains('on')"))
    await pg.fill("#nudge-e","bad"); await pg.click("#nudge button[type=submit]"); await pg.wait_for_timeout(200)
    print("err:", await pg.inner_text("#nudge [data-lead-out]"))
    await pg.fill("#nudge-e","jo@acme.com"); await pg.click("#nudge button[type=submit]"); await pg.wait_for_timeout(800)
    print("posted:", posted, "nudge hidden:", await pg.evaluate("document.querySelector('#nudge').hidden"))
    await pg.reload(); await pg.wait_for_timeout(3500); print("after reload nudge hidden:", await pg.evaluate("document.querySelector('#nudge').hidden"))
    print(errs); await b.close()
asyncio.run(main())
