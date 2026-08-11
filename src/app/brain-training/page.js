/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.2 Brain Training SPA Orchestrator Upgrade.
 * 1. Safe Exit Routing: Added `handleLeaveSession` to allow users to save their progress locally and exit back to the Home/History screen without triggering the backend analytics submission.
 * 2. Prop Handoff: Passed the new `onLeave` function down to the `<BrainTrainingSession />` component.
 * 3. Preserved Infrastructure: 100% of the JWT JIT logic, SSE generation pipeline, analytics submission, and stage routing remain completely intact.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — BRAIN TRAINING ROUTER (v2.2)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
import BrainTraining from "@/jemer-components/brain-training/brain-training";
import BrainTrainingReview from "@/jemer-components/brain-training/brain-training-review";
import BrainTrainingSession from "@/jemer-components/brain-training/brain-training-session";
import BrainTrainingResults from "@/jemer-components/brain-training/brain-training-results";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

const decodeJWTPayload = (token) => {
  try {
    const base64Url = token.split('.[...](asc_slot://start-slot-1)');
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

  // Only redirect to login if BOTH the JWT and User ID are completely missing.
  if (!activeToken && !userId) {
     window.location.href = "/login.html";
     return new Response(null, { status: 401 });
  }

  // Silently refresh if expiring
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

  // Fallback interceptor if API rejects token
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
  // Master State Machine: Tracks active viewport
  const [activeStage, setActiveStage] = useState("home");
  
  // Data Payloads for transitions
  const [trainingPrompt, setTrainingPrompt] = useState("");
  const [sessionConfig, setSessionConfig] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);

  // SSE Telemetry States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("Initializing cognitive pathways...");

  /**
   * Stage 1 -> Stage 2: User submits a new topic prompt from the Hero component.
   * Connects to the backend via SSE to generate the session.
   */
  const handleNewTraining = async (promptText) => {
    setTrainingPrompt(promptText);
    setIsGenerating(true);
    setGenerationStatus("Connecting to Jemer Intelligence Core...");
    setActiveStage("review"); // Review acts as the loading/confirmation screen

    try {
      await fetchJwtOnDemand();
      const BACKEND_URL = getBackendUrl();
      
      // Initiate SSE Pipeline
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
          } catch (e) {
            // Ignore incomplete chunks
          }
        }
      }

      // Fetch the final generated payload and hydrate session config
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

  /**
   * Stage 1 -> Stage 2 (Review): User clicks a past session in the History Grid.
   * Fetches the full session payload from the DB and routes to Review so user can see the syllabus again.
   */
  const handleResumeTraining = async (historicalData) => {
    // Route immediately to review screen with a loading state
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

  /**
   * Stage 2 -> Stage 3: User accepts the AI generated syllabus and launches the CBT.
   */
  const handleStartSession = (config) => {
    // Override the base session config with any custom updates (like custom duration) from the Review screen
    setSessionConfig({ ...sessionConfig, ...config });
    setActiveStage("session");
  };

  /**
   * 🚀 NEW: Stage 3 -> Stage 1: User saves progress locally and exits.
   * Allows safely leaving the exam without finalizing analytics to the database.
   */
  const handleLeaveSession = () => {
    setTrainingPrompt("");
    setSessionConfig(null);
    setSessionResults(null);
    setActiveStage("home");
  };

  /**
   * Stage 3 -> Stage 4: User finishes the brain training session and submits.
   * Compiles user answers and POSTs them to the analytics ingestion backend.
   */
  const handleEndSession = async (resultsData) => {
    
    // Attempt to submit analytics asynchronously
    if (sessionConfig && sessionConfig.questions && sessionConfig.id) {
      try {
        const BACKEND_URL = getBackendUrl();
        const analyticsPayload = [];
        
        // Map answers from the UI to the backend schema
        sessionConfig.questions.forEach((q) => {
          const questionKey = q.id; 
          const userAnswer = resultsData.userAnswers[questionKey] || "";
          const isCorrect = userAnswer === q.correct_answer;
          
          analyticsPayload.push({
            question_id: q.id,
            sub_topic: q.sub_topic || "General",
            user_answer: userAnswer,
            is_correct: isCorrect,
            time_taken_seconds: 0 // Tracked in local session
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

    setSessionResults({ ...resultsData, realSession: sessionConfig });
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
            isGenerating={isGenerating}
            generationStatus={generationStatus}
            realSessionConfig={sessionConfig}
          />
        </div>
      )}

      {/* STAGE 3: ACTIVE COGNITIVE CBT SESSION */}
      {activeStage === "session" && sessionConfig && (
        <div className="w-full animate-fade-in">
          <BrainTrainingSession 
            config={sessionConfig} 
            onExit={handleEndSession} 
            onLeave={handleLeaveSession} // 🚀 NEW: Passed Safe Exit Handler
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
