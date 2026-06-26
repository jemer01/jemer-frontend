/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY UNIVERSAL REPOSITORY — THEME MODE TOGGLE BUTTON MODULE
 * ================================================================================================
 * Description: Reusable theme toggle button displaying contextual design layouts.
 * Technology Focus: React 19 Custom Hooks Consumer + Pure Inline SVG Visual Assets.
 * Category Location: Saved inside src/jemer-components/ui/
 * ================================================================================================
 */

"use client"; // Enforces client execution rules to permit interface hook event attachments

import React from 'react'; // Pulls the base framework runtime specifications
import { useTheme } from '@/jemer-components/context/ThemeContext.jsx'; // Imports our global theme hook pipeline router

/**
 * Reusable Universal Theme Toggling Button Widget Component
 */
export default function ThemeToggle() {
  // Capture active operational contexts and toggle loops directly out of our global state manager
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle user workspace color display theme profiles manually"
      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer relative group overflow-hidden"
    >
      {/* ☀️ SUN VECTOR ICON PATH: Renders exclusively when the theme is locked inside dark mode states */}
      <svg
        className={`w-4 h-4 transition-transform duration-300 absolute ${
          theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-45 opacity-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>

      {/* 🌙 MOON VECTOR ICON PATH: Renders exclusively when the theme is locked inside light mode states */}
      <svg
        className={`w-4 h-4 transition-transform duration-300 absolute ${
          theme === 'light' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-45 opacity-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  );
}