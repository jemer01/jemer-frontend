/**
 * [NEW UPGRADE]
 * SUMMARY: Executed Phase 5 - Frontend State Orchestration for Agentic Tools.
 * 1. Dynamic Payload Extraction: Implemented `parseAttachments` utility to scan incoming historical logs and outbound text 
 * streams for the hidden `[SYSTEM: ...]` object key arrays.
 * 2. Message State Expansion: Upgraded `loadChatHistory` and `handleProcessOutboundPrompt` to strip the 
 * system tags from the UI and populate a dedicated `attachments` state array for the chat bubble renderers.
 * 3. Component Handshake: Injected `sessionId` into the `AITutorPromptBox` props so the R2 Direct Upload pipeline 
 * can route files to the precise active conversational session.
 * ================================================================================================
 * 🧠 JEMER ACADEMY DASHBOARD FEATURE ENGINE — MASTER AI TUTOR PAGE RUNWAY (v4.4.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow browser APIs like localStorage and React hooks

import React, { useState, useEffect, useRef } from "react"; 
import AITutorIntro from "@/jemer-components/ui/ai-tutor-intro.jsx"; 
import AIChatInterface from "@/jemer-components/ui/ai-chat-interface.jsx"; 
import AITutorPromptBox from "@/jemer-components/ui/ai-tutor-prompt-box.jsx"; 
import PersonalizationEngine from "@/jemer-components/ui/personalization.jsx"; 

// ── 🚀 ADVANCED JWT LIFECYCLE ENGINE & INTERCEPTOR ───────────────────────────────────────────────

/**
 * Safely decodes a base64 JWT string without external libraries.
 * We use this to inspect the token's internal expiration (exp) timestamp.
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
    return null; // Fails safely if the token is malformed
  }
};

/**
 * Checks if the current token is dead or will die within the specified threshold.
 * @param {string} token - The raw JWT string from local storage
 * @param {number} thresholdSeconds - The buffer time (e.g., 300 seconds = 5 mins) before true expiration
 */
const isTokenExpiringSoon = (token, thresholdSeconds = 300) => {
  if (!token) return true; 
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true; 
  
  const currentUnixTime = Math.floor(Date.now() / 1000);
  const secondsRemaining = payload.exp - currentUnixTime;
  
  return secondsRemaining < thresholdSeconds;
};

// Global singletons to prevent multiple overlapping refresh requests
let isRefreshing = false;
let refreshPromise = null;

/**
 * Forces the Neon Auth SDK to renew the session and aggressively polls local storage 
 * until it verifies the new secure token has been securely mounted.
 */
const performSilentTokenRefresh = async () => {
  if (isRefreshing) return refreshPromise; // If a refresh is already happening, return the existing promise lock

  console.log("🔄 [AUTH ENGINE] Executing silent cryptographic swap via Client SDK...");
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const oldToken = localStorage.getItem("jemer_session_jwt");

      if (typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.refreshSession === "function") {
        
        // Command the Neon SDK to execute a background session renewal
        await window.JemerAuth.refreshSession();
        
        let attempts = 0;
        const maxAttempts = 100; // Increased to 5 seconds (100 * 50ms) to guarantee Neon DB has time to respond
        
        while (attempts < maxAttempts) {
          const currentToken = localStorage.getItem("jemer_session_jwt");
          
          if (currentToken && (currentToken !== oldToken || !isTokenExpiringSoon(currentToken, 300))) {
            console.log("✅ [AUTH ENGINE] Session securely refreshed. Token matrix successfully extended.");
            return currentToken;
          }
          
          await new Promise(resolve => setTimeout(resolve, 50)); // Wait 50ms before checking the storage again
          attempts++;
        }
        
        console.warn("⚠️ [AUTH ENGINE] Mutation timeout. SDK did not update localStorage within the 5-second boundary.");
      }
      return null;
    } catch (error) {
      console.error("❌ [AUTH ENGINE] Client pipeline disruption during token swap:", error);
      return null;
    } finally {
      isRefreshing = false; // Always release the lock so future calls can execute
    }
  })();

  return refreshPromise;
};

/**
 * A specialized fetch wrapper that automatically checks token health before firing.
 * If the server returns a 401, it intercepts it, refreshes the token, and replays the request seamlessly.
 */
