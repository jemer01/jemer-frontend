"use client";

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — BRAIN TRAINING ROUTER (v4.1.0)
 * ================================================================================================
 * [NEW UPGRADE — v4.1.0]
 * SUMMARY: Server-Side Graded Submission Pipeline & True Instant Scoring
 * 1. SERVER-GRADED RECEPTION: `handleEndSession` now submits the raw answers to the backend, 
 *    awaits the server-side auto-graded session response, and passes the unmasked answers directly 
 *    into the Results component. The student immediately sees their real score on the first try!
 * 2. REAL PACING HANDOFF: Passes `resultsData.timeSpentMap` into the analytics payload so question 
 *    latencies are saved directly into the database.
 * 3. NO CLIENT-SIDE GRADING COLLISION: Ripped out the broken client-side comparison against empty 
 *    `q.correct_answer` strings that previously forced the initial score to read 0%.
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
   * 🚀 UPGRADED: Server-Side Verified Exam Submission
   */
  const handleEndSession = async (resultsData) => {
    if (!sessionConfig || !sessionConfig.questions || !sessionConfig.id) return;

    try {
      // Local backup for instant re-opening
      try {
        localStorage.setItem(`jemer_brain_completed_${sessionConfig.id}`, JSON.stringify(resultsData.userAnswers || {}));
      } catch (e) {}

      const BACKEND_URL = getBackendUrl();
      const analyticsPayload = [];
      const timeMap = resultsData.timeSpentMap || {};

      sessionConfig.questions.forEach((q) => {
        const userAnswer = resultsData.userAnswers[q.id] || "";
        analyticsPayload.push({
          question_id: q.id,
          sub_topic: q.sub_topic || "General",
          user_answer: userAnswer,
          is_correct: false, // The Go server evaluates this against the true answer keys in DB
          time_taken_seconds: timeMap[q.id] || 0
        });
      });

      // Submit to backend
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
      // 🚀 NEW: Receive the unmasked session (with real answers and explanations) from the backend response
      const unmaskedSession = resData.session || sessionConfig;

      setSessionResults({
        ...resultsData,
        realSession: {
          ...unmaskedSession,
          ai_insight: null // Enforce fresh insight generation
        }
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

  const handleReviewCompletedExam = async (historicalData) => {
    setIsGenerating(true);
    setGenerationStatus("Retrieving cognitive analytics...");
    setActiveStage("performance"); 
    
    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${historicalData.id}`);
      if (!res.ok) throw new Error("Failed to retrieve historical session data.");
      
      const sessionData = await res.json();
      
      let savedAnswers = {};
      try {
        const localData = localStorage.getItem(`jemer_brain_completed_${historicalData.id}`);
        if (localData) {
          savedAnswers = JSON.parse(localData);
        }
      } catch (e) {}
      
      setSessionResults({
         realSession: sessionData,
         userAnswers: savedAnswers
      });
      
      setActiveStage("results");
    } catch (error) {
      console.error("Failed to retrieve completed exam:", error);
      triggerToast("Failed to retrieve completed exam record. Please try again.");
      setActiveStage("home");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetakeExam = async (historicalData) => {
    try {
      localStorage.removeItem(`jemer_brain_draft_${historicalData.id}`);
      localStorage.removeItem(`jemer_brain_completed_${historicalData.id}`);
    } catch (e) {}
    
    await handleResumeTraining({ ...historicalData, ai_insight: null });
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