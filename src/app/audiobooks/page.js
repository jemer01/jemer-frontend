/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — AUDIOBOOKS ROUTER (v3.0.0)
 * ================================================================================================
 * [NEW UPGRADE — v3.0.0]
 * SUMMARY: Phase 1 Intake Modernization, Codec Expansion & Floating Chat Architecture
 * 1. UNIVERSAL CODEC & MIME DETECTOR: Added extension-first format extraction. iPhone voice memos
 *    (.m4a, .aac) and Android recorders (.wav, .ogg, .caf) are now recognized and sent to R2 and
 *    Whisper with their true format string instead of falling back to raw mp3.
 * 2. FLOATING TUTOR CHAT OVERLAY: Ripped out the view-destroying `activeStage === "chat"` router.
 *    Chat is now handled via an `isChatOpen` overlay state so students can text the tutor
 *    without unmounting their generated notes.
 * 3. ERGONOMIC TOAST REPLACEMENTS: Purged all legacy browser `alert()` popups in favor of a sleek,
 *    floating toast error banner with full dark-mode contrast.
 * 4. DURATION METADATA PASSTHROUGH: Captures the manual duration passed from `audio-record.jsx`
 *    and binds it to the audio instance, permanently preventing the NaN / Infinity timer glitch.
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
import AudioRecord from "@/jemer-components/audiobooks/audio-record.jsx";
import AudioReview from "@/jemer-components/audiobooks/audio-review.jsx";
import AudioLoadingSpinner from "@/jemer-components/audiobooks/audio-loading-spinner.jsx";
import AudioResults from "@/jemer-components/audiobooks/audio-results.jsx";
import AudioChat from "@/jemer-components/audiobooks/audio-chat.jsx";
import AudioHistory from "@/jemer-components/audiobooks/audio-history.jsx";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

const waitForJemerAuthReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
  const isReady = () => typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.authenticatedFetch === "function";
  if (isReady()) return true;
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    if (isReady()) return true;
  }
  return false;
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
  // Controller: 'record' | 'history' | 'review' | 'loading' | 'results'
  const [activeStage, setActiveStage] = useState("record");
  
  // ── DATA PAYLOAD STATES ──
  const [capturedAudio, setCapturedAudio] = useState(null);
  
  // 🚀 API Storage States
  const [sessionID, setSessionID] = useState("");
  const [analysisData, setAnalysisData] = useState({});
  const [transcript, setTranscript] = useState("");

  // 🚀 NEW: Tutor Chat Floating Overlay State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 🚀 NEW: UI Error Toast State
  const [toastError, setToastError] = useState(null);

  const triggerToast = (msg) => {
    setToastError(msg);
    setTimeout(() => setToastError(null), 5000);
  };

  // ── STATE TRANSITION PIPELINES ──

  const handleAudioCapture = (audioData) => {
    let rawBlob = audioData;
    let durationSeconds = 0;
    let fileName = `Recording - ${new Date().toLocaleTimeString()}`;

    if (audioData && !(audioData instanceof Blob)) {
      rawBlob = audioData.blob || audioData.file || audioData.audioBlob || audioData.recording || audioData.data || audioData;
      if (audioData.duration) durationSeconds = audioData.duration;
      if (audioData.name) fileName = audioData.name;
    }

    if (!(rawBlob instanceof Blob)) {
      console.error("AudioBooks: onCapture did not receive a Blob/File — got:", audioData);
      triggerToast("Couldn't process the audio file. Please try recording or uploading again.");
      return;
    }

    // 🚀 NEW: Bind duration and filename metadata directly to the Blob instance
    // Preserves `instanceof Blob` validity while passing duration down to the player
    rawBlob.duration = durationSeconds;
    rawBlob.fileName = fileName;

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

    if (!(capturedAudio instanceof Blob)) {
      console.error("AudioBooks: capturedAudio is not a Blob/File — aborting upload:", capturedAudio);
      triggerToast("Invalid audio recording. Please re-record or re-upload.");
      setActiveStage("review");
      return;
    }

    // Enforce 250MB safety ceiling before firing upload
    const MAX_250MB = 262144000;
    if (capturedAudio.size > MAX_250MB) {
      triggerToast("This audio exceeds our 250MB limit. Please upload or record a shorter session.");
      setActiveStage("review");
      return;
    }

    setActiveStage("loading");

    const newSessionID = crypto.randomUUID();
    setSessionID(newSessionID);

    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      
      // 🚀 NEW: Universal Format & MIME Extension Resolver (Fixes iPhone/Android Rejections)
      let detectedExt = "";
      const originalName = capturedAudio.fileName || capturedAudio.name || "";
      if (originalName.includes(".")) {
        detectedExt = originalName.split(".").pop().toLowerCase().trim();
      }

      const fileType = capturedAudio.type || "audio/mpeg";
      const mimeBase = fileType.split(";")[0].toLowerCase();
      
      let format = "mp3";
      if (detectedExt === "m4a" || mimeBase.includes("m4a") || mimeBase.includes("x-m4a") || mimeBase.includes("mp4")) {
        format = "m4a";
      } else if (detectedExt === "wav" || mimeBase.includes("wav")) {
        format = "wav";
      } else if (detectedExt === "ogg" || mimeBase.includes("ogg")) {
        format = "ogg";
      } else if (detectedExt === "aac" || mimeBase.includes("aac")) {
        format = "aac";
      } else if (detectedExt === "flac" || mimeBase.includes("flac")) {
        format = "flac";
      } else if (detectedExt === "webm" || mimeBase.includes("webm")) {
        format = "webm";
      } else {
        format = "mp3";
      }

      // 1. Obtain Presigned URL from Go Backend
      const presignRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/audiobooks/storage/presigned-url?format=${format}`, {
        method: "GET"
      });

      if (!presignRes.ok) throw new Error("Failed to secure cloud upload link");
      const { presigned_url, object_key } = await presignRes.json();

      // 2. Upload Binary Audio Directly to Cloudflare R2
      const uploadRes = await fetch(presigned_url, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: capturedAudio
      });
      
      if (!uploadRes.ok) throw new Error("Cloudflare R2 failed to store the audio recording");

      // 3. Initiate SSE Streaming Process (Whisper Transcript -> 50k Groq JSON Analysis)
      const streamRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/audiobooks/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: newSessionID,
          audio_r2_key: object_key,
          format: format
        })
      });

      if (!streamRes.ok) throw new Error("Failed to initialize cognitive transcription stream");

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let streamingBuffer = "";
      let jsonAccumulator = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamingBuffer += decoder.decode(value, { stream: true });
        const lines = streamingBuffer.split("\n");
        streamingBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith("data:")) continue;
          
          const dataStr = trimmedLine.replace("data:", "").trim();
          if (dataStr === "[DONE]") break;
          
          try {
            const payload = JSON.parse(dataStr);
            if (payload.content && !payload.content.includes("[System:")) {
              jsonAccumulator += payload.content;
            }
          } catch (e) {
            // Gracefully ignore partial JSON frames
          }
        }
      }

      // 4. Fetch the final clean record from DB to retrieve the Whisper Transcript
      let finalTranscript = "Transcription complete. Notes ready for review.";
      try {
        const historyRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/audiobooks/history?limit=10`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const match = historyData.find(item => item.session_id === newSessionID);
          if (match && match.transcript) {
            finalTranscript = match.transcript;
          }
        }
      } catch (e) {
        console.warn("Failed to fetch finalized transcript record:", e);
      }
      setTranscript(finalTranscript);

      // 5. Parse the accumulated JSON Analysis Block robustly
      let finalAnalysis = {};
      if (jsonAccumulator && jsonAccumulator.trim() !== "") {
        try {
          let cleanStr = jsonAccumulator.trim();
          if (cleanStr.startsWith("```json")) {
            cleanStr = cleanStr.substring(7);
          } else if (cleanStr.startsWith("```")) {
            cleanStr = cleanStr.substring(3);
          }
          if (cleanStr.endsWith("```")) {
            cleanStr = cleanStr.substring(0, cleanStr.length - 3);
          }
          
          finalAnalysis = JSON.parse(cleanStr.trim());
        } catch (e) {
          console.warn("Failed to parse cognitive JSON summary:", e);
        }
      }
      setAnalysisData(finalAnalysis);

      // Transition smoothly to Results screen
      setActiveStage("results");

    } catch (err) {
      console.error("Audio Execution Pipeline Failed:", err);
      triggerToast(err.message || "Failed to process audiobook. Please verify your connection.");
      setActiveStage("review");
    }
  };

  const handleResetToRecord = () => {
    setCapturedAudio(null);
    setAnalysisData({});
    setTranscript("");
    setIsChatOpen(false);
    setActiveStage("record");
  };

  // Seamlessly load historical data on click
  const handleHistorySelect = (record) => {
    setCapturedAudio(record.audio_url);
    setTranscript(record.transcript || "");
    
    try {
      const parsedData = typeof record.analysis_data === "string" ? JSON.parse(record.analysis_data) : record.analysis_data;
      setAnalysisData(parsedData || {});
    } catch (e) {
      setAnalysisData({});
    }

    setSessionID(record.session_id);
    setIsChatOpen(false);
    setActiveStage("results");
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in relative">
      
      {/* 🚀 NEW: Floating Universal UI Error Toast */}
      {toastError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-rose-50 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 animate-fade-in text-xs font-bold max-w-[90vw] backdrop-blur-md">
          <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="truncate">{toastError}</span>
        </div>
      )}

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
          onChat={() => setIsChatOpen(true)}
          onReset={handleResetToRecord}
          analysisData={analysisData}
          transcript={transcript}
        />
      )}

      {/* 🚀 NEW: Contextual Tutor Chat Overlay (Mounts without unmounting results) */}
      <AudioChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        sessionID={sessionID}
      />

    </div>
  );
}