"use client";

import React, { useState } from 'react';
import { Key, Copy, Plus, AlertCircle, Ban } from 'lucide-react';

export default function APIKeysPage() {
  const [keys] = useState([
    { id: 1, name: 'Production Bot Key', key: 'sk-nx-prod-8f92j', lastUsed: '2 hours ago', status: 'Active' },
    { id: 2, name: 'Testing Env', key: 'sk-nx-test-3m4nd', lastUsed: '3 days ago', status: 'Active' },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">API Keys</h2>
        <p className="text-sm sm:text-base text-slate-400">Manage API keys to authenticate your applications with our AI models.</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex gap-4">
        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-amber-500 font-bold mb-1 text-sm sm:text-base">Secret Key Security</h4>
          <p className="text-xs sm:text-sm text-slate-300">Your secret API keys are shown only once upon generation. Do not share your API key in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Standard API Keys</h3>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap w-full sm:w-auto justify-center shadow-lg shadow-blue-500/20">
            <Plus size={16} /> Create new secret key
          </button>
        </div>
        
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
            <thead className="bg-slate-800/30 text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Name</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Secret Key</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Last Used</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-white">{k.name}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Key size={14} className="text-slate-500" />
                      <span className="font-mono text-slate-300 text-xs sm:text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {k.key.substring(0, 7)}••••••••{k.key.slice(-4)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-400 text-xs sm:text-sm">{k.lastUsed}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors title='Copy ID'">
                        <Copy size={16} />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors title='Revoke Key'">
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
