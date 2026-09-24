/**
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Bookshelf Page Router Lockdown Integration (v2.1)
 * 1. Double Guard Barrier: Mounted `<BookshelfLockModal />` at the root view layer alongside the existing components.
 * 2. Zero Code Destruction: Preserved SEO metadata, `<BookshelfOnboarding />`, and `<BooksWidget />` completely untouched.
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — BOOKSHELF PAGE ROUTER (v2.1)
 * ================================================================================================
 */

import React from "react";
import BooksWidget from "@/jemer-components/bookshelf/books-widget.jsx";
import BookshelfOnboarding from "@/jemer-components/bookshelf/bookshelf-onboarding.jsx";
import BookshelfLockModal from "@/jemer-components/ui/bookshelf-lock-modal.jsx"; // 🚀 NEW: Import Lock Modal

export const metadata = {
  title: "Digital Library (Preview) | Jemer Academy",
  description: "Get a sneak peek at our upcoming digital library of curated study guides and textbooks.",
};

export default function BookshelfPage() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 lg:gap-10 animate-fade-in relative h-full">
      
      {/* 🚀 NEW: DEVELOPMENT LOCK OVERLAY (Delete this line to launch the feature when ready) */}
      <BookshelfLockModal />

      {/* ONBOARDING MODAL OVERLAY INJECTION */}
      <BookshelfOnboarding />

      {/* ── HIGH-FIDELITY HEADER REGION ── */}
      <header className="flex flex-col gap-3 lg:gap-4 relative z-10 mb-2 px-4 sm:px-0">
        
        {/* Pulsing Ecosystem Badge - Upgraded to Blue */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/50 w-fit shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
            Coming Soon: Jemer Library
          </span>
        </div>
        
        {/* Manifesto Compliance: Removed gradient text for solid high-contrast text-blue-600 */}
        <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Curated <span className="text-blue-600 dark:text-blue-400">Knowledge Space</span>
        </h1>
        
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Get an early look at our upcoming academic library. Soon, you will be able to browse syllabuses, read structured textbooks, and track your studying progress all in one unified workspace.
        </p>
      </header>

      {/* ── INTERACTIVE LIBRARY WIDGET REGION ── */}
      <section className="w-full h-full flex-1 px-4 sm:px-0">
        <BooksWidget />
      </section>

    </div>
  );
}