"use client"; // Enforces client-side rendering to allow dynamic React state management for the 3-stage exam flow

// Import core React hooks for local state management
import React, { useState } from "react";

// Import the 3 core JAMB CBT components from the /jemer-components directory
import ExamCustomization from "@/jemer-components/jamb/exam-customization"; // Configurator & Subject Selector (Stage 1)
import ExamLoadingSpinner from "@/jemer-components/jamb/exam-loading-spinner"; // Animated flight-check loading screen (Stage 2)
import ExamSessions from "@/jemer-components/jamb/exam-sessions"; // Real CBT simulation environment (Stage 3)

/**
 * JambExamPage Component (Route: /jamb)
 * 
 * Master Orchestrator for the JAMB CBT Gateway.
 * Manages the seamless 3-stage state machine:
 *   Stage 1: 'customization' -> Subject selection, duration config, question distribution, and year configuration.
 *   Stage 2: 'loading'       -> High-engagement prep screen compiling 180 questions across 4 subjects.
 *   Stage 3: 'session'       -> Active CBT test environment with active countdown timers and question matrix.
 */
export default function JambExamPage() {
  // Local State 1: Tracks current stage of the exam workflow ('customization' | 'loading' | 'session')
  const [examStage, setExamStage] = useState("customization");

  // Local State 2: Stores the validated configuration payload passed from the configurator
  const [examConfig, setExamConfig] = useState(null);

  /**
   * Called when the user completes configuration and clicks "Start JAMB Simulation" in Stage 1.
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
   * Resets the workflow back to the customization setup screen.
   */
  const handleExitExam = () => {
    // Clear stored exam configuration
    setExamConfig(null);
    // Reset state machine back to Stage 1 (Customization)
    setExamStage("customization");
  };

  return (
    // Page main wrapper
    <main className="w-full flex flex-col items-center justify-center">
      
      {/* STAGE 1: EXAM CUSTOMIZATION & SETUP ENGINE */}
      {examStage === "customization" && (
        <ExamCustomization 
          // Identifies gateway mode as JAMB to enforce mandatory Use of English + 3 subjects rule
          mode="jamb" 
          // Callback handler triggered when user submits valid exam setup
          onStart={handleStartCustomization} 
        />
      )}

      {/* STAGE 2: HIGH-ENGAGEMENT PRE-CHECK LOADING SPINNER */}
      {examStage === "loading" && (
        <ExamLoadingSpinner 
          // Identifies gateway mode as JAMB for custom loading messages
          mode="jamb" 
          // Passes saved user choices to calibrate simulation status indicators
          config={examConfig} 
          // Callback handler triggered when loading reaches 100%
          onComplete={handleLoadingComplete} 
        />
      )}

      {/* STAGE 3: ACTIVE CBT EXAM SESSION INTERFACE */}
      {examStage === "session" && (
        <ExamSessions 
          // Identifies gateway mode as JAMB for CBT visual theme
          mode="jamb" 
          // Passes full configuration payload (subjects, questions, timer) to power exam session
          config={examConfig} 
          // Callback handler to terminate or restart session
          onExit={handleExitExam} 
        />
      )}

    </main>
  );
}