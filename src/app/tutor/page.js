/**
 * [NEW UPGRADE]
 * SUMMARY: Executed Advanced JWT Lifecycle Management & Anti-Eviction Resilience.
 * 1. Promise-Locked Refresh Engine: Added a global refresh lock (`isRefreshing`) to prevent concurrent race conditions 
 *    if the heartbeat, tab-focus, and user send actions happen simultaneously.
 * 2. Tab-Focus Recovery: Browsers aggressively throttle `setInterval` on inactive tabs. Added `visibilitychange` and 
 *    `focus` event listeners to instantly audit and swap the token the millisecond the user returns to the page.
 * 3. Network-Resilient Fallback (No False Logouts): Removed the aggressive front-end eviction. If a refresh fails 
 *    (e.g., due to a temporary WiFi drop), the system no longer instantly kicks the user to `/login.html`. It 
 *    attempts to use the existing token and strictly relies on a definitive `401 Unauthorized` from the Go server 
 *    to execute a true eviction.
 * ================================================================================================
 * 🧠 JEMER ACADEMY DASHBOARD FEATURE ENGINE — MASTER AI TUTOR PAGE RUNWAY (v2.8.0 LIVE GO STREAM)
 * ================================================================================================
 * Description: Viewport-locked, fixed screen layout coordinator organizing workspace view streams.
 * Fixed Strategy: Re-engineered with flex-col constraints to eliminate page scrolling completely.
 * Optimization Tier: Cache-first validation layers checking localStorage before querying Neon DB resource pools.
 * Sizing Tier: Enforces a symmetric vertical layout matching prompt box parameters (max-w-4xl).
 * Compliance: 100% complete line-by-line developer code documentation for maximum clarity.
 * ================================================================================================
 */

"use client"; // Enforces client runtime rules to permit state array mutations, browser storage access, and component mounts

import React, { useState, useEffect, useRef } from "react"; // Pulls foundational core React state tracking and lifecycle post-mount structures
import AITutorIntro from "@/jemer-components/ui/ai-tutor-intro.jsx"; // Imports the global curriculum suggestion welcome grid
import AIChatInterface from "@/jemer-components/ui/ai-chat-interface.jsx"; // Imports your matched-width interactive chat arena component
import AITutorPromptBox from "@/jemer-components/ui/ai-tutor-prompt-box.jsx"; // Imports your premium hardware-accelerated prompt control execution box
import PersonalizationEngine from "@/jemer-components/ui/personalization.jsx"; // Injects our high-fidelity multi-step wizard onboarding form component

// ── 🚀 UPGRADE: ADVANCED JWT LIFECYCLE ENGINE ───────────────────────────────────────────────

/**
 * Mathematically decodes a base64 JWT payload securely in the browser environment
 * @param {string} token - The raw JWT string pulled from local storage
 * @returns {Object|null} - The structured JSON payload containing expiration timestamps
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
 * Evaluates the JWT expiration threshold. 
 * Returns true if the token is dead or expiring within the given threshold.
 * @param {string} token - The current session JWT
 * @param {number} thresholdSeconds - The margin of safety in seconds (default 120s / 2 mins)
 * @returns {boolean} - True if the token requires an immediate refresh
 */
const isTokenExpiringSoon = (token, thresholdSeconds = 120) => {
  if (!token) return true; 
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true; 
  
  const currentUnixTime = Math.floor(Date.now() / 1000);
  const secondsRemaining = payload.exp - currentUnixTime;
  
  return secondsRemaining < thresholdSeconds;
};

// 🚀 UPGRADE: Global Promise Locks to prevent concurrent execution race conditions
let isRefreshing = false;
let refreshPromise = null;

/**
 * Fires a silent background hook into the JemerAuth SDK to mint a fresh session JWT.
 * Encapsulated within a Promise Lock to guarantee single-execution across multi-triggers.
 * @returns {string|null} - The freshly minted JWT string, or null if eviction is required
 */
