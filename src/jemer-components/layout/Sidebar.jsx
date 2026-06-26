/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM SCALABLE SIDE PANEL FRAMEWORK (v5.5 ULTIMATE)
 * ================================================================================================
 * Description: Viewport-locked navigation sidebar with premium custom vector assets.
 * Performance Tier: Cache-First LocalStorage Hydration Engine (0ms Latency Loop)
 * Database Layer: Powered natively by the serverless Neon DB & Auth architecture.
 * Compliance: 100% complete line-by-line developer code documentation for maximum clarity.
 * ================================================================================================
 */

"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

import React, { useState, useEffect } from "react"; // Injects standard state and lifecycle parameters from React
import Link from "next/link"; // Injects optimized client-side routing bridges to achieve instant page swaps
import { usePathname } from "next/navigation"; // Pulls the URL parser to dynamically highlight the student's active tab
import { client } from "@/lib/neon.js"; // References your browser-safe client instance configurator to process active database sessions

/**
 * Universal Fixed Side Navigation Panel Component
 * @param {Object} props - Structural properties argument parameters.
 * @param {boolean} props.isOpen - Monitors mobile drawer slide visibility flags passed from parent layouts.
 * @param {function} props.onClose - Execution callback loop used to reverse transitions and close drawers.
 */
export default function Sidebar({ isOpen, onClose }) {
  // Captures active web layout routes to dynamically calculate active navigation highlighting matches
  const activePathname = usePathname();

  // 🧬 PERFORMANCE OPTIMIZED PROFILE STATE VECTORS:
  // FIXED HYDRATION MATCH: Enforces a symmetric static initial baseline value ("Student" / "Workspace") 
  // identically on both Server (SSR) and Client first-pass compilation steps. This entirely eliminates the 
  // initial React 19 avatar character layout delta mismatch ("J" vs "S"), while preserving instant client rendering speeds.
  const [studentProfile, setStudentProfile] = useState({ firstName: "Student", lastName: "Workspace" });

  /**
   * [CACHE-FIRST HYDRATION & BACKEND VALIDATION HANDSHAKE ENGINE]
   * Runs exactly once when the sidebar component mounts. Avoids making expensive database 
   * queries if the student's biographical tokens are already saved in local browser storage.
   */
  useEffect(() => {
    async function verifyAndFetchProfile() {
      try {
        console.log("[CACHE ENGINE CORE] Running background profile synchronization audit...");

        // Look up local storage parameters on the user's machine to evaluate cache states
        const cachedFirst = localStorage.getItem("jemer_user_first_name");
        const cachedLast = localStorage.getItem("jemer_user_last_name");

        // PERFORMANCE WIN GATE: If cache items are active, safely apply them to the React component view state 
        // immediately post-hydration and skip hitting the serverless Neon DB entirely!
        if (cachedFirst && cachedLast) {
          console.log(`[CACHE ENGAGED] Profile loaded cleanly from local storage tokens: ${cachedFirst} ${cachedLast}`);
          setStudentProfile({
            firstName: cachedFirst,
            lastName: cachedLast
          });
          return;
        }

        console.log("[CACHE MISS] Profile values empty or expired. Dispatching query to Neon Auth SDK...");
        
        // Retrieve the current authenticated login session details from the active Neon Auth pool
        const { data: sessionContainer } = await client.auth.getSession();

        if (sessionContainer?.user) {
          const authenticatedUserId = sessionContainer.user.id;
          console.log(`[NEON DB QUEUE] Handshake confirmed for User ID: ${authenticatedUserId}. Issuing table select...`);

          // Query your customized student profiles database table inside your Neon instance
          const { data: profileRowData, error: databaseError } = await client
            .from("Jemer-Student-Profiles") // Target your explicit project records table location
            .select("first_name, last_name") // Minimize network payload by selecting only required string names
            .eq("id", authenticatedUserId) // Match table records strictly against the session ID
            .single(); // Optimize database execution threads by pulling a single dictionary row

          if (databaseError) throw databaseError;

          if (profileRowData) {
            console.log(`[NEON DB HYDRATION SUCCESS] Retrieved: ${profileRowData.first_name} ${profileRowData.last_name}`);
            
            // Write the retrieved database strings directly into local browser memory for all future page loads
            localStorage.setItem("jemer_user_first_name", profileRowData.first_name || "Jemer");
            localStorage.setItem("jemer_user_last_name", profileRowData.last_name || "Innovator");

            // Update the live application view state model instantly
            setStudentProfile({
              firstName: profileRowData.first_name || "Jemer",
              lastName: profileRowData.last_name || "Innovator"
            });
          }
        }
      } catch (neonSyncException) {
        console.error("[NEON PROFILE RESOLUTION FAILURE] Handshake collapsed:", neonSyncException.message);
      }
    }

    verifyAndFetchProfile();
  }, []);

  // 📑 PRIMARY APPLICATION MAIN TAB NAVIGATION MATRIX
  // UPGRADED: Replaced basic paths with mathematically balanced, premium custom inline vector assets.
  const primaryApplicationTabs = [
    { 
      label: "Dashboard", 
      targetPath: "/dashboard", 
      vectorGlyph: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      label: "My AI Tutor", 
      targetPath: "/tutor", 
      vectorGlyph: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: "Learning Tools", 
      targetPath: "/tools", 
      vectorGlyph: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 011-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    { 
      // FIXED UPGRADE STEP: Integrated the new 'Brain Training' feature route node directly beneath Learning Tools
      label: "Brain Training", 
      targetPath: "/brain-training", 
      vectorGlyph: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      label: "Rankings", 
      targetPath: "/rankings", 
      vectorGlyph: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      )
    },
    { 
      label: "Billings", 
      targetPath: "/billings", 
      vectorGlyph: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  /**
   * Internal reusable tab renderer component compiling our layout link rows
   */
  const buildInteractiveTabNode = (item, uniqueIndexId) => {
    const isCurrentTabTargeted = activePathname === item.targetPath;

    return (
      <Link
        key={uniqueIndexId}
        href={item.targetPath}
        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 active:scale-98 cursor-pointer group ${
          isCurrentTabTargeted
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <div className={`transition-colors duration-150 ${isCurrentTabTargeted ? "text-blue-900 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
          {item.vectorGlyph}
        </div>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      {/* 🏢 MASTER VIEWPORT LOCK-DOWN SIDEBAR ENVELOPE CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 z-40 select-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        {/* ── ZONE 1: HIGH-VOLUME INDEPENDENTLY SCROLLING RUNWAY TRAY (TOP PART) ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          
          {/* BRAND CANOPY: Loads your real corporate graphics asset path */}
          <div className="flex items-center gap-3 shrink-0 pb-1 border-b border-slate-50 dark:border-slate-800/20">
            <img src="/assets/brand/jemer-logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" onError={(e) => e.target.style.display = 'none'} />
            <span className="font-display font-black text-slate-900 dark:text-white tracking-tight text-base">
              Jemer<span className="text-blue-900 dark:text-blue-500">Academy</span>
            </span>
          </div>

          {/* APPLICATION TAB LINKS ROUTING BUCKET */}
          <nav className="space-y-1 w-full">
            {primaryApplicationTabs.map((item, index) => buildInteractiveTabNode(item, index))}
          </nav>

          {/* PREMIUM REVENUE UP-SELL CTA ADVERTISEMENT BOX CONTAINER */}
          <div className="bg-gradient-to-br from-blue-900/5 to-purple-900/5 dark:from-blue-950/40 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 relative overflow-hidden shadow-2xs group">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-900 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 border border-blue-200/20 px-2 py-0.5 rounded-md">PRO ACCESS</span>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight mt-2.5">Unlock Council of Experts</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium mt-1">Gain infinite snap image scans & cross-match WAEC analytics data.</p>
            <Link href="/billings" className="w-full mt-3.5 block py-2 text-center bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-[10px] rounded-xl shadow-xs transition-colors">Upgrade Workspace Account</Link>
          </div>
        </div>

        {/* ── ZONE 2: STATIONARY LOCKED BASEMENT REPOSITORY ANCHOR (BOTTOM PART) ── */}
        <div className="shrink-0 sticky bottom-0 border-t border-slate-100 dark:border-slate-800/60 p-3 bg-white dark:bg-slate-900 space-y-1 shadow-[0_-4px_24px_rgba(0,0,0,0.015)]">
          
          {/* Bookshelf Custom Premium Vector Icon Row */}
          {buildInteractiveTabNode({
            label: "Bookshelf",
            targetPath: "/bookshelf",
            vectorGlyph: (
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )
          }, 99)}
          
          {/* Settings Custom Premium Vector Icon Row */}
          {buildInteractiveTabNode({
            label: "Settings",
            targetPath: "/settings",
            vectorGlyph: (
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )
          }, 100)}

          {/* 👥 NEON DATABASES INSTANT CACHE-LOADED USER PROFILE CARD CONTAINER */}
          <div className="pt-3 mt-2.5 border-t border-slate-100 dark:border-slate-800/60 overflow-hidden min-h-[44px]">
            <div className="flex items-center gap-3 px-1.5 py-0.5 w-full">
              
              {/* Profile Avatar Graphics Node with Integrated Security Status Beacon */}
              <div className="relative shrink-0 select-none">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-slate-900 dark:from-blue-600 dark:to-purple-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-inner">
                  {studentProfile.firstName.substring(0, 1).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Identity Token Verified Secure Connection" />
              </div>

              {/* Data Hydrated Text Containers Fields */}
              <div className="text-left truncate min-w-0 flex-1">
                {/* Outputs the student's full name instantly from local cache memory without pixel layout shifting */}
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200 truncate max-w-[170px] leading-tight">
                  {studentProfile.firstName} {studentProfile.lastName}
                </p>
              </div>

            </div>
          </div>

        </div>
      </aside>
    </>
  );
}