"use client";

import React, { useState } from 'react';
import { Bot, Search } from 'lucide-react';
import { PREBUILT_AGENTS } from '@/lib/constants';
import { Navbar, Footer } from '@/components/Layout';
import { AgentCard } from '@/components/AgentCard';

export default function AgentsShowcasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'subscription' | 'one-time'>('all');

  const filteredAgents = PREBUILT_AGENTS.filter(agent => {
    const matchesSearch = agent.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || agent.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Agent Showcase</h1>
            <p className="text-xl text-slate-400 max-w-2xl">Explore our full library of prebuilt AI agents designed to automate every facet of your business.</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'subscription', 'one-time'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-4 rounded-2xl font-bold capitalize transition-all border ${filter === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  {f.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/50 rounded-[40px] border border-slate-800">
              <Bot size={64} className="mx-auto text-slate-700 mb-6" />
              <h3 className="text-2xl font-bold mb-2">No agents found</h3>
              <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
