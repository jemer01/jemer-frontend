"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v2.0 - LIVE DATABASE INTEGRATION)
 * ================================================================================================
 * 1. REAL DATA HYDRATION: Replaced `MOCK_HISTORY_RECORDS` with a live `jemerAuthenticatedFetch` call to `GET /api/v1/examsimulator/history`.
 * 2. DYNAMIC GLOBAL STATS: The "Total Exams" and "Avg Score" header now calculates live aggregates natively based on the returned database rows.
 * 3. METRICS NORMALIZATION: Smoothly transforms raw database timestamps and scores into localized dates, readable durations, and mode-specific score layouts (e.g., /400 for JAMB vs percentages).
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";

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

export default function PerformanceHistoryWidget({ onSelectRecord }) {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        await fetchJwtOnDemand();
        const res = await jemerAuthenticatedFetch(`${getBackendUrl()}/api/v1/examsimulator/history`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setHistoryRecords(data || []);
        }
      } catch (e) {
        console.error("Failed to load performance history:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, []);

  const getModeStyles = (mode) => {
    switch (mode) {
      case "jamb": return { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800/50", label: "JAMB CBT" };
      case "waec": return { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800/50", label: "WASSCE" };
      case "practice": return { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800/50", label: "Practice" };
      case "study": return { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800/50", label: "Study Room" };
      case "hunter": return { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800/50", label: "AI Hunt" };
      default: return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700", label: "Exam" };
    }
  };

  const formattedRecords = historyRecords.map(rec => {
    const dateObj = new Date(rec.created_at);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const hrs = Math.floor(rec.time_taken_seconds / 3600);
    const mins = Math.floor((rec.time_taken_seconds % 3600) / 60);
    const secs = rec.time_taken_seconds % 60;
    let timeStr = "";
    if (hrs > 0) timeStr += `${hrs}h `;
    if (mins > 0 || hrs > 0) timeStr += `${mins}m `;
    timeStr += `${secs}s`;

    let title = "Exam Simulation";
    if (rec.exam_type === "hunter") title = "Questions Hunter";
    if (rec.exam_type === "study") title = "Active Learning Room";
    if (rec.exam_type === "practice") title = "Speed Practice Drill";
    if (rec.exam_type === "waec") title = "WASSCE Mock Exam";
    if (rec.exam_type === "jamb") title = "JAMB UTME Simulation";

    const percent = rec.total_questions > 0 ? Math.round((rec.score / rec.total_questions) * 100) : 0;
    let scoreText = `${percent}%`;
    if (rec.exam_type === "jamb") {
       scoreText = `${Math.round((rec.score / rec.total_questions) * 400)} / 400`;
    }

    const subjectsArr = (rec.subjects_list || "english").split(",").map(id => ({ 
      id, 
      name: id.charAt(0).toUpperCase() + id.slice(1), 
      count: Math.floor(rec.total_questions / (rec.subjects_list.split(",").length || 1)) 
    }));

    return {
      id: rec.id,
      mode: rec.exam_type,
      date: dateStr,
      title,
      scoreText,
      timeUsed: timeStr,
      percent,
      config: {
        durationMinutes: 120, 
        subjects: subjectsArr
      }
    };
  });

  const totalExams = formattedRecords.length;
  const avgScore = totalExams > 0 
    ? Math.round(formattedRecords.reduce((acc, curr) => acc + curr.percent, 0) / totalExams) 
    : 0;

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin mb-4"></div>
        <span className="text-sm font-bold text-slate-500">Loading Historical Archives...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* HEADER: Global Statistics Dashboard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
        
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Performance History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Track your progression across all JAMB, WAEC, and AI-generated exams.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{totalExams}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Exams</span>
          </div>
          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{avgScore}%</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg Score</span>
          </div>
        </div>
      </div>

      {/* BODY: Vertical Historical Records List */}
      {formattedRecords.length === 0 ? (
        <div className="w-full p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Records Found</h3>
          <p className="text-xs text-slate-500">You haven't completed any exam simulations yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 pl-2">
            Recent Sessions
          </h3>
          
          <div className="flex flex-col gap-3">
            {formattedRecords.map((record) => {
              const styles = getModeStyles(record.mode);
              const subjectNames = record.config.subjects.map(s => s.name).join(", ");
              const totalQs = record.config.subjects.reduce((acc, s) => acc + s.count, 0);

              return (
                <div 
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-colors" />

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${styles.bg} ${styles.text} ${styles.border}`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${styles.bg} ${styles.text}`}>
                          {styles.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {record.date}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {record.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="hidden md:flex flex-col text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                        {subjectNames}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {totalQs} Questions • {record.timeUsed}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Score</span>
                        <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white">
                          {record.scoreText}
                        </span>
                      </div>
                      
                      <button className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 dark:bg-slate-800 dark:group-hover:bg-indigo-900/40 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}