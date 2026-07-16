/**
 * [NEW UPGRADE]
 * SUMMARY: Added interactive context menu (long-press on mobile, 3-dot button on desktop)
 *          with working Pin, Rename, and Delete functions. Includes a glassmorphic
 *          dropdown menu, centered rename modal, and delete confirmation modal. Fixed
 *          header spacing by adding top margin so the Audio Archives container no
 *          longer sits flush against the navbar. All existing card styling, grid
 *          layout, and navigation are preserved untouched.
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — AUDIO HISTORY ENGINE (v1.1)
 * ================================================================================================
 */

"use client";

import React, { useState, useRef, useEffect } from "react";

export default function AudioHistory({ onBack }) {
  // ── STATE ──
  const [logs, setLogs] = useState([
    { id: 1, title: "Advanced Quantum Mechanics Lecture", date: "Today", duration: "45:20", pinned: false },
    { id: 2, title: "Philosophy 101 - Ethics", date: "Yesterday", duration: "1:12:05", pinned: false },
    { id: 3, title: "Biology Cellular Structures", date: "Oct 24", duration: "22:15", pinned: false },
    { id: 4, title: "Voice Memo - Math Formulas", date: "Oct 22", duration: "05:30", pinned: false },
    { id: 5, title: "Economics Market Trends", date: "Oct 18", duration: "50:00", pinned: false },
  ]);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const longPressTimer = useRef(null);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renamingId, setRenamingId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ── SORT: Pinned first, then newest ──
  const sortedLogs = [...logs].sort((a, b) => {
    if (a.pinned === b.pinned) return b.id - a.id;
    return a.pinned ? -1 : 1;
  });

  // ── CLICK OUTSIDE TO CLOSE MENU ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeMenuId]);

  // ── LONG PRESS HANDLERS (Mobile) ──
  const handleTouchStart = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    longPressTimer.current = setTimeout(() => {
      setMenuPosition({ 
        top: rect.top + 48, 
        left: Math.min(rect.left + rect.width - 180, window.innerWidth - 200) 
      });
      setActiveMenuId(id);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // ── 3-DOT MENU HANDLER (Desktop) ──
  const openMenu = (e, id) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    setMenuPosition({ 
      top: rect.bottom + 8, 
      left: Math.min(rect.left - 140, window.innerWidth - 200) 
    });
    setActiveMenuId(id);
  };

  // ── ACTIONS ──
  const togglePin = () => {
    setLogs(prev => prev.map(log => log.id === activeMenuId ? { ...log, pinned: !log.pinned } : log));
    setActiveMenuId(null);
  };

  const openRename = () => {
    const log = logs.find(l => l.id === activeMenuId);
    if (log) {
      setRenameValue(log.title);
      setRenamingId(activeMenuId);
      setRenameModalOpen(true);
    }
    setActiveMenuId(null);
  };

  const confirmRename = () => {
    if (renamingId && renameValue.trim()) {
      setLogs(prev => prev.map(log => log.id === renamingId ? { ...log, title: renameValue.trim() } : log));
    }
    setRenameModalOpen(false);
    setRenamingId(null);
    setRenameValue("");
  };

  const openDelete = () => {
    setDeletingId(activeMenuId);
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setLogs(prev => prev.filter(log => log.id !== deletingId));
    }
    setDeleteModalOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in p-4 sm:p-0 max-w-5xl mx-auto min-h-[calc(100vh-80px)] mt-6 sm:mt-8">
      
      {/* ── HEADER ── */}
      <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
            title="Back to Record"
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
          </button>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-xl">Audio Archives</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Past Transcriptions & Notes</p>
          </div>
      </div>

      {/* ── HISTORY GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {sortedLogs.map((log) => (
          <div 
            key={log.id} 
            onTouchStart={(e) => handleTouchStart(e, log.id)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd}
            onContextMenu={(e) => e.preventDefault()}
            className="group bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer active:scale-[0.98] flex flex-col justify-between h-48 select-none relative"
          >
            {/* Pinned Indicator */}
            {log.pinned && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22"/><path d="M5 9h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z"/><path d="M12 2v7"/>
                </svg>
              </div>
            )}

            {/* Top Row: Icon, Date & Menu */}
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headphones">
                  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  {log.date}
                </span>
                <button 
                  onClick={(e) => openMenu(e, log.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-90"
                  title="Actions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Row: Title & Duration */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {log.title}
              </h4>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{log.duration}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State Fallback */}
        {sortedLogs.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open mb-4 opacity-50">
              <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
            </svg>
            <p className="text-sm font-medium">No audio archives found.</p>
          </div>
        )}
      </div>

      {/* ── CONTEXT MENU (Glassmorphic Dropdown) ── */}
      {activeMenuId && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
          <div 
            ref={menuRef}
            className="fixed z-50 w-44 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <button onClick={togglePin} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="17" x2="12" y2="22"/><path d="M5 9h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z"/><path d="M12 2v7"/>
              </svg>
              {logs.find(l => l.id === activeMenuId)?.pinned ? "Unpin" : "Pin"}
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-700 mx-3" />
            <button onClick={openRename} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Rename
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-700 mx-3" />
            <button onClick={openDelete} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Delete
            </button>
          </div>
        </>
      )}

      {/* ── RENAME MODAL ── */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setRenameModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-fade-in">
            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Rename Recording</h4>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-4">Enter a new title below</p>
            <input 
              type="text" 
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmRename()}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setRenameModalOpen(false)}
                className="py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRename}
                className="py-3 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-fade-in text-center">
            <div className="w-14 h-14 mx-auto bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Delete Recording?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="py-3 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-red-500/30 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}