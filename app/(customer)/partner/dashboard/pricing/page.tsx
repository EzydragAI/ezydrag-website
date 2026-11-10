"use client";

import React, { useState } from 'react';
import { CheckCircle2, Package, Sparkles } from 'lucide-react';

export default function PartnerPricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={14}/> Wholesale Pricing
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">Agency licensing tiers</h2>
        <p className="text-sm sm:text-base text-slate-400">Pay a flat licensing fee for the platform, and securely buy raw agent credits in wholesale bulk blocks.</p>
        
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <button 
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-slate-800 rounded-full p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div className={`w-6 h-6 bg-purple-500 rounded-full transition-transform shadow-md ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
            Annually <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16">
        {[
          { name: 'Lite Agency', price: isAnnual ? '99' : '149', focus: 'For boutique agencies.', features: ['Up to 10 Client Seats limits', 'Standard API credit routing', 'Basic branded portal (No CNAME)'] },
          { name: 'Premium Full-Scale', price: isAnnual ? '299' : '399', popular: true, focus: 'For rapidly scaling partners.', features: ['Unlimited Client Seats', 'White-label custom CNAME domain', 'Full color & logo customizer', 'Dedicated success engineer'] },
        ].map((tier, i) => (
          <div key={i} className={`bg-slate-900 border ${tier.popular ? 'border-purple-500' : 'border-slate-800'} rounded-[32px] p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-xl ${tier.popular ? 'shadow-purple-900/20' : ''}`}>
            {tier.popular && (
              <div className="absolute top-0 inset-x-0 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 text-center">
                Most Popular
              </div>
            )}
            
            <h3 className={`text-xl font-bold mb-1 ${tier.popular ? 'text-purple-400 mt-2' : 'text-white'}`}>{tier.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{tier.focus}</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-white">${tier.price}</span>
              <span className="text-slate-500 text-sm mb-1">/mo</span>
            </div>
            
            <p className="text-[11px] text-slate-400 mb-6 border-b border-slate-800 pb-6 uppercase font-bold tracking-widest">
              Platform Fee Base
            </p>
            
            <div className="space-y-4 mb-8 flex-grow">
              {tier.features.map((f, j) => (
                <div key={j} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className={`${tier.popular ? 'text-purple-400' : 'text-slate-500'} shrink-0 mt-0.5`} />
                  <span className="text-sm text-slate-300 font-medium">{f}</span>
                </div>
              ))}
            </div>
            
            <button className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg ${tier.popular ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}`}>
              {tier.popular ? 'Upgrade Default Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">Wholesale Credit Add-ons</h3>
        <p className="text-slate-400 text-center mb-8 text-sm sm:text-base">Once licensed, distribute these raw API credits to any of your infinite client seats internally.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center hover:border-slate-700 transition-colors group">
             <Package size={24} className="text-slate-500 mb-3 group-hover:text-slate-300 transition-colors" />
             <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Block A</div>
             <div className="text-2xl font-bold text-white mb-1">$50</div>
             <div className="text-sm text-purple-400 font-medium">10,000 Credits</div>
          </div>
          <div className="bg-slate-950 border border-purple-500/30 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative hover:border-purple-500/50 transition-colors cursor-pointer group">
             <div className="absolute -top-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">Top Seller</div>
             <Package size={28} className="text-purple-400 mb-2 group-hover:text-purple-300 transition-colors" />
             <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Block B</div>
             <div className="text-2xl font-bold text-white mb-1">$200</div>
             <div className="text-sm text-purple-400 font-medium">50,000 Credits</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center hover:border-slate-700 transition-colors group">
             <Package size={24} className="text-slate-500 mb-3 group-hover:text-slate-300 transition-colors" />
             <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Block C</div>
             <div className="text-2xl font-bold text-white mb-1">$350</div>
             <div className="text-sm text-purple-400 font-medium">100,000 Credits</div>
          </div>
        </div>
      </div>
    </div>
  );
}
