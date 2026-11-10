/* Ezydrag site interactions. Each module runs only when its markup is on the page. */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt=n=>Math.round(n).toLocaleString("en-US");
const money=n=>"$"+(n>=1000?Math.round(n).toLocaleString("en-US"):n.toFixed(2));
const ico=n=>`<svg class="i" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function toast(msg){const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
$$("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
/* one loader everywhere: cloned from the master template rendered by brand.py */
const LOADER=()=>{const t=document.getElementById("tpl-loader");return t?t.innerHTML:""};window.ezyLoader=LOADER;

/* ---------- offline banner ---------- */
function net(){let b=$(".offline");if(navigator.onLine){b&&b.remove();return}if(!b){b=document.createElement("div");b.className="offline";b.setAttribute("role","status");b.innerHTML=`${ico("wifi")} You're offline. Some features may not work until you reconnect.`;document.body.appendChild(b)}}
addEventListener("online",net);addEventListener("offline",net);

/* ---------- mega menu ---------- */
const btns=$$(".menu-btn[aria-controls]");
const closeAll=except=>btns.forEach(b=>{if(b!==except){b.setAttribute("aria-expanded","false");$("#"+b.getAttribute("aria-controls")).classList.remove("open")}});
btns.forEach(b=>{const panel=$("#"+b.getAttribute("aria-controls")),li=b.parentElement;let t;
  const open=()=>{closeAll(b);b.setAttribute("aria-expanded","true");panel.classList.add("open")};
  const close=()=>{b.setAttribute("aria-expanded","false");panel.classList.remove("open")};
  b.addEventListener("click",e=>{e.stopPropagation();b.getAttribute("aria-expanded")==="true"?close():open()});
  b.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){e.preventDefault();open();const f=$("a",panel);f&&f.focus()}});
  panel.addEventListener("focusout",e=>{if(!li.contains(e.relatedTarget))close()});
  if(matchMedia("(hover:hover)").matches){li.addEventListener("mouseenter",()=>{clearTimeout(t);open()});li.addEventListener("mouseleave",()=>{t=setTimeout(close,180)})}});
document.addEventListener("click",e=>{if(!e.target.closest(".mega"))closeAll()});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const openBtn=btns.find(b=>b.getAttribute("aria-expanded")==="true");closeAll();openBtn&&openBtn.focus();
  const d=$(".drawer.open");if(d){d.classList.remove("open");$(".burger").setAttribute("aria-expanded","false");$(".burger").focus()}});
const burger=$(".burger"),drawer=$(".drawer");
if(burger&&drawer)burger.addEventListener("click",()=>{const o=drawer.classList.toggle("open");burger.setAttribute("aria-expanded",o);document.body.style.overflow=o?"hidden":""});

/* ---------- counters (final value is in the HTML; animates once on view) ---------- */
if(!reduce&&"IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,end=+el.dataset.count,suf=el.dataset.suf||"",t0=performance.now();
  const step=t=>{const p=Math.min(1,(t-t0)/1100);el.textContent=fmt(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.6});$$("[data-count]").forEach(e=>io.observe(e))}

/* ---------- copy ---------- */
$$("[data-copy]").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.copy,l=$("[data-copy-label]",b),done=()=>{toast("Copied "+v);if(l){b.classList.add("ok");l.textContent="Copied";setTimeout(()=>{b.classList.remove("ok");l.textContent="Copy"},1800)}};
  const fallback=()=>{const r=document.createRange(),a=b.parentElement.querySelector(".mc-addr");if(a){r.selectNodeContents(a);const s=getSelection();s.removeAllRanges();s.addRange(r)}try{document.execCommand("copy")?done():toast("Address selected. Press Ctrl+C")}catch(e){toast("Address selected. Press Ctrl+C")}};
  if(navigator.clipboard)navigator.clipboard.writeText(v).then(done,fallback);else fallback()}));

/* ---------- tabs [data-tabs] (ARIA tablist) ---------- */
$$("[data-tabs]").forEach(g=>{const bs=$$("[role=tab]",g);
  const sel=b=>{bs.forEach(x=>{const on=x===b;x.setAttribute("aria-selected",on);x.tabIndex=on?0:-1;const p=$("#"+x.getAttribute("aria-controls"));if(p)p.hidden=!on})};
  bs.forEach((b,i)=>{b.addEventListener("click",()=>sel(b));b.addEventListener("keydown",e=>{const d=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;if(!d)return;e.preventDefault();const n=bs[(i+d+bs.length)%bs.length];sel(n);n.focus()})})});

/* ---------- filter chips ---------- */
$$("[data-filter]").forEach(g=>{const target=$(g.dataset.filter),bs=$$("[data-f]",g),live=$("[data-filter-status]",g.parentElement);
  bs.forEach(b=>b.addEventListener("click",()=>{bs.forEach(x=>x.setAttribute("aria-pressed",x===b));const f=b.dataset.f;let n=0;
    $$("[data-cat]",target).forEach(it=>{const show=f==="all"||it.dataset.cat.split(" ").includes(f);it.hidden=!show;if(show)n++});
    $$(".agent-detail",target).forEach(d=>d.remove());$$(".agent .go",target).forEach(x=>x.setAttribute("aria-expanded","false"));if(live)live.textContent=`${n} shown`}))});

/* ---------- compare toggle ---------- */
$$("[data-compare]").forEach(box=>{const bs=$$(".toggle button",box);
  bs.forEach(b=>b.addEventListener("click",()=>{bs.forEach(x=>x.setAttribute("aria-pressed",x===b));$$("[data-mode]",box).forEach(m=>m.hidden=m.dataset.mode!==b.dataset.set)}))});

/* ---------- live pipeline terminal ---------- */
const SKINS=[
 {k:"mac",title:"ops@ezydrag — zsh — 120×32",p:'<span class="c-p">ops@ezydrag</span> <span class="c-dim">~/pipelines</span> % ',spin:"⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"},
 {k:"pwsh",title:"Windows PowerShell",p:'<span class="c-p">PS C:\\ezydrag\\pipelines&gt;</span> ',spin:"|/-\\"},
 {k:"ubuntu",title:"ezy@pipeline-01: ~/runs",p:'<span class="c-p">ezy@pipeline-01</span>:<span class="c-key">~/runs</span>$ ',spin:"⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"},
 {k:"vscode",title:"TERMINAL",p:'<span class="c-p">➜</span>  <span class="c-key">ezydrag-agents</span> <span class="c-dim">git:(main)</span> ',spin:"◐◓◑◒"},
 {k:"warp",title:"Warp — ezydrag",p:'<span class="c-dim">~/ezydrag</span> <span class="c-p">❯</span> ',spin:"⣾⣽⣻⢿⡿⣟⣯⣷"},
 {k:"retro",title:"EZYDRAG/OS v2.6 — TTY1",p:'READY&gt; ',spin:"|/-\\"}];
$$("[data-live]").forEach(root=>{
  const S=window.EZY_SCENARIOS||[];if(!S.length)return;
  const term=$("[data-term]",root),body=$("[data-term-body]",root),title=$("[data-term-title]",root),stages=$$(".stages li",root),
        pill=$("[data-status]",root),sT=$("[data-scn-title]",root),sM=$("[data-scn-meta]",root),pauseB=$("[data-live-pause]",root),nextB=$("[data-live-next]",root),count=$("[data-live-count]",root);
  const st={};$$("[data-s]",root).forEach(e=>st[e.dataset.s]=e);
  let paused=false,runId=0,started=false;
  const pick=(n,key)=>{let last=+ls.get(key);let i=Math.floor(Math.random()*n);if(n>1&&i===last)i=(i+1)%n;ls.set(key,i);return i};
  const sleep=(ms,id)=>new Promise(res=>{let left=reduce?Math.min(ms,120):ms;const tick=()=>{if(id!==runId)return res(false);if(!paused)left-=50;left<=0?res(true):setTimeout(tick,50)};setTimeout(tick,50)});
  const line=(html,cls)=>{const p=document.createElement("p");if(cls)p.className=cls;p.innerHTML=html;body.appendChild(p);body.scrollTop=body.scrollHeight;return p};
  const ts=t0=>`<span class="c-dim">[${((performance.now()-t0)/1000).toFixed(1).padStart(5," ")}s]</span> `;
  async function run(si,ki){
    const id=++runId,sc=S[si],sk=SKINS[ki];body.innerHTML="";term.className="term "+sk.k;title.textContent=sk.title;
    stages.forEach(s=>{s.classList.remove("on","done");s.style.setProperty("--p","0%")});
    const tot={rec:0,tin:0,tout:0,warn:0};let t0=performance.now(),pauseAcc=0,pStart=0;
    sT.textContent=sc.t;sM.textContent=sc.c;pill.className="status-pill run";pill.textContent="BOOTING";
    count.textContent=`Run ${si+1} of ${S.length} · ${sk.title.split(" —")[0]} · sample data`;
    Object.values(st).forEach(e=>e.textContent="0");st.elapsed.textContent="0.0s";st.cost.textContent="$0.000";st.lat.textContent="–";
    const clock=setInterval(()=>{if(id!==runId)return clearInterval(clock);if(paused)return;const el=(performance.now()-t0-pauseAcc)/1000;st.elapsed.textContent=el.toFixed(1)+"s";
      st.records.textContent=fmt(tot.rec);st.rate.textContent=fmt(el>0?tot.rec/el:0);st.tin.textContent=fmt(tot.tin);st.tout.textContent=fmt(tot.tout);
      st.cost.textContent="$"+((tot.tin*sc.price[0]+tot.tout*sc.price[1])/1e6).toFixed(3);st.warn.textContent=tot.warn;
      if(tot.rec||tot.tin)st.lat.textContent=Math.round(sc.lat*(.85+Math.random()*.3))+"ms"},120);
    const watchPause=setInterval(()=>{if(id!==runId)return clearInterval(watchPause);if(paused&&!pStart)pStart=performance.now();if(!paused&&pStart){pauseAcc+=performance.now()-pStart;pStart=0}},50);
    if(sk.k==="retro")line("EZYDRAG/OS v2.6 · 640K CONTEXT OK","c-dim");
    const pr=line(sk.p+'<span data-typed></span><span class="cursor" aria-hidden="true"></span>',sk.k==="warp"?"blk":"");const typed=$("[data-typed]",pr);
    if(!await sleep(500,id))return;
    for(const ch of sc.cmd){typed.textContent+=ch;if(!await sleep(18,id))return}
    $(".cursor",pr).remove();if(!await sleep(350,id))return;
    line(`<span class="c-dim">agent</span> <span class="c-key">${esc(sc.c)}</span> <span class="c-dim">· reads: connected systems only · writes: human approval required</span>`);
    pill.textContent="RUNNING";let curStage=-1;
    for(const s of sc.steps){if(id!==runId)return;const[k,a,ms,rec,tok]=s;
      if(k==="st"){if(curStage>=0){stages[curStage].classList.remove("on");stages[curStage].classList.add("done");stages[curStage].style.setProperty("--p","100%")}curStage=a;stages[a].classList.add("on");stages[a].style.setProperty("--p","40%");
        line(`<span class="c-key">▸ ${["COLLECT","STRUCTURE","CONNECT","ACTIVATE"][a]}</span>`,sk.k==="warp"?"blk":"");continue}
      if(k==="ln"){line(ts(t0)+esc(a));if(!await sleep(ms,id))return;continue}
      if(k==="dim"){line(ts(t0)+`<span class="c-dim">${esc(a)}</span>`);if(!await sleep(ms,id))return;continue}
      if(k==="ok"){line(ts(t0)+`<span class="c-ok">✓ ${esc(a)}</span>`);if(!await sleep(ms,id))return;continue}
      if(k==="warn"){tot.warn++;line(ts(t0)+`<span class="c-warn">⚠ ${esc(a)}</span>`);if(!await sleep(ms,id))return;continue}
      if(k==="gate"){pill.textContent="WAITING FOR A PERSON";pill.className="status-pill warn";const p=line("");let el=0,i=0;while(el<ms){p.innerHTML=ts(t0)+`<span class="c-warn">◆ HUMAN</span> waiting for approval · ${esc(a)} <span class="c-dim">${"…".slice(0,1+(i++%3))}</span>`;if(!await sleep(300,id))return;el+=300}
        p.innerHTML=ts(t0)+`<span class="c-ok">◆ HUMAN</span> approved by ${esc(a)} <span class="c-dim">· logged to audit trail</span>`;pill.textContent="RUNNING";pill.className="status-pill run";continue}
      if(k==="err"){tot.warn++;line(ts(t0)+`<span class="c-err">✗ ${esc(a)}</span>`);if(!await sleep(ms,id))return;continue}
      if(k==="spin"){const p=line("");let i=0,el=0;const fr=sk.spin;while(el<ms){p.innerHTML=ts(t0)+`<span class="c-p">${fr[i++%fr.length]}</span> ${esc(a)}…`;if(!await sleep(90,id))return;el+=90}
        p.innerHTML=ts(t0)+`<span class="c-ok">✓</span> ${esc(a)}`;continue}
      if(k==="bar"){const p=line("");const N=sk.k==="retro"?20:24,steps=Math.max(6,Math.round(ms/110));const r0=tot.rec,i0=tot.tin,o0=tot.tout;
        for(let j=1;j<=steps;j++){const f=j/steps,jit=Math.min(1,f+(Math.random()-.5)*.04);const fill=Math.round(N*jit);
          tot.rec=r0+Math.round((rec||0)*f);if(tok){tot.tin=i0+Math.round(tok[0]*f);tot.tout=o0+Math.round(tok[1]*f)}
          if(curStage>=0)stages[curStage].style.setProperty("--p",(40+60*f)+"%");
          const bar=(sk.k==="retro"?"#":"█").repeat(fill)+(sk.k==="retro"?".":"░").repeat(N-fill);
          p.innerHTML=ts(t0)+`${esc(a)} <span class="c-p">${bar}</span> ${String(Math.round(f*100)).padStart(3," ")}%${rec?` <span class="c-dim">${fmt((rec||0)*f)}/${fmt(rec)}</span>`:""}`;
          if(!await sleep(ms/steps*(0.6+Math.random()*.8),id))return}continue}}
    stages.forEach(s=>{s.classList.remove("on");s.classList.add("done");s.style.setProperty("--p","100%")});
    const el=((performance.now()-t0-pauseAcc)/1000).toFixed(1);
    line(`<span class="c-ok">● done</span> in ${el}s · ${fmt(tot.rec)} records · ${fmt(tot.tin+tot.tout)} tokens · ${tot.warn} warnings`,sk.k==="warp"?"blk":"");
    line(sk.p+'<span class="cursor" aria-hidden="true"></span>');
    pill.className="status-pill "+(tot.warn?"warn":"ok");pill.textContent=tot.warn?"DONE · REVIEW":"DONE";
    if(await sleep(7000,id))start();
  }
  function start(){run(pick(S.length,"ezy-scn"),pick(SKINS.length,"ezy-skin"))}
  pauseB.addEventListener("click",()=>{paused=!paused;pauseB.setAttribute("aria-pressed",paused);pauseB.innerHTML=paused?`${ico("play")}<span>Resume</span>`:`${ico("pause")}<span>Pause</span>`;if(paused){pill.textContent="PAUSED"}});
  nextB.addEventListener("click",()=>{paused=false;pauseB.setAttribute("aria-pressed","false");pauseB.innerHTML=`${ico("pause")}<span>Pause</span>`;start()});
  const go=()=>{if(started)return;started=true;start()};
  if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){go();io.disconnect()}},{threshold:.2});io.observe(root)}else go();
});

