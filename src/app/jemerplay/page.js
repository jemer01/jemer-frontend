/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.1 JemerPlay State Handoff for Related Videos.
 * 1. State Handoff: Upgraded the `<JemerPlayMediaPlayer />` component mount to receive the live `searchResults` array. This allows the player to dynamically render the remaining 19 videos in the "More related videos" section.
 * 2. Preserved Infrastructure: Maintained 100% of the JWT auth wrappers, vector search backend fetching, atomic watch history logging, and SPA routing logic.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — JEMERPLAY MASTER VIEW CONTROLLER (v2.1)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";

// ── IMPORT MODULAR COMPONENT FILES ──
import JemerPlayHome from "@/jemer-components/jemerplay/jemerplay-home.jsx";
import JemerPlaySearchResults from "@/jemer-components/jemerplay/jemerplay-search-results.jsx";
import JemerPlayMediaPlayer from "@/jemer-components/jemerplay/jemerplay-media-player.jsx";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

const decodeJWTPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const isTokenExpiringSoon = (token, thresholdSeconds = 300) => {
  if (!token) return true;
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true;
  const currentUnixTime = Math.floor(Date.now() / 1000);
  return (payload.exp - currentUnixTime) < thresholdSeconds;
};

const getAuthRefreshLock = () => {
  if (typeof window === "undefined") return { isRefreshing: false, refreshPromise: null };
  if (!window.__jemerAuthRefreshLock) {
    window.__jemerAuthRefreshLock = { isRefreshing: false, refreshPromise: null };
  }
  return window.__jemerAuthRefreshLock;
};

const waitForAuthSDKReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
  const isReady = () => typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.refreshSession === "function";
  if (isReady()) return true;
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    if (isReady()) return true;
  }
  return false;
};

const fetchJwtOnDemand = async () => {
  const lock = getAuthRefreshLock();
  if (lock.isRefreshing) return lock.refreshPromise;
  lock.isRefreshing = true;

  lock.refreshPromise = (async () => {
    try {
      const sdkIsReady = await waitForAuthSDKReady();
      if (sdkIsReady) {
        const refreshOutcome = await window.JemerAuth.refreshSession();
        if (refreshOutcome && refreshOutcome.success === false) return null;

        let attempts = 0;
        while (attempts < 100) {
          const currentToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
          if (currentToken && !isTokenExpiringSoon(currentToken, 300)) {
            return currentToken;
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
        }
      }
      return localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || null;
    } catch (error) {
      return null;
    } finally {
      lock.isRefreshing = false;
    }
  })();

  return lock.refreshPromise;
};

const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
  const userId = localStorage.getItem("jemer_user_id") || localStorage.getItem("user_id");

  // Only redirect to login if BOTH the JWT and User ID are completely missing.
  if (!activeToken && !userId) {
     window.location.href = "/login.html";
     return new Response(null, { status: 401 });
  }

  // Silently refresh if expiring
  if (isTokenExpiringSoon(activeToken, 300)) {
     const freshToken = await fetchJwtOnDemand();
     if (freshToken) {
       activeToken = freshToken;
     }
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${activeToken}`);
  headers.set("apikey", activeToken);

  let response = await fetch(url, { ...options, headers });

  // Fallback interceptor if API rejects token
  if (response.status === 401 || response.status === 400) {
     const emergencyToken = await fetchJwtOnDemand();
     if (emergencyToken && emergencyToken !== activeToken) {
        headers.set("Authorization", `Bearer ${emergencyToken}`);
        headers.set("apikey", emergencyToken);
        response = await fetch(url, { ...options, headers });
     } else {
        const checkToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
        const checkUserId = localStorage.getItem("jemer_user_id") || localStorage.getItem("user_id");
        if (!checkToken && !checkUserId) {
           window.location.href = "/login.html";
        }
     }
  }

  return response;
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
      await fetchJwtOnDemand();
      const BACKEND_URL = getBackendUrl();
      const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/history`);
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

  // ── ACTION HANDLERS ──
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Switch view immediately to show loading skeleton
    setActiveView("results");
    setIsSearching(true);

    try {
      // ON-DEMAND PRE-FLIGHT CHECK: Force fetch fresh JWT before running the search
      await fetchJwtOnDemand();
      
      const BACKEND_URL = getBackendUrl();
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      
      const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/search?q=${encodedQuery}`);
      
      // Robust error interceptor. Pulls the exact backend failure message.
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
      
      // Map backend database format perfectly to frontend component props
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
    window.scrollTo({ top: 0, behavior: "smooth" }); // Auto-scroll to top when a video is clicked

    // Asynchronously log the watch event (upserts DB timestamp)
    const logWatchEvent = async () => {
      try {
        const BACKEND_URL = getBackendUrl();
        await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/history`, {
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
      {/* Component Mounting Logic - Now rendering the imported modular files correctly */}
      {activeView === "home" && (
        <JemerPlayHome 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
          onVideoSelect={handleVideoSelect} 
          watchHistory={watchHistory} 
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
          searchResults={searchResults} // 🚀 NEW: Passing live search results instead of dummy data
        />
      )}
    </div>
  );
}
