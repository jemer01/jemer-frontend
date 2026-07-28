// src/jemer-components/brain-training/brain-training-session.jsx
"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - BRAIN TRAINING CBT SESSION)
 * ================================================================================================
 * 1. DEDICATED BRAIN TRAINING ENGINE: Modeled structurally after `exam-sessions.jsx` but completely 
 *    isolated and styled for the global Brain Training ecosystem (Rose/Crimson theme).
 * 2. ACTIVE LEARNING TRIGGER (CORE FEATURE): Identical to the Study Room, this session is meant for 
 *    learning. Clicking an incorrect answer triggers a sleek Rose-tinted "AI Explanation Available" 
 *    banner at the bottom of the card without interrupting the flow.
 * 3. AI EXPLANATION MODAL: Integrated `<AiExplanations />` via React Portal. Clicking the banner 
 *    opens a detailed, markdown-rendered explanation of why the user's choice was wrong.
 * 4. PURE NATIVE SVGS: Eradicated FontAwesome classes for 100% reliable rendering.
 * ================================================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import AiExplanations from "@/jemer-components/ui/ai-explanations";

function generateDummyQuestions(subjects) {
  const result = {};
  subjects?.forEach((subject) => {
    const questionsList = [];
    const totalCount = subject.count || 30;

    for (let i = 1; i <= totalCount; i++) {
      questionsList.push({
        id: `${subject.id}-${i}`,
        number: i,
        passage: null, // Scrapped passage for rapid brain training
        questionText: `Neural Prompt ${i} for ${subject.name}: Analyze the following theoretical framework and select the absolute correct derivative.`,
        options: [
          { letter: "A", text: "The variable remains constant across all dimensions." },
          { letter: "B", text: "It scales logarithmically based on the initial input." },
          { letter: "C", text: "It decays inversely to the square of the distance." },
          { letter: "D", text: "It establishes a baseline equilibrium immediately." },
        ],
        correctAnswer: "A", 
      });
    }
    result[subject.id] = questionsList;
  });
  return result;
}