/* ---------- enterprise data graph ---------- */
const G={sys:[["sf","Salesforce","CRM"],["mk","Marketo","Marketing"],["ga","Google Analytics","Web"],["xl","Excel & CSV","Files"],["cal","Calendar & MoMs","Meetings"],["doc","Docs & policies","Knowledge"]],
 ent:[["acc","Account"],["con","Contact"],["deal","Deal"],["camp","Campaign"],["mail","Email"],["meet","Meeting"],["rep","Report"],["pol","Policy"]],
 e:[["sf","acc"],["sf","con"],["sf","deal"],["mk","con"],["mk","camp"],["mk","mail"],["ga","camp"],["ga","con"],["xl","rep"],["xl","con"],["cal","meet"],["doc","pol"],["con","acc"],["deal","acc"],["mail","camp"],["camp","con"],["meet","acc"],["meet","con"],["rep","deal"],["rep","camp"],["pol","con"]],
 q:{opened:{q:"Which accounts opened the QBR email?",p:["mk","mail","camp","con","acc","sf"],a:"14 accounts. 9 have open deals; 3 are in proposal and flagged for nurture.",s:["Marketo","Salesforce"]},
    promise:{q:"What did we promise Acme?",p:["cal","meet","acc","con","deal","sf"],a:"Pricing for three regions by Friday (MoM, 28 Oct). Follow-up is on the calendar.",s:["MoM","Calendar","Salesforce"]},
    pii:{q:"Where does personal data live?",p:["con","sf","mk","ga","xl","pol"],a:"In 4 systems. One CSV has no consent field: first on the DPDP fix list.",s:["Lineage","Consent policy"]},
    qbr:{q:"Draft the Q3 review",p:["xl","rep","deal","camp","sf","mk","ga"],a:"Draft ready with trends, two outliers explained and next steps. Sent for review.",s:["Workbooks","Salesforce","Marketo","GA"]}}};
$$("[data-graph]").forEach(root=>{const scope=root.closest(".wrap")||document,svg=$("svg",root),ans=$("[data-g-answer]",scope);const W=900,H=540,cx=W/2,cy=H/2,pos={};
  G.sys.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/G.sys.length;pos[n[0]]=[cx+Math.cos(a)*360,cy+Math.sin(a)*205]});
  G.ent.forEach((n,i)=>{const a=-Math.PI/2+Math.PI/8+i*2*Math.PI/G.ent.length;pos[n[0]]=[cx+Math.cos(a)*180,cy+Math.sin(a)*115]});
  let h=`<g aria-hidden="true">`+G.e.map(([a,b])=>`<path class="edge" data-a="${a}" data-b="${b}" d="M${pos[a]} Q${(pos[a][0]+pos[b][0])/2*.9+cx*.1},${(pos[a][1]+pos[b][1])/2*.9+cy*.1} ${pos[b]}"/>`).join("")+`</g>`;
  h+=G.sys.map(([id,l,t])=>`<g class="node sys" data-id="${id}" tabindex="0" role="button" aria-label="${l}, ${t}. Show connections" transform="translate(${pos[id]})"><circle r="28"/><text class="t1" y="48">${l}</text><text class="t2" y="62">${t.toUpperCase()}</text></g>`).join("");
  h+=G.ent.map(([id,l])=>`<g class="node ent" data-id="${id}" tabindex="0" role="button" aria-label="${l}. Show connections" transform="translate(${pos[id]})"><circle r="14"/><text class="t1" y="32" style="font-size:12px">${l}</text></g>`).join("");
  h+=`<circle class="flow" r="6" opacity="0" aria-hidden="true"><animateMotion dur="2.4s" repeatCount="3" path="M0,0"/></circle>`;svg.innerHTML=h;
  const nodes=$$(".node",svg),edges=$$(".edge",svg);
  const light=ids=>{const set=new Set(ids);nodes.forEach(n=>{n.classList.toggle("on",set.has(n.dataset.id));n.classList.toggle("dim",ids.length>0&&!set.has(n.dataset.id))});edges.forEach(e=>e.classList.toggle("on",set.has(e.dataset.a)&&set.has(e.dataset.b)))};
  function query(k){const q=G.q[k];light(q.p);$$("[data-q]",scope).forEach(b=>b.setAttribute("aria-pressed",b.dataset.q===k));
    if(ans)ans.innerHTML=`<span class="eyebrow">Answer</span><h3 style="margin:10px 0 8px">${q.q}</h3><p class="muted">${q.a}</p><div class="srcs">${q.s.map(s=>`<span>${s}</span>`).join("")}</div><p class="note" style="margin-top:12px">Sample data.</p>`;
    const f=$(".flow",svg),m=$("animateMotion",f);if(!reduce){m.setAttribute("path","M"+q.p.map(id=>pos[id].join(",")).join(" L"));f.setAttribute("opacity","1");try{m.beginElement()}catch(e){}}}
  nodes.forEach(n=>{const fn=()=>{const id=n.dataset.id;light([...new Set([id,...G.e.filter(e=>e.includes(id)).flat()])]);if(ans){const lab=n.getAttribute("aria-label").split(".")[0];ans.innerHTML=`<span class="eyebrow">Node</span><h3 style="margin:10px 0 8px">${lab}</h3><p class="muted">Connected to ${G.e.filter(e=>e.includes(id)).length} other nodes.</p>`}};
    n.addEventListener("click",fn);n.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();fn()}})});
  $$("[data-q]",scope).forEach(b=>b.addEventListener("click",()=>query(b.dataset.q)));query(root.dataset.graph||"opened")});

/* ---------- token calculator ---------- */
$$("[data-tokens]").forEach(root=>{const v=id=>+$("#"+id,root).value,on=id=>$("#"+id,root).checked;
  function calc(){$$("output[for]",root).forEach(o=>{const i=$("#"+o.getAttribute("for"),root);o.textContent=(o.dataset.pre||"")+(+i.value).toLocaleString("en-US")});
    const req=v("t-req"),inp=v("t-in"),out=v("t-out"),pi=v("t-pin"),po=v("t-pout");const base=req*(inp*pi+out*po)/1e6;
    const r=on("t-faq")?req*.78:req,i=on("t-ctx")?inp*.55:inp,o=on("t-cap")?out*.75:out,cs=on("t-cache")?.5:0;
    const after=r*(i*((1-cs)*pi+cs*pi*.1)+o*po)/1e6;
    $("[data-t-before]",root).textContent=money(base);$("[data-t-after]",root).textContent=money(after);
    $("[data-t-save]",root).textContent=base?Math.round((1-after/base)*100)+"%":"0%";$("[data-t-year]",root).textContent=money((base-after)*12);
    $("[data-t-bar]",root).style.width=(base?after/base*100:0)+"%"}
  $$("input",root).forEach(i=>i.addEventListener("input",calc));calc()});

/* ---------- FAQ matcher ---------- */
const srcHTML=d=>d&&d.s?`<p class="src">Source: <a href="${d.s[1]}" target="_blank" rel="noopener">${esc(d.s[0])}</a></p>`:"";

const STOP=new Set("a an the is are am do does did you your we our us i me my to of for in on and or with what how why who where when can could would should be it this that there their from at by about any have has get".split(" "));
const tok=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w&&!STOP.has(w)).map(w=>w.replace(/(ing|es|s)$/,""));
function rankFAQ(text){const data=window.EZY_FAQ||[];const qt=tok(text);if(!qt.length)return[];
  return data.map(item=>{const set=tok(item.q+" "+item.k);let hit=0;qt.forEach(w=>{if(set.includes(w)||set.some(s=>w.length>3&&s.length>3&&(s.startsWith(w)||w.startsWith(s))))hit++});
    return{item,hit,score:Math.min(1,hit/qt.length*.8+hit/Math.max(4,set.length)*.8)}}).sort((x,y)=>y.score-x.score)}
