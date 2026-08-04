"use client";

/**
 * [NEW UPGRADE]
 * SUMMARY: On-Demand JWT Architecture.
 * 1. On-Demand JWT Fetch: Removed the expensive 45-second background polling loops (`setInterval`).
 *    The system now strictly executes a pre-flight token fetch via the Neon Auth SDK 
 *    right before dispatching API calls or sending prompt messages.
 * 2. Hard Security Redirects: If local storage lacks a JWT, or the SDK fails to refresh,
 *    the application instantly evicts the user to `/login.html` instead of throwing silent errors.
 * 3. Optimized Comments: Removed outdated legacy upgrade headers to save processing tokens.
 */

import React, { useState, useEffect, useRef } from "react"; 
import AITutorIntro from "@/jemer-components/tutor/ai-tutor-intro.jsx"; 
import AIChatInterface from "@/jemer-components/tutor/ai-chat-interface.jsx"; 
import AITutorPromptBox from "@/jemer-components/tutor/ai-tutor-prompt-box.jsx"; 
import PersonalizationEngine from "@/jemer-components/tutor/personalization.jsx"; 

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
  const isReady = () => typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.refreshSession === "function";
  if (isReady()) return true;
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    if (isReady()) return true;
  }
  return false;
};

// 🚀 ON-DEMAND JWT FETCHER
const fetchJwtOnDemand = async () => {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const sdkIsReady = await waitForAuthSDKReady();
      if (sdkIsReady) {
        const refreshOutcome = await window.JemerAuth.refreshSession();
        if (refreshOutcome && refreshOutcome.success === false) return null;
        
        let attempts = 0;
        while (attempts < 100) {
          const currentToken = localStorage.getItem("jemer_session_jwt");
          if (currentToken && !isTokenExpiringSoon(currentToken, 300)) {
            return currentToken;
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
        }
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      isRefreshing = false;
    }
  })();

  return refreshPromise;
};

