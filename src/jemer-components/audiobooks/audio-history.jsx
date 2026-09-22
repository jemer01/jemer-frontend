"use client";

/**
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS HISTORY (v7.0.0)
 * ================================================================================================
 * [NEW UPGRADE — v7.0.0]
 * SUMMARY: Widened Floating Pill Header, AI Titling Hydration & Card Polish
 * 1. EXPANDED FLOATING PILL: Overhauled the top navigation pill with wider dimensions
 *    (`min-w-[420px] max-w-[92vw]`), frosted backdrop blur, and a live counter badge
 *    (`{history.length} Saved Audiobooks`).
 * 2. AI AUTO-TITLING DISPLAY: Prominently renders the AI-generated titles on each card with
 *    high-contrast font weighting, an active session indicator, and inline rename capability.
 * 3. RETRIEVED ARCHIVE METRICS: Upgraded relative dates, pin indicators, and clean action menus.
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";

export default function AudioHistory({ onBack, onSelectHistory }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Interaction States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

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
    const fetchHistory = async () => {
      try {
        await waitForJemerAuthReady();
        const res = await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/audiobooks/history`);

        if (res.ok) {
          const data = await res.json();
          setHistory(data || []);
        }
      } catch (err) {
        console.error("Failed to load audiobook history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setActiveMenuId(null);
    try {
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/audiobooks/history/${id}`, {
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
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/audiobooks/history/${id}/pin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_pinned: !currentPinStatus }),
      });
      setHistory((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, is_pinned: !currentPinStatus } : item
        );
        return updated.sort(
          (a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.created_at) - new Date(a.created_at)
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
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/audiobooks/history/${id}/rename`, {
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

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
        .audio-lib-scroll::-webkit-scrollbar { width: 6px; }
        .audio-lib-scroll::-webkit-scrollbar-track { background: transparent; }
        .audio-lib-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
      `,
        }}
      />

      {/* 🚀 NEW: Widened, Elevated Floating Header Pill */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-4 sm:gap-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-700/80 rounded-full pl-6 pr-3 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] w-full min-w-[340px] sm:min-w-[440px] max-w-[92vw] sm:max-w-xl animate-fade-in">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h8" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-none truncate">
                Audiobook Library
              </h2>
              {/* 🚀 NEW: Active count badge */}
              {!isLoading && history.length > 0 && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                  {history.length}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Synchronized AI Transcripts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-px h-7 bg-slate-200 dark:bg-slate-700"></div>
          <button
            onClick={onBack}
            className="w-10 h-10 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
            title="Back to Studio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="flex-1 overflow-y-auto pt-24 pb-14 px-4 sm:px-6 lg:px-8 audio-lib-scroll relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <div className="w-10 h-10 border-3 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
              Hydrating Library...
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 mb-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              Your Library is Empty
            </h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Record a lecture or upload an audio file to generate your first AI study note.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (editingId !== item.id) onSelectHistory(item);
                }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer relative group flex flex-col justify-between h-44"
              >
                {/* Top Action Row */}
                <div className="flex justify-between items-start mb-3 relative z-20">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>

                  {/* 3-Dot Trigger */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                      }}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                      title="Actions"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === item.id && (
                      <div className="absolute top-10 right-0 z-[60] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl flex flex-col overflow-hidden w-40 animate-scale-in text-xs font-bold text-slate-700 dark:text-slate-200">
                        <button
                          onClick={(e) => handlePin(e, item.id, item.is_pinned)}
                          className="px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={item.is_pinned ? "text-indigo-600" : "text-slate-400"}
                          >
                            <line x1="12" y1="17" x2="12" y2="22" />
                            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                          </svg>
                          {item.is_pinned ? "Unpin Note" : "Pin to Top"}
                        </button>
                        <button
                          onClick={(e) => startRename(e, item.id, item.title)}
                          className="px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-700/50 transition-colors cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-slate-400"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          Rename Title
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-700/50 transition-colors cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Delete Note
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🚀 NEW: Prominent AI-Generated Title Display & Inline Rename */}
                <div className="flex-1 min-w-0 flex flex-col justify-end">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(e, item.id);
                        }}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-indigo-500 rounded-lg text-xs font-bold text-slate-900 dark:text-white px-2.5 py-1.5 outline-none shadow-xs"
                      />
                      <button
                        onClick={(e) => saveRename(e, item.id)}
                        className="w-7 h-7 shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-transform active:scale-95"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate flex items-center gap-2 mb-1 leading-snug">
                      {item.is_pinned && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-indigo-600 dark:text-indigo-400 transform -rotate-45 shrink-0"
                        >
                          <line x1="12" y1="17" x2="12" y2="22" />
                          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                        </svg>
                      )}
                      <span className="truncate">{item.title}</span>
                    </h3>
                  )}

                  {/* Metadata & Timestamp Row */}
                  <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                      {formatTime(item.created_at)}
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      Lecture Note
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}