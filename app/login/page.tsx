"use client";

import React, { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Network } from 'lucide-react';
import { Navbar } from '@/components/Layout';

export default function PartnerLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: ChangeEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate navigation
    setTimeout(() => {
      window.location.href = '/partner/dashboard';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <div className="grow flex items-center justify-center p-4 sm:p-6 mt-20">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
          {/* Left Side - Welcome */}
          <div className="hidden md:flex flex-col p-12 bg-linear-to-br from-purple-900/40 to-blue-900/40 border-r border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm pointer-events-none">
              <Network size={200} />
            </div>
            <div className="relative z-10 grow pt-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-8">
                <Network className="text-purple-400" size={32} />
              </div>
              <h2 className="text-4xl font-bold mb-6">Welcome back, Partner.</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Manage your agency clients, monitor agent distributions, and scale your AI automation business from one centralized dashboard.
              </p>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900" />
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900" />
                  <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-900" />
                </div>
                Over 500+ partners scaling with us
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-6 sm:p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Sign in</h3>
              <p className="text-slate-400">Access your partner portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="partner@agency.com"
                    defaultValue="partner@agency.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <Link href="#" className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    defaultValue="password123"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-3 sm:py-4 mt-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-base sm:text-lg transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 group"
              >
                {loading ? 'Authenticating...' : (
                  <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-slate-400">
              Don't have a partner account?{' '}
              <Link href="/partner/register" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
                Apply here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
