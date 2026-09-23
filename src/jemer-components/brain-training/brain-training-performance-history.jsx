"use client";

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — PERFORMANCE HISTORY ARCHIVE (v2.3.0)
 * ================================================================================================
 * [NEW UPGRADE — v2.3.0]
 * SUMMARY: 100% Bulletproof Viewport Modal Portal
 * 1. ESCAPED PARENT CLIPPING: The parent component has a rigid `h-[100dvh] overflow-hidden` wrapper which was brutally clipping the modal at the top boundary on certain devices. 
 * 2. CREATEPORTAL INJECTION: Wrapped the action modal in `createPortal(..., document.body)`. It now bypasses all nested CSS and mounts directly to the root browser window.
 * 3. STRICT VIEWPORT CENTERING: Added `max-h-[90vh] overflow-y-auto` to the modal content box. Even if the screen is tiny, the modal will perfectly center and allow internal scrolling, never again cutting off the top edge.
 * ================================================================================================
 * [PREVIOUS UPGRADE — v2.2.0]
 * SUMMARY: Modal Layout Fix & Reference Alignment
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function BrainTrainingPerformanceHistory({
  onBack,
  onReviewExam,
  onRetakeExam,
  isGenerating,
  generationStatus,
}) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Interaction States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedActionSession, setSelectedActionSession] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBackendUrl = () => {
    const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      (activeOrigin.includes("jemerplatforms.company")
        ? "https://academy.jemerplatforms.company"
        : activeOrigin.includes("cloudshell.dev")
        ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev"
        : "http://localhost:8080")
    );
  };

  const waitForJemerAuthReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
    const isReady = () =>
      typeof window !== "undefined" &&
      window.JemerAuth &&
      typeof window.JemerAuth.authenticatedFetch === "function";
    if (isReady()) return true;
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      if (isReady()) return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchPerformanceHistory = async () => {
      try {
        await waitForJemerAuthReady();
        const res = await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/brain-training/performance`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data || []);
        }
      } catch (err) {
        console.error("Failed to load performance history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformanceHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setActiveMenuId(null);
    try {
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/brain-training/history/${id}`, {
        method: "DELETE",
      });
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const handlePin = async (e, id, currentPinStatus) => {
    e.stopPropagation();
    setActiveMenuId(null);
    try {
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/brain-training/history/${id}/pin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_pinned: !currentPinStatus }),
      });
      setHistory((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, is_pinned: !currentPinStatus } : item
        );
        return updated.sort(
          (a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.last_active) - new Date(a.last_active)
        );
      });
    } catch (error) {
      console.error("Failed to pin record:", error);
    }
  };

  const startRename = (e, id, currentTitle) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = async (e, id) => {
    e.stopPropagation();
    setEditingId(null);
    if (!editTitle.trim()) return;

    try {
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/brain-training/history/${id}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      setHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title: editTitle.trim() } : item))
      );
    } catch (error) {
      console.error("Failed to rename record:", error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (isGenerating) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center animate-fade-in select-none">
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-600">
            <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-center px-4">
          {generationStatus || "Loading Archives..."}
        </h2>
      </div>
    );
  }

  return (
    <div
      className="w-full h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 fixed inset-0 z-[100] overflow-hidden select-none"
      onClick={() => setActiveMenuId(null)}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }
        .brain-perf-scroll::-webkit-scrollbar { width: 6px; }
        .brain-perf-scroll::-webkit-scrollbar-track { background: transparent; }
        .brain-perf-scroll::-webkit-scrollbar-thumb { background-color: rgba(37, 99, 235, 0.3); border-radius: 10px; }
      `,
        }}
      />

      {/* 🚀 FIXED: Mobile-Responsive Fluid Pill Header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-3 sm:gap-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-700/80 rounded-full pl-4 sm:pl-6 pr-2.5 sm:pr-3 py-2.5 sm:py-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] w-[calc(100%-1.5rem)] sm:w-full sm:max-w-xl mx-auto min-w-0 animate-fade-in">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-900/40 shadow-xs">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-slate-900 dark:text-white text-sm sm:text-lg tracking-tight leading-none truncate">
                Performance Archive
              </h2>
              {!isLoading && history.length > 0 && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold">
                  {history.length}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">Verified Neural Calibrations</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-px h-6 sm:h-7 bg-slate-200 dark:bg-slate-700"></div>
          <button
            onClick={onBack}
            className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
            title="Return to Hub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── GRID ARCHIVE CONTAINER ── */}
      <div className="flex-1 overflow-y-auto pt-24 pb-14 px-3 sm:px-6 lg:px-8 brain-perf-scroll relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-44 sm:h-52 rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700"
              />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-20 text-slate-400">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 shadow-inner">
              <svg className="w-10 h-10 opacity-50 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Completed Archives</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              You haven't completed any Brain Training exams yet. Complete an active session to generate diagnostics.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 max-w-7xl mx-auto">
            {history.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  if (editingId !== session.id) setSelectedActionSession(session);
                }}
                className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-1 cursor-pointer relative flex flex-col justify-between h-48"
              >
                {/* 3-Dot Absolute Menu Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === session.id ? null : session.id);
                  }}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all z-20 shadow-xs cursor-pointer"
                  title="Actions"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {activeMenuId === session.id && (
                  <div className="absolute top-14 right-5 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden w-36 animate-fade-in text-xs font-bold text-slate-700 dark:text-slate-200">
                    <button
                      onClick={(e) => handlePin(e, session.id, session.is_pinned)}
                      className="px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 cursor-pointer"
                    >
                      <svg className={`w-3.5 h-3.5 ${session.is_pinned ? "text-blue-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <line x1="12" y1="17" x2="12" y2="22" />
                        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                      </svg>
                      {session.is_pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      onClick={(e) => startRename(e, session.id, session.title)}
                      className="px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      Rename
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      className="px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3 pr-8">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200/70 dark:border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {session.total_questions || 0} Questions
                  </span>
                </div>

                {/* Inline Rename Engine */}
                {editingId === session.id ? (
                  <div className="flex items-center gap-2 mb-2 z-10 relative">
                    <input
                      type="text"
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename(e, session.id);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-blue-400 dark:border-blue-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white px-3 py-1.5 outline-none shadow-xs"
                    />
                    <button
                      onClick={(e) => saveRename(e, session.id)}
                      className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-2 leading-snug">
                    {session.is_pinned && <span className="text-blue-500 text-xs mr-1.5 font-bold">📌</span>}
                    {session.title || session.topic}
                  </h3>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Completed</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-none mt-1 truncate">
                      {formatTime(session.last_active)}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/25 transition-all duration-200 text-slate-400">
                    <svg className="w-3.5 h-3.5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚀 RETAKE VS REVIEW UX MODAL (Portal & Viewport-Safe Centering) */}
      {selectedActionSession && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setSelectedActionSession(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.75rem] sm:rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-y-auto max-h-[90vh] my-auto" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30 relative z-10 shrink-0">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 relative z-10">
              {selectedActionSession.title || selectedActionSession.topic}
            </h3>
            
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 relative z-10 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {selectedActionSession.total_questions || 0} Questions
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span>{formatTime(selectedActionSession.last_active)}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full relative z-10">
              <button 
                onClick={() => {
                  onReviewExam(selectedActionSession);
                  setSelectedActionSession(null);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider transition-colors focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
                Review Results
              </button>
              <button 
                onClick={() => {
                  if (onRetakeExam) onRetakeExam(selectedActionSession);
                  setSelectedActionSession(null);
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all active:scale-95 focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Retake Exam
              </button>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}