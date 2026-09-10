/**
 * [NEW UPGRADE]
 * SUMMARY: v4.4 Lucide SVG Icon Replacement for Settings Categories
 * 1. Replaced Emoji Icons: Replaced all legacy string emoji icons across the settings category cards with high-fidelity, native Lucide React SVG paths (`user`, `cpu`, `palette`, `lock`, `file-text`, `help-circle`, `alert-triangle`) for a professional design finish.
 * 2. Preserved Infrastructure: 100% preservation of all existing authentication flows, Neon DB synchronization, modal systems, and 2-stage state machine architecture.
 * ================================================================================================
 * ⚙️ JEMER ACADEMY MASTER SETTINGS ENGINE — 2-STAGE STATE MACHINE (v4.4)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from 'react';
import ThemeToggle from "@/jemer-components/ui/ThemeToggle.jsx";
import PersonalizationEngine from "@/jemer-components/tutor/personalization.jsx"; 

// ── 🛡️ ADVANCED SECURITY & SANITIZATION UTILITIES ──────────────────────────────────────────────

const isValidUUID = (uuid) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
};

const sanitizeString = (str, maxLength = 255) => {
  if (!str) return null;
  const cleanStr = str.replace(/[<>]/g, "").trim();
  return cleanStr.length > maxLength ? cleanStr.substring(0, maxLength) : cleanStr;
};

// ── 🚀 DETERMINISTIC JWT LIFECYCLE ENGINE & INTERCEPTOR ─────────────────────────────────────────

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
  const isReady = () =>
    typeof window !== "undefined" &&
    window.JemerAuth &&
    typeof window.JemerAuth.refreshSession === "function";

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
          if (typeof window !== "undefined") window.dispatchEvent(new Event("jemer_session_severed"));
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
        
        console.warn("⚠️ [AUTH ENGINE] Mutation timeout. SDK did not update localStorage within the 5-second boundary.");
      } else {
        console.warn("⚠️ [AUTH ENGINE] Neon Auth SDK never attached to window within the readiness window.");
      }
      
      if (typeof window !== "undefined") window.dispatchEvent(new Event("jemer_session_severed"));
      return null;
      
    } catch (error) {
      console.error("❌ [AUTH ENGINE] Client pipeline disruption during token swap:", error);
      if (typeof window !== "undefined") window.dispatchEvent(new Event("jemer_session_severed"));
      return null;
    } finally {
      isRefreshing = false;
    }
  })();

  return refreshPromise;
};

const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt");
  
  if (isTokenExpiringSoon(activeToken)) {
     console.log("⏳ [AUTH PROXY] Pre-flight TTL limit breached. Executing deterministic refresh before transit...");
     const refreshedToken = await performSilentTokenRefresh();
     if (refreshedToken) activeToken = refreshedToken;
  }

  const headers = new Headers(options.headers || {});
  if (activeToken) {
    headers.set("Authorization", `Bearer ${activeToken}`);
    headers.set("apikey", activeToken);
  }
  
  let response = await fetch(url, { ...options, headers });

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
  const [logoutReason, setLogoutReason] = useState(null);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false); 
  const [notificationModal, setNotificationModal] = useState({ isOpen: false, type: "success", title: "", message: "" }); 

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

  useEffect(() => {
    const handleSeveredSession = () => {
      setLogoutReason("severed");
      setIsLogoutModalOpen(true);
    };
    window.addEventListener("jemer_session_severed", handleSeveredSession);
    return () => window.removeEventListener("jemer_session_severed", handleSeveredSession);
  }, []);

  useEffect(() => {
    const auditTokenLifecycle = async () => {
      const currentToken = localStorage.getItem("jemer_session_jwt");
      if (currentToken && isTokenExpiringSoon(currentToken, 300)) {
        console.log("💓 [AUTH HEARTBEAT] Token approaching expiration threshold. Proactively refreshing...");
        await performSilentTokenRefresh();
      }
    };

    const heartbeatInterval = setInterval(auditTokenLifecycle, 45000); 

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("👀 [AUTH ENGINE] Tab regained focus. Auditing token TTL...");
        auditTokenLifecycle();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const initializeProfileData = async () => {
      const sessionUuid = localStorage.getItem("jemer_user_uuid");
      
      setUuid(sessionUuid || "Pending_UUID");
      setFirstName(localStorage.getItem("jemer_user_firstName") || "");
      setLastName(localStorage.getItem("jemer_user_lastName") || "");
      setEmail(localStorage.getItem("jemer_user_email") || "");

      if (!sessionUuid || !isValidUUID(sessionUuid)) {
        setIsFetchingDB(false);
        return; 
      }

      try {
        const endpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${sessionUuid}`;
        
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
          console.error("[DB GET REJECTED] Secure Database Error:", await response.text());
        }
      } catch (error) {
        console.error("[DB SYNC FAULT] Failed to execute network fetch:", error);
      } finally {
        setIsFetchingDB(false);
      }
    };

    initializeProfileData();
  }, []);

  const handleSaveTrigger = () => {
    setIsSaveConfirmOpen(true);
  };

  const executeSaveAccountChanges = async () => {
    setIsSaveConfirmOpen(false); 
    setIsSavingDB(true);

    const sessionUuid = localStorage.getItem("jemer_user_uuid");

    if (!sessionUuid || !isValidUUID(sessionUuid)) {
      console.warn("[SECURITY INTERCEPT] Invalid identity token format detected. Suspending data commit.");
      window.dispatchEvent(new Event("jemer_session_severed"));
      setIsSavingDB(false);
      return;
    }

    try {
      const endpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${sessionUuid}`;
      
      const safePayload = {
        first_name: sanitizeString(firstName, 100),
        last_name: sanitizeString(lastName, 100),
        date_of_birth: sanitizeString(dob, 20), 
        university_college: sanitizeString(university, 255),
        degree: sanitizeString(degree, 255),
        country: sanitizeString(country, 10),
        language: sanitizeString(language, 10)
      };

      const response = await jemerAuthenticatedFetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(safePayload)
      });

      if (response.ok) {
        localStorage.setItem("jemer_user_firstName", safePayload.first_name || "");
        localStorage.setItem("jemer_user_lastName", safePayload.last_name || "");
        
        setNotificationModal({
          isOpen: true,
          type: "success",
          title: "Database Synchronized",
          message: "Account identity details have been safely validated and written to the secure Jemer cloud cluster."
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("[DB PATCH FAULT]:", error);
      
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Synchronization Failed",
        message: "Database communication failed. The Authentication Engine rejected the payload structure."
      });
    } finally {
      setIsSavingDB(false);
    }
  };

  const settingsCategories = [
    { 
      id: "account", 
      title: "Account Info", 
      iconNode: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ), 
      desc: "Manage your personal credentials and bio details" 
    },
    { 
      id: "ai", 
      title: "AI & Personalization", 
      iconNode: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"/>
          <rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/>
          <path d="M20 14h2"/>
          <path d="M15 13v2"/>
          <path d="M9 13v2"/>
        </svg>
      ), 
      desc: "Configure generation parameters and tutor styles" 
    },
    { 
      id: "theme", 
      title: "Appearance & Theme", 
      iconNode: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5"/>
          <circle cx="17.5" cy="10.5" r=".5"/>
          <circle cx="8.5" cy="7.5" r=".5"/>
          <circle cx="6.5" cy="12.5" r=".5"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.55C21.965 6.48 17.465 2 12 2z"/>
        </svg>
      ), 
      desc: "Toggle contrast modes and visual density settings" 
    },
    { 
      id: "security", 
      title: "Security & Data", 
      iconNode: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ), 
      desc: "Passwords, active session tracking, and exports" 
    },
    { 
      id: "legal", 
      title: "Legal Center", 
      iconNode: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ), 
      desc: "Terms of service, privacy, and ed-tech guidelines" 
    },
    { 
      id: "help", 
      title: "Help Center", 
      iconNode: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
      ), 
      desc: "System FAQs, diagnostic support logs, and tickets" 
    },
    { 
      id: "danger", 
      title: "Account Deletion", 
      iconNode: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </svg>
      ), 
      desc: "Permanent destructive data removal", 
      isDanger: true 
    },
  ];

  const handleLogoutTrigger = () => {
    setLogoutReason(null);
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
                <i className="fas fa-circle-notch fa-spin text-2xl text-blue-600"></i>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-rose-600 lowercase tracking-normal">(Managed in Security)</span>
                  </label>
                  <input type="email" value={email} readOnly className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-80 focus:outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Country Code</label>
                  <input type="text" maxLength="2" value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} placeholder="e.g., NG" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">University / College / School</label>
                  <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g., University of Lagos" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Degree / Program</label>
                  <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g., Computer Science" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Language Interface Code</label>
                  <input type="text" maxLength="2" value={language} onChange={(e) => setLanguage(e.target.value.toLowerCase())} placeholder="e.g., en" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
              </div>
            )}

            <button 
              onClick={handleSaveTrigger}
              disabled={isSavingDB || isFetchingDB}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-8 py-3 rounded-xl text-sm font-bold mt-2 shadow-sm transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
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
          <div className="w-full animate-fade-in transition-all duration-300">
            <div className="mb-6 pl-2">
              <button 
                onClick={() => setActiveStage("overview")}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-mono p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 w-fit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Overview
              </button>
            </div>
            <PersonalizationEngine isSettingsMode={true} />
          </div>
        );

      case "theme":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Appearance & Theme</h3>
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 flex justify-between items-center w-full shadow-sm">
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
          <div className="space-y-6 animate-fade-in border border-red-500/30 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm w-full">
            <h3 className="text-xl font-display font-bold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-900 pb-4">Danger Zone: Account Deletion</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              This action is strictly permanent. All generated courses, study logs, WAEC preparation parameters, and profile data will be permanently purged from the database.
            </p>
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 font-mono">Type "DELETE" to confirm</label>
              <input type="text" placeholder="DELETE" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30" />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold mt-4 transition-colors shadow-sm">Permanently Delete Account</button>
          </div>
        );

      default:
        return (
          <div className="space-y-5 animate-fade-in text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 w-full shadow-sm">
            <span className="text-5xl block mb-4">🛠️</span>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Module Initializing</h3>
            <p className="text-sm text-slate-500 font-medium mx-auto w-full">The <span className="uppercase text-slate-700 dark:text-slate-300">{activeStage}</span> interface is structurally locked pending content population.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col space-y-6 lg:space-y-8 w-full max-w-7xl mx-auto relative">
      
      {/* HERO IDENTITY COMPONENT (Solid High-Contrast Surface) */}
      <section className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 z-10 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center p-2 sm:p-3 overflow-hidden shrink-0">
            <img 
              src="/assets/brand/jemer-logo.png" 
              alt="Jemer Academy Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-2xl font-mono text-slate-400 font-bold">JA</span>';
              }}
            />
          </div>
          
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {firstName || "Student"} {lastName}
              </h2>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md font-mono font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                {country ? `${country} 🌍` : "N/A"}
              </span>
            </div>
            <p className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-900 inline-block">
              ID: {uuid ? (uuid.includes('-') ? uuid.split('-')[0] + '...' : uuid) : 'Pending'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pt-1 max-w-lg">
              Jemer Academy Main Profile Configuration. Manage your examination parameters, system themes, and AI defaults here.
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogoutTrigger}
          className="z-10 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 md:w-auto w-full shrink-0"
        >
          <span>Log out</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </section>

      {/* STAGE 2: ACTIVE DETAIL VIEW */}
      {activeStage !== "overview" && (
        <section className={`transition-all duration-300 w-full animate-fade-in flex flex-col md:flex-row gap-8 ${
          activeStage === "ai" 
            ? "p-0 sm:p-0 border-none shadow-none bg-transparent dark:bg-transparent" 
            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
        }`}>
          
          {activeStage !== "ai" && (
            <div className="shrink-0 md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
              <button 
                onClick={() => setActiveStage("overview")}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-mono w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Overview
              </button>
            </div>
          )}
          
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
                group cursor-pointer rounded-2xl p-4 sm:p-6 border transition-all duration-200 flex items-center justify-between w-full shadow-sm hover:border-slate-300 dark:hover:border-slate-700
                ${cat.isDanger 
                  ? "bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900/50" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }
              `}
            >
              <div className="flex items-center gap-4 sm:gap-5 w-full">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl flex items-center justify-center border shadow-xs
                  ${cat.isDanger 
                    ? "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 text-red-600" 
                    : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }
                `}>
                  {cat.iconNode}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm sm:text-lg font-display font-black tracking-tight ${cat.isDanger ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1 line-clamp-1 sm:line-clamp-none">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors transform group-hover:translate-x-1 ml-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          MODAL SYSTEM (Solid Opaque Surfaces)
          ──────────────────────────────────────────────────────────────────────────────────────── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 flex items-center justify-center p-4 transition-all duration-200 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900 shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                {logoutReason === "severed" ? "Session Severed" : "Terminate Session?"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {logoutReason === "severed" 
                  ? "Secure session connection severed. Please re-authenticate." 
                  : "Are you sure you want to securely log out of your active Jemer Academy workspace? You will need to re-authenticate to access your data."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {logoutReason !== "severed" && (
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={executeLogout}
                className="w-full px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm active:scale-95 transition-all"
              >
                {logoutReason === "severed" ? "Sign In Securely" : "Yes, Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE CONFIRMATION MODAL */}
      {isSaveConfirmOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 flex items-center justify-center p-4 transition-all duration-200 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900 shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">Confirm Database Changes?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Are you sure you want to update your identity parameters? This will permanently overwrite your existing record in the live secure database.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button onClick={() => setIsSaveConfirmOpen(false)} className="w-full px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors">
                Cancel
              </button>
              <button onClick={executeSaveAccountChanges} className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm active:scale-95 transition-all">
                Yes, Synchronize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS / ERROR NOTIFICATION MODAL */}
      {notificationModal.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 flex items-center justify-center p-4 transition-all duration-200 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-xl text-center space-y-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border shadow-sm ${
              notificationModal.type === "success" 
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" 
                : "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900"
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
              className={`w-full px-5 py-3 rounded-xl text-white text-sm font-bold shadow-sm active:scale-95 transition-all ${
                notificationModal.type === "success" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
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