const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt");
  
  // Pre-flight check: If the token is already stale, renew it before we even waste a network request
  if (isTokenExpiringSoon(activeToken)) {
     console.log("⏳ [AUTH PROXY] Pre-flight TTL limit breached. Executing refresh before transit...");
     const refreshedToken = await performSilentTokenRefresh();
     if (refreshedToken) activeToken = refreshedToken;
  }

  const headers = new Headers(options.headers || {});
  if (activeToken) {
    headers.set("Authorization", `Bearer ${activeToken}`);
  }
  
  // Fire the outbound request to the backend
  let response = await fetch(url, { ...options, headers });

  // If the token expired at the exact millisecond in transit, trap the 401 error
  if (response.status === 401) {
     console.warn("⚠️ [AUTH PROXY] 401 Unauthorized intercepted. Initiating emergency synchronous mutation poll...");
     const emergencyToken = await performSilentTokenRefresh();
     
     if (emergencyToken) {
        console.log("✅ [AUTH PROXY] Emergency swap successful. Replaying exact network request behind the scenes...");
        headers.set("Authorization", `Bearer ${emergencyToken}`);
        // Re-fire the exact same request with the new fresh token!
        response = await fetch(url, { ...options, headers });
     }
  }

  return response;
};

// ── 🚀 AGENTIC SYSTEM PAYLOAD PARSER ─────────────────────────────────────────────────────────

/**
 * [NEW UPGRADE] Safely extracts the hidden Cloudflare R2 object keys from the database text strings,
 * ensuring the ugly system commands never render inside the chat bubbles while preserving the filenames.
 */
const parseAttachments = (rawText) => {
  if (!rawText) return { cleanText: "", attachments: [] };
  let text = rawText;
  let attachments = [];
  
  // Regex mapping to the exact system injection string created in ai-tutor-prompt-box.jsx
  const regex = /\[SYSTEM: The user has attached the following files to this message\. Use the 'read_workspace_files' tool to read them:\n([\s\S]*?)\]/;
  const match = text.match(regex);
  
  if (match && match[1]) {
    const rawKeys = match[1].split('\n').map(k => k.trim()).filter(Boolean);
    attachments = rawKeys.map(key => {
      // Isolate the filename from the object key path (tools/file-reader/studentID/sessionID/timestamp-filename.pdf)
      const parts = key.split('/');
      const filePart = parts[parts.length - 1]; 
      const nameParts = filePart.split('-');
      if (nameParts.length > 1) {
        nameParts.shift(); // Remove the prepended timestamp
        return nameParts.join('-'); // Rejoin just in case the filename itself had hyphens
      }
      return filePart;
    });
    // Surgically strip the system tag from the UI render text
    text = text.replace(match[0], '').trim();
  }
  
  return { cleanText: text, attachments };
};

