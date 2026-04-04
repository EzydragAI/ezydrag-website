"use client";

import React from 'react';
import { CreditCard, CheckCircle2, Zap } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Billing & Plan</h2>
        <p className="text-sm sm:text-base text-slate-400">Manage your subscription, view payment history, and update your payment method.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-start shadow-xl h-full">
          <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 uppercase tracking-wider rounded-full mb-6">
            Current Plan
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pro Tier</h3>
          <p className="text-slate-400 text-sm mb-8 flex-grow">Best for small businesses and independent developers scaling their products safely without limits.</p>
          
          <div className="w-full space-y-4 mb-8">
            {['50,000 monthly API requests', 'Up to 5 Active Agents workflows', 'Priority Email & Chat Support', 'Access to GPT-4 Turbo models'].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-green-400 shrink-0" /> <span className="text-slate-300 font-medium">{b}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl transition-colors">
            Cancel Subscription
          </button>
        </div>

        {/* Upgrade / Payment details */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h4 className="text-lg font-bold mb-5 flex items-center gap-2 text-white"><CreditCard size={20} className="text-slate-400"/> Payment Method</h4>
            <div className="flex items-center justify-between bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-9 bg-slate-200 rounded flex items-center justify-center text-blue-900 font-bold text-sm italic">
                  VISA
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">Ending in 4242</div>
                  <div className="text-xs text-slate-500 mt-0.5">Expires 12/26</div>
                </div>
              </div>
              <button className="text-sm text-blue-400 font-bold hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 rounded-lg transition-colors">Edit</button>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mt-5 text-sm">
              <p className="text-slate-400">Next billing date is <strong className="text-slate-200 font-bold">May 4, 2026</strong> for <strong className="text-white">$49.00</strong>.</p>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-900/60 to-purple-900/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex-grow shadow-xl relative overflow-hidden flex flex-col justify-center">
            <Zap className="absolute -right-4 -top-4 text-amber-500 opacity-20 transform rotate-12" size={120} />
            <h4 className="text-xl font-bold mb-2 text-white relative z-10">Need more capacity?</h4>
            <p className="text-sm text-slate-300 mb-6 relative z-10 max-w-sm leading-relaxed">Upgrade to the Enterprise plan for custom fine-tuned models, volume discounts, and 99.9% SLA guarantees.</p>
            <button className="bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-fit relative z-10 shadow-lg shadow-white/10">
              Talk to Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
