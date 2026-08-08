/**
 * [NEW UPGRADE]
 * SUMMARY: v2.0 Audiobooks History Archive & Pro CRUD Manager.
 * 1. API Integration: Automatically fetches user audio history from the Neon DB via the Go backend.
 * 2. Interaction Menu: Added an absolute-positioned 3-dot dropdown to Pin, Rename, and Delete records.
 * 3. Inline Renaming: Supports updating the audiobook title directly from the card without modals.
 * 4. Selection Routing: Triggers `onSelectHistory` to load the specific audiobook results in `page.js`.
 * 5. Premium Scrollbar: Included custom WebKit scrollbars matching the audio module aesthetic.
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS HISTORY (v2.0)
 * ================================================================================================
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
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 absolute inset-0 z-20" onClick={() => setActiveMenuId(null)}>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="font-display font-black text-slate-900 dark:text-white text-xl tracking-tight leading-none">Audio Library</h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Your Saved Transcripts & Notes</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 overflow-y-auto p-6 audio-premium-scroll">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-slate-400">
            <i className="fas fa-spinner fa-spin text-2xl mr-3"></i> Loading library...
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-slate-400">
            <i className="fas fa-book-audio text-4xl mb-3 opacity-50"></i>
            <p className="text-sm font-medium">No audiobooks found in your library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { if (editingId !== item.id) onSelectHistory(item); }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer relative group flex flex-col h-32"
              >
                {/* 3-Dot Absolute Menu Trigger */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === item.id ? null : item.id); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>

                {/* Dropdown Menu */}
                {activeMenuId === item.id && (
                  <div className="absolute top-10 right-3 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl flex flex-col overflow-hidden w-32 animate-fade-in text-xs font-medium">
                    <button onClick={(e) => handlePin(e, item.id, item.is_pinned)} className="px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <i className={`fas fa-thumbtack ${item.is_pinned ? 'text-indigo-500' : ''}`}></i> {item.is_pinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button onClick={(e) => startRename(e, item.id, item.title)} className="px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50">
                      <i className="fas fa-edit"></i> Rename
                    </button>
                    <button onClick={(e) => handleDelete(e, item.id)} className="px-3 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50">
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                )}

                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <i className="fas fa-headphones-alt"></i>
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    {/* Inline Edit State */}
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveRename(e, item.id); }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-indigo-300 dark:border-indigo-600 rounded text-sm font-bold text-slate-900 dark:text-white px-2 py-1 outline-none"
                        />
                        <button onClick={(e) => saveRename(e, item.id)} className="text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"><i className="fas fa-check"></i></button>
                      </div>
                    ) : (
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.is_pinned && <i className="fas fa-thumbtack text-indigo-500 text-[10px] mr-1.5 transform -rotate-45"></i>}
                        {item.title}
                      </h3>
                    )}
                    <p className="text-[10px] font-mono text-slate-400 mt-1">{formatTime(item.created_at)}</p>
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
