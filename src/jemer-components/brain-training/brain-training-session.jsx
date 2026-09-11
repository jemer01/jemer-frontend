// src/jemer-components/brain-training/brain-training-session.jsx
"use client";
/**
 * [NEW UPGRADE]
 * SUMMARY: v3.1 Mobile UX Optimization & Dynamic Header Navigation.
 * 1. Dynamic Header Toggle: Replaced the static "Candidate" header with an interactive button showing the active sub-topic. Clicking it reveals a sleek dropdown list to navigate between modules, specifically optimized for mobile users.
 * 2. Terminology Fix: Replaced all instances of "Prompt" and "End Session" with "Question" and "Submit Exam" to match the formal educational flow.
 * 3. Mobile Layout Polish: Relaxed deep margins/paddings on the root containers and cards (`px-2`, `p-4 sm:p-6 lg:p-8`) to prevent cramping and give questions edge-to-edge breathing room on small screens.
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING CBT SESSION (v3.1)
 * ================================================================================================
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

export default function BrainTrainingSession({ config, onExit, onLeave }) {
  
  const questionsRepo = useMemo(() => {
    const repo = {};
    const questions = config?.questions || [];
    
    questions.forEach(q => {
      const topicKey = q.sub_topic || "General";
      if (!repo[topicKey]) repo[topicKey] = [];
      
      const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const optionsArr = Object.entries(parsedOptions || {}).map(([key, val]) => ({
        letter: key, 
        text: val
      }));
      
      repo[topicKey].push({
        id: q.id,
        number: repo[topicKey].length + 1,
        questionText: q.question_text,
        options: optionsArr,
        correctAnswer: q.correct_answer,
        explanation: q.explanation
      });
    });
    return repo;
  }, [config]);

  const activeSubjects = useMemo(() => {
    const subjects = Object.keys(questionsRepo).map(sub => ({
      id: sub, 
      name: sub, 
      count: questionsRepo[sub].length
    }));
    return subjects.length > 0 ? subjects : [{ id: "cognitive_matrix", name: "Neural Matrix", count: 0 }];
  }, [questionsRepo]);

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(activeSubjects[0]?.id || "cognitive_matrix");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(() => (config?.durationMinutes || 45) * 60);
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(null);
  const [isSubTopicMenuOpen, setIsSubTopicMenuOpen] = useState(false); // 🚀 NEW: State for header dropdown

  const currentSubjectQuestions = questionsRepo[activeSubjectId] || [];
  const currentQuestion = currentSubjectQuestions[activeQuestionIndex];
  const currentQuestionKey = currentQuestion ? currentQuestion.id : null;

  const DRAFT_KEY = `jemer_brain_draft_${config?.id}`;

  useEffect(() => {
    if (!config?.id) return;
    const draftStr = localStorage.getItem(DRAFT_KEY);
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        setUserAnswers(draft.userAnswers || {});
        setFlaggedQuestions(draft.flaggedQuestions || []);
        if (draft.activeSubjectId) setActiveSubjectId(draft.activeSubjectId);
        if (draft.activeQuestionIndex !== undefined) setActiveQuestionIndex(draft.activeQuestionIndex);
        if (draft.remainingSeconds !== undefined && draft.remainingSeconds > 0) {
          setRemainingSeconds(draft.remainingSeconds);
        }
      } catch (e) {
        console.warn("Failed to parse CBT draft", e);
      }
    }
    setIsHydrated(true);
  }, [config?.id]);

  useEffect(() => {
    if (!isHydrated || !config?.id) return;
    const draft = { userAnswers, flaggedQuestions, activeSubjectId, activeQuestionIndex, remainingSeconds };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [isHydrated, userAnswers, flaggedQuestions, activeSubjectId, activeQuestionIndex, remainingSeconds, config?.id]);

  const handleFinalSubmit = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    if (onExit) onExit({ userAnswers, remainingSeconds, questionsRepo });
  }, [onExit, userAnswers, remainingSeconds, questionsRepo, config?.id]);

  useEffect(() => {
    if (!isHydrated || remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAutoSubmitCountdown(10);
          setShowSubmitModal(false); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds, isHydrated]);

  useEffect(() => {
    if (autoSubmitCountdown === null) return;
    if (autoSubmitCountdown <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => setAutoSubmitCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [autoSubmitCountdown, handleFinalSubmit]);

  const formattedTimeLeft = useMemo(() => {
    const hrs = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;
    const pad = (num) => String(num).padStart(2, "0");
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    return `${pad(mins)}:${pad(secs)}`;
  }, [remainingSeconds]);

  const handleAddTime = () => {
    setRemainingSeconds((config?.durationMinutes || 45) * 60);
    setAutoSubmitCountdown(null);
  };

  const handleSelectOption = (optionLetter) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({ ...prev, [currentQuestionKey]: optionLetter }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) =>
      prev.includes(currentQuestionKey) ? prev.filter((id) => id !== currentQuestionKey) : [...prev, currentQuestionKey]
    );
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) setActiveQuestionIndex((prev) => prev - 1);
  };

  const currentSubjectIndex = activeSubjects.findIndex(s => s.id === activeSubjectId);
  const isLastQuestionInSubject = activeQuestionIndex === currentSubjectQuestions.length - 1;
  const isLastSubject = currentSubjectIndex === activeSubjects.length - 1;

  const handleNextQuestion = () => {
    if (!isLastQuestionInSubject) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else if (!isLastSubject) {
      setActiveSubjectId(activeSubjects[currentSubjectIndex + 1].id);
      setActiveQuestionIndex(0);
    } else {
      setShowSubmitModal(true);
    }
  };

  const totalQuestionsAllSubjects = useMemo(() => activeSubjects.reduce((sum, s) => sum + (s.count || 0), 0), [activeSubjects]);
  const totalAnsweredCount = useMemo(() => Object.keys(userAnswers).length, [userAnswers]);

  let nextBtnText = "Next →";
  if (isLastQuestionInSubject) {
    nextBtnText = isLastSubject ? "Review & Submit" : "Next Module →";
  }

  if (!isHydrated) return null;

  // Derive current subject name for the header toggle
  const currentSubjectName = activeSubjects.find(s => s.id === activeSubjectId)?.name || "Training Session";

  return (
    // 🚀 NEW: Mobile-first responsive wrapper allowing edge-to-edge rendering
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fade-in pb-8 lg:pb-12 px-2 sm:px-4 lg:px-6">
      
      <style dangerouslySetInnerHTML={{__html: `
        .markdown-inline-fix p { display: inline; margin: 0; }
        .markdown-inline-fix pre { margin: 0.5rem 0; overflow-x: auto; }
      `}} />

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="sticky top-2 sm:top-4 z-30 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0 bg-rose-600">
            JM
          </div>
          
          {/* 🚀 NEW: Interactive Dropdown Header for Sub-Topics */}
          <div className="flex flex-col relative w-full sm:w-auto">
            <button 
              onClick={() => setIsSubTopicMenuOpen(!isSubTopicMenuOpen)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-rose-600 transition-colors focus:outline-none text-left"
            >
              <span className="truncate max-w-[200px] sm:max-w-xs">{currentSubjectName}</span>
              <svg className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${isSubTopicMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Mode: Elite Examination</span>
            
            {/* Header Dropdown Menu */}
            {isSubTopicMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSubTopicMenuOpen(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col py-1 animate-fade-in">
                  {activeSubjects.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveSubjectId(sub.id);
                        setActiveQuestionIndex(0);
                        setIsSubTopicMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left text-xs font-bold transition-colors flex items-center justify-between ${
                        activeSubjectId === sub.id 
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="line-clamp-2">{sub.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 ml-2 shrink-0">{sub.count} Qs</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 font-mono font-black text-sm sm:text-base lg:text-lg border shadow-inner shrink-0 ${autoSubmitCountdown !== null ? "border-rose-500 text-rose-500 animate-pulse" : "border-slate-800 text-rose-400"}`}>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formattedTimeLeft}</span>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setShowExitModal(true)} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl shadow-sm transition-all duration-200 active:scale-95 shrink-0 focus:outline-none hidden sm:block">
              Save & Exit
            </button>
            {/* 🚀 Changed "End Session" to "Submit Exam" */}
            <button onClick={() => setShowSubmitModal(true)} className="px-4 sm:px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 active:scale-95 shrink-0 focus:outline-none">
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          MAIN CONTENT SPLIT PANEL
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* LEFT/CENTER AREA */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {currentQuestion ? (
            // 🚀 Relaxed paddings for better mobile flow
            <div className="p-4 sm:p-6 lg:p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 sm:space-y-6 shadow-sm relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
                <span className="text-[11px] sm:text-xs font-mono font-black uppercase text-rose-600 dark:text-rose-400">
                  Question {activeQuestionIndex + 1} of {currentSubjectQuestions.length}
                </span>
                <button onClick={handleToggleFlag} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border focus:outline-none ${
                  flaggedQuestions.includes(currentQuestionKey) ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent hover:text-slate-700"
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span>{flaggedQuestions.includes(currentQuestionKey) ? "Flagged" : "Flag"}</span>
                </button>
              </div>
              
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                <MarkdownRenderer text={currentQuestion.questionText} />
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = userAnswers[currentQuestionKey] === option.letter;
                  const selectedOptionClass = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20";
                  const unselectedOptionClass = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700";
                  const selectedLetterClass = "bg-rose-600 text-white";
                  const unselectedLetterClass = "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300";
                  
                  return (
                    <div key={option.letter} onClick={() => handleSelectOption(option.letter)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 cursor-pointer select-none ${isSelected ? selectedOptionClass : unselectedOptionClass}`}
                    >
                      <div className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 transition-colors ${isSelected ? selectedLetterClass : unselectedLetterClass}`}>
                        {option.letter}
                      </div>
                      <div className="text-xs sm:text-sm font-medium pt-1 markdown-inline-fix w-full overflow-hidden">
                        <MarkdownRenderer text={option.text} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handlePrevQuestion} disabled={activeQuestionIndex === 0} className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none">
                  ← Previous
                </button>
                <button onClick={handleNextQuestion} className="px-4 sm:px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-colors shadow-sm bg-rose-600 hover:bg-rose-500 focus:outline-none">
                  {nextBtnText}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No questions available.</div>
          )}
        </div>

        {/* RIGHT AREA - THE SUBJECT PALETTE */}
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 hidden lg:flex">
              <select 
                className="text-sm font-bold text-slate-900 dark:text-white bg-transparent outline-none max-w-[75%] truncate appearance-none cursor-pointer"
                value={activeSubjectId}
                onChange={(e) => {
                  setActiveSubjectId(e.target.value);
                  setActiveQuestionIndex(0);
                }}
              >
                {activeSubjects.map(sub => (
                  <option key={sub.id} value={sub.id} className="text-slate-900">{sub.name}</option>
                ))}
              </select>
              <span className="text-[10px] font-mono font-bold text-slate-500">{currentSubjectQuestions.length} Items</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span>Answered</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span>Flagged</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /><span>Unanswered</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full ring-2 bg-transparent ring-rose-500" /><span>Active</span></div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 brain-premium-scroll">
              {currentSubjectQuestions.map((q, idx) => {
                const key = q.id;
                const isAnswered = !!userAnswers[key];
                const isFlagged = flaggedQuestions.includes(key);
                const isCurrent = idx === activeQuestionIndex;
                
                let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";
                if (isAnswered) badgeStyle = "bg-rose-600 text-white font-bold";
                if (isFlagged) badgeStyle = "bg-amber-500 text-white font-bold";
                
                const activeRingStyle = isCurrent ? "ring-2 ring-offset-2 ring-rose-500 dark:ring-offset-slate-900" : "";
                return (
                  <button key={key} onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-mono transition-all flex items-center justify-center focus:outline-none cursor-pointer ${badgeStyle} ${activeRingStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>Total Answered:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {totalAnsweredCount} / {totalQuestionsAllSubjects}
                </span>
              </div>
            </div>
            
            <div className="pt-2 sm:hidden block">
               <button onClick={() => setShowExitModal(true)} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 focus:outline-none">
                  Save Progress & Exit
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE & EXIT MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save Progress & Exit?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your answers and exact timer have been securely saved locally. You can resume this session anytime from your Cognitive Archives.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowExitModal(false)} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none">
                Cancel
              </button>
              <button onClick={() => { setShowExitModal(false); if(onLeave) onLeave(); }} className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors focus:outline-none">
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Exam Session?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You have answered <span className="font-bold text-slate-900 dark:text-white">{totalAnsweredCount}</span> out of <span className="font-bold text-slate-900 dark:text-white">{totalQuestionsAllSubjects}</span> questions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSubmitModal(false)} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none">
                Return
              </button>
              <button onClick={() => { setShowSubmitModal(false); handleFinalSubmit(); }} className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors focus:outline-none">
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTO-SUBMIT TIMER EXPIRED MODAL */}
      {autoSubmitCountdown !== null && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto animate-pulse">
              <span className="text-2xl font-black font-mono">{autoSubmitCountdown}</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Time's Up!</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Session duration expired. Auto-submitting in <span className="font-bold text-rose-500">{autoSubmitCountdown}s</span>.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button onClick={handleAddTime} className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider transition-colors focus:outline-none">
                Add Time & Continue
              </button>
              <button onClick={() => { setAutoSubmitCountdown(null); handleFinalSubmit(); }} className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-md transition-colors focus:outline-none">
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}