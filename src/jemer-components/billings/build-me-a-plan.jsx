"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.1 - BUILD ME A PLAN MARKETPLACE FIX)
 * ================================================================================================
 * 1. PURE REACT SVG INTEGRATION: Completely eliminated all broken FontAwesome `<i>` tags. 
 *    Every product icon (Cameras, Brains, Books, Microphones, Crowns) and UI action icon 
 *    (Headset, Locks, Spinners, Arrows) is now built with native, high-fidelity inline `<svg>` 
 *    elements to guarantee 100% reliable rendering in Next.js.
 * 2. FOOTER UI ALIGNMENT FIXED: Corrected the awkward empty space on the left side of laptop 
 *    screens. The fixed footer now mirrors the exact padding (`lg:p-8`) and bounding box 
 *    (`max-w-7xl mx-auto`) of the main content grid, ensuring the "Custom Plan Total" perfectly 
 *    flushes to the left boundary of the product grid.
 * 3. FLUTTERWAVE CHECKOUT MODAL: The loading modal now features a native SVG spinner and lock, 
 *    keeping the pristine design intact.
 * ================================================================================================
 */

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

// ── 🛒 PRODUCT CATALOG DATABASES (Now with Pure SVG Nodes) ──────────────────────────────────
const PRODUCT_CATEGORIES = [
  {
    category: "Core Utilities",
    items: [
      { 
        id: "flash_snaps", name: "Flash Snaps", desc: "Instant photo answers.", price: 0.0042, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg> 
      },
      { 
        id: "exam_sim", name: "Exam Simulator", desc: "Real test practice.", price: 0.01, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg> 
      }
    ]
  },
  {
    category: "AI Tutors",
    items: [
      { 
        id: "tutor_genie", name: "Jemer Genie", desc: "Basic Helper.", price: 0.02, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg> 
      },
      { 
        id: "tutor_dave", name: "Teacher Dave", desc: "Intermediate logic.", price: 0.03, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> 
      },
      { 
        id: "tutor_emily", name: "Teacher Emily", desc: "Advanced reasoning.", price: 0.05, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18" /></svg> 
      },
      { 
        id: "tutor_jay", name: "Teacher Jay", desc: "Expert Master. BEST", price: 0.08, badge: "Elite", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> 
      }
    ]
  },
  {
    category: "Advanced Tools",
    items: [
      { 
        id: "course_budget", name: "Course Gen (Budget)", desc: "Standard generation.", price: 0.10, color: "text-slate-500", bg: "bg-slate-200 dark:bg-slate-800",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> 
      },
      { 
        id: "course_pro", name: "Course Gen (Pro)", desc: "Higher quality & depth.", price: 0.25, badge: "Better", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> 
      },
      { 
        id: "vid2notes_budget", name: "Vid2Notes (Budget)", desc: "Standard extraction.", price: 0.05, color: "text-slate-500", bg: "bg-slate-200 dark:bg-slate-800",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg> 
      },
      { 
        id: "vid2notes_pro", name: "Vid2Notes (Pro)", desc: "More accurate summaries.", price: 0.15, badge: "Better", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> 
      },
      { 
        id: "speech_budget", name: "Speech (Budget)", desc: "Standard text-to-speech.", price: 0.02, color: "text-slate-500", bg: "bg-slate-200 dark:bg-slate-800",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg> 
      },
      { 
        id: "speech_pro", name: "Speech (Pro)", desc: "Studio quality voice.", price: 0.08, badge: "Better", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/40",
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg> 
      }
    ]
  }
];

