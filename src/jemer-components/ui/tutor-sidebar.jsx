"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes[cite: 3]

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v6.0.0 - ON-DEMAND JWT & SHIMMER FIX)
 * ================================================================================================
 * 1. ON-DEMAND JWT FETCH ARCHITECTURE: Replicated the ultra-fast `fetchJwtOnDemand` and 
 *    `jemerAuthenticatedFetch` logic from `page.js`. The sidebar no longer relies on background 
 *    polling or direct `/api/auth/refresh` hits. It strictly interfaces with the native Neon Auth 
 *    SDK (`window.JemerAuth.refreshSession()`) the exact millisecond a user triggers a network request[cite: 3].
 * 2. HARD SECURITY REDIRECTS: If local storage lacks a JWT, or the SDK explicitly fails to refresh 
 *    the token, the proxy intercepts the failure and instantly evicts the user to `/login.html` 
 *    instead of throwing silent console errors or crashing the layout[cite: 3].
 * 3. DARK MODE SHIMMER VISIBILITY: Upgraded the `.dark .animate-shimmer` CSS keyframes. Shifted 
 *    the gradient from `slate-800` to a higher-contrast `slate-700` & `slate-600` mix so the 
 *    skeleton loaders are highly visible against the dark sidebar background[cite: 3].
 * ================================================================================================
 * 🚀 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM SCALABLE SIDE PANEL FRAMEWORK[cite: 3]
 * ================================================================================================
 */

import React, { useState, useEffect, useRef } from "react"; 
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; 

// ── 🛡️ ADVANCED SECURITY & SANITIZATION UTILITIES ──────────────────────────────────────────────

const isValidUUID = (uuid) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
};

// ── 🚀 ON-DEMAND JWT LIFECYCLE ENGINE & INTERCEPTOR ─────────────────────────────────────────────

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

let isRefreshing = false;
let refreshPromise = null;

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

// 🚀 ON-DEMAND JWT FETCHER
const fetchJwtOnDemand = async () => {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const sdkIsReady = await waitForAuthSDKReady();
      if (sdkIsReady) {
        const refreshOutcome = await window.JemerAuth.refreshSession();
        if (refreshOutcome && refreshOutcome.success === false) return null;
        
        let attempts = 0;
        while (attempts < 100) {
          const currentToken = localStorage.getItem("jemer_session_jwt");
          if (currentToken && !isTokenExpiringSoon(currentToken, 300)) {
            return currentToken;
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
        }
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      isRefreshing = false;
    }
  })();

  return refreshPromise;
};

