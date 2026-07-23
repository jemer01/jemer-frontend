"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.5 - STUDY ROOM ACTIVE LEARNING INTEGRATION)
 * ================================================================================================
 * 1. EDTECH PURPLE THEME: Complete UI shift. Timers, active tabs, selected options, and matrix 
 *    badges switch to Purple (`purple-600`) when `mode="study"`.
 * 2. ACTIVE LEARNING TRIGGER: Added real-time answer validation. If a user selects an incorrect 
 *    option in Study mode, a smooth animated banner appears at the bottom of the question card 
 *    offering an AI Explanation. Correct answers proceed as normal without interruption.
 * 3. AI EXPLANATION MODAL: Imported and integrated `<AiExplanations />`. Clicking "See AI Explanation" 
 *    passes the exact question context (Question, User Choice, Correct Answer) into the new portal modal.
 * 4. CONCISE COMMENTS: Cleaned up older verbose comments to optimize token usage.
 * ================================================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import AiExplanations from "@/jemer-components/ui/ai-explanations"; // 🆕 Imported AI Modal

function generateDummyQuestions(subjects, isWaecMode, isPracticeMode, isStudyMode) {
  const result = {};
  subjects?.forEach((subject) => {
    const questionsList = [];
    const totalCount = subject.count || 40;

    for (let i = 1; i <= totalCount; i++) {
      questionsList.push({
        id: `${subject.id}-${i}`,
        number: i,
        passage:
          subject.id === "english" && i <= 5
            ? "Read the passage carefully and answer the question that follows: Technology has revolutionized modern education by giving students instant access to global knowledge bases..."
            : null,
        questionText: `Sample ${isStudyMode ? "Study" : isPracticeMode ? "Practice" : isWaecMode ? "WASSCE" : "JAMB"} Question ${i} for ${subject.name}: Which of the following statements correctly describes the fundamental principles governing this topic?`,
        options: [
          { letter: "A", text: "It remains constant under standard temperature and pressure conditions." },
          { letter: "B", text: "It increases proportionally with an increase in external system velocity." },
          { letter: "C", text: "It decreases inversely with the square of the total displacement." },
          { letter: "D", text: "It forms a balanced equilibrium when no external force acts upon it." },
        ],
        correctAnswer: "A", 
      });
    }
    result[subject.id] = questionsList;
  });
  return result;
}

