"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM SCALABLE SIDE PANEL FRAMEWORK (v7.0.0)
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v7.0.0 - ARCHIVE & IMAGE GALLERY INTEGRATION)
 * ================================================================================================
 * 1. ARCHIVE ENGINE: Replaced the dummy modal with a live PostgREST fetch targeting `is_archived=eq.true`. 
 *    Added a one-click Unarchive action that restores the session and dispatches `jemer_chat_updated` 
 *    to instantly hydrate the main sidebar.
 * 2. MASONRY IMAGE GALLERY: Replaced the dummy gallery. The system now queries the user's global chat 
 *    history for the `<jemer-image-showcase>` XML tag, extracts the image data natively via regex, 
 *    and maps it into a sleek, staggered 2-column masonry grid.
 * ================================================================================================
 * [PREVIOUS UPGRADES RETAINED]
 * - Unified sidebar background syncing (bg-slate-50 / dark:bg-slate-950)
 * - Centralized window.JemerAuth engine fetching
 * - Cross-module refresh locking & Mount-level Guards
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

  // 🚀 NEW: States for the Archive and Image Gallery Modals
  const [archivedSessions, setArchivedSessions] = useState([]);
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  const observerTarget = useRef(null); 
  const isFetchingRef = useRef(false); 
  const menuRef = useRef(null); 

  useEffect(() => {
    const hasToken = localStorage.getItem("jemer_session_jwt");
    const hasUserId = localStorage.getItem("jemer_user_uuid");
    if (!hasToken || !hasUserId) {
      window.location.href = "/login.html";
    }
  }, []);

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

        await waitForJemerAuthReady();
        const freshProfileToken = window.JemerAuth ? await window.JemerAuth.fetchJwtOnDemand() : null;
        if (!freshProfileToken) return;

        const endpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${storedUserId}`;
        const profileBridgeResponse = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${freshProfileToken}`,
            "apikey": freshProfileToken,
            "Accept": "application/json"
          }
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

      await waitForJemerAuthReady();
      const response = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/tutor/sessions?limit=10&offset=${currentOffset}`);

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

  // 🚀 NEW: Trigger fetches when Modals are opened
  useEffect(() => {
    if (activeModal === 'archive') {
      fetchArchivedSessions();
    } else if (activeModal === 'images') {
      fetchGalleryImages();
    }
  }, [activeModal]);

  const fetchArchivedSessions = async () => {
    setIsLoadingArchive(true);
    try {
      await waitForJemerAuthReady();
      const token = window.JemerAuth ? await window.JemerAuth.fetchJwtOnDemand() : null;
      const userUuid = localStorage.getItem("jemer_user_uuid");
      if (!token || !userUuid) return;

      const res = await fetch(`https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/tutor_sessions?student_id=eq.${userUuid}&is_archived=eq.true&order=updated_at.desc`, {
        headers: { "Authorization": `Bearer ${token}`, "apikey": token, "Accept": "application/json" }
      });
      if (res.ok) {
        setArchivedSessions(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingArchive(false);
    }
  };

  const fetchGalleryImages = async () => {
    setIsLoadingGallery(true);
    try {
      await waitForJemerAuthReady();
      const token = window.JemerAuth ? await window.JemerAuth.fetchJwtOnDemand() : null;
      const userUuid = localStorage.getItem("jemer_user_uuid");
      if (!token || !userUuid) return;

      const res = await fetch(`https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/tutor_chat_history?student_id=eq.${userUuid}&content=like.*%3Cjemer-image-showcase%3E*&order=created_at.desc&limit=50`, {
        headers: { "Authorization": `Bearer ${token}`, "apikey": token, "Accept": "application/json" }
      });
      if (res.ok) {
        const messages = await res.json();
        const extractedImages = [];
        const imgTagRegex = /<img\s+src="([^"]+)"\s+thumb="([^"]+)"\s+title="([^"]+)"\s+author="([^"]+)"\s+license="([^"]+)"\s*\/>/g;
        
        messages.forEach(msg => {
          let match;
          while ((match = imgTagRegex.exec(msg.content)) !== null) {
            extractedImages.push({
              src: match[1],
              thumb: match[2],
              title: match[3],
              author: match[4],
              license: match[5],
              sessionId: msg.session_id
            });
          }
        });
        setGalleryImages(extractedImages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const unarchiveSession = async (sessionId) => {
    try {
      await executeSessionMutation(sessionId, { is_archived: false }, "unarchive");
      setArchivedSessions(prev => prev.filter(s => s.id !== sessionId));
      window.dispatchEvent(new Event("jemer_chat_updated")); // Refreshes the main sidebar
    } catch (e) { 
      console.error(e); 
    }
  };

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
    if (actionType !== "unarchive") {
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
    }

    setMenuOpenId(null); 

    try {
      const POSTGREST_API_URL = "https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/tutor_sessions";
      const method = actionType === "delete" ? "DELETE" : "PATCH";

      const mutationToken = window.JemerAuth ? await window.JemerAuth.fetchJwtOnDemand() : null;
      if (!mutationToken) return;

      await fetch(`${POSTGREST_API_URL}?id=eq.${sessionId}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mutationToken}`,
          "apikey": mutationToken,
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

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 h-[100dvh] w-68 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shrink-0 z-50 select-none transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .sidebar-scroll::-webkit-scrollbar { width: 4px; }
          .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
          .sidebar-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.2); border-radius: 10px; }
          .sidebar-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.4); }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          .animate-shimmer { background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; }
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
                   {[1,2,3,4,5].map(i => <div key={`skel-${i}`} className="w-full h-6 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer" />)}
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
                  {isFetchingMore && <div className="px-3 py-2"><div className="w-full h-6 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer" /></div>}
                </>
              )}
            </div>
          </div>

          {activeModal && (
            <div className="absolute inset-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md z-40 flex flex-col p-4 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <svg className={`w-4 h-4 ${activeModal === 'images' ? 'text-purple-500' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={activeModal === 'images' ? "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" : "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"} /></svg>
                  {activeModal === 'images' ? 'Image Gallery' : 'Archived Chats'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full transition-colors cursor-pointer"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              
              {/* 🚀 NEW UPGRADE: Active Implementation Engine rendering Archival and Gallery Views */}
              {activeModal === 'archive' && (
                <div className="flex-1 overflow-y-auto sidebar-scroll px-1 mt-3">
                  {isLoadingArchive ? (
                    <div className="flex justify-center py-8"><i className="fas fa-circle-notch fa-spin text-emerald-500"></i></div>
                  ) : archivedSessions.length > 0 ? (
                    <div className="space-y-2">
                      {archivedSessions.map(session => (
                        <div key={session.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between group shadow-sm transition-all hover:shadow-md">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{session.title}</span>
                            <span className="text-[9px] text-slate-400 mt-0.5 font-mono">{new Date(session.updated_at).toLocaleDateString()}</span>
                          </div>
                          <button onClick={() => unarchiveSession(session.id)} className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors shrink-0 focus:outline-none active:scale-95" title="Unarchive Session">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <div className="py-12 text-center text-slate-400"><p className="text-xs font-medium">No archived sessions found.</p></div>
                  )}
                </div>
              )}

              {activeModal === 'images' && (
                <div className="flex-1 overflow-y-auto sidebar-scroll px-1 mt-3">
                  {isLoadingGallery ? (
                     <div className="flex justify-center py-8"><i className="fas fa-circle-notch fa-spin text-purple-500"></i></div>
                  ) : galleryImages.length > 0 ? (
                     <div className="columns-2 gap-2 space-y-2">
                       {galleryImages.map((img, idx) => (
                         <div key={idx} className="break-inside-avoid relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer" onClick={() => window.open(img.src, '_blank')}>
                           <img src={img.thumb} alt={img.title} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                             <p className="text-[9px] font-bold text-white truncate">{img.title}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                  ) : (
                     <div className="py-12 text-center text-slate-400"><p className="text-xs font-medium">No images generated yet.</p></div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 sticky bottom-0 border-t border-slate-100 dark:border-slate-800/60 p-3 bg-slate-50 dark:bg-slate-950 overflow-hidden min-h-[52px] z-50">
          <div className="flex items-center gap-3 px-1.5 py-0.5 w-full">
            <div className="relative shrink-0 select-none">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-slate-900 dark:from-blue-600 dark:to-purple-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-inner">
                {studentProfile.firstName.substring(0, 1).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-50 dark:border-slate-950 shadow-xs" title="Identity Session Verified Stable Connection" />
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