// 🚀 SECURE PROXY WRAPPER
const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt");
  
  if (!activeToken || isTokenExpiringSoon(activeToken, 300)) {
     activeToken = await fetchJwtOnDemand();
     if (!activeToken) {
         window.location.href = "/login.html";
         return new Response(null, { status: 401 });
     }
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${activeToken}`);
  headers.set("apikey", activeToken); // Strict Database Header for Neon PostgREST compatibility[cite: 3]
  
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 400) {
     const emergencyToken = await fetchJwtOnDemand();
     if (emergencyToken) {
        headers.set("Authorization", `Bearer ${emergencyToken}`);
        headers.set("apikey", emergencyToken);
        response = await fetch(url, { ...options, headers });
     } else {
        window.location.href = "/login.html";
     }
  }

  return response;
};

// ── 🖥️ MASTER SIDEBAR COMPONENT ─────────────────────────────────────────────────────────────

export default function TutorSidebar({ isOpen, onClose, onSelectSession, onNewChat }) {
  const { theme } = useTheme();
  const activePathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null); 
  const [studentProfile, setStudentProfile] = useState({ firstName: "Student", lastName: "Workspace" });

  const [sessions, setSessions] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isFetchingMore, setIsFetchingMore] = useState(false); 
  const [offset, setOffset] = useState(0); 
  const [hasMore, setHasMore] = useState(true); 
  
  const [activeModal, setActiveModal] = useState(null); 
  const [menuOpenId, setMenuOpenId] = useState(null); 
  const [renamingId, setRenamingId] = useState(null); 
  const [renameText, setRenameText] = useState(""); 

  const observerTarget = useRef(null); 
  const isFetchingRef = useRef(false); 
  const menuRef = useRef(null); 

  // ── HYDRATION LIFECYCLE ──
  useEffect(() => {
    async function verifyAndFetchProfile() {
      try {
        const cachedFirst = localStorage.getItem("jemer_user_firstName");
        const cachedLast = localStorage.getItem("jemer_user_lastName");

        if (cachedFirst && cachedLast) {
          setStudentProfile({ firstName: cachedFirst, lastName: cachedLast });
          return; 
        }

        const storedUserId = localStorage.getItem("jemer_user_uuid");
        if (!storedUserId || !isValidUUID(storedUserId)) return;

        const endpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${storedUserId}`;
        const profileBridgeResponse = await jemerAuthenticatedFetch(endpoint, {
          method: "GET",
          headers: { "Accept": "application/json" }
        });

        if (profileBridgeResponse.ok) {
          const resolvedPayload = await profileBridgeResponse.json();
          if (resolvedPayload && resolvedPayload.length > 0) {
            const resolvedProfile = resolvedPayload[0];
            const fetchedFirst = resolvedProfile.first_name || "Jemer";
            const fetchedLast  = resolvedProfile.last_name  || "Student";

            localStorage.setItem("jemer_user_firstName", fetchedFirst);
            localStorage.setItem("jemer_user_lastName", fetchedLast);

            setStudentProfile({ firstName: fetchedFirst, lastName: fetchedLast });
          }
        }
      } catch (error) {
        console.error("[NEON PROFILE RESOLUTION FAILURE] Handshake collapsed:", error.message);
      }
    }
    verifyAndFetchProfile(); 
  }, []); 

  // ── DATABASE FETCHING & INFINITE SCROLL LOGIC ──
  
  const fetchSessionsFromDB = async (currentOffset, isReset = false) => {
    if (isFetchingRef.current || (!hasMore && !isReset)) return;
    
    isFetchingRef.current = true;
    if (isReset) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
        (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" : 
         activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" : 
         "http://localhost:8080");

      const response = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/tutor/sessions?limit=10&offset=${currentOffset}`);

      if (response && response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSessions(prev => isReset ? data : [...prev, ...data]);
          setOffset(currentOffset + 10); 
        } else {
          setHasMore(false); 
        }
      } else {
        const errorText = response ? await response.text().catch(() => "") : "Null response";
        console.warn(`[TUTOR SIDEBAR] Server rejected fetch. Status: ${response?.status}. Details: ${errorText}`);
      }
    } catch (error) {
      console.error("[TUTOR SIDEBAR] Network error fetching database sessions:", error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchSessionsFromDB(0, true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingMore) {
          fetchSessionsFromDB(offset);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [offset, hasMore, isLoading, isFetchingMore]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleChatUpdated = () => fetchSessionsFromDB(0, true);
    window.addEventListener("jemer_chat_updated", handleChatUpdated);
    return () => window.removeEventListener("jemer_chat_updated", handleChatUpdated);
  }, []);

  // ── TRANSACTION PIPELINE HANDLERS & CRUD OPERATIONS ──

  const handleTriggerNewChatSession = () => {
    setSelectedSessionId(null);
    window.dispatchEvent(new Event("jemer_new_chat"));
    if (onNewChat) onNewChat(); 
    if (onClose) onClose(); 
  };

  const handleSelectActiveHistoryRow = (sessionIdToken) => {
    setSelectedSessionId(sessionIdToken);
    window.dispatchEvent(new CustomEvent("jemer_session_selected", { detail: sessionIdToken }));
    if (onSelectSession) onSelectSession(sessionIdToken);
    if (onClose) onClose(); 
  };

  const executeSessionMutation = async (sessionId, mutationPayload, actionType) => {
    setSessions(prev => {
      let updated = prev.map(s => s.id === sessionId ? { ...s, ...mutationPayload } : s);
      if (actionType === "archive" || actionType === "delete") {
        updated = updated.filter(s => s.id !== sessionId);
      }
      return updated.sort((a, b) => {
        if (a.is_pinned === b.is_pinned) return new Date(b.updated_at) - new Date(a.updated_at);
        return a.is_pinned ? -1 : 1;
      });
    });

    setMenuOpenId(null); 

    try {
      const POSTGREST_API_URL = "https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/tutor_sessions";
      const method = actionType === "delete" ? "DELETE" : "PATCH";
      
      await jemerAuthenticatedFetch(`${POSTGREST_API_URL}?id=eq.${sessionId}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Prefer": "return=minimal" 
        },
        body: actionType === "delete" ? null : JSON.stringify(mutationPayload)
      });
    } catch (error) {
      console.error(`[TUTOR SIDEBAR] Mutation (${actionType}) encountered network fault:`, error);
    }
  };

  const startRenaming = (session) => {
    setRenamingId(session.id);
    setRenameText(session.title);
    setMenuOpenId(null);
  };

  const commitRenaming = (sessionId) => {
    if (!renameText.trim()) {
      setRenamingId(null);
      return;
    }
    executeSessionMutation(sessionId, { title: renameText.trim() }, "rename");
    setRenamingId(null);
  };

  const filteredSessions = sessions.filter((session) => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const primaryApplicationTabs = [
    { label: "Dashboard", targetPath: "/dashboard", vectorGlyph: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { label: "My AI Tutor", targetPath: "/tutor", vectorGlyph: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-astroid-icon lucide-astroid"><path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203"/></svg> },
    { label: "Learning Tools", targetPath: "/tools", activePaths: ["/tools", "/snap", "/vid2notes", "/audiobooks"], vectorGlyph: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg> },
    { label: "Brain Training", targetPath: "/brain-training", vectorGlyph: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit-icon lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg> },
    { label: "Exam Simulator", targetPath: "/exam-simulator", activePaths: ["/jamb", "/waec", "/exam-practice", "/study" , "/questions" , "/exam-performance" , "/exam-simulator"], vectorGlyph: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-check-icon lucide-book-open-check"><path d="M12 21V7"/><path d="m16 12 2 2 4-4"/><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/></svg> },
    { label: "Rankings", targetPath: "/rankings", vectorGlyph: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-podium-icon lucide-podium"><path d="M12 6V2h-1"/><path d="M9 15a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1"/><path d="M9 21V11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10"/></svg> },
    { label: "Billings", targetPath: "/billings", vectorGlyph: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> }
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 h-[100dvh] w-68 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shrink-0 z-50 select-none transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .sidebar-scroll::-webkit-scrollbar { width: 4px; }
          .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
          .sidebar-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.2); border-radius: 10px; }
          .sidebar-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.4); }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          .animate-shimmer { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
          .dark .animate-shimmer { background: linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%); }
        `}} />

        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 flex flex-col gap-6 sidebar-scroll min-h-0 relative">
          <div className="flex items-center justify-between w-full shrink-0 pb-1 border-b border-slate-50 dark:border-slate-800/20">
            <div className="flex items-center gap-2.5">
              <img src="/assets/brand/jemer-logo.png" alt="Logo" className="w-6 h-6 object-contain shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
              <span className="font-display font-black text-slate-900 dark:text-white tracking-tight text-sm">
                Jemer<span className="text-blue-900 dark:text-blue-500 font-bold">Tutor</span>
              </span>
            </div>
            <button type="button" onClick={onClose} className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden cursor-pointer focus:outline-none">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex flex-col gap-1 w-full shrink-0">
            <button type="button" onClick={handleTriggerNewChatSession} className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group">
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <span>New chat</span>
            </button>

            <div className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 focus-within:text-slate-900 dark:focus-within:text-white transition-colors">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search chats" className="bg-transparent text-slate-800 dark:text-slate-200 text-[13px] font-medium placeholder-slate-400 focus:outline-none w-full leading-none" />
            </div>

            <button type="button" onClick={() => setActiveModal('images')} className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group">
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>Images</span>
            </button>

            <button type="button" onClick={() => setActiveModal('archive')} className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group">
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <span>Archive</span>
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800/60 my-1 shrink-0" />

          <div className="flex-1 flex flex-col gap-2 min-h-0 pt-2">
            <h3 className="text-[11px] font-sans font-bold text-slate-400 dark:text-slate-500 tracking-wide pl-3 shrink-0">Previous learning sessions</h3>

            <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5 sidebar-scroll relative pb-6">
              {isLoading ? (
                <div className="space-y-3 px-3 py-2">
                   {[1,2,3,4,5].map(i => <div key={`skel-${i}`} className="w-full h-6 rounded-md animate-shimmer" />)}
                </div>
              ) : (
                <>
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => {
                      const isCurrentlyFocused = session.id === selectedSessionId;
                      const isRenaming = renamingId === session.id;

                      return (
                        <div key={session.id} className="relative group">
                          <button
                            type="button"
                            onClick={() => !isRenaming && handleSelectActiveHistoryRow(session.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between border border-transparent focus:outline-none ${isCurrentlyFocused ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-2xs font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 hover:text-slate-950 dark:hover:text-slate-200"}`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {session.is_pinned ? (
                                <svg className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" /></svg>
                              ) : (
                                <svg className={`w-3.5 h-3.5 shrink-0 transition-colors ${isCurrentlyFocused ? "text-blue-900 dark:text-blue-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                              )}
                              
                              {isRenaming ? (
                                <input 
                                  type="text" value={renameText} onChange={(e) => setRenameText(e.target.value)} onBlur={() => commitRenaming(session.id)} onKeyDown={(e) => e.key === "Enter" && commitRenaming(session.id)} autoFocus onClick={(e) => e.stopPropagation()} className="flex-1 bg-white dark:bg-slate-950 border border-blue-500 rounded px-1.5 py-0.5 text-[12px] text-slate-900 dark:text-white outline-none w-full"
                                />
                              ) : (
                                <span className="text-[13px] tracking-tight truncate block max-w-[85%] pr-4">{session.title}</span>
                              )}
                            </div>

                            {!isRenaming && (
                              <div onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === session.id ? null : session.id); }} className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:bg-slate-700 transition-colors shrink-0 md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                              </div>
                            )}
                          </button>

                          {menuOpenId === session.id && (
                            <div ref={menuRef} className="absolute right-2 top-10 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in flex flex-col">
                              <button onClick={(e) => { e.stopPropagation(); executeSessionMutation(session.id, { is_pinned: !session.is_pinned }, "pin"); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"><svg className="w-3.5 h-3.5 text-center shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg> {session.is_pinned ? "Unpin" : "Pin"}</button>
                              <button onClick={(e) => { e.stopPropagation(); startRenaming(session); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"><svg className="w-3.5 h-3.5 text-center shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Rename</button>
                              <button onClick={(e) => { e.stopPropagation(); executeSessionMutation(session.id, { is_archived: true }, "archive"); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"><svg className="w-3.5 h-3.5 text-center shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg> Archive</button>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />
                              <button onClick={(e) => { e.stopPropagation(); executeSessionMutation(session.id, null, "delete"); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><svg className="w-3.5 h-3.5 text-center shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Delete</button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-slate-400 dark:text-slate-600 select-none">
                      <p className="text-xs font-medium">No learning logs located.</p>
                    </div>
                  )}
                  <div ref={observerTarget} className="h-4 w-full" />
                  {isFetchingMore && <div className="px-3 py-2"><div className="w-full h-6 rounded-md animate-shimmer" /></div>}
                </>
              )}
            </div>
          </div>

          {activeModal && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-40 flex flex-col p-4 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <svg className={`w-4 h-4 ${activeModal === 'images' ? 'text-purple-500' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={activeModal === 'images' ? "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" : "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"} /></svg>
                  {activeModal === 'images' ? 'Image Gallery' : 'Archived Chats'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full transition-colors cursor-pointer"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={activeModal === 'images' ? "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" : "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"} /></svg>
                <p className="text-xs font-medium">{activeModal === 'images' ? "image-gallery.jsx component mounts here." : "archive.jsx component mounts here."}</p>
                <p className="text-[10px] mt-1 opacity-70">Feature in development staging.</p>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 sticky bottom-0 border-t border-slate-100 dark:border-slate-800/60 p-3 bg-white dark:bg-slate-900 overflow-hidden min-h-[52px] z-50">
          <div className="flex items-center gap-3 px-1.5 py-0.5 w-full">
            <div className="relative shrink-0 select-none">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-slate-900 dark:from-blue-600 dark:to-purple-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-inner">
                {studentProfile.firstName.substring(0, 1).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Identity Session Verified Stable Connection" />
            </div>
            <div className="text-left truncate min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200 truncate max-w-[170px] leading-tight">
                {studentProfile.firstName} {studentProfile.lastName}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}