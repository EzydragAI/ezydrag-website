"use client";

import React from 'react';
import { User, Mail, Save, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Account Settings</h2>
        <p className="text-sm sm:text-base text-slate-400">View and update your personal details and account configurations.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Profile Details</h3>
        </div>
        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-800 border-2 border-slate-700 rounded-full flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group">
               <User size={32} />
               <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-colors">
                 <span className="text-xs font-bold text-white">Edit</span>
               </div>
            </div>
            <div className="text-center sm:text-left">
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-slate-700">
                Upload New Image
              </button>
              <p className="text-xs text-slate-500 mt-3">Recommended: 256x256px JPG or PNG</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
              <input 
                type="text" 
                defaultValue="Jane"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
              <input 
                type="text" 
                defaultValue="Business"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 focus:outline-none focus:border-blue-500 transition-colors text-sm text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Account Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="email" 
                defaultValue="jane@acmecorp.com"
                disabled
                className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl py-3.5 pl-12 pr-4 cursor-not-allowed text-sm opacity-70"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5"><RefreshCw size={12} className="text-blue-500"/> Contact technical support to change your account email.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 flex-col sm:flex-row pb-12">
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-xl font-bold transition-colors text-sm sm:text-base order-2 sm:order-1 border border-slate-700">
          Discard Changes
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2 shadow-lg shadow-blue-600/20">
          <Save size={18} /> Save Profile Details
        </button>
      </div>

    </div>
  );
}
