/**
 * [NEW UPGRADE]
 * SUMMARY: v3.3 Centralized Auth Engine Migration.
 * 1. Removed the entire local JWT/refresh/lock reimplementation (decodeJWTPayload,
 *    isTokenExpiringSoon, getAuthRefreshLock, waitForAuthSDKReady, fetchJwtOnDemand,
 *    jemerAuthenticatedFetch) now that auth.js v4.0 exposes the same logic once, globally, via
 *    window.JemerAuth. Replaced with one minimal waitForJemerAuthReady() readiness poll.
 * 2. All five backend calls (handleNewTraining's generate stream + follow-up session GET,
 *    handleResumeTraining's session GET, handleEndSession's submit POST,
 *    handleReviewCompletedExam's session GET) hit our own Go backend
 *    (/api/v1/brain-training/...) and now use window.JemerAuth.authenticatedFetch() directly,
 *    which also drops the apikey header these calls never actually needed.
 * 3. PRE-FLIGHT TOKEN CHECKS REMOVED: the three manual fetchJwtOnDemand() calls in
 *    handleNewTraining, handleResumeTraining, and handleReviewCompletedExam were removed —
 *    authenticatedFetch already proactively refreshes a token expiring within 5 minutes as part
 *    of the call itself.
 * 4. Dropped the dead legacy-key fallbacks (access_token, token, jemer_user_id, user_id) — none
 *    of these are written anywhere; the redirect-to-login gate now checks the JWT alone, same as
 *    every other page in the app. The jemer_brain_completed_* local answer-cache keys are
 *    unrelated to auth and were left untouched.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: Executed v3.2 Retake Fresh Insight Enforcement.
 * 1. Fresh Remark Guarantee: In `handleEndSession`, explicitly set `ai_insight: null` on the session payload so retakes and fresh exams never carry over stale AI reviews from prior attempts.
 * 2. Retake Slate Wiped: In `handleRetakeExam`, purges both local storage keys and resumes with `ai_insight: null`.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — BRAIN TRAINING ROUTER (v3.3)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
import BrainTraining from "@/jemer-components/brain-training/brain-training";
import BrainTrainingReview from "@/jemer-components/brain-training/brain-training-review";
import BrainTrainingSession from "@/jemer-components/brain-training/brain-training-session";
import BrainTrainingResults from "@/jemer-components/brain-training/brain-training-results";
import BrainTrainingPerformanceHistory from "@/jemer-components/brain-training/brain-training-performance-history";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

// 🆕 v3.3: Minimal readiness guard for the globally-loaded auth engine (window.JemerAuth,
// injected once by layout.js via <Script strategy="afterInteractive">). That script loads after
// first paint, so a call firing shortly after mount could technically run before it exists —
// this polls briefly instead of assuming it's already there.
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
      setGenerationStatus("An anomaly occurred during generation. Please restart the session.");
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
      setGenerationStatus("An anomaly occurred while restoring the session.");
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
   * Stage 3 -> Stage 4: User finishes the brain training session and submits.
   */
  const handleEndSession = async (resultsData) => {
    if (sessionConfig && sessionConfig.questions && sessionConfig.id) {
      try {
        // Save answers locally so the user can review them later via Performance History
        localStorage.setItem(`jemer_brain_completed_${sessionConfig.id}`, JSON.stringify(resultsData.userAnswers || {}));

        const BACKEND_URL = getBackendUrl();
        const analyticsPayload = [];
        
        sessionConfig.questions.forEach((q) => {
          const questionKey = q.id; 
          const userAnswer = resultsData.userAnswers[questionKey] || "";
          const isCorrect = userAnswer === q.correct_answer;
          
          analyticsPayload.push({
            question_id: q.id,
            sub_topic: q.sub_topic || "General",
            user_answer: userAnswer,
            is_correct: isCorrect,
            time_taken_seconds: 0
          });
        });

        if (analyticsPayload.length > 0) {
          await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sessionConfig.id,
              analytics: analyticsPayload
            })
          });
        }
      } catch (err) {
        console.error("Failed to secure cognitive metrics:", err);
      }
    }

    // 🚀 NEW: Ensure ai_insight is null on completion so fresh analysis generates
    const sessionForResults = {
      ...sessionConfig,
      ai_insight: null
    };

    setSessionResults({ ...resultsData, realSession: sessionForResults });
    setActiveStage("results");
  };

  const handleOpenPerformance = () => {
    setActiveStage("performance");
  };

  /**
   * Review Completed Exam
   */
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
      } catch (e) {
        console.warn("Failed to parse local completed answers", e);
      }
      
      setSessionResults({
         realSession: sessionData,
         userAnswers: savedAnswers
      });
      
      setActiveStage("results");
    } catch (error) {
      console.error("Failed to retrieve completed exam:", error);
      alert("Failed to retrieve completed exam record. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handle Exam Retakes
   */
  const handleRetakeExam = async (historicalData) => {
    try {
      localStorage.removeItem(`jemer_brain_draft_${historicalData.id}`);
      localStorage.removeItem(`jemer_brain_completed_${historicalData.id}`);
    } catch (e) {
      console.warn("Failed to wipe local storage for retake");
    }
    
    // Explicitly wipe stale ai_insight when retaking
    await handleResumeTraining({ ...historicalData, ai_insight: null });
  };

  const handleReturnHome = () => {
    setTrainingPrompt("");
    setSessionConfig(null);
    setSessionResults(null);
    setActiveStage("home");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      
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

      {/* STAGE 5: PERFORMANCE HISTORY ARCHIVE */}
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