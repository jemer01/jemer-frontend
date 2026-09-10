/**
 * [NEW UPGRADE]
 * SUMMARY: v1.2 Layout & Ultra-Rounded Cognitive Performance Header Overhaul.
 * 1. Layout Fix: Replaced absolute full-screen wrappers with a clean flex layout, preventing blank screen rendering glitches and card occlusion bugs.
 * 2. Ultra-Rounded Header: Redesigned the top header container into an ultra-rounded (`rounded-[2.5rem]`), floating glassmorphic card with rich shadows.
 * 3. Detailed Cards: Enhanced grid cards with detailed metadata, glowing tier badges, and smooth action modal integration.
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — PERFORMANCE HISTORY ARCHIVE (v1.2)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";

const getCognitiveTier = (percentage) => {
  if (percentage >= 90) return { tier: "S-Tier", color: "text-amber-500 bg-amber-500/10 border-amber-500/30 shadow-amber-500/20" };
  if (percentage >= 80) return { tier: "A-Tier", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20" };
  if (percentage >= 70) return { tier: "B-Tier", color: "text-blue-500 bg-blue-500/10 border-blue-500/30 shadow-blue-500/20" };
  if (percentage >= 60) return { tier: "C-Tier", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/20" };
  return { tier: "D-Tier", color: "text-rose-500 bg-rose-500/10 border-rose-500/30 shadow-rose-500/20" };
};

export default function BrainTrainingPerformanceHistory({ onBack, onReviewExam, onRetakeExam, isGenerating, generationStatus }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Interaction States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedActionSession, setSelectedActionSession] = useState(null);

  const getBackendUrl = () => {
    const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
    return process.env.NEXT_PUBLIC_API_URL ||
      (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
       activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
       "http://localhost:8080");
  };

  const getToken = () => localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchPerformanceHistory = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/brain-training/performance`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
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
      await fetch(`${getBackendUrl()}/api/v1/brain-training/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  };

  const handlePin = async (e, id, currentPinStatus) => {
    e.stopPropagation();
    setActiveMenuId(null);
    try {
      await fetch(`${getBackendUrl()}/api/v1/brain-training/history/${id}/pin`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ is_pinned: !currentPinStatus })
      });
      setHistory(prev => {
        const updated = prev.map(item => item.id === id ? { ...item, is_pinned: !currentPinStatus } : item);
        return updated.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.last_active) - new Date(a.last_active));
      });
    } catch (error) {
      console.error("Failed to pin record", error);
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
      await fetch(`${getBackendUrl()}/api/v1/brain-training/history/${id}/rename`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ title: editTitle.trim() })
      });
      setHistory(prev => prev.map(item => item.id === id ? { ...item, title: editTitle.trim() } : item));
    } catch (error) {
      console.error("Failed to rename record", error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isGenerating) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-rose-100 dark:border-rose-900/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-rose-500">
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
    <div className="w-full min-h-full flex flex-col space-y-8 animate-fade-in pb-16" onClick={() => setActiveMenuId(null)}>
      
      {/* ── ULTRA-ROUNDED FLOATING HEADER CONTAINER ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="rounded-[2.5rem] p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
          {/* Ambient glow inside header */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-5 relative z-10">
            <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-md border border-slate-200 dark:border-slate-700 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                Cognitive Performance Archive
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Review detailed analytics or retake fully completed neural training sessions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID ARCHIVE ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="h-56 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700" 
              />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No Completed Archives</h3>
            <p className="text-sm font-medium">You haven't completed any Brain Training exams yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((session) => {
              const tierInfo = getCognitiveTier(session.progress || 0);

              return (
                <div 
                  key={session.id}
                  onClick={() => { if (editingId !== session.id) setSelectedActionSession(session); }}
                  className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-md hover:shadow-2xl hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative flex flex-col h-[230px]"
                >
                  
                  {/* 3-Dot Absolute Menu Trigger */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === session.id ? null : session.id); }}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all z-20 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === session.id && (
                    <div className="absolute top-16 right-5 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden w-36 animate-fade-in text-xs font-bold">
                      <button onClick={(e) => handlePin(e, session.id, session.is_pinned)} className="px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <i className={`fas fa-thumbtack ${session.is_pinned ? 'text-rose-500' : ''}`}></i> {session.is_pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button onClick={(e) => startRename(e, session.id, session.title)} className="px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50">
                        <i className="fas fa-edit"></i> Rename
                      </button>
                      <button onClick={(e) => handleDelete(e, session.id)} className="px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50">
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3 pr-8">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${tierInfo.color}`}>
                      {tierInfo.tier}
                    </span>
                  </div>

                  {/* Inline Edit State */}
                  {editingId === session.id ? (
                    <div className="flex items-center gap-2 mb-2 z-10 relative">
                      <input 
                        type="text" 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveRename(e, session.id); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-rose-400 dark:border-rose-600 rounded-xl text-sm font-bold text-slate-900 dark:text-white px-3 py-1.5 outline-none shadow-inner"
                      />
                      <button onClick={(e) => saveRename(e, session.id)} className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:scale-105 transition-transform"><i className="fas fa-check"></i></button>
                    </div>
                  ) : (
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors pr-2">
                      {session.is_pinned && <i className="fas fa-thumbtack text-rose-500 text-xs mr-2 transform -rotate-45"></i>}
                      {session.title || session.topic}
                    </h3>
                  )}
                  
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                    Completed {formatTime(session.last_active)}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Final Score</span>
                      <span className="text-base font-black text-slate-900 dark:text-white leading-none mt-1">{session.progress || 0}%</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-rose-500/30 transition-all duration-300 text-slate-400">
                      <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🚀 RETAKE VS REVIEW UX MODAL */}
      {selectedActionSession && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setSelectedActionSession(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-rose-500/30 relative z-10">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 relative z-10">
              {selectedActionSession.title || selectedActionSession.topic}
            </h3>
            
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 relative z-10">
              Final Score: <span className="font-black text-rose-500 text-lg">{selectedActionSession.progress || 0}%</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full relative z-10">
              <button 
                onClick={() => {
                  onReviewExam(selectedActionSession);
                  setSelectedActionSession(null);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider transition-colors focus:outline-none flex items-center justify-center gap-2"
              >
                <i className="fas fa-chart-pie"></i> Review Results
              </button>
              <button 
                onClick={() => {
                  if (onRetakeExam) onRetakeExam(selectedActionSession);
                  setSelectedActionSession(null);
                }}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-md shadow-rose-500/20 transition-all active:scale-95 focus:outline-none flex items-center justify-center gap-2"
              >
                <i className="fas fa-redo-alt"></i> Retake Exam
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}