function matchFAQ(text){const r=rankFAQ(text),best=r[0];return best&&best.hit&&best.score>=.45?best:{miss:true,score:best?best.score:0,near:r.filter(x=>x.hit&&x.score>=.18).slice(0,3)}}

/* Small talk: anything that isn't a question about us gets a reply with some personality. Checked before the FAQ. */
const pick=a=>a[Math.floor(Math.random()*a.length)];
const TALK=[
 [/^(hi|hey|hello|yo|hiya|namaste|sup|good (morning|afternoon|evening))\b/i,()=>pick(["Hey! I'm Ask Ezydrag. I answer questions about our AI agents, your data and how we work. What's on your mind?","Hello 👋 Ask me what we build, whether your data is ready for AI, or how we test agents.","Hi there. Fair warning: I only say things a human on our team has approved. Ask away."])],
 [/\b(thanks|thank you|thx|ty|cheers|great|awesome|perfect|nice)\b/i,()=>pick(["Anytime. Anything else?","Glad that helped. I'm here if you think of something else.","Happy to help. Want to see the agents in action? Book a 30-minute call."])],
 [/\b(bye|goodbye|see you|later|cya)\b/i,()=>"See you. If something comes up, hello@ezydrag.com reaches a real person."],
 [/\b(are you (a )?(human|bot|real|ai|robot|gpt|chatgpt|llm)|who are you|what are you)\b/i,()=>"I'm a small bot, and proudly not a big model. I match your question against answers our team has approved, so I can't make things up. When I don't know, a person takes over."],
 [/\b(joke|funny|make me laugh)\b/i,()=>pick(["Why did the AI agent cross the road? It didn't. It was waiting for human approval. (We built it that way.)","An AI agent walks into a bar. It asks for approval before ordering. The bartender says: finally, one with manners.","How many AI agents does it take to change a lightbulb? One to do it, one to check it, and a person to approve the new bulb."])],
 [/\b(weather|recipe|cricket|football|movie|song|stock price|bitcoin|crypto|horoscope|girlfriend|boyfriend|date me|love you)\b/i,()=>pick(["Ha, that's outside my lane. I stick to AI agents, data and how Ezydrag works. Try: “Is our data ready for AI?”","I'd love to help, but I only know what our team approved, and that's all agents and data. Ask me about those?"])],
 [/\b(help|what can (i|you) ask|what do you know|menu|options)\b/i,()=>"I can answer about 30 questions on what we build, data and metadata, testing and reliability, approvals, pricing and getting started. Pick one below or type your own."],
];
/* Cuss words and insults are never answered with "send it to a person". If a real question is left once the rude words are removed, we answer that; otherwise we stay light and steer back to what we can help with. */
const CUSS=/\b(f+u+c+k\w*|fck\w*|sh[i1]+t\w*|bullshit|bitch\w*|asshole|bastard|dickhead|dick|piss\w*|crap\w*|damn\w*|wtf|stfu|idiot\w*|moron\w*|stupid|dumb\w*|loser|suck\w*|useless|madarchod|bhenchod|behenchod|chutiya\w*|gandu|harami|bakchod|bc|mc)\b/gi;
const CALM=["Ha, let's keep it friendly 🙂 I'm good at questions about Ezydrag: what we build, how it works, security, how we price. What would you like to know?","I hear the frustration. Tell me what you're trying to find out about Ezydrag and I'll do my best to get you a straight answer.","Rough day? I'm happy to help with anything about our AI agents, data, or how we work. Try: “What do you build?”","Fair enough, and thanks for the honesty. Ask me anything about Ezydrag and I'll be as useful as I can."];
function cuss(text){CUSS.lastIndex=0;if(!CUSS.test(text))return null;CUSS.lastIndex=0;const clean=text.replace(CUSS," ").replace(/\s+/g," ").trim();return tok(clean).length>=2?{clean}:{reply:pick(CALM)}}
const smallTalk=t=>{const s=t.trim();const cz=cuss(s);if(cz&&cz.reply)return cz.reply;if(s.split(/\s+/).length>14)return null;for(const[re,f]of TALK)if(re.test(s))return f();return null};
const wait=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));
async function typeOut(el,text){if(reduce){el.textContent=text;return}const words=text.split(" ");el.textContent="";for(let i=0;i<words.length;i++){el.textContent+=(i?" ":"")+words[i];el.closest(".log").scrollTop=1e9;await wait(Math.min(38,900/words.length+12))}}
function chips(log,list,ask){if(!list.length)return;const d=document.createElement("div");d.className="bubble-sugg";d.innerHTML=list.map(q=>`<button type="button">${esc(q)}</button>`).join("");log.appendChild(d);
  $$("button",d).forEach(b=>b.addEventListener("click",()=>{d.remove();ask(b.textContent)}));log.scrollTop=log.scrollHeight}
async function botReply(log,text,meta){const add=(cls,html)=>{const d=document.createElement("div");d.className="bubble "+cls;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
  $$(".bubble-sugg",log).forEach(x=>x.remove());const ask=q=>botReply(log,q,meta);
  add("q",esc(text));const t0=performance.now();
  const talk=smallTalk(text);const cz=cuss(text);if(cz&&cz.clean)text=cz.clean;
  if(talk){const ty=add("a",'<span class="typing" aria-label="Typing"><i></i><i></i><i></i></span>');await wait(520);ty.innerHTML="<p></p>";await typeOut($("p",ty),talk);
    chips(log,["What do you build?","Is our data ready for AI?","How do you test agents?"].filter(q=>q!==text),ask);return{miss:false,talk:true}}
  /* Thinking: the real steps the matcher runs, shown as they happen */
  const th=add("a think",`<details class="think" open><summary><span class="think-dot" aria-hidden="true"></span><span data-th-l>Thinking</span></summary><ol></ol></details>`);
  const ol=$("ol",th),lab=$("[data-th-l]",th),step=async(html,ms)=>{const li=document.createElement("li");li.innerHTML=html;ol.appendChild(li);log.scrollTop=log.scrollHeight;await wait(ms);li.classList.add("done")};
  const kw=text.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w&&!STOP.has(w)).slice(0,5);
  await step(`Reading your question${kw.length?`: <i>${kw.map(esc).join(", ")}</i>`:""}`,380);
  await step(`Searching ${(window.EZY_FAQ||[]).length} approved answers`,460);
  const m=matchFAQ(text);
  if(!m.miss){await step(`Best match: “${esc(m.item.q)}” <span class="think-sc">${Math.round(m.score*100)}%</span>`,380);
    await step(m.item.s?`Approved by our team · source on file`:`Approved by our team`,300)}
  else await step(m.near.length?`No exact match. ${m.near.length} close one${m.near.length>1?"s":""}`:`Nothing approved on this yet`,340);
  const secs=((performance.now()-t0)/1000).toFixed(1);lab.textContent=`Thought for ${secs}s`;th.classList.add("thought");$("details",th).open=false;
  if(!m.miss){const a=add("a good","<p></p>");await typeOut($("p",a),m.item.a);
    if(meta)a.insertAdjacentHTML("beforeend",`<div class="meta"><span class="hit">${ico("tick")} Matched “${esc(m.item.q)}”</span><span>${m.score.toFixed(2)}</span><span>0 LLM tokens</span></div>`);
    log.scrollTop=log.scrollHeight;const rel=(window.EZY_FAQ||[]).filter(d=>d.c===m.item.c&&d.q!==m.item.q).slice(0,2).map(d=>d.q);chips(log,rel,ask);return m}
  const a=add("a bad","<p></p>");
  await typeOut($("p",a),m.near.length?"I don't have an approved answer for that exact question. Did you mean one of these?":"Good question, and not one I've been approved to answer. A person on our team can.");
  const mail=`mailto:hello@ezydrag.com?subject=${encodeURIComponent("Question from the website")}&body=${encodeURIComponent(text)}`;
  a.insertAdjacentHTML("beforeend",`<p class="bubble-act"><a href="${mail}">${ico("mail")} Send it to a person</a></p>`+(meta?`<div class="meta"><span class="miss">${ico("alert")} No match</span><span>≈ ${fmt((text.length+4200)/4)} tokens if sent to an LLM</span></div>`:""));log.scrollTop=log.scrollHeight;
  chips(log,m.near.map(x=>x.item.q),ask);return m}
$$("[data-bot]").forEach(root=>{const log=$(".log",root),form=$("form",root),inp=$("input",root),scope=root.closest(".wrap")||document,stat=$("[data-bot-stat]",scope);let hits=0,total=0;
  const upd=m=>{total++;if(!m.miss)hits++;if(stat)stat.textContent=`${hits}/${total} answered with no LLM call`};
  form.addEventListener("submit",async e=>{e.preventDefault();const v=inp.value.trim();if(!v){inp.focus();return}inp.value="";upd(await botReply(log,v,true))});
  $$("[data-ask]",scope).forEach(b=>b.addEventListener("click",async()=>upd(await botReply(log,b.dataset.ask,true))))});
(function(){const launch=$("#biz-launch"),panel=$("#biz");if(!launch||!panel)return;const log=$(".log",panel);
  const toggle=o=>{panel.hidden=!o;launch.setAttribute("aria-expanded",o);if(o)$("input",panel).focus();else launch.focus()};
  launch.addEventListener("click",()=>toggle(panel.hidden));$("[data-biz-close]",panel).addEventListener("click",()=>toggle(false));
  panel.addEventListener("keydown",e=>{if(e.key==="Escape")toggle(false)});
  /* Cheapest path first: small talk and confident approved answers cost 0 tokens. Only the rest goes to /api/ask,
     which sends a handful of retrieved site passages to a small model and refuses anything that isn't about Ezydrag. */
  const endpoint=(window.EZY_CONFIG||{}).askUrl;let pq="",pa="",busy=false;
  const bubble=(cls,html)=>{const d=document.createElement("div");d.className="bubble "+cls;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
  async function ask(q){
    const cz=cuss(q);if(cz&&cz.clean)q=cz.clean;
    const longQ=q.trim().split(/\s+/).length>7; /* longer, more thoughtful questions go to the model unless the FAQ match is near-exact */
    if(!endpoint||smallTalk(q)||(rankFAQ(q)[0]||{score:0}).score>=(longQ?.85:.6)){const m=await botReply(log,q,false);if(m&&!m.talk&&!m.miss){pq=q;pa=m.item.a}return}
    $$(".bubble-sugg",log).forEach(x=>x.remove());bubble("q",esc(q));
    const ty=bubble("a",'<span class="typing" aria-label="Typing"><i></i><i></i><i></i></span>');
    let r=null;
    try{const res=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({q,pq,pa}),signal:AbortSignal.timeout(20000)});if(res.ok||res.status===429)r=await res.json()}catch(e){}
    if(!r||r.error||!r.a){ty.remove();log.lastElementChild.remove();return botReply(log,q,false)} /* no key / offline: approved answers still work */
    ty.innerHTML="<p></p>";await typeOut($("p",ty),r.a);
    if(r.friendly){chips(log,["What do you build?","How does pricing work?","Is our data safe?"],ask)}
    else if(r.miss||r.limited||r.capped){ty.classList.add("bad");const mail=`mailto:hello@ezydrag.com?subject=${encodeURIComponent("Question from the website")}&body=${encodeURIComponent(q)}`;
      ty.insertAdjacentHTML("beforeend",`<p class="bubble-act"><a href="${mail}">${ico("mail")} Send it to a person</a></p>`);
      chips(log,["What do you build?","How does pricing work?","Is our data safe?"],ask)}
    else{pq=q;pa=r.a;if(r.more&&r.more!=="index.html")ty.insertAdjacentHTML("beforeend",`<p class="bubble-act"><a href="${esc(r.more)}">Read more on this page →</a></p>`);log.scrollTop=log.scrollHeight}
  }
  $("form",panel).addEventListener("submit",async e=>{e.preventDefault();const i=$("input",panel),v=i.value.trim().slice(0,300);i.value="";if(!v||busy)return;busy=true;try{await ask(v)}finally{busy=false}});
  $$(".sugg button",panel).forEach(b=>b.addEventListener("click",()=>{if(!busy){busy=true;ask(b.textContent).finally(()=>busy=false)}}))})();

