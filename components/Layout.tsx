"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { LogoIcon, LogoFull } from '@/components/Logo';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Agents', href: '/#agents' },
    { name: 'Hosting', href: '/#hosting' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-500 flex justify-center mt-3 px-3 sm:mt-4 sm:px-6">
      <div className={`w-full max-w-5xl px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center transition-all duration-500 rounded-full ${scrolled ? 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent'}`}>
        <Link href="/" className="shrink-0">
          <LogoFull height={30} className="sm:hidden" />
          <LogoFull height={34} className="hidden sm:flex" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/#contact" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full text-sm font-bold transition-all backdrop-blur-md">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-[80px] left-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/#contact" 
                className="w-full mt-4 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-center rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative py-16 mt-20 border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <Link href="/">
          <LogoFull height={30} showTagline />
        </Link>
        <div className="text-slate-400 text-sm">
          © 2026 Ezydrag AI Automation. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
          <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
