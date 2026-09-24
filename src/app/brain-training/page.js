"use client";

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — BRAIN TRAINING ROUTER (v4.3.0)
 * ================================================================================================
 * [NEW UPGRADE — v4.3.0]
 * SUMMARY: Backend-Triggered Retake Exam Wipe & Fresh State Initialization
 * 1. RETAKE API INTEGRATION: Upgraded `handleRetakeExam` to explicitly POST to the new backend 
 *    `/retake` endpoint. This guarantees the previous analytics and old drafts are atomically wiped.
 * 2. CLEAN RESUME: Only after the database confirms the wipe does the UI trigger `handleResumeTraining`, 
 *    booting a 100% fresh, unmasked session with zero prior answers.
 * ================================================================================================
 * [PREVIOUS UPGRADE — v4.2.0]
 * SUMMARY: Zero-LocalStorage Cross-Device Review & Verified Database Hydration
 * ================================================================================================
 */

import React, { useState } from "react";
import BrainTraining from "@/jemer-components/brain-training/brain-training";
import BrainTrainingReview from "@/jemer-components/brain-training/brain-training-review";
import BrainTrainingSession from "@/jemer-components/brain-training/brain-training-session";
import BrainTrainingResults from "@/jemer-components/brain-training/brain-training-results";
import BrainTrainingPerformanceHistory from "@/jemer-components/brain-training/brain-training-performance-history";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

const waitForJemerAuthReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
  const isReady = () => typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.authenticatedFetch === "function";
  if (isReady()) return true;
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    if (isReady()) return true;
  }
  return false;
};

const getBackendUrl = () => {
  const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
  return process.env.NEXT_PUBLIC_API_URL ||
    (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
     activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
     "http://localhost:8080");
};

// ================================================================================================
// 🚀 MAIN BRAIN TRAINING PAGE ORCHESTRATOR
// ================================================================================================

