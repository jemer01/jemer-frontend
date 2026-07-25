"use client";

/**
 * ================================================================================================
 * ⚙️ JEMER ACADEMY MASTER SETTINGS ENGINE — 2-STAGE STATE MACHINE
 * 
 * 🆕 NEW UPGRADES BUILT (v3.0 - ADVANCED AUTH INTERCEPTOR & MODAL UX):
 * 1. Silent JWT Auto-Refresh Engine: Ported the master auth logic (`isTokenExpiringSoon`, 
 *    `performSilentTokenRefresh`, `jemerAuthenticatedFetch`) from the Tutor runway. This completely 
 *    prevents the Neon DB `400 Bad Request` expired-token crash by intercepting network requests, 
 *    silently refreshing the session via the Neon SDK, and seamlessly replaying the fetch.
 * 2. Neon API Headers Fix: The proxy now auto-injects BOTH `Authorization: Bearer <token>` AND 
 *    `apikey: <token>` into every request, fulfilling PostgREST's strict requirements.
 * 3. Custom CSS Save Modals: Eliminated native `alert()` calls. Clicking "Save Changes" now 
 *    triggers a beautiful CSS confirmation modal (matching the logout aesthetic). Upon success 
 *    or failure, a dedicated notification modal smoothly displays the result.
 * ================================================================================================
 */

import React, { useState, useEffect } from 'react';
import ThemeToggle from "@/jemer-components/ui/ThemeToggle.jsx";

// ── 🚀 ADVANCED JWT LIFECYCLE ENGINE & INTERCEPTOR ───────────────────────────────────────────────

/**
 * Safely decodes a base64 JWT string to inspect the expiration (exp) timestamp.
 */
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

/**
 * Checks if the current token is dead or will die within the buffer threshold (default 5 mins).
 */
const isTokenExpiringSoon = (token, thresholdSeconds = 300) => {
  if (!token) return true; 
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true; 
  const currentUnixTime = Math.floor(Date.now() / 1000);
  return (payload.exp - currentUnixTime) < thresholdSeconds;
};

// Global singletons to prevent multiple overlapping refresh requests
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

const performSilentTokenRefresh = async () => {
  if (isRefreshing) return refreshPromise; 
  console.log("🔄 [AUTH ENGINE] Executing silent cryptographic swap via Client SDK...");
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const oldToken = localStorage.getItem("jemer_session_jwt");
      const sdkIsReady = await waitForAuthSDKReady();

      if (sdkIsReady) {
        const refreshOutcome = await window.JemerAuth.refreshSession();

        if (refreshOutcome && refreshOutcome.success === false) {
          console.warn("⚠️ [AUTH ENGINE] JemerAuth.refreshSession() explicitly failed:", refreshOutcome.message);
          return null;
        }
        
        let attempts = 0;
        const maxAttempts = 100; 
        
        while (attempts < maxAttempts) {
          const currentToken = localStorage.getItem("jemer_session_jwt");
          if (currentToken && (currentToken !== oldToken || !isTokenExpiringSoon(currentToken, 300))) {
            console.log("✅ [AUTH ENGINE] Session securely refreshed. Token matrix successfully extended.");
            return currentToken;
          }
          await new Promise(resolve => setTimeout(resolve, 50)); 
          attempts++;
        }
        console.warn("⚠️ [AUTH ENGINE] Mutation timeout. SDK did not update localStorage.");
      }
      return null;
    } catch (error) {
      console.error("❌ [AUTH ENGINE] Client pipeline disruption during token swap:", error);
      return null;
    } finally {
      isRefreshing = false; 
    }
  })();

  return refreshPromise;
};

/**
 * 🚀 Master Network Proxy for Neon DB PostgREST API
 * Intercepts JWT expirations, silently refreshes, injects the `apikey` header, and replays requests.
 */
