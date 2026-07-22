/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — BOOKSHELF PAGE ROUTER (v1.0)
 * ================================================================================================
 * SUMMARY: Assembles the Bookshelf view.
 * 1. Injects `<BookshelfOnboarding />` as a silent overlay layer.
 * 2. Mounts `<BooksWidget />` cleanly underneath the ecosystem header.
 */

import React from "react";
import BooksWidget from "@/jemer-components/bookshelf/books-widget.jsx";
import BookshelfOnboarding from "@/jemer-components/bookshelf/bookshelf-onboarding.jsx";

export const metadata = {
  title: "Digital Library | Jemer Academy",
  description: "Access curated study guides, textbooks, and academic material instantly.",
};

export default function BookshelfPage() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 lg:gap-10 animate-fade-in relative h-full">
      
      {/* 🚀 ONBOARDING MODAL OVERLAY INJECTION */}
      <BookshelfOnboarding />

      {/* ── HIGH-FIDELITY HEADER REGION ── */}
      <header className="flex flex-col gap-3 lg:gap-4 relative z-10 mb-2">
        
        {/* Pulsing Ecosystem Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-800/50 w-fit shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            Jemer Digital Library
          </span>
        </div>
        
        {/* Gradient Typography Engine */}
        <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">Knowledge Space</span>
        </h1>
        
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Your personal academic library. Browse syllabuses, read structured textbooks, and track your studying progress all in one beautifully unified workspace.
        </p>
      </header>

      {/* ── INTERACTIVE LIBRARY WIDGET REGION ── */}
      <section className="w-full h-full flex-1">
        <BooksWidget />
      </section>

    </div>
  );
}