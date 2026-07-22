// app/waec/page.js
"use client"; // Enforces client-side rendering to allow dynamic React state management for the 4-stage exam flow

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.0 - WAEC ORCHESTRATOR)
 * ================================================================================================
 * 1. WAEC MASTER STATE MACHINE: Created the `/waec` page orchestrator utilizing the identical 
 *    highly-optimized 4-stage flow from the JAMB UI (Customization -> Loading -> Session -> Results).
 * 2. DYNAMIC MODE PROP: Hardcoded the `mode="waec"` prop into all 4 imported Jemer components. 
 *    This will act as our trigger to switch themes (Green -> Deep Blue), logic (max 9 subjects instead of 4), 
 *    and grading (A1-F9 instead of out of 400) when we upgrade the core components next.
 * 3. COMPONENT REUSE: Successfully points to `@/jemer-components/exam/` to reuse our core CBT engine.
 * ================================================================================================
 */

// Import core React hooks for local state management
import React, { useState } from "react";

// Import the core JAMB/WAEC CBT components from the /jemer-components directory
import ExamCustomization from "@/jemer-components/exam/exam-customization"; // Configurator & Subject Selector (Stage 1)
import ExamLoadingSpinner from "@/jemer-components/exam/exam-loading-spinner"; // Animated loading screen (Stage 2)
import ExamSessions from "@/jemer-components/exam/exam-sessions"; // Real CBT simulation environment (Stage 3)
import ExamResults from "@/jemer-components/exam/exam-results"; // Post-exam analytics dashboard (Stage 4)

/**
 * WaecExamPage Component (Route: /waec)
 * 
 * Master Orchestrator for the WAEC WASSCE CBT Gateway.
 * Manages the seamless 4-stage state machine:
 *   Stage 1: 'customization' -> Subject selection (up to 9), duration config (per subject), and year setup.
 *   Stage 2: 'loading'       -> High-engagement prep screen compiling WAEC questions.
 *   Stage 3: 'session'       -> Active CBT test environment tailored for WAEC requirements.
 *   Stage 4: 'results'       -> Post-exam A1-F9 grading analytics and corrections review engine.
 */
export default function WaecExamPage() {
  // Local State 1: Tracks current stage of the exam workflow ('customization' | 'loading' | 'session' | 'results')
  const [examStage, setExamStage] = useState("customization");

  // Local State 2: Stores the validated configuration payload passed from the configurator
  const [examConfig, setExamConfig] = useState(null);

  // Local State 3: Stores actual performance data passed from the exam session
  const [sessionData, setSessionData] = useState(null);

  /**
   * Called when the user completes configuration and clicks "Start Simulation" in Stage 1.
   * Stores user choices and advances to the pre-check loading screen.
   * 
   * @param {Object} config - The final user selection object containing subjects, duration, years, etc.
   */
  const handleStartCustomization = (config) => {
    // Save user selections into state
    setExamConfig(config);
    // Advance state to Stage 2 (Loading Animation)
    setExamStage("loading");
  };

  /**
   * Called when the pre-check animation in Stage 2 finishes loading (100%).
   * Launches the live exam session.
   */
  const handleLoadingComplete = () => {
    // Advance state to Stage 3 (Active Exam Session)
    setExamStage("session");
  };

  /**
   * Called when the user submits or exits the active exam session in Stage 3.
   * Receives real test data, stores it, and transitions to the Stage 4 Analytics Dashboard.
   * 
   * @param {Object} data - Contains userAnswers, remainingSeconds, and questionsRepo
   */
  const handleExitExam = (data) => {
    // Store the actual test performance data
    setSessionData(data);
    // Advance state to Stage 4 (Results Dashboard)
    setExamStage("results");
  };

  /**
   * Called from the Results Dashboard to restart the entire workflow.
   */
  const handleRestartExam = () => {
    // Clear stored config and session data
    setExamConfig(null);
    setSessionData(null);
    // Reset state machine back to Stage 1 (Customization)
    setExamStage("customization");
  };

  return (
    // Page main wrapper
    <main className="w-full flex flex-col items-center justify-center">
      
      {/* STAGE 1: EXAM CUSTOMIZATION & SETUP ENGINE */}
      {examStage === "customization" && (
        <ExamCustomization 
          // 🆕 TRIGGER: Identifies gateway mode as WAEC to enforce up to 9 subjects & blue theme
          mode="waec" 
          // Callback handler triggered when user submits valid exam setup
          onStart={handleStartCustomization} 
        />
      )}

      {/* STAGE 2: HIGH-ENGAGEMENT PRE-CHECK LOADING SPINNER */}
      {examStage === "loading" && (
        <ExamLoadingSpinner 
          // 🆕 TRIGGER: Identifies gateway mode as WAEC for custom loading messages & blue theme
          mode="waec" 
          // Passes saved user choices to calibrate simulation status indicators
          config={examConfig} 
          // Callback handler triggered when loading reaches 100%
          onComplete={handleLoadingComplete} 
        />
      )}

      {/* STAGE 3: ACTIVE CBT EXAM SESSION INTERFACE */}
      {examStage === "session" && (
        <ExamSessions 
          // 🆕 TRIGGER: Identifies gateway mode as WAEC for CBT visual blue theme
          mode="waec" 
          // Passes full configuration payload to power exam session
          config={examConfig} 
          // Callback handler to pass data and terminate session
          onExit={handleExitExam} 
        />
      )}

      {/* STAGE 4: EXAM RESULTS & ANALYTICS DASHBOARD */}
      {examStage === "results" && (
        <ExamResults 
          // Passes original config for subjects and scaling bounds (now tracking A1-F9)
          config={examConfig} 
          // Passes actual test output data
          sessionData={sessionData} 
          // 🆕 TRIGGER: Passing the mode so the dashboard renders the blue theme and custom WAEC layout
          mode="waec"
          // Callback to restart the exam simulation completely
          onRestart={handleRestartExam} 
        />
      )}

    </main>
  );
}