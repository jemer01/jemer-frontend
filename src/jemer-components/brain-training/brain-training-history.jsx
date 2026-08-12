// src/jemer-components/brain-training/brain-training-history.jsx
"use client";
/**
 * [NEW UPGRADE]
 * SUMMARY: v2.1 Partial Progress Visual Sync.
 * 1. Progress Bar Fix: Ensuring the Synapse Activation bar accurately scales by setting `Math.max(1, session.progress || 0)` so even partially completed exams (e.g., user hits "Save & Exit" halfway) render a visual progress fill. 
 * 2. State Clarity: Calculates partial completion states cleanly without requiring `isMastered` flag to be true.
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING HISTORY (v2.1)
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";

export default function BrainTrainingHistory({ onResume }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interaction States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const getBackendUrl = () => {
    const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
    return process.env.NEXT_PUBLIC_API_URL ||
      (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
       activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
       "http://localhost:8080");
  };

  const getToken = () => localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/brain-training/history`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter to only show active or partially completed sessions in the history rail (Completed goes to Performance Archive)
          const activeSessions = (data || []).filter(item => item.status !== 'completed');
          setHistory(activeSessions);
        }
      } catch (err) {
        console.error("Failed to load brain training history:", err);
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
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-rose-200 dark:bg-rose-900/40"></div>
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return null; // Hide cleanly if no active history exists
  }

  return (
    <div className="w-full space-y-6 relative" onMouseLeave={() => setActiveMenuId(null)}>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            {/* Brain SVG Icon */}
            <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18" />
            </svg>
            Active Training Modules
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Resume incomplete sessions. Completed exams are safely stored in your Performance Archive.
          </p>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Carousel */}
      <div className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory brain-premium-scroll pb-6 px-2">
        {history.map((session) => {
          // 🚀 FIXED: Robust progress rendering. Ensures that even 5% progress renders a visible bar cleanly without needing 100% mastery.
          const currentProgress = session.progress || 0;
          const displayStatus = currentProgress > 0 ? "In Progress" : session.status || "Pending";
          
          return (
            <div 
              key={session.id}
              onClick={() => { if (editingId !== session.id) onResume(session); }}
              className="group shrink-0 w-[280px] sm:w-[320px] snap-start p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 cursor-pointer flex flex-col relative min-h-[200px]"
            >
              
              {/* 3-Dot Absolute Menu Trigger */}
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === session.id ? null : session.id); }}
                className="absolute top-4 right-3 w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>

              {/* Dropdown Menu */}
              {activeMenuId === session.id && (
                <div className="absolute top-12 right-3 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl flex flex-col overflow-hidden w-32 animate-fade-in text-xs font-medium">
                  <button onClick={(e) => handlePin(e, session.id, session.is_pinned)} className="px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <i className={`fas fa-thumbtack ${session.is_pinned ? 'text-rose-500' : ''}`}></i> {session.is_pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button onClick={(e) => startRename(e, session.id, session.title)} className="px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50">
                    <i className="fas fa-edit"></i> Rename
                  </button>
                  <button onClick={(e) => handleDelete(e, session.id)} className="px-3 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50">
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  {displayStatus}
                </span>
              </div>

              {/* Inline Edit State */}
              {editingId === session.id ? (
                <div className="flex items-center gap-2 mb-1 z-10 relative">
                  <input 
                    type="text" 
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveRename(e, session.id); }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-rose-300 dark:border-rose-600 rounded text-sm font-bold text-slate-900 dark:text-white px-2 py-1 outline-none"
                  />
                  <button onClick={(e) => saveRename(e, session.id)} className="text-rose-600 dark:text-rose-400 hover:scale-110 transition-transform"><i className="fas fa-check"></i></button>
                </div>
              ) : (
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors pr-8">
                  {session.is_pinned && <i className="fas fa-thumbtack text-rose-500 text-[10px] mr-1.5 transform -rotate-45"></i>}
                  {session.title || session.topic}
                </h3>
              )}
              
              <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-6">
                {session.total_questions} Questions • Last active {formatTime(session.last_active)}
              </p>

              <div className="mt-auto space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-4 relative z-0">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Synapse Activation</span>
                  <span className="text-rose-500">{currentProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 bg-rose-500" 
                    style={{ width: `${Math.max(2, currentProgress)}%` }} // Forces minimum 2% width so the bar is visibly rendered when slightly active
                  />
                </div>
              </div>

              {/* Hover Play/Resume Button Overlay Effect */}
              <div className="absolute inset-0 bg-white/0 dark:bg-slate-900/0 group-hover:bg-white/40 dark:group-hover:bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl flex items-center justify-center z-10 pointer-events-none">
                <button className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300 pointer-events-auto">
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
