"use client";

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — JEMERPLAY MASTER VIEW CONTROLLER (v3.0.0)
 * ================================================================================================
 * [NEW UPGRADE — v3.0.0]
 * SUMMARY: Phase 1 Watch History Deletion & Player Props Handoff
 * 1. LIVE HISTORY DELETION: Added `handleDeleteWatchHistory` function. It optimistically updates 
 *    the UI for zero latency and hits the new Go backend `DELETE` route via `authenticatedFetch`.
 * 2. RELATED VIDEOS FALLBACK HANDOFF: Injected the `watchHistory` array into `JemerPlayMediaPlayer`. 
 *    This ensures that when a user clicks a video from their history, the player has enough data 
 *    to populate the "More related videos" rail, preventing it from rendering empty.
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";

// ── IMPORT MODULAR COMPONENT FILES ──
import JemerPlayHome from "@/jemer-components/jemerplay/jemerplay-home.jsx";
import JemerPlaySearchResults from "@/jemer-components/jemerplay/jemerplay-search-results.jsx";
import JemerPlayMediaPlayer from "@/jemer-components/jemerplay/jemerplay-media-player.jsx";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

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

const getBackendUrl = () => {
  const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
  return process.env.NEXT_PUBLIC_API_URL ||
    (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
     activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
     "http://localhost:8080");
};

// ================================================================================================
// UTILITY FORMATTERS
// ================================================================================================
const formatViews = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const parseDuration = (isoString) => {
  if (!isoString) return "0:00";
  // Matches PT1H2M10S, PT5M33S, etc. safely
  const match = isoString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const h = match[1] ? parseInt(match[1], 10) : 0;
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const s = match[3] ? parseInt(match[3], 10) : 0;
  
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function JemerPlayPage() {
  // ── ROUTING STATE MACHINE ──
  const [activeView, setActiveView] = useState("home"); // Options: 'home', 'results', 'player'
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  
  // ── LIVE DATA STATES ──
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]); 

  // Fetch User Watch History on Mount
  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const fetchWatchHistory = async () => {
    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/history`);
      if (res.ok) {
        const data = await res.json();
        const mappedHistory = (data || []).map(v => ({
          id: v.youtube_id,
          youtube_id: v.youtube_id,
          title: v.title,
          channel: v.channel_title,
          duration: parseDuration(v.duration),
          views: formatViews(v.view_count),
          thumbnail: v.thumbnail_url
        }));
        setWatchHistory(mappedHistory);
      }
    } catch (err) {
      console.error("Failed to fetch watch history:", err);
    }
  };

  // 🚀 NEW: Handle History Deletion
  const handleDeleteWatchHistory = async (videoId) => {
    // Optimistic UI Update for zero-latency feel
    setWatchHistory(prev => prev.filter(v => v.youtube_id !== videoId && v.id !== videoId));
    
    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/history/${videoId}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to delete watch history record:", err);
    }
  };

  // ── ACTION HANDLERS ──
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Switch view immediately to show loading skeleton
    setActiveView("results");
    setIsSearching(true);

    try {
      await waitForJemerAuthReady();
      
      const BACKEND_URL = getBackendUrl();
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/search?q=${encodedQuery}`);
      
      if (!res.ok) {
        let backendErrorMsg = "Unknown backend error";
        try {
          const errorPayload = await res.json();
          backendErrorMsg = errorPayload.error || backendErrorMsg;
        } catch (e) {
          backendErrorMsg = await res.text().catch(() => "No response body");
        }
        console.error(`[JEMERPLAY-API] Backend Rejected Search (HTTP ${res.status}):`, backendErrorMsg);
        throw new Error(backendErrorMsg);
      }
      
      const data = await res.json();
      
      const mappedResults = (data || []).map(v => ({
        id: v.youtube_id,
        youtube_id: v.youtube_id,
        title: v.title,
        channel: v.channel_title,
        duration: parseDuration(v.duration),
        views: formatViews(v.view_count),
        thumbnail: v.thumbnail_url
      }));
      
      setSearchResults(mappedResults);
    } catch (err) {
      console.error("Search Pipeline Failed:", err);
      // Fallback gracefully without breaking the UI
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    setActiveView("player");
    window.scrollTo({ top: 0, behavior: "smooth" }); 

    const logWatchEvent = async () => {
      try {
        await waitForJemerAuthReady();
        const BACKEND_URL = getBackendUrl();
        await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ youtube_id: video.youtube_id || video.id })
        });
        // Silent refresh of history rail in background
        fetchWatchHistory();
      } catch (err) {
        console.error("Failed to log watch event:", err);
      }
    };
    
    logWatchEvent();
  };

  const resetToHome = () => {
    setActiveView("home");
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="w-full min-h-full animate-fade-in text-slate-900 dark:text-slate-100 relative">
      {activeView === "home" && (
        <JemerPlayHome 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
          onVideoSelect={handleVideoSelect} 
          watchHistory={watchHistory} 
          onDeleteHistoryItem={handleDeleteWatchHistory} // 🚀 FIXED: Passed delete handler down
        />
      )}
      {activeView === "results" && (
        <JemerPlaySearchResults 
          searchQuery={searchQuery} 
          goHome={resetToHome} 
          onVideoSelect={handleVideoSelect} 
          searchResults={searchResults} 
          isSearching={isSearching}     
        />
      )}
      {activeView === "player" && (
        <JemerPlayMediaPlayer 
          video={activeVideo} 
          goHome={resetToHome} 
          onVideoSelect={handleVideoSelect} 
          searchResults={searchResults} 
          watchHistory={watchHistory} // 🚀 FIXED: Passed watch history to prevent empty rails
        />
      )}
    </div>
  );
}