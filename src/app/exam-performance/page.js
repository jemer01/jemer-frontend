// app/performance-history/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v2.0 - SESSION HYDRATION ROUTER)
 * ================================================================================================
 * 1. FULL SESSION RESTORATION: Upgraded `handleSelectRecord` to fetch the complete exam payload from the Go backend (`GET /api/v1/examsimulator/session/{id}`).
 * 2. ANALYTICS MAPPING: Cross-references the database's flat `analytics` array with the `questions` array to accurately rebuild the React `userAnswers` state dictionary (`{subjectId}-{questionId}: "A"`).
 * 3. SEAMLESS HANDOFF: Feeds the perfectly reconstructed `examData` and `sessionData` directly into the `<ExamResults />` component, resurrecting the exact exam exactly as it was when submitted.
 * ================================================================================================
 */

import React, { useState } from "react";
import PerformanceHistoryWidget from "@/jemer-components/exam/performance-history-widget";
import ExamResults from "@/jemer-components/exam/exam-results";

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

export default function PerformanceHistoryPage() {
  const [viewStage, setViewStage] = useState("history_list");
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Storage for the full, hydrated session data pulled from the backend
  const [examData, setExamData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const handleSelectRecord = async (record) => {
    setIsLoadingSession(true);
    setViewStage("history_results"); // Shift view early to show loading spinner

    try {
      await fetchJwtOnDemand();
      const BACKEND_URL = getBackendUrl();
      const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/examsimulator/session/${record.id}`);
      
      if (res.ok) {
        const data = await res.json();
        
        // Map the flat analytics array back into the userAnswers dictionary object
        const mappedUserAnswers = {};
        if (data.analytics && data.questions) {
           data.analytics.forEach(ans => {
             // Find which subject this question belongs to in order to reconstruct the exact dict key
             for (const [subId, qList] of Object.entries(data.questions)) {
                if (qList.find(q => q.id === ans.question_id)) {
                   mappedUserAnswers[`${subId}-${ans.question_id}`] = ans.user_answer;
                   break;
                }
             }
           });
        }
        
        setExamData({ questions: data.questions, session_id: data.session.id });
        setSessionData({ 
           userAnswers: mappedUserAnswers, 
           ai_insight: data.session.ai_insight,
           remainingSeconds: 0 
        });
        setSelectedRecord(record);
      } else {
        throw new Error("Failed to fetch detailed session metrics");
      }
    } catch (e) {
      console.error(e);
      setViewStage("history_list");
      alert("Unable to load exam details. The data connection was lost. Please try again.");
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleBackToList = () => {
    setSelectedRecord(null);
    setExamData(null);
    setSessionData(null);
    setViewStage("history_list");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      
      {viewStage === "history_list" && (
        <PerformanceHistoryWidget 
          onSelectRecord={handleSelectRecord} 
        />
      )}

      {viewStage === "history_results" && isLoadingSession && (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin mb-4"></div>
          <span className="text-sm font-bold text-slate-500">Retrieving Cognitive Analytics...</span>
        </div>
      )}

      {viewStage === "history_results" && !isLoadingSession && selectedRecord && examData && sessionData && (
        <ExamResults 
          mode={selectedRecord.mode} 
          config={selectedRecord.config} 
          examData={examData} 
          sessionData={sessionData} 
          onRestart={handleBackToList} 
          isHistoryView={true} 
        />
      )}

    </main>
  );
}