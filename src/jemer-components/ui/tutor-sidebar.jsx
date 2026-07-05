/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.6.0 - Dynamic DB Integration & Infinite Scroll Sidebar.
 * 1. Live Neon DB Fetching: Scrapped `mockLearningSessions`. Now fetches real session data from 
 *    `/api/v1/tutor/sessions` using limit/offset pagination.
 * 2. Infinite Scroll Observer: Attached an `IntersectionObserver` to a bottom anchor. When the user 
 *    scrolls to the bottom, it silently fetches the next 10 chats without ugly pagination buttons.
 * 3. 3-Dot Context Menu: Added hover-state menus for Laptops (always visible on Mobile) to Pin, Rename, 
 *    Archive, and Delete sessions. Uses Optimistic UI to update the list instantly before the DB resolves.
 * 4. Dummy Modals & Routing: "New Chat" resets the session. "Images" and "Archive" now open beautiful 
 *    glassmorphic dummy overlay pages within the sidebar context.
 * 5. Premium Shimmer Loaders: Replaced basic spinners with animated skeleton lines during network fetches.
 * ================================================================================================
 * 📜 JEMER ACADEMY DESIGN SYSTEM — PREMIUM AUXILIARY TUTOR MANAGEMENT SIDEBAR (v2.6.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

import React, { useState, useEffect, useRef, useCallback } from "react"; // Injects standard state, lifecycle, and reference parameters from React core
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Imports the crash-proof global theme hook gateway

/**
 * Premium Human-Designed Left-Aligned Tutor Sidebar Component
 * @param {Object} props - Structural property configurations assigned by parent layout managers.
 * @param {boolean} props.isOpen - Monitors mobile/desktop slide visibility flags passed from parent layouts.
 * @param {function} props.onClose - Execution callback loop used to reverse transitions and close drawers.
 * @param {function} props.onSelectSession - Callback triggered when a historical chat is selected.
 * @param {function} props.onNewChat - Callback triggered when a fresh session is initialized.
 */
export default function TutorSidebar({ isOpen, onClose, onSelectSession, onNewChat }) {
  // ── LAYER 1: DESIGN SYSTEM THEME INTERACTION HOOKS ──────────────────────────────────────────
  const { theme } = useTheme();

  // ── LAYER 2: COMPONENT INTERACTIVE WORKSPACE STATES ─────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState(""); // Tracks keyword filtering input field
  const [selectedSessionId, setSelectedSessionId] = useState(null); // Local active index state tracker
  
  // Profile State mapping
  const [studentProfile, setStudentProfile] = useState({ firstName: "Student", lastName: "Workspace" });

  // 🚀 NEW UPGRADE: INFINITE SCROLL & DB DATA STATES
  const [sessions, setSessions] = useState([]); // Array holding actual database chat session objects
  const [isLoading, setIsLoading] = useState(true); // Initial loading state for shimmer skeletons
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Pagination loading state
  const [offset, setOffset] = useState(0); // Tracks how many records we have pulled
  const [hasMore, setHasMore] = useState(true); // Flags if the database has more rows to fetch
  
  // 🚀 NEW UPGRADE: MODAL & CONTEXT MENU STATES
  const [activeModal, setActiveModal] = useState(null); // Tracks active dummy views ('images' or 'archive')
  const [menuOpenId, setMenuOpenId] = useState(null); // Tracks which session's 3-dot menu is actively open
  const [renamingId, setRenamingId] = useState(null); // Tracks the ID of the session currently being renamed
  const [renameText, setRenameText] = useState(""); // Tracks the active text being typed during a rename

  // References for infinite scroll tracking and click-outside logic
  const observerTarget = useRef(null); 
  const isFetchingRef = useRef(false); // Mutex lock to prevent duplicate concurrent fetch calls
  const menuRef = useRef(null); // Reference to detect clicks outside the 3-dot menu

  // ── LAYER 3: CACHE-FIRST HYDRATION LIFECYCLE ────────────────────────────────────────────────
  useEffect(() => {
    try {
      console.log("[TUTOR SIDEBAR CACHE] Accessing client local storage registries to hydrate profile details...");
      const cachedFirst = localStorage.getItem("jemer_user_first_name");
      const cachedLast = localStorage.getItem("jemer_user_last_name");

      if (cachedFirst && cachedLast) {
        setStudentProfile({ firstName: cachedFirst, lastName: cachedLast });
      }
    } catch (cacheException) {
      console.error("[TUTOR SIDEBAR PROFILE FAULT] Failed to safely parse client context tokens:", cacheException.message);
    }
  }, []);

  // ── LAYER 4: DATABASE FETCHING & INFINITE SCROLL LOGIC ──────────────────────────────────────
  
  // Core function to fetch paginated sessions directly from the Go backend monolith
  const fetchSessionsFromDB = async (currentOffset, isReset = false) => {
    if (isFetchingRef.current || (!hasMore && !isReset)) return; // Abort if already fetching or no more data
    
    isFetchingRef.current = true;
    if (isReset) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const activeJwtToken = localStorage.getItem("jemer_session_jwt");
      if (!activeJwtToken) return; // Halt if student is not authenticated

      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      // Call our new highly optimized GET endpoint with Limit and Offset
      const response = await fetch(`${BACKEND_URL}/api/v1/tutor/sessions?limit=10&offset=${currentOffset}`, {
        headers: { "Authorization": `Bearer ${activeJwtToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          // If reset, overwrite array. Otherwise, append to existing array.
          setSessions(prev => isReset ? data : [...prev, ...data]);
          setOffset(currentOffset + 10); // Increment the pagination offset counter
        } else {
          setHasMore(false); // If array is empty, we reached the end of the database
        }
      }
    } catch (error) {
      console.error("[TUTOR SIDEBAR] Network error fetching database sessions:", error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial load hook to fetch the first batch of 10 sessions on component mount
  useEffect(() => {
    if (isOpen) {
      fetchSessionsFromDB(0, true);
    }
  }, [isOpen]);

  // 🚀 NEW UPGRADE: Intersection Observer for Infinite Scrolling
  // Triggers automatically when the user scrolls the invisible target div into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingMore) {
          console.log("[TUTOR SIDEBAR] Scroll boundary reached. Fetching next historical payload block...");
          fetchSessionsFromDB(offset);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [offset, hasMore, isLoading, isFetchingMore]);

  // Detect clicks completely outside the 3-dot dropdown menu to collapse it cleanly
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Custom Event Listener to auto-bump sessions when a new message is sent in the main chat
  useEffect(() => {
    const handleChatUpdated = () => {
      // Re-fetch the first page silently to capture the updated timestamp sorting
      fetchSessionsFromDB(0, true);
    };
    window.addEventListener("jemer_chat_updated", handleChatUpdated);
    return () => window.removeEventListener("jemer_chat_updated", handleChatUpdated);
  }, []);

  // ── LAYER 5: TRANSACTION PIPELINE HANDLERS & CRUD OPERATIONS ────────────────────────────────

  // Triggered when "New Chat" is clicked. Clears active session and routes to intro screen.
  const handleTriggerNewChatSession = () => {
    console.log("[TUTOR SIDEBAR SYSTEM] Flushing active canvas views to mount clean introduction grids...");
    setSelectedSessionId(null);
    if (onNewChat) onNewChat(); 
    if (onClose) onClose(); 
  };

  // Triggered when a historical row is selected
  const handleSelectActiveHistoryRow = (sessionIdToken) => {
    console.log(`[TUTOR SIDEBAR SYSTEM] Syncing workspace memory channels to target log ID: ${sessionIdToken}`);
    setSelectedSessionId(sessionIdToken);
    if (onSelectSession) onSelectSession(sessionIdToken);
    if (onClose) onClose(); 
  };

  // 🚀 NEW UPGRADE: Optimistic DB Mutations (Pin, Archive, Rename, Delete)
  const executeSessionMutation = async (sessionId, mutationPayload, actionType) => {
    // 1. Optimistic UI Update: Execute the visual change immediately before the server responds
    setSessions(prev => {
      let updated = prev.map(s => s.id === sessionId ? { ...s, ...mutationPayload } : s);
      
      // If archiving or deleting, remove it from the visible list entirely
      if (actionType === "archive" || actionType === "delete") {
        updated = updated.filter(s => s.id !== sessionId);
      }
      
      // Re-sort the array immediately: Pinned first, then by UpdatedAt
      return updated.sort((a, b) => {
        if (a.is_pinned === b.is_pinned) {
          return new Date(b.updated_at) - new Date(a.updated_at);
        }
        return a.is_pinned ? -1 : 1;
      });
    });

    setMenuOpenId(null); // Close the active dropdown menu

    // 2. Dispatch the network request to synchronize the Neon DB
    try {
      const activeJwtToken = localStorage.getItem("jemer_session_jwt");
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const method = actionType === "delete" ? "DELETE" : "PATCH";
      
      await fetch(`${BACKEND_URL}/api/v1/tutor/sessions/${sessionId}`, {
        method: method,
        headers: {
          "Authorization": `Bearer ${activeJwtToken}`,
          "Content-Type": "application/json"
        },
        body: actionType === "delete" ? null : JSON.stringify(mutationPayload)
      });
    } catch (error) {
      console.error(`[TUTOR SIDEBAR] Mutation (${actionType}) encountered network fault:`, error);
    }
  };

  // Initialize the inline renaming state sequence
  const startRenaming = (session) => {
    setRenamingId(session.id);
    setRenameText(session.title);
    setMenuOpenId(null);
  };

  // Commit the inline rename operation upon Enter key or Blur event
  const commitRenaming = (sessionId) => {
    if (!renameText.trim()) {
      setRenamingId(null);
      return;
    }
    executeSessionMutation(sessionId, { title: renameText.trim() }, "rename");
    setRenamingId(null);
  };

  // Filter historical session records dynamically based on text keywords input by the student
  const filteredSessions = sessions.filter((session) => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* 📡 MOBILE TRANSLUCENT DIM TIMELINE LAYER BACKGROUND */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/10 dark:bg-black/40 backdrop-blur-xs z-45 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      {/* 🏢 MASTER LEFT-ALIGNED VIEWPORT LOCKDOWN SIDEBAR CONTEXT WRAPPER CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-68 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shrink-0 z-50 select-none transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Custom WebKit CSS Injector for beautiful, ultra-thin sleek scrollbars */}
        <style dangerouslySetInnerHTML={{__html: `
          .sidebar-scroll::-webkit-scrollbar { width: 4px; }
          .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
          .sidebar-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.2); border-radius: 10px; }
          .sidebar-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.4); }
          
          /* Shimmer Animation for Premium Skeleton Loaders */
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          .dark .animate-shimmer {
            background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          }
        `}} />

        {/* ── ZONE 1: SPACIOUS INTERACTION CONTROL RUNWAY (TOP HALF LAYOUT) ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6 sidebar-scroll min-h-0 relative">
          
          {/* BRAND CANOPY */}
          <div className="flex items-center justify-between w-full shrink-0 pb-1 border-b border-slate-50 dark:border-slate-800/20">
            <div className="flex items-center gap-2.5">
              <img 
                src="/assets/brand/jemer-logo.png" 
                alt="Jemer Logo" 
                className="w-6 h-6 object-contain shrink-0" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="font-display font-black text-slate-900 dark:text-white tracking-tight text-sm">
                Jemer<span className="text-blue-900 dark:text-blue-500 font-bold">Tutor</span>
              </span>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden cursor-pointer focus:outline-none"
            >
              <i className="fas fa-times text-xs" />
            </button>
          </div>

          {/* ⚡ THE INTERACTIVE LINK SYSTEM WITH DYNAMIC TAB ICONS */}
          <div className="flex flex-col gap-1 w-full shrink-0">
            
            {/* Tab 1: New Chat Link Trigger */}
            <button
              type="button"
              onClick={handleTriggerNewChatSession}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>New chat</span>
            </button>

            {/* Tab 2: Low-Profile Search Input Container */}
            <div className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 focus-within:text-slate-900 dark:focus-within:text-white transition-colors">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats"
                className="bg-transparent text-slate-800 dark:text-slate-200 text-[13px] font-medium placeholder-slate-400 focus:outline-none w-full leading-none"
              />
            </div>

            {/* Tab 3: Generated Portfolio Gallery Link (Opens Dummy Overlay) */}
            <button
              type="button"
              onClick={() => setActiveModal('images')}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Images</span>
            </button>

            {/* Tab 4: Class Vault Archives Link (Opens Dummy Overlay) */}
            <button
              type="button"
              onClick={() => setActiveModal('archive')}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Archive</span>
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800/60 my-1 shrink-0" />

          {/* ── ZONE 2: RECURSIVE CHAT HISTORY FEED (LOWER RUNWAY) ── */}
          <div className="flex-1 flex flex-col gap-2 min-h-0 pt-2">
            <h3 className="text-[11px] font-sans font-bold text-slate-400 dark:text-slate-500 tracking-wide pl-3 shrink-0">
              Previous learning sessions
            </h3>

            {/* TIMELINE LIST TRAY BLOCK */}
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5 sidebar-scroll relative pb-6">
              
              {/* SHIMMER SKELETON LOADER (Initial Fetching) */}
              {isLoading ? (
                <div className="space-y-3 px-3 py-2">
                   {[1,2,3,4,5].map(i => (
                     <div key={`skel-${i}`} className="w-full h-6 rounded-md animate-shimmer" />
                   ))}
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
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between border border-transparent focus:outline-none ${
                              isCurrentlyFocused
                                ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-2xs font-semibold"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 hover:text-slate-950 dark:hover:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* Dynamic Icon: Changes if session is Pinned */}
                              {session.is_pinned ? (
                                <i className="fas fa-thumbtack text-[10px] shrink-0 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <svg className={`w-3.5 h-3.5 shrink-0 transition-colors ${isCurrentlyFocused ? "text-blue-900 dark:text-blue-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              )}
                              
                              {/* Rename Input Element vs Standard Text Display */}
                              {isRenaming ? (
                                <input 
                                  type="text"
                                  value={renameText}
                                  onChange={(e) => setRenameText(e.target.value)}
                                  onBlur={() => commitRenaming(session.id)}
                                  onKeyDown={(e) => e.key === "Enter" && commitRenaming(session.id)}
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 bg-white dark:bg-slate-950 border border-blue-500 rounded px-1.5 py-0.5 text-[12px] text-slate-900 dark:text-white outline-none w-full"
                                />
                              ) : (
                                <span className="text-[13px] tracking-tight truncate block max-w-[85%] pr-4">
                                  {session.title}
                                </span>
                              )}
                            </div>

                            {/* 🚀 NEW UPGRADE: Adaptive 3-Dot Hover Menu */}
                            {!isRenaming && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpenId(menuOpenId === session.id ? null : session.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer"
                              >
                                <i className="fas fa-ellipsis-h text-[10px]" />
                              </div>
                            )}
                          </button>

                          {/* 3-Dot Dropdown Context Menu Overlay */}
                          {menuOpenId === session.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-2 top-10 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in flex flex-col"
                            >
                              <button onClick={(e) => { e.stopPropagation(); executeSessionMutation(session.id, { is_pinned: !session.is_pinned }, "pin"); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                                <i className="fas fa-thumbtack w-3 text-center" /> {session.is_pinned ? "Unpin" : "Pin"}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); startRenaming(session); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                                <i className="fas fa-edit w-3 text-center" /> Rename
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); executeSessionMutation(session.id, { is_archived: true }, "archive"); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                                <i className="fas fa-archive w-3 text-center" /> Archive
                              </button>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />
                              <button onClick={(e) => { e.stopPropagation(); executeSessionMutation(session.id, null, "delete"); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                <i className="fas fa-trash-alt w-3 text-center" /> Delete
                              </button>
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
                  
                  {/* Invisible Observer Target for Infinite Scroll */}
                  <div ref={observerTarget} className="h-4 w-full" />
                  
                  {/* Shimmer loader appended at bottom while fetching next page */}
                  {isFetchingMore && (
                    <div className="px-3 py-2">
                       <div className="w-full h-6 rounded-md animate-shimmer" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── ZONE 2.5: DUMMY OVERLAY MODALS FOR IMAGES & ARCHIVE ── */}
          {/* These render as absolute layers covering the entire sidebar smoothly */}
          {activeModal && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-40 flex flex-col p-4 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <i className={`fas ${activeModal === 'images' ? 'fa-image text-purple-500' : 'fa-archive text-emerald-500'}`} />
                  {activeModal === 'images' ? 'Image Gallery' : 'Archived Chats'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full transition-colors cursor-pointer">
                  <i className="fas fa-times text-[10px]" />
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                <i className={`fas ${activeModal === 'images' ? 'fa-camera-retro' : 'fa-box-open'} text-3xl mb-3 opacity-30`} />
                <p className="text-xs font-medium">
                  {activeModal === 'images' 
                    ? "image-gallery.jsx component mounts here." 
                    : "archive.jsx component mounts here."}
                </p>
                <p className="text-[10px] mt-1 opacity-70">Feature in development staging.</p>
              </div>
            </div>
          )}

        </div>

        {/* ── ZONE 3: CACHE-HYDRATED USER PROFILE CARD CONTEXT LOWER ANCHOR ── */}
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