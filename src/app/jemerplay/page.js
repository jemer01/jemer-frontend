/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 JemerPlay Network Integration & Auth Guard.
 * 1. JIT Token Refresh: Intercepts `handleSearch`, forces a fresh JWT fetch from Neon, and updates local storage before executing the Vector search.
 * 2. Relaxed Auth Guard: Kicks the user to login ONLY if BOTH the JWT and the `user_id` are completely missing from local storage, allowing legal idling.
 * 3. Live Data Mapping: Hits `/api/v1/jemerplay/search`, formats the ISO 8601 duration and view counts dynamically, and passes `searchResults` and `isSearching` down to the components.
 * 4. Preserved Component UI: Zero changes to the component mounting logic or UI structure.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — JEMERPLAY MASTER VIEW CONTROLLER (v1.0)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";

// ── IMPORT MODULAR COMPONENT FILES ──
import JemerPlayHome from "@/jemer-components/jemerplay/jemerplay-home.jsx";
import JemerPlaySearchResults from "@/jemer-components/jemerplay/jemerplay-search-results.jsx";
import JemerPlayMediaPlayer from "@/jemer-components/jemerplay/jemerplay-media-player.jsx";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

const decodeJWTPayload = (token) => {
  try {
    const base64Url = token.split('.[...](asc_slot://start-slot-1)');
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

  // 🚀 FIXED UX: Only redirect to login if BOTH the JWT and User ID are completely missing.
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
  
  const match = isoString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const h = match[1] ? parseInt(match[1], 10) : 0;
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const s = match[3] ? parseInt(match[3], 10) : 0;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ── DUMMY DATABASE PAYLOAD ──
const DUMMY_VIDEOS = [
  { id: "1", youtube_id: "dQw4w9WgXcQ", title: "Introduction to React Next.js Architecture", channel: "Jemer Code", duration: "14:20", views: "1.2M", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80" },
  { id: "2", youtube_id: "dQw4w9WgXcQ", title: "Advanced Quantum Mechanics Simplified", channel: "Science Academy", duration: "45:00", views: "340K", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80" },
  { id: "3", youtube_id: "dQw4w9WgXcQ", title: "The History of Ancient Civilizations", channel: "History Daily", duration: "22:15", views: "890K", thumbnail: "https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?w=800&q=80" },
  { id: "4", youtube_id: "dQw4w9WgXcQ", title: "Understanding Graph Data Structures", channel: "Dev Mastery", duration: "18:45", views: "2.1M", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" },
  { id: "5", youtube_id: "dQw4w9WgXcQ", title: "Mastering Tailwind CSS Grids", channel: "UI Wizards", duration: "30:10", views: "450K", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80" },
];

export default function JemerPlayPage() {
  // ── ROUTING STATE MACHINE ──
  const [activeView, setActiveView] = useState("home"); // Options: 'home', 'results', 'player'
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  
  // ── LIVE DATA STATES ──
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

   // ── ACTION HANDLERS ──
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Switch view immediately to show loading skeleton
    setActiveView("results");
    setIsSearching(true);

    try {
      // 🚀 ON-DEMAND PRE-FLIGHT CHECK: Force fetch fresh JWT before running the search
      await fetchJwtOnDemand();
      
      const BACKEND_URL = getBackendUrl();
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      
      const res = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/jemerplay/search?q=${encodedQuery}`);
      
      // 🚀 FIXED: Robust error interceptor. Pulls the exact backend failure message.
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
      
      // Map backend database format perfectly to frontend dummy component props
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
          dummyVideos={DUMMY_VIDEOS} // Remains dummy for the "Continue Watching" rail
        />
      )}
      {activeView === "results" && (
        <JemerPlaySearchResults 
          searchQuery={searchQuery} 
          goHome={resetToHome} 
          onVideoSelect={handleVideoSelect} 
          searchResults={searchResults} // Passing live mapped data
          isSearching={isSearching}     // Passing loading state
        />
      )}
      {activeView === "player" && (
        <JemerPlayMediaPlayer 
          video={activeVideo} 
          goHome={resetToHome} 
          onVideoSelect={handleVideoSelect} 
          dummyVideos={DUMMY_VIDEOS} // Related videos rail
        />
      )}
    </div>
  );
}
