import sys, asyncio
from playwright.async_api import async_playwright
OUT="/tmp/claude-0/-home-claude/b44c02d6-312f-5e2b-ba20-015b8cef5a3e/scratchpad/"
async def main(pages, w, full, dark):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":w,"height":900}, color_scheme="dark" if dark else "light")
        pg = await ctx.new_page(); errs=[]
        pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        for name in pages:
            await pg.goto(f"file:///home/claude/site/dist/{name}"); await pg.wait_for_timeout(900)
            ov = await pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            f=OUT+f"{name.replace('.html','')}-{w}{'-d' if dark else ''}.png"
            await pg.screenshot(path=f, full_page=full)
            print(name, "overflow:", ov, "errors:", errs[:5]); errs.clear()
        await b.close()
a=sys.argv; asyncio.run(main(a[1].split(","), int(a[2]), a[3]=="full", len(a)>4))
