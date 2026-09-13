/**
 * [NEW UPGRADE]
 * SUMMARY: v2.3 Centralized Auth Engine Migration
 * 1. All three backend calls (GET history, DELETE, PATCH /pin) hit our own Go backend
 *    (/api/v1/snap/history...) and now use window.JemerAuth.authenticatedFetch() instead of a
 *    raw fetch() with a hand-built Authorization header, so an expiring token is silently
 *    refreshed and an unexpected 401 gets retried once before giving up.
 * 2. Removed getToken() entirely — it read jemer_session_jwt with dead legacy-key fallbacks
 *    (access_token, token, never written anywhere) to hand-build an Authorization header. Now
 *    that all three calls go through authenticatedFetch, which sources and attaches the token
 *    internally, that helper had nothing left to do.
 * 3. Added a minimal window.JemerAuth readiness guard on the mount-time history fetch, since the
 *    engine loads via layout.js's afterInteractive <Script> and may not exist the instant this
 *    effect fires on mount.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: v2.2 Manifesto UI/UX Refactor (Touch Targets & Surface Depth)
 * 1. Eliminated Glassmorphism: Purged background blur filters from dropdown and button overlays, converting them to clean, solid opaque surface tokens (`bg-white dark:bg-slate-800`).
 * 2. Touch Target Enforcement: Expanded interactive touch clearances for the 3-dot history card menus to guarantee error-free mobile execution.
 * 3. Spatial Consistency: Aligned card dimensions, spacing, and scrollbars to the system's base-8 grid rules.
 * 4. API & State Preservation: 100% preservation of all live history endpoints (`GET`, `DELETE`, `PATCH /pin`), state hydration, and routing logic.
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — SNAP HISTORY (v2.3)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";

export default function SnapHistory({ onSelectHistory }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Dynamic Multi-Origin Resolver
  const getBackendUrl = () => {
    const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
    return process.env.NEXT_PUBLIC_API_URL ||
      (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
       activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
       "http://localhost:8080");
  };

  // 🆕 v2.3: Minimal readiness guard for the globally-loaded auth engine (window.JemerAuth,
  // injected once by layout.js via <Script strategy="afterInteractive">). That script loads
  // after first paint, so an effect firing on mount could technically run before it exists.
  const waitForJemerAuthReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
    const isReady = () => typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.authenticatedFetch === "function";
    if (isReady()) return true;
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      if (isReady()) return true;
    }
    return false;
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await waitForJemerAuthReady();
        const res = await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/snap/history`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data || []);
        }
      } catch (err) {
        console.error("Failed to load snap history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Delete Action
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent routing to results page
    setActiveMenuId(null);
    try {
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/snap/history/${id}`, {
        method: 'DELETE'
      });
      // Remove from UI instantly
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  };

  // Pin Action
  const handlePin = async (e, id, currentPinStatus) => {
    e.stopPropagation();
    setActiveMenuId(null);
    try {
      await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/snap/history/${id}/pin`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_pinned: !currentPinStatus })
      });
      
      // Update UI and re-sort so pinned items jump to front
      setHistory(prev => {
        const updated = prev.map(item => item.id === id ? { ...item, is_pinned: !currentPinStatus } : item);
        return updated.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.created_at) - new Date(a.created_at));
      });
    } catch (error) {
      console.error("Failed to pin record", error);
    }
  };

  // Format the title from the AI response
  const formatTitle = (text, mode) => {
    if (!text) return `Analyzed Image (${mode})`;
    const cleanText = text.replace(/[#*`]/g, '').trim();
    return cleanText.length > 30 ? cleanText.substring(0, 30) + '...' : cleanText;
  };

  // Format relative time (e.g. "2 hours ago")
  const formatTime = (dateString) => {
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
    return <div className="text-xs text-slate-500 animate-pulse px-2">Loading recent history...</div>;
  }

  if (history.length === 0) {
    return <div className="text-xs text-slate-500 italic px-2">No recent solutions found.</div>;
  }

  return (
    <div className="relative w-full" onMouseLeave={() => setActiveMenuId(null)}>
      <style jsx>{`
        .premium-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(37, 99, 235, 0.6);
        }
        .premium-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
        }
      `}</style>

      <div className="flex gap-4 overflow-x-auto premium-scrollbar py-2 px-1 snap-x snap-mandatory pb-4">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectHistory && onSelectHistory(item)}
            className="snap-start shrink-0 w-[140px] sm:w-[160px] h-[180px] sm:h-[200px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 overflow-hidden cursor-pointer relative transition-all duration-200 hover:-translate-y-0.5 group flex flex-col justify-between"
          >
            {/* 3-Dot Absolute Menu Trigger */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(activeMenuId === item.id ? null : item.id);
              }}
              className="absolute top-2 right-2 z-20 w-8 h-8 bg-slate-900/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {activeMenuId === item.id && (
              <div className="absolute top-12 right-2 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl flex flex-col overflow-hidden w-32 animate-fade-in text-xs font-medium">
                <button 
                  onClick={(e) => handlePin(e, item.id, item.is_pinned)}
                  className="px-3 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <i className={`fas fa-thumbtack ${item.is_pinned ? 'text-blue-600' : ''}`}></i>
                  {item.is_pinned ? 'Unpin' : 'Pin'}
                </button>
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="px-3 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                >
                  <i className="fas fa-trash-alt"></i>
                  Delete
                </button>
              </div>
            )}

            {/* Pinned Indicator Badge */}
            {item.is_pinned && (
              <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm">
                <i className="fas fa-thumbtack text-[10px] transform -rotate-45"></i>
              </div>
            )}

            {/* Visual Thumbnail Frame */}
            <div className="w-full flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt="Snap Thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fas fa-image"></i>
                </div>
              )}
            </div>

            {/* Card Footer Info */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 z-10">
              <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={formatTitle(item.ai_response, item.mode)}>
                {formatTitle(item.ai_response, item.mode)}
              </span>
              <span className="text-[9px] font-mono font-medium text-slate-500 flex justify-between">
                <span>{formatTime(item.created_at)}</span>
                <span className="uppercase text-blue-600 dark:text-blue-400 font-bold">{item.mode}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}