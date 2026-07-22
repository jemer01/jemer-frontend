// app/exam-practice/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.0 - EXAM PRACTICE ORCHESTRATOR)
 * ================================================================================================
 * 1. 4-STAGE MACHINE: Utilizes identical flow (Customization -> Loading -> Session -> Results).
 * 2. MODE PROP TRIGGER: Hardcoded `mode="practice"` to trigger the orange UI, 1-subject limit, 
 *    custom question count, and single-subject grading in the core components.
 * ================================================================================================
 */

import React, { useState } from "react";
import ExamCustomization from "@/jemer-components/exam/exam-customization";
import ExamLoadingSpinner from "@/jemer-components/exam/exam-loading-spinner";
import ExamSessions from "@/jemer-components/exam/exam-sessions";
import ExamResults from "@/jemer-components/exam/exam-results";

export default function ExamPracticePage() {
  const [examStage, setExamStage] = useState("customization");
  const [examConfig, setExamConfig] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  const handleStartCustomization = (config) => {
    setExamConfig(config);
    setExamStage("loading");
  };

  const handleLoadingComplete = () => {
    setExamStage("session");
  };

  const handleExitExam = (data) => {
    setSessionData(data);
    setExamStage("results");
  };

  const handleRestartExam = () => {
    setExamConfig(null);
    setSessionData(null);
    setExamStage("customization");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      
      {examStage === "customization" && (
        <ExamCustomization 
          mode="practice" 
          onStart={handleStartCustomization} 
        />
      )}

      {examStage === "loading" && (
        <ExamLoadingSpinner 
          mode="practice" 
          config={examConfig} 
          onComplete={handleLoadingComplete} 
        />
      )}

      {examStage === "session" && (
        <ExamSessions 
          mode="practice" 
          config={examConfig} 
          onExit={handleExitExam} 
        />
      )}

      {examStage === "results" && (
        <ExamResults 
          mode="practice" 
          config={examConfig} 
          sessionData={sessionData} 
          onRestart={handleRestartExam} 
        />
      )}

    </main>
  );
}