/* ---------- optimization audit ---------- */
$$("[data-optim]").forEach(root=>{const A=[["QBR Generator",18400,"KPI dictionary resent each run","Cache it",.46],["Sales Nurture",6200,"Uses 3 of 12 retrieved docs","Top-4 from graph",.38],["QA Agent",4100,"Long free-text reports","Structured output",.31],["Ezydrag assistant",1350,"LLM for common questions","FAQ bot first",.72],["AI PTA",2900,"Re-reads full MoM threads","Summarise once",.41]];
  const body=$("tbody",root),btn=$("[data-o-run]",root),tot=$("[data-o-total]",root);let ran=false;
  function render(){let b=0,a=0;body.innerHTML=A.map(([n,t,f,fix,cut])=>{const nt=ran?t*(1-cut):t;b+=t;a+=nt;return `<tr><th scope="row" style="background:none;font-family:var(--f-body);font-size:.9rem;text-transform:none;letter-spacing:0;color:var(--ink);font-weight:700">${n}</th><td class="tnum">${fmt(nt)}${ran?` <span class="sev lo">−${Math.round(cut*100)}%</span>`:""}<div class="meter" style="margin-top:6px" aria-hidden="true"><i style="width:${nt/18400*100}%"></i></div></td><td>${ran?f:'<span class="muted">—</span>'}</td><td>${ran?fix+' <span class="op review">needs approval</span>':'<span class="muted">—</span>'}</td></tr>`}).join("");
    tot.textContent=ran?`${fmt(b)} → ${fmt(a)} tokens per cycle (−${Math.round((1-a/b)*100)}%)`:`${fmt(b)} tokens per cycle`}
  btn.addEventListener("click",()=>{if(ran){ran=false;render();btn.innerHTML=`${ico("play")}Run audit`;return}btn.disabled=true;btn.innerHTML='<span class="typing" aria-hidden="true"><i></i><i></i><i></i></span> Auditing';
    setTimeout(()=>{ran=true;render();btn.disabled=false;btn.innerHTML=`${ico("refresh")}Reset`},reduce?100:1500)});render()});

/* ---------- agent cards expand ---------- */
$$("[data-agents]").forEach(grid=>grid.addEventListener("click",e=>{const btn=e.target.closest(".agent .go");if(!btn)return;const card=btn.closest(".agent");const was=btn.getAttribute("aria-expanded")==="true";
  $$(".agent-detail",grid).forEach(d=>d.remove());$$(".agent .go",grid).forEach(b=>b.setAttribute("aria-expanded","false"));$$(".agent",grid).forEach(c=>c.classList.remove("open"));if(was)return;const tpl=$("template",card);if(!tpl)return;
  btn.setAttribute("aria-expanded","true");card.classList.add("open");const cols=getComputedStyle(grid).gridTemplateColumns.split(" ").length,vis=$$(".agent",grid).filter(c=>!c.hidden),idx=vis.indexOf(card),
  after=vis[Math.min(vis.length-1,Math.floor(idx/cols)*cols+cols-1)],d=document.createElement("div");d.className="agent-detail";d.id=(card.id||"agent"+idx)+"-detail";d.setAttribute("role","region");d.setAttribute("aria-label",$("h3",card).textContent+" details");d.innerHTML=tpl.innerHTML;after.after(d);btn.setAttribute("aria-controls",d.id);
  d.scrollIntoView({behavior:reduce?"auto":"smooth",block:"nearest"})}));
/* ---------- reviews carousel ---------- */
$$("[data-quotes]").forEach(root=>{const qs=$$(".quote",root),dots=$(".qdots",root);let i=0;
  /* reviews: you move them. Two arrows, dots, arrow keys. No autoplay. */
  qs.forEach((_,j)=>{const b=document.createElement("button");b.type="button";b.className="dot";b.setAttribute("aria-label",`Review ${j+1} of ${qs.length}`);b.setAttribute("aria-pressed",j===0);dots.appendChild(b);b.addEventListener("click",()=>go(j))});
  const bs=$$(".dot",dots);const go=j=>{i=(j+qs.length)%qs.length;qs.forEach((q,k)=>q.classList.toggle("on",k===i));bs.forEach((b,k)=>b.setAttribute("aria-pressed",k===i))};
  $("[data-qprev]",root).addEventListener("click",()=>go(i-1));$("[data-qnext]",root).addEventListener("click",()=>go(i+1));
  root.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")go(i-1);if(e.key==="ArrowRight")go(i+1)});go(0)});

/* ---------- map ---------- */
$$("[data-map]").forEach(root=>{const pins=$$(".pin",root),card=$(".map-card",root),scope=root.closest(".wrap")||document;
  const sel=p=>{pins.forEach(x=>x.classList.toggle("on",x===p));card.innerHTML=`<span class="eyebrow">${p.dataset.kind}</span><h3>${p.dataset.name}</h3><p>${p.dataset.info}</p>`;$$("[data-pin]",scope).forEach(b=>b.setAttribute("aria-pressed",b.dataset.pin===p.dataset.id))};
  pins.forEach(p=>{p.addEventListener("click",()=>sel(p));p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();sel(p)}})});
  $$("[data-pin]",scope).forEach(b=>b.addEventListener("click",()=>sel($(`.pin[data-id="${b.dataset.pin}"]`,root))));sel(pins[0])});

/* ---------- team dialog ---------- */
const dlg=$("#member-dialog");let lastMember=null;
if(dlg){$$(".member[data-name]").forEach(m=>m.addEventListener("click",()=>{lastMember=m;const img=$("img",dlg);img.src=m.dataset.img;img.alt="Portrait of "+m.dataset.name;$("[data-d-name]",dlg).textContent=m.dataset.name;$("[data-d-role]",dlg).textContent=m.dataset.role;$("[data-d-focus]",dlg).textContent=m.dataset.focus;dlg.showModal()}));
  $(".x",dlg).addEventListener("click",()=>dlg.close());dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});dlg.addEventListener("close",()=>lastMember&&lastMember.focus())}

/* ---------- countdown ---------- */
$$("[data-countdown]").forEach(el=>{const end=new Date(el.dataset.countdown).getTime();
  const tick=()=>{let s=Math.max(0,(end-Date.now())/1000);const d=Math.floor(s/86400);s-=d*86400;const h=Math.floor(s/3600);s-=h*3600;const m=Math.floor(s/60);
    el.innerHTML=[[d,"DAYS"],[h,"HOURS"],[m,"MIN"]].map(([v,l])=>`<div><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`).join("");el.setAttribute("aria-label",`${d} days, ${h} hours, ${m} minutes left`)};tick();setInterval(tick,30000)});

/* ---------- readiness check ---------- */
$$("[data-assess]").forEach(root=>{const rows=$$(".q",root),out=$("[data-a-out]",root);
  function upd(){let yes=0,ans=0;rows.forEach(r=>{const p=$("[aria-pressed=true]",r);if(p){ans++;if(p.dataset.v==="y")yes++}});
    if(!ans){out.innerHTML='<p class="muted">Answer to see your score.</p>';return}const pct=Math.round(yes/rows.length*100),lvl=pct>=80?["Strong","lo"]:pct>=50?["Partial","md"]:["Big gaps","hi"];
    out.innerHTML=`<div style="display:flex;align-items:baseline;gap:12px"><span class="big tnum">${pct}%</span><span class="sev ${lvl[1]}">${lvl[0]}</span><span class="note">${ans}/${rows.length} answered</span></div><div class="meter" style="margin-top:10px" aria-hidden="true"><i style="width:${pct}%"></i></div><p class="note" style="margin-top:8px">Indicator only. Not legal advice.</p>`}
  rows.forEach(r=>$$("button",r).forEach(b=>b.addEventListener("click",()=>{$$("button",r).forEach(x=>x.setAttribute("aria-pressed",x===b));upd()})));upd()});

/* ---------- feedback loop + check-in ---------- */
$$("[data-loop]").forEach(root=>{const ns=$$(".lnode",root),out=$("[data-l-out]",root.closest(".wrap")),D=JSON.parse($("script[type='application/json']",root).textContent),pb=$("[data-loop-pause]",root.closest(".wrap"));let i=0,t=null;
  const go=j=>{i=j;ns.forEach((n,k)=>{n.classList.toggle("on",k===j);n.setAttribute("aria-pressed",k===j)});out.innerHTML=`<span class="eyebrow">${D[j].when}</span><h2 style="margin:10px 0 6px;font-size:1.6rem">${D[j].t}</h2><p class="muted">${D[j].d}</p>`};
  const stop=()=>{clearInterval(t);t=null;if(pb){pb.innerHTML=ico("play")+"Play";pb.setAttribute("aria-pressed","true")}};
  const play=()=>{if(reduce)return;t=setInterval(()=>go((i+1)%ns.length),4500);if(pb){pb.innerHTML=ico("pause")+"Pause";pb.setAttribute("aria-pressed","false")}};
  ns.forEach((n,j)=>{n.addEventListener("click",()=>{stop();go(j)});n.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();stop();go(j)}})});
  pb&&pb.addEventListener("click",()=>t?stop():play());go(0);play()});
$$("[data-nps]").forEach(root=>{const box=$(".nps",root),out=$("[data-nps-out]",root);box.innerHTML=Array.from({length:11},(_,i)=>`<button type="button" aria-pressed="false" aria-label="Score ${i}">${i}</button>`).join("");
  $$("button",box).forEach((b,i)=>b.addEventListener("click",()=>{$$("button",box).forEach(x=>x.setAttribute("aria-pressed",x===b));out.textContent=i>=9?"Thanks. We'd ask for a short testimonial.":i>=7?"Thanks. What would make it a 10?":"Thanks. Expect a follow-up call this week."}));
  const f=$("form",root);f&&f.addEventListener("submit",e=>{e.preventDefault();toast("Preview only. Nothing was sent.");f.reset()})});

/* ---------- brief builder with inline errors ---------- */
/* brief, step 1: multi-select agents. "All of them" ticks everything; "I've got one for you" opens a line to describe it */
function agentsOk(scope){const g=$("[data-agents]",scope);if(!g)return true;const any=$$('input[name=area]:checked',g).length>0,own=$("[data-own]",g),txt=$("#q-own",g);
  const ok=any&&!(own&&own.checked&&txt&&txt.value.trim().length<3);const e=$("#agents-err",g);if(e){e.hidden=ok;e.textContent=any?"Tell us your idea in a line.":"Pick at least one, or tell us yours."}
  if(!ok)(any?txt:$("input",g)).focus();return ok}