const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt");
  
  if (isTokenExpiringSoon(activeToken)) {
     console.log("⏳ [AUTH PROXY] Pre-flight TTL limit breached. Executing refresh before transit...");
     const refreshedToken = await performSilentTokenRefresh();
     if (refreshedToken) activeToken = refreshedToken;
  }

  const headers = new Headers(options.headers || {});
  if (activeToken) {
    headers.set("Authorization", `Bearer ${activeToken}`);
    headers.set("apikey", activeToken); // 🆕 Required by Neon DB PostgREST
  }
  
  let response = await fetch(url, { ...options, headers });

  // Neon PostgREST throws 400 for Expired JWTs, standard systems throw 401. We catch both.
  if (response.status === 400 || response.status === 401) {
     const clonedRes = response.clone();
     const errorText = await clonedRes.text().catch(() => "");
     
     if (response.status === 401 || errorText.includes("JWT token has expired")) {
         console.warn("⚠️ [AUTH PROXY] Token expiry intercepted in transit. Initiating emergency synchronous mutation poll...");
         const emergencyToken = await performSilentTokenRefresh();
         
         if (emergencyToken) {
            console.log("✅ [AUTH PROXY] Emergency swap successful. Replaying exact network request behind the scenes...");
            headers.set("Authorization", `Bearer ${emergencyToken}`);
            headers.set("apikey", emergencyToken);
            response = await fetch(url, { ...options, headers });
         } else {
            console.warn("❌ [AUTH PROXY] Emergency token swap failed. Session permanently degraded.");
         }
     }
  }

  return response;
};

