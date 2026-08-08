/**
 * [NEW] v2.6
 * SUMMARY: Fixed the backend "Failed to load audio... Invalid or unsupported audio file" Nemotron rejection — the base64 payload it received decoded to the literal string "[object Object]".
 * 1. Root cause: `handleAudioCapture` only unwrapped `.blob`/`.file` from the AudioRecord payload; if neither key matched, the raw wrapper object was stored as `capturedAudio` and later silently stringified by `fetch()` on upload instead of being sent as binary.
 * 2. Widened the unwrap logic to also try `.audioBlob`/`.recording`/`.data`, and added a hard `instanceof Blob` check that stops with a visible error instead of silently accepting a non-Blob value.
 * 3. Added a matching guard at the top of `handleGenerateNotes` as a second safety net, so a bad `capturedAudio` can never reach the R2 PUT again.
 *
 * [PREVIOUS UPGRADE & BUG FIX] v2.5
 * SUMMARY: Fixed the `rawFormat.toLowerCase is not a function` Console TypeError in handleGenerateNotes.
 * 1. A stray `//` on the format-extraction line had turned the ternary into a line comment, so `rawFormat` was silently assigned `formatParts.length` (a number) instead of `formatParts[1]` (the extension string) — restored the correct ternary.
 *
 * [PREVIOUS UPGRADE & BUG FIX] v2.4
 * SUMMARY: v2.4 Final Audiobooks Router & Syntax Stabilization (the 'toLowerCase' fix claimed here was incomplete — the ternary had been accidentally commented out; corrected in v2.5).
 * 1. Resolved Compilation Errors: Fixed the 'fileType has already been declared' SyntaxError and the 'toLowerCase is not a function' TypeError by consolidating MIME parsing and strictly targeting the format string array index.
 * 2. Immutable Authentication Flow: Preserved the JIT (Just-In-Time) JWT refresh and fail-safe redirection logic.
 * 3. Component SPA Lifecycle: Retained full stage transitions (record, history, review, loading, results, chat) and precise prop drilling.
 * ================================================================================================
 * 🎧 JEMER ACADEMY ECOSYSTEM — AUDIOBOOKS ROUTER (v2.6)
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
    const base64Url = token.split('.[...](asc_slot://start-slot-1)');
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

  // Only redirect to login if the token is entirely missing. 
  // Expired tokens remain legal to prevent terrible background UX kick-outs.
  if (!activeToken) {
     window.location.href = "/login.html";
     return new Response(null, { status: 401 });
  }

  // Attempt a silent refresh if expiring, but DO NOT kick to login if it fails.
  if (isTokenExpiringSoon(activeToken, 300)) {
     const freshToken = await fetchJwtOnDemand();
     if (freshToken) {
       activeToken = freshToken;
     }
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${activeToken}`);
  headers.set("apikey", activeToken);

  let response = await fetch(url, { ...options, headers });

  // Fallback interceptor if the API still rejects the token
  if (response.status === 401 || response.status === 400) {
     const emergencyToken = await fetchJwtOnDemand();
     if (emergencyToken && emergencyToken !== activeToken) {
        headers.set("Authorization", `Bearer ${emergencyToken}`);
        headers.set("apikey", emergencyToken);
        response = await fetch(url, { ...options, headers });
     } else {
        // Final check. Only kick if tokens were completely wiped from storage.
        const checkToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");
        if (!checkToken) {
           window.location.href = "/login.html";
        }
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
  
  // 🚀 API Storage States
  const [sessionID, setSessionID] = useState("");
  const [analysisData, setAnalysisData] = useState({});
  const [transcript, setTranscript] = useState("");

  // ── STATE TRANSITION PIPELINES ──

  const handleAudioCapture = (audioData) => {
    // Robustly isolate the binary Blob out of complex nested object states
    let rawBlob = audioData;
    if (audioData && !(audioData instanceof Blob)) {
      rawBlob = audioData.blob || audioData.file || audioData.audioBlob || audioData.recording || audioData.data || audioData;
    }

    // Refuse to proceed with anything that isn't an actual Blob/File —
    // silently accepting a wrapper object here is what caused capturedAudio
    // to get stringified to "[object Object]" on upload.
    if (!(rawBlob instanceof Blob)) {
      console.error("AudioBooks: onCapture did not receive a Blob/File — got:", audioData);
      alert("Couldn't read the recorded/uploaded audio. Please try again.");
      return;
    }

    setCapturedAudio(rawBlob);
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

  // 🚀 Integrated Real Backend Execution Pipeline
  const handleGenerateNotes = async () => {
    if (!capturedAudio) return;

    // Final safety net: never PUT a non-Blob to R2 — fetch would silently
    // stringify it (e.g. to "[object Object]"), corrupting the upload.
    if (!(capturedAudio instanceof Blob)) {
      console.error("AudioBooks: capturedAudio is not a Blob/File — aborting upload:", capturedAudio);
      alert("The captured audio isn't valid. Please re-record or re-upload and try again.");
      setActiveStage("review");
      return;
    }

    setActiveStage("loading"); // Immersive overlay masks the background processing

    const newSessionID = crypto.randomUUID();
    setSessionID(newSessionID);

    try {
      // 🚀 JIT JWT FETCH: Explicitly fetch a fresh token right before the heavy lifting action
      await fetchJwtOnDemand();
      const currentToken = localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");

      if (!currentToken) {
        window.location.href = "/login.html";
        return;
      }

      const BACKEND_URL = getBackendUrl();
      
      // 🚀 FIXED: Unified MIME & Extension Parsing
      // Ensures fileType is declared only once and strictly extracts the string at index
      const fileType = capturedAudio.type || "audio/mpeg";
      const mimeBase = fileType.split(';')[0]; 
      const formatParts = mimeBase.split('/');
      
      // Pull the string extension from index 1 cleanly (e.g., 'webm' or 'mpeg')
      const rawFormat = formatParts.length > 1 ? formatParts[1] : "mp3";
      
      // Normalize specific browser codecs to simple R2 extensions
      const format = rawFormat.toLowerCase().includes("webm") ? "webm" : 
                     rawFormat.toLowerCase().includes("ogg") ? "ogg" : 
                     rawFormat.toLowerCase().includes("wav") ? "wav" : "mp3";

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

  // Seamlessly load historical data on click
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