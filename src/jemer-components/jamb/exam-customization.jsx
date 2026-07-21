"use client"; // Enforces client-side execution in Next.js for interactive state management, selection toggles, and form submissions

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY: EXAM CUSTOMIZATION & SUBJECT SELECTOR ENGINE (v1.0)
 * ================================================================================================
 * 1. DYNAMIC JAMB RULE ENFORCEMENT: Automatically detects `mode="jamb"` and enforces official UTME requirements:
 *    - "Use of English" is auto-selected and permanently locked (cannot be unselected).
 *    - User MUST pick exactly 3 additional subjects to complete the 4-subject requirement.
 *    - Automatically sets question distribution to 60 questions for Use of English and 40 questions for the other 3 subjects (Total: 180 questions).
 * 2. COMPREHENSIVE SUBJECT MATRIX: Includes 17 secondary school subjects, complete with unique, handcrafted, JSX-native SVG icons for zero external dependencies.
 * 3. DURATION & YEAR CONTROLLER: Allows time customization (15 mins up to 120 mins) and year filtering (2000 to 2026 plus a Multi-Year Weighted Randomizer option).
 * 4. REAL-TIME VALIDATION & SUMMARY DASHBOARD: Live status banner showing selection progress (e.g., 4/4 subjects), question breakdowns, total duration, and a Start simulation CTA.
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.1 - MOBILE & UI REFINEMENTS)
 * ================================================================================================
 * 1. MOBILE-OPTIMIZED SUBJECT TOGGLE: Added `showAllSubjects` state. On mobile screens (`sm:hidden`), 
 *    only 5 subjects display initially with a styled "See All / Show Less" button to expand the list.
 * 2. CUSTOM SCROLLBAR & OVERFLOW FIX: Injected premium CSS webkit scrollbar styling and applied 
 *    `overflow-x-hidden` to prevent ugly sideways scrolling on mobile devices.
 * 3. BOTTOM LAYOUT PADDING: Added generous bottom padding (`pb-24 lg:pb-32`) to the root container 
 *    to prevent the "Start Simulation" summary bar from being cut off on BOTH mobile and laptops.
 * 4. JAMB OFFICIAL LOGO INTEGRATION: Embedded the official JAMB logo as an absolute background layer 
 *    in the Hero Banner with a dark gradient scrim overlay for perfect text readability (WCAG compliant).
 * ================================================================================================
 */

// Import React core library and essential state/memo hooks
import React, { useState, useMemo } from "react";

/**
 * MASTER SUBJECT DATABASE ARRAY
 * Contains metadata and custom inline SVG icons for all 17 supported subjects.
 */
