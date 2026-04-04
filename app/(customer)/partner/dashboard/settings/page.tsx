"use client";

import React, { useState } from 'react';
import { 
  Building, 
  Mail, 
  Globe, 
  Lock,
  Paintbrush,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Agency Settings</h2>
        <p className="text-slate-400">Configure your partner profile and white-label options.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold">Profile Details</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Agency Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  defaultValue="Acme Digital"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  defaultValue="hello@acmedigital.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Agency Website</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="url" 
                defaultValue="https://acmedigital.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">White-Label Branding</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPremium ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
            {isPremium ? 'Premium Plan' : 'Lite Plan'}
          </span>
        </div>
        <div className="p-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Custom Domain (Free)</label>
              <span className="text-xs text-green-400 border border-green-400/20 bg-green-400/10 px-2 py-0.5 rounded-md font-bold">Included</span>
            </div>
            <div className="flex gap-4">
              <input 
                type="text" 
                defaultValue="agents.acmedigital.com"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-xl font-bold transition-colors">
                Verify
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">Point your CNAME record to portal.nexusai.com. Your clients will still see "Powered by Nexus AI" in the footer.</p>
          </div>
          
          <div className="pt-8 border-t border-slate-800 relative">
            {!isPremium && (
              <div className="absolute inset-x-0 top-8 bottom-0 bg-slate-950/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-b-3xl">
                <Lock className="text-amber-400 mb-3" size={32} />
                <h4 className="text-lg font-bold text-white mb-2">Premium White-Label Required</h4>
                <p className="text-slate-400 text-sm mb-4 max-w-sm text-center">Upgrade to remove "Powered by Nexus AI" and fully customize the portal colors and logo.</p>
                <button 
                  onClick={() => setIsPremium(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                >
                  Upgrade for $199/mo
                </button>
              </div>
            )}
            
            <div className={`space-y-8 transition-opacity duration-500 ${!isPremium ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Agency Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl">
                    A
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl font-bold transition-colors text-sm">
                    Upload New
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Brand Color</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 border border-slate-700 ring-2 ring-slate-800"></div>
                  <div className="relative flex-1 max-w-xs">
                    <Paintbrush className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" defaultValue="#9333ea" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex justify-end gap-4">
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
          Cancel
        </button>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
          <Save size={18} /> Save Changes
        </button>
      </div>

    </div>
  );
}
