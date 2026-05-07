"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';

/* ── Animated mesh-gradient background blob ── */
function MeshBlob({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-[100px] opacity-40 animate-blob pointer-events-none ${className}`}
    />
  );
}

/* ── Animated AI agent demo messages ── */
const AGENT_MESSAGES = [
  { role: 'user',  text: 'Handle all new leads from our CRM and send a personalized intro email.', delay: 0.5 },
  { role: 'agent', text: '✓ Connected to HubSpot CRM — monitoring 3 new leads.',                   delay: 1.5 },
  { role: 'agent', text: '✓ Drafting personalised email for Rahul Sharma @ Acme Corp…',             delay: 2.8 },
  { role: 'agent', text: '✉ Email sent. Opening ticket and scheduling follow-up in 3 days.',       delay: 4.2 },
  { role: 'user',  text: "Great! Now analyse last month's sales data and create a summary report.", delay: 5.8 },
  { role: 'agent', text: '✓ Pulling data from Google Sheets & Salesforce…',                        delay: 7.0 },
  { role: 'agent', text: '📊 Report ready — Revenue ↑ 18%, Top region: West. Sent to Slack.',     delay: 8.5 },
];

function AgentDemoPanel() {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    AGENT_MESSAGES.forEach((msg, i) => {
      timers.push(setTimeout(() => setVisible(v => [...v, i]), msg.delay * 1000));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-[#0d1117]/80 backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.12)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.03]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-slate-500 font-mono">ezydrag-agent · live</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Running
        </span>
      </div>

      {/* Messages */}
      <div className="p-5 space-y-3 min-h-[240px]">
        {AGENT_MESSAGES.map((msg, i) =>
          visible.includes(i) ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className={`inline-block max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-violet-600/80 text-white rounded-br-sm'
                    : 'bg-white/[0.08] text-slate-300 rounded-bl-sm border border-white/10'
                }`}
              >
                {msg.text}
              </span>
            </motion.div>
          ) : null
        )}

        {/* Typing indicator */}
        {visible.length > 0 && visible.length < AGENT_MESSAGES.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <span className="inline-flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.08] border border-white/10">
              {[0, 1, 2].map(n => (
                <span
                  key={n}
                  className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: `${n * 0.15}s` }}
                />
              ))}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Hero words for kinetic reveal ── */
const HEADLINE_WORDS = ['Run', 'your', 'Business', 'on', 'Autopilot'];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* Cursor-following glow */
  useEffect(() => {
    const el = containerRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      glow.style.transform = `translate(${e.clientX - rect.left - 200}px, ${e.clientY - rect.top - 200}px)`;
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030712] pt-24 pb-16"
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Mesh Gradient Blobs */}
      <MeshBlob className="w-[700px] h-[700px] bg-blue-600/50 top-[-20%] left-[-15%]" />
      <MeshBlob className="w-[500px] h-[500px] bg-purple-600/40 top-[10%] right-[-10%] [animation-delay:2s]" />
      <MeshBlob className="w-[400px] h-[400px] bg-indigo-500/30 bottom-[-10%] left-[30%] [animation-delay:4s]" />

      {/* Cursor Glow */}
      <div
        ref={glowRef}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none transition-transform duration-300 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-8">

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-slate-300"
        >
          <LogoIcon height={20} />
          Next-Gen AI Automation Platform
        </motion.span>

        {/* Kinetic Headline */}
        <h1 className="font-extrabold tracking-tight leading-[1.1] flex flex-wrap justify-center gap-x-5 gap-y-2">
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 60, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${
                word === 'Autopilot'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500'
                  : 'text-white'
              }`}
              style={{ transformPerspective: 800 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="max-w-2xl text-lg text-slate-400 leading-relaxed"
        >
          We build, deploy, and manage intelligent AI agents that transform your workflows, reduce costs, and accelerate growth — all without lifting a finger.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transition-shadow duration-300"
          >
            Start Your Project
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/agents"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
          >
            View Prebuilt Agents
          </Link>
        </motion.div>

        {/* AI Agent Live Demo Panel */}
        <AgentDemoPanel />
      </div>
    </section>
  );
}
