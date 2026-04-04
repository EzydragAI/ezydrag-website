"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Building, User, ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Layout';

export default function PartnerRegister() {
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/partner/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6 mt-20 my-10">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
          
          <div className="p-10 sm:p-14">
            <div className="mb-10 text-center">
              <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="text-purple-400" size={28} />
              </div>
              <h2 className="text-3xl font-bold mb-3">Become a Distribution Partner</h2>
              <p className="text-slate-400">Start distributing custom AI agents to your clients today.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Doe"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Company / Agency Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Acme Digital"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="hello@acmedigital.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-4 mt-6 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 group"
              >
                {loading ? 'Submitting Application...' : (
                  <>Create Partner Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-4">
                By creating an account, you agree to our Partner Terms of Service and Revenue Sharing Agreement.
              </p>
            </form>

            <div className="mt-8 text-center text-slate-400 border-t border-slate-800 pt-8">
              Already have an account?{' '}
              <Link href="/partner/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
