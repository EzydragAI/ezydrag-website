/* ---------- home: live run feed + pinned "one campaign" story ---------- */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const ico=n=>`<svg class="i" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
const fmt=n=>Math.round(n).toLocaleString("en-US");

/* Live run feed: one agent event about every 1.4s, synced with packets on the hero flow */
const EV=[
 ["users","Sales Nurture","Captured 14 new leads from the Q4 webinar",{rows:14}],
 ["search","Sales Nurture","Matched Acme Corp to an existing Salesforce account",{}],
 ["gauge","Sales Nurture","Scored Priya Sharma 82 / 100: strong fit, high intent",{}],
 ["shield","Approvals","Next email for Priya is waiting for your approval",{appr:1}],
 ["tick","Approvals","Campaign manager approved 6 nurture emails",{appr:-1}],
 ["cal","Sales Nurture","Meeting booked: Acme Corp with Tom Reed, Tue 11:00",{}],
 ["star","Sales Nurture","Acme Corp marked Closed Won in Salesforce",{}],
 ["check","Email QA","Caught a broken link before send",{caught:1}]];
$$("[data-feed]").forEach(root=>{
 const txt=$("[data-feed-txt]",root),ag=$("[data-feed-agent]",root),ic=$("[data-feed-ico]",root),pb=$("[data-feed-pause]",root),row=$(".feed-row",root);
 const n={rows:0,caught:0,appr:0},el={};$$("[data-feed-n]",root).forEach(e=>el[e.dataset.feedN]=e);
 let i=0,t=null,paused=false;const svg=$("[data-flow]");
 function show(){const [ic0,agent,msg,d]=EV[i%EV.length];i++;
  for(const k in d){n[k]=Math.max(0,n[k]+d[k]);if(window.gsap&&!reduce){const o={v:+el[k].dataset.v||0};el[k].dataset.v=n[k];window.gsap.to(o,{v:n[k],duration:.6,ease:"none",onUpdate:()=>el[k].textContent=fmt(o.v)})}else el[k].textContent=fmt(n[k])}
  row.classList.remove("in");void row.offsetWidth;row.classList.add("in");
  const AID={"Sales Nurture":"nurture","Email QA":"qa","Email Creation":"emails","QBR Generator":"qbr","AI PTA":"pta"}[agent];
  ic.innerHTML=AID?`<img src="assets/brand/agent-${AID}.svg" alt="" width="30" height="30">`:ico(ic0);txt.textContent=msg;ag.textContent=agent;
  if(svg&&window.ezyPulse)window.ezyPulse(i%3)}
 const play=()=>{if(t||reduce)return;t=setInterval(()=>{if(!document.hidden)show()},1400);pb.innerHTML=`${ico("pause")}<span>Pause</span>`;pb.setAttribute("aria-pressed","false")};
 const stop=()=>{clearInterval(t);t=null;pb.innerHTML=`${ico("play")}<span>Play</span>`;pb.setAttribute("aria-pressed","true")};
 pb.addEventListener("click",()=>{paused=!paused;paused?stop():play()});
 const start=()=>{show();if(reduce){stop();return}play()};
 setTimeout(start,(window.EZY_CURTAIN_MS||0)*.82+6000*(reduce?0:1));
});

/* Pinned story: the active beat drives the app mock */
$$("[data-story]").forEach(root=>{
 const beats=$$(".beat",root),views=$$(".sv",root),app=$("[data-st-app]",root),icoEl=$("[data-st-ico]",root),num=$("[data-st-n]",root),prog=$("[data-st-prog]",root);let cur=-1;
 function set(k){if(k===cur)return;cur=k;beats.forEach((b,j)=>b.classList.toggle("on",j===k));views.forEach((v,j)=>v.classList.toggle("on",j===k));
  const b=beats[k];app.textContent=b.dataset.app;icoEl.innerHTML=ico(b.dataset.ico);num.textContent=`${k+1} / ${beats.length}`;prog.style.width=((k+1)/beats.length*100)+"%";
  const v=views[k];if(window.gsap&&!reduce){window.gsap.fromTo($$(".sv-h, table, .mock-mail, .qa-row, .approve, .paths span, .mini-chart i, .mini",v),{opacity:0,y:13},{opacity:1,y:0,duration:.3,stagger:.08,ease:"none"})}}
 if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)set(+e.target.dataset.b)})},{rootMargin:"-45% 0px -45% 0px"});beats.forEach(b=>io.observe(b))}
 set(0)});
})();
