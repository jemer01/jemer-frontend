"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.3 - EXAM PRACTICE DYNAMIC INTEGRATION)
 * ================================================================================================
 * 1. ORANGE THEMING: Complete UI shift to Orange (`orange-500`, `orange-600`) when `mode="practice"`.
 * 2. 1-SUBJECT LIMIT: In Practice mode, selecting a subject auto-replaces the previous one.
 * 3. CUSTOM QUESTION COUNT UI: Added a dynamic 3rd configuration card (visible only in Practice mode) 
 *    allowing users to select exactly 10, 20, 30, 40, 50, 60, 70, or 80 questions.
 * 4. SEAMLESS LAYOUT: Altered the grid to `md:grid-cols-3` in practice mode to accommodate the new 
 *    Question Count card without leaving awkward blank spaces.
 * 5. CONCISE COMMENTS: Cleaned up older verbose comments to optimize file size.
 * ================================================================================================
 */

import React, { useState, useMemo } from "react";

const ALL_SUBJECTS = [
  {
    id: "english",
    nameJamb: "Use of English", 
    nameDefault: "English Language", 
    category: "Compulsory", 
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
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const YEAR_OPTIONS = Array.from({ length: 2026 - 2000 + 1 }, (_, index) => (2026 - index).toString());
const QUESTION_COUNT_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80];

export default function ExamCustomization({ mode = "jamb", onStart }) {
  const isJambMode = mode === "jamb";
  const isWaecMode = mode === "waec";
  const isPracticeMode = mode === "practice";

  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const [selectedSubjectIds, setSelectedSubjectIds] = useState(() => {
    if (isJambMode) return ["english"]; 
    return []; // WAEC and Practice start empty
  });

  const [durationMinutes, setDurationMinutes] = useState(120);
  const [selectedYear, setSelectedYear] = useState("random");
  
  // New Practice Mode state for specific question count
  const [practiceQuestionCount, setPracticeQuestionCount] = useState(40);
  const [validationError, setValidationError] = useState("");

  const handleToggleSubject = (subjectId) => {
    setValidationError("");

    if (isJambMode && subjectId === "english") return; // English locked in JAMB

    // In Practice Mode, selecting a subject simply replaces the previous selection (Max 1)
    if (isPracticeMode) {
      setSelectedSubjectIds([subjectId]);
      return;
    }

    setSelectedSubjectIds((prevIds) => {
      const isAlreadySelected = prevIds.includes(subjectId);
      if (isAlreadySelected) {
        return prevIds.filter((id) => id !== subjectId);
      } else {
        if (isJambMode && prevIds.length >= 4) {
          setValidationError("JAMB UTME allows a maximum of 4 subjects (Use of English + 3 electives).");
          return prevIds;
        }
        if (isWaecMode && prevIds.length >= 9) {
          setValidationError("WAEC WASSCE allows a maximum of 9 subjects.");
          return prevIds;
        }
        return [...prevIds, subjectId];
      }
    });
  };

  const questionBreakdown = useMemo(() => {
    return selectedSubjectIds.map((id) => {
      const subjectObj = ALL_SUBJECTS.find((s) => s.id === id);
      
      let name = subjectObj?.nameDefault;
      if (isJambMode) name = subjectObj?.nameJamb;
      if (isWaecMode && id === "english") name = "English"; 

      let count = 40; 
      if (isJambMode) count = id === "english" ? 60 : 40;
      else if (isWaecMode) count = id === "english" ? 80 : 50;
      else if (isPracticeMode) count = practiceQuestionCount;
      
      return { id, name, count };
    });
  }, [selectedSubjectIds, isJambMode, isWaecMode, isPracticeMode, practiceQuestionCount]);

  const totalQuestions = useMemo(() => {
    return questionBreakdown.reduce((sum, item) => sum + item.count, 0);
  }, [questionBreakdown]);

  const formattedDurationText = useMemo(() => {
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    let timeStr = "";

    if (hours > 0) {
      timeStr = `${hours} hr${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} mins` : ""}`;
    } else {
      timeStr = `${mins} mins`;
    }

    return isWaecMode ? `${timeStr} / subject` : timeStr;
  }, [durationMinutes, isWaecMode]);

  const handleStartSimulation = () => {
    if (isJambMode && selectedSubjectIds.length !== 4) {
      setValidationError("Please select exactly 4 subjects for your JAMB simulation.");
      return;
    }
    if (isWaecMode && selectedSubjectIds.length === 0) {
      setValidationError("Please select at least 1 subject to begin your WAEC simulation.");
      return;
    }
    if (isPracticeMode && selectedSubjectIds.length === 0) {
      setValidationError("Please select 1 subject to begin your Practice simulation.");
      return;
    }

    setValidationError("");

    const finalConfigPayload = {
      mode,
      subjects: questionBreakdown,
      totalQuestions,
      durationMinutes,
      year: selectedYear,
      timestamp: new Date().toISOString(),
    };

    if (onStart) onStart(finalConfigPayload);
  };

  // Theme variable generator
  const getThemeVars = () => {
    if (isPracticeMode) return {
      primary: "orange", bgImage: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=1000",
      title: "Exam Practice", badgeText: "Practice Mode Enabled",
      ringColor: "ring-orange-500/20", borderColor: "border-orange-500", bgColor: "bg-orange-50",
      textColor: "text-orange-900", iconBg: "bg-orange-600", activeTick: "bg-orange-600 border-orange-600"
    };
    if (isWaecMode) return {
      primary: "blue", bgImage: "https://upload.wikimedia.org/wikipedia/en/2/2a/Waec_logo.png",
      title: "WAEC WASSCE", badgeText: "Official WAEC WASSCE Gateway",
      ringColor: "ring-blue-500/20", borderColor: "border-blue-500", bgColor: "bg-blue-50",
      textColor: "text-blue-900", iconBg: "bg-blue-600", activeTick: "bg-blue-600 border-blue-600"
    };
    return {
      primary: "emerald", bgImage: "https://www.naijanews.com/wp-content/uploads/2024/04/JAMB-Joint-Admission-Matriculation-Board-768x461.webp",
      title: "JAMB CBT", badgeText: "Official JAMB UTME Gateway",
      ringColor: "ring-emerald-500/20", borderColor: "border-emerald-500", bgColor: "bg-emerald-50",
      textColor: "text-emerald-900", iconBg: "bg-emerald-600", activeTick: "bg-emerald-600 border-emerald-600"
    };
  };

  const theme = getThemeVars();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in overflow-x-hidden pb-24 lg:pb-32 custom-exam-scrollbar">
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-exam-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-exam-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isPracticeMode ? 'rgba(249, 115, 22, 0.4)' : isWaecMode ? 'rgba(37, 99, 235, 0.4)' : 'rgba(16, 185, 129, 0.4)'}; 
          border-radius: 10px; 
        }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb:hover { 
          background-color: ${isPracticeMode ? 'rgba(249, 115, 22, 0.7)' : isWaecMode ? 'rgba(37, 99, 235, 0.7)' : 'rgba(16, 185, 129, 0.7)'}; 
        }
      `}} />

      {/* HERO BANNER HEADER */}
      <div className={`relative rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-2xl border border-${theme.primary}-500/20`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-900">
          <img src={theme.bgImage} alt={`${theme.title} Background`} className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"/>
          <div className={`absolute inset-0 bg-gradient-to-r ${isPracticeMode ? "from-orange-950/90 via-slate-900/90 to-amber-950/90" : isWaecMode ? "from-blue-950/90 via-slate-900/90 to-indigo-950/90" : "from-emerald-950/90 via-slate-900/90 to-teal-950/90"}`} />
        </div>

        <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none z-0 bg-${theme.primary}-500/15`} />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono border backdrop-blur-sm bg-${theme.primary}-500/20 text-${theme.primary}-300 border-${theme.primary}-500/30`}>
              <span className={`w-2 h-2 rounded-full animate-pulse bg-${theme.primary}-400`} />
              {theme.badgeText}
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
              Customize Your <span className={`text-${theme.primary}-400`}>{theme.title}</span> Simulation
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {isPracticeMode ? "Select any single subject to practice. Customize the exact number of questions, timeframe, and specific past question year." :
               isWaecMode ? "Select up to 9 WAEC subject combinations. Configure timer limits per subject and question year distributions." :
               "Select your 3 preferred UTME subject combinations alongside compulsory Use of English. Configure timer limits and question year distributions."}
            </p>
          </div>

          <div className="shrink-0 bg-white/10 dark:bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-1 min-w-[160px]">
            <span className={`text-[10px] font-black uppercase tracking-wider font-mono text-${theme.primary}-300`}>
              {isPracticeMode ? "Practice Rule Check" : isWaecMode ? "WASSCE Rule Check" : "UTME Rule Check"}
            </span>
            <span className="text-xl font-black text-white">
              {selectedSubjectIds.length} / {isPracticeMode ? "1" : isWaecMode ? "9" : "4"} Subject{isPracticeMode ? "" : "s"}
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              {isJambMode && (180 - totalQuestions === 0) ? "180 Questions Locked" : `${totalQuestions} Questions Added`}
            </span>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 text-rose-800 dark:text-rose-300 flex items-center gap-3 animate-bounce">
          <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs sm:text-sm font-bold">{validationError}</span>
        </div>
      )}

      {/* SECTION 1: SUBJECT SELECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
              1. Select Subject Combinations
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {isPracticeMode ? "Select exactly 1 subject to focus your practice session on." :
               isWaecMode ? "Select any combination of up to 9 subjects for your WASSCE simulation." :
               "Use of English is locked by default. Pick 3 extra subjects to complete your combination."}
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
            Selected: {selectedSubjectIds.length}/{isPracticeMode ? "1" : isWaecMode ? "9" : "4"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {ALL_SUBJECTS.map((subject, index) => {
            const isSelected = selectedSubjectIds.includes(subject.id);
            const isCompulsoryLocked = isJambMode && subject.id === "english";
            
            let displayName = subject.nameDefault;
            if (isJambMode) displayName = subject.nameJamb;
            if (isWaecMode && subject.id === "english") displayName = "English";

            let displayCountText = "40 Questions";
            if (isJambMode) displayCountText = subject.id === "english" ? "60 Questions" : "40 Questions";
            if (isWaecMode) displayCountText = subject.id === "english" ? "80 Questions" : "50 Questions";
            if (isPracticeMode) displayCountText = `${practiceQuestionCount} Questions`;

            const mobileHiddenClass = !showAllSubjects && index >= 5 ? "hidden sm:flex" : "flex";

            const activeCardClass = `${theme.bgColor} dark:bg-${theme.primary}-950/40 ${theme.borderColor} ${theme.textColor} dark:text-${theme.primary}-200 shadow-md ring-2 ${theme.ringColor}`;
            const inactiveCardClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm";

            return (
              <div key={subject.id} onClick={() => handleToggleSubject(subject.id)}
                className={`relative p-4 rounded-2xl border transition-all duration-300 items-center justify-between select-none cursor-pointer ${mobileHiddenClass} ${isSelected ? activeCardClass : inactiveCardClass} ${isCompulsoryLocked ? "cursor-not-allowed opacity-90" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isSelected ? `${theme.iconBg} text-white shadow-sm` : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                    {subject.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold line-clamp-1">{displayName}</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400">
                      {isCompulsoryLocked ? "60 Questions (Locked)" : isSelected ? displayCountText : subject.category}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isCompulsoryLocked ? (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">Required</span>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? `${theme.activeTick} text-white` : "border-slate-300 dark:border-slate-700 bg-transparent"}`}>
                      {isSelected && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="sm:hidden flex justify-center mt-2">
          <button onClick={() => setShowAllSubjects(!showAllSubjects)} className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all">
            {showAllSubjects ? "Show Less ↑" : "See All Subjects ↓"}
          </button>
        </div>
      </div>

      {/* SECTION 2: DURATION, YEAR & CUSTOM QUESTIONS */}
      <div className={`grid grid-cols-1 ${isPracticeMode ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
        
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Exam Duration</h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-xs font-black font-mono border border-indigo-200 dark:border-indigo-800">
              {formattedDurationText}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {isPracticeMode ? "Customize how long you want your practice drill to last." : isWaecMode ? "Standard WAEC duration varies per subject. Set time per subject here." : "Standard JAMB UTME exam time is 2 hours (120 Mins)."}
          </p>

          <input type="range" min={15} max={120} step={15} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className={`w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-${theme.primary}-600`}
          />
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
            <span>15 Mins</span><span>60 Mins</span><span>120 Mins</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Exam Year Source</h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black font-mono border border-amber-200 dark:border-amber-800">
              {selectedYear === "random" ? "Multi-Year Mix" : `Year ${selectedYear}`}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Select a historical year (2000–2026) or randomize questions across all years.
          </p>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
            className={`w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500`}
          >
            <option value="random">🔀 Multi-Year Weighted Randomizer</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>{theme.title} Past Questions {year}</option>
            ))}
          </select>
        </div>

        {/* Custom Practice Question Count Card (Only visible in Practice Mode) */}
        {isPracticeMode && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Question Count</h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 text-xs font-black font-mono border border-orange-200 dark:border-orange-800">
                {practiceQuestionCount} Qs
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Select the exact number of questions you want for this practice drill (10 up to 80).
            </p>

            <select value={practiceQuestionCount} onChange={(e) => setPracticeQuestionCount(Number(e.target.value))}
              className={`w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
            >
              {QUESTION_COUNT_OPTIONS.map((count) => (
                <option key={count} value={count}>{count} Questions Total</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* SUMMARY BAR & FINAL LAUNCH BUTTON */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl border border-slate-700">
        
        <div className="space-y-1 text-center md:text-left w-full md:w-auto">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <span className="text-lg font-black text-white">Ready to Launch Simulation</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono border bg-${theme.primary}-500/20 text-${theme.primary}-400 border-${theme.primary}-500/30`}>
              {totalQuestions} Questions Total
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Subjects: {questionBreakdown.map((s) => s.name).join(", ") || "None"} • Duration: {formattedDurationText}
          </p>
        </div>

        <button onClick={handleStartSimulation}
          className={`w-full md:w-auto px-8 py-4 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 shrink-0 active:scale-[0.98] bg-${theme.primary}-600 hover:bg-${theme.primary}-500 shadow-${theme.primary}-600/30`}
        >
          <span>Start {theme.title} Simulation</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

      </div>
    </div>
  );
}