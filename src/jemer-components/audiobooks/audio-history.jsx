/**
[NEW]
SUMMARY: Mobile UI/UX & Layout Fixes
1. Fullscreen Layout: Replaced conflicting 'absolute h-full relative' with 'fixed inset-0 h-[100dvh] z-[100]' and a solid background to completely cover any parent footers and fix the "cut out / small space" issue on mobile.
2. Dropdown Fix: Removed 'overflow-hidden' from the card container so the 3-dot menu dropdown is fully visible and no longer clipped. (Moved 'overflow-hidden' strictly to an inner wrapper for the decorative blur).
3. Touch Target & Clickability: Increased the 3-dot button touch target area on mobile, added 'e.preventDefault()', and increased the z-index of the dropdown to ensure taps register accurately on mobile devices.
================================================================================================
📚 JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS HISTORY (v6.2)
================================================================================================
*/
"use client";
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
    return process.env.NEXT_PUBLIC_API_URL ||
      (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
      activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
      "http://localhost:8080");
  };

  const getToken = () => localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/audiobooks/history`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });

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
      await fetch(`${getBackendUrl()}/api/v1/audiobooks/history/${id}`, {
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
      await fetch(`${getBackendUrl()}/api/v1/audiobooks/history/${id}/pin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ is_pinned: !currentPinStatus })
      });
      setHistory(prev => {
        const updated = prev.map(item => item.id === id ? { ...item, is_pinned: !currentPinStatus } : item);
        return updated.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.created_at) - new Date(a.created_at));
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
      await fetch(`${getBackendUrl()}/api/v1/audiobooks/history/${id}/rename`, {
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 fixed inset-0 z-[100] overflow-hidden" onClick={() => setActiveMenuId(null)}>
      {/* 🚀 CSS INJECTION for Dropdown Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }
      `}} />

      {/* 🚀 PREMIUM FLOATING PILL HEADER */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 sm:gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-700/60 rounded-[2.5rem] pl-6 pr-3 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-max max-w-[90vw] animate-fade-in">
        <div className="flex flex-col">
          <h2 className="font-display font-black text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-none">Audio Library</h2>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> Your Saved Archives
          </p>
        </div>
        
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
        
        <button onClick={onBack} className="w-10 h-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Grid Layout (Padding Top Accounts for Floating Header) */}
      <div className="flex-1 overflow-y-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8 audio-premium-scroll relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold uppercase tracking-widest">Loading library...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h6"/></svg>
            </div>
            <p className="text-base font-bold text-slate-600 dark:text-slate-300">No audiobooks found</p>
            <p className="text-xs mt-2 text-slate-500 text-center max-w-xs">Your recorded and analyzed audio sessions will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { if (editingId !== item.id) onSelectHistory(item); }}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative group flex flex-col h-44"
              >
                {/* Decorative Blur Background Element - Isolated in overflow-hidden */}
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors"></div>
                </div>

                {/* Top Row: Icon & 3-Dot Menu */}
                <div className="flex justify-between items-start mb-4 relative z-20">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
                  </div>
                  
                  {/* 3-Dot Absolute Menu Trigger */}
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      setActiveMenuId(activeMenuId === item.id ? null : item.id); 
                    }}
                    className="w-12 h-12 -mr-3 -mt-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-none relative z-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>

                  {/* Smooth Dropdown Menu */}
                  {activeMenuId === item.id && (
                    <div className="absolute top-10 right-0 z-[60] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl flex flex-col overflow-hidden w-40 animate-scale-in origin-top-right text-xs font-bold text-slate-700 dark:text-slate-200">
                      <button onClick={(e) => handlePin(e, item.id, item.is_pinned)} className="px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors">
                        {item.is_pinned ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                        )}
                        {item.is_pinned ? 'Unpin Note' : 'Pin Note'}
                      </button>
                      <button onClick={(e) => startRename(e, item.id, item.title)} className="px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> 
                        Rename File
                      </button>
                      <button onClick={(e) => handleDelete(e, item.id)} className="px-4 py-3.5 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-3 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg> 
                        Delete Note
                      </button>
                    </div>
                  )}
                </div>

                {/* Middle Row: Content & Title */}
                <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-end">
                  {/* Native Inline Edit State */}
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2 mb-1">
                      <input 
                        type="text" 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveRename(e, item.id); }}
                        className="w-full bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white px-3 py-1.5 outline-none shadow-[0_0_10px_rgba(99,102,241,0.2)] relative z-20"
                      />
                      <button onClick={(e) => saveRename(e, item.id)} className="w-8 h-8 shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md relative z-20">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate flex items-center gap-2 mb-1">
                      {item.is_pinned && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 transform -rotate-45 shrink-0"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                      )}
                      <span className="truncate">{item.title}</span>
                    </h3>
                  )}
                  
                  {/* Bottom Info Row */}
                  <div className="flex items-center justify-between w-full mt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <p className="text-[11px] font-bold tracking-wide">{formatTime(item.created_at)}</p>
                    </div>
                    {/* Simulated Mini Waveform */}
                    <div className="flex items-end gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="w-[3px] h-2 bg-indigo-400 rounded-full"></div>
                      <div className="w-[3px] h-3.5 bg-indigo-500 rounded-full"></div>
                      <div className="w-[3px] h-2 bg-indigo-400 rounded-full"></div>
                      <div className="w-[3px] h-1.5 bg-indigo-300 rounded-full"></div>
                    </div>
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