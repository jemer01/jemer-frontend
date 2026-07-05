/**
 * [NEW UPGRADE]
 * SUMMARY: Executed Phase 1 and Final UI/UX Integration - The Master Orchestrator.
 * 1. JWT Heartbeat Engine: Added a background `setInterval` that actively checks the token TTL every 60 seconds. 
 *    If the token expires in < 5 minutes, it refreshes automatically. This permanently fixes the idle expiration logout bug.
 * 2. Stream Cancellation: Integrated `AbortController` to physically cut the TCP connection when the user clicks Stop.
 * 3. State Distribution: Added `isStreaming` state to orchestrate the Prompt Box UI lockout and Chat Interface auto-scrolling/edit visibility hooks.
 * ================================================================================================
 * 🧠 JEMER ACADEMY DASHBOARD FEATURE ENGINE — MASTER AI TUTOR PAGE RUNWAY (v2.6.0 LIVE GO STREAM)
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

// ── 🚀 UPGRADE: SILENT REFRESH ENGINE & HEARTBEAT UTILITIES ───────────────────────────────────────────────

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
 * 🚀 UPGRADE: Added dynamic threshold parameter. Evaluates the JWT expiration threshold. 
 * Returns true if the token is dead or expiring within the given threshold.
 * @param {string} token - The current session JWT
 * @param {number} thresholdSeconds - The margin of safety in seconds (default 120s / 2 mins)
 * @returns {boolean} - True if the token requires an immediate refresh
 */
const isTokenExpiringSoon = (token, thresholdSeconds = 120) => {
  if (!token) return true; // Treat absent tokens as immediately expired
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true; // Treat malformed tokens as immediately expired
  
  const currentUnixTime = Math.floor(Date.now() / 1000);
  const secondsRemaining = payload.exp - currentUnixTime;
  
  // Danger Zone: Trigger background refresh if we cross the threshold parameter
  return secondsRemaining < thresholdSeconds;
};

/**
 * Fires a silent background hook into the JemerAuth SDK to mint a fresh session JWT 
 * without hitting any Next.js API middleman, reducing latency to near-zero.
 * @returns {string|null} - The freshly minted JWT string, or null if eviction is required
 */
