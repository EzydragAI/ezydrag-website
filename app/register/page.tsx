"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Building, User, ArrowRight, Sparkles, CheckCircle2, X } from 'lucide-react';
import { Navbar } from '@/components/Layout';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Simulate routing -> Save to DB as Partner if true.
      window.location.href = isPartner ? '/partner/dashboard' : '/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      
      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden transform transition-all">
            <button 
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="text-purple-400" size={28} />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Join as a Distribution Partner</h3>
            <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8">Unlock exclusive agency features to resell our AI models under your own brand.</p>
            
            <ul className="space-y-4 mb-8">
              {[
                "White-label branding and custom CNAME domains",
                "Unlimited sub-client seats and API key management",
                "Volume-based credit discounts",
                "Dedicated partner success manager"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base">
                  <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-300 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                type="button"
                onClick={() => setShowPartnerModal(false)}
                className="w-full sm:flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors order-2 sm:order-1"
              >
                Maybe Later
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsPartner(true);
                  setShowPartnerModal(false);
                }}
                className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-colors order-1 sm:order-2"
              >
                Yes, Upgrade Me
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grow flex items-center justify-center p-4 sm:p-6 mt-20 my-10 relative z-10">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
          
          <div className="p-6 sm:p-10 md:p-14">
            <div className="mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Create your account</h2>
              <p className="text-sm sm:text-base text-slate-400">Deploy enterprise-grade AI agents in minutes.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Doe"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Acme Corp"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="hello@acmecorp.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Join as Partner Switch */}
              <div className="p-4 sm:p-5 border border-purple-500/30 bg-purple-500/5 rounded-2xl flex items-center justify-between mt-8 gap-4">
                <div>
                  <h4 className="font-bold text-white mb-0.5 sm:mb-1 flex items-center gap-2 text-sm sm:text-base">
                    <Sparkles size={16} className="text-purple-400 shrink-0"/>
                    <span className="truncate">Join as a Distribution Partner</span>
                  </h4>
                  <p className="text-xs text-slate-400">Resell AI agents to your own clients.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => isPartner ? setIsPartner(false) : setShowPartnerModal(true)}
                  className={`w-12 sm:w-14 h-7 sm:h-8 rounded-full transition-colors relative flex items-center shrink-0 px-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${isPartner ? 'bg-purple-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-transform shadow-md ${isPartner ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <button 
                disabled={loading}
                className="w-full py-3 sm:py-4 mt-6 bg-slate-100 hover:bg-white disabled:bg-slate-300 text-slate-900 rounded-xl font-bold text-base sm:text-lg transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 group"
              >
                {loading ? 'Creating Account...' : (
                  <>Create {isPartner ? 'Partner ' : ''}Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            <div className="mt-8 text-center text-slate-400 border-t border-slate-800 pt-8">
              Already have an account?{' '}
              <Link href="/login" className="text-white font-bold hover:text-slate-200 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
