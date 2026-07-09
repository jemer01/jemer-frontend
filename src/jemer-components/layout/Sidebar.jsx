/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM SCALABLE SIDE PANEL FRAMEWORK (v5.5.1 ULTIMATE)
 * ================================================================================================
 * Description: Viewport-locked navigation sidebar with premium custom vector assets.
 * Performance Tier: Cache-First LocalStorage Hydration Engine (0ms Latency Loop)
 * Database Layer: Powered natively by the serverless Neon DB & Auth architecture.
 * Patch Note v5.5.1: Synchronized workspace environment monitoring parameters to align with
 * Cloud Shell proxy tracking specifications established within core dashboard runway nodes.
 * Compliance: 100% complete line-by-line developer code documentation for maximum clarity.
 * ================================================================================================
 */

"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

import React, { useState, useEffect } from "react"; // Injects standard state and lifecycle parameters from React
import Link from "next/link"; // Injects optimized client-side routing bridges to achieve instant page swaps
import { usePathname } from "next/navigation"; // Pulls the URL parser to dynamically highlight the student's active tab
// NOTE: The browser-side Neon client is intentionally NOT imported here.
// Direct browser → Neon Auth requests (*.neonauth.eu-west-2.aws.neon.tech) are blocked by
// CORS when the app is served from a *.cloudshell.dev domain. All Neon communication
// is now routed through the server-side /api/profile/me bridge route instead.

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
        // ENVIRONMENT RADAR CHECK: Pull down the active public application root URL string to verify proxy routing alignment
        const activeProxyEnvUrl = process.env.NEXT_PUBLIC_APP_URL || "localhost:3000";
        console.log(`[CACHE ENGINE CORE] Running background profile synchronization audit under context host: ${activeProxyEnvUrl}`);

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
          return; // Terminate execution early to save database transaction computing thresholds
        }

        // ── 🛡️ SERVER-SIDE BRIDGE UPGRADE ──────────────────────────────────────────────────────
        // REPLACED: client.auth.getSession() — that call was a browser → Neon Auth cross-origin
        // request (*.cloudshell.dev → *.neonauth.eu-west-2.aws.neon.tech). The browser's CORS
        // policy refused it before a single byte arrived, throwing "TypeError: Failed to fetch".
        //
        // FIX: We now call our own /api/profile/me route instead. That route runs server-side in
        // Node.js, which is entirely invisible to the browser's CORS policy. It talks to Neon
        // directly, then returns just the name strings we need. No CORS. No proxy blockade.

        // Pull the stored user UUID that page.js deposits into localStorage after login.
        const storedUserId = localStorage.getItem("jemer_user_uuid");

        if (!storedUserId) {
          // No UUID in storage means the user is not authenticated — silently bail out.
          // The login redirect in page.js already handles unauthenticated access.
          console.warn("[CACHE MISS] No jemer_user_uuid found in localStorage. Skipping server profile fetch.");
          return;
        }

        console.log(`[CACHE MISS] Profile values empty or expired. Dispatching to /api/profile/me bridge...`);

        // Call the server-side bridge route with credentials forwarded for the Cloud Shell proxy.
        const profileBridgeResponse = await fetch("/api/profile/me", {
          method: "GET",
          credentials: "include", // Forwards session cookies through the Cloud Shell HTTPS proxy
          headers: {
            "Authorization": storedUserId,    // User UUID read from localStorage
            "Content-Type": "application/json"
          }
        });

        // Guard: if the server bridge responds with a non-success status, bail silently.
        // The sidebar will stay on its default "Student Workspace" placeholder values.
        if (!profileBridgeResponse.ok) {
          console.warn(`[PROFILE BRIDGE] Server returned status ${profileBridgeResponse.status}. Keeping default display values.`);
          return;
        }

        // De-serialize the name payload returned by /api/profile/me
        const resolvedProfile = await profileBridgeResponse.json();
        const fetchedFirst = resolvedProfile.firstName || "Jemer";
        const fetchedLast  = resolvedProfile.lastName  || "Innovator";

        console.log(`[PROFILE BRIDGE SUCCESS] Hydrating sidebar with: ${fetchedFirst} ${fetchedLast}`);

        // Write the retrieved name strings back to localStorage to skip this fetch next time.
        localStorage.setItem("jemer_user_first_name", fetchedFirst);
        localStorage.setItem("jemer_user_last_name", fetchedLast);

        // Update the live React state to re-render the profile card at the sidebar bottom.
        setStudentProfile({ firstName: fetchedFirst, lastName: fetchedLast });
      } catch (neonSyncException) {
        // Captures and reports background data loading anomalies safely without interrupting main interface render loops
        console.error("[NEON PROFILE RESOLUTION FAILURE] Handshake collapsed:", neonSyncException.message);
      }
    }

    verifyAndFetchProfile(); // Execute the profile mapping synchronization block routine
  }, []); // Static tracking bounds vector running precisely once upon interface mounting sequences

  // 📑 PRIMARY APPLICATION MAIN TAB NAVIGATION MATRIX
  // UPGRADED: Replaced basic paths with mathematically balanced, premium custom inline vector assets.
  const primaryApplicationTabs = [
    { 
      label: "Dashboard", 
      targetPath: "/dashboard", 
      vectorGlyph: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      )
    },
    { 
      label: "My AI Tutor", 
      targetPath: "/tutor", 
      vectorGlyph: (
       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-astroid-icon lucide-astroid"><path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203"/></svg>
      )
    },
    { 
      label: "Learning Tools", 
      targetPath: "/tools", 
      vectorGlyph: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>
      )
    },
    { 
      // FIXED UPGRADE STEP: Integrated the new 'Brain Training' feature route node directly beneath Learning Tools
      label: "Brain Training", 
      targetPath: "/brain-training", 
      vectorGlyph: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit-icon lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
      )
    },
     { 
      // FIXED UPGRADE STEP: Integrated the new 'Brain Training' feature route node directly beneath Learning Tools
      label: "Exam Simulator", 
      targetPath: "/exam-simulator", 
      vectorGlyph: (
       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-check-icon lucide-book-open-check"><path d="M12 21V7"/><path d="m16 12 2 2 4-4"/><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/></svg>
      )
    },
    { 
      label: "Rankings", 
      targetPath: "/rankings", 
      vectorGlyph: (
       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-podium-icon lucide-podium"><path d="M12 6V2h-1"/><path d="M9 15a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1"/><path d="M9 21V11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10"/></svg>
      )
    },
    { 
      label: "Billings", 
      targetPath: "/billings", 
      vectorGlyph: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      )
    }
  ];

  /**
   * Internal reusable tab renderer component compiling our layout link rows
   */
  const buildInteractiveTabNode = (item, uniqueIndexId) => {
    // Evaluates if the current browser layout route string exactly matches the active tab destination path
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
        {/* Dynamic icon color state allocation according to routing selection flags */}
        <div className={`transition-colors duration-150 ${isCurrentTabTargeted ? "text-blue-900 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
          {item.vectorGlyph}
        </div>
        {/* Safe text clamping area preventing string values from running out of bounds */}
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {/* Mounts contextually during responsive mobile screens to block lower interactive panels and capture close events */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      {/* 🏢 MASTER VIEWPORT LOCK-DOWN SIDEBAR ENVELOPE CONTAINER */}
      {/* Restricts display constraints strictly to full height screen real estate, sliding fluidly via hardware-accelerated transforms */}
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
        {/* Sticks firmly to the bottom bounds of the panel window tray, managing persistent baseline setting configurations */}
        <div className="shrink-0 sticky bottom-0 border-t border-slate-100 dark:border-slate-800/60 p-3 bg-white dark:bg-slate-900 space-y-1 shadow-[0_-4px_24px_rgba(0,0,0,0.015)]">
          
          {/* Bookshelf Custom Premium Vector Icon Row */}
          {buildInteractiveTabNode({
            label: "Bookshelf",
            targetPath: "/bookshelf",
            vectorGlyph: (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-library-icon lucide-square-library"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7v10"/><path d="M11 7v10"/><path d="m15 7 2 10"/></svg>
            )
          }, 99)}
          
          {/* Settings Custom Premium Vector Icon Row */}
          {buildInteractiveTabNode({
            label: "Settings",
            targetPath: "/settings",
            vectorGlyph: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>
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