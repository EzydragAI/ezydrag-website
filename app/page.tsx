"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Zap,
  Cloud,
  Bot,
  BarChart,
  CheckCircle2,
  ArrowRight,
  Mail,
  User,
  MessageSquare,
  Network
} from 'lucide-react';
import { SERVICES, PREBUILT_AGENTS } from '@/lib/constants';
import { Navbar, Footer } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { LogoIcon } from '@/components/Logo';
import { AgentCard } from '@/components/AgentCard';
import Lenis from 'lenis';

// --- Loader Component ---
function Loader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="loader-container"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <LogoIcon height={70} />
      </motion.div>
      <div className="loader-progress-bg">
        <div className="loader-progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<{ loading: boolean; success: boolean; message: string | null }>({
    loading: false,
    success: false,
    message: null
  });
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, message: null });
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setFormStatus({ loading: false, success: true, message: result.message });
        (e.target as HTMLFormElement).reset();
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong'
      });
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onLoadingComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <Navbar />
          <main>
            {/* --- HERO SECTION (new, performant, no Spline) --- */}
            <HeroSection />

            {/* --- SERVICES (BENTO GRID) --- */}
            <section id="services" className="py-32 relative z-10">
              <div className="max-w-7xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-20"
                >
                  <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Our Expertise</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">Comprehensive AI solutions designed to scale with your business needs.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SERVICES.map((service, idx) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.15 }}
                      className="glass-panel p-10 group relative overflow-hidden"
                    >
                      <div className="glow-blue top-[-50px] right-[-50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                        {service.icon === 'Zap' && <Zap className="text-blue-400" size={28} />}
                        {service.icon === 'Bot' && <Bot className="text-blue-400" size={28} />}
                        {service.icon === 'BarChart' && <BarChart className="text-blue-400" size={28} />}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-white relative z-10">{service.title}</h3>
                      <p className="text-slate-400 leading-relaxed relative z-10">{service.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- AGENTS SECTION --- */}
            <section id="agents" className="py-32 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
                >
                  <div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Featured AI Agents</h2>
                    <p className="text-slate-400 max-w-xl text-lg">Our most popular ready-to-deploy solutions.</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PREBUILT_AGENTS.slice(0, 3).map((agent, idx) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0.95, y: 40 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.15 }}
                    >
                      <AgentCard agent={agent} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- CUSTOM SOLUTIONS --- */}
            <section className="py-32 relative overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">Custom AI Solutions</h2>
                    <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                      Need something unique? We develop bespoke AI agents integrated directly into your existing tech stack.
                    </p>
                    <div className="space-y-8">
                      {[
                        { title: "Project Complexity", desc: "From simple chatbots to complex multi-agent systems." },
                        { title: "Integration Needs", desc: "Seamless connection with your CRM, ERP, or custom APIs." },
                        { title: "Scale & Usage", desc: "Optimized for your specific volume and performance requirements." }
                      ].map(item => (
                        <div key={item.title} className="flex gap-6">
                          <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-white mb-2">{item.title}</h4>
                            <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="glass-panel p-12 md:p-16 text-center">
                      <div className="glow-purple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                      <h3 className="text-3xl font-bold mb-4 text-white relative z-10">Request a Quote</h3>
                      <p className="text-slate-400 mb-10 text-lg relative z-10">Get a tailored proposal for your custom AI project.</p>
                      <Link href="#contact" className="relative z-10 inline-flex items-center gap-2 px-8 py-5 bg-white text-slate-950 rounded-2xl font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        Consult Our Engineers <ArrowRight size={20} />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* --- DEPLOYMENT & HOSTING --- */}
            <section id="hosting" className="py-32">
              <div className="max-w-7xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-20"
                >
                  <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Deployment & Partnerships</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose managed hosting for hands-off deployment or partner with us to distribute our agents.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Managed Hosting */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-panel p-12 relative overflow-hidden group"
                  >
                    <div className="glow-blue top-[-50px] right-[-50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Cloud size={160} />
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <Cloud className="text-blue-400" size={32} />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-white">Managed Hosting</h3>
                      <p className="text-slate-400 mb-10 text-lg">We handle the infrastructure, you focus on the results. Perfect for businesses wanting a hands-off experience.</p>
                      <ul className="space-y-5 mb-12">
                        {['Cloud Deployment', '24/7 Monitoring', 'Security Updates', 'Performance Tuning'].map(item => (
                          <li key={item} className="flex items-center gap-4 text-slate-300 font-medium">
                            <CheckCircle2 size={24} className="text-blue-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="text-sm font-bold text-blue-400 uppercase tracking-widest">Monthly/Yearly Subscription</div>
                    </div>
                  </motion.div>

                  {/* Partner Program */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass-panel p-12 relative overflow-hidden group"
                  >
                    <div className="glow-purple top-[-50px] right-[-50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Network size={160} />
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform">
                        <Network className="text-purple-400" size={32} />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-white">Partner Distribution</h3>
                      <p className="text-slate-400 mb-10 text-lg">Distribute our agents to your own clients. You manage the relationships while we maintain centralized control over usage and limits.</p>
                      <ul className="space-y-5 mb-12">
                        {['Distribute to Sub-Clients', 'Centralized License Control', 'Custom Usage Limits', 'Revenue Sharing Model'].map(item => (
                          <li key={item} className="flex items-center gap-4 text-slate-300 font-medium">
                            <CheckCircle2 size={24} className="text-purple-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="text-sm font-bold text-purple-400 uppercase tracking-widest">Partnership Program</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* --- CONTACT --- */}
            <section id="contact" className="py-32">
              <div className="max-w-7xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="glass-panel overflow-hidden p-0 border-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-12 md:p-16 lg:p-20 bg-linear-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                      <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Let's Build Your Future</h2>
                      <p className="text-blue-100 text-lg mb-12 relative z-10 leading-relaxed">
                        Have a specific automation challenge? Our team is ready to help you design the perfect AI strategy.
                      </p>
                      <div className="space-y-10 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Mail size={24} />
                          </div>
                          <div>
                            <div className="text-white/60 text-sm font-bold uppercase tracking-wider mb-1">Email Us</div>
                            <div className="text-xl font-bold">ezydrag@gmail.com</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                            <MessageSquare size={24} />
                          </div>
                          <div>
                            <div className="text-white/60 text-sm font-bold uppercase tracking-wider mb-1">Live Chat</div>
                            <div className="text-xl font-bold">Available 9am - 6pm EST</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-12 md:p-16 lg:p-20 bg-slate-900/80 backdrop-blur-xl">
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                              required
                              name="name"
                              type="text"
                              placeholder="John Doe"
                              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                              required
                              name="email"
                              type="email"
                              placeholder="john@company.com"
                              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Requirements</label>
                          <textarea
                            required
                            name="message"
                            rows={4}
                            placeholder="Tell us about your project..."
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-slate-600"
                          />
                        </div>
                        <button
                          disabled={formStatus.loading}
                          className="w-full py-5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-800 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20"
                        >
                          {formStatus.loading ? 'Sending...' : 'Send Message'}
                        </button>

                        {formStatus.message && showMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-5 rounded-2xl text-center font-medium ${formStatus.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                          >
                            {formStatus.message}
                          </motion.div>
                        )}
                      </form>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