const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt");
  
  if (!activeToken || isTokenExpiringSoon(activeToken, 300)) {
     activeToken = await fetchJwtOnDemand();
     if (!activeToken) {
         window.location.href = "/login.html";
         return new Response(null, { status: 401 });
     }
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${activeToken}`);
  headers.set("apikey", activeToken); 
  
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 400) {
     const emergencyToken = await fetchJwtOnDemand();
     if (emergencyToken) {
        headers.set("Authorization", `Bearer ${emergencyToken}`);
        headers.set("apikey", emergencyToken);
        response = await fetch(url, { ...options, headers });
     } else {
        window.location.href = "/login.html";
     }
  }

  return response;
};

export default function TutorPage() {
  const [chatLog, setChatLog] = useState([]);
  const [injectedText, setInjectedText] = useState("");
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isSessionExpiring, setIsSessionExpiring] = useState(false); 
  const [showGateModal, setShowGateModal] = useState(false);
  const [forceFormOverlay, setForceFormOverlay] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  const [activeSessionId, setActiveSessionId] = useState(null); 
  const [historyOffset, setHistoryOffset] = useState(0); 
  const [hasMoreHistory, setHasMoreHistory] = useState(true); 
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); 

  const chatContainerRef = useRef(null); 
  const topObserverTarget = useRef(null); 

  const loadChatHistory = async (sessionId, currentOffset, isReset = false) => {
    if ((!hasMoreHistory && !isReset) || isLoadingHistory) return;

    setIsLoadingHistory(true);
    if (isReset) {
      setChatLog([]);
      setHistoryOffset(0);
      setHasMoreHistory(true);
    }

    try {
      const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
        (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" : 
         activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" : 
         "http://localhost:8080");

      const response = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/tutor/sessions/${sessionId}/messages?limit=30&offset=${currentOffset}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const formattedLogs = data.map(msg => ({
            id: msg.id,
            sender: msg.role === "user" ? "user" : "ai",
            text: msg.content || "",
            reasoning: msg.reasoning_content || "",
            isThinking: false
          }));

          const prevScrollHeight = chatContainerRef.current?.scrollHeight || 0;

          setChatLog(prev => isReset ? formattedLogs : [...formattedLogs, ...prev]);
          setHistoryOffset(currentOffset + 30);

          setTimeout(() => {
            if (!isReset && chatContainerRef.current) {
              const newScrollHeight = chatContainerRef.current.scrollHeight;
              chatContainerRef.current.scrollTop += (newScrollHeight - prevScrollHeight);
            }
          }, 0);
        } else {
          setHasMoreHistory(false); 
        }
      }
    } catch (error) {
      console.error("[TUTOR PAGE] Failed to synchronize historical chat logs:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    const handleSessionSelect = (e) => {
      const sessionId = e.detail;
      setActiveSessionId(sessionId);
      loadChatHistory(sessionId, 0, true);
    };
    
    const handleNewChat = () => {
      setActiveSessionId(null);
      setChatLog([]);
      setInjectedText("");
      setHistoryOffset(0);         
      setHasMoreHistory(true);     
    };

    window.addEventListener("jemer_session_selected", handleSessionSelect);
    window.addEventListener("jemer_new_chat", handleNewChat);

    return () => {
      window.removeEventListener("jemer_session_selected", handleSessionSelect);
      window.removeEventListener("jemer_new_chat", handleNewChat);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && activeSessionId && hasMoreHistory && !isLoadingHistory && !isStreaming) {
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

  useEffect(() => {
    async function executeSmartOnboardingGateCheck() {
      try {
        const activeJwtSessionToken = localStorage.getItem("jemer_session_jwt");
        const activeUserUuidToken = localStorage.getItem("jemer_user_uuid");

        if (!activeJwtSessionToken || !activeUserUuidToken) {
          window.location.href = "/login.html"; 
          return; 
        }

        const localCacheValidationToken = localStorage.getItem("jemer_profile_calibrated");
        if (localCacheValidationToken === "true") {
          setIsCheckingProfile(false); 
          return; 
        }

        const remoteServerHandshakeResponse = await jemerAuthenticatedFetch(
          `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${activeUserUuidToken}`, 
          { method: "GET", headers: { "Accept": "application/json" } }
        );

        if (remoteServerHandshakeResponse && remoteServerHandshakeResponse.status === 401) {
          setIsSessionExpiring(true);
          localStorage.removeItem("jemer_session_jwt"); 
          localStorage.removeItem("jemer_user_uuid"); 
          setTimeout(() => { window.location.href = "/login.html"; }, 1200); 
          return;
        }

        if (!remoteServerHandshakeResponse || !remoteServerHandshakeResponse.ok) {
          setShowGateModal(true); 
          setIsCheckingProfile(false); 
          return; 
        }

        const profileData = await remoteServerHandshakeResponse.json();

        if (profileData && profileData.length > 0 && profileData[0].academic_level_pacing_tier) {
          localStorage.setItem("jemer_profile_calibrated", "true"); 
          setIsCheckingProfile(false); 
        } else {
          setShowGateModal(true); 
          setIsCheckingProfile(false); 
        }
      } catch (e) {
        setShowGateModal(true); 
        setIsCheckingProfile(false); 
      }
    }

    executeSmartOnboardingGateCheck(); 
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

  const handleProcessOutboundPrompt = async (messagePayload) => {
    if (!messagePayload || !messagePayload.promptText) return;

    // 🚀 ON-DEMAND PRE-FLIGHT CHECK: Fetch JWT from Neon SDK right before the network request
    const onDemandToken = await fetchJwtOnDemand();
    if (!onDemandToken && (!localStorage.getItem("jemer_session_jwt") || isTokenExpiringSoon(localStorage.getItem("jemer_session_jwt"), 60))) {
        window.location.href = "/login.html";
        return;
    }

    let aiMessageId = "";
    let currentSessionId = activeSessionId;
    
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID(); 
      setActiveSessionId(currentSessionId);
    }

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
          
          truncatedLog.push({ id: aiMessageId, sender: "ai", text: "", reasoning: "", isThinking: true });
          return truncatedLog;
        }
        return newLog;
      });
    } else {
      const userMessageNode = { id: `user-msg-${Date.now()}`, sender: "user", text: messagePayload.promptText };
      aiMessageId = `ai-msg-${Date.now()}`;
      const aiTutorResponseNode = { id: aiMessageId, sender: "ai", text: "", reasoning: "", isThinking: true };

      setChatLog((prevLog) => [...prevLog, userMessageNode, aiTutorResponseNode]);
    }

    setInjectedText("");
    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    setHistoryOffset((prevOffset) => prevOffset + 2);

    const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
      (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" : 
       activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" : 
       "http://localhost:8080");
    const ENDPOINT_PATH = `${BACKEND_URL}/api/v1/tutor/stream`;

    try {
      let serverStreamResponse = await jemerAuthenticatedFetch(ENDPOINT_PATH, {
        method: "POST", 
        signal: abortControllerRef.current.signal, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: currentSessionId, 
          tutor_id: messagePayload.selectedTutor || "jay", 
          user_prompt: messagePayload.promptText, 
        }),
      });

      window.dispatchEvent(new Event("jemer_chat_updated"));

      if (!serverStreamResponse.ok) {
        if (serverStreamResponse.status === 401) {
          const emergencyReplayToken = await fetchJwtOnDemand();
          if (emergencyReplayToken) {
            serverStreamResponse = await fetch(ENDPOINT_PATH, {
              method: "POST", 
              signal: abortControllerRef.current.signal, 
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${emergencyReplayToken}`,
                "apikey": emergencyReplayToken
              },
              body: JSON.stringify({
                session_id: currentSessionId, 
                tutor_id: messagePayload.selectedTutor || "jay", 
                user_prompt: messagePayload.promptText, 
              }),
            });

            if (!serverStreamResponse.ok) {
               throw new Error("Authentication deeply expired. Your session could not be renewed silently.");
            }
          } else {
            throw new Error("Neon Auth integration timeout. Connection to user identity pool lost.");
          }
        } else {
          const errorPayloadText = await serverStreamResponse.text();
          throw new Error(`Server Status: ${serverStreamResponse.status}. Details: ${errorPayloadText}`);
        }
      }

      const streamBodyReader = serverStreamResponse.body.getReader();
      const characterDecoder = new TextDecoder("utf-8");
      let streamingRowBuffer = "";

      while (true) {
        const { value: packetChunkBytes, done: isNetworkClosed } = await streamBodyReader.read();
        if (isNetworkClosed) break;

        streamingRowBuffer += characterDecoder.decode(packetChunkBytes, { stream: true });
        const streamLines = streamingRowBuffer.split("\n");
        streamingRowBuffer = streamLines.pop() || "";

        for (const rawStreamLine of streamLines) {
          const trimmedStreamLine = rawStreamLine.trim();
          if (trimmedStreamLine === "") continue;

          if (trimmedStreamLine === "data: [DONE]") {
            setChatLog((prevLog) => prevLog.map((msgItem) => msgItem.id === aiMessageId ? { ...msgItem, isThinking: false } : msgItem));
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
                      ? { ...msgItem, isThinking: false, text: msgItem.text + `\n\n❌ **Stream Interruption:** ${unpackedChunkMetrics.error}` }
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
            } catch (payloadParseAnomalyError) {}
          }
        }
      }
    } catch (criticalPipelineCommunicationException) {
      if (criticalPipelineCommunicationException.name === "AbortError") {
        setChatLog((prevLog) => prevLog.map((msgItem) => msgItem.id === aiMessageId ? { ...msgItem, isThinking: false } : msgItem));
        setIsStreaming(false); 
        return;
      }
      
      setChatLog((prevLog) =>
        prevLog.map((msgItem) =>
          msgItem.id === aiMessageId
            ? { ...msgItem, isThinking: false, text: `❌ **Connection Error:** Unable to establish reliable streaming link with backend.\n\n> *Diagnostics:* ${criticalPipelineCommunicationException.message || "Verify execution states and try again."}` }
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
          <p className="uppercase tracking-widest font-black">
            {isSessionExpiring ? "Session expired. Redirecting to sign in..." : "Calibrating Jemer Tutor Matrix..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 md:p-6 max-w-4xl mx-auto relative">
      <div ref={chatContainerRef} className="flex-1 w-full overflow-y-auto pr-1 scrollbar-none pb-4 flex flex-col min-h-0 justify-start">
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
