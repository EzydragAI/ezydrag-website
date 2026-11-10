"use client";

import React, { useState } from 'react';
import { 
  Building, 
  Mail, 
  Globe, 
  Lock,
  Paintbrush,
  Save,
  RefreshCw,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export default function AgencySettingsPage() {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Agency Settings</h2>
        <p className="text-sm sm:text-base text-slate-400">Configure your partner profile and manage white-label portal options.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Agency Profile</h3>
        </div>
        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-800 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group">
               <Building size={32} />
               <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-colors">
                 <span className="text-xs font-bold text-white">Edit Logo</span>
               </div>
            </div>
            <div className="text-center sm:text-left">
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-slate-700">
                Upload Agency Logo
              </button>
              <p className="text-xs text-slate-500 mt-3">Recommended: 256x256px JPG or PNG (For Dashboard)</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Agency Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  defaultValue="Acme Digital"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors text-sm text-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Agency Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="url" 
                  defaultValue="https://acmedigital.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors text-sm text-slate-200"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Contact Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="email" 
                defaultValue="hello@acmedigital.com"
                disabled
                className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl py-3.5 pl-12 pr-4 cursor-not-allowed text-sm opacity-70"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5"><RefreshCw size={12} className="text-purple-500"/> Contact technical support to change your verified billing email.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white">White-Label Branding</h3>
          <span className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${isPremium ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
            {isPremium ? 'Premium Plan Active' : 'Basic Licensing'}
          </span>
        </div>
        <div className="p-5 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Custom Portal Domain</label>
              <span className="text-[10px] text-green-400 border border-green-400/20 bg-green-400/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Free Included</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  defaultValue="agents.acmedigital.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors text-sm text-slate-200"
                />
              </div>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 sm:py-0 rounded-xl text-sm font-bold transition-colors border border-slate-700 shrink-0">
                Verify CNAME
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed max-w-2xl">Point your CNAME record to <strong className="text-slate-300">portal.ezydrag.ai</strong>. While the domain is customized, your clients will still see a tiny "Powered by Ezydrag AI" badge in the footer on the Basic plan.</p>
          </div>
          
          <div className="pt-8 pb-8 sm:pb-12 border-t border-slate-800 relative xl:-mx-8 xl:px-8 -mx-5 px-5">
            {!isPremium && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center py-4 sm:py-8 border border-slate-800/50 rounded-b-3xl px-4">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-amber-400" size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Premium White-Label Required</h4>
                <p className="text-slate-400 text-sm mb-6 max-w-md text-center leading-relaxed">Upgrade to remove the "Powered by Ezydrag AI" badge entirely and unlock full color palettes and custom dashboard logos.</p>
                <button 
                  type="button"
                  onClick={() => setIsPremium(true)}
                  className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2"
                >
                  <Sparkles size={18}/> Unlock for $199/mo
                </button>
              </div>
            )}
            
            <div className={`space-y-8 transition-all duration-700 ${!isPremium ? 'opacity-30 pointer-events-none blur-[2px]' : 'opacity-100'}`}>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Custom Dashboard Brand Color</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 border border-slate-700 ring-4 ring-slate-900 shadow-xl shadow-purple-600/20 shrink-0"></div>
                  <div className="relative w-full sm:max-w-xs">
                    <Paintbrush className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input type="text" defaultValue="#9333ea" className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Dashboard Login Logo (Clients see this)</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-16 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-500 text-sm border-dashed">
                    <ImageIcon size={20} className="mr-2 opacity-50"/> Logo
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-sm border border-slate-700">
                    Upload PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 flex-col sm:flex-row pb-12">
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-xl font-bold transition-colors text-sm sm:text-base order-2 sm:order-1 border border-slate-700">
          Discard Changes
        </button>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2 shadow-lg shadow-purple-600/20">
          <Save size={18} /> Save Agency Settings
        </button>
      </div>

    </div>
  );
}