export default function BrainTrainingPage() {
  const [activeStage, setActiveStage] = useState("home");
  const [trainingPrompt, setTrainingPrompt] = useState("");
  const [sessionConfig, setSessionConfig] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("Initializing cognitive pathways...");

  const [uiToastError, setUiToastError] = useState(null);

  const triggerToast = (msg) => {
    setUiToastError(msg);
    setTimeout(() => setUiToastError(null), 5000);
  };

  const handleNewTraining = async (promptText) => {
    setTrainingPrompt(promptText);
    setIsGenerating(true);
    setGenerationStatus("Connecting to Jemer Intelligence Core...");
    setActiveStage("review");

    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: promptText })
      });

      if (!res.ok) throw new Error("Failed to initialize neural pathway generation.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamingBuffer = "";
      let generatedSessionId = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamingBuffer += decoder.decode(value, { stream: true });
        const lines = streamingBuffer.split('\n');
        streamingBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;
          
          const dataStr = trimmedLine.replace('data:', '').trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const payload = JSON.parse(dataStr);
            
            if (payload.error) {
               console.error("[STREAM ERROR]", payload.error);
               triggerToast(`Generation Error: ${payload.error}`);
               break;
            }

            if (payload.message) {
              setGenerationStatus(payload.message);
            }
            if (payload.session_id) {
              generatedSessionId = payload.session_id;
            }
          } catch (e) {}
        }
      }

      if (generatedSessionId) {
        const sessionRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${generatedSessionId}`);
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setSessionConfig(sessionData);
        } else {
          throw new Error("Failed to retrieve generated session data.");
        }
      }

    } catch (error) {
      console.error("Brain Training Generation Pipeline Failed:", error);
      triggerToast("An anomaly occurred during generation. Please verify your connection and restart the session.");
      setActiveStage("home");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResumeTraining = async (historicalData) => {
    setTrainingPrompt(historicalData.title || historicalData.topic);
    setIsGenerating(true);
    setGenerationStatus("Restoring neural pathways...");
    setActiveStage("review");

    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${historicalData.id}`);
      if (!res.ok) throw new Error("Failed to retrieve historical session data.");
      
      const sessionData = await res.json();
      setSessionConfig(sessionData);
    } catch (error) {
      console.error("Failed to resume training session:", error);
      triggerToast("An anomaly occurred while restoring the session.");
      setActiveStage("home");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartSession = (config) => {
    setSessionConfig({ ...sessionConfig, ...config });
    setActiveStage("session");
  };

  const handleLeaveSession = () => {
    setTrainingPrompt("");
    setSessionConfig(null);
    setSessionResults(null);
    setActiveStage("home");
  };

  /**
   * 🚀 Server-Side Verified Exam Submission
   */
  const handleEndSession = async (resultsData) => {
    if (!sessionConfig || !sessionConfig.questions || !sessionConfig.id) return;

    try {
      const BACKEND_URL = getBackendUrl();
      const analyticsPayload = [];
      const timeMap = resultsData.timeSpentMap || {};

      sessionConfig.questions.forEach((q) => {
        const userAnswer = resultsData.userAnswers[q.id] || "";
        analyticsPayload.push({
          question_id: q.id,
          sub_topic: q.sub_topic || "General",
          user_answer: userAnswer,
          is_correct: false, // The Go server evaluates this against true DB answer keys
          time_taken_seconds: timeMap[q.id] || 0
        });
      });

      const submitRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionConfig.id,
          analytics: analyticsPayload
        })
      });

      if (!submitRes.ok) {
        throw new Error("Failed to submit exam session.");
      }

      const resData = await submitRes.json();
      const unmaskedSession = resData.session || sessionConfig;

      // 🚀 Hydrate results with server-verified session, answers, and pacing
      setSessionResults({
        ...resultsData,
        realSession: {
          ...unmaskedSession,
          ai_insight: null // Enforce fresh insight generation
        },
        userAnswers: unmaskedSession.user_answers || resultsData.userAnswers,
        timeSpentMap: unmaskedSession.time_spent_map || resultsData.timeSpentMap
      });
      
      setActiveStage("results");

    } catch (err) {
      console.error("Failed to secure cognitive metrics:", err);
      triggerToast("Submission error: Failed to record verified metrics. Please try again.");
    }
  };

  const handleOpenPerformance = () => {
    setActiveStage("performance");
  };

  /**
   * 🚀 Review Completed Exam with 100% Server Database Hydration (Zero LocalStorage)
   */
  const handleReviewCompletedExam = async (historicalData) => {
    setIsGenerating(true);
    setGenerationStatus("Retrieving cognitive analytics from database...");
    setActiveStage("performance"); 
    
    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      
      // Fetches completed session; backend automatically includes user_answers and time_spent_map
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${historicalData.id}`);
      if (!res.ok) throw new Error("Failed to retrieve historical session data from database.");
      
      const sessionData = await res.json();
      
      // Directly read answers and pacing from Neon DB payload. Works on ANY device!
      setSessionResults({
         realSession: sessionData,
         userAnswers: sessionData.user_answers || {},
         timeSpentMap: sessionData.time_spent_map || {}
      });
      
      setActiveStage("results");
    } catch (error) {
      console.error("Failed to retrieve completed exam:", error);
      triggerToast("Failed to retrieve completed exam record from database.");
      setActiveStage("home");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 🚀 NEW: Server-Validated Retake Flow
   */
  const handleRetakeExam = async (historicalData) => {
    setIsGenerating(true);
    setGenerationStatus("Wiping previous neural analytics for a fresh attempt...");
    setActiveStage("review");

    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      
      // Hit the retake endpoint to atomically wipe the DB draft and analytics
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${historicalData.id}/retake`, {
        method: "POST"
      });

      if (!res.ok) throw new Error("Failed to reset session for retake.");

      // After the DB confirms the wipe, resume the session normally. 
      // It is now a fully "active" session again!
      await handleResumeTraining({ ...historicalData, ai_insight: null });
    } catch (error) {
      console.error("Failed to retake exam:", error);
      triggerToast("An anomaly occurred while preparing the retake session.");
      setActiveStage("home");
      setIsGenerating(false);
    }
  };

  const handleReturnHome = () => {
    setTrainingPrompt("");
    setSessionConfig(null);
    setSessionResults(null);
    setActiveStage("home");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center relative">
      
      {uiToastError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-blue-50 dark:bg-blue-950/90 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 animate-fade-in text-xs font-bold max-w-[90vw] backdrop-blur-md">
          <svg className="w-4 h-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="truncate">{uiToastError}</span>
        </div>
      )}

      {activeStage === "home" && (
        <div className="w-full animate-fade-in">
          <BrainTraining 
            onStartNew={handleNewTraining} 
            onResume={handleResumeTraining} 
            onOpenPerformance={handleOpenPerformance} 
          />
        </div>
      )}

      {activeStage === "review" && (
        <div className="w-full animate-fade-in">
          <BrainTrainingReview 
            promptText={trainingPrompt}
            onStartSession={handleStartSession}
            onBack={handleReturnHome}
            isGenerating={isGenerating}
            generationStatus={generationStatus}
            realSessionConfig={sessionConfig}
          />
        </div>
      )}

      {activeStage === "session" && sessionConfig && (
        <div className="w-full animate-fade-in">
          <BrainTrainingSession 
            config={sessionConfig} 
            onExit={handleEndSession} 
            onLeave={handleLeaveSession} 
          />
        </div>
      )}

      {activeStage === "results" && sessionResults && (
        <div className="w-full animate-fade-in">
          <BrainTrainingResults 
            sessionData={sessionResults} 
            onRestart={handleReturnHome} 
          />
        </div>
      )}

      {activeStage === "performance" && (
        <div className="w-full animate-fade-in">
          <BrainTrainingPerformanceHistory 
            onBack={handleReturnHome}
            onReviewExam={handleReviewCompletedExam}
            onRetakeExam={handleRetakeExam} 
            isGenerating={isGenerating}
            generationStatus={generationStatus}
          />
        </div>
      )}

    </main>
  );
}