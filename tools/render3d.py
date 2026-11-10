import asyncio,sys
from playwright.async_api import async_playwright
OUT="/home/claude/site/tools/renders/"
import os; os.makedirs(OUT,exist_ok=True)
async def main(names):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=await (await b.new_context(viewport={"width":1000,"height":800})).new_page(); errs=[]
    pg.on("console",lambda m:errs.append(m.text)); pg.on("pageerror",lambda e:errs.append(str(e)))
    for n in names:
      await pg.goto(f"http://localhost:8765/render3d.html?s={n}"); 
      try: await pg.wait_for_function("window.done===true",timeout=60000)
      except Exception as e: print(n,"timeout",errs[:3]); continue
      await pg.locator("canvas").screenshot(path=OUT+n+".png",omit_background=True); print("ok",n,errs[:2]); errs.clear()
    await b.close()
asyncio.run(main(sys.argv[1].split(",")))
