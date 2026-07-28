// app/brain-training/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - BRAIN TRAINING ORCHESTRATOR)
 * ================================================================================================
 * 1. 4-STAGE MACHINE UNLOCKED: Created a fully connected 4-stage state machine (`home` -> `review` 
 *    -> `session` -> `results`). ALL components are imported and mounted to guarantee zero 
 *    "component not loading" errors.
 * 2. DYNAMIC PROP ROUTING: Handles transitioning from a new AI prompt (`handleNewTraining`) or 
 *    resuming an old session directly from history (`handleResumeTraining`), skipping the review 
 *    stage seamlessly.
 * ================================================================================================
 */

import React, { useState } from "react";
import BrainTraining from "@/jemer-components/brain-training/brain-training";
import BrainTrainingReview from "@/jemer-components/brain-training/brain-training-review";
import BrainTrainingSession from "@/jemer-components/brain-training/brain-training-session";
import BrainTrainingResults from "@/jemer-components/brain-training/brain-training-results";

export default function BrainTrainingPage() {
  // Master State Machine: Tracks active viewport
  const [activeStage, setActiveStage] = useState("home");
  
  // Data Payloads for transitions
  const [trainingPrompt, setTrainingPrompt] = useState("");
  const [sessionConfig, setSessionConfig] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);

  /**
   * Stage 1 -> Stage 2: User submits a new topic prompt from the Hero component.
   */
  const handleNewTraining = (promptText) => {
    setTrainingPrompt(promptText);
    setActiveStage("review");
  };

  /**
   * Stage 1 -> Stage 3: User clicks a past session in the History Grid. Bypasses Review.
   */
  const handleResumeTraining = (historicalData) => {
    setSessionConfig(historicalData);
    setActiveStage("session");
  };

  /**
   * Stage 2 -> Stage 3: User accepts the AI generated syllabus and launches the CBT.
   */
  const handleStartSession = (config) => {
    setSessionConfig(config);
    setActiveStage("session");
  };

  /**
   * Stage 3 -> Stage 4: User finishes the brain training session and submits.
   */
  const handleEndSession = (resultsData) => {
    setSessionResults(resultsData);
    setActiveStage("results");
  };

  /**
   * Universal Return Handler
   */
  const handleReturnHome = () => {
    setTrainingPrompt("");
    setSessionConfig(null);
    setSessionResults(null);
    setActiveStage("home");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      
      {/* STAGE 1: HERO PROMPT BOX & HISTORY GRID */}
      {activeStage === "home" && (
        <div className="w-full animate-fade-in">
          <BrainTraining 
            onStartNew={handleNewTraining} 
            onResume={handleResumeTraining} 
          />
        </div>
      )}

      {/* STAGE 2: AI SYLLABUS BUILDER & REVIEW */}
      {activeStage === "review" && (
        <div className="w-full animate-fade-in">
          <BrainTrainingReview 
            promptText={trainingPrompt}
            onStartSession={handleStartSession}
            onBack={handleReturnHome}
          />
        </div>
      )}

      {/* STAGE 3: ACTIVE COGNITIVE CBT SESSION */}
      {activeStage === "session" && sessionConfig && (
        <div className="w-full animate-fade-in">
          <BrainTrainingSession 
            config={sessionConfig} 
            onExit={handleEndSession} 
          />
        </div>
      )}

      {/* STAGE 4: POST-TRAINING COGNITIVE ANALYTICS */}
      {activeStage === "results" && sessionResults && (
        <div className="w-full animate-fade-in">
          <BrainTrainingResults 
            sessionData={sessionResults} 
            onRestart={handleReturnHome} 
          />
        </div>
      )}

    </main>
  );
}