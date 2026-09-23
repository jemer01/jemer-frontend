/**
 * [NEW UPGRADE — v4.8 — PERSONALIZATION CALIBRATION RESET SYNC]
 * SUMMARY: Added automated local storage key eviction when wiping AI Tutor memory.
 * 1. Calibration Flag Wipe: When resetting AI memory via `resetPersonalization`,
 *    automatically removes `jemer_profile_caliberated` from `localStorage` (and fallback `jemer_profile_calibrated`).
 *    This ensures the tutor personalization gate re-triggers, forcing the student to recalibrate their study persona.
 * 2. Mobile Ergonomics & Plan B: Preserved all fluid mobile wrappers, 10-second deletion timer,
 *    and verified read-only support escalation email container.
 * ================================================================================================
 * ⚙️ JEMER ACADEMY MASTER SETTINGS ENGINE — 2-STAGE STATE MACHINE (v4.8)
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

const waitForJemerAuthReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
  const isReady = () =>
    typeof window !== "undefined" &&
    window.JemerAuth &&
    typeof window.JemerAuth.fetchJwtOnDemand === "function";

  if (isReady()) return true;

  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    if (isReady()) return true;
  }
  return false;
};

const acquireFreshAuthToken = async () => {
  const sdkIsReady = await waitForJemerAuthReady();
  if (!sdkIsReady || !window.JemerAuth) {
    console.warn("⚠️ [AUTH ENGINE] Neon Auth SDK never attached to window within the readiness window.");
    if (typeof window !== "undefined") window.dispatchEvent(new Event("jemer_session_severed"));
    return null;
  }

  const freshToken = await window.JemerAuth.fetchJwtOnDemand();
  if (!freshToken) {
    console.warn("⚠️ [AUTH ENGINE] window.JemerAuth.fetchJwtOnDemand() could not produce a valid token.");
    if (typeof window !== "undefined") window.dispatchEvent(new Event("jemer_session_severed"));
    return null;
  }

  return freshToken;
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

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  // 🛡️ SECURITY & DATA GOVERNANCE STATES
  // ─────────────────────────────────────────────────────────────────────────────────────────────
  const [allowModelTraining, setAllowModelTraining] = useState(false);
  const [isFetchingConsent, setIsFetchingConsent] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  // 🔥 DANGER ZONE & DELETION GAUNTLET STATES (10-Second Cooldown)
  // ─────────────────────────────────────────────────────────────────────────────────────────────
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteCountdown, setDeleteCountdown] = useState(10);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Countdown clock tracking
  useEffect(() => {
    let timer;
    if (isCountingDown && deleteCountdown > 0) {
      timer = setInterval(() => setDeleteCountdown(prev => prev - 1), 1000);
    } else if (deleteCountdown === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCountingDown, deleteCountdown]);

  const handleDeleteInputChange = (e) => {
    const val = e.target.value;
    setDeleteInput(val);
    
    // Automatically trigger cooldown once exact trigger keyword is typed
    if (val === "DELETE" && !isCountingDown && deleteCountdown > 0) {
      setIsCountingDown(true);
    } else if (val !== "DELETE") {
      setIsCountingDown(false);
      setDeleteCountdown(10);
    }
  };

  // Session severance detector
  useEffect(() => {
    const handleSeveredSession = () => {
      setLogoutReason("severed");
      setIsLogoutModalOpen(true);
    };
    window.addEventListener("jemer_session_severed", handleSeveredSession);
    return () => window.removeEventListener("jemer_session_severed", handleSeveredSession);
  }, []);

  // Proactive token TTL audit heartbeat
  useEffect(() => {
    const auditTokenLifecycle = async () => {
      const currentToken = localStorage.getItem("jemer_session_jwt");
      if (currentToken && window.JemerAuth && window.JemerAuth.isTokenExpiringSoon(currentToken, 300)) {
        console.log("💓 [AUTH HEARTBEAT] Token approaching expiration threshold. Proactively refreshing...");
        await acquireFreshAuthToken();
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

  // Fetch Privacy Consent from Go backend when entering security stage
  useEffect(() => {
    if (activeStage === "security") {
      const fetchConsent = async () => {
        setIsFetchingConsent(true);
        try {
          const res = await window.JemerAuth.authenticatedFetch('/api/v1/settings/privacy-consent', { method: 'GET' });
          if (res && res.ok) {
            const data = await res.json();
            setAllowModelTraining(data.allow_model_training);
          }
        } catch(e) { 
          console.error("[SETTINGS] Failed to fetch privacy consent matrix", e); 
        } finally {
          setIsFetchingConsent(false);
        }
      };
      fetchConsent();
    }
  }, [activeStage]);

  // Initial user profile database hydration
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

        const freshToken = await acquireFreshAuthToken();
        if (!freshToken) {
          return;
        }

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${freshToken}`,
            "apikey": freshToken,
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

      const response = await (async () => {
        const freshToken = await acquireFreshAuthToken();
        if (!freshToken) return null;

        return fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${freshToken}`,
            "apikey": freshToken,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify(safePayload)
        });
      })();

      if (!response) {
        return;
      }

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

  // Toggle Model Training Consent with optimistic UI
  const toggleConsent = async () => {
    const newVal = !allowModelTraining;
    setAllowModelTraining(newVal); 
    
    try {
      await window.JemerAuth.authenticatedFetch('/api/v1/settings/privacy-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allow_model_training: newVal })
      });
    } catch(e) {
      setAllowModelTraining(!newVal); 
      setNotificationModal({ isOpen: true, type: "error", title: "Sync Error", message: "Unable to commit privacy updates to the server." });
    }
  };

  // 🆕 [NEW UPGRADE: Calibration Flag Purge]
  // Wipe AI Tutor memory columns from database and reset local calibration state
  const resetPersonalization = async () => {
    if(!window.confirm("Are you sure you want to reset your AI Tutor's structural memory to factory defaults?")) return;
    
    try {
      const res = await window.JemerAuth.authenticatedFetch('/api/v1/settings/personalization/reset', { method: 'POST' });
      if (res && res.ok) {
        // 🚀 Purge the calibration flags so the user is forced to re-fill the personalization form
        localStorage.removeItem("jemer_profile_caliberated");
        localStorage.removeItem("jemer_profile_calibrated");
        sessionStorage.removeItem("jemer_profile_caliberated");

        setNotificationModal({ 
          isOpen: true, 
          type: "success", 
          title: "Memory Wiped", 
          message: "Your personalized AI Tutor memory arrays have been cleanly reset. You can now re-calibrate your learning style." 
        });
      } else {
        throw new Error("Reset rejection");
      }
    } catch(e) {
      setNotificationModal({ 
        isOpen: true, 
        type: "error", 
        title: "Action Failed", 
        message: "Could not wipe personalized tutor settings at this time." 
      });
    }
  };

  // Execute full account purge
  const executeAccountDeletion = async () => {
    setIsDeleting(true);
    try {
      const res = await window.JemerAuth.authenticatedFetch('/api/v1/settings/account', { method: 'DELETE' });
      if (res && res.ok) {
        window.JemerAuth.signOutStudent();
        window.location.href = '/signup.html';
      } else {
        throw new Error("Deletion rejection");
      }
    } catch (e) {
      setIsDeleting(false);
      setNotificationModal({ isOpen: true, type: "error", title: "Deletion Failed", message: "Could not execute the complete database account purge." });
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
      desc: "Manage personal credentials and bio details" 
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
      desc: "Toggle contrast modes and visual interface density" 
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
      desc: "Identity safeguards, data consent, and tracking" 
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
      desc: "System FAQs, diagnostic logs, and technical tickets" 
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
      desc: "Permanent destructive data removal and resets", 
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
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-2">
              <span>Account Information</span>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 truncate max-w-[140px] sm:max-w-none">
                UUID: {uuid.split('-')[0]}...
              </span>
            </h3>
            
            {isFetchingDB ? (
              <div className="w-full flex items-center justify-center p-8">
                <i className="fas fa-circle-notch fa-spin text-2xl text-blue-600"></i>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-rose-600 lowercase tracking-normal text-[10px] sm:text-[11px]">(Managed in Security)</span>
                  </label>
                  <input type="email" value={email} readOnly className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-80 focus:outline-none transition-all break-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Country Code</label>
                  <input type="text" maxLength="2" value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} placeholder="e.g., NG" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all uppercase" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">University / College / School</label>
                  <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g., University of Lagos" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Degree / Program</label>
                  <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g., Computer Science" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Language Interface Code</label>
                  <input type="text" maxLength="2" value={language} onChange={(e) => setLanguage(e.target.value.toLowerCase())} placeholder="e.g., en" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all lowercase" />
                </div>
              </div>
            )}

            <button 
              onClick={handleSaveTrigger}
              disabled={isSavingDB || isFetchingDB}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 sm:px-8 py-3.5 rounded-xl text-sm font-bold mt-2 shadow-sm transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]"
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
            <div className="mb-4 sm:mb-6 pl-1 sm:pl-2">
              <button 
                onClick={() => setActiveStage("overview")}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-mono p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 w-fit min-h-[44px]"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Appearance & Theme</h3>
            <div className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full shadow-sm">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Application Theme Mode</p>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Toggle between Light and Dark visual interfaces dynamically across your devices.</p>
              </div>
              <div className="shrink-0 pt-1 sm:pt-0">
                <ThemeToggle />
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Security & Data</h3>
            
            {/* 🛡️ Primary Email Identity Block (Plan B Support Escalation) */}
            <div className="p-4 sm:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Primary Email Address</p>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Secures account recovery and platform authentication access.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white block truncate">{email || "No email mapped"}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1 mt-0.5">
                      <i className="fas fa-check-circle"></i> Verified Primary
                    </span>
                  </div>
                </div>
                <a 
                  href="mailto:support@jemerplatforms.com?subject=Secure Email Change Request" 
                  className="w-full sm:w-auto text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
                >
                  <i className="fas fa-headset text-blue-500"></i> Contact Support to Change
                </a>
              </div>
            </div>
  
            {/* 🛡️ AI Model Training Consent Toggle Card */}
            <div className="p-4 sm:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm">AI Model Training Consent</p>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  Allow Jemer Academy to anonymously train personalized educational models on your study logs and mock evaluations. Your data is strictly encrypted and never shared externally.
                </p>
              </div>
              <div className="shrink-0 pt-1">
                {isFetchingConsent ? (
                  <i className="fas fa-circle-notch fa-spin text-slate-400 text-lg"></i>
                ) : (
                  <button 
                    onClick={toggleConsent}
                    aria-label="Toggle model training consent"
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900 min-h-[24px] ${allowModelTraining ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${allowModelTraining ? "translate-x-6" : "translate-x-0"}`}></span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case "danger":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            {/* 🔥 AI Personalization Memory Reset Card */}
            <div className="border border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm w-full">
              <h3 className="text-lg sm:text-xl font-display font-bold text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-900/50 pb-4">Reset AI Personalization Data</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                Clear your AI Tutor's structural memory. This resets academic pacing, cognitive scaffolding, and context matrices back to factory defaults without affecting your historical academic logs, mock CBT scores, or subscriptions.
              </p>
              <button 
                onClick={resetPersonalization} 
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-sm font-bold mt-4 transition-colors shadow-sm active:scale-95 min-h-[44px]"
              >
                Reset AI Memory
              </button>
            </div>
  
            {/* 🔥 Full Account Deletion Gauntlet */}
            <div className="border border-red-500/30 bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm w-full">
              <h3 className="text-lg sm:text-xl font-display font-bold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-900 pb-4">Danger Zone: Account Deletion</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                This action is strictly permanent. All generated courses, study logs, WAEC preparation parameters, and profile data will be permanently purged from the database.
              </p>
              
              <div className="space-y-2 pt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 font-mono">Type "DELETE" to confirm</label>
                <input 
                  type="text" 
                  value={deleteInput} 
                  onChange={handleDeleteInputChange} 
                  placeholder="DELETE" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 font-mono" 
                />
              </div>
              
              {/* Cooldown Timer Feedback for 10-Second Testing Window */}
              {deleteInput === "DELETE" && deleteCountdown > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400">Security Cooldown Active</span>
                  <span className="text-base sm:text-lg font-mono font-black text-red-600 dark:text-red-400">00:{deleteCountdown.toString().padStart(2, '0')}</span>
                </div>
              )}
  
              <button 
                onClick={executeAccountDeletion}
                disabled={deleteInput !== "DELETE" || deleteCountdown > 0 || isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold mt-4 transition-all shadow-sm disabled:opacity-50 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
              >
                {isDeleting ? (
                  <><i className="fas fa-circle-notch fa-spin"></i><span>Purging Database...</span></>
                ) : (
                  deleteCountdown === 0 && deleteInput === "DELETE" 
                    ? "Permanently Purge Workspace Now" 
                    : (deleteCountdown > 0 && deleteInput === "DELETE" ? `Unlocks in 00:${deleteCountdown.toString().padStart(2, '0')}` : "Permanently Delete Account")
                )}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-5 animate-fade-in text-center py-12 sm:py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 w-full shadow-sm p-4">
            <span className="text-4xl sm:text-5xl block mb-2 sm:mb-4">🛠️</span>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white">Module Initializing</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mx-auto w-full max-w-sm">The <span className="uppercase text-slate-700 dark:text-slate-300 font-bold">{activeStage}</span> interface is structurally locked pending content population.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 w-full max-w-7xl mx-auto relative px-2 sm:px-4 lg:px-0">
      
      {/* HERO IDENTITY COMPONENT */}
      <section className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 transition-colors duration-200 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 z-10 w-full min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center p-2 sm:p-3 overflow-hidden shrink-0">
            <img 
              src="/assets/brand/jemer-logo.png" 
              alt="Jemer Academy Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-xl sm:text-2xl font-mono text-slate-400 font-bold">JA</span>';
              }}
            />
          </div>
          
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight truncate">
                {firstName || "Student"} {lastName}
              </h2>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-mono font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                {country ? `${country} 🌍` : "N/A"}
              </span>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border border-blue-200 dark:border-blue-900 inline-block max-w-full truncate">
                ID: {uuid ? (uuid.includes('-') ? uuid.split('-')[0] + '...' : uuid) : 'Pending'}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium pt-0.5 max-w-lg leading-relaxed">
              Jemer Academy Main Profile Configuration. Manage your examination parameters, system themes, and AI defaults.
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogoutTrigger}
          className="z-10 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 md:w-auto w-full shrink-0 min-h-[44px]"
        >
          <span>Log out</span>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </section>

      {/* STAGE 2: ACTIVE DETAIL VIEW */}
      {activeStage !== "overview" && (
        <section className={`transition-all duration-300 w-full animate-fade-in flex flex-col md:flex-row gap-6 md:gap-8 ${
          activeStage === "ai" 
            ? "p-0 border-none shadow-none bg-transparent dark:bg-transparent" 
            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm"
        }`}>
          
          {activeStage !== "ai" && (
            <div className="shrink-0 md:w-56 lg:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-4 md:pb-0 md:pr-6">
              <button 
                onClick={() => setActiveStage("overview")}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-mono w-full p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Overview
              </button>
            </div>
          )}
          
          <div className="flex-1 w-full max-w-full min-w-0">
            {renderActiveSection()}
          </div>
        </section>
      )}

      {/* STAGE 1: VERTICAL FULL-WIDTH OVERVIEW LIST */}
      {activeStage === "overview" && (
        <section className="flex flex-col space-y-3 sm:space-y-4 animate-fade-in w-full">
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
                group cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-all duration-200 flex items-center justify-between w-full shadow-sm hover:border-slate-300 dark:hover:border-slate-700 min-h-[64px]
                ${cat.isDanger 
                  ? "bg-red-50/40 dark:bg-red-950/10 border-red-200 dark:border-red-900/40" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }
              `}
            >
              <div className="flex items-center gap-3.5 sm:gap-5 w-full min-w-0">
                <div className={`w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl flex items-center justify-center border shadow-xs
                  ${cat.isDanger 
                    ? "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 text-red-600" 
                    : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }
                `}>
                  {cat.iconNode}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm sm:text-base lg:text-lg font-display font-black tracking-tight truncate ${cat.isDanger ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors transform group-hover:translate-x-1 ml-2 sm:ml-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          MODAL SYSTEM
          ──────────────────────────────────────────────────────────────────────────────────────── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 flex items-center justify-center p-3 sm:p-4 transition-all duration-200 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-sm sm:max-w-md w-full shadow-xl text-center space-y-5 sm:space-y-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900 shadow-sm shrink-0">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
                {logoutReason === "severed" ? "Session Severed" : "Terminate Session?"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {logoutReason === "severed" 
                  ? "Secure session connection severed. Please re-authenticate." 
                  : "Are you sure you want to securely log out of your active Jemer Academy workspace? You will need to re-authenticate to access your data."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full">
              {logoutReason !== "severed" && (
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={executeLogout}
                className="w-full px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm active:scale-95 transition-all min-h-[44px]"
              >
                {logoutReason === "severed" ? "Sign In Securely" : "Yes, Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE CONFIRMATION MODAL */}
      {isSaveConfirmOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 flex items-center justify-center p-3 sm:p-4 transition-all duration-200 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-sm sm:max-w-md w-full shadow-xl text-center space-y-5 sm:space-y-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900 shadow-sm shrink-0">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">Confirm Changes?</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Are you sure you want to update your identity parameters? This will permanently overwrite your existing record in the live database.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full">
              <button onClick={() => setIsSaveConfirmOpen(false)} className="w-full px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors min-h-[44px]">
                Cancel
              </button>
              <button onClick={executeSaveAccountChanges} className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm active:scale-95 transition-all min-h-[44px]">
                Yes, Synchronize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS / ERROR NOTIFICATION MODAL */}
      {notificationModal.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 flex items-center justify-center p-3 sm:p-4 transition-all duration-200 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-xs sm:max-w-sm w-full shadow-xl text-center space-y-5 sm:space-y-6">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto border shadow-sm shrink-0 ${
              notificationModal.type === "success" 
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" 
                : "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900"
            }`}>
              {notificationModal.type === "success" ? (
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">{notificationModal.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {notificationModal.message}
              </p>
            </div>
            <button 
              onClick={() => setNotificationModal({ ...notificationModal, isOpen: false })} 
              className={`w-full px-5 py-3 rounded-xl text-white text-sm font-bold shadow-sm active:scale-95 transition-all min-h-[44px] ${
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