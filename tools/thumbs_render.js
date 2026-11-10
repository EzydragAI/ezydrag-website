// Render tools/thumbs/*.html to src/assets/blog/<slug>.png (1200x675). Optional: FONT_CSS env points to an @font-face stylesheet for Inter.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const dir=path.join(__dirname,'thumbs'),out=path.join(__dirname,'..','src','assets','blog');fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:675},deviceScaleFactor:1});
 for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.html'))){await p.goto('file://'+path.join(dir,f));
  if(process.env.FONT_CSS)await p.addStyleTag({content:process.env.FONT_CSS});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  await p.screenshot({path:path.join(out,f.replace('.html','.png'))});console.log('rendered',f)}
 await b.close()})();