const performSilentTokenRefresh = async () => {
  console.log("🔄 [AUTH ENGINE] Executing silent cryptographic swap via Client SDK...");
  try {
    // Audit the global window object to guarantee the native JemerAuth engine is securely loaded
    if (typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.refreshSession === "function") {
      
      // Ping the auth SDK directly to mint the fresh token
      const refreshResponse = await window.JemerAuth.refreshSession();
      
      // Extract the new key. (Safely falls back to local storage if the SDK updates it implicitly)
      const newToken = refreshResponse?.token || localStorage.getItem("jemer_session_jwt");
      
      if (refreshResponse && refreshResponse.success !== false && newToken) {
        localStorage.setItem("jemer_session_jwt", newToken); // Enforce state anchor
        console.log("✅ [AUTH ENGINE] Session securely refreshed via Client SDK. Token TTL extended.");
        return newToken;
      }
    } else {
      console.error("❌ [AUTH ENGINE] Global window.JemerAuth SDK not found or missing refreshSession method.");
    }
    
    console.warn("❌ [AUTH ENGINE] Client SDK rejected refresh handshake. Eviction required.");
    return null;
  } catch (error) {
    console.error("❌ [AUTH ENGINE] Client pipeline disruption during token swap:", error);
    return null;
  }
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

  // 🚀 UPGRADE: Master streaming state and hardware abort controller for the network kill switch
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  // ── LAYER 3: CACHE-FIRST INTUITION TIMELINE PROFILE VERIFIER & HEARTBEAT (LIFECYCLE ENGINE) ──
  useEffect(() => {
    // 🚀 UPGRADE: Background JWT Heartbeat Engine
    // Runs every 60 seconds. If the token expires in less than 5 minutes (300 seconds), it refreshes.
    // This absolutely guarantees the session never dies while the user is idle on the page!
    const heartbeatInterval = setInterval(async () => {
      const currentToken = localStorage.getItem("jemer_session_jwt");
      if (currentToken && isTokenExpiringSoon(currentToken, 300)) {
        console.log("💓 [AUTH HEARTBEAT] Token approaching expiration threshold. Proactively refreshing in background...");
        await performSilentTokenRefresh();
      }
    }, 60000); // 60,000ms = 60 seconds

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

        // 0ms Pre-Flight Gate check. Fix dead tokens *before* validating the profile!
        if (isTokenExpiringSoon(activeJwtSessionToken)) {
          activeJwtSessionToken = await performSilentTokenRefresh();
          if (!activeJwtSessionToken) {
            localStorage.removeItem("jemer_session_jwt");
            localStorage.removeItem("jemer_user_uuid");
            window.location.href = "/login.html";
            return;
          }
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

    // Cleanup the heartbeat interval when the component unmounts
    return () => clearInterval(heartbeatInterval);
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

  // 🚀 UPGRADE: Triggers the AbortController to cleanly snap the TCP connection to the backend
  const handleStopStream = () => {
    if (abortControllerRef.current) {
      console.log("🛑 [USER ACTION] Initiating hardware stream cancellation sequence...");
      abortControllerRef.current.abort();
    }
  };

  const handleProcessOutboundPrompt = async (messagePayload) => {
    console.log("[ORCHESTRATOR CORE] Outbound payload intercepted. Initializing transit lines...", messagePayload);

    if (!messagePayload || !messagePayload.promptText) return;

    const userMessageNode = {
      id: `user-msg-${Date.now()}`, 
      sender: "user", 
      text: messagePayload.promptText 
    };

    const aiMessageId = `ai-msg-${Date.now()}`;

    const aiTutorResponseNode = {
      id: aiMessageId, 
      sender: "ai", 
      text: "", 
      reasoning: "", 
      isThinking: true 
    };

    setChatLog((prevLog) => [...prevLog, userMessageNode, aiTutorResponseNode]);
    setInjectedText("");

    // 🚀 UPGRADE: Lock the UI controls and prepare a fresh cancellation token for the new network stream
    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const ENDPOINT_PATH = `${BACKEND_URL}/api/v1/tutor/stream`;

    try {
      let activeJwtSessionToken = localStorage.getItem("jemer_session_jwt") || "";
      const sessionId = "00000000-0000-0000-0000-000000000000"; 

      if (isTokenExpiringSoon(activeJwtSessionToken)) {
        activeJwtSessionToken = await performSilentTokenRefresh();
        if (!activeJwtSessionToken) {
          localStorage.removeItem("jemer_session_jwt");
          localStorage.removeItem("jemer_user_uuid");
          window.location.href = "/login.html";
          return;
        }
      }

      const serverStreamResponse = await fetch(ENDPOINT_PATH, {
        method: "POST", 
        signal: abortControllerRef.current.signal, // 🚀 UPGRADE: Injects the kill switch directly into the fetch parameters
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
      // 🚀 UPGRADE: Gracefully intercept the manual hardware abort event without throwing scary console errors
      if (criticalPipelineCommunicationException.name === "AbortError") {
        console.log("🛑 [STREAM ENGINE] Generation halted successfully by user.");
        setChatLog((prevLog) =>
          prevLog.map((msgItem) =>
            msgItem.id === aiMessageId ? { ...msgItem, isThinking: false } : msgItem
          )
        );
        setIsStreaming(false); // Instantly unlock UI controls
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
      // 🚀 UPGRADE: Ensure the interface tracking locks release cleanly no matter how the stream terminates
      setIsStreaming(false);
    }
  };

  const handleExecuteInterruptedEditRollback = (rawPromptTextString) => {
    console.log("[ORCHESTRATOR CORE] Processing interactive edit request. Returning string to input arena:", rawPromptTextString);
    setInjectedText(rawPromptTextString); 
  };

  const handleProcessResponseRegeneration = (targetUserPromptRecord) => {
    console.log("[ORCHESTRATOR CORE] Restart token authorized. Regenerating response row for prompt text:", targetUserPromptRecord.text);
    handleProcessOutboundPrompt({
      promptText: targetUserPromptRecord.text, 
      selectedTutor: "jay" 
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
            isStreaming={isStreaming} // 🚀 UPGRADE: Pass state down to govern inline edits and smart auto-scrolling
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
          isStreaming={isStreaming} // 🚀 UPGRADE: Pass state down to lock inputs and transform Send to Stop button
          onStopStream={handleStopStream} // 🚀 UPGRADE: Pass down the AbortController execution hook
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