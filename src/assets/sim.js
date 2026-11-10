/* ---------- Ezydrag Academy: app simulations (copy, paste, type, Enter) ---------- */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const ico=n=>`<svg class="i" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
const mac=/Mac|iPhone|iPad/.test(navigator.platform||"");const MOD=mac?"⌘":"Ctrl ";
const wait=ms=>new Promise(r=>setTimeout(r,reduce?Math.min(ms,60):ms));
const EMAIL="priya.sharma@acme.com";
const bar=(name,icon)=>`<div class="app-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="ab-ico">${ico(icon)}</span>${name}</div>`;

const L=[
 {id:"consent",t:"Withdraw consent",min:2,steps:[["copy","Copy the email",MOD+"C"],["paste","Paste it",MOD+"V"],["type","Type a reason","Aa"],["enter","Submit","⏎"]],
  html:()=>`<div class="apps">
   <section class="app" aria-label="Ezymail inbox">${bar("Ezymail — Inbox","mail")}<div class="app-body">
    <div class="mail-from"><span class="av" aria-hidden="true">P</span><div><b>Priya Sharma</b><div class="mini">Please delete my data</div></div></div>
    <p>Hi, please withdraw my consent and remove my data.</p>
    <div class="row2"><span class="copyable" tabindex="0" data-email aria-label="Email address ${EMAIL}. Press ${MOD}C to copy">${EMAIL}</span><button class="btn btn-ghost btn-sm" data-copybtn aria-label="Copy email address">${ico("copy")}</button></div>
   </div></section>
   <section class="app" aria-label="Consent Manager">${bar("Consent Manager","shield")}<form class="app-body" data-form novalidate>
    <label class="field" for="s-email">Customer email<input class="fld" id="s-email" autocomplete="off" placeholder="Paste here"></label>
    <label class="field" for="s-reason">Reason<input class="fld" id="s-reason" autocomplete="off" placeholder="e.g. Customer request"></label>
    <p class="mini">Press Enter to submit.</p><div class="result" data-result aria-live="polite"></div>
   </form></section></div>`,
  demo:[["copy","[data-email]"],["paste","#s-email"],["type","#s-reason","Customer request"],["enter","#s-reason"]]},
 {id:"find",t:"Find someone's data",min:2,steps:[["type","Type the name","Aa"],["enter","Search","⏎"],["click","Export the map","Click"]],
  html:()=>`<div class="apps one"><section class="app" aria-label="Ezydrag Graph search">${bar("Ezydrag Graph — Search","graph")}<form class="app-body" data-form novalidate>
    <label class="field" for="s-q">Search people<input class="fld" id="s-q" autocomplete="off" placeholder="Try: Priya Sharma"></label>
    <div data-out aria-live="polite"><p class="mini">Results show every system that holds this person's data.</p></div></form></section></div>`,
  demo:[["type","#s-q","Priya Sharma"],["enter","#s-q"],["click","[data-export]"]]},
 {id:"spot",t:"Spot personal data",min:2,fail:true,steps:[["pick","Select 3 personal-data columns","Click ×3"],["enter","Submit","⏎"]],
  html:()=>{const cols=["Name","Email","Company","Revenue","Phone","Country"],rows=[["Priya S.","priya@acme.com","Acme","₹42L","+91 98•••","IN"],["Tom R.","tom@globex.io","Globex","$1.2M","+1 415•••","US"],["Ana L.","ana@north.eu","Northwind","€800K","+49 30•••","DE"]];
   return `<div class="apps one"><section class="app" aria-label="Sheets">${bar("Sheets — events_2025.csv","report")}<div class="app-body" style="overflow-x:auto">
    <table class="sheet"><caption class="sr">Event list. Select column headers that contain personal data.</caption><thead><tr><th class="rowhead" scope="col"></th>${cols.map(c=>`<th scope="col"><button data-col="${c}" aria-pressed="false">${c}</button></th>`).join("")}</tr></thead>
    <tbody>${rows.map((r,i)=>`<tr><td class="rowhead">${i+1}</td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>
    <div class="row2"><button class="btn btn-ink btn-sm" data-submit type="button">Submit ⏎</button><span class="mini" data-count>0/3 selected</span></div></div></section></div>`},
  demo:[["click","[data-col=Name]"],["click","[data-col=Email]"],["click","[data-col=Phone]"],["enter","[data-submit]"]]},
 {id:"cert",t:"Certificate",lock:true}];

$$("[data-sim]").forEach(root=>{
 const nav=$(".sim-side",root),pane=$(".pane",root);let cur=0,step=0,clip="",demoing=false,failed=false;const done=new Set();const content=L.filter(l=>!l.lock).length;
 function side(){nav.innerHTML=L.map((l,i)=>{const locked=l.lock&&done.size<content;return `<button aria-current="${i===cur}" class="${done.has(i)?"done":""} ${locked?"locked":""}"><span class="ck">${done.has(i)?ico("tick"):locked?ico("lock"):""}</span>${l.t}</button>`}).join("")+`<p class="note" style="margin-top:auto;padding:8px">${done.size}/${content} complete</p>`;
  $$("button",nav).forEach((b,i)=>b.addEventListener("click",()=>{if(demoing)return;cur=i;side();open()}))}
 const fb=(t,k="")=>{const f=$("[data-fb]",pane);if(f){f.className="sim-fb "+k;f.innerHTML=t}};
 function pills(){const l=L[cur];$$(".sim-tasks li",pane).forEach((li,i)=>{li.className=i<step?"ok":i===step?"now":"";li.querySelector(".st").innerHTML=i<step?ico("tick"):String(i+1)})}
 function next(k){const l=L[cur];if(!l.steps[step]||l.steps[step][0]!==k)return false;step++;pills();
  if(step>=l.steps.length){if(!demoing){done.add(cur);side()}fb(`${ico("tick")} Done. ${done.size<content?"Pick the next lesson.":"Certificate unlocked."}`,"good")}else fb(`Next: ${l.steps[step][1]} <kbd>${l.steps[step][2]}</kbd>`);return true}
 function wrong(t){fb(`${ico("alert")} ${t}`,"bad")}
 function loader(){pane.setAttribute("aria-busy","true");pane.innerHTML=`<div class="state" role="status">${(window.ezyLoader||(()=>""))()}<span class="muted">Starting app…</span><div style="width:100%;max-width:380px;display:flex;flex-direction:column;gap:10px"><div class="skeleton" style="width:55%"></div><div class="skeleton"></div><div class="skeleton" style="width:80%"></div></div></div>`}
 function open(){const l=L[cur];step=0;clip="";loader();setTimeout(()=>{pane.removeAttribute("aria-busy");
   if(l.lock){const ok=done.size>=content;pane.innerHTML=`<div class="state">${ok?ico("cap"):ico("lock")}<h3>${ok?"Certificate unlocked":"Certificate locked"}</h3><p class="muted">${ok?"Your completion is recorded for audits.":`Finish all ${content} simulations first.`}</p></div>`;$(".state .i",pane).style.cssText="width:55px;height:55px;color:var(--o-text)";return}
   if(l.fail&&!failed){failed=true;pane.innerHTML=`<div class="state" role="alert"><span class="ico" style="width:55px;height:55px">${ico("alert")}</span><h3>The app didn't start</h3><p class="muted">Sheets took too long to respond. Your progress is saved.</p><button class="btn btn-ink" data-retry>${ico("refresh")}Try again</button></div>`;$("[data-retry]",pane).addEventListener("click",open);return}
   pane.innerHTML=`<div class="sim-head"><div><span class="eyebrow">Simulation · ${l.min} min</span><h3 style="font-size:var(--t2);margin-top:8px">${l.t}</h3></div><div class="ctrls" style="flex:none"><button class="btn btn-ghost btn-sm" data-demo>${ico("play")}Watch demo</button><button class="btn btn-ghost btn-sm" data-reset>${ico("refresh")}Reset</button></div></div>
    <ol class="sim-tasks" aria-label="Steps">${l.steps.map((s,i)=>`<li><span class="st">${i+1}</span>${s[1]} <kbd>${s[2]}</kbd></li>`).join("")}</ol>
    ${l.html()}<p class="sim-fb" data-fb role="status"></p><div class="ghost" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#2b2e3c" stroke="#fff" stroke-width="1.5"/></svg><span class="click"></span></div><div class="keycap" aria-hidden="true"></div>`;
   pills();fb(`Start: ${l.steps[0][1]} <kbd>${l.steps[0][2]}</kbd>`);wire(l);
   $("[data-demo]",pane).addEventListener("click",()=>demo(l));$("[data-reset]",pane).addEventListener("click",open)},reduce?60:750)}

 /* actions shared by the learner and the demo */
 const A={
  copy(){clip=EMAIL;const e=$("[data-email]",pane);e&&e.classList.add("sel");try{navigator.clipboard&&navigator.clipboard.writeText(EMAIL).catch(()=>{})}catch(x){}if(!next("copy"))wrong("Copy comes first. Select the email and press "+MOD+"C.")},
  paste(inp,text){const v=(text||clip||"").trim();if(!v){wrong("Nothing copied yet. Copy the email first.");return}inp.value=v;if(L[cur].steps[step][0]!=="paste"){wrong("Do the steps in order.");return}v===EMAIL?next("paste"):wrong("That isn't the customer's email.")},
 };
 function wire(l){const form=$("[data-form]",pane);form&&form.addEventListener("submit",e=>e.preventDefault());
  if(l.id==="consent"){const em=$("[data-email]",pane),ie=$("#s-email",pane),ir=$("#s-reason",pane);
   $(".app",pane).addEventListener("copy",e=>{const s=String(getSelection());if(s.includes("@")||document.activeElement===em){e.clipboardData&&e.clipboardData.setData("text/plain",EMAIL);e.preventDefault();A.copy()}});
   em.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="c"){e.preventDefault();A.copy()}});
   $("[data-copybtn]",pane).addEventListener("click",A.copy);
   ie.addEventListener("paste",e=>{e.preventDefault();A.paste(ie,e.clipboardData&&e.clipboardData.getData("text"))});
   ie.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="v"&&!navigator.clipboard){e.preventDefault();A.paste(ie)}});
   ie.addEventListener("input",()=>{if(L[cur].steps[step]&&L[cur].steps[step][0]==="paste"&&ie.value.trim()===EMAIL)next("paste")});
   ir.addEventListener("input",()=>{if(ir.value.trim().length>=3&&L[cur].steps[step]&&L[cur].steps[step][0]==="type")next("type")});
   const enter=async e=>{if(e.key!=="Enter")return;e.preventDefault();if(L[cur].steps[step]&&L[cur].steps[step][0]==="enter"){const r=$("[data-result]",pane);next("enter");for(const s of ["Salesforce","Marketo","Google Analytics","events.csv"]){r.insertAdjacentHTML("beforeend",`<div>${ico("tick")}Consent withdrawn in ${s}</div>`);await wait(320)}}else if(step<3)wrong("Fill both fields first.")};
   ie.addEventListener("keydown",enter);ir.addEventListener("keydown",enter)}
  if(l.id==="find"){const q=$("#s-q",pane),out=$("[data-out]",pane);
   q.addEventListener("input",()=>{if(L[cur].steps[step]&&L[cur].steps[step][0]==="type"&&/priya/i.test(q.value))next("type")});
   q.addEventListener("keydown",async e=>{if(e.key!=="Enter")return;e.preventDefault();if(!(L[cur].steps[step]&&L[cur].steps[step][0]==="enter")){wrong(step===0?"Type a name first.":"Already searched.");return}
    out.innerHTML=`<p class="mini" role="status"><span class="typing" aria-hidden="true"><i></i><i></i><i></i></span> Searching 6 systems…</p>`;await wait(800);
    out.innerHTML=`<div class="result">${[["Salesforce","name · email · phone"],["Marketo","email · activity"],["Google Analytics","user ID · location"],["events.csv","name · email · no consent field"]].map(([s,f])=>`<div>${ico("pin")}<b>${s}</b><span class="mini">${f}</span></div>`).join("")}</div><button class="btn btn-primary btn-sm" data-export type="button" style="margin-top:8px">${ico("doc")}Export data map</button>`;
    next("enter");$("[data-export]",pane).addEventListener("click",()=>{if(next("click"))out.insertAdjacentHTML("beforeend",`<p class="mini" style="margin-top:6px">${ico("tick")} priya-sharma-datamap.pdf ready</p>`)})})}
  if(l.id==="spot"){const need=new Set(["Name","Email","Phone"]),got=new Set(),cnt=$("[data-count]",pane);
   $$("[data-col]",pane).forEach(b=>b.addEventListener("click",()=>{if(step>0)return;const c=b.dataset.col,th=b.parentElement;
    if(need.has(c)){got.add(c);th.className="pick";b.setAttribute("aria-pressed","true");cnt.textContent=`${got.size}/3 selected`;if(got.size===3)next("pick");else fb(`${ico("tick")} ${c} identifies a person. ${3-got.size} to go.`,"good")}
    else{th.className="miss";setTimeout(()=>th.className="",900);wrong(`${c} isn't personal data on its own.`)}}));
   const sub=()=>{if(step===1){next("enter")}else wrong(`Select all 3 columns first (${got.size}/3).`)};
   $("[data-submit]",pane).addEventListener("click",sub);pane.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.matches("[data-col]")===false&&e.target.closest(".app")){e.preventDefault();sub()}})}}

 /* watch demo: a ghost cursor performs each step */
 async function demo(l){if(demoing)return;demoing=true;const btn=$("[data-demo]",pane);btn.disabled=true;
  const g=$(".ghost",pane),kc=$(".keycap",pane);const pr=pane.getBoundingClientRect();g.classList.add("on");g.style.transform=`translate(${pr.width/2}px,${pr.height-60}px)`;await wait(300);
  const moveTo=async el=>{const r=el.getBoundingClientRect(),p=pane.getBoundingClientRect();g.style.transform=`translate(${r.left-p.left+Math.min(r.width/2,60)}px,${r.top-p.top+r.height/2}px)`;await wait(750)};
  const tap=async()=>{g.classList.remove("tap");void g.offsetWidth;g.classList.add("tap");await wait(250)};
  const key=async t=>{const r=g.getBoundingClientRect(),p=pane.getBoundingClientRect();kc.textContent=t;kc.style.left=(r.left-p.left+26)+"px";kc.style.top=(r.top-p.top-34)+"px";kc.classList.add("on");await wait(650);kc.classList.remove("on")};
  for(const [act,sel,text] of l.demo){if(!demoing)break;const el=$(sel,pane);if(!el)continue;await moveTo(el);
   if(act==="click"){await tap();el.click()}
   if(act==="copy"){await tap();el.classList.add("sel");await key(MOD+"C");A.copy()}
   if(act==="paste"){await tap();el.focus({preventScroll:true});el.classList.add("ghosting");await key(MOD+"V");A.paste(el,EMAIL);el.classList.remove("ghosting")}
   if(act==="type"){await tap();el.focus({preventScroll:true});el.classList.add("ghosting");for(const ch of text){el.value+=ch;el.dispatchEvent(new Event("input"));await wait(55)}el.classList.remove("ghosting")}
   if(act==="enter"){await key("⏎ Enter");if(el.matches("button"))el.click();else el.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))}
   await wait(350)}
  await wait(900);g.classList.remove("on");demoing=false;if(btn.isConnected){btn.disabled=false}fb(`${ico("tick")} That's the flow. Press Reset and try it yourself.`,"good")}
 side();open()});
})();