export default function TutorPage() {
  // Core UI State Management parameters
  const [chatLog, setChatLog] = useState([]);
  const [injectedText, setInjectedText] = useState("");

  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [showGateModal, setShowGateModal] = useState(false);
  const [forceFormOverlay, setForceFormOverlay] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  const [activeSessionId, setActiveSessionId] = useState(null); // Defaults to null for fresh chats
  const [historyOffset, setHistoryOffset] = useState(0); // Tracks pagination jumps for infinite scroll
  const [hasMoreHistory, setHasMoreHistory] = useState(true); // Flags if DB history is exhausted
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Prevents overlapping fetches

  const chatContainerRef = useRef(null); // Used to snapshot scroll heights during message insertion
  const topObserverTarget = useRef(null); // Invisible anchor triggering infinite scroll

  // ── 🚀 CHAT HISTORY FETCHING LOGIC ───────────────────────────────────────────────
  
  const loadChatHistory = async (sessionId, currentOffset, isReset = false) => {
    if ((!hasMoreHistory && !isReset) || isLoadingHistory) return;

    setIsLoadingHistory(true);
    if (isReset) {
      setChatLog([]);
      setHistoryOffset(0);
      setHasMoreHistory(true);
    }

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      // Fetch the history block securely via our 401-resilient proxy
      const response = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/tutor/sessions/${sessionId}/messages?limit=30&offset=${currentOffset}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Format raw DB messages to match our UI state footprint
          const formattedLogs = data.map(msg => {
            // 🚀 NEW UPGRADE: Extract agentic attachments from historical database string rows
            const parsed = parseAttachments(msg.content || "");
            
            return {
              id: msg.id,
              sender: msg.role === "user" ? "user" : "ai",
              text: parsed.cleanText,
              attachments: parsed.attachments,
              reasoning: msg.reasoning_content || "",
              isThinking: false
            };
          });

          // Scroll Position Preservation Logic
          const prevScrollHeight = chatContainerRef.current?.scrollHeight || 0;

          setChatLog(prev => {
            // Unshift (Prepend) older messages to the TOP of the chat array
            return isReset ? formattedLogs : [...formattedLogs, ...prev];
          });
          
          setHistoryOffset(currentOffset + 30);

          // Force the scrollbar to stay exactly where the user was looking before the new messages loaded
          setTimeout(() => {
            if (!isReset && chatContainerRef.current) {
              const newScrollHeight = chatContainerRef.current.scrollHeight;
              chatContainerRef.current.scrollTop += (newScrollHeight - prevScrollHeight);
            }
          }, 0);

        } else {
          setHasMoreHistory(false); // Reached the beginning of the conversation
        }
      }
    } catch (error) {
      console.error("[TUTOR PAGE] Failed to synchronize historical chat logs:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Listen for Sidebar Events (Allows seamless routing without heavy React Context drops)
  useEffect(() => {
    const handleSessionSelect = (e) => {
      const sessionId = e.detail;
      setActiveSessionId(sessionId);
      loadChatHistory(sessionId, 0, true);
    };
    
    // Fixes "New Chat" routing bug by fully wiping pagination states alongside session strings
    const handleNewChat = () => {
      console.log("[TUTOR PAGE] 'jemer_new_chat' event intercepted. Wiping canvas to mount intro canopy...");
      setActiveSessionId(null);
      setChatLog([]);
      setInjectedText("");
      setHistoryOffset(0);         // Reset pagination counter for the next session
      setHasMoreHistory(true);     // Reset database end-of-list flag
    };

    window.addEventListener("jemer_session_selected", handleSessionSelect);
    window.addEventListener("jemer_new_chat", handleNewChat);

    return () => {
      window.removeEventListener("jemer_session_selected", handleSessionSelect);
      window.removeEventListener("jemer_new_chat", handleNewChat);
    };
  }, []);

  // Top-Anchor Intersection Observer for Reverse Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Trigger fetch when the top boundary hits the viewport, providing the user is not actively streaming
      if (entries[0].isIntersecting && activeSessionId && hasMoreHistory && !isLoadingHistory && !isStreaming) {
        console.log("[TUTOR PAGE] Top viewport boundary breached. Sideloading older dialogue context...");
        loadChatHistory(activeSessionId, historyOffset, false);
      }
    }, { threshold: 1.0 });

    if (topObserverTarget.current) {
      observer.observe(topObserverTarget.current);
    }

    return () => {
      if (topObserverTarget.current) observer.unobserve(topObserverTarget.current);
    };
  }, [activeSessionId, historyOffset, hasMoreHistory, isLoadingHistory, isStreaming]);


  // ── CORE LIFECYCLE & SECURITY GATES ─────────────────────────────────────────────────────────

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

    async function executeSmartOnboardingGateCheck() {
      try {
        console.log("[TUTOR GATING CHECK] Auditing student personalization registration keys...");
        
        const activeJwtSessionToken = localStorage.getItem("jemer_session_jwt");
        const activeUserUuidToken = localStorage.getItem("jemer_user_uuid");

        if (!activeJwtSessionToken || !activeUserUuidToken) {
          console.warn("[SECURITY REJECTION] Logged-out user detected attempting to access secure runway. Actuating immediate eviction...");
          window.location.href = "/login.html"; 
          return; 
        }

        const localCacheValidationToken = localStorage.getItem("jemer_profile_calibrated");

        if (localCacheValidationToken === "true") {
          setIsCheckingProfile(false); 
          return; 
        }

        const remoteServerHandshakeResponse = await jemerAuthenticatedFetch("/api/profile/status_check", {
          method: "GET", 
          credentials: "include", 
          headers: {
            "Content-Type": "application/json"   
          }
        });

        if (remoteServerHandshakeResponse && remoteServerHandshakeResponse.status === 401) {
          console.warn("[SECURITY EVICTION] Server engine returned absolute 401 Unauthorized flag. Flushing storage keys...");
          localStorage.removeItem("jemer_session_jwt"); 
          localStorage.removeItem("jemer_user_uuid"); 
          window.location.href = "/login.html"; 
          return;
        }

        if (!remoteServerHandshakeResponse || !remoteServerHandshakeResponse.ok) {
          setShowGateModal(true); 
          setIsCheckingProfile(false); 
          return; 
        }

        const verificationResultJSON = await remoteServerHandshakeResponse.json();

        if (verificationResultJSON.isProfileComplete === true) {
          localStorage.setItem("jemer_profile_calibrated", "true"); 
          setIsCheckingProfile(false); 
        } else {
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

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []); 

  const handleTransitionToCalibrationForm = () => {
    setShowGateModal(false); 
    setForceFormOverlay(true); 
  };

  const handlePersonalizationOnboardingSuccess = () => {
    localStorage.setItem("jemer_profile_calibrated", "true"); 
    setForceFormOverlay(false); 
  };

  const handleCaptureIntroPromptChoice = (promptTextString) => {
    setInjectedText(promptTextString); 
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // ── OUTBOUND PROMPT DISPATCHER ───────────────────────────────────────────────────────────────

  const handleProcessOutboundPrompt = async (messagePayload) => {
    if (!messagePayload || !messagePayload.promptText) return;

    let aiMessageId = "";
    
    // Manage dynamic Session IDs natively
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID(); // Generate standard secure UUID
      setActiveSessionId(currentSessionId);
    }

    // 🚀 NEW UPGRADE: Intercept and strip agentic keys from the prompt text specifically for the UI state
    const parsedPrompt = parseAttachments(messagePayload.promptText);

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
          newLog[targetIdx] = { 
            ...newLog[targetIdx], 
            text: parsedPrompt.cleanText,
            attachments: parsedPrompt.attachments 
          };
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
        text: parsedPrompt.cleanText,
        attachments: parsedPrompt.attachments 
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

    // Synchronize the pagination offset with the live database insert.
    setHistoryOffset((prevOffset) => prevOffset + 2);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const ENDPOINT_PATH = `${BACKEND_URL}/api/v1/tutor/stream`;

    try {
      // 🚀 Changed `const` to `let` so we can reassign the stream response object if we need to silently replay the fetch
      let serverStreamResponse = await jemerAuthenticatedFetch(ENDPOINT_PATH, {
        method: "POST", 
        signal: abortControllerRef.current.signal, 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_id: currentSessionId, // Bind payload to active tracked session
          tutor_id: messagePayload.selectedTutor || "jay", 
          // 🚀 CRITICAL: We pass the RAW promptText down the wire so the backend receives the [SYSTEM] files tag
          user_prompt: messagePayload.promptText, 
        }),
      });

      // Instantly dispatch a global event letting the Sidebar know a message was sent.
      window.dispatchEvent(new Event("jemer_chat_updated"));

      if (!serverStreamResponse.ok) {
        
        // 🚀 NEW UPGRADE: The Deep Replay Matrix
        // If the request completely fails the proxy and returns a 401 right as the stream starts,
        // we DO NOT wipe the screen or kick the user to login. We execute one final, aggressive background refresh.
        if (serverStreamResponse.status === 401) {
          console.warn("⚠️ [STREAM ENGINE] Absolute 401 boundary hit. Pausing stream to force a deep synchronous replay...");
          
          const emergencyReplayToken = await performSilentTokenRefresh();
          
          if (emergencyReplayToken) {
            console.log("🔄 [STREAM ENGINE] Safety net token secured! Replaying original prompt silently...");
            
            // Re-fire the stream fetch with the guaranteed fresh token
            serverStreamResponse = await fetch(ENDPOINT_PATH, {
              method: "POST", 
              signal: abortControllerRef.current.signal, 
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${emergencyReplayToken}`
              },
              body: JSON.stringify({
                session_id: currentSessionId, 
                tutor_id: messagePayload.selectedTutor || "jay", 
                user_prompt: messagePayload.promptText, 
              }),
            });

            // If the replay STILL fails, we break out and throw an error to the chat interface. No redirects!
            if (!serverStreamResponse.ok) {
               throw new Error("Authentication deeply expired. Your session could not be renewed silently.");
            }
          } else {
            // If we couldn't even get a new token, throw gracefully to the UI
            throw new Error("Neon Auth integration timeout. Connection to user identity pool lost.");
          }
        } else {
          // Handle standard 500s or 400s
          const errorPayloadText = await serverStreamResponse.text();
          throw new Error(`Server Status: ${serverStreamResponse.status}. Details: ${errorPayloadText}`);
        }
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
            // Secondary Dispatch Sync for Sidebar updates
            window.dispatchEvent(new Event("jemer_chat_updated"));
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
      
      // 🚀 NEW UPGRADE: Graceful UI Failure Handling
      // Even if everything absolutely crashes, we inject the error beautifully into the chat log 
      // instead of redirecting or breaking the layout. The user keeps all their typed history!
      setChatLog((prevLog) =>
        prevLog.map((msgItem) =>
          msgItem.id === aiMessageId
            ? { 
                ...msgItem, 
                isThinking: false, 
                text: `❌ **Connection Error:** Unable to establish reliable streaming link with backend.\n\n> *Diagnostics:* ${criticalPipelineCommunicationException.message || "Verify execution states and try again."}` 
              }
            : msgItem
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleExecuteInterruptedEditRollback = (rawPromptTextString) => {
    setInjectedText(rawPromptTextString); 
  };

  const handleProcessResponseRegeneration = (targetUserPromptRecord) => {
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
      
      <div 
        ref={chatContainerRef} // Binds reference to track scroll preservation positions
        className="flex-1 w-full overflow-y-auto pr-1 scrollbar-none pb-4 flex flex-col min-h-0 justify-start"
      >
        
        {/* Top Anchor for Reverse Pagination Loading */}
        <div ref={topObserverTarget} className="h-2 w-full shrink-0" />
        
        {isLoadingHistory && (
          <div className="w-full py-4 text-center shrink-0">
             <i className="fas fa-circle-notch fa-spin text-indigo-500 text-lg" />
             <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mt-2">Fetching Archives...</p>
          </div>
        )}

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
          sessionId={activeSessionId || "new-session"} 
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