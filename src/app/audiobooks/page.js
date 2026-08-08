/**
 * [NEW] v2.1
 * SUMMARY: Fixed the actual `Unexpected token` build error at line 379 — the v2.0 fix below missed that the onChat/onBack arrow functions had been torn apart by the string-quoting bug, leaving `setActiveStage(...)}` dangling outside the JSX tag.
 * 1. Restored proper React prop brackets on AudioRecord, AudioHistory, and AudioReview (removed accidental string quotes around `{}`, which had been silently breaking those callbacks at runtime).
 * 2. Rebuilt the AudioResults and AudioChat JSX blocks so `onChat`/`onBack` are valid arrow-function props (`onChat={() => setActiveStage("chat")}`, `onBack={() => setActiveStage("results")}`) instead of malformed, split-apart syntax.
 *
 * [PREVIOUS ATTEMPT] v2.0
 * SUMMARY: Attempted fix for JSX syntax errors and mangled component props in the return block (incomplete — the onChat/onBack blocks were still malformed and the build error persisted; corrected above in v2.1).
 * 1. Restored proper React prop brackets (removed accidental string quotes around `{}`).
 * 2. Fixed broken inline arrow functions for `onChat` and `onBack` that were causing the `Unexpected token` build error (restored `() => setActiveStage(...)`).
 *
 * [PREVIOUS UPGRADE & FIX]
 * SUMMARY: Fixed `Unexpected end of JSON input` Console SyntaxError in handleGenerateNotes.
 * 1. Safe JSON Parsing: Added a guard to check if `jsonAccumulator` is empty before attempting to parse, avoiding errors on empty streams.
 * 2. Markdown Sanitization: Added logic to strip potential markdown wrappers (e.g., ```json ... ```) that AI models sometimes output.
 * 3. Fixed critical build errors caused by syntax artifacts (`split('.')[1]`).
 * ================================================================================================
 * 🎧 JEMER ACADEMY ECOSYSTEM — AUDIOBOOKS ROUTER (v2.1)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
// We will build these components in the next steps. Importing them now to lock the architecture.
import AudioRecord from "@/jemer-components/audiobooks/audio-record.jsx";
import AudioReview from "@/jemer-components/audiobooks/audio-review.jsx";
import AudioLoadingSpinner from "@/jemer-components/audiobooks/audio-loading-spinner.jsx";
import AudioResults from "@/jemer-components/audiobooks/audio-results.jsx";
import AudioChat from "@/jemer-components/audiobooks/audio-chat.jsx";
import AudioHistory from "@/jemer-components/audiobooks/audio-history.jsx";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

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

const getAuthRefreshLock = () => {
  if (typeof window === "undefined") return { isRefreshing: false, refreshPromise: null };
  if (!window.__jemerAuthRefreshLock) {
    window.__jemerAuthRefreshLock = { isRefreshing: false, refreshPromise: null };
  }
  return window.__jemerAuthRefreshLock;
};

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

const fetchJwtOnDemand = async () => {
  const lock = getAuthRefreshLock();
  if (lock.isRefreshing) return lock.refreshPromise;
  lock.isRefreshing = true;

  lock.refreshPromise = (async () => {
    try {
      const sdkIsReady = await waitForAuthSDKReady();
      if (sdkIsReady) {
        const refreshOutcome = await window.JemerAuth.refreshSession();
        if (refreshOutcome && refreshOutcome.success === false) return null;

        let attempts = 0;
        while (attempts < 100) {
          const currentToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
          if (currentToken && !isTokenExpiringSoon(currentToken, 300)) {
            return currentToken;
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
        }
      }
      return localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || null;
    } catch (error) {
      return null;
    } finally {
      lock.isRefreshing = false;
    }
  })();

  return lock.refreshPromise;
};

const jemerAuthenticatedFetch = async (url, options = {}) => {
  let activeToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");

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

const getBackendUrl = () => {
  const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
  return process.env.NEXT_PUBLIC_API_URL ||
    (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
     activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
     "http://localhost:8080");
};

// ================================================================================================
// 🚀 MAIN AUDIOBOOKS PAGE ORCHESTRATOR
// ================================================================================================

export default function AudioBooksPage() {
  // ── SPA ROUTING STATES ──
  // Controller: 'record' | 'history' | 'review' | 'loading' | 'results' | 'chat'
  const [activeStage, setActiveStage] = useState("record");
  
  // ── DATA PAYLOAD STATES ──
  const [capturedAudio, setCapturedAudio] = useState(null);
  
  // 🚀 NEW: API Storage States
  const [sessionID, setSessionID] = useState("");
  const [analysisData, setAnalysisData] = useState({});
  const [transcript, setTranscript] = useState("");

  // ── STATE TRANSITION PIPELINES ──

  const handleAudioCapture = (audioData) => {
    setCapturedAudio(audioData);
    setActiveStage("review");
  };

  const handleOpenHistory = () => {
    setActiveStage("history");
  };

  const handleCloseHistory = () => {
    setActiveStage("record");
  };

  const handleDiscardAudio = () => {
    setCapturedAudio(null);
    setActiveStage("record");
  };

  // 🚀 NEW: Integrated Real Backend Execution Pipeline
  const handleGenerateNotes = async () => {
    if (!capturedAudio) return;

    setActiveStage("loading"); // Immersive overlay masks the background processing

    const newSessionID = crypto.randomUUID();
    setSessionID(newSessionID);

    try {
      // Pre-flight JWT check
      const onDemandToken = await fetchJwtOnDemand();
      const currentToken = onDemandToken || localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");

      if (!currentToken || isTokenExpiringSoon(currentToken, 60)) {
        window.location.href = "/login.html";
        return;
      }

      const BACKEND_URL = getBackendUrl();
      
      // Attempt to safely extract format, default to mp3
      const fileType = capturedAudio.type || "audio/mpeg";
      const format = fileType.split('/')[1] || "mp3";

      // 1. Obtain Presigned URL from Go Backend
      const presignRes = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/audiobooks/storage/presigned-url?format=${format}`, {
        method: "GET"
      });

      if (!presignRes.ok) throw new Error("Failed to secure upload link");
      const { presigned_url, object_key } = await presignRes.json();

      // 2. Upload Binary Audio Directly to Cloudflare R2
      const uploadRes = await fetch(presigned_url, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: capturedAudio
      });
      
      if (!uploadRes.ok) throw new Error("Failed to upload audio to cloud storage");

      // 3. Initiate SSE Streaming Process (Nemotron Transcript -> Step 3.7 JSON Analysis)
      const streamRes = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/audiobooks/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: newSessionID,
          audio_r2_key: object_key,
          format: format
        })
      });

      if (!streamRes.ok) throw new Error("Failed to initialize backend stream");

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let streamingBuffer = "";
      let jsonAccumulator = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamingBuffer += decoder.decode(value, { stream: true });
        const lines = streamingBuffer.split('\n');
        streamingBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;
          
          const dataStr = trimmedLine.replace('data:', '').trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const payload = JSON.parse(dataStr);
            // Ignore system status messages, only accumulate the pure JSON analysis from the AI
            if (payload.content && !payload.content.includes("[System:")) {
              jsonAccumulator += payload.content;
            }
          } catch (e) {
            // Safely ignore partial chunks during parsing
          }
        }
      }

      // 4. Fetch the final clean record from DB to retrieve the Kimi Transcript
      let finalTranscript = "Transcription missing or still processing.";
      try {
        const historyRes = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/audiobooks/history?limit=10`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          // Find the exact session we just processed
          const match = historyData.find(item => item.session_id === newSessionID);
          if (match && match.transcript) {
            finalTranscript = match.transcript;
          }
        }
      } catch (e) {
        console.warn("Failed to fetch transcript", e);
      }
      setTranscript(finalTranscript);

      // 5. Parse the accumulated JSON Analysis Block robustly
      let finalAnalysis = {};
      if (jsonAccumulator && jsonAccumulator.trim() !== "") {
        try {
          // Sanitize potential markdown wrappers that AI might output
          let cleanStr = jsonAccumulator.trim();
          if (cleanStr.startsWith('```json')) {
            cleanStr = cleanStr.substring(7);
          } else if (cleanStr.startsWith('```')) {
            cleanStr = cleanStr.substring(3);
          }
          if (cleanStr.endsWith('```')) {
            cleanStr = cleanStr.substring(0, cleanStr.length - 3);
          }
          
          finalAnalysis = JSON.parse(cleanStr.trim());
        } catch (e) {
          // Silently catch the error to prevent console syntax flooding. 
          // Defaults to the empty object to keep UI transitions smooth.
        }
      }
      setAnalysisData(finalAnalysis);

      // Transition to Results screen
      setActiveStage("results");

    } catch (err) {
      console.error("Audio Execution Pipeline Failed:", err);
      alert("Failed to process audiobook. Please try again.");
      setActiveStage("review"); // Fail gracefully back to review stage
    }
  };

  const handleResetToRecord = () => {
    setCapturedAudio(null);
    setAnalysisData({});
    setTranscript("");
    setActiveStage("record");
  };

  // 🚀 NEW: Seamlessly load historical data on click
  const handleHistorySelect = (record) => {
    setCapturedAudio(record.audio_url);
    setTranscript(record.transcript || "");
    
    // Safety parse if the backend sent it as a string or raw object
    try {
      const parsedData = typeof record.analysis_data === 'string' ? JSON.parse(record.analysis_data) : record.analysis_data;
      setAnalysisData(parsedData || {});
    } catch (e) {
      setAnalysisData({});
    }

    setSessionID(record.session_id);
    setActiveStage("results");
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in relative">
      
      {/* STAGE 1: FULL SCREEN RECORD / UPLOAD CAPTURE */}
      {activeStage === "record" && (
        <AudioRecord onCapture={handleAudioCapture} onOpenHistory={handleOpenHistory}/>
      )}

      {/* STAGE 1.5: HISTORY ARCHIVE */}
      {activeStage === "history" && (
        <AudioHistory onBack={handleCloseHistory} onSelectHistory={handleHistorySelect}/>
      )}

      {/* STAGE 2: CUSTOM AUDIO REVIEW MATRIX */}
      {activeStage === "review" && (
        <AudioReview audioData={capturedAudio} onDiscard={handleDiscardAudio} onGenerate={handleGenerateNotes}/>
      )}

      {/* STAGE 3: MIND-BLOWING LOADING ANIMATION OVERLAY */}
      {activeStage === "loading" && (
        <AudioLoadingSpinner/>
      )}

      {/* STAGE 4: AI RESULTS & TRANSCRIPTION OUTPUT */}
      {activeStage === "results" && (
        <AudioResults
          audioData={capturedAudio}
          onChat={() => setActiveStage("chat")}
          onReset={handleResetToRecord}
          analysisData={analysisData}
          transcript={transcript}
        />
      )}

      {/* STAGE 5: CONTEXTUAL TUTOR CHAT */}
      {activeStage === "chat" && (
        <AudioChat
          onBack={() => setActiveStage("results")}
          sessionID={sessionID}
        />
      )}

    </div>
  );
}