$$("[data-agents]").forEach(g=>{const all=$("[data-all]",g),boxes=$$('input[name=area]:not([data-own])',g),own=$("[data-own]",g),ob=$(".own-box",g);
  const sync=()=>{all.checked=boxes.every(b=>b.checked);all.indeterminate=!all.checked&&boxes.some(b=>b.checked)};
  all.addEventListener("change",()=>{boxes.forEach(b=>b.checked=all.checked);sync()});boxes.forEach(b=>b.addEventListener("change",sync));
  own.addEventListener("change",()=>{ob.hidden=!own.checked;if(own.checked)$("textarea",ob).focus()});
  g.addEventListener("input",()=>{const e=$("#agents-err",g);if(e&&!e.hidden&&$$('input[name=area]:checked',g).length&&!(own.checked&&$("#q-own",g).value.trim().length<3))e.hidden=true})});
function validate(scope){let first=null;$$("[required]",scope).forEach(i=>{const ok=i.checkValidity();i.setAttribute("aria-invalid",!ok);let m=$("#"+i.id+"-err");
  if(!ok){if(!m){m=document.createElement("p");m.className="err";m.id=i.id+"-err";i.after(m);i.setAttribute("aria-describedby",m.id)}m.innerHTML=ico("alert")+(i.validity.valueMissing?"This field is required.":i.type==="email"?"Enter an email like name@company.com.":`Use at least ${i.minLength} characters.`);first=first||i}else if(m)m.remove()});
  if(first)first.focus();return !first}
$$("[data-quote]").forEach(root=>{const steps=$$(".qstep",root),next=$("[data-next]",root),back=$("[data-back]",root),bar=$$(".progress i",root),res=$("[data-result]",root),form=$("form",root),lab=$("[data-step-label]",root);let s=0;
  const show=()=>{steps.forEach((x,i)=>x.hidden=i!==s);bar.forEach((b,i)=>b.classList.toggle("on",i<=s));back.hidden=s===0;next.innerHTML=s===steps.length-1?`Build my brief ${ico("arrow")}`:`Continue ${ico("arrow")}`;if(lab)lab.textContent=`Step ${s+1} of ${steps.length}`};
  next.addEventListener("click",()=>{if(!validate(steps[s]))return;if(!agentsOk(steps[s]))return;if(s<steps.length-1){s++;show();const f=$("input,textarea,select",steps[s]);f&&f.focus();return}
    const d=new FormData(form);const brief=`Ezydrag project brief\n\nAgents: ${d.getAll("area").join(", ")||"—"}${d.get("own")?`\nTheir idea: ${d.get("own")}`:""}\nTeam: ${d.get("size")}\nAlso send: ${d.getAll("comp").join(", ")||"—"}\nToday: ${d.get("workflow")}\nTools: ${d.get("tools")||"—"}\nTimeline: ${d.get("timeline")}\n\n${d.get("name")} · ${d.get("email")} · ${d.get("company")}`;
    $("pre",res).textContent=brief;$("[data-mail]",res).href="mailto:hello@ezydrag.com?subject="+encodeURIComponent("Brief: "+d.get("company"))+"&body="+encodeURIComponent(brief);
    $("[data-copybrief]",res).onclick=()=>navigator.clipboard?navigator.clipboard.writeText(brief).then(()=>toast("Brief copied"),()=>toast("Select the brief to copy it")):toast("Select the brief to copy it");
    form.hidden=true;res.hidden=false;$("h3",res).focus()});
  back.addEventListener("click",()=>{s--;show()});$("[data-edit]",root).addEventListener("click",()=>{form.hidden=false;res.hidden=true});form.addEventListener("submit",e=>e.preventDefault());show()});
$$("[data-beta]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();if(!validate(f))return;const n=$("#b-name",f).value,m=$("#b-email",f).value,t=$("#b-topic",f).value;
  $("[data-beta-out]",f).innerHTML=`${ico("tick")} Thanks, ${esc(n)}. If no email draft opened, write to <code>hello@ezydrag.com</code>.`;
  window.ezyMail("mailto:hello@ezydrag.com?subject="+encodeURIComponent("Academy beta: "+n)+"&body="+encodeURIComponent(`Name: ${n}\nEmail: ${m}\nTopic: ${t}`))}));

/* ---------- FAQ page ---------- */
$$("[data-faqpage]").forEach(root=>{const q=$("#faq-search"),count=$("[data-faq-count]"),items=$$("details[data-k]",root),secs=$$(".fq-sec",root),empty=$("[data-faq-empty]",root),links=$$("[data-faq-jump]",root);
  function render(){const t=q?q.value.trim().toLowerCase():"";let n=0;items.forEach(d=>{const hit=!t||d.dataset.k.includes(t);d.hidden=!hit;if(hit)n++;if(t&&hit&&t.length>2)d.open=true;if(!t)d.open=false});
    secs.forEach(s=>s.hidden=!$$("details:not([hidden])",s).length);if(empty)empty.hidden=n>0;if(count)count.textContent=t?`${n} of ${items.length}`:`${items.length} answers`}
  if(q){q.addEventListener("input",render);if(location.hash.startsWith("#q="))q.value=decodeURIComponent(location.hash.slice(3))}render();
  if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("on",l.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-30% 0px -60% 0px"});secs.forEach(s=>io.observe(s))}});
$$("[data-faq-preview]").forEach(el=>{const want=el.dataset.faqPreview.split("|");el.innerHTML=(window.EZY_FAQ||[]).filter(d=>want.includes(d.q)).map(d=>`<details><summary>${d.q}</summary><div class="ans"><p>${d.a}</p>${srcHTML(d)}</div></details>`).join("")});

/* ---------- demo page: booking link + plan preselect ---------- */
(function(){const cfg=window.EZY_CONFIG||{};const b=$("[data-booking]");if(b&&cfg.bookingUrl){b.href=cfg.bookingUrl;b.hidden=false}
  let plan=null;try{plan=new URLSearchParams(location.search).get("plan")}catch(e){}
  const map={pilot:"Sales Nurture",suite:"Sales Nurture",platform:"Our own idea"};if(plan&&map[plan]){const r=$(`input[name=area][value="${map[plan]}"]`);if(r){r.checked=true;r.dispatchEvent(new Event("change"))}}
  let ag=null;try{ag=new URLSearchParams(location.search).get("agent")}catch(e){}
  if(ag){const key=ag.replace(/ Agent$/,"").toLowerCase();const r=$$("input[name=area]").find(i=>i.value.toLowerCase().split(/ \/ | and /)[0]===key.split(" and ")[0])||null;
   if(r){r.checked=true;r.dispatchEvent(new Event("change"))}else{const o=$("[data-own]");if(o){o.checked=true;o.dispatchEvent(new Event("change"));const t=$("#q-own");if(t)t.value=ag}}
   const w=$("#q-work");if(w&&!w.value)w.value=`We'd like the ${ag}. `}})();
/* page transitions removed: links navigate directly */
/* loader and review veils removed in v9: content first */

/* ---------- newsletter (Field Notes) ---------- */
$$("[data-newsletter]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();if(!validate(f))return;const cfg=window.EZY_CONFIG||{},em=$("input[type=email]",f).value.trim(),out=$("[data-nl-out]",f),btn=$("button",f);
  const ok=()=>{out.innerHTML=`${ico("tick")} Almost there. Check ${esc(em)} to confirm your subscription.`;f.reset()};
  if(cfg.newsletterUrl){btn.disabled=true;btn.innerHTML='<span class="typing" aria-hidden="true"><i></i><i></i><i></i></span> Subscribing';
    fetch(cfg.newsletterUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"email="+encodeURIComponent(em)}).then(r=>{if(!r.ok)throw 0;ok()}).catch(()=>{out.innerHTML=`${ico("alert")} We couldn't reach the server. Try again, or email hello@ezydrag.com with "Subscribe".`}).finally(()=>{btn.disabled=false;btn.innerHTML=`Subscribe ${ico("arrow")}`})}
  else{out.innerHTML=`${ico("tick")} Thanks. An email draft is opening so you can confirm. If it doesn't, write to <code>hello@ezydrag.com</code> with "Subscribe".`;window.ezyMail("mailto:hello@ezydrag.com?subject="+encodeURIComponent("Subscribe to Field Notes")+"&body="+encodeURIComponent("Please add "+em+" to Field Notes."))}}));

/* ---------- agents → people handoff ---------- */
(function(){const rows=$$("[data-handoff] .ho-row");if(!rows.length)return;if(reduce||!("IntersectionObserver" in window)){rows.forEach(r=>r.classList.add("go"));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);setTimeout(()=>e.target.classList.add("go"),250)}}),{threshold:.7});rows.forEach(r=>io.observe(r))})();

/* ---------- report: reading progress + active chapter ---------- */
(function(){const bar=$(".readbar"),art=$("[data-report]");if(!bar||!art)return;const links=$$(".toc a");
  const upd=()=>{const r=art.getBoundingClientRect(),h=r.height-innerHeight;bar.style.width=Math.max(0,Math.min(1,-r.top/Math.max(1,h)))*100+"%"};addEventListener("scroll",upd,{passive:true});upd();
  if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.setAttribute("aria-current",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-30% 0px -60% 0px"});$$(".prose h2[id]").forEach(h=>io.observe(h))}})();

/* ---------- chapter rail + "next" pill: every section points to the next one ---------- */
(function(){const chs=$$("[data-chapter]");if(chs.length<3)return;
  const rail=document.createElement("nav");rail.className="rail";rail.setAttribute("aria-label","On this page");
  rail.innerHTML=chs.map(c=>`<a href="#${c.id}"><span>${esc(c.dataset.chapter)}</span><i aria-hidden="true"></i></a>`).join("");document.body.appendChild(rail);
  const pill=document.createElement("a");pill.className="next-pill";pill.setAttribute("aria-live","polite");document.body.appendChild(pill);
  const links=$$("a",rail);let cur=0;
  const set=i=>{cur=i;links.forEach((a,k)=>a.setAttribute("aria-current",k===i));const nx=chs[i+1];
    if(i>0&&nx){pill.href="#"+nx.id;pill.innerHTML=`<span class="np-k">NEXT</span><span class="np-t">${esc(nx.dataset.next||nx.dataset.chapter)}</span><span class="btn btn-ink btn-sm" aria-hidden="true">${ico("chev")}</span>`;pill.classList.add("on")}
    else if(!nx){pill.href="demo.html";pill.innerHTML=`<span class="np-k">READY?</span><span class="np-t">See it on your stack</span><span class="btn btn-primary btn-sm" aria-hidden="true">${ico("arrow")}</span>`;pill.classList.add("on")}
    else pill.classList.remove("on")};
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)set(chs.indexOf(e.target))}),{rootMargin:"-45% 0px -50% 0px"});chs.forEach(c=>io.observe(c));set(0)})();

/* ---------- deep links: open tab or agent from #hash ---------- */
function deep(){const h=location.hash.slice(1);if(!h)return;const tab=$(`[role=tab][aria-controls="${CSS.escape(h)}"]`);if(tab){tab.click();return}const el=document.getElementById(h);if(el&&el.classList.contains("agent")){const b=$(".go",el);if(b&&b.getAttribute("aria-expanded")!=="true")b.click()}}
addEventListener("hashchange",deep);setTimeout(deep,60);
})();


/* =====================================================================
   v9 · hero journey: one lead at a time walks the six steps; the caption says what just happened.
   ~1.1s per step = a new beat every second, a new lead every ~8s. Pausable (WCAG 2.2.2).
   ===================================================================== */