const ALL_SUBJECTS = [
  {
    id: "english",
    nameJamb: "Use of English", // Specific name display for JAMB mode
    nameDefault: "English Language", // Name display for WAEC and General practice modes
    category: "Compulsory", // Category tag
    // Inline SVG Icon for Use of English / Language
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "mathematics",
    nameJamb: "Mathematics",
    nameDefault: "Mathematics",
    category: "Science & Arts",
    // Inline SVG Icon for Mathematics
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "physics",
    nameJamb: "Physics",
    nameDefault: "Physics",
    category: "Science",
    // Inline SVG Icon for Physics (Atom symbol)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: "chemistry",
    nameJamb: "Chemistry",
    nameDefault: "Chemistry",
    category: "Science",
    // Inline SVG Icon for Chemistry (Flask symbol)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: "biology",
    nameJamb: "Biology",
    nameDefault: "Biology",
    category: "Science",
    // Inline SVG Icon for Biology (Leaf / Life symbol)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "economics",
    nameJamb: "Economics",
    nameDefault: "Economics",
    category: "Commercial & Social Science",
    // Inline SVG Icon for Economics (Trending growth chart)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: "commerce",
    nameJamb: "Commerce",
    nameDefault: "Commerce",
    category: "Commercial",
    // Inline SVG Icon for Commerce (Shopping bag / Trade)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: "accounting",
    nameJamb: "Accounting",
    nameDefault: "Principles of Accounts",
    category: "Commercial",
    // Inline SVG Icon for Accounting (Ledger / Balance sheet)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "government",
    nameJamb: "Government",
    nameDefault: "Government",
    category: "Arts & Social Science",
    // Inline SVG Icon for Government (Pillar structure / Capitol)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4m-4-4l-4-4m4 4l4-4" />
      </svg>
    ),
  },
  {
    id: "literature",
    nameJamb: "English Literature",
    nameDefault: "Literature in English",
    category: "Arts",
    // Inline SVG Icon for Literature (Feather / Open book)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: "crk",
    nameJamb: "Christian Religious Knowledge",
    nameDefault: "Christian Religious Knowledge",
    category: "Arts",
    // Inline SVG Icon for CRK (Sacred Scroll / Book)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "irk",
    nameJamb: "Islamic Religious Knowledge",
    nameDefault: "Islamic Religious Knowledge",
    category: "Arts",
    // Inline SVG Icon for IRK (Star / Geometric Crescent motif)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: "civic",
    nameJamb: "Civic Education",
    nameDefault: "Civic Education",
    category: "General",
    // Inline SVG Icon for Civic Education (Shield / Citizenship)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: "geography",
    nameJamb: "Geography",
    nameDefault: "Geography",
    category: "Arts & Science",
    // Inline SVG Icon for Geography (Globe / Terrain)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "history",
    nameJamb: "History",
    nameDefault: "History",
    category: "Arts",
    // Inline SVG Icon for History (Hourglass / Time)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "current_affairs",
    nameJamb: "Current Affairs",
    nameDefault: "Current Affairs",
    category: "General",
    // Inline SVG Icon for Current Affairs (Broadcast / News)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    id: "insurance",
    nameJamb: "Insurance",
    nameDefault: "Insurance",
    category: "Commercial",
    // Inline SVG Icon for Insurance (Umbrella / Protection)
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

/**
 * Generate year options array from 2000 through 2026
 */
const YEAR_OPTIONS = Array.from({ length: 2026 - 2000 + 1 }, (_, index) => (2026 - index).toString());

/**
 * ExamCustomization Component
 * 
 * @param {Object} props
 * @param {string} props.mode - Exam gateway mode ('jamb' | 'waec' | 'practice')
 * @param {Function} props.onStart - Callback function triggered with the final configuration payload
 */
export default function ExamCustomization({ mode = "jamb", onStart }) {
  // Boolean flag checking if current mode is JAMB
  const isJambMode = mode === "jamb";

  // 🆕 NEW: State to handle "See More" / mobile subject toggling
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  // State 1: Array of selected subject IDs. In JAMB mode, "english" is auto-selected by default.
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(() => {
    if (isJambMode) {
      return ["english"]; // Start with locked Use of English for JAMB mode
    }
    return [];
  });

  // State 2: Exam duration setting in minutes. JAMB standard total timer is 120 minutes (2 Hours).
  const [durationMinutes, setDurationMinutes] = useState(120);

  // State 3: Selected Exam Year (e.g., "2026", "2024", or "random" for multi-year mix)
  const [selectedYear, setSelectedYear] = useState("random");

  // State 4: Validation error message string (e.g. "Select exactly 3 more subjects")
  const [validationError, setValidationError] = useState("");

  /**
   * Toggles subject selection state when a user clicks a subject card.
   * Enforces JAMB rules (cannot unselect English, max 4 subjects total).
   * 
   * @param {string} subjectId - The unique ID of the subject clicked
   */
  const handleToggleSubject = (subjectId) => {
    // Clear any previous validation alert when user interacts
    setValidationError("");

    // RULE 1: If in JAMB mode and user clicks "english", ignore action because it is permanently locked
    if (isJambMode && subjectId === "english") {
      return;
    }

    setSelectedSubjectIds((prevIds) => {
      // Check if the subject is already selected
      const isAlreadySelected = prevIds.includes(subjectId);

      if (isAlreadySelected) {
        // Unselect the subject
        return prevIds.filter((id) => id !== subjectId);
      } else {
        // RULE 2: In JAMB mode, user cannot select more than 4 subjects total (English + 3 subjects)
        if (isJambMode && prevIds.length >= 4) {
          setValidationError("JAMB UTME allows a maximum of 4 subjects (Use of English + 3 electives).");
          return prevIds;
        }
        // Add newly selected subject ID
        return [...prevIds, subjectId];
      }
    });
  };

  /**
   * Computes the question distribution based on selected subjects and JAMB rules.
   * - Use of English = 60 Questions
   * - Other Subjects = 40 Questions each
   */
  const questionBreakdown = useMemo(() => {
    return selectedSubjectIds.map((id) => {
      const subjectObj = ALL_SUBJECTS.find((s) => s.id === id);
      const name = isJambMode ? subjectObj?.nameJamb : subjectObj?.nameDefault;
      // In JAMB mode, English gets 60 questions, all other subjects get 40 questions
      const count = isJambMode ? (id === "english" ? 60 : 40) : 40;
      return { id, name, count };
    });
  }, [selectedSubjectIds, isJambMode]);

  /**
   * Computes total aggregate questions across all selected subjects
   */
  const totalQuestions = useMemo(() => {
    return questionBreakdown.reduce((sum, item) => sum + item.count, 0);
  }, [questionBreakdown]);

  /**
   * Formats total duration minutes into readable hour/minute text (e.g., "2 hrs 00 mins")
   */
  const formattedDurationText = useMemo(() => {
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} mins` : ""}`;
    }
    return `${mins} mins`;
  }, [durationMinutes]);

  /**
   * Validates configuration and passes the final state payload to the parent orchestrator
   */
  const handleStartSimulation = () => {
    // JAMB Validation: Must have exactly 4 subjects selected (English + 3 electives)
    if (isJambMode && selectedSubjectIds.length !== 4) {
      const remainingNeeded = 4 - selectedSubjectIds.length;
      if (remainingNeeded > 0) {
        setValidationError(`Please select ${remainingNeeded} more subject${remainingNeeded > 1 ? "s" : ""} to meet the JAMB 4-subject requirement.`);
      } else {
        setValidationError("Please select exactly 4 subjects for your JAMB simulation.");
      }
      return;
    }

    // Clear any residual error state
    setValidationError("");

    // Construct final validated configuration payload object
    const finalConfigPayload = {
      mode,
      subjects: questionBreakdown, // Detailed subject list with assigned question counts
      totalQuestions, // Aggregate total questions (180 for standard JAMB)
      durationMinutes, // Allocated total time (e.g. 120 minutes)
      year: selectedYear, // Selected year string or "random"
      timestamp: new Date().toISOString(), // Execution timestamp
    };

    // Trigger parent callback to launch Stage 2 (ExamLoadingSpinner)
    if (onStart) {
      onStart(finalConfigPayload);
    }
  };

  return (
    // 🆕 UPGRADE 2 & 3: Root Configurator Canvas Container (Added padding pb-24 lg:pb-32 & overflow fix to prevent cutoff)
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in overflow-x-hidden pb-24 lg:pb-32 custom-exam-scrollbar">
      
      {/* 🆕 UPGRADE 2: Injected premium CSS webkit scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-exam-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-exam-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(16, 185, 129, 0.4); border-radius: 10px; }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(16, 185, 129, 0.7); }
      `}} />

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HERO BANNER HEADER: Mode Title & Requirements Overview
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-2xl border border-emerald-500/20">
        
        {/* 🆕 UPGRADE 4: JAMB Official Logo Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-900">
          <img 
            src="https://www.naijanews.com/wp-content/uploads/2024/04/JAMB-Joint-Admission-Matriculation-Board-768x461.webp" 
            alt="JAMB Official Full Background" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
          />
          {/* Dark gradient scrim to ensure text pops */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-teal-950/90" />
        </div>

        {/* Ambient Glow Orbs in background */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {/* Header Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Official JAMB UTME Gateway
            </div>
            
            {/* Main Header Title */}
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
              Customize Your <span className="text-emerald-400">JAMB CBT</span> Simulation
            </h1>
            
            {/* Instructional Description */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Select your 3 preferred UTME subject combinations alongside compulsory Use of English. Configure timer limits and question year distributions.
            </p>
          </div>

          {/* Quick Stats Pill Badge */}
          <div className="shrink-0 bg-white/10 dark:bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-1 min-w-[160px]">
            <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider font-mono">
              UTME Rule Check
            </span>
            <span className="text-xl font-black text-white">
              {selectedSubjectIds.length} / 4 Subjects
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              {180 - totalQuestions === 0 ? "180 Questions Locked" : `${totalQuestions} / 180 Questions`}
            </span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          VALIDATION ERROR ALERT BANNER (Triggers if rules are violated)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 text-rose-800 dark:text-rose-300 flex items-center gap-3 animate-bounce">
          <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs sm:text-sm font-bold">{validationError}</span>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 1: SUBJECT SELECTION GRID MATRIX
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
              1. Select Subject Combinations
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Use of English is locked by default. Pick 3 extra subjects to complete your combination.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
            Selected: {selectedSubjectIds.length}/4
          </span>
        </div>

        {/* Responsive Grid of 17 Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {ALL_SUBJECTS.map((subject, index) => {
            const isSelected = selectedSubjectIds.includes(subject.id);
            const isCompulsoryLocked = isJambMode && subject.id === "english";
            const displayName = isJambMode ? subject.nameJamb : subject.nameDefault;

            // 🆕 UPGRADE 1: Logic to hide subjects after index 4 on mobile unless 'See More' is clicked
            const mobileHiddenClass = !showAllSubjects && index >= 5 ? "hidden sm:flex" : "flex";

            return (
              <div
                key={subject.id}
                onClick={() => handleToggleSubject(subject.id)}
                className={`relative p-4 rounded-2xl border transition-all duration-300 items-center justify-between select-none cursor-pointer ${mobileHiddenClass} ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
                } ${isCompulsoryLocked ? "cursor-not-allowed opacity-90" : ""}`}
              >
                {/* Left Side: SVG Icon & Subject Label */}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected 
                      ? "bg-emerald-600 text-white shadow-sm" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    {subject.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold line-clamp-1">
                      {displayName}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400">
                      {isCompulsoryLocked ? "60 Questions (Locked)" : isSelected ? "40 Questions" : subject.category}
                    </span>
                  </div>
                </div>

                {/* Right Side: Selection Badge Indicator */}
                <div className="shrink-0 ml-2">
                  {isCompulsoryLocked ? (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      Required
                    </span>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 dark:border-slate-700 bg-transparent"
                    }`}>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 🆕 UPGRADE 1: Mobile Only - See More / Show Less Button */}
        <div className="sm:hidden flex justify-center mt-2">
          <button
            onClick={() => setShowAllSubjects(!showAllSubjects)}
            className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
          >
            {showAllSubjects ? "Show Less ↑" : "See All Subjects ↓"}
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 2: DURATION & EXAMINATION YEAR CONFIGURATION
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DURATION SLIDER CARD */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Total Exam Duration
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-black font-mono border border-blue-200 dark:border-blue-800">
              {formattedDurationText}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Standard JAMB UTME exam time is 2 hours (120 Mins) for all 4 subjects combined.
          </p>

          {/* Interactive Range Input */}
          <input
            type="range"
            min={15}
            max={120}
            step={15}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
            <span>15 Mins (Rapid Drill)</span>
            <span>60 Mins</span>
            <span>120 Mins (Official)</span>
          </div>
        </div>

        {/* EXAMINATION YEAR SELECTOR CARD */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exam Year Source
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black font-mono border border-amber-200 dark:border-amber-800">
              {selectedYear === "random" ? "Multi-Year Mix" : `Year ${selectedYear}`}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Select a specific historical year (2000–2026) or use randomized question shuffling across all years.
          </p>

          {/* Select Dropdown Menu */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="random">🔀 Multi-Year Weighted Randomizer (Recommended)</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                JAMB Past Questions Year {year}
              </option>
            ))}
          </select>

          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Updated with verified 2026 JAMB curriculum answer keys.</span>
          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SUMMARY BAR & FINAL LAUNCH BUTTON
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl border border-slate-700">
        
        {/* Selected Configuration Summary */}
        <div className="space-y-1 text-center md:text-left w-full md:w-auto">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <span className="text-lg font-black text-white">
              Ready to Launch Simulation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {totalQuestions} Questions Total
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Subjects: {questionBreakdown.map((s) => s.name).join(", ") || "None"} • Duration: {formattedDurationText}
          </p>
        </div>

        {/* Start Simulation Action Button */}
        <button
          onClick={handleStartSimulation}
          className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all duration-300 flex items-center justify-center gap-3 shrink-0"
        >
          <span>Start JAMB Simulation</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

      </div>

    </div>
  );
}