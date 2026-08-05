"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar, Footer, scrollToSection } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { CustomCursor } from "@/components/CustomCursor";
import Lenis from "lenis";

const ThreeCanvas = dynamic(
  () => import("@/components/ThreeCanvas").then((m) => m.ThreeCanvas),
  { ssr: false }
);

const SERVICES = [
  { num: "01", title: "Workflow Automation" },
  { num: "02", title: "Custom AI Agents" },
  { num: "03", title: "Data Intelligence" },
  { num: "04", title: "Managed Deployment" },
];

const PRODUCTS = [
  {
    id: "ezyleadz",
    name: "ezyleadz",
    tagline: "AI Lead Generator",
    desc: "Finds, qualifies and nurtures leads across platforms around the clock — so your pipeline never sleeps.",
    price: "₹1999",
  },
  {
    id: "ezyhirez",
    name: "ezyhirez",
    tagline: "AI End-to-End Hiring Solution",
    desc: "Automates sourcing, screening and scheduling — a full hiring workflow from requisition to offer.",
    price: "₹1999",
  },
  {
    id: "ezytrackz",
    name: "ezytrackz",
    tagline: "AI Project Tracker",
    desc: "Tracks progress, flags risks and keeps teams aligned with intelligent project insights in real time.",
    price: "₹1999",
  },
];