(function(){const Q=(s,r=document)=>r.querySelector(s),QQ=(s,r=document)=>[...r.querySelectorAll(s)];
  const wrap=Q(".journey-wrap");if(!wrap)return;
  const svgs=QQ("[data-journey]",wrap),who=Q("[data-j-who]",wrap),txt=Q("[data-j-text]",wrap),btn=Q("[data-j-toggle]",wrap);
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,N=6,STEP=1100,HOLD=1600;
  const LEADS=[
   ["Priya · Acme Corp",["Filled in your webinar form.","Found in Salesforce. 1,200 people, no open deal.","Scored 82. Strong fit, visited pricing.","Case-study email drafted. Maya approved it.","Meeting booked with Tom, Tuesday 11:00.","Closed won. Every step logged."]],
   ["Daniel · Northwind",["Asked for a demo on your website.","New company. 300 people, retail tech.","Scored 74. Good fit, comparing options.","Product-tour email drafted. Approved.","Handed to Sara with the full story.","Signed. Logged in Salesforce."]],
   ["Aiko · Brightline",["Scanned at your trade-show booth.","Already a customer. Different team.","Scored 91. Ready to expand.","Upgrade email drafted. Approved.","Account manager takes the call.","Expansion deal closed."]]];
  let li=0,k=-1,timer=null,paused=false,inView=true;
  const mini=Q(".j-mini",wrap);
  const paint=n=>{svgs.forEach(svg=>{QQ(".j-stage",svg).forEach((s,i)=>s.classList.toggle("on",i<=n));svg.style.setProperty("--jf",n<0?100:100-(n/(N-1))*100);svg.style.setProperty("--js",Math.max(n,0))});
    if(mini){QQ("li",mini).forEach((l,i)=>{l.classList.toggle("on",i<=n);l.classList.toggle("now",i===n)});mini.style.setProperty("--p",n<0?0:n/(N-1))}};
  const say=t=>{if(!txt)return;txt.classList.add("swap");setTimeout(()=>{txt.textContent=t;txt.classList.remove("swap")},reduce?0:200)};
  function tick(){if(paused||!inView||document.hidden){timer=setTimeout(tick,400);return}
    k++;if(k>=N){k=-1;li=(li+1)%LEADS.length;if(who)who.textContent=LEADS[li][0];paint(-1);say("A new lead arrives…");timer=setTimeout(tick,700);return}
    paint(k);say(LEADS[li][1][k]);timer=setTimeout(tick,k===N-1?STEP+HOLD:STEP)}
  if(reduce){paint(N-1);if(who)who.textContent=LEADS[0][0];if(txt)txt.textContent="From webinar form to closed deal, with your approval at every email.";if(btn)btn.hidden=true;return}
  svgs.forEach(s=>s.classList.add("j-arm"));if(mini)mini.classList.add("j-arm");paint(-1);
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{inView=es[0].isIntersecting},{threshold:.2}).observe(wrap);
  const icon=n=>`<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  if(btn)btn.addEventListener("click",()=>{paused=!paused;btn.setAttribute("aria-pressed",String(paused));btn.setAttribute("aria-label",paused?"Play the journey":"Pause the journey");btn.innerHTML=icon(paused?"play":"pause")});
  wrap.addEventListener("mouseenter",()=>{wrap.dataset.hover="1"});
  timer=setTimeout(tick,900)})();

/* v9 · unfold: on touch screens, steps unfold one by one as they scroll into view; tap toggles */
(function(){const items=[...document.querySelectorAll(".uf")];if(!items.length)return;
  const touch=matchMedia("(hover: none)").matches;
  items.forEach(el=>el.addEventListener("click",()=>{if(touch)el.classList.toggle("is-open")}));
  if(!touch||!("IntersectionObserver" in window))return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const i=[...e.target.parentNode.children].indexOf(e.target);setTimeout(()=>e.target.classList.add("is-open"),300+i*450)}),{threshold:.6});
  items.forEach(el=>io.observe(el))})();

/* =====================================================================
   v9 · quick-drop lead capture
   - a slim bar after the hero (Book a call, or leave an email)
   - one polite follow-up after ~60s of reading; dismiss = gone for this visit, a small pill stays
   - no backend? we open a ready-to-send email to hello@ezydrag.com. Never a dark pattern.
   ===================================================================== */
(function(){const Q=(s,r=document)=>r.querySelector(s),QQ=(s,r=document)=>[...r.querySelectorAll(s)];
  const cfg=window.EZY_CONFIG||{},to=cfg.email||"hello@ezydrag.com";
  const ss={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}}};
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
  const done=()=>!!ls.get("ezy-lead");
  const okEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  /* submit handler shared by every [data-lead] form */
  QQ("form[data-lead]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();
    const inp=Q("input[type=email]",f),host=f.closest(".qd,.nudge,.cta")||f.parentNode,out=Q("[data-lead-out]",host)||Q("[data-lead-out]",f.parentNode);
    const em=(inp.value||"").trim();
    if(!okEmail(em)){inp.setAttribute("aria-invalid","true");if(out)out.textContent="Please enter a work email, like you@company.com.";inp.focus();return}
    inp.removeAttribute("aria-invalid");
    const want=(Q("input[name=want]:checked",f)||{}).value||(f.dataset.lead==="case-rightwave"?"the RightWave case study":"a short walkthrough");
    const data={email:em,want,source:f.dataset.lead,page:location.pathname.split("/").pop()||"index.html"};
    const thanks=()=>{ls.set("ezy-lead","1");if(out)out.textContent="Thanks. A person from our team will reply to "+em+".";f.reset();
      const qd=Q("#qd");if(qd)qd.classList.add("done");closeNudge(true);QQ(".nudge-pill").forEach(p=>p.hidden=true)};
    if(cfg.leadUrl){fetch(cfg.leadUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).then(r=>{if(!r.ok)throw 0;thanks()}).catch(()=>{if(out)out.textContent="That didn't go through. Please email "+to+"."})}
    else{const body=`Hi Ezydrag,%0D%0A%0D%0AI'd like: ${encodeURIComponent(want)}.%0D%0AMy email: ${encodeURIComponent(em)}%0D%0A%0D%0A(Sent from ${encodeURIComponent(data.page)})`;
      window.ezyMail(`mailto:${to}?subject=${encodeURIComponent(f.dataset.lead.startsWith("case-")?"Case study request: "+want:"Sales Nurture Agent: "+want)}&body=${body}`);thanks();if(out)out.textContent="Your email should open with the message ready (in your mail app, or in Gmail or Outlook on the web). Or write to "+to+"."}}));

  /* the bar */
  const nudge=Q("#nudge"),pill=Q("#nudge-pill"),qd=Q("#qd"),hero=Q(".hero-band"),endCta=Q("#start, .cta"),foot=Q(".footer");
  let qdClosed=!!ss.get("ezy-qd-x"),pastHero=false,nearEnd=false;
  const sync=()=>{if(!qd)return;const show=!qdClosed&&pastHero&&!nearEnd&&!(nudge&&!nudge.hidden);qd.hidden=false;qd.classList.toggle("on",show);document.body.classList.toggle("qd-on",show);qd.setAttribute("aria-hidden",String(!show));qd.inert=!show};
  if(qd){if(done())qd.classList.add("done");
    if("IntersectionObserver" in window){
      if(hero)new IntersectionObserver(es=>{pastHero=!es[0].isIntersecting&&es[0].boundingClientRect.top<0;sync()}).observe(hero);
      const ends=[endCta,foot].filter(Boolean),vis=new Set();
      const io=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target));nearEnd=vis.size>0;sync()});ends.forEach(x=>io.observe(x))}
    Q("[data-qd-close]",qd).addEventListener("click",()=>{qdClosed=true;ss.set("ezy-qd-x","1");sync()})}

  /* the one follow-up */
  function openNudge(){if(!nudge||done())return;nudge.hidden=false;requestAnimationFrame(()=>nudge.classList.add("on"));if(pill)pill.hidden=true;ss.set("ezy-nudge","shown");sync()}
  function closeNudge(silent){if(!nudge||nudge.hidden)return;nudge.classList.remove("on");setTimeout(()=>{nudge.hidden=true;sync()},silent?0:300);
    if(!silent){ss.set("ezy-nudge","x");if(pill&&!done())pill.hidden=false}}
  window.ezyCloseNudge=closeNudge;
  if(nudge){Q("[data-nudge-close]",nudge).addEventListener("click",()=>closeNudge(false));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!nudge.hidden)closeNudge(false)});
    if(pill)pill.addEventListener("click",()=>{openNudge();const i=Q("input[type=email]",nudge);i&&i.focus()});
    QQ("[data-open-nudge]").forEach(b=>b.addEventListener("click",()=>{openNudge();const i=Q("input[type=email]",nudge);i&&i.focus()}));
    const state=ss.get("ezy-nudge");
    if(state==="x"&&!done()&&pill)pill.hidden=false;
    else if(!state&&!done()&&cfg.nudgeAfterMs!==0){
      /* count reading time only while the tab is visible */
      let left=cfg.nudgeAfterMs||60000,last=Date.now();
      const t=setInterval(()=>{const now=Date.now();if(!document.hidden)left-=now-last;last=now;if(left<=0){clearInterval(t);if(!ss.get("ezy-nudge"))openNudge()}},1000)}}
})();

/* v10 · hero agent demo (n8n-style): pick an agent, watch the brief run step by step; a person approves.
   Auto-advances to the next agent after each run; stops when the visitor picks a tab. Pausable. */
