/**
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — INTERACTIVE BOOK GRID (v1.0)
 * ================================================================================================
 * SUMMARY: Renders the digital library interface and intercepts clicks with a custom modal.
 * 1. Internal State: `selectedBook` triggers the "Coming Soon" modal overlay without leaving the page.
 * 2. Premium Grid: Beautiful ambient glows, hover physics, and dynamic icon rendering.
 */

"use client";

import React, { useState } from "react";

// 🧠 PRE-CONFIGURED DUMMY DATA FOR FRONTEND UI/UX PERFECTION
const dummyBooks = [
  {
    id: 1,
    title: "WAEC Chemistry: Complete Syllabus Guide",
    category: "Exam Prep",
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    icon: "fa-flask",
    desc: "Comprehensive breakdown of organic and inorganic chemistry required for WAEC.",
  },
  {
    id: 2,
    title: "The Supabase Architecture Blueprint",
    category: "Backend Engineering",
    color: "from-green-500 to-emerald-700",
    shadow: "shadow-green-500/20",
    icon: "fa-database",
    desc: "Mastering real-time databases, authentication flows, and edge functions.",
  },
  {
    id: 3,
    title: "Mastering Tailwind CSS & React",
    category: "Frontend Development",
    color: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/20",
    icon: "fa-code",
    desc: "Building high-fidelity, responsive user interfaces with zero friction.",
  },
  {
    id: 4,
    title: "Advanced Core Mathematics",
    category: "Academics",
    color: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/20",
    icon: "fa-square-root-variable",
    desc: "Step-by-step logic solving for calculus, algebra, and complex equations.",
  }
];

export default function BooksWidget() {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="relative w-full h-full pb-8">
      
      {/* ── BOOK GRID MATRIX ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {dummyBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="group relative w-full min-h-[280px] rounded-[24px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-xl dark:shadow-black/40 hover:shadow-2xl dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer ring-1 ring-white/50 dark:ring-white/5"
          >
            {/* Ambient Background Glow Effect */}
            <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${book.color} opacity-10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700 pointer-events-none`} />

            {/* Book Spine / Cover Illustration */}
            <div className={`w-16 h-20 rounded-xl bg-gradient-to-br ${book.color} shadow-lg ${book.shadow} mb-6 flex items-center justify-center text-white ring-2 ring-white/20 group-hover:-translate-y-2 transition-transform duration-500 ease-out`}>
              <i className={`fas ${book.icon} text-2xl`}></i>
            </div>

            {/* Typography Stack */}
            <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                {book.category}
              </span>
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white leading-tight mb-3">
                {book.title}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {book.desc}
              </p>
            </div>

            {/* Hover Arrow Indicator */}
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
              <i className="fas fa-arrow-right text-xs"></i>
            </div>
          </div>
        ))}
      </div>

      {/* ── COMING SOON INTERCEPTOR MODAL ── */}
      {selectedBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur Lock */}
          <div 
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in cursor-pointer"
            onClick={() => setSelectedBook(null)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center animate-modal-pro scale-100 overflow-hidden">
            
            {/* Top decorative gradient bar */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedBook.color}`} />
            
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedBook.color} shadow-lg flex items-center justify-center text-white mb-6 ring-4 ring-slate-50 dark:ring-slate-950`}>
              <i className="fas fa-hammer text-xl"></i>
            </div>
            
            <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-3">
              Feature in Development
            </h2>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              The Jemer Academy engineering team is currently building the reading engine for <strong className="text-slate-700 dark:text-slate-300">{selectedBook.title}</strong>. We're connecting the database right now. Check back soon!
            </p>
            
            <button
              onClick={() => setSelectedBook(null)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}