/**
 * ================================================================================================
 * 📜 JEMER ACADEMY DESIGN SYSTEM — PREMIUM AUXILIARY TUTOR MANAGEMENT SIDEBAR (v2.5)
 * ================================================================================================
 * Description: High-end human-centric auxiliary layout manager tracking local learning histories.
 * Design Reference: Crafted to match the pristine minimalism of Screenshot 2026-06-21 204439.png.
 * Upgrades Implemented: Added custom inline vector icons for all tabs, integrated official brand logo,
 * and added cache-first local storage profile card sync to match the general app sidebar.
 * Compliance: 100% complete line-by-line developer documentation for absolute system clarity.
 * ================================================================================================
 */

"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

import React, { useState, useEffect } from "react"; // Injects standard state and lifecycle parameters from React core
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Imports the crash-proof global theme hook gateway

/**
 * Premium Human-Designed Left-Aligned Tutor Sidebar Component
 * @param {Object} props - Structural property configurations assigned by parent layout managers.
 * @param {boolean} props.isOpen - Monitors mobile/desktop slide visibility flags passed from parent layouts.
 * @param {function} props.onClose - Execution callback loop used to reverse transitions and close drawers.
 */
export default function TutorSidebar({ isOpen, onClose }) {
  // ── LAYER 1: DESIGN SYSTEM THEME INTERACTION HOOKS ──────────────────────────────────────────
  // Extract custom active theme parameters directly out of the context pipeline to ensure theme-adaptive safety
  const { theme } = useTheme();

  // ── LAYER 2: COMPONENT INTERACTIVE WORKSPACE STATES ─────────────────────────────────────────
  // Tracks active text keys typed into the local history keyword filtering input field
  const [searchQuery, setSearchQuery] = useState("");
  
  // Local active index state tracker to highlight the currently viewed chat session item row
  const [selectedSessionId, setSelectedSessionId] = useState("session-1");

  // 🧬 CACHE-FIRST LOCAL PROFILE STATE VECTORS:
  // Enforces a symmetric static initial baseline value ("Student" / "Workspace") identically on both 
  // Server (SSR) and Client first-pass compilation steps to fully eliminate React 19 layout mismatches.
  const [studentProfile, setStudentProfile] = useState({ 
    firstName: "Student", 
    lastName: "Workspace" 
  });

  // 📑 CORE CONVERSATIONAL LOGS DATA MATRIX
  // Mapped as an elegant, flat dataset containing real academic topic strings
  const mockLearningSessions = [
    {
      id: "session-1",
      title: "Quantum Superposition Drilling",
      timestamp: "10 mins ago",
      topicBadge: "Physics"
    },
    {
      id: "session-2",
      title: "Shakespearean Hamartia Motifs",
      timestamp: "2 hours ago",
      topicBadge: "Literature"
    },
    {
      id: "session-3",
      title: "Macroeconomic Inflation Controls",
      timestamp: "Yesterday",
      topicBadge: "Economics"
    },
    {
      id: "session-4",
      title: "Cellular Mitosis Division Cycles",
      timestamp: "3 days ago",
      topicBadge: "Biology"
    },
    {
      id: "session-5",
      title: "Organic Carbon Chains Bonding",
      timestamp: "1 week ago",
      topicBadge: "Chemistry"
    }
  ];

  // ── LAYER 3: CACHE-FIRST HYDRATION LIFECYCLE ────────────────────────────────────────────────
  /**
   * [LOCAL STORAGE HYDRATION ENGINE EFFECT]
   * Fires exactly once post-mount to extract the user settings tokens natively saved during active logon verification,
   * completely bypassing expensive database select calls.
   */
  useEffect(() => {
    try {
      console.log("[TUTOR SIDEBAR CACHE] Accessing client local storage registries to hydrate profile details...");
      // Pull down previously deposited student identification tokens out of local browser memory maps
      const cachedFirst = localStorage.getItem("jemer_user_first_name");
      const cachedLast = localStorage.getItem("jemer_user_last_name");

      if (cachedFirst && cachedLast) {
        console.log(`[TUTOR SIDEBAR CACHE HIT] Hydrating card parameters for: ${cachedFirst} ${cachedLast}`);
        setStudentProfile({
          firstName: cachedFirst,
          lastName: cachedLast
        });
      }
    } catch (cacheException) {
      console.error("[TUTOR SIDEBAR PROFILE FAULT] Failed to safely parse client context tokens:", cacheException.message);
    }
  }, []);

  // ── LAYER 4: TRANSACTION PIPELINE HANDLERS ──────────────────────────────────────────────────
  /**
   * Mock execution loop managing the initialization of a brand new chat tracking thread
   */
  const handleTriggerNewChatSession = () => {
    console.log("[TUTOR SIDEBAR SYSTEM] Flushing active canvas views to mount clean introduction grids...");
    alert("New Chat Triggered: This will wipe active logs and cycle the canvas back onto the entry introduction grid.");
    if (onClose) onClose(); // Automatically drop sliding drawer panels on mobile devices to free up screen real estate
  };

  /**
   * Transitions active workspace data channels to point straight to the selected historic chat log node
   * @param {string} sessionIdToken - Unique text key identifying the targeted historical row element.
   */
  const handleSelectActiveHistoryRow = (sessionIdToken) => {
    console.log(`[TUTOR SIDEBAR SYSTEM] Syncing workspace memory channels to target log ID: ${sessionIdToken}`);
    setSelectedSessionId(sessionIdToken); // Apply row index selection to state
    if (onClose) onClose(); // Snap close the menu track on smartphone breakdowns to lock layout views
  };

  // Filter historical session records dynamically based on text keywords input by the student
  const filteredSessions = mockLearningSessions.filter((session) => 
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
      {/* Layered at z-50 to ensure clean sliding actions above the background layout panel */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-68 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between shrink-0 z-50 select-none transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ── ZONE 1: SPACIOUS INTERACTION CONTROL RUNWAY (TOP HALF LAYOUT) ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6 scrollbar-none min-h-0">
          
          {/* BRAND CANOPY: Integrated corporate graphic logo path as explicitly requested */}
          <div className="flex items-center justify-between w-full shrink-0 pb-1 border-b border-slate-50 dark:border-slate-800/20">
            <div className="flex items-center gap-2.5">
              {/* Renders your real high-resolution platform logo asset from public path */}
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
            
            {/* Minimal close cross icon element displaying exclusively on mobile breakdown viewports */}
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden cursor-pointer focus:outline-none"
              title="Close tutor panel"
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
            <div className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 focus-within:text-slate-900 dark:focus-within:text-white">
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

            {/* Tab 3: Generated Portfolio Gallery Link */}
            <button
              type="button"
              onClick={() => alert("Image Portfolio Context: This references your future generated images workspace.")}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Images</span>
            </button>

            {/* Tab 4: Class Vault Archives Link */}
            <button
              type="button"
              onClick={() => alert("Archive Context: This references your future custom class archive vault panel.")}
              className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none group"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Archive</span>
            </button>
          </div>

          {/* Structural separator bar line */}
          <hr className="border-slate-100 dark:border-slate-800/60 my-1 shrink-0" />

          {/* ── ZONE 2: RECURSIVE CHAT HISTORY FEED (LOWER RUNWAY) ── */}
          <div className="flex-1 flex flex-col gap-2 min-h-0 pt-2">
            <h3 className="text-[11px] font-sans font-bold text-slate-400 dark:text-slate-500 tracking-wide pl-3 shrink-0">
              Previous learning sessions
            </h3>

            {/* TIMELINE LIST TRAY BLOCK: Renders individual rows equipped with standalone item chat vectors */}
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5 modal-scroll select-none">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => {
                  const isCurrentlyFocused = session.id === selectedSessionId;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => handleSelectActiveHistoryRow(session.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-3 border border-transparent focus:outline-none relative ${
                        isCurrentlyFocused
                          ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-2xs font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 hover:text-slate-950 dark:hover:text-slate-200"
                      }`}
                    >
                      {/* Integrated premium chat log wire vector preceding each row title */}
                      <svg className={`w-3.5 h-3.5 shrink-0 transition-colors ${isCurrentlyFocused ? "text-blue-900 dark:text-blue-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-[13px] tracking-tight truncate block max-w-[85%]">
                        {session.title}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 dark:text-slate-600 select-none">
                  <p className="text-xs font-medium">No learning logs located.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── ZONE 3: CACHE-HYDRATED USER PROFILE CARD CONTEXT LOWER ANCHOR ── */}
        {/* Replaced legacy system timestamp text row with matching premium DB local storage profile card block layout */}
        <div className="shrink-0 sticky bottom-0 border-t border-slate-100 dark:border-slate-800/60 p-3 bg-white dark:bg-slate-900 overflow-hidden min-h-[52px]">
          <div className="flex items-center gap-3 px-1.5 py-0.5 w-full">
            
            {/* Profile Avatar Graphics Node with Integrated Connection Beacon Status Indicator */}
            <div className="relative shrink-0 select-none">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-slate-900 dark:from-blue-600 dark:to-purple-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-inner">
                {studentProfile.firstName.substring(0, 1).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Identity Session Verified Stable Connection" />
            </div>

            {/* Core Text Name Container Row */}
            <div className="text-left truncate min-w-0 flex-1">
              {/* Emits the cached student name tokens instantly without pixel runtime layout shaking */}
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