(function(){const root=document.querySelector("[data-tabs]");if(!root)return;
  const tabs=[...root.querySelectorAll(".at-tab")],panels=[...root.querySelectorAll(".at-panel")],btn=root.querySelector("[data-at-toggle]");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,STEP=900;
  let cur=0,k=-1,timer=null,paused=false,auto=true,inView=true;
  const icon=n=>`<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  function show(i,focus){cur=i;tabs.forEach((t,j)=>{const on=j===i;t.setAttribute("aria-selected",on);t.tabIndex=on?0:-1;t.style.setProperty("--at-p",0)});
    panels.forEach((p,j)=>p.hidden=j!==i);if(focus)tabs[i].focus();k=-1;paint()}
  function paint(){const steps=[...panels[cur].querySelectorAll(".at-step")];steps.forEach((s,j)=>{s.classList.toggle("on",j<=k);s.classList.toggle("now",j===k)});
    tabs[cur].style.setProperty("--at-p",steps.length?Math.max(0,(k+1)/steps.length):0)}
  function tick(){clearTimeout(timer);if(paused||!inView||document.hidden){timer=setTimeout(tick,400);return}
    const n=panels[cur].querySelectorAll(".at-step").length;k++;
    if(k>=n){if(auto){show((cur+1)%tabs.length);timer=setTimeout(tick,500)}else{timer=setTimeout(()=>{k=-1;paint();tick()},2400)}return}
    paint();timer=setTimeout(tick,k===n-1?STEP+1600:STEP)}
  tabs.forEach((t,i)=>{t.addEventListener("click",()=>{auto=false;show(i);if(!reduce)tick()});
    t.addEventListener("keydown",e=>{const d=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;if(!d)return;e.preventDefault();auto=false;show((i+d+tabs.length)%tabs.length,true);if(!reduce)tick()})});
  if(reduce){root.classList.remove("arm");if(btn)btn.hidden=true;return}
  root.classList.add("arm");
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{inView=es[0].isIntersecting},{threshold:.2}).observe(root);
  if(btn)btn.addEventListener("click",()=>{paused=!paused;btn.setAttribute("aria-pressed",String(paused));btn.setAttribute("aria-label",paused?"Play the demo":"Pause the demo");btn.innerHTML=icon(paused?"play":"pause")});
  timer=setTimeout(tick,900)})();

/* v15 · Field Notes interactions: motion in view, pause, count-up, quiz, 100-seconds bar, demo */
(function(){const Q=(s,r=document)=>r.querySelector(s),QQ=(s,r=document)=>[...r.querySelectorAll(s)];
  if(!Q(".post")&&!Q(".bl-grid"))return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const figs=QQ("[data-anim]");
  const smil=(f,on)=>QQ("svg",f).forEach(s=>{try{on?s.unpauseAnimations():s.pauseAnimations()}catch(e){}});
  figs.forEach(f=>{smil(f,false);
    QQ(".fig-pause",f).forEach(b=>b.addEventListener("click",()=>{const p=!f.classList.contains("paused");f.classList.toggle("paused",p);b.setAttribute("aria-pressed",String(p));b.textContent=p?"Play":"Pause";smil(f,!p&&f.classList.contains("play"))}))});
  if(!reduce&&"IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{e.target.classList.toggle("play",e.isIntersecting);smil(e.target,e.isIntersecting&&!e.target.classList.contains("paused"))}),{threshold:.25});figs.forEach(f=>io.observe(f))}
  /* count-up stats */
  const nums=QQ(".stat-n[data-count]");
  if(!reduce&&"IntersectionObserver" in window){const io2=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io2.unobserve(e.target);const el=e.target,to=+el.dataset.count,t0=performance.now(),d=900;
    const f=t=>{const k=Math.min(1,(t-t0)/d);el.textContent=Math.round(to*k);if(k<1)requestAnimationFrame(f)};el.textContent="0";requestAnimationFrame(f)}),{threshold:.6});nums.forEach(n=>io2.observe(n))}
  /* quiz */
  const qz=QQ(".qz");if(qz.length){const score=Q(".qz-score");let right=0,done=0;
    qz.forEach(item=>{const ans=item.dataset.ans,out=Q(".qz-a",item);QQ("button",item).forEach(b=>b.addEventListener("click",()=>{if(item.dataset.done)return;item.dataset.done=1;done++;
      const ok=b.dataset.pick===ans;if(ok)right++;b.setAttribute("aria-pressed","true");b.classList.add(ok?"ok":"no");
      Q("b",out).textContent=ok?"Correct.":"Not quite: it's "+(ans==="agent"?"an agent.":"a workflow.");out.hidden=false;
      if(done===qz.length&&score)score.textContent=right===qz.length?`${right}/${qz.length}. You can skip the demo videos.`:`${right}/${qz.length}. Read the 2-minute test once more, then you're set.`}))})}
  /* in-100-seconds bar: reading progress as a stopwatch */
  const fill=Q("[data-h-fill]"),time=Q("[data-h-time]");
  if(fill){const body=Q(".post-body");const upd=()=>{const r=body.getBoundingClientRect(),h=r.height-innerHeight*.5,p=Math.max(0,Math.min(1,(-r.top+innerHeight*.3)/h));fill.style.width=(p*100)+"%";const s=Math.round(p*100);time.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`};addEventListener("scroll",upd,{passive:true});upd()}
  /* labor-illusion demo */
  const dm=Q("[data-demo]");if(dm){const steps=Q(".demo-steps",dm),res=Q(".demo-res",dm);let timer=[];
    QQ("[data-run]",dm).forEach(b=>b.addEventListener("click",()=>{timer.forEach(clearTimeout);timer=[];steps.innerHTML="";res.hidden=true;
      if(b.dataset.run==="fast"||reduce){res.hidden=false;return}
      ["Checking 4 airlines","Comparing 212 fares","Removing the junk","Best 3 found"].forEach((s,i)=>timer.push(setTimeout(()=>{const li=document.createElement("li");li.textContent=s;steps.appendChild(li)},450*(i+1))));
      timer.push(setTimeout(()=>{res.hidden=false},450*5))}))}
})();

/* ---------- v23 · Small surprises. Brand-native, skippable, never in the way. ---------- */
(function(){
const R=matchMedia("(prefers-reduced-motion: reduce)").matches,page=document.body.dataset.page||"";
const ss={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}}};
const botSVG=id=>{const s=document.querySelector(`svg.b-agent[data-agent="${id||"ask"}"]`)||document.querySelector("svg.b-agent");if(!s)return"";const c=s.cloneNode(true);c.removeAttribute("width");c.removeAttribute("height");c.setAttribute("aria-hidden","true");c.removeAttribute("role");c.querySelector("title")&&c.querySelector("title").remove();return c.outerHTML};

/* 1 · for the people who open dev tools */
try{console.log("%c e. %c Ezydrag","background:#2b2e3c;color:#ff9054;font:800 22px system-ui;padding:6px 10px;border-radius:8px","font:700 14px system-ui;color:#2b2e3c");
console.log("Looking under the hood? Same. Write to hello@ezydrag.com with the subject \"console\" and we'll show you how our agents are wired.\nTip: type  ezydrag  anywhere on the page.")}catch(e){}

/* 2 · header hairline only once you scroll */
const hd=document.querySelector(".site-header");if(hd){const f=()=>hd.classList.toggle("scrolled",scrollY>8);addEventListener("scroll",f,{passive:true});f()}

/* 3 · tab title misses you */
const T=document.title;document.addEventListener("visibilitychange",()=>{document.title=document.hidden?"Your leads are waiting…":T});

/* 4 · bot burst */
function burst(n){if(R)return;const wrap=document.createElement("div");wrap.className="burst";wrap.setAttribute("aria-hidden","true");const ids=["nurture","emails","qa","qbr","pta","voice","ask","prospect","govern"];
  for(let i=0;i<(n||18);i++){const s=document.createElement("span");s.innerHTML=botSVG(ids[i%ids.length]);s.style.left=(10+Math.random()*80)+"vw";s.style.top="105vh";wrap.appendChild(s);
    const dx=(Math.random()-.5)*240,up=40+Math.random()*60,rot=(Math.random()-.5)*540,d=1400+Math.random()*900;
    s.animate([{transform:"translate(0,0) rotate(0) scale(.6)",opacity:1},{transform:`translate(${dx/2}px,-${up}vh) rotate(${rot/2}deg) scale(1.1)`,opacity:1,offset:.55},{transform:`translate(${dx}px,-${up-18}vh) rotate(${rot}deg) scale(.9)`,opacity:0}],{duration:d,easing:"cubic-bezier(.2,.75,.2,1)",delay:i*40,fill:"forwards"})}
  document.body.appendChild(wrap);setTimeout(()=>wrap.remove(),3200)}
let tt;function toast(msg,id){let t=document.querySelector(".toast-fun");if(!t){t=document.createElement("div");t.className="toast-fun";t.setAttribute("role","status");document.body.appendChild(t)}
  t.innerHTML=`<span style="width:28px;height:28px;display:inline-block">${botSVG(id)}</span>${msg}`;t.querySelector("svg")&&(t.querySelector("svg").style.cssText="width:28px;height:28px");requestAnimationFrame(()=>t.classList.add("on"));clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),3200)}

/* 5 · click the logo five times */
const logo=document.querySelector(".site-header .logo");let lc=0,lt;if(logo)logo.addEventListener("click",e=>{lc++;clearTimeout(lt);lt=setTimeout(()=>lc=0,1200);if(lc>=3)e.preventDefault();if(lc===5){lc=0;burst(24);toast("You found the bot party. All nine agents say hi.","nurture")}});

/* 6 · type "ezydrag" or the Konami code */
let buf="";const K="ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";let kb=[];
addEventListener("keydown",e=>{const tg=e.target;if(tg&&(tg.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(tg.tagName)))return;
  buf=(buf+(e.key.length===1?e.key.toLowerCase():"")).slice(-7);if(buf==="ezydrag"){buf="";burst(14);toast("Agent mode: on. A person still approves.","ask")}
  kb.push(e.key);kb=kb.slice(-10);if(kb.join(",")===K){kb=[];document.documentElement.classList.add("bots-spin");setTimeout(()=>document.documentElement.classList.remove("bots-spin"),1600);toast("↑↑↓↓←→←→BA. Old school. Respect.","qa")}});

/* 7 · every agent has a line, on hover */
const Q={nurture:"I never forget a follow-up. Ever.",emails:"Draft ready. Waiting for your yes.",qa:"I clicked every link. Twice.",qbr:"Your quarter, in eight slides.",pta:"Who owns this? Now someone does.",voice:"Ring ring. Only if they said yes.",ask:"Ask me anything. Approved answers only.",prospect:"Funding round? Already on it.",govern:"I saw that. It's in the log."};
let bub;document.addEventListener("mouseover",e=>{const s=e.target.closest&&e.target.closest("svg.b-agent");if(!s||s.closest("#biz-launch,.peek,.burst,.toast-fun,#biz"))return;const q=Q[s.dataset.agent];if(!q)return;
  if(!bub){bub=document.createElement("div");bub.className="say-bubble";bub.setAttribute("aria-hidden","true");document.body.appendChild(bub)}
  const r=s.getBoundingClientRect();bub.textContent=q;bub.style.position="absolute";bub.style.left=(r.left+r.width/2+scrollX)+"px";bub.style.top=(r.top+scrollY)+"px";bub.classList.add("on");
  s.addEventListener("mouseleave",()=>bub.classList.remove("on"),{once:true})});

/* 8 · reach the end of a page and someone peeks up to say hi */
const P={index:["You scrolled the whole thing. Book a call? I'll hold the door.","nurture"],agents:["Sixteen agents. You've met them all. Who's first?","emails"],product:["Four steps. No surprises. Well, except me.","pta"],
  pricing:["Psst. Pilots are the quickest yes.","qbr"],security:["You read the limits. Most people don't. We like you.","qa"],about:["Nice to meet you too.","ask"],faq:["Still curious? Ask me, bottom right.","ask"],
  customers:["Want your logo up there? Start with one agent.","nurture"],trends:["Numbers with sources. We checked.","qbr"],blog:["New notes every two weeks. Same bat-channel.","pta"],demo:["Good choice. A real person reads this.","ask"]};
const msg=P[page]||(page.startsWith("blog-")?["You read it all. That's rarer than a clean CRM.","qa"]:null);
if(msg&&page!=="404"){let shown=ss.get("peek-"+page);const io=new IntersectionObserver(es=>{if(shown||!es[0].isIntersecting)return;shown=1;ss.set("peek-"+page,"1");io.disconnect();
  const pk=document.createElement("div");pk.className="peek";pk.setAttribute("role","status");pk.innerHTML=`<span class="pk-say">${msg[0]}<button class="pk-x" type="button" aria-label="Dismiss">✕</button></span><span class="pk-bot">${botSVG(msg[1])}</span>`;
  document.body.appendChild(pk);requestAnimationFrame(()=>requestAnimationFrame(()=>pk.classList.add("on")));const close=()=>{pk.classList.remove("on");setTimeout(()=>pk.remove(),700)};pk.querySelector(".pk-x").addEventListener("click",close);setTimeout(close,6000)},{threshold:.6});
  const end=document.querySelector("footer .foot-bottom, footer > :last-child, footer");if(end)io.observe(end)}

/* 9 · FAQ: some searches get a special answer */
const fq=document.getElementById("faq-search"),empty=document.querySelector("[data-faq-empty]");
if(fq&&empty){const J=[[/meaning of life|42/,"42. But that answer isn't approved yet."],[/\b(joke|funny)\b/,"Why did the agent wait? Human approval. Every time."],[/coffee|chai|tea/,"Chai, two sugars. The agents don't drink it, the people do."],[/hire|job|career/,"Not on this page. Write to hello@ezydrag.com and a person will reply."],[/skynet|terminator|take over/,"Not on our watch. Every important step waits for a person."]];
  const h=empty.querySelector("h3"),d=h?h.textContent:"";fq.addEventListener("input",()=>{const v=fq.value.toLowerCase();const j=J.find(([re])=>re.test(v));if(h)h.textContent=j?j[1]:d})}
})();

/* v25 · hero word swap. Pauses on hover, when hidden or out of view; off with reduced motion. */
(function(){const c=document.querySelector(".hchip[data-swap]");if(!c||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 const words=c.dataset.swap.split(","),w=c.querySelector(".hs-w");let i=0,hover=false,vis=true;
 /* measure the whole chip (dot, gap, padding) with the next word, so padding is always the same on both sides */
 const meas=t=>{const m=c.cloneNode(true);m.style.cssText="position:absolute;visibility:hidden;width:auto;left:-9999px";m.querySelector(".hs-w").textContent=t;m.querySelector(".hs-w").className="hs-w";c.parentNode.appendChild(m);const x=m.getBoundingClientRect().width;m.remove();return Math.ceil(x)};
 c.addEventListener("mouseenter",()=>hover=true);c.addEventListener("mouseleave",()=>hover=false);
 if("IntersectionObserver" in window)new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(c);
 addEventListener("resize",()=>{c.style.width=meas(words[i])+"px"});
 setTimeout(()=>{c.style.width=meas(words[i])+"px";setInterval(()=>{if(hover||!vis||document.hidden)return;i=(i+1)%words.length;
   w.classList.remove("in");w.classList.add("out");setTimeout(()=>{w.textContent=words[i];c.style.width=meas(words[i])+"px";w.classList.remove("out");void w.offsetWidth;w.classList.add("in")},300)},2200)},(window.EZY_CURTAIN_MS||0)+2200)})();

/* privacy notice: highlight the section you're reading in the side list */
(function(){const nav=document.querySelector(".pn .fq-nav");if(!nav||!("IntersectionObserver" in window))return;const links=[...nav.querySelectorAll("a[data-faq-jump]")];
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("on",l.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-30% 0px -60% 0px"});
 document.querySelectorAll(".pn .fq-sec").forEach(s=>io.observe(s))})();

/* v28/v29 · Scroll: every page opens at the top (unless the link targets a section). Works when the site sits inside a
   host frame too: we reset the frame's own scroll AND ask the host to bring the top of the page into view. Tabs bring
   their section back into view; a "Top" button appears after scrolling. */
(function(){
 try{if("scrollRestoration" in history)history.scrollRestoration="manual"}catch(e){}
 const toTop=()=>{if(location.hash&&location.hash.length>1)return;const h=document.documentElement;const old=h.style.scrollBehavior;h.style.scrollBehavior="auto";
  window.scrollTo(0,0);h.scrollTop=0;document.body.scrollTop=0;
  try{(document.getElementById("top")||document.body).scrollIntoView({block:"start",behavior:"instant"})}catch(e){try{document.body.scrollIntoView(true)}catch(_){}}
  h.style.scrollBehavior=old};
 toTop();document.addEventListener("DOMContentLoaded",toTop);addEventListener("load",()=>{toTop();setTimeout(toTop,120)});
 addEventListener("pageshow",e=>{if(e.persisted)toTop()});
 /* clicking any link to another page: go up first, so nothing is left scrolled in the host while the next page loads */
 document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("a[href]");if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==="_blank")return;
  const u=new URL(a.getAttribute("href"),location.href);if(u.origin!==location.origin||u.protocol==="mailto:")return;
  const samePage=u.pathname===location.pathname;if(samePage&&u.hash)return;
  const h=document.documentElement;h.style.scrollBehavior="auto";try{(document.getElementById("top")||document.body).scrollIntoView({block:"start",behavior:"instant"})}catch(_){};window.scrollTo(0,0)},true);
 const sm=matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";
 document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest('[role="tab"]');if(!t)return;
  const box=t.closest("section")||t.parentElement;if(!box)return;const top=box.getBoundingClientRect().top;if(top<0)scrollBy({top:top-80,behavior:sm})});
 const b=document.getElementById("to-top");if(!b)return;
 const f=()=>{const on=scrollY>innerHeight*1.2;b.hidden=!on;b.classList.toggle("on",on)};addEventListener("scroll",f,{passive:true});f();
 b.addEventListener("click",()=>{scrollTo({top:0,behavior:sm});try{(document.getElementById("top")||document.body).scrollIntoView({block:"start",behavior:sm})}catch(_){}
  const m=document.getElementById("main");if(m){m.setAttribute("tabindex","-1");setTimeout(()=>m.focus({preventScroll:true}),400)}});
})();

/* footprint map: live time in Kolkata; pause the SVG pulses when the map is off screen or motion is reduced */
(function(){const b=document.querySelector("[data-ist]");if(b){const f=()=>{try{b.textContent=new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date())}catch(e){}};f();setInterval(f,30000)}
 const svg=document.querySelector(".map svg");if(!svg||!svg.pauseAnimations)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches){svg.pauseAnimations();return}
 if("IntersectionObserver" in window)new IntersectionObserver(e=>e[0].isIntersecting?svg.unpauseAnimations():svg.pauseAnimations()).observe(svg)})();

/* ---------- Email links that work with or without a mail app ----------
   Phones and tablets: the native mail app (plain mailto). Computers: we try the installed mail app first
   (Apple Mail, Outlook, Thunderbird...). If nothing responds, a small chooser opens Gmail, Outlook or Yahoo
   on the web in a NEW TAB, or copies the address. The choice is remembered on that device. */
(function(){
"use strict";
const UA=navigator.userAgent||"";
const MOBILE=/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(UA)||(navigator.maxTouchPoints>1&&/Mac/i.test(navigator.platform||""));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const parse=h=>{const u=h.replace(/^mailto:/i,"");const i=u.indexOf("?");const to=decodeURIComponent(i<0?u:u.slice(0,i));const q=new URLSearchParams(i<0?"":u.slice(i+1));return{to,subject:q.get("subject")||"",body:q.get("body")||""}};
const WEB={
  gmail:{name:"Gmail",url:m=>"https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(m.to)+"&su="+encodeURIComponent(m.subject)+"&body="+encodeURIComponent(m.body)},
  outlook:{name:"Outlook",url:m=>"https://outlook.live.com/mail/0/deeplink/compose?to="+encodeURIComponent(m.to)+"&subject="+encodeURIComponent(m.subject)+"&body="+encodeURIComponent(m.body)},
  yahoo:{name:"Yahoo Mail",url:m=>"https://compose.mail.yahoo.com/?to="+encodeURIComponent(m.to)+"&subject="+encodeURIComponent(m.subject)+"&body="+encodeURIComponent(m.body)}
};
const openWeb=(k,m)=>{const w=window.open(WEB[k].url(m),"_blank","noopener");if(!w)location.href=WEB[k].url(m)};
let css=false;
function style(){if(css)return;css=true;const s=document.createElement("style");s.textContent=
".ezm-bg{position:fixed;inset:0;z-index:2147483000;background:rgba(43,46,60,.55);display:grid;place-items:center;padding:16px}"+
".ezm{background:#fff;color:#2b2e3c;border:2px solid #2b2e3c;border-radius:18px;box-shadow:6px 6px 0 #ff9054;max-width:420px;width:100%;padding:22px;font:500 15px/1.45 Figtree,system-ui,sans-serif}"+
".ezm h2{margin:0 0 4px;font:800 20px/1.2 'Bricolage Grotesque',Figtree,system-ui,sans-serif}.ezm p{margin:0 0 14px;color:#5b5f71}"+
".ezm .row{display:grid;gap:8px}.ezm a.b,.ezm button.b{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border:2px solid #2b2e3c;border-radius:12px;background:#fff;color:#2b2e3c;font:700 15px Figtree,system-ui,sans-serif;text-decoration:none;cursor:pointer}"+
".ezm a.b:hover,.ezm button.b:hover,.ezm a.b:focus-visible,.ezm button.b:focus-visible{background:#fff1e8;outline:3px solid #ff9054;outline-offset:1px}"+
".ezm .lab{display:flex;gap:8px;align-items:center;margin:14px 0 0;color:#5b5f71;font-size:13px}.ezm .x{margin-top:12px;background:none;border:0;color:#5b5f71;font:600 14px Figtree,system-ui,sans-serif;cursor:pointer;text-decoration:underline;padding:4px 0}";
document.head.appendChild(s)}
function chooser(m){
  style();const bg=document.createElement("div");bg.className="ezm-bg";
  bg.innerHTML='<div class="ezm" role="dialog" aria-modal="true" aria-labelledby="ezm-h"><h2 id="ezm-h">Send an email</h2><p>No mail app opened. Pick where to write to <b></b>. It opens in a new tab.</p><div class="row"></div><label class="lab"><input type="checkbox" checked> Remember my choice on this device</label><button class="x" type="button" data-close>Close</button></div>';
  bg.querySelector("b").textContent=m.to;const row=bg.querySelector(".row"),rem=bg.querySelector("input"),prev=document.activeElement;
  const done=()=>{bg.remove();document.removeEventListener("keydown",key,true);prev&&prev.focus&&prev.focus()};
  const key=e=>{if(e.key==="Escape")done()};document.addEventListener("keydown",key,true);
  Object.keys(WEB).forEach(k=>{const a=document.createElement("a");a.className="b";a.href=WEB[k].url(m);a.target="_blank";a.rel="noopener";a.innerHTML="<span>Open "+WEB[k].name+"</span><span aria-hidden='true'>↗</span>";
    a.addEventListener("click",()=>{if(rem.checked)store.set("ezy-mail",k);setTimeout(done,50)});row.appendChild(a)});
  const c=document.createElement("button");c.type="button";c.className="b";c.innerHTML="<span>Copy the address</span><span aria-hidden='true'>⧉</span>";
  c.addEventListener("click",()=>{const ok=()=>{c.firstChild.textContent="Copied: "+m.to};if(navigator.clipboard)navigator.clipboard.writeText(m.to).then(ok,()=>{});else ok()});row.appendChild(c);
  bg.addEventListener("click",e=>{if(e.target===bg||e.target.hasAttribute("data-close"))done()});document.body.appendChild(bg);row.firstChild.focus()}
/* Try the installed mail app. If the page never loses focus within ~1.4s, nothing handled the link. */
function tryNative(href,m){
  let handled=false;const mark=()=>{handled=true};
  addEventListener("blur",mark,{once:true});document.addEventListener("visibilitychange",mark,{once:true});addEventListener("pagehide",mark,{once:true});
  const a=document.createElement("a");a.href=href;a.setAttribute("data-ezy-native","");a.style.display="none";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>{removeEventListener("blur",mark);document.removeEventListener("visibilitychange",mark);removeEventListener("pagehide",mark);if(!handled)chooser(m)},1400)}
window.ezyMail=function(href){
  const m=parse(href);
  if(MOBILE){location.href=href;return}                              /* phones and tablets: native app */
  const pref=store.get("ezy-mail");if(pref&&WEB[pref]){openWeb(pref,m);return}   /* chose a web mail before */
  tryNative(href,m)};
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest('a[href^="mailto:" i]');if(!a||a.hasAttribute("data-ezy-native")||MOBILE||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();window.ezyMail(a.getAttribute("href"))},true);
})();

