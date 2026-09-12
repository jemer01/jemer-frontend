// app/exam-practice/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.1 - EXAM PRACTICE ORCHESTRATOR API INTEGRATION)
 * ================================================================================================
 * 1. REAL DATA PIPELINE: Added `examData` state to securely store the generated `session_id` and structured `questions` returned from the Go backend.
 * 2. COMPONENT WIRING: Modified `handleLoadingComplete` to accept the API payload from the Loading Spinner and pass it directly into the `ExamSessions` and `ExamResults` components.
 * 3. PRESERVED ARCHITECTURE: Kept the robust 4-stage engine intact.
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
  
  // 🚀 NEW: State to hold the live data returned from our Go backend
  const [examData, setExamData] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  const handleStartCustomization = (config) => {
    setExamConfig(config);
    setExamStage("loading");
  };

  // 🚀 FIXED: Accepts the fetched payload and advances the stage
  const handleLoadingComplete = (apiPayload) => {
    setExamData(apiPayload);
    setExamStage("session");
  };

  const handleExitExam = (data) => {
    setSessionData(data);
    setExamStage("results");
  };

  const handleRestartExam = () => {
    setExamConfig(null);
    setExamData(null);
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

      {examStage === "session" && examData && (
        <ExamSessions 
          mode="practice" 
          config={examConfig} 
          examData={examData} // 🚀 NEW: Passes real questions down to the session
          onExit={handleExitExam} 
        />
      )}

      {examStage === "results" && (
        <ExamResults 
          mode="practice" 
          config={examConfig} 
          examData={examData} // 🚀 NEW: Passes session_id down to log analytics
          sessionData={sessionData} 
          onRestart={handleRestartExam} 
        />
      )}

    </main>
  );
}