"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Coins, 
  Settings, 
  BarChart, 
  LogOut,
  Bell,
  Bot,
  Menu,
  X,
  Package
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: '/partner/dashboard', label: 'Overview', icon: BarChart },
    { href: '/partner/dashboard/clients', label: 'Client Seats', icon: Users },
    { href: '/partner/dashboard/custom-agent', label: 'Custom Agent', icon: Bot },
    { href: '/partner/dashboard/billing', label: 'Billing & Credits', icon: Coins },
    { href: '/partner/dashboard/pricing', label: 'Pricing Plans', icon: Package },
    { href: '/partner/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-950 lg:bg-slate-900/50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white">
                A
              </div>
              <h1 className="font-bold text-lg">Acme Digital</h1>
            </div>
            <p className="text-xs text-slate-400 pl-11">Partner Portal</p>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                  ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                <Icon size={20} /> {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <Link href="/partner/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 font-medium transition-colors">
            <LogOut size={20} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-0">
        {/* Topbar */}
        <header className="h-20 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold truncate hidden sm:block">Dashboard</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-slate-900"></div>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold">Jane Doe</div>
                <div className="text-xs text-slate-400">Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 text-sm">JD</div>
            </div>
          </div>
        </header>

        {/* Scrollable Content (Page injected here) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
