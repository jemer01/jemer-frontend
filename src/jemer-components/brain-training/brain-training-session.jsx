"use client";

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING CBT SESSION (v4.6.0)
 * ================================================================================================
 * [NEW UPGRADE — v4.6.0]
 * SUMMARY: Graceful Draft Hydration for Retakes & Fresh Exams
 * 1. 200 OK DRAFT PARSING: Upgraded the draft hydration `useEffect` to expect the new `{ has_draft: boolean, draft: object }` payload structure from the backend.
 * 2. CLEAN SLATE RETAKES: If the backend reports `has_draft: false`, the UI gracefully skips hydration. This leaves the component in its default state (empty answers, full countdown clock), allowing the student to start fresh. Because it's a normal active session, "Save & Exit" functions perfectly to pause a retake!
 * ================================================================================================
 * [PREVIOUS UPGRADE — v4.5.0]
 * SUMMARY: KaTeX Math Hardening, Database Draft Synchronization & Real Pacing Engine
 * ================================================================================================
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

const getBackendUrl = () => {
  const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (activeOrigin.includes("jemerplatforms.company")
      ? "https://academy.jemerplatforms.company"
      : activeOrigin.includes("cloudshell.dev")
      ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev"
      : "http://localhost:8080")
  );
};

const cleanTextForLaTeX = (text) => {
  if (typeof text !== "string") return text;
  
  let clean = text
    .replace(/\u2011/g, "-")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ");

  clean = clean.replace(/\\\[([\s\S]*?)\\\]/g, (match, eq) => `\n\n$$${eq.trim()}$$\n\n`);
  clean = clean.replace(/\\\((.*?)\\\)/g, (match, eq) => `$${eq.trim()}$`);
  clean = clean.replace(/\$\s+([^$\n]+?)\s+\$/g, "$$$1$$");

  return clean;
};

