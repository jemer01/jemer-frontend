"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.5 - BACKEND API INTEGRATION)
 * ================================================================================================
 * 1. REAL API FETCH: Replaced the fake 3-second timer with a live `POST` request to the Go backend's `/api/v1/examsimulator/generate` endpoint.
 * 2. JWT SECURITY: Integrated `jemerAuthenticatedFetch` to securely authorize the payload.
 * 3. INTELLIGENT PROGRESS BAR: The progress bar animates smoothly up to 90% while waiting for the Sdash/Cache fallback engine, then jumps to 100% when the real data arrives.
 * 4. ERROR HANDLING: Safely catches network/cache faults, halting the spinner and alerting the user so it doesn't get stuck infinitely.
 * ================================================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from "react";

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

const STATUS_STEPS = {
  jamb: [
    "Connecting to Jemer High-Speed UTME Question Engine...",
    "Shuffling questions across selected subject combinations...",
    "Calibrating official 120-minute CBT countdown timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing exam workspace!",
  ],
  waec: [
    "Connecting to Jemer High-Speed WASSCE Question Engine...",
    "Shuffling questions across selected subject combinations...",
    "Calibrating official WASSCE countdown timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing exam workspace!",
  ],
  practice: [
    "Connecting to Jemer Practice Engine...",
    "Loading custom practice parameters...",
    "Calibrating practice session timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing exam workspace!",
  ],
  study: [
    "Initializing Study Room Engine...",
    "Pre-loading AI explanation modules...",
    "Calibrating active learning session timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing study workspace!",
  ],
  hunter: [
    "Parsing custom AI prompt...",
    "Scanning global exam databases (SAT, IGCSE, etc.)...",
    "Calibrating dynamic session timer...",
    "Synthesizing custom question matrix...",
    "Finalizing interface... Preparing custom hunt!",
  ]
};

const MOTIVATIONAL_QUOTES = [
  "“Success is where preparation and opportunity meet.”",
  "“You have practiced, you are prepared. Stay calm and focused!”",
  "“Trust your instincts and read every question stem carefully.”",
  "“Speed and accuracy win the game. You’ve got this!”",
];

