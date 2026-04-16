"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Zap,
  Bot,
  BarChart,
  Github,
  Linkedin,
  Instagram,
  ChevronRight,
  Server,
  Cloud,
  CheckCircle2,
  ArrowRight,
  Mail,
  User,
  MessageSquare,
  Network
} from 'lucide-react';
import { TEAM, SERVICES, PREBUILT_AGENTS } from '@/lib/constants';
import { Navbar, Footer } from '@/components/Layout';
import { AgentCard } from '@/components/AgentCard';
import { SplineScene } from '@/components/SplineScene';

export default function HomePage() {
  const [formStatus, setFormStatus] = useState<{ loading: boolean; success: boolean; message: string | null }>({
    loading: false,
    success: false,
    message: null
  });

  const [showMessage, setShowMessage] = useState(false)

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
        setShowMessage(true)
        setTimeout(() => {
          setShowMessage(false)
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong'
      });
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
          {/* Spline 3D Background */}
          <div className="absolute inset-0 z-0">
            <SplineScene 
              scene="https://prod.spline.design/gN6mzdtFRGQjNS9Z/scene.splinecode"
              className="w-full h-full"
            />
            {/* Optimized overlay for legibility on all devices */}
            <div className="absolute inset-0 bg-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950 lg:via-slate-950/80 lg:to-transparent" />
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              <div className="opacity-100 transform-none">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8">
                  Run <br />
                  your <br />
                  Business <br />
                  on <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Autopilot</span>
                </h1>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-600/20">
                    Start Your Project <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/agents" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 border border-slate-700">
                    View Prebuilt Agents
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Expertise</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive AI solutions designed to scale with your business needs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service, idx) => (
                <div
                  key={service.title}
                  className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all group"
                >
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {service.icon === 'Zap' && <Zap className="text-blue-400" />}
                    {service.icon === 'Bot' && <Bot className="text-blue-400" />}
                    {service.icon === 'BarChart' && <BarChart className="text-blue-400" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top 3 Agents Section */}
        <section id="agents" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured AI Agents</h2>
                <p className="text-slate-400 max-w-xl">Our most popular ready-to-deploy solutions.</p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PREBUILT_AGENTS.slice(0, 3).map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>

        {/* Custom Solutions Section */}
        <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Custom AI Solutions</h2>
                <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                  Need something unique? We develop bespoke AI agents integrated directly into your existing tech stack.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Project Complexity", desc: "From simple chatbots to complex multi-agent systems." },
                    { title: "Integration Needs", desc: "Seamless connection with your CRM, ERP, or custom APIs." },
                    { title: "Scale & Usage", desc: "Optimized for your specific volume and performance requirements." }
                  ].map(item => (
                    <div key={item.title} className="flex gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{item.title}</h4>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
                <div className="relative p-1 rounded-[40px] bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="bg-slate-900 rounded-[39px] p-8 md:p-12">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">Request a Quote</h3>
                      <p className="text-slate-400 mb-8">Get a tailored proposal for your custom AI project.</p>
                      <Link href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                        Consult Our Engineers <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deployment & Partnerships Section */}
        <section id="hosting" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Deployment & Partnerships</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Choose managed hosting for hands-off deployment or partner with us to distribute our agents.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Managed Hosting */}
              <div
                className="p-10 rounded-[40px] bg-slate-900 border border-slate-800 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cloud size={120} />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8">
                    <Cloud className="text-blue-400" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Managed Hosting</h3>
                  <p className="text-slate-400 mb-8">We handle the infrastructure, you focus on the results. Perfect for businesses wanting a hands-off experience.</p>
                  <ul className="space-y-4 mb-10">
                    {['Cloud Deployment', '24/7 Monitoring', 'Security Updates', 'Performance Tuning'].map(item => (
                      <li key={item} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 size={20} className="text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm font-bold text-blue-400 uppercase tracking-widest">Monthly/Yearly Subscription</div>
                </div>
              </div>

              {/* Partner Program */}
              <div
                className="p-10 rounded-[40px] bg-slate-900 border border-slate-800 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Network size={120} />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8">
                    <Network className="text-purple-400" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Partner Distribution</h3>
                  <p className="text-slate-400 mb-8">Distribute our agents to your own clients. You manage the relationships while we maintain centralized control over usage and user limits.</p>
                  <ul className="space-y-4 mb-10">
                    {['Distribute to Sub-Clients', 'Centralized License Control', 'Custom Usage Limits', 'Revenue Sharing Model'].map(item => (
                      <li key={item} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 size={20} className="text-purple-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm font-bold text-purple-400 uppercase tracking-widest">Partnership Program</div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Contact Section */}
        <section id="contact" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-slate-900 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 md:p-16 lg:p-20 bg-blue-600 text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">Let's Build Your Future</h2>
                  <p className="text-blue-100 text-lg mb-12">
                    Have a specific automation challenge? Our team is ready to help you design the perfect AI strategy.
                  </p>
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Mail size={24} />
                      </div>
                      <div>
                        <div className="text-blue-200 text-sm font-bold uppercase tracking-wider">Email Us</div>
                        <div className="text-xl font-bold">infoezydrag@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <div className="text-blue-200 text-sm font-bold uppercase tracking-wider">Live Chat</div>
                        <div className="text-xl font-bold">Available 9am - 6pm EST</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-10 md:p-16 lg:p-20">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                          required
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                          required
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Requirements</label>
                      <textarea
                        required
                        name="message"
                        rows={4}
                        placeholder="Tell us about your project..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                    <button
                      disabled={formStatus.loading}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20"
                    >
                      {formStatus.loading ? 'Sending...' : 'Send Message'}
                    </button>

                    {formStatus.message && showMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl text-center font-medium ${formStatus.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                      >
                        {formStatus.message}
                      </motion.div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
