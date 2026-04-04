"use client";

import { useState } from 'react';
import { 
  Plus, 
  Search,
  Building,
  Key,
  Copy,
  Ban,
  Trash2,
  Pause,
  Play
} from 'lucide-react';

const MOCK_CLIENTS_INIT = [
  { id: 1, name: 'Stark Industries', agent: 'Customer Support Bot', status: 'Active', limit: 5000, used: 4230, apiKey: 'sk-nx-ab12cd34ef56' },
  { id: 2, name: 'Wayne Enterprises', agent: 'Lead Generation Bot', status: 'Active', limit: 10000, used: 2150, apiKey: 'sk-nx-gh78ij90kl12' },
  { id: 3, name: 'Oscorp', agent: 'Data Analyst Agent', status: 'Warning', limit: 2000, used: 1950, apiKey: 'sk-nx-mn34op56qr78' },
  { id: 4, name: 'Daily Bugle', agent: 'Copywriter Assistant', status: 'Paused', limit: 1000, used: 1000, apiKey: 'sk-nx-st90uv12wx34' },
];

export default function ClientSeatsPage() {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [clients, setClients] = useState(MOCK_CLIENTS_INIT);

  const handleRevokeKey = (id: number) => {
    setClients(clients.map(c => 
      c.id === id ? { ...c, apiKey: 'Revoked', status: 'Disabled' } : c
    ));
  };

  const handlePauseKey = (id: number) => {
    setClients(clients.map(c => 
      c.id === id ? { ...c, status: 'Paused' } : c
    ));
  };

  const handleUnpauseKey = (id: number) => {
    setClients(clients.map(c => 
      c.id === id ? { ...c, status: 'Active' } : c
    ));
  };

  const handleDeleteSeat = (id: number) => {
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Client Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Client Distribution (Seats)</h3>
            <p className="text-sm sm:text-base text-slate-400">Manage API access and monitor usage per client.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <button 
              onClick={() => setIsAddingClient(!isAddingClient)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus size={16} /> New Seat
            </button>
          </div>
        </div>

        {isAddingClient && (
          <div className="p-6 bg-slate-800/50 border-b border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Client Name</label>
                <input type="text" placeholder="Client Company" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Agent Type</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-purple-500">
                  <option>Customer Support Bot</option>
                  <option>Lead Gen Assistant</option>
                  <option>Custom Workflow</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Monthly Credit Limit</label>
                <input type="number" placeholder="5000" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsAddingClient(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
                  Generate Key
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Client / Company</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Assigned Agent</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">License Key</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Credit Usage</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <Building size={14} className="text-slate-400" />
                      </div>
                      <span className="font-bold">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300">{client.agent}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Key size={14} className={client.apiKey.startsWith('sk-') ? "text-purple-500" : "text-slate-500"} />
                      <span className="font-mono text-slate-300 text-xs">
                        {client.apiKey.startsWith('sk-nx-') ? `sk-nx-••••••••${client.apiKey.slice(-4)}` : client.apiKey}
                      </span>
                      {client.apiKey.startsWith('sk-nx-') && (
                        <button className="text-slate-500 hover:text-slate-300 transition-colors" title="Copy Key">
                          <Copy size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col gap-1 min-w-[120px]">
                      <div className="flex justify-between gap-2 text-xs whitespace-nowrap">
                        <span className="text-slate-400">{client.used.toLocaleString()}</span>
                        <span className="text-slate-500">{client.limit.toLocaleString()} max</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${client.used / client.limit > 0.9 ? 'bg-red-500' : 'bg-purple-500'}`} 
                          style={{ width: `${Math.min(100, (client.used / client.limit) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      client.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      client.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {client.status !== 'Disabled' && client.status !== 'Paused' && (
                        <button 
                          onClick={() => handlePauseKey(client.id)}
                          className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors flex items-center justify-center"
                          title="Pause API Key"
                        >
                          <Pause size={16} />
                        </button>
                      )}
                      {client.status === 'Paused' && (
                        <button 
                          onClick={() => handleUnpauseKey(client.id)}
                          className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors flex items-center justify-center"
                          title="Unpause API Key"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      {client.status !== 'Disabled' && (
                        <button 
                          onClick={() => handleRevokeKey(client.id)}
                          className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors flex items-center justify-center"
                          title="Revoke API Key"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteSeat(client.id)}
                        className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center justify-center"
                        title="Delete Seat"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No active client seats.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          Showing {clients.length} of {clients.length} clients.
        </div>
      </div>
    </div>
  );
}
