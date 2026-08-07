/**
 * [NEW UPGRADE]
 * SUMMARY: v2.1 Snap History API Integration & Premium UI Elements.
 * 1. API Integration: Fetching live data via GET `/snap/history`.
 * 2. Interaction Menu: Added 3-dot dropdown to Delete (`DELETE /snap/history/{id}`) and Pin (`PATCH /snap/history/{id}/pin`) records.
 * 3. Premium CSS Scrollbar: Replaced hidden scrollbars with a custom, sleek translucent webkit scrollbar.
 * 4. Image Previews & Selection: Cards display actual R2 images and trigger `onSelectHistory` to load the result page dynamically.
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — SNAP HISTORY (v2.1)
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

  const getToken = () => localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || "";

  // Fetch data on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/snap/history`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
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
      await fetch(`${getBackendUrl()}/api/v1/snap/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
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
      await fetch(`${getBackendUrl()}/api/v1/snap/history/${id}/pin`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
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
    // Strip markdown formatting characters and slice
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
      {/* Premium custom scrollbar CSS */}
      <style jsx>{`
        .premium-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3); /* Slate-400 with opacity */
          border-radius: 10px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(59, 130, 246, 0.6); /* Blue-500 on hover */
        }
        .premium-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
        }
      `}</style>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto premium-scrollbar py-2 px-1 snap-x snap-mandatory pb-4">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectHistory && onSelectHistory(item)}
            className="snap-start shrink-0 w-[130px] sm:w-[150px] h-[170px] sm:h-[190px] bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 overflow-hidden cursor-pointer relative transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
          >
            {/* 3-Dot Absolute Menu Trigger */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(activeMenuId === item.id ? null : item.id);
              }}
              className="absolute top-2 right-2 z-20 w-7 h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {activeMenuId === item.id && (
              <div className="absolute top-10 right-2 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl flex flex-col overflow-hidden w-28 animate-fade-in text-xs font-medium">
                <button 
                  onClick={(e) => handlePin(e, item.id, item.is_pinned)}
                  className="px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <i className={`fas fa-thumbtack ${item.is_pinned ? 'text-blue-500' : ''}`}></i>
                  {item.is_pinned ? 'Unpin' : 'Pin'}
                </button>
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                >
                  <i className="fas fa-trash-alt"></i>
                  Delete
                </button>
              </div>
            )}

            {/* Pinned Indicator Badge */}
            {item.is_pinned && (
              <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                <i className="fas fa-thumbtack text-[10px] transform -rotate-45"></i>
              </div>
            )}

            {/* Visual Thumbnail Frame */}
            <div className="w-full flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt="Snap Thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fas fa-image"></i>
                </div>
              )}
            </div>

            {/* Card Footer Info */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-0.5 z-10">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={formatTitle(item.ai_response, item.mode)}>
                {formatTitle(item.ai_response, item.mode)}
              </span>
              <span className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 flex justify-between">
                <span>{formatTime(item.created_at)}</span>
                <span className="uppercase text-blue-500/80">{item.mode}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
