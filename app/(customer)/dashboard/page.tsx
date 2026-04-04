"use client";

import React from 'react';
import { 
  Zap,
  Activity,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerOverview() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Welcome back, Jane!</h2>
        <p className="text-sm sm:text-base text-slate-400">Here is a summary of your AI agent usage and account status.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {/* API Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={100} />
          </div>
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Activity size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-base text-slate-400 font-medium">Monthly Requests</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-3xl font-bold text-white">14,205</span>
                <span className="text-[10px] sm:text-sm text-slate-500">/ 50K</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
            <div className="bg-blue-500 h-2 rounded-full w-[28%]"></div>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 text-right">28% used this cycle</div>
        </div>

        {/* Active Agents */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={100} />
          </div>
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-base text-slate-400 font-medium">Active Agents</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-3xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] sm:text-sm text-slate-400 mt-5 leading-relaxed">Customer Support, Sales Bot, HR Assistant</div>
        </div>
        
        {/* Current Plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard size={100} />
          </div>
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
              <CreditCard size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-base text-slate-400 font-medium">Current Plan</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-3xl font-bold text-white">Pro</span>
              </div>
            </div>
          </div>
          <Link href="/dashboard/billing" className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-4 sm:mt-6 w-fit">
            Manage Subscription <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 overflow-hidden">
        <h3 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 text-white leading-tight">Recent API Activity</h3>
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap min-w-[500px]">
            <thead className="text-slate-400 uppercase text-[10px] sm:text-xs border-b border-slate-800">
              <tr>
                <th className="pb-3 sm:pb-4 font-bold">Date & Time</th>
                <th className="pb-3 sm:pb-4 font-bold">Agent</th>
                <th className="pb-3 sm:pb-4 font-bold">Response Limit</th>
                <th className="pb-3 sm:pb-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                { time: 'Today, 10:42 AM', agent: 'Customer Support', speed: '1.2s', status: 'Success' },
                { time: 'Today, 09:15 AM', agent: 'Sales Bot', speed: '0.8s', status: 'Success' },
                { time: 'Yesterday, 04:30 PM', agent: 'HR Assistant', speed: '2.1s', status: 'Success' },
                { time: 'Yesterday, 11:20 AM', agent: 'Customer Support', speed: '-', status: 'Failed' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 sm:py-4 text-slate-300">{log.time}</td>
                  <td className="py-3 sm:py-4 font-medium text-white">{log.agent}</td>
                  <td className="py-3 sm:py-4 text-slate-400">{log.speed}</td>
                  <td className="py-3 sm:py-4 text-right">
                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold ${log.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                      {log.status}
                    </span>
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
