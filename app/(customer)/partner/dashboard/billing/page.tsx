"use client";

import React from 'react';
import { 
  Coins, 
  CreditCard, 
  Download, 
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Billing & Credits</h2>
        <p className="text-sm sm:text-base text-slate-400">Manage your wholesale credit balance and billing methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-0">
        {/* Current Balance / Plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-start shadow-xl h-full">
          <div className="flex items-center justify-between w-full mb-6 mt-1">
            <div className="bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1.5 uppercase tracking-wider rounded-full">
              Agency Partner Tier
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
              Active
            </span>
          </div>
          
          <h3 className="text-slate-400 text-sm font-medium mb-1">Available Wholesale Credits</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl sm:text-5xl font-bold text-white">45,620</span>
            <span className="text-xs sm:text-sm text-green-400 flex items-center font-bold"><TrendingUp size={14} className="mr-1"/> +12K</span>
          </div>
          
          <div className="w-full space-y-4 mb-8 flex-grow">
            {[
              'Volume discounted API rates', 
              'Unlimited sub-client seats', 
              'Premium white-label branding', 
              'Dedicated partner success manager'
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-purple-400 shrink-0" /> <span className="text-slate-300 font-medium">{b}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-3 sm:py-3.5 bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20 text-white font-bold rounded-xl transition-colors">
            Buy More Credits
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
                  <div className="text-xs text-slate-500 mt-0.5">Expires 12/28</div>
                </div>
              </div>
              <button className="text-sm text-purple-400 font-bold hover:text-purple-300 px-3 py-1.5 bg-purple-500/10 rounded-lg transition-colors">Edit</button>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 mt-5 text-sm flex items-start gap-3 border border-slate-700/50">
              <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-slate-400 leading-relaxed">Auto-recharge is currently <strong className="text-slate-200 font-bold">Enabled</strong>. Your card will be billed <strong className="text-white">$499</strong> for 100,000 credits when balance drops below 5,000.</p>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-900/60 to-blue-900/40 border border-purple-500/20 rounded-3xl p-6 sm:p-8 flex-grow shadow-xl relative overflow-hidden flex flex-col justify-center">
            <Zap className="absolute -right-4 -top-4 text-purple-500 opacity-20 transform rotate-12" size={120} />
            <h4 className="text-xl font-bold mb-2 text-white relative z-10">Scale to Enterprise</h4>
            <p className="text-sm text-slate-300 mb-6 relative z-10 max-w-sm leading-relaxed">Processing millions of queries? Secure a custom distribution agreement with tailored SLAs and lower margins.</p>
            <button className="bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-fit relative z-10 shadow-lg shadow-white/10">
              Talk to Sales
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl mt-8">
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Billing History</h3>
        </div>
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
            <thead className="bg-slate-800/30 text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs border-b border-slate-800">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Description</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Amount</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                { id: 'INV-2024-001', date: 'Apr 01, 2024', desc: '100,000 Credits', amount: '$499.00', status: 'Paid' },
                { id: 'INV-2024-002', date: 'Mar 01, 2024', desc: '50,000 Credits', amount: '$299.00', status: 'Paid' },
                { id: 'INV-2024-003', date: 'Feb 15, 2024', desc: 'Partner License Setup', amount: '$199.00', status: 'Paid' },
              ].map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300">{invoice.date}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-white">{invoice.desc}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300">{invoice.amount}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="inline-flex px-2 py-1 items-center gap-1.5 text-green-400 bg-green-500/10 rounded-md text-[10px] sm:text-xs font-bold">
                      <CheckCircle2 size={12} /> Paid
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    <button className="text-purple-400 hover:text-purple-300 font-bold inline-flex items-center gap-1.5 transition-colors text-xs sm:text-sm px-3 py-1.5 bg-purple-500/10 rounded-lg">
                      <Download size={14} /> PDF
                    </button>
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
