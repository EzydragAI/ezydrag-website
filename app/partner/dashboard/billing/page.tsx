"use client";

import React from 'react';
import { 
  Coins, 
  CreditCard, 
  Download, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="max-w-4xl max-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Billing & Credits</h2>
        <p className="text-slate-400">Manage your wholesale credit balance and billing methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Coins size={24} />
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
              Active
            </span>
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Available Credits</h3>
          <div className="text-4xl font-bold mb-6">45,620</div>
          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-colors">
            Buy More Credits
          </button>
          <p className="text-xs text-slate-500 text-center mt-3">Auto-recharge is enabled when balance drops below 5,000</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
              <CreditCard size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Payment Method</h3>
          <div className="text-lg font-bold mb-1 flex items-center gap-2">
            Visa ending in 4242
          </div>
          <div className="text-sm text-slate-500 mb-6">Expires 12/28</div>
          <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl mt-8">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold">Billing History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                { id: 'INV-2024-001', date: 'Apr 01, 2024', desc: '100,000 Credits', amount: '$499.00', status: 'Paid' },
                { id: 'INV-2024-002', date: 'Mar 01, 2024', desc: '50,000 Credits', amount: '$299.00', status: 'Paid' },
                { id: 'INV-2024-003', date: 'Feb 15, 2024', desc: 'Partner License Setup', amount: '$199.00', status: 'Paid' },
              ].map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-300">{invoice.date}</td>
                  <td className="px-6 py-4 font-medium">{invoice.desc}</td>
                  <td className="px-6 py-4 text-slate-300">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 size={14} /> Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 transition-colors">
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
