/* ---------- motion: GSAP, linear easing. Only explains hierarchy, flow and state. ---------- */
(function(){
const G=window.gsap,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const steps=$$(".steps3 li");
if(!G||reduce){steps.forEach(li=>li.classList.add("lit"));return}
document.documentElement.classList.add("gs");
if(window.ScrollTrigger)G.registerPlugin(window.ScrollTrigger);
G.defaults({ease:"none"});
const delay=(window.EZY_CURTAIN_MS||0)/1000*.8+.05;

function split(el){const out=[];const walk=node=>{[...node.childNodes].forEach(n=>{if(n.nodeType===3){const parts=n.textContent.split(/(\s+)/);const frag=document.createDocumentFragment();
  parts.forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return}const s=document.createElement("span");s.className="w";s.style.display="inline-block";s.textContent=p;out.push(s);frag.appendChild(s)});n.replaceWith(frag)}
  else if(n.nodeType===1&&!n.matches("svg"))walk(n)})};walk(el);
  return out}

function drawIn(paths,tl,at,dur){paths.forEach(p=>{const L=p.getTotalLength();G.set(p,{strokeDasharray:L,strokeDashoffset:L})});tl.to(paths,{strokeDashoffset:0,duration:dur,stagger:.08},at)}
function travel(dots,paths,dur){const tl=G.timeline();dots.forEach((d,i)=>{const p=paths[i],L=p.getTotalLength(),o={t:0};
  tl.set(d,{opacity:1},0).to(o,{t:1,duration:dur,onUpdate:()=>{const pt=p.getPointAtLength(o.t*L);d.setAttribute("cx",pt.x);d.setAttribute("cy",pt.y)}},i*.12).set(d,{opacity:0},">")});return tl}

/* product flow: sources -> context graph -> agents, synced to the 3 step cards */
function flow(svg,tl,at){const wi=$$(".wire.in",svg),wo=$$(".wire.out",svg),pi=$$(".pkt.pin",svg),po=$$(".pkt.pout",svg),main=$(".tile.main",svg),srcs=$$(".tile.src",svg),agts=$$(".tile.agt",svg);
  const lit=i=>()=>steps[i]&&steps[i].classList.add("lit");
  tl.from(srcs,{opacity:0,x:-21,duration:.35,stagger:.12},at).call(lit(0));
  drawIn(wi,tl,">",.6);
  tl.from(main,{opacity:0,scale:.85,transformOrigin:"50% 50%",duration:.4},"<.2");
  tl.add(travel(pi,wi,.9)).call(lit(1));
  drawIn(wo,tl,">-.2",.6);
  tl.from(agts,{opacity:0,x:21,duration:.35,stagger:.12},"<.2");
  tl.add(travel(po,wo,.9)).call(lit(2))}
function replayPackets(svg){const t=G.timeline();t.add(travel($$(".pkt.pin",svg),$$(".wire.in",svg),.9));t.add(travel($$(".pkt.pout",svg),$$(".wire.out",svg),.9))}

/* home: everything readable inside ~0.7s (the 3-second test), then the eye drops to the CTA and the journey */
const hero=$(".hero-seq");
if(hero){const tl=G.timeline({delay:(window.EZY_CURTAIN_MS||0)/1000*.8+.05}),has=x=>x&&(!Array.isArray(x)||x.length);
  const words=split($("h1",hero));
  tl.from($(".pill",hero),{opacity:0,y:8,duration:.2})
    .from(words,{opacity:0,yPercent:60,filter:"blur(10px)",duration:.55,ease:"expo.out",stagger:.035},"<.05")
    .from($(".hchip",hero)||[],{scale:.6,duration:.5,ease:"back.out(2.2)",transformOrigin:"50% 60%"},"-=.35")
    .from($(".sub",hero),{opacity:0,y:8,filter:"blur(6px)",duration:.4,ease:"expo.out"},"-=.35")
    .from($(".cta-wrap",hero),{opacity:0,y:8,duration:.22},"-=.1");
  if(has($(".cta-ring",hero)))tl.fromTo($(".cta-ring",hero),{opacity:.9,scale:1},{opacity:0,scale:1.18,duration:.5},">-.05");
  tl.from($$(".hero-ctas .link, .trust",hero),{opacity:0,duration:.2},"<");
  if(has($(".journey-wrap",hero)))tl.from($(".journey-wrap",hero),{opacity:0,y:13,duration:.3},"<.1");
  if(has($(".at",hero)))tl.from($(".at",hero),{opacity:0,y:13,duration:.3},"<.1")}

/* inner pages: headline words, then the logo-tile cluster assembles around its main tile */
$$(".page-hero").forEach(ph=>{const tl=G.timeline({delay});const h1=$("h1",ph);if(h1)tl.from(split(h1),{opacity:0,yPercent:60,filter:"blur(10px)",duration:.55,ease:"expo.out",stagger:.035});
  tl.from($$(".sub,.hero-ctas",ph),{opacity:0,y:8,duration:.3,stagger:.1},"<.25");
  const art=$("[data-art]",ph);if(art){tl.from($(".tile.main",art),{opacity:0,scale:.85,transformOrigin:"50% 50%",duration:.4},"<");drawIn($$(".conn",art),tl,">",.5);tl.from($$(".tile.sat",art),{opacity:0,duration:.3,stagger:.12},"<.2")}});

/* Linear-style headline reveal: each section h2 rises word by word out of a soft blur, once */
if(window.ScrollTrigger)$$("main h2").filter(h=>!h.closest(".hero-band,.acc,.bubble,.fq-sec")).forEach(h=>{const w=split(h);G.from(w,{opacity:0,yPercent:50,filter:"blur(8px)",duration:.6,ease:"expo.out",stagger:.03,scrollTrigger:{trigger:h,start:"top 88%",once:true}})});

/* sections: reveal in reading order so the eye follows hierarchy */
if(window.ScrollTrigger){const items=$$(".rv").filter(el=>!el.closest(".hero-band"));G.set(items,{opacity:.2,y:21});
  ScrollTrigger.batch(items,{start:"top 90%",once:true,onEnter:b=>G.to(b,{opacity:1,y:0,duration:.45,stagger:.09})});
  $$("[data-art]").filter(a=>!a.closest(".page-hero")).forEach(a=>{const t=G.timeline({scrollTrigger:{trigger:a,start:"top 85%",once:true}});t.from($(".tile.main",a),{opacity:0,scale:.85,transformOrigin:"50% 50%",duration:.35});drawIn($$(".conn",a),t,">",.4);t.from($$(".tile.sat",a),{opacity:0,duration:.25,stagger:.1},"<.1")})}
})();
