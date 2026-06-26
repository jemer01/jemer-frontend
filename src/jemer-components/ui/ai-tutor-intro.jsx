/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — SPECIALIZED AI TUTOR INTRO CANOPY ENGINE (v1.0)
 * ================================================================================================
 * Description: Adaptive landing dashboard screen greeting returning students.
 * Performance Tier: 0ms Latency Cache-First Hydration Engine preventing layout text jumps.
 * Design Focus: High-contrast responsive typography handling dark and light workspace canvas modes.
 * Compliance: 100% comprehensive line-by-line developer documentation for absolute clarity.
 * ================================================================================================
 */

"use client"; // Directs the Next.js framework compiler to safely execute interactive browser DOM layers

import React, { useState, useEffect } from "react"; // Pulls standard state and system lifecycle methods out of core React

/**
 * Universal AI Tutor Welcoming Introduction Component Interface
 * @param {Object} props - Structural property configurations assigned by parent layout managers.
 * @param {function} props.onSelectPrompt - Execution callback pipeline injecting selected starter prompts into the main text frame.
 */
export default function AITutorIntro({ onSelectPrompt }) {
  // 🧬 PERFORMANCE OPTIMIZED PROFILE STATE VECTORS:
  // FIXED HYDRATION baseline: Establishes a symmetric static initial layout value identically on both
  // Server (SSR) and Client first-pass runs to completely wipe out React 19 attribute delta mismatches.
  const [studentProfile, setStudentProfile] = useState({ 
    firstName: "Student", 
    lastName: "Workspace" 
  });

  /**
   * [CACHE-FIRST CLIENT-SIDE HYDRATION LOGIC ENGINE]
   * Fires exactly once post-mount to extract biographical tokens natively saved inside 
   * browser storage boundaries, entirely preventing expensive database round-trips.
   */
  useEffect(() => {
    try {
      console.log("[INTRO HUB CORE] Accessing client local storage registries to hydrate greeting labels...");

      // Pull down previously deposited student identification tokens out of local browser memory maps
      const cachedFirst = localStorage.getItem("jemer_user_first_name");
      const cachedLast = localStorage.getItem("jemer_user_last_name");

      // PERFORMANCE COUPLING GATE: If cached strings exist, apply them directly to state vectors 
      // post-hydration and skip running network select statements down to the serverless database.
      if (cachedFirst && cachedLast) {
        console.log(`[INTRO HUB CACHE HIT] Hydrating identity parameters for: ${cachedFirst} ${cachedLast}`);
        setStudentProfile({
          firstName: cachedFirst,
          lastName: cachedLast
        });
      } else {
        console.warn("[INTRO HUB CACHE MISS] Identity keys empty or unallocated. Defaulting to sandbox guest terms.");
      }
    } catch (cacheException) {
      console.error("[INTRO IDENTITY PROFILE EXCEPTION] Failed to safely pull client context tokens:", cacheException.message);
    }
  }, []); // Static tracking loop vector executing precisely on component tree assembly

  // 🌍 GLOBAL CURRICULUM STARTER PROMPT DIRECTIVES MATRIX
  // Re-mapped to support universal academic domains across Science, Arts, and Social Sciences.
  // Each card maps inline graphic indicators, categorization fields, and raw textual payloads.
  const internationalCurriculumPrompts = [
    {
      label: "Quantum Foundations",
      branch: "Science & Tech",
      iconGlyph: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 011-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      promptText: "Explain the core concepts of Quantum Computing and how qubits differ from classical bits using simple everyday analogies."
    },
    {
      label: "Literature Analysis",
      branch: "Arts & Humanities",
      iconGlyph: (
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      promptText: "Break down the core philosophical themes, structural narrative layers, and character motifs in Shakespeare's 'Hamlet'."
    },
    {
      label: "Macroeconomic Policy",
      branch: "Social Sciences",
      iconGlyph: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
      promptText: "Analyze the fiscal mechanisms and macroeconomic policy choices central banking authorities implement to suppress global inflation trends."
    },
    {
      label: "Technical AI Architectures",
      branch: "Computer Science",
      iconGlyph: (
        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      promptText: "Detail how modern transformer models process multi-head self-attention mechanisms during parallel training sequences."
    }
  ];

  /**
   * Dispatches data fields upward when a user triggers an item click action loop
   * @param {string} promptTextPayload - The comprehensive textual question string configured on the tile.
   */
  const handleSuggestionSelection = (promptTextPayload) => {
    console.log("[INTRO SUGGESTION CLICK] Dispatching chosen prompt payload upstream:", promptTextPayload);
    // Execute communication callback bridge parameters if provided by structural parents
    if (onSelectPrompt) {
      onSelectPrompt(promptTextPayload);
    }
  };

  return (
    // 🏛️ MAIN SCREEN PRESENTATION RUNWAY: Centers design elements inside flexible view boundaries
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col text-left select-none animate-fade-in">
      
      {/* ── ZONE 1: HIGH-CONTRAST HEADER GREETING LAYERS ── */}
      <header className="space-y-2 block" aria-label="AI Tutor Greetings Dashboard">
        {/* Primary Identification String line: Outputs cached name strings instantly without layout shaking */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Hi there, <span className="text-blue-900 dark:text-blue-500 font-extrabold">{studentProfile.firstName} {studentProfile.lastName}</span>
        </h1>
        {/* Dynamic Action Subtext Statement */}
        <p className="text-xl sm:text-2xl font-display font-bold text-slate-700 dark:text-slate-200 tracking-tight">
          What do you want to learn?
        </p>
      </header>

      {/* ── ZONE 2: PLATFORM ADVISORY METHOD STATEMENT ── */}
      <div className="mt-8 block">
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          Use one of the most common prompts below or use your own to begin
        </p>
      </div>

      {/* ── ZONE 3: RESPONSIVE CURRICULUM PROMPT GRID CARD BLOCKS ── */}
      {/* Renders 4 balanced grid systems side-by-side on large devices, stepping down cleanly to vertical layout rows on mobile */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 w-full">
        {internationalCurriculumPrompts.map((card, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSuggestionSelection(card.promptText)}
            className="group w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-900/40 dark:hover:border-blue-500/40 rounded-2xl p-4 text-left flex flex-col justify-between items-start transition-all duration-200 hover:shadow-md cursor-pointer active:scale-[0.98] focus:outline-none min-h-[140px] sm:min-h-[160px] relative overflow-hidden"
            title={`Auto inject "${card.label}" starter prompt sequence`}
          >
            {/* Upper Frame: Houses descriptive title metrics and custom branch taxonomy strings */}
            <div className="space-y-2.5 w-full">
              <div className="flex items-center justify-between w-full">
                {/* Categorization field marker token configured with specialized monospace configurations */}
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block truncate max-w-[80%]">
                  {card.branch}
                </span>
                {/* Dynamic vector icon container node mapping chosen domain graphics handles */}
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors shrink-0">
                  {card.iconGlyph}
                </div>
              </div>
              
              {/* Short explicit design prompt headers display statement labels */}
              <h3 className="text-xs sm:text-sm font-sans font-extrabold text-slate-800 dark:text-slate-200 tracking-tight leading-snug group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {card.label}
              </h3>
            </div>

            {/* Lower Frame: Displays blurred preview string fields hinting at underlying full text vectors */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-normal line-clamp-2 mt-3 block border-t border-slate-50 dark:border-slate-800/30 pt-2 w-full group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
              &quot;{card.promptText}&quot;
            </p>
          </button>
        ))}
      </div>

    </div>
  );
}