const performSilentTokenRefresh = async () => {
  // If a refresh is already in transit, return the active promise to prevent duplicate API hits
  if (isRefreshing) return refreshPromise;

  console.log("🔄 [AUTH ENGINE] Executing silent cryptographic swap via Client SDK...");
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      if (typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.refreshSession === "function") {
        
        await window.JemerAuth.refreshSession();
        
        // Brief 50ms execution delay to guarantee SDK processes have flushed fully to localStorage
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const newToken = localStorage.getItem("jemer_session_jwt");
        
        if (newToken) {
          console.log("✅ [AUTH ENGINE] Session securely refreshed. Token TTL extended.");
          return newToken;
        }
      }
      console.warn("⚠️ [AUTH ENGINE] Client SDK refresh cycle returned empty constraints.");
      return null;
    } catch (error) {
      console.error("❌ [AUTH ENGINE] Client pipeline disruption during token swap:", error);
      return null;
    } finally {
      // Release the global lock so future checks can execute freely
      isRefreshing = false;
    }
  })();

  return refreshPromise;
};

/**
 * Main Interactive AI Tutor Orchestrator Canvas Page Router Component
 */
export default function TutorPage() {
  // ── LAYER 1: CONVERSATIONAL LOG ENGINE STATES ───────────────────────────────────────────────
  const [chatLog, setChatLog] = useState([]);
  const [injectedText, setInjectedText] = useState("");

  // ── LAYER 2: PERFORMANCE-OPTIMIZED SMART GATING STATE HOOKS ─────────────────────────────────
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [showGateModal, setShowGateModal] = useState(false);
  const [forceFormOverlay, setForceFormOverlay] = useState(false);

  // Master streaming state and hardware abort controller for the network kill switch
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  // ── LAYER 3: CACHE-FIRST INTUITION TIMELINE PROFILE VERIFIER & HEARTBEAT (LIFECYCLE ENGINE) ──
  useEffect(() => {
    // Shared validation routing block to evaluate tokens securely
    const auditTokenLifecycle = async () => {
      const currentToken = localStorage.getItem("jemer_session_jwt");
      // Aggressive 5-minute (300s) buffer window
      if (currentToken && isTokenExpiringSoon(currentToken, 300)) {
        console.log("💓 [AUTH HEARTBEAT] Token approaching expiration threshold. Proactively refreshing...");
        await performSilentTokenRefresh();
      }
    };

    // 🚀 UPGRADE: High-Frequency Interval (45 seconds)
    const heartbeatInterval = setInterval(auditTokenLifecycle, 45000); 

    // 🚀 UPGRADE: Tab-Focus Recovery Engine. 
    // Catches the exact moment a user returns to the page from another tab/sleep state.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("👀 [AUTH ENGINE] Tab regained focus. Auditing token TTL...");
        auditTokenLifecycle();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    // Initial Start-Up Gate Check
    async function executeSmartOnboardingGateCheck() {
      try {
        console.log("[TUTOR GATING CHECK] Auditing student personalization registration keys...");
        
        let activeJwtSessionToken = localStorage.getItem("jemer_session_jwt");
        const activeUserUuidToken = localStorage.getItem("jemer_user_uuid");

        if (!activeJwtSessionToken || !activeUserUuidToken) {
          console.warn("[SECURITY REJECTION] Logged-out user detected attempting to access secure runway. Actuating immediate eviction...");
          window.location.href = "/login.html"; 
          return; 
        }

        // 0ms Pre-Flight Gate check. 
        if (isTokenExpiringSoon(activeJwtSessionToken)) {
          const refreshedToken = await performSilentTokenRefresh();
          if (refreshedToken) {
            activeJwtSessionToken = refreshedToken;
          }
          // 🚀 UPGRADE: Removed aggressive eviction here. We rely ONLY on server 401s to evict.
        }

        const localCacheValidationToken = localStorage.getItem("jemer_profile_calibrated");

        if (localCacheValidationToken === "true") {
          console.log("[TUTOR GATING CACHE HIT] User profile validated via client memory map. Releasing gateway locks.");
          setIsCheckingProfile(false); 
          return; 
        }

        console.log("[TUTOR GATING CACHE MISS] Local token missing. Pulling profile database metrics via API handler... Same method sync verification.");

        const remoteServerHandshakeResponse = await fetch("/api/profile/status_check", {
          method: "GET", 
          credentials: "include", 
          headers: {
            "Authorization": `Bearer ${activeJwtSessionToken}`, 
            "Content-Type": "application/json"   
          }
        });

        // 🚀 THE ONLY TRUE EVICTION TRIGGER: A verified server rejection
        if (remoteServerHandshakeResponse && remoteServerHandshakeResponse.status === 401) {
          console.warn("[SECURITY EVICTION] Server engine returned 401 Unauthorized status flag. Flushing storage keys and returning user to portal.");
          localStorage.removeItem("jemer_session_jwt"); 
          localStorage.removeItem("jemer_user_uuid"); 
          window.location.href = "/login.html"; 
          return;
        }

        if (!remoteServerHandshakeResponse || !remoteServerHandshakeResponse.ok) {
          console.warn(`[TUTOR GATING API WARNING] Server endpoint returned un-hydrated configuration. Defaulting to uncalibrated profile mapping rules.`);
          setShowGateModal(true); 
          setIsCheckingProfile(false); 
          return; 
        }

        const verificationResultJSON = await remoteServerHandshakeResponse.json();

        if (verificationResultJSON.isProfileComplete === true) {
          console.log("[TUTOR GATING API VERIFIED] Complete profile records found on Neon DB. Hydrating localStorage cache line.");
          localStorage.setItem("jemer_profile_calibrated", "true"); 
          setIsCheckingProfile(false); 
        } else {
          console.warn("[TUTOR GATING INCOMPLETE] Profile fields unhydrated. Triggering beautiful onboarding warnings.");
          setShowGateModal(true); 
          setIsCheckingProfile(false); 
        }

      } catch (networkInterruptionHandshakeFault) {
        console.error("[TUTOR GATING EXCEPTION HANDLER] Network pipeline transaction failed:", networkInterruptionHandshakeFault.message);
        setShowGateModal(true); 
        setIsCheckingProfile(false); 
      }
    }

    executeSmartOnboardingGateCheck(); 

    // Lifecycle cleanup
    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []); 

  // ── LAYER 4: ONBOARDING DATA ROUTING ACTIONS CALLBACK HANDLERS ──────────────────────────────
  const handleTransitionToCalibrationForm = () => {
    setShowGateModal(false); 
    setForceFormOverlay(true); 
  };

  const handlePersonalizationOnboardingSuccess = () => {
    console.log("[ORCHESTRATOR Core Success] Database rows committed. Releasing gate variables.");
    localStorage.setItem("jemer_profile_calibrated", "true"); 
    setForceFormOverlay(false); 
  };

  // ── LAYER 5: CORE UTILITY EVENT PIPELINES ──────────────────────────────────────────────────
  const handleCaptureIntroPromptChoice = (promptTextString) => {
    console.log("[ORCHESTRATOR CORE] Suggestion tile triggered. Packaging text for injection:", promptTextString);
    setInjectedText(promptTextString); 
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      console.log("🛑 [USER ACTION] Initiating hardware stream cancellation sequence...");
      abortControllerRef.current.abort();
    }
  };

  const handleProcessOutboundPrompt = async (messagePayload) => {
    console.log("[ORCHESTRATOR CORE] Outbound payload intercepted. Initializing transit lines...", messagePayload);

    if (!messagePayload || !messagePayload.promptText) return;

    let aiMessageId = "";

    // In-place edit state reconciliation 
    if (messagePayload.editTargetId) {
      const userIdx = chatLog.findIndex(m => m.id === messagePayload.editTargetId);
      if (userIdx !== -1 && chatLog[userIdx + 1]) {
        aiMessageId = chatLog[userIdx + 1].id;
      } else {
        aiMessageId = `ai-msg-${Date.now()}`;
      }

      setChatLog((prevLog) => {
        const newLog = [...prevLog];
        const targetIdx = newLog.findIndex(m => m.id === messagePayload.editTargetId);
        
        if (targetIdx !== -1) {
          newLog[targetIdx] = { ...newLog[targetIdx], text: messagePayload.promptText };
          const truncatedLog = newLog.slice(0, targetIdx + 1);
          
          truncatedLog.push({
            id: aiMessageId,
            sender: "ai",
            text: "",
            reasoning: "",
            isThinking: true
          });
          
          return truncatedLog;
        }
        return newLog;
      });
    } else {
      const userMessageNode = {
        id: `user-msg-${Date.now()}`, 
        sender: "user", 
        text: messagePayload.promptText 
      };

      aiMessageId = `ai-msg-${Date.now()}`;

      const aiTutorResponseNode = {
        id: aiMessageId, 
        sender: "ai", 
        text: "", 
        reasoning: "", 
        isThinking: true 
      };

      setChatLog((prevLog) => [...prevLog, userMessageNode, aiTutorResponseNode]);
    }

    setInjectedText("");

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const ENDPOINT_PATH = `${BACKEND_URL}/api/v1/tutor/stream`;

    try {
      let activeJwtSessionToken = localStorage.getItem("jemer_session_jwt") || "";
      const sessionId = "00000000-0000-0000-0000-000000000000"; 

      // 🚀 UPGRADE: Safe Execution Context. Never evict on frontend failure.
      if (isTokenExpiringSoon(activeJwtSessionToken)) {
        const refreshedToken = await performSilentTokenRefresh();
        if (refreshedToken) {
          activeJwtSessionToken = refreshedToken;
        } else {
          console.warn("⚠️ [AUTH ENGINE] Pre-flight refresh anomaly. Proceeding with existing cache to test server validation limits.");
        }
      }

      const serverStreamResponse = await fetch(ENDPOINT_PATH, {
        method: "POST", 
        signal: abortControllerRef.current.signal, 
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${activeJwtSessionToken}`, 
        },
        body: JSON.stringify({
          session_id: sessionId,   
          tutor_id: messagePayload.selectedTutor || "jay", 
          user_prompt: messagePayload.promptText, 
        }),
      });

      if (!serverStreamResponse.ok) {
        const errorPayloadText = await serverStreamResponse.text();
        
        if (serverStreamResponse.status === 401) {
          localStorage.removeItem("jemer_session_jwt");
          localStorage.removeItem("jemer_user_uuid");
          window.location.href = "/login.html";
          return;
        }
        
        throw new Error(`Server Status: ${serverStreamResponse.status}. Details: ${errorPayloadText}`);
      }

      const streamBodyReader = serverStreamResponse.body.getReader();
      const characterDecoder = new TextDecoder("utf-8");
      let streamingRowBuffer = "";

      while (true) {
        const { value: packetChunkBytes, done: isNetworkClosed } = await streamBodyReader.read();
        
        if (isNetworkClosed) {
          break;
        }

        streamingRowBuffer += characterDecoder.decode(packetChunkBytes, { stream: true });
        const streamLines = streamingRowBuffer.split("\n");
        streamingRowBuffer = streamLines.pop() || "";

        for (const rawStreamLine of streamLines) {
          const trimmedStreamLine = rawStreamLine.trim();

          if (trimmedStreamLine === "") continue;

          if (trimmedStreamLine === "data: [DONE]") {
            setChatLog((prevLog) =>
              prevLog.map((msgItem) =>
                msgItem.id === aiMessageId ? { ...msgItem, isThinking: false } : msgItem
              )
            );
            break;
          }

          if (trimmedStreamLine.startsWith("data:")) {
            const cleanedJsonContentString = trimmedStreamLine.replace("data:", "").trim();

            try {
              const unpackedChunkMetrics = JSON.parse(cleanedJsonContentString);

              if (unpackedChunkMetrics.error) {
                setChatLog((prevLog) =>
                  prevLog.map((msgItem) =>
                    msgItem.id === aiMessageId
                      ? { 
                          ...msgItem, 
                          isThinking: false, 
                          text: msgItem.text + `\n\n❌ **Stream Interruption:** ${unpackedChunkMetrics.error}` 
                        }
                      : msgItem
                  )
                );
                break; 
              }

              if (unpackedChunkMetrics.reasoning_content) {
                setChatLog((prevLog) =>
                  prevLog.map((msgItem) =>
                    msgItem.id === aiMessageId
                      ? { ...msgItem, reasoning: msgItem.reasoning + unpackedChunkMetrics.reasoning_content }
                      : msgItem
                  )
                );
              }

              if (unpackedChunkMetrics.content) {
                setChatLog((prevLog) =>
                  prevLog.map((msgItem) =>
                    msgItem.id === aiMessageId
                      ? { ...msgItem, isThinking: false, text: msgItem.text + unpackedChunkMetrics.content }
                      : msgItem
                  )
                );
              }

            } catch (payloadParseAnomalyError) {
              console.warn("⚠️ Stream chunk unmarshalling phase skipped due to syntax structure mismatch:", payloadParseAnomalyError, cleanedJsonContentString);
            }
          }
        }
      }

    } catch (criticalPipelineCommunicationException) {
      if (criticalPipelineCommunicationException.name === "AbortError") {
        console.log("🛑 [STREAM ENGINE] Generation halted successfully by user.");
        setChatLog((prevLog) =>
          prevLog.map((msgItem) =>
            msgItem.id === aiMessageId ? { ...msgItem, isThinking: false } : msgItem
          )
        );
        setIsStreaming(false); 
        return;
      }

      console.error("❌ Critical streaming communication infrastructure crash occurred:", criticalPipelineCommunicationException);
      
      setChatLog((prevLog) =>
        prevLog.map((msgItem) =>
          msgItem.id === aiMessageId
            ? { 
                ...msgItem, 
                isThinking: false, 
                text: `❌ **Connection Error:** Unable to establish reliable streaming link with Cloud Run.\n\n> *Diagnostics:* ${criticalPipelineCommunicationException.message || "Verify execution states and try again."}` 
              }
            : msgItem
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleExecuteInterruptedEditRollback = (rawPromptTextString) => {
    console.log("[ORCHESTRATOR CORE] Processing interactive edit request. Returning string to input arena:", rawPromptTextString);
    setInjectedText(rawPromptTextString); 
  };

  const handleProcessResponseRegeneration = (targetUserPromptRecord) => {
    console.log("[ORCHESTRATOR CORE] Restart token authorized. Regenerating response row for prompt ID:", targetUserPromptRecord.id);
    handleProcessOutboundPrompt({
      promptText: targetUserPromptRecord.text, 
      selectedTutor: "jay",
      editTargetId: targetUserPromptRecord.id 
    });
  };

  const isConversationActive = chatLog && chatLog.length > 0;

  if (isCheckingProfile) {
    return (
      <div className="h-full w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center select-none">
        <div className="text-center font-mono space-y-2 text-xs text-slate-400 dark:text-slate-500">
          <i className="fas fa-circle-notch fa-spin text-lg text-blue-600 mb-1" />
          <p className="uppercase tracking-widest font-black">Calibrating Jemer Tutor Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 md:p-6 max-w-4xl mx-auto relative">
      
      <div className="flex-1 w-full overflow-y-auto pr-1 scrollbar-none pb-4 flex flex-col min-h-0 justify-start">
        {isConversationActive ? (
          <AIChatInterface 
            activeChatLog={chatLog} 
            onInterruptedEdit={handleExecuteInterruptedEditRollback}
            onRegenerateResponse={handleProcessResponseRegeneration}
            isStreaming={isStreaming} 
          />
        ) : (
          <div className="my-auto w-full">
            <AITutorIntro onSelectPrompt={handleCaptureIntroPromptChoice} />
          </div>
        )}
      </div>

      <div className="w-full shrink-0 pt-2 pb-2 block z-20 bg-transparent">
        <AITutorPromptBox 
          onSendMessage={handleProcessOutboundPrompt} 
          injectedPromptText={injectedText} 
          isStreaming={isStreaming} 
          onStopStream={handleStopStream} 
        />
      </div>

      {showGateModal && (
        <div className="fixed inset-0 z-[60] bg-slate-950/10 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <section aria-labelledby="onboarding-gate-title" className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-5 select-none">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-2xl border border-blue-100/30 shadow-inner flex items-center justify-center text-base mx-auto">
              <i className="fas fa-sliders-h" />
            </div>
            <div className="space-y-1.5">
              <h2 id="onboarding-gate-title" className="text-lg font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">Profile Setup Required!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium leading-relaxed px-1">Welcome to Jemer Academy! To deliver highly tailored study tracks and context-aware analogies, you must configure your personalization matrix before utilizing conversational tutors.</p>
            </div>
            <button type="button" onClick={handleTransitionToCalibrationForm} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-500/10 active:scale-[0.98] cursor-pointer">Configure Learning Profile</button>
          </section>
        </div>
      )}

      {forceFormOverlay && (
        <div className="fixed inset-0 w-screen h-screen bg-slate-50 dark:bg-slate-950 z-[100] overflow-y-auto p-3 sm:p-6 md:p-10 transition-colors duration-300 flex items-start justify-center">
          <div className="w-full my-auto">
            <PersonalizationEngine onSaveComplete={handlePersonalizationOnboardingSuccess} />
          </div>
        </div>
      )}

    </div>
  );
}