export default function ExamLoadingSpinner({ mode = "jamb", config, onComplete }) {
  const isWaecMode = mode === "waec";
  const isPracticeMode = mode === "practice";
  const isStudyMode = mode === "study";
  const isHunterMode = mode === "hunter";

  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [apiError, setApiError] = useState("");

  // Refs to control the smart progress bar logic
  const hasFetched = useRef(false);
  const apiDataRef = useRef(null);

  const activeQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  }, []);

  const activeStatusSteps = isHunterMode 
    ? STATUS_STEPS.hunter
    : isStudyMode 
      ? STATUS_STEPS.study
      : isPracticeMode 
        ? STATUS_STEPS.practice 
        : isWaecMode 
          ? STATUS_STEPS.waec 
          : STATUS_STEPS.jamb;

  const themeStyles = useMemo(() => {
    if (isHunterMode) {
      return { ringBg: "bg-teal-500/10 dark:bg-teal-500/20", dottedRing: "border-teal-500/40", innerRing: "border-t-teal-500 border-r-cyan-400", textAccent: "text-teal-600 dark:text-teal-400", gradientBar: "from-teal-500 via-cyan-500 to-teal-400", borderAccent: "border-teal-500/20", bgAccent: "bg-teal-500/10" };
    }
    if (isStudyMode) {
      return { ringBg: "bg-purple-500/10 dark:bg-purple-500/20", dottedRing: "border-purple-500/40", innerRing: "border-t-purple-500 border-r-fuchsia-400", textAccent: "text-purple-600 dark:text-purple-400", gradientBar: "from-purple-500 via-fuchsia-500 to-purple-400", borderAccent: "border-purple-500/20", bgAccent: "bg-purple-500/10" };
    }
    if (isPracticeMode) {
      return { ringBg: "bg-orange-500/10 dark:bg-orange-500/20", dottedRing: "border-orange-500/40", innerRing: "border-t-orange-500 border-r-amber-400", textAccent: "text-orange-600 dark:text-orange-400", gradientBar: "from-orange-500 via-amber-500 to-orange-400", borderAccent: "border-orange-500/20", bgAccent: "bg-orange-500/10" };
    }
    if (isWaecMode) {
      return { ringBg: "bg-blue-500/10 dark:bg-blue-500/20", dottedRing: "border-blue-500/40", innerRing: "border-t-blue-500 border-r-indigo-400", textAccent: "text-blue-600 dark:text-blue-400", gradientBar: "from-blue-500 via-indigo-500 to-blue-400", borderAccent: "border-blue-500/20", bgAccent: "bg-blue-500/10" };
    }
    return { ringBg: "bg-emerald-500/10 dark:bg-emerald-500/20", dottedRing: "border-emerald-500/40", innerRing: "border-t-emerald-500 border-r-teal-400", textAccent: "text-emerald-600 dark:text-emerald-400", gradientBar: "from-emerald-500 via-teal-500 to-emerald-400", borderAccent: "border-emerald-500/20", bgAccent: "bg-emerald-500/10" };
  }, [isPracticeMode, isWaecMode, isStudyMode, isHunterMode]);

  // 🚀 LIVE API INTEGRATION
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generateExam = async () => {
      try {
        await fetchJwtOnDemand();
        const BACKEND_URL = getBackendUrl();
        
        // Assemble payload from customization screen
        const payload = {
          mode: config.mode || mode,
          year: config.year?.toString() || "random",
          durationMinutes: config.durationMinutes || 120,
          subjects: config.subjects || []
        };

        const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/examsimulator/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Failed to generate exam module.");

        const data = await res.json();
        apiDataRef.current = data; // Store silently, let the visual timer catch up

      } catch (err) {
        console.error("Exam Generation Error:", err);
        setApiError("Failed to connect to the global exam engine. Please try again.");
      }
    };

    generateExam();
  }, [config, mode]);

  // 🚀 SMART PROGRESS BAR LOGIC
  useEffect(() => {
    if (apiError) return; // Halt if an error occurs

    const interval = setInterval(() => {
      setProgress((prev) => {
        // If API data is ready, jump fast to 100%
        if (apiDataRef.current) {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete(apiDataRef.current);
            }, 300);
            return 100;
          }
          return prev + 5; // Fast forward
        }

        // If API is still fetching, pause at 90%
        if (prev >= 90) return 90;

        const nextProgress = prev + 1;
        if (nextProgress === 20) setStatusIndex(1);
        if (nextProgress === 45) setStatusIndex(2);
        if (nextProgress === 75) setStatusIndex(3);
        if (nextProgress === 88) setStatusIndex(4);

        return nextProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete, apiError]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center space-y-8 text-center animate-fade-in">
      
      {/* CENTRAL HUD RADAR ANIMATION */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full ${apiError ? "bg-rose-500/20" : `animate-ping ${themeStyles.ringBg}`}`} />
        <div className={`absolute inset-0 rounded-full border-2 border-dashed ${apiError ? "border-rose-500/40" : `animate-[spin_8s_linear_infinite] ${themeStyles.dottedRing}`}`} />
        <div className={`absolute inset-3 rounded-full border-2 border-b-transparent border-l-transparent ${apiError ? "border-rose-500 hidden" : `animate-[spin_3s_linear_infinite] ${themeStyles.innerRing}`}`} />

        <div className="relative w-32 h-32 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center z-10">
          <span className={`text-3xl font-display font-black font-mono ${apiError ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
            {apiError ? "ERR" : `${progress}%`}
          </span>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${apiError ? "text-rose-500" : themeStyles.textAccent}`}>
            {apiError ? "Halted" : "Pre-Check"}
          </span>
        </div>
      </div>

      {/* PROGRESS BAR & DYNAMIC STATUS TEXT */}
      <div className="w-full space-y-3 max-w-md">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/50 dark:border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-150 ease-out shadow-sm ${apiError ? "bg-rose-500" : `bg-gradient-to-r ${themeStyles.gradientBar}`}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="h-6 flex items-center justify-center">
          <p className={`text-xs sm:text-sm font-mono font-semibold ${apiError ? "text-rose-600 font-bold" : "text-slate-700 dark:text-slate-300 animate-pulse"}`}>
            {apiError ? apiError : activeStatusSteps[statusIndex]}
          </p>
        </div>
      </div>

      {/* EXAM SESSION PREVIEW BADGES & MOTIVATIONAL WIDGET */}
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {config?.subjects?.map((sub) => (
            <span
              key={sub.id}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {sub.name} ({sub.count}Q)
            </span>
          ))}
          <span className={`px-3 py-1 rounded-xl border text-xs font-black font-mono ${apiError ? "bg-rose-100 border-rose-200 text-rose-700" : `${themeStyles.bgAccent} ${themeStyles.textAccent} ${themeStyles.borderAccent}`}`}>
            ⏱️ {config?.durationMinutes || 120} Mins
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-slate-300 shadow-md">
          <p className={`text-xs sm:text-sm font-medium italic ${apiError ? "text-rose-400" : themeStyles.textAccent.replace("text-", "text-").split(" ")[0]}`}>
            {apiError ? "Please refresh the page to attempt re-connecting to the global database." : activeQuote}
          </p>
        </div>
      </div>

    </div>
  );
}