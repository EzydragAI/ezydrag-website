"""Renders the social share image and PNG icons from the logo primitives."""
import asyncio, sys
sys.path.insert(0, "/home/claude/site")
import art as ART
import brand as B
from build import ICONS
from playwright.async_api import async_playwright
OUT = "/home/claude/site/src/assets/"
og = f'''<html><body style="margin:0;width:1200px;height:630px;background:#fff;font-family:'Bricolage Grotesque',system-ui,sans-serif;position:relative;overflow:hidden">
<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(43,46,60,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(43,46,60,.07) 1px,transparent 1px);background-size:56px 56px"></div>
<div style="position:absolute;left:-120px;bottom:-260px;width:900px;height:520px;background:radial-gradient(ellipse,rgba(255,144,84,.35),transparent 65%)"></div>
<div style="position:absolute;left:84px;top:96px;width:640px">
<div style="font:600 22px ui-monospace,monospace;letter-spacing:.1em;color:#b8460f;text-transform:uppercase">Ezydrag · AI agent studio</div>
<div style="font-weight:800;font-size:64px;line-height:1.02;letter-spacing:-2.4px;color:#2b2e3c;margin-top:22px">AI agents for your revenue team. <span style="color:#b8460f">Built and run by us.</span></div>
<div style="font-size:28px;color:#5b5f71;margin-top:26px">You approve every important step.</div></div>
<div style="position:absolute;right:70px;top:120px">{ART.art("agents",400,icons=ICONS)}</div>
<div style="position:absolute;left:84px;bottom:56px">{B.wordmark(60)}</div></body></html>'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        pg = await b.new_page(viewport={"width": 1200, "height": 630}); await pg.set_content(og); await pg.wait_for_timeout(300)
        await pg.screenshot(path=OUT + "og.png")
        for size, name in [(512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png")]:
            await pg.set_viewport_size({"width": size, "height": size})
            svg = '<div style="width:%dpx;height:%dpx;display:grid;place-items:center;background:#fff">%s</div>' % (size, size, B.mark(int(size*.8), small=size < 64))
            await pg.set_content('<body style="margin:0;background:#fff">' + svg + '</body>')
            await pg.screenshot(path=OUT + name)
        await b.close()
asyncio.run(main())