export default function SettingsEngine() {
  const [activeStage, setActiveStage] = useState("overview");

  // Modal States
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false); // 🆕 DB Save Confirmation
  const [notificationModal, setNotificationModal] = useState({ isOpen: false, type: "success", title: "", message: "" }); // 🆕 Success/Error Notification

  // Real User Data States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [uuid, setUuid] = useState("");
  
  // Loading & Network Transaction States
  const [isFetchingDB, setIsFetchingDB] = useState(true);
  const [isSavingDB, setIsSavingDB] = useState(false);

  // Real Neon DB Data Hydration via Proxy
  useEffect(() => {
    const initializeProfileData = async () => {
      const sessionUuid = localStorage.getItem("jemer_user_uuid");
      
      setUuid(sessionUuid || "Pending_UUID");
      setFirstName(localStorage.getItem("jemer_user_firstName") || "");
      setLastName(localStorage.getItem("jemer_user_lastName") || "");
      setEmail(localStorage.getItem("jemer_user_email") || "");

      if (!sessionUuid || sessionUuid.length < 10) {
        setIsFetchingDB(false);
        return; 
      }

      try {
        const endpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${sessionUuid}`;
        
        // 🚀 Bypasses standard fetch to utilize the Auto-Refresh Engine
        const response = await jemerAuthenticatedFetch(endpoint, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const payload = await response.json();
          if (payload && payload.length > 0) {
            const profile = payload[0];
            setFirstName(profile.first_name || "");
            setLastName(profile.last_name || "");
            setEmail(profile.email || "");
            setDob(profile.date_of_birth || "");
            setUniversity(profile.university_college || "");
            setDegree(profile.degree || "");
            setCountry(profile.country || "");
            setLanguage(profile.language || "");
          }
        } else {
          console.error("[DB GET REJECTED] Postgres/REST Error:", await response.text());
        }
      } catch (error) {
        console.error("[DB SYNC FAULT] Failed to execute network fetch:", error);
      } finally {
        setIsFetchingDB(false);
      }
    };

    initializeProfileData();
  }, []);

  // Modal Triggers
  const handleSaveTrigger = () => {
    setIsSaveConfirmOpen(true);
  };

  const executeSaveAccountChanges = async () => {
    setIsSaveConfirmOpen(false); // Close confirmation modal
    setIsSavingDB(true);

    const sessionUuid = localStorage.getItem("jemer_user_uuid");

    try {
      const endpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${sessionUuid}`;
      
      const safePayload = {
        first_name: firstName || null,
        last_name: lastName || null,
        date_of_birth: dob || null, 
        university_college: university || null,
        degree: degree || null,
        country: country || null,
        language: language || null
      };

      // 🚀 Utilizing Auto-Refresh Proxy Engine
      const response = await jemerAuthenticatedFetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(safePayload)
      });

      if (response.ok) {
        localStorage.setItem("jemer_user_firstName", firstName);
        localStorage.setItem("jemer_user_lastName", lastName);
        
        // Trigger Success Modal
        setNotificationModal({
          isOpen: true,
          type: "success",
          title: "Database Synchronized",
          message: "Account identity details have been successfully written to the secure Database cluster."
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("[DB PATCH FAULT]:", error);
      
      // Trigger Error Modal
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Synchronization Failed",
        message: "Database communication failed. The API rejected the payload structure."
      });
    } finally {
      setIsSavingDB(false);
    }
  };

  const settingsCategories = [
    { id: "account", title: "Account Info", icon: "👤", desc: "Manage your personal credentials and bio details" },
    { id: "ai", title: "AI & Personalization", icon: "🤖", desc: "Configure generation parameters and tutor styles" },
    { id: "theme", title: "Appearance & Theme", icon: "🌗", desc: "Toggle contrast modes and visual density settings" },
    { id: "security", title: "Security & Data", icon: "🔐", desc: "Passwords, active session tracking, and exports" },
    { id: "legal", title: "Legal Center", icon: "📜", desc: "Terms of service, privacy, and ed-tech guidelines" },
    { id: "help", title: "Help Center", icon: "❓", desc: "System FAQs, diagnostic support logs, and tickets" },
    { id: "danger", title: "Account Deletion", icon: "⚠️", desc: "Permanent destructive data removal", isDanger: true },
  ];

  const handleLogoutTrigger = () => {
    setIsLogoutModalOpen(true);
  };

  const executeLogout = () => {
    window.location.href = '/login.html';
  };

  const renderActiveSection = () => {
    switch (activeStage) {
      case "account":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
              <span>Account Information</span>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 truncate max-w-[120px] sm:max-w-none">
                UUID: {uuid.split('-')[0]}...
              </span>
            </h3>
            
            {isFetchingDB ? (
              <div className="w-full flex items-center justify-center p-8">
                <i className="fas fa-circle-notch fa-spin text-2xl text-blue-500"></i>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-rose-500 lowercase tracking-normal">(Managed in Security)</span>
                  </label>
                  <input type="email" value={email} readOnly className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-80 focus:outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Country Code</label>
                  <input type="text" maxLength="2" value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} placeholder="e.g., NG" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">University / College / School</label>
                  <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g., University of Lagos" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Degree / Program</label>
                  <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g., Computer Science" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Language Interface Code</label>
                  <input type="text" maxLength="2" value={language} onChange={(e) => setLanguage(e.target.value.toLowerCase())} placeholder="e.g., en" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
              </div>
            )}

            <button 
              onClick={handleSaveTrigger}
              disabled={isSavingDB || isFetchingDB}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-8 py-3 rounded-xl text-sm font-bold mt-2 shadow-md transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSavingDB ? (
                <><i className="fas fa-circle-notch fa-spin"></i><span>Saving...</span></>
              ) : (
                <span>Save Database Changes</span>
              )}
            </button>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">AI & Personalization Engine</h3>
            <div className="space-y-4 w-full">
              <div className="p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 transition-colors w-full">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-2.5">Default Tutor Tone</label>
                <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none cursor-pointer">
                  <option>Strict & Concise</option>
                  <option>Detailed Step-by-Step</option>
                  <option>WAEC / JAMB Exam Focused</option>
                </select>
              </div>
              <div className="p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center group cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Vid2Notes Auto-Processing</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Automatically extract transcripts when a video link is pasted.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center p-1 shrink-0 shadow-inner">
                  <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case "theme":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Appearance & Theme</h3>
            <div className="p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center w-full transition-colors">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Application Theme Mode</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Toggle between Light and Dark visual interfaces dynamically.</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        );

      case "danger":
        return (
          <div className="space-y-6 animate-fade-in border-2 border-red-500/20 bg-red-50/80 dark:bg-red-950/20 p-6 sm:p-8 rounded-3xl shadow-sm w-full">
            <h3 className="text-xl font-display font-bold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-900/50 pb-4">Danger Zone: Account Deletion</h3>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-300 leading-relaxed">
              This action is strictly permanent. All generated courses, study logs, WAEC preparation parameters, and profile data will be permanently purged from the database.
            </p>
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-red-500 font-mono">Type "DELETE" to confirm</label>
              <input type="text" placeholder="DELETE" className="w-full bg-white dark:bg-black border border-red-300 dark:border-red-900/80 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30" />
            </div>
            <button className="w-full bg-red-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold mt-4 hover:bg-red-700 transition-colors shadow-md">Permanently Delete Account</button>
          </div>
        );

      default:
        return (
          <div className="space-y-5 animate-fade-in text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/30 dark:bg-slate-950/30 w-full">
            <span className="text-5xl block mb-4">🛠️</span>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Module Initializing</h3>
            <p className="text-sm text-slate-500 font-medium mx-auto w-full">The <span className="uppercase text-slate-700 dark:text-slate-300">{activeStage}</span> interface is structurally locked pending content population.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col space-y-6 lg:space-y-8 w-full max-w-7xl mx-auto relative">
      
      {/* HERO IDENTITY COMPONENT */}
      <section className="w-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300 relative overflow-hidden group hover:shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 z-10 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-950 border-[3px] border-slate-100 dark:border-slate-800 shadow-md flex items-center justify-center p-2 sm:p-3 overflow-hidden shrink-0 transition-transform group-hover:scale-105 duration-300">
            <img 
              src="/assets/brand/jemer-logo.png" 
              alt="Jemer Academy Logo" 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-2xl font-mono text-slate-400 font-bold">JA</span>';
              }}
            />
          </div>
          
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                {firstName || "Student"} {lastName}
              </h2>
              <span className="text-[10px] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
                {country ? `${country} 🌍` : "N/A"}
              </span>
            </div>
            <p className="text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded border border-blue-100 dark:border-blue-800/50 inline-block">
              ID: {uuid ? uuid.split('-')[0] + '...' : 'Pending'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pt-1 max-w-lg">
              Jemer Academy Main Profile Configuration. Manage your examination parameters, system themes, and AI defaults here.
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogoutTrigger}
          className="z-10 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 md:w-auto w-full shrink-0 hover:border-red-200 dark:hover:border-red-900/50"
        >
          <span>Log out</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </section>

      {/* STAGE 2: ACTIVE DETAIL VIEW */}
      {activeStage !== "overview" && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 w-full animate-fade-in flex flex-col md:flex-row gap-8">
          <div className="shrink-0 md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
            <button 
              onClick={() => setActiveStage("overview")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-mono w-full p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Overview
            </button>
          </div>
          
          <div className="flex-1 w-full max-w-full">
            {renderActiveSection()}
          </div>
        </section>
      )}

      {/* STAGE 1: VERTICAL FULL-WIDTH OVERVIEW LIST */}
      {activeStage === "overview" && (
        <section className="flex flex-col space-y-4 animate-fade-in w-full">
          {settingsCategories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => {
                if (cat.id === "legal") {
                  window.location.href = "/legal-center.html";
                } else if (cat.id === "help") {
                  window.location.href = "/help-center";
                } else {
                  setActiveStage(cat.id);
                }
              }}
              className={`
                group cursor-pointer rounded-2xl p-4 sm:p-6 border transition-all duration-300 flex items-center justify-between w-full hover:-translate-y-0.5 hover:shadow-md
                ${cat.isDanger 
                  ? "bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-800" 
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600"
                }
              `}
            >
              <div className="flex items-center gap-4 sm:gap-5 w-full">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner border
                  ${cat.isDanger 
                    ? "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 text-red-600" 
                    : "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors"
                  }
                `}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm sm:text-lg font-display font-extrabold tracking-tight ${cat.isDanger ? "text-red-700 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1.5 line-clamp-1 sm:line-clamp-none">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors transform group-hover:translate-x-1 ml-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          MODAL SYSTEM: LOGOUT, SAVE CONFIRMATION, & NOTIFICATIONS
          ──────────────────────────────────────────────────────────────────────────────────────── */}
      
      {/* 1. LOGOUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-slide-up relative">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-800/50 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">Terminate Session?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Are you sure you want to securely log out of your active Jemer Academy workspace? You will need to re-authenticate to access your data.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button onClick={() => setIsLogoutModalOpen(false)} className="w-full px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors focus:outline-none">
                Cancel
              </button>
              <button onClick={executeLogout} className="w-full px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all focus:outline-none">
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SAVE CONFIRMATION MODAL */}
      {isSaveConfirmOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-slide-up relative">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800/50 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">Confirm Database Changes?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Are you sure you want to update your identity parameters? This will permanently overwrite your existing record in the live Our Database.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button onClick={() => setIsSaveConfirmOpen(false)} className="w-full px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors focus:outline-none">
                Cancel
              </button>
              <button onClick={executeSaveAccountChanges} className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all focus:outline-none">
                Yes, Synchronize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUCCESS / ERROR NOTIFICATION MODAL */}
      {notificationModal.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-slide-up relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border shadow-inner ${
              notificationModal.type === "success" 
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" 
                : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
            }`}>
              {notificationModal.type === "success" ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">{notificationModal.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {notificationModal.message}
              </p>
            </div>
            <button 
              onClick={() => setNotificationModal({ ...notificationModal, isOpen: false })} 
              className={`w-full px-5 py-3 rounded-xl text-white text-sm font-bold shadow-md active:scale-95 transition-all focus:outline-none ${
                notificationModal.type === "success" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
              }`}
            >
              {notificationModal.type === "success" ? "Got it" : "Close"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}