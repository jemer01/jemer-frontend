// app/questions/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.0 - QUESTIONS HUNTER ORCHESTRATOR)
 * ================================================================================================
 * 1. 4-STAGE MACHINE: Utilizes identical flow (Customization -> Loading -> Session -> Results) 
 *    with our advanced active learning capabilities and global exam support.
 * 2. MODE PROP TRIGGER: Hardcoded `mode="hunter"` to trigger the Turquoise UI, edge-to-edge AI 
 *    prompt bar generation, and infinite quiz synthesis logic in the core components.
 * ================================================================================================
 */

import React, { useState } from "react";
import ExamCustomization from "@/jemer-components/exam/exam-customization";
import ExamLoadingSpinner from "@/jemer-components/exam/exam-loading-spinner";
import ExamSessions from "@/jemer-components/exam/exam-sessions";
import ExamResults from "@/jemer-components/exam/exam-results";

export default function QuestionsHunterPage() {
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
          mode="hunter" 
          onStart={handleStartCustomization} 
        />
      )}

      {examStage === "loading" && (
        <ExamLoadingSpinner 
          mode="hunter" 
          config={examConfig} 
          onComplete={handleLoadingComplete} 
        />
      )}

      {examStage === "session" && (
        <ExamSessions 
          mode="hunter" 
          config={examConfig} 
          onExit={handleExitExam} 
        />
      )}

      {examStage === "results" && (
        <ExamResults 
          mode="hunter" 
          config={examConfig} 
          sessionData={sessionData} 
          onRestart={handleRestartExam} 
        />
      )}

    </main>
  );
}