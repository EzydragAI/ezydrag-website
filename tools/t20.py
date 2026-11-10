import asyncio,sys
sys.path.insert(0,"/home/claude/site/tools")
from t11 import route,OUT
from playwright.async_api import async_playwright
P=["blog","blog-labor-illusion-ai-agents","blog-n8n-assistant-asks-first","blog-mcp-goes-stateless","blog-break-your-agent-on-purpose","blog-your-ai-bill-gets-a-meter","blog-agent-equals-model-plus-harness","blog-workflow-or-agent","blog-every-crm-has-an-sdr-agent","blog-approval-is-not-a-button"]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"]); errs=[]
    for vp,n in [({"width":1440,"height":900},"d"),({"width":390,"height":844},"m")]:
      ctx=await b.new_context(viewport=vp); await ctx.route("**/*",route); pg=await ctx.new_page(); pg.on("pageerror",lambda e:errs.append(str(e)))
      for page in (P if n=="d" else P[:4]):
        await pg.goto(f"file:///home/claude/site/dist/{page}.html"); await pg.wait_for_timeout(700)
        await pg.evaluate("document.querySelectorAll('.rv').forEach(e=>{e.style.opacity=1;e.style.transform='none'})")
        await pg.wait_for_timeout(2600)
        await pg.screenshot(path=OUT+f"b15-{n}-{page[5:25] or 'index'}.png",full_page=True)
      await ctx.close()
    print(errs); await b.close()
asyncio.run(main())