export default function BuildMeAPlan({ onBack }) {
  // State: Tracks quantity of each feature. Key = item.id, Value = quantity integer.
  const [cart, setCart] = useState({});
  // State: Tracks the specific 24/7 priority support one-time fee
  const [hasPrioritySupport, setHasPrioritySupport] = useState(false);

  // Modal State for Checkout Interceptor
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when checkout modal is open
  useEffect(() => {
    if (isCheckoutModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isCheckoutModalOpen]);

  // ── 🧮 LOGIC & HANDLERS ──────────────────────────────────────────────────────────────

  const handleIncrement = (id) => {
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      // Constraint: Jump from 0 to 5. Otherwise step by 1. Max 100.
      if (currentQty === 0) return { ...prev, [id]: 5 };
      if (currentQty >= 100) return prev;
      return { ...prev, [id]: currentQty + 1 };
    });
  };

  const handleDecrement = (id) => {
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      // Constraint: Drop from 5 to 0. Otherwise step down by 1. Min 0.
      if (currentQty <= 5) {
        const newCart = { ...prev };
        delete newCart[id]; // Keep state clean
        return newCart;
      }
      return { ...prev, [id]: currentQty - 1 };
    });
  };

  const calculateTotal = useMemo(() => {
    let total = 0;
    
    // Add up all items in cart based on database prices
    PRODUCT_CATEGORIES.forEach(category => {
      category.items.forEach(item => {
        const qty = cart[item.id] || 0;
        total += (qty * item.price);
      });
    });

    // Add €0.90 priority support fee
    if (hasPrioritySupport) {
      total += 0.90;
    }

    return total;
  }, [cart, hasPrioritySupport]);

  const handleCheckout = () => {
    if (calculateTotal <= 0) {
      alert("Please add at least one feature to your custom plan before checking out.");
      return;
    }
    setIsCheckoutModalOpen(true);
    // Simulate redirection timeout
    setTimeout(() => {
      setIsCheckoutModalOpen(false);
    }, 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col relative animate-fade-in pb-32">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HEADER & NAVIGATION
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div className="text-left">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors font-mono mb-3 focus:outline-none"
          >
            {/* 🆕 Arrow Left SVG */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Plans
          </button>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Custom Plan Marketplace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl mt-2">
            Build your personalized ecosystem. Select exact quantities of the tools you use most. Minimum 5 credits per selected feature. Maximum 100.
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SHOPPING MALL: PRODUCT GRID
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-10">
        {PRODUCT_CATEGORIES.map((category) => (
          <div key={category.category} className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              {category.category}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.items.map((item) => {
                const qty = cart[item.id] || 0;
                const isActive = qty > 0;

                return (
                  <div 
                    key={item.id} 
                    className={`relative flex flex-col p-5 rounded-3xl border transition-all duration-300 shadow-sm ${
                      isActive 
                        ? "bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-500/20" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Badge Overlay */}
                    {item.badge && (
                      <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                        {item.badge}
                      </span>
                    )}

                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/50 shadow-inner ${item.bg} ${item.color}`}>
                        {/* 🆕 Render Native SVG Icon */}
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">{item.desc}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Unit Price</span>
                        <span className="text-sm font-black font-mono text-slate-900 dark:text-white">€{item.price.toFixed(4)}</span>
                      </div>

                      {/* Stepper Control */}
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                        <button 
                          onClick={() => handleDecrement(item.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black transition-colors focus:outline-none ${
                            isActive ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:text-rose-500" : "text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          -
                        </button>
                        <span className={`w-6 text-center text-xs font-mono font-black ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
                          {qty}
                        </span>
                        <button 
                          onClick={() => handleIncrement(item.id)}
                          disabled={qty >= 100}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black transition-colors focus:outline-none ${
                            qty < 100 ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:text-emerald-500" : "text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ────────────────────────────────────────────────────────────────────────────────────────
            ADD-ON: 24/7 PRIORITY SUPPORT (One-time toggle)
           ──────────────────────────────────────────────────────────────────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            Add-ons & Support
          </h2>
          
          <div 
            onClick={() => setHasPrioritySupport(!hasPrioritySupport)}
            className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300 cursor-pointer shadow-sm ${
              hasPrioritySupport 
                ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-400 dark:border-amber-600 ring-1 ring-amber-500/20" 
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                hasPrioritySupport ? "bg-amber-100 border-amber-300 text-amber-600 dark:bg-amber-900/40 dark:border-amber-700" : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700"
              }`}>
                {/* 🆕 Phone/Support SVG */}
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.353-1.135-4.276-3.058-5.411-5.41l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-slate-900 dark:text-white">24/7 Priority Support</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Get immediate human assistance and premium ticket routing.</span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-4 sm:pt-0">
              <div className="flex flex-col sm:items-end">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">One-time fee</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white">€0.90</span>
              </div>
              
              {/* Toggle Switch UI */}
              <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors shrink-0 shadow-inner ${hasPrioritySupport ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${hasPrioritySupport ? "translate-x-6" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          STICKY LIVE CALCULATOR FOOTER
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      {/* 🆕 ALIGNMENT FIX: The fixed wrapper now has identical padding `p-4 sm:p-6 lg:p-8` to match the main layout body, preventing awkward left-side empty gaps */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 sm:p-6 lg:p-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col text-center sm:text-left w-full sm:w-auto">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Custom Plan Total</span>
            <span className="text-3xl sm:text-4xl font-display font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              €{calculateTotal.toFixed(2)}
            </span>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 shrink-0 focus:outline-none"
          >
            <span>Checkout & Generate Plan</span>
            {/* 🆕 Lock SVG */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          FLUTTERWAVE CHECKOUT INTERCEPTOR MODAL (PORTAL)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      {mounted && isCheckoutModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-slide-up">
            
            {/* Spinning Lock Graphic */}
            <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-800 shadow-inner relative">
              {/* 🆕 Spinner SVG */}
              <svg className="w-20 h-20 text-indigo-200 dark:text-indigo-900/50 absolute animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {/* 🆕 Lock SVG */}
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 relative z-10" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">Secure Gateway</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Compiling your custom matrix and initializing encrypted transaction for <strong className="text-slate-800 dark:text-slate-200 font-mono">€{calculateTotal.toFixed(2)}</strong>.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2 bg-slate-50 dark:bg-slate-950 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connecting to Flutterwave...
              </span>
            </div>
            
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}