function Loader({ progress }: { progress: number }) {
  const pct = Math.min(100, Math.max(0, Math.floor(progress)));
  return (
    <div className="loader-wrap" role="status" aria-live="polite" aria-label="Loading">
      <div className="loader-logo">
        <img src="/images/logo1.png" alt="" aria-hidden="true" className="loader-logo__mark" />
        EZYDRAG<span className="loader-logo__reg">®</span>
      </div>
      <div className="loader-bar-bg">
        <div className="loader-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="loader-pct">{pct}%</span>
    </div>
  );
}

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    loading: boolean;
    success: boolean;
    message: string | null;
  }>({ loading: false, success: false, message: null });
  const [showMsg, setShowMsg] = useState(false);
  const msgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
    };
  }, []);

  const sceneReadyRef = useRef(false);
  useEffect(() => {
    sceneReadyRef.current = sceneReady;
  }, [sceneReady]);

  // Loader: ramp to ~90%, finish when scene ready (or fallback timeout)
  useEffect(() => {
    let alive = true;
    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();
    const minMs = 1100;
    const maxMs = 3200;

    const tick = (now: number) => {
      if (!alive) return;
      const elapsed = now - start;
      const ready = sceneReadyRef.current;
      let pct: number;
      if (!ready) {
        pct = Math.min(88, 12 + (elapsed / maxMs) * 76);
      } else {
        pct = Math.min(100, 88 + ((elapsed - minMs) / 350) * 12);
        if (elapsed < minMs) pct = Math.min(96, 88 + (elapsed / minMs) * 8);
      }
      if (elapsed >= maxMs) pct = 100;
      // Floor before setState: the loader displays whole percents, so identical
      // values let React bail out instead of re-rendering the page every frame.
      setLoadPct(Math.floor(pct));

      if ((ready && elapsed >= minMs && pct >= 100) || elapsed >= maxMs) {
        doneTimer = setTimeout(() => {
          if (alive) setLoading(false);
        }, 200);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Fallback if WebGL never reports ready
    const fallback = setTimeout(() => {
      sceneReadyRef.current = true;
      setSceneReady(true);
    }, 2400);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, []);

  // Sync interface translate + spacer height + --scroll
  useEffect(() => {
    const scrollEl = scrollRef.current;
    const interfaceEl = interfaceRef.current;
    const spacerEl = spacerRef.current;
    if (!scrollEl || !interfaceEl || !spacerEl) return;

    // Cached geometry so the hot scroll path only reads scrollTop.
    // Refreshed by syncLayout on resize / content changes.
    let maxScroll = 0;
    let vh = 1;

    const onScroll = () => {
      const top = Math.min(scrollEl.scrollTop, maxScroll);
      const progress = maxScroll > 0 ? top / maxScroll : 0;
      document.documentElement.style.setProperty("--scroll", progress.toFixed(4));
      interfaceEl.style.transform = `translate3d(0, ${-top}px, 0)`;

      const heroFade = Math.min(1, Math.max(0, (top - vh * 0.4) / (vh * 0.5)));
      document.documentElement.style.setProperty("--header-opacity", (1 - heroFade).toFixed(3));
      document.documentElement.classList.toggle("is-past-hero", heroFade >= 1);
    };

    const syncLayout = () => {
      vh = window.innerHeight || 1;
      const prevMax = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
      const progress = prevMax > 0 ? scrollEl.scrollTop / prevMax : 0;
      spacerEl.style.height = `${Math.max(0, interfaceEl.scrollHeight - scrollEl.clientHeight)}px`;
      const nextMax = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
      maxScroll = nextMax;
      scrollEl.scrollTop = progress * nextMax;
      onScroll();
    };

    syncLayout();

    const ro = new ResizeObserver(() => syncLayout());
    ro.observe(interfaceEl);
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncLayout, { passive: true });
    window.visualViewport?.addEventListener("resize", syncLayout);

    return () => {
      ro.disconnect();
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncLayout);
      window.visualViewport?.removeEventListener("resize", syncLayout);
    };
  }, []);

  // Lenis only on fine pointer + no reduced motion (desktop-like)
  useEffect(() => {
    if (loading) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scrollEl = scrollRef.current;
    const content = scrollEl?.querySelector(".scroll-content") as HTMLElement | null;
    if (!scrollEl || !content) return;

    const lenis = new Lenis({
      wrapper: scrollEl,
      content,
      smoothWheel: true,
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [loading]);

  const goContact = useCallback(() => {
    scrollToSection(scrollRef.current, "contact");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, message: null });
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setFormStatus({ loading: false, success: true, message: json.message });
        (e.target as HTMLFormElement).reset();
      } else throw new Error(json.message);
    } catch (err) {
      setFormStatus({
        loading: false,
        success: false,
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
    setShowMsg(true);
    // Clear any previous timer so a rapid resubmit isn't hidden early.
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
    msgTimerRef.current = setTimeout(() => setShowMsg(false), 3500);
  };

  return (
    <div className={`experience-root${loading ? " is-loading" : ""}`}>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loader-layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <Loader progress={loadPct} />
          </motion.div>
        )}
      </AnimatePresence>

      <CustomCursor />
      <ThreeCanvas
        scrollRef={scrollRef}
        onReady={() => setSceneReady(true)}
      />

      <div className="progress" aria-hidden="true">
        <div className="progress__bar" />
      </div>

      <Navbar scrollRef={scrollRef} />

      <motion.div
        className="canvas-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        <div ref={scrollRef} className="scroll-container">
          <div className="scroll-content">
            <div className="scroll-sticky">
              <div ref={interfaceRef} className="interface-wrap">
                <div className="interface">
                  <HeroSection onCta={goContact} />

                  <section id="manifesto" className="section section--left" data-num="01">
                    <p className="kicker">01 — Manifesto</p>
                    <h2>
                      The future runs
                      <br />
                      on <em>autopilot</em>.
                    </h2>
                    <p className="body">
                      Every pixel has purpose. Every workflow has a smarter version.
                      We design intelligent systems that breathe, react and grow —
                      the internet already has enough tools that feel like paperwork.
                    </p>
                    <div className="marquee" aria-hidden="true">
                      <div className="marquee__track">
                        <span>AUTONOMOUS — INTELLIGENT — UNSTOPPABLE — </span>
                        <span>AUTONOMOUS — INTELLIGENT — UNSTOPPABLE — </span>
                      </div>
                    </div>
                  </section>

                  <section id="services" className="section section--left" data-num="02">
                    <p className="kicker">02 — Services</p>
                    <ul className="services">
                      {SERVICES.map((svc) => (
                        <li key={svc.num} data-hover>
                          <span>{svc.num}</span>
                          {svc.title}
                        </li>
                      ))}
                    </ul>
                    <p className="hint">→ explore the objects</p>
                  </section>

                  <section id="products" className="section section--products" data-num="03">
                    <p className="kicker">03 — Products</p>
                    <h2>
                      Built to <em>ship</em>.
                    </h2>
                    <p className="body products-intro">
                      Ready-to-deploy AI products for growth, hiring and delivery —
                      each one priced simply, managed end to end.
                    </p>
                    <div className="product-list">
                      {PRODUCTS.map((product) => (
                        <article key={product.id} className="product-row" data-hover>
                          <div className="product-main">
                            <div className="product-heading">
                              <h3 className="product-name">{product.name}</h3>
                              <span className="product-tagline">{product.tagline}</span>
                            </div>
                            <p className="product-desc">{product.desc}</p>
                          </div>
                          <div className="product-aside">
                            <div className="product-price">
                              <span className="product-price__val">{product.price}</span>
                              <span className="product-price__unit">/mo</span>
                            </div>
                            <button type="button" className="product-cta" disabled>
                              Subscribe
                              <span className="product-cta__soon">Coming Soon</span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section id="contact" className="section section--center section--contact" data-num="04">
                    <p className="kicker">04 — Contact</p>
                    <h2>
                      Send us a <em>mail</em>.
                    </h2>

                    <a href="mailto:admin@ezydrag.in" className="cta cta--big">
                      admin@ezydrag.in
                    </a>

                    <div className="contact-form-wrap">
                      <p className="form-kicker">Tell us your concern</p>
                      <form onSubmit={handleSubmit} className="contact-form">
                        <div>
                          <label className="form-label" htmlFor="name">Full Name</label>
                          <input id="name" required name="name" type="text" autoComplete="name" placeholder="John Doe" className="form-input" />
                        </div>
                        <div>
                          <label className="form-label" htmlFor="email">Email Address</label>
                          <input id="email" required name="email" type="email" autoComplete="email" placeholder="john@company.com" className="form-input" />
                        </div>
                        <div>
                          <label className="form-label" htmlFor="message">Issue</label>
                          <textarea id="message" required name="message" rows={3} placeholder="Describe your issue or concern..." className="form-textarea" />
                        </div>
                        <button type="submit" disabled={formStatus.loading} className="form-btn">
                          {formStatus.loading ? "Sending…" : "Send Mail →"}
                        </button>
                        <AnimatePresence>
                          {formStatus.message && showMsg && (
                            <motion.p
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              role="status"
                              className={`form-status ${formStatus.success ? "form-status--ok" : "form-status--err"}`}
                            >
                              {formStatus.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </form>
                    </div>

                    <Footer />
                  </section>
                </div>
              </div>
            </div>
            <div ref={spacerRef} className="scroll-spacer" aria-hidden="true" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
