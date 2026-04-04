"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Coins, 
  Zap,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const INDIVIDUAL_USAGE_DATA = {
  'Stark Ind.': [
    { day: 'Mon', usage: 120 }, { day: 'Tue', usage: 230 }, { day: 'Wed', usage: 150 },
    { day: 'Thu', usage: 400 }, { day: 'Fri', usage: 800 }, { day: 'Sat', usage: 300 }, { day: 'Sun', usage: 200 }
  ],
  'Wayne Ent.': [
    { day: 'Mon', usage: 50 }, { day: 'Tue', usage: 80 }, { day: 'Wed', usage: 60 },
    { day: 'Thu', usage: 120 }, { day: 'Fri', usage: 90 }, { day: 'Sat', usage: 150 }, { day: 'Sun', usage: 200 }
  ],
  'Oscorp': [
    { day: 'Mon', usage: 300 }, { day: 'Tue', usage: 320 }, { day: 'Wed', usage: 310 },
    { day: 'Thu', usage: 290 }, { day: 'Fri', usage: 340 }, { day: 'Sat', usage: 100 }, { day: 'Sun', usage: 50 }
  ],
  'Daily Bugle': [
    { day: 'Mon', usage: 400 }, { day: 'Tue', usage: 350 }, { day: 'Wed', usage: 420 },
    { day: 'Thu', usage: 380 }, { day: 'Fri', usage: 450 }, { day: 'Sat', usage: 500 }, { day: 'Sun', usage: 480 }
  ],
};

const CLIENTS = Object.keys(INDIVIDUAL_USAGE_DATA);

export default function PartnerOverview() {
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Credits Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coins size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Coins size={24} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base text-slate-400 font-medium">Available Credits</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">45,620</span>
                <span className="text-xs sm:text-sm text-green-400 flex items-center"><TrendingUp size={14} className="mr-1"/> +12K</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
            <div className="bg-purple-500 h-2 rounded-full w-2/3"></div>
          </div>
          <div className="text-xs text-slate-500 text-right">33% used this billing cycle</div>
        </div>

        {/* Seats Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base text-slate-400 font-medium">Active Sub-clients</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">12</span>
                <span className="text-xs sm:text-sm text-slate-500">/ 50 limit</span>
              </div>
            </div>
          </div>
          <Link href="/partner/dashboard/clients" className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-4">
            Manage Client Seats <ArrowRight size={14} />
          </Link>
        </div>

        {/* Active Agents Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={100} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base text-slate-400 font-medium">Messages Processed</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">114.2k</span>
              </div>
            </div>
          </div>
           <div className="text-xs sm:text-sm text-slate-400 mt-5">Across all client seats this month</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <div>
            <h3 className="text-xl font-bold mb-1">Individual Client Usage</h3>
            <p className="text-sm sm:text-base text-slate-400">View daily message processing volume for specific sub-clients.</p>
          </div>
          <select 
            value={selectedClient} 
            onChange={(e) => setSelectedClient(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 cursor-pointer w-full sm:w-auto font-medium"
          >
            {CLIENTS.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
        </div>
        <div className="h-64 sm:h-96 mt-6 w-full -ml-4 sm:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={INDIVIDUAL_USAGE_DATA[selectedClient as keyof typeof INDIVIDUAL_USAGE_DATA]}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#1e293b'}} 
                contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.75rem', fontSize: '14px'}}
                itemStyle={{color: '#e2e8f0'}}
              />
              <Bar dataKey="usage" name="Messages Processed" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