export default function BrainTrainingSession({ config, onExit }) {
  // Lock to single subject for Brain Training
  const activeSubjects = useMemo(() => {
    if (config?.subjects && config.subjects.length > 0) return config.subjects;
    return [{ id: "cognitive_matrix", name: "Neural Matrix", count: 30 }];
  }, [config]);

  const [activeSubjectId, setActiveSubjectId] = useState(activeSubjects[0]?.id || "cognitive_matrix");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  
  // Active Learning Modal State
  const [showAiExplanationModal, setShowAiExplanationModal] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const totalMins = config?.durationMinutes || 45;
    return totalMins * 60;
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(null);

  const questionsRepo = useMemo(() => {
    return generateDummyQuestions(activeSubjects);
  }, [activeSubjects]);

  const currentSubjectQuestions = questionsRepo[activeSubjectId] || [];
  const currentQuestion = currentSubjectQuestions[activeQuestionIndex];
  const currentQuestionKey = currentQuestion ? `${activeSubjectId}-${currentQuestion.id}` : null;

  const handleFinalSubmit = useCallback(() => {
    if (onExit) onExit({ userAnswers, remainingSeconds, questionsRepo });
  }, [onExit, userAnswers, remainingSeconds, questionsRepo]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
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
  }, [remainingSeconds]);

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

  const handleNextQuestion = () => {
    if (activeQuestionIndex < currentSubjectQuestions.length - 1) setActiveQuestionIndex((prev) => prev + 1);
  };

  const totalQuestionsAllSubjects = useMemo(() => activeSubjects.reduce((sum, s) => sum + (s.count || 30), 0), [activeSubjects]);
  const totalAnsweredCount = useMemo(() => Object.keys(userAnswers).length, [userAnswers]);

  // ACTIVE LEARNING CHECK: If the user selected an answer and it's wrong
  const isCurrentAnswerWrong = userAnswers[currentQuestionKey] && userAnswers[currentQuestionKey] !== currentQuestion?.correctAnswer;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-8 lg:pb-12 overflow-x-hidden">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="sticky top-4 z-30 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0 bg-rose-600">
            JM
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
              Candidate: Brain Training Session
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Mode: Active Learning</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 font-mono font-black text-base sm:text-lg border border-slate-800 shadow-inner shrink-0 text-rose-400">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formattedTimeLeft}</span>
          </div>

          <button onClick={() => setShowSubmitModal(true)} className="px-4 sm:px-5 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 active:scale-95 shrink-0 focus:outline-none">
            End Session
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          MAIN CONTENT SPLIT PANEL (Question Card & Palette)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT/CENTER AREA */}
        <div className="lg:col-span-2 space-y-6">
          {currentQuestion ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-mono font-black uppercase text-rose-600 dark:text-rose-400">
                  Prompt {activeQuestionIndex + 1} of {currentSubjectQuestions.length}
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

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.questionText}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = userAnswers[currentQuestionKey] === option.letter;

                  const selectedOptionClass = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20";
                  const unselectedOptionClass = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700";

                  const selectedLetterClass = "bg-rose-600 text-white";
                  const unselectedLetterClass = "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

                  return (
                    <div key={option.letter} onClick={() => handleSelectOption(option.letter)}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 cursor-pointer select-none ${isSelected ? selectedOptionClass : unselectedOptionClass}`}
                    >
                      <div className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 transition-colors ${isSelected ? selectedLetterClass : unselectedLetterClass}`}>
                        {option.letter}
                      </div>
                      <span className="text-xs sm:text-sm font-medium pt-1">
                        {option.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* ACTIVE LEARNING ERROR BANNER */}
              {isCurrentAnswerWrong && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-800">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-300">
                      Incorrect choice. <span className="font-medium text-rose-700 dark:text-rose-400">AI Explanation Available.</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAiExplanationModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>See Explanation</span>
                  </button>
                </div>
              )}

              {/* Pagination Action Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handlePrevQuestion} disabled={activeQuestionIndex === 0} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none">
                  ← Previous
                </button>

                <button onClick={handleNextQuestion} disabled={activeQuestionIndex === currentSubjectQuestions.length - 1} className="px-5 py-2.5 rounded-xl text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm bg-rose-600 hover:bg-rose-500 focus:outline-none">
                  Next →
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No questions available.</div>
          )}
        </div>

        {/* RIGHT AREA */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Neural Matrix</h4>
              <span className="text-[10px] font-mono font-bold text-slate-500">{currentSubjectQuestions.length} Items</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full ring-2 bg-transparent ring-rose-500" />
                <span>Active</span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 brain-premium-scroll">
              {currentSubjectQuestions.map((q, idx) => {
                const key = `${activeSubjectId}-${q.id}`;
                const isAnswered = !!userAnswers[key];
                const isFlagged = flaggedQuestions.includes(key);
                const isCurrent = idx === activeQuestionIndex;

                let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
                if (isAnswered) badgeStyle = "bg-rose-600 text-white font-bold";
                if (isFlagged) badgeStyle = "bg-amber-500 text-white font-bold";

                const activeRingStyle = isCurrent ? "ring-2 ring-offset-2 ring-rose-500 dark:ring-offset-slate-900" : "";

                return (
                  <button key={q.id} onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-mono transition-all flex items-center justify-center focus:outline-none ${badgeStyle} ${activeRingStyle}`}
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

          </div>
        </div>
      </div>

      {/* AI EXPLANATION MODAL (PORTAL TELEPORTED) */}
      <AiExplanations
        isOpen={showAiExplanationModal}
        onClose={() => setShowAiExplanationModal(false)}
        questionContext={{
          questionText: currentQuestion?.questionText,
          userAnswer: currentQuestion ? userAnswers[currentQuestionKey] : null,
          correctAnswer: currentQuestion?.correctAnswer
        }}
        explanationText={`**AI Tutor Insight:** You selected an incorrect distractor.\n\nThe correct principle here is governed by the universal laws of thermodynamics, specifically focusing on energy distribution.\n\n### The Formula Breakdown\n\nWhen a system changes state, the total displacement correlates structurally:\n\n$$ E = mc^2 $$\n\n| Variable | Meaning | Relation |\n|---|---|---|\n| **E** | Energy | Direct |\n| **m** | Mass | Proportional |\n\n> *Key Takeaway:* Always check the standard temperature parameters before assuming equilibrium!`}
      />

      {/* CONFIRMATION SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">End Training Session?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You have answered <span className="font-bold text-slate-900 dark:text-white">{totalAnsweredCount}</span> out of <span className="font-bold text-slate-900 dark:text-white">{totalQuestionsAllSubjects}</span> prompts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSubmitModal(false)} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none">
                Continue
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
            <button onClick={() => { setAutoSubmitCountdown(null); handleFinalSubmit(); }} className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors focus:outline-none">
              Submit Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}