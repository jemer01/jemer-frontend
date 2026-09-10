/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v3.2 Retake Fresh Insight Enforcement.
 * 1. Fresh Remark Guarantee: In `handleEndSession`, explicitly set `ai_insight: null` on the session payload so retakes and fresh exams never carry over stale AI reviews from prior attempts.
 * 2. Retake Slate Wiped: In `handleRetakeExam`, purges both local storage keys and resumes with `ai_insight: null`.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — BRAIN TRAINING ROUTER (v3.2)
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

const decodeJWTPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const isTokenExpiringSoon = (token, thresholdSeconds = 300) => {
  if (!token) return true;
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true;
  const currentUnixTime = Math.floor(Date.now() / 1000);
  return (payload.exp - currentUnixTime) < thresholdSeconds;
};

const getAuthRefreshLock = () => {
  if (typeof window === "undefined") return { isRefreshing: false, refreshPromise: null };
  if (!window.__jemerAuthRefreshLock) {
    window.__jemerAuthRefreshLock = { isRefreshing: false, refreshPromise: null };
  }
  return window.__jemerAuthRefreshLock;
};

const waitForAuthSDKReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
  const isReady = () => typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.refreshSession === "function";
  if (isReady()) return true;
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    if (isReady()) return true;
  }
  return false;
};

const fetchJwtOnDemand = async () => {
  const lock = getAuthRefreshLock();
  if (lock.isRefreshing) return lock.refreshPromise;
  lock.isRefreshing = true;

  lock.refreshPromise = (async () => {
    try {
      const sdkIsReady = await waitForAuthSDKReady();
      if (sdkIsReady) {
        const refreshOutcome = await window.JemerAuth.refreshSession();
        if (refreshOutcome && refreshOutcome.success === false) return null;

        let attempts = 0;
        while (attempts < 100) {
          const currentToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
          if (currentToken && !isTokenExpiringSoon(currentToken, 300)) {
            return currentToken;
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
        }
      }
      return localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || null;
    } catch (error) {
      return null;
    } finally {
      lock.isRefreshing = false;
    }
  })();

  return lock.refreshPromise;
};

const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
  const userId = localStorage.getItem("jemer_user_id") || localStorage.getItem("user_id");

  if (!activeToken && !userId) {
     window.location.href = "/login.html";
     return new Response(null, { status: 401 });
  }

  if (isTokenExpiringSoon(activeToken, 300)) {
     const freshToken = await fetchJwtOnDemand();
     if (freshToken) {
       activeToken = freshToken;
     }
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${activeToken}`);
  headers.set("apikey", activeToken);

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 400) {
     const emergencyToken = await fetchJwtOnDemand();
     if (emergencyToken && emergencyToken !== activeToken) {
        headers.set("Authorization", `Bearer ${emergencyToken}`);
        headers.set("apikey", emergencyToken);
        response = await fetch(url, { ...options, headers });
     } else {
        const checkToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
        const checkUserId = localStorage.getItem("jemer_user_id") || localStorage.getItem("user_id");
        if (!checkToken && !checkUserId) {
           window.location.href = "/login.html";
        }
     }
  }

  return response;
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
      await fetchJwtOnDemand();
      const BACKEND_URL = getBackendUrl();
      
      const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/generate`, {
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
        const sessionRes = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${generatedSessionId}`);
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
      await fetchJwtOnDemand();
      const BACKEND_URL = getBackendUrl();
      
      const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${historicalData.id}`);
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
          await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/submit`, {
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
      await fetchJwtOnDemand();
      const BACKEND_URL = getBackendUrl();
      
      const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/brain-training/session/${historicalData.id}`);
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