export default function ExamSessions({ mode = "jamb", config, onExit }) {
  const isWaecMode = mode === "waec";
  const isPracticeMode = mode === "practice";
  const isStudyMode = mode === "study";
  const isSingleSubjectMode = isPracticeMode || isStudyMode;

  const activeSubjects = useMemo(() => {
    if (config?.subjects && config.subjects.length > 0) return config.subjects;
    if (isSingleSubjectMode) return [{ id: "english", name: "English Language", count: 40 }];
    return [
      { id: "english", name: isWaecMode ? "English" : "Use of English", count: isWaecMode ? 80 : 60 },
      { id: "mathematics", name: "Mathematics", count: isWaecMode ? 50 : 40 },
      { id: "physics", name: "Physics", count: isWaecMode ? 50 : 40 },
      { id: "chemistry", name: "Chemistry", count: isWaecMode ? 50 : 40 },
    ];
  }, [config, isWaecMode, isSingleSubjectMode]);

  const [activeSubjectId, setActiveSubjectId] = useState(activeSubjects[0]?.id || "english");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  
  // 🆕 Active Learning Modal State
  const [showAiExplanationModal, setShowAiExplanationModal] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const totalMins = config?.durationMinutes || (isSingleSubjectMode || isWaecMode ? 60 : 120);
    return totalMins * 60;
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(null);

  const questionsRepo = useMemo(() => {
    return generateDummyQuestions(activeSubjects, isWaecMode, isPracticeMode, isStudyMode);
  }, [activeSubjects, isWaecMode, isPracticeMode, isStudyMode]);

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

  const totalQuestionsAllSubjects = useMemo(() => activeSubjects.reduce((sum, s) => sum + (s.count || 40), 0), [activeSubjects]);
  const totalAnsweredCount = useMemo(() => Object.keys(userAnswers).length, [userAnswers]);

  // 🆕 Active Learning Check
  const isCurrentAnswerWrong = isStudyMode && userAnswers[currentQuestionKey] && userAnswers[currentQuestionKey] !== currentQuestion?.correctAnswer;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-8 lg:pb-12 overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-exam-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-exam-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isStudyMode ? 'rgba(147, 51, 234, 0.4)' : isPracticeMode ? 'rgba(249, 115, 22, 0.4)' : isWaecMode ? 'rgba(37, 99, 235, 0.4)' : 'rgba(16, 185, 129, 0.4)'}; 
          border-radius: 10px; 
        }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb:hover { 
          background-color: ${isStudyMode ? 'rgba(147, 51, 234, 0.7)' : isPracticeMode ? 'rgba(249, 115, 22, 0.7)' : isWaecMode ? 'rgba(37, 99, 235, 0.7)' : 'rgba(16, 185, 129, 0.7)'}; 
        }
      `}} />

      {/* TOP NAVIGATION BAR */}
      <div className="sticky top-4 z-30 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`w-10 h-10 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0 ${
            isStudyMode ? "bg-purple-600" : isPracticeMode ? "bg-orange-600" : isWaecMode ? "bg-blue-600" : "bg-emerald-600"
          }`}>
            JM
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
              Candidate: John Jonathan ({isStudyMode ? "Study Session" : isPracticeMode ? "Practice Mock" : isWaecMode ? "WASSCE Mock" : "JAMB CBT"})
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Reg No: 202698547210</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 font-mono font-black text-base sm:text-lg border border-slate-800 shadow-inner shrink-0 ${
            isStudyMode ? "text-purple-400" : isPracticeMode ? "text-orange-400" : isWaecMode ? "text-blue-400" : "text-emerald-400"
          }`}>
            <svg className={`w-4 h-4 sm:w-5 sm:h-5 animate-pulse ${
              isStudyMode ? "text-purple-400" : isPracticeMode ? "text-orange-400" : isWaecMode ? "text-blue-400" : "text-emerald-400"
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formattedTimeLeft}</span>
          </div>

          <button onClick={() => setShowSubmitModal(true)} className="px-4 sm:px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 active:scale-95 shrink-0">
            Submit Exam
          </button>
        </div>
      </div>

      {/* SUBJECT TABS NAVIGATION BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-exam-scrollbar">
        {activeSubjects.map((subject) => {
          const isActive = subject.id === activeSubjectId;
          const subjectAnswered = Object.keys(userAnswers).filter((k) => k.startsWith(`${subject.id}-`)).length;

          const activeTabClass = isStudyMode 
            ? "bg-purple-600 text-white border-purple-600 shadow-md"
            : isPracticeMode 
              ? "bg-orange-600 text-white border-orange-600 shadow-md"
              : isWaecMode 
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-emerald-600 text-white border-emerald-600 shadow-md";
            
          const inactiveTabClass = "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800";

          return (
            <button key={subject.id} onClick={() => { setActiveSubjectId(subject.id); setActiveQuestionIndex(0); }}
              className={`px-4 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${isActive ? activeTabClass : inactiveTabClass}`}
            >
              <span>{subject.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {subjectAnswered}/{subject.count || 40}
              </span>
            </button>
          );
        })}
      </div>

      {/* MAIN EXAM CONTENT SPLIT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT/CENTER AREA */}
        <div className="lg:col-span-2 space-y-6">
          {currentQuestion ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className={`text-xs font-mono font-black uppercase ${
                  isStudyMode ? "text-purple-600 dark:text-purple-400" : isPracticeMode ? "text-orange-600 dark:text-orange-400" : isWaecMode ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"
                }`}>
                  Question {activeQuestionIndex + 1} of {currentSubjectQuestions.length}
                </span>

                <button onClick={handleToggleFlag} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  flaggedQuestions.includes(currentQuestionKey) ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent hover:text-slate-700"
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span>{flaggedQuestions.includes(currentQuestionKey) ? "Flagged" : "Flag"}</span>
                </button>
              </div>

              {currentQuestion.passage && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-48 overflow-y-auto custom-exam-scrollbar">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">Passage Instruction:</p>
                  {currentQuestion.passage}
                </div>
              )}

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.questionText}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = userAnswers[currentQuestionKey] === option.letter;

                  const selectedOptionClass = isStudyMode 
                    ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20"
                    : isPracticeMode 
                      ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500/20"
                      : isWaecMode
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20"
                        : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20";
                    
                  const unselectedOptionClass = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700";

                  const selectedLetterClass = isStudyMode ? "bg-purple-600 text-white" : isPracticeMode ? "bg-orange-600 text-white" : isWaecMode ? "bg-blue-600 text-white" : "bg-emerald-600 text-white";
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

              {/* 🆕 ACTIVE LEARNING ERROR BANNER (Only shows in Study Room if answer is wrong) */}
              {isCurrentAnswerWrong && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-purple-900 dark:text-purple-300">
                      Incorrect choice. <span className="font-medium text-purple-700 dark:text-purple-400">AI Explanation Available.</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAiExplanationModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>See AI Explanation</span>
                  </button>
                </div>
              )}

              {/* Pagination Action Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handlePrevQuestion} disabled={activeQuestionIndex === 0} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  ← Previous
                </button>

                <button onClick={handleNextQuestion} disabled={activeQuestionIndex === currentSubjectQuestions.length - 1} className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm ${
                  isStudyMode ? "bg-purple-600 hover:bg-purple-500" : isPracticeMode ? "bg-orange-600 hover:bg-orange-500" : isWaecMode ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600 hover:bg-emerald-500"
                }`}>
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
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Question Matrix</h4>
              <span className="text-[10px] font-mono font-bold text-slate-500">{currentSubjectQuestions.length} Items</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isStudyMode ? "bg-purple-500" : isPracticeMode ? "bg-orange-500" : isWaecMode ? "bg-blue-500" : "bg-emerald-500"}`} />
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
                <span className={`w-2.5 h-2.5 rounded-full ring-2 bg-transparent ${isStudyMode ? "ring-purple-500" : isPracticeMode ? "ring-orange-500" : isWaecMode ? "ring-blue-500" : "ring-emerald-500"}`} />
                <span>Active</span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 custom-exam-scrollbar">
              {currentSubjectQuestions.map((q, idx) => {
                const key = `${activeSubjectId}-${q.id}`;
                const isAnswered = !!userAnswers[key];
                const isFlagged = flaggedQuestions.includes(key);
                const isCurrent = idx === activeQuestionIndex;

                let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
                
                if (isAnswered) badgeStyle = isStudyMode ? "bg-purple-600 text-white font-bold" : isPracticeMode ? "bg-orange-600 text-white font-bold" : isWaecMode ? "bg-blue-600 text-white font-bold" : "bg-emerald-600 text-white font-bold";
                if (isFlagged) badgeStyle = "bg-amber-500 text-white font-bold";

                const activeRingStyle = isCurrent 
                  ? (isStudyMode ? "ring-2 ring-offset-2 ring-purple-500 dark:ring-offset-slate-900" : isPracticeMode ? "ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-slate-900" : isWaecMode ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900" : "ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-slate-900")
                  : "";

                return (
                  <button key={q.id} onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-mono transition-all flex items-center justify-center ${badgeStyle} ${activeRingStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>Total Answered {isSingleSubjectMode ? "" : "(All Subjects)"}:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {totalAnsweredCount} / {totalQuestionsAllSubjects}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 🆕 AI EXPLANATION MODAL (PORTAL TELEPORTED) */}
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Your {isStudyMode ? "Study Session" : isPracticeMode ? "Practice" : isWaecMode ? "WASSCE" : "JAMB"} Exam?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You have answered <span className="font-bold text-slate-900 dark:text-white">{totalAnsweredCount}</span> out of <span className="font-bold text-slate-900 dark:text-white">{totalQuestionsAllSubjects}</span> total questions. Are you sure you want to end this session?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowSubmitModal(false)} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Continue Exam
              </button>
              <button onClick={() => { setShowSubmitModal(false); handleFinalSubmit(); }} className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors">
                Yes, Submit Now
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
                Your exam duration has expired. Your session will be automatically submitted in <span className="font-bold text-rose-500">{autoSubmitCountdown} seconds</span>.
              </p>
            </div>

            <button onClick={() => { setAutoSubmitCountdown(null); handleFinalSubmit(); }} className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors">
              Submit Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}