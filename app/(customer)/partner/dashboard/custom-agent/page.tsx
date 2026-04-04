"use client";

import React, { useState } from 'react';
import { Send, Bot, FileText, CheckCircle2 } from 'lucide-react';

export default function CustomAgentRequestPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      agentName: formData.get('agentName'),
      description: formData.get('description'),
      features: formData.get('features'),
    };

    try {
      // Calling our Next.js API route that handles SMTP mailing
      const res = await fetch('/api/request-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        alert('Failed to submit request. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('An error occurred.');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Request Delivered!</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Our engineering team has received your custom agent requirements. We will review the details and get back to you within 24-48 hours.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">Request Custom Agent</h2>
        <p className="text-slate-400">Can't find what you need in our general templates? Describe the exact agent your client requires, and our engineering team will build it.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Proposed Agent Name</label>
            <div className="relative">
              <Bot className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                name="agentName"
                type="text" 
                required
                placeholder="e.g. Legal Document Analyzer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Objective & Scope</label>
            <div className="relative">
              <textarea 
                name="description"
                required
                rows={4}
                placeholder="Describe what the agent needs to achieve and what its primary role will be..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              ></textarea>
            </div>
            <p className="text-xs text-slate-500 mt-2">Provide as much context as possible about the end-client's business.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Specific Integrations / Features</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-500" size={18} />
              <textarea 
                name="features"
                required
                rows={3}
                placeholder="- Needs to connect to specific CRM&#10;- Requires custom prompt logic&#10;- Needs to output PDF reports"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              {status === 'submitting' ? 'Sending...' : (
                <>
                  <Send size={18} /> Send Request to Engineering
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
