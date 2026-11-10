"use client";

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CustomerPricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">Simple, transparent pricing</h2>
        <p className="text-sm sm:text-base text-slate-400">Upgrade your plan to unlock more API requests and higher rate limits for your growing AI needs.</p>
        
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <button 
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-slate-800 rounded-full p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className={`w-6 h-6 bg-blue-500 rounded-full transition-transform shadow-md ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
            Annually <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {[
          { name: 'Starter', price: isAnnual ? '29' : '39', requests: '10,000', features: ['Up to 2 Active Agents', 'Community Support', 'Standard speed SLAs'] },
          { name: 'Pro', price: isAnnual ? '89' : '109', requests: '50,000', popular: true, features: ['Up to 5 Active Agents', 'Priority Email Support', 'Access to GPT-4 Turbo', 'Fast speed SLAs'] },
          { name: 'Scale', price: isAnnual ? '199' : '249', requests: '200,000', features: ['Unlimited Agents', '24/7 Phone Support', 'Fine-tuned custom models', 'Highest priority routing'] },
        ].map((tier, i) => (
          <div key={i} className={`bg-slate-900 border ${tier.popular ? 'border-blue-500' : 'border-slate-800'} rounded-[32px] p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-xl ${tier.popular ? 'shadow-blue-900/20' : ''}`}>
            {tier.popular && (
              <div className="absolute top-0 inset-x-0 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 text-center">
                Most Popular
              </div>
            )}
            
            <h3 className={`text-xl font-bold mb-2 ${tier.popular ? 'text-blue-400 mt-2' : 'text-white'}`}>{tier.name}</h3>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-white">${tier.price}</span>
              <span className="text-slate-500 text-sm mb-1">/mo</span>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 border-b border-slate-800 pb-6">
              Includes <strong className="text-slate-200">{tier.requests}</strong> API requests per month.
            </p>
            
            <div className="space-y-4 mb-8 flex-grow">
              {tier.features.map((f, j) => (
                <div key={j} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className={`${tier.popular ? 'text-blue-400' : 'text-slate-500'} shrink-0 mt-0.5`} />
                  <span className="text-sm text-slate-300 font-medium">{f}</span>
                </div>
              ))}
            </div>
            
            <button className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg ${tier.popular ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}`}>
              {tier.popular ? 'Upgrade to Pro' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