export default function BrainTrainingSession({ config, onExit, onLeave }) {
  const questionsRepo = useMemo(() => {
    const repo = {};
    const questions = config?.questions || [];

    questions.forEach((q) => {
      const topicKey = q.sub_topic || "General";
      if (!repo[topicKey]) repo[topicKey] = [];

      let parsedOptions = {};
      try {
        parsedOptions = typeof q.options === "string" ? JSON.parse(q.options) : q.options || {};
      } catch (e) {
        parsedOptions = q.options || {};
      }

      const optionsArr = Object.entries(parsedOptions).map(([key, val]) => ({
        letter: key,
        text: val,
      }));

      repo[topicKey].push({
        id: q.id,
        number: repo[topicKey].length + 1,
        questionText: q.question_text,
        options: optionsArr,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
      });
    });
    return repo;
  }, [config]);

  const activeSubjects = useMemo(() => {
    const subjects = Object.keys(questionsRepo).map((sub) => ({
      id: sub,
      name: sub,
      count: questionsRepo[sub].length,
    }));
    return subjects.length > 0 ? subjects : [{ id: "cognitive_matrix", name: "Neural Matrix", count: 0 }];
  }, [questionsRepo]);

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(activeSubjects[0]?.id || "cognitive_matrix");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(() => (config?.durationMinutes || 45) * 60);

  const [timeSpentMap, setTimeSpentMap] = useState({});
  const questionStartTimeRef = useRef(Date.now());

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(null);
  const [isSubTopicMenuOpen, setIsSubTopicMenuOpen] = useState(false);

  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedIssueType, setSelectedIssueType] = useState("Incorrect Answer Key");
  const [flagComments, setFlagComments] = useState("");
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [flagSuccessMsg, setFlagSuccessMsg] = useState(false);

  const currentSubjectQuestions = questionsRepo[activeSubjectId] || [];
  const currentQuestion = currentSubjectQuestions[activeQuestionIndex];
  const currentQuestionKey = currentQuestion ? currentQuestion.id : null;

  useEffect(() => {
    questionStartTimeRef.current = Date.now();

    return () => {
      if (currentQuestionKey) {
        const elapsedSeconds = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
        if (elapsedSeconds > 0) {
          setTimeSpentMap((prev) => ({
            ...prev,
            [currentQuestionKey]: (prev[currentQuestionKey] || 0) + elapsedSeconds,
          }));
        }
      }
    };
  }, [activeQuestionIndex, activeSubjectId, currentQuestionKey]);

  // 🚀 NEW: Gracefully handle draft payload { has_draft: boolean, draft: object }
  useEffect(() => {
    if (!config?.id) return;

    const fetchServerDraft = async () => {
      try {
        if (typeof window !== "undefined" && window.JemerAuth) {
          const res = await window.JemerAuth.authenticatedFetch(
            `${getBackendUrl()}/api/v1/brain-training/draft/${config.id}`
          );
          if (res.ok) {
            const data = await res.json();
            
            // If the backend confirms a draft exists, hydrate it.
            // If has_draft is false (fresh test or wiped retake), do nothing! The defaults stay active.
            if (data.has_draft && data.draft) {
              const draft = data.draft;
              if (draft.user_answers) setUserAnswers(draft.user_answers);
              if (draft.flagged_questions) setFlaggedQuestions(draft.flagged_questions);
              if (draft.active_subject_id && questionsRepo[draft.active_subject_id]) {
                setActiveSubjectId(draft.active_subject_id);
              }
              if (draft.active_question_index !== undefined) {
                setActiveQuestionIndex(draft.active_question_index);
              }
              if (draft.remaining_seconds && draft.remaining_seconds > 0) {
                setRemainingSeconds(draft.remaining_seconds);
              }
            }
          }
        }
      } catch (e) {
        console.warn("[DRAFT HYDRATION] Could not fetch server draft:", e);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchServerDraft();
  }, [config?.id, questionsRepo]);

  const syncDraftToDatabase = useCallback(async () => {
    if (!config?.id || !isHydrated) return;
    try {
      if (typeof window !== "undefined" && window.JemerAuth) {
        await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/brain-training/draft`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: config.id,
            user_answers: userAnswers,
            flagged_questions: flaggedQuestions,
            remaining_seconds: remainingSeconds,
            active_subject_id: activeSubjectId,
            active_question_index: activeQuestionIndex,
          }),
        });
      }
    } catch (e) {
      console.warn("[DRAFT SYNC] Background draft save blip:", e);
    }
  }, [config?.id, isHydrated, userAnswers, flaggedQuestions, remainingSeconds, activeSubjectId, activeQuestionIndex]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      syncDraftToDatabase();
    }, 2500);
    return () => clearTimeout(debounceTimer);
  }, [userAnswers, flaggedQuestions, activeQuestionIndex, activeSubjectId, syncDraftToDatabase]);

  const handleFinalSubmit = useCallback(() => {
    let finalizedTimeMap = { ...timeSpentMap };
    if (currentQuestionKey) {
      const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
      finalizedTimeMap[currentQuestionKey] = (finalizedTimeMap[currentQuestionKey] || 0) + elapsed;
    }

    if (onExit) {
      onExit({
        userAnswers,
        remainingSeconds,
        questionsRepo,
        timeSpentMap: finalizedTimeMap,
      });
    }
  }, [onExit, userAnswers, remainingSeconds, questionsRepo, timeSpentMap, currentQuestionKey]);

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

  const handleOpenFlagModal = () => {
    if (!currentQuestion) return;
    setSelectedIssueType("Incorrect Answer Key");
    setFlagComments("");
    setFlagSuccessMsg(false);
    setIsFlagModalOpen(true);
  };

  const handleSubmitFlagFeedback = async (e) => {
    e.preventDefault();
    if (!currentQuestionKey || !config?.id) return;

    setIsSubmittingFlag(true);
    try {
      if (typeof window !== "undefined" && window.JemerAuth) {
        await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/brain-training/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: config.id,
            question_id: currentQuestionKey,
            issue_type: selectedIssueType,
            comments: flagComments.trim(),
          }),
        });

        if (!flaggedQuestions.includes(currentQuestionKey)) {
          setFlaggedQuestions((prev) => [...prev, currentQuestionKey]);
        }
        setFlagSuccessMsg(true);
        setTimeout(() => {
          setIsFlagModalOpen(false);
        }, 1200);
      }
    } catch (err) {
      console.error("[FLAG FEEDBACK] Submission failed:", err);
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) setActiveQuestionIndex((prev) => prev - 1);
  };

  const currentSubjectIndex = activeSubjects.findIndex((s) => s.id === activeSubjectId);
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

  const totalQuestionsAllSubjects = useMemo(
    () => activeSubjects.reduce((sum, s) => sum + (s.count || 0), 0),
    [activeSubjects]
  );
  const totalAnsweredCount = useMemo(() => Object.keys(userAnswers).length, [userAnswers]);

  let nextBtnText = "Next →";
  if (isLastQuestionInSubject) {
    nextBtnText = isLastSubject ? "Review & Submit" : "Next Module →";
  }

  if (!isHydrated) return null;

  const currentSubjectName = activeSubjects.find((s) => s.id === activeSubjectId)?.name || "Training Session";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fade-in pb-8 lg:pb-12 px-1 sm:px-4 lg:px-6 select-none">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .markdown-inline-fix p { display: inline; margin: 0; }
        .markdown-inline-fix pre { margin: 0.5rem 0; overflow-x: auto; }
        .brain-session-scroll::-webkit-scrollbar { width: 4px; }
        .brain-session-scroll::-webkit-scrollbar-track { background: transparent; }
        .brain-session-scroll::-webkit-scrollbar-thumb { background-color: rgba(99, 102, 241, 0.3); border-radius: 10px; }
      `,
        }}
      />

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="sticky top-2 sm:top-4 z-30 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0 bg-blue-600">
            JM
          </div>

          <div className="flex flex-col relative w-full sm:w-auto">
            <button
              onClick={() => setIsSubTopicMenuOpen(!isSubTopicMenuOpen)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors focus:outline-none text-left cursor-pointer"
            >
              <span className="truncate max-w-[200px] sm:max-w-xs">{currentSubjectName}</span>
              <svg
                className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${
                  isSubTopicMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Mode: Cognitive Examination</span>

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
                      className={`px-4 py-3 text-left text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                        activeSubjectId === sub.id
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
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
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 font-mono font-black text-sm sm:text-base lg:text-lg border shadow-inner shrink-0 ${
              autoSubmitCountdown !== null
                ? "border-red-500 text-red-500 animate-pulse"
                : "border-slate-800 text-blue-400"
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formattedTimeLeft}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                syncDraftToDatabase();
                setShowExitModal(true);
              }}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 shrink-0 focus:outline-none hidden sm:block cursor-pointer"
            >
              Save & Exit
            </button>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95 shrink-0 focus:outline-none cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          MAIN SPLIT VIEWPORT
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT QUESTION PANEL */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {currentQuestion ? (
            <div className="p-4 sm:p-6 lg:p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 sm:space-y-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
                <span className="text-[11px] sm:text-xs font-mono font-black uppercase text-blue-600 dark:text-blue-400">
                  Question {activeQuestionIndex + 1} of {currentSubjectQuestions.length}
                </span>

                {/* Flag Question Button */}
                <button
                  type="button"
                  onClick={handleOpenFlagModal}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border focus:outline-none cursor-pointer ${
                    flaggedQuestions.includes(currentQuestionKey)
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                  title="Report question error or flag for review"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                  <span>{flaggedQuestions.includes(currentQuestionKey) ? "Flagged" : "Flag"}</span>
                </button>
              </div>

              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed overflow-x-auto brain-session-scroll max-w-full break-words">
                <MarkdownRenderer text={cleanTextForLaTeX(currentQuestion.questionText)} />
              </div>

              {/* Options Rail */}
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = userAnswers[currentQuestionKey] === option.letter;
                  const selectedOptionClass =
                    "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20";
                  const unselectedOptionClass =
                    "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700";
                  const selectedLetterClass = "bg-blue-600 text-white";
                  const unselectedLetterClass = "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

                  return (
                    <div
                      key={option.letter}
                      onClick={() => handleSelectOption(option.letter)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 cursor-pointer select-none ${
                        isSelected ? selectedOptionClass : unselectedOptionClass
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? selectedLetterClass : unselectedLetterClass
                        }`}
                      >
                        {option.letter}
                      </div>
                      <div className="text-xs sm:text-sm font-medium pt-1 markdown-inline-fix w-full overflow-x-auto brain-session-scroll break-words">
                        <MarkdownRenderer text={cleanTextForLaTeX(option.text)} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handlePrevQuestion}
                  disabled={activeQuestionIndex === 0}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer active:scale-95"
                >
                  {nextBtnText}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-medium">No questions active in this partition.</div>
          )}
        </div>

        {/* RIGHT PALETTE PANEL */}
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
                {activeSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id} className="text-slate-900">
                    {sub.name}
                  </option>
                ))}
              </select>
              <span className="text-[10px] font-mono font-bold text-slate-500">{currentSubjectQuestions.length} Items</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
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
                <span className="w-2.5 h-2.5 rounded-full ring-2 bg-transparent ring-blue-500" />
                <span>Current</span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 brain-session-scroll">
              {currentSubjectQuestions.map((q, idx) => {
                const key = q.id;
                const isAnswered = !!userAnswers[key];
                const isFlagged = flaggedQuestions.includes(key);
                const isCurrent = idx === activeQuestionIndex;

                let badgeStyle =
                  "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";
                if (isAnswered) badgeStyle = "bg-blue-600 text-white font-bold";
                if (isFlagged) badgeStyle = "bg-amber-500 text-white font-bold";

                const activeRingStyle = isCurrent
                  ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900"
                  : "";
                return (
                  <button
                    key={key}
                    onClick={() => setActiveQuestionIndex(idx)}
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
              <button
                onClick={() => {
                  syncDraftToDatabase();
                  setShowExitModal(true);
                }}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 focus:outline-none cursor-pointer"
              >
                Save Progress & Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Feedback Modal */}
      {isFlagModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/50 dark:border-amber-800/40">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      Flag Question {activeQuestionIndex + 1}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                      Report Formulation Anomaly
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlagModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {flagSuccessMsg ? (
                <div className="py-8 text-center space-y-2 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                    ✓
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Flag Reported Successfully</h4>
                  <p className="text-xs text-slate-500">Our academic engine will verify this question.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFlagFeedback} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Anomaly Classification
                    </label>
                    <select
                      value={selectedIssueType}
                      onChange={(e) => setSelectedIssueType(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                    >
                      <option value="Incorrect Answer Key">Incorrect Answer Key</option>
                      <option value="LaTeX / Math Formatting Error">LaTeX / Math Formatting Error</option>
                      <option value="Ambiguous / Confusing Question">Ambiguous / Confusing Question</option>
                      <option value="Typo or Grammar Issue">Typo or Grammar Issue</option>
                      <option value="Other Technical Error">Other Technical Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Commentary (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={flagComments}
                      onChange={(e) => setFlagComments(e.target.value)}
                      placeholder="Explain what was wrong with the formula or options..."
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFlagModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingFlag}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingFlag ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* SAVE & EXIT MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save Progress & Exit?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your answers, timer, and current question have been securely synchronized to the database. You can resume
                this session on any device from your Active Training Modules.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  if (onLeave) onLeave();
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors focus:outline-none cursor-pointer"
              >
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
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Exam Session?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You have answered <span className="font-bold text-slate-900 dark:text-white">{totalAnsweredCount}</span> out
                of <span className="font-bold text-slate-900 dark:text-white">{totalQuestionsAllSubjects}</span> questions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none cursor-pointer"
              >
                Return
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit();
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors focus:outline-none cursor-pointer"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTO-SUBMIT TIMER EXPIRED MODAL */}
      {autoSubmitCountdown !== null && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto animate-pulse">
              <span className="text-2xl font-black font-mono">{autoSubmitCountdown}</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Time's Up!</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Session duration expired. Auto-submitting in{" "}
                <span className="font-bold text-blue-500">{autoSubmitCountdown}s</span>.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleAddTime}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider transition-colors focus:outline-none cursor-pointer"
              >
                Add Time & Continue
              </button>
              <button
                onClick={() => {
                  setAutoSubmitCountdown(null);
                  handleFinalSubmit();
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider shadow-md transition-colors focus:outline-none cursor-pointer"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}