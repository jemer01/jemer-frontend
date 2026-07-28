// src/jemer-components/billings/billings.jsx
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.1 - SUBSCRIPTION & BILLINGS DASHBOARD FIX)
 * ================================================================================================
 * 1. PURE REACT SVG INTEGRATION: Completely eradicated the broken FontAwesome `<i>` tags. 
 *    Every single icon (Wallets, Checkmarks, Arrows, Crowns, Shopping Carts, Cameras, Locks, 
 *    and Spinners) has been surgically replaced with high-fidelity, native inline `<svg>` elements. 
 *    This guarantees perfect rendering in Next.js with zero external dependencies or flashes.
 * 2. MODAL & PORTAL INTEGRITY: The native SVGs drop perfectly into the Wallet and Notification 
 *    modals, preserving the beautiful layouts and animations.
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Billings({ onOpenCustomPlan }) {
  // Mounting state for React Portals
  const [mounted, setMounted] = useState(false);
  
  // Modal Visibility States
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [flwNotification, setFlwNotification] = useState({ isOpen: false, planName: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (isWalletOpen || flwNotification.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isWalletOpen, flwNotification.isOpen]);

  const handleSubscribeClick = (planName) => {
    setFlwNotification({ isOpen: true, planName });
    // Auto-close notification after 3 seconds to simulate redirect completion
    setTimeout(() => setFlwNotification({ isOpen: false, planName: "" }), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-fade-in pb-12">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HEADER: PAGE INTRO & MY WALLET BUTTON
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Jemer Subscriptions
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Unlock Absolute Mastery
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Upgrade your intelligence engine. Choose a curated plan to unlock infinite exams, advanced AI tutors, and seamless video extraction tools.
          </p>
        </div>

        <button 
          onClick={() => setIsWalletOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            {/* 🆕 Wallet SVG */}
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <div className="text-left flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jemer Wallet</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">View Balances</span>
          </div>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          PRICING CARDS MATRIX (Zero Blank Spaces)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* 1. FREE PLAN CARD */}
        <div className="relative flex flex-col p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">$0</span>
              <span className="text-sm font-bold text-slate-400">/mo</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-3">Basic access to kickstart your journey.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {[
              "15 Jemer Flash Snaps/day",
              "Teacher Dave (70 prompts)",
              "Teacher Emily (3 prompts)",
              "5 Exam Sims / 10 Humanity",
              "Ads Included (Unlimited)"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                {/* 🆕 Check Circle SVG (Slate) */}
                <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button className="w-full py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm cursor-not-allowed border border-transparent">
            Current Active Plan
          </button>
        </div>

        {/* 2. STANDARD PLAN (RECOMMENDED) */}
        <div className="relative flex flex-col p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-2 border-indigo-500 shadow-xl transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
            Recommended
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-display font-black text-indigo-900 dark:text-indigo-300 mb-2">Standard</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">€7.47</span>
              <span className="text-sm font-bold text-slate-400">/30 days</span>
            </div>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium mt-3">The perfect balance for dedicated students.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {[
              "25 Flash Snaps/day",
              "Teacher Emily (85 prompts)",
              "500 Humanity Exams",
              "Course Gen: 1 Budget / 3 Pro",
              "Speech: 8 Budget / 20 Pro",
              "Ads Included",
              "Early Access Features"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                {/* 🆕 Check Circle SVG (Indigo) */}
                <svg className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => handleSubscribeClick("Standard Plan")}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm transition-all active:scale-95 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 focus:outline-none"
          >
            <span>Subscribe Now</span>
            {/* 🆕 Arrow Right SVG */}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* 3. JEMER ELITE PLAN */}
        <div className="relative flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="mb-6 relative z-10">
            <h3 className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 mb-2">Jemer Elite</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-white">€14.93</span>
              <span className="text-sm font-bold text-slate-400">/30 days</span>
            </div>
            <p className="text-xs text-fuchsia-200/60 font-medium mt-3">Absolute power. No restrictions.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            {[
              "No Ads (Zero)",
              "Teacher Jay (450 prompts)",
              "Teacher Dave/Emily (200 ea)",
              "Vid2Notes: 10 Budget / 20 Pro",
              "Speech: 50 Budget / 70 Pro",
              "Adv. Pro Calculator & Dictionary",
              "24/7 Priority Support"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-300">
                {/* 🆕 Check Circle SVG (Fuchsia) */}
                <svg className="w-4 h-4 text-fuchsia-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => handleSubscribeClick("Jemer Elite")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black text-sm transition-all active:scale-95 shadow-lg shadow-fuchsia-500/20 relative z-10 flex items-center justify-center gap-2 focus:outline-none"
          >
            <span>Claim Elite Status</span>
            {/* 🆕 Crown SVG */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3l4.5 4.5L16.5 3l4.5 4.5v12h-18v-12z" />
            </svg>
          </button>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          BOTTOM CTA: BUILD ME A PLAN ROUTING
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full flex justify-center pt-6">
        <div 
          onClick={onOpenCustomPlan}
          className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group"
        >
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-200/50 shrink-0 group-hover:scale-105 transition-transform">
              {/* 🆕 Shopping Cart SVG */}
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Build Me A Plan</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5 max-w-md">
                Don't need everything? Visit the Jemer Marketplace to buy exact quantities of only the specific AI features you use. Pay for what you need, nothing more.
              </p>
            </div>
          </div>
          <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 shrink-0 focus:outline-none">
            <span>Enter Marketplace</span>
            {/* 🆕 Arrow Right SVG */}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          MODALS & OVERLAYS (TELEPORTED TO BODY)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      
      {/* 1. WALLET MODAL */}
      {mounted && isWalletOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up relative flex flex-col max-h-[85vh]">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 shrink-0">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {/* 🆕 Wallet SVG */}
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                Digital Wallet
              </h3>
              <button onClick={() => setIsWalletOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors focus:outline-none">
                {/* 🆕 Close/Times SVG */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto billing-premium-scroll pr-2 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
                Your remaining customized feature credits available for this billing cycle.
              </p>
              
              {/* Mock Token Balances using pure SVGs */}
              {[
                { 
                  name: "Flash Snaps", count: 42, color: "text-blue-500",
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg> 
                },
                { 
                  name: "Teacher Emily Prompts", count: 18, color: "text-purple-500",
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18" /></svg> 
                },
                { 
                  name: "Course Gen (Pro)", count: 2, color: "text-emerald-500",
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> 
                },
                { 
                  name: "Vid2Notes (Budget)", count: 7, color: "text-amber-500",
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg> 
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                  </div>
                  <span className="text-base font-black font-mono text-slate-900 dark:text-white">{item.count}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-4 shrink-0">
              <button onClick={() => { setIsWalletOpen(false); onOpenCustomPlan(); }} className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 focus:outline-none">
                Buy More Credits
              </button>
            </div>
            
          </div>
        </div>,
        document.body
      )}

      {/* 2. FLUTTERWAVE REDIRECT NOTIFICATION MODAL */}
      {mounted && flwNotification.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-800 shadow-inner relative">
              {/* 🆕 Lock SVG */}
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 relative z-10" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-2">Secure Checkout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Initializing encrypted transaction for the <strong className="text-slate-700 dark:text-slate-200">{flwNotification.planName}</strong>.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {/* 🆕 Smooth Spinner SVG */}
              <svg className="w-4 h-4 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Redirecting to Flutterwave...</span>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}