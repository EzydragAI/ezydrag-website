"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { AIAgent } from '@/lib/types';

interface AgentCardProps {
  agent: AIAgent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div
      className="flex flex-col h-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{agent.title}</h3>
        <p className="text-slate-400 text-sm">{agent.description}</p>
      </div>
      <div className="space-y-3 mb-8 flex-grow">
        {agent.features.map(feature => (
          <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle2 size={16} className="text-blue-500" />
            {feature}
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold">{agent.pricing}</span>
          {agent.type === 'subscription' && <span className="text-slate-500 text-sm">/month</span>}
        </div>
        <button className="w-full py-3 bg-slate-800 hover:bg-blue-600 text-white rounded-xl font-bold transition-all">
          Deploy Now
        </button>
      </div>
    </div>
  );
}
