/**
 * [NEW UPGRADE]
 * SUMMARY: v3.2.0 Centralized Auth Engine Migration
 * 1. Removed the entire local JWT/refresh/lock reimplementation (decodeJWTPayload,
 *    isTokenExpiringSoon, getAuthRefreshLock, waitForAuthSDKReady, fetchJwtOnDemand,
 *    jemerAuthenticatedFetch) now that auth.js v4.0 exposes the same logic once, globally, via
 *    window.JemerAuth. Replaced with one minimal waitForJemerAuthReady() readiness poll.
 * 2. GO BACKEND CALLS NOW USE window.JemerAuth.authenticatedFetch(): the presigned-URL request
 *    and the SSE stream-init request (both our own Go backend) now call the shared engine
 *    directly instead of the local jemerAuthenticatedFetch wrapper, which also drops the apikey
 *    header these calls never actually needed. The R2 upload PUT (a presigned third-party URL,
 *    unauthenticated by design) is untouched.
 * 3. PRE-FLIGHT TOKEN CHECK REMOVED: executeSnapAnalysis no longer manually checks/refreshes the
 *    token before dispatching — authenticatedFetch already proactively refreshes a token
 *    expiring within 5 minutes as part of the call itself.
 * 4. Dropped the dead legacy-key fallbacks (access_token, token) that were sprinkled through the
 *    old local auth machinery — those keys are never written anywhere.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: v3.1.1 Artifact Cleanup & Build Fixes
 * 1. Syntax Fix: Removed corrupted text artifacts (`[...](asc_slot://...)`) that broke the Next.js Turbopack build process.
 * 2. JWT Decode Patch: Restored proper dot-notation splitting (`.split('.')[1]`) to decode JWT payloads correctly.
 * 3. Base64 Processing Fix: Corrected `base64ToBlob` to accurately extract the MIME type (`split(':')[1]`) and properly assign the base64 string (`parts[1] || parts[0]`) to prevent atob() conversion crashes.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: v3.1 Snap History Interaction & State Hand-off.
 * 1. History Selection Logic: Injected `handleHistorySelect` to instantly route users from the Camera stage to the Results stage when a past snap is clicked.
 * 2. State Hydration: Automatically populates the `capturedImage`, `streamedResponse`, and `sessionID` with the historical database records.
 * 3. Preserved Infrastructure: 100% preservation of all existing JWT, SSE, and SPA router pipelines.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — SNAP TO ANSWER ROUTER (v3.2.0)
 * ================================================================================================
 */
"use client";

import React, { useState } from "react";
import SnapCamera from "@/jemer-components/snap/snap-camera.jsx";
import SnapCropper from "@/jemer-components/snap/snap-cropper.jsx";
import SnapResults from "@/jemer-components/snap/snap-results.jsx";
import SnapChat from "@/jemer-components/snap/snap-chat.jsx";
import SnapHistory from "@/jemer-components/snap/snap-history.jsx";

// ================================================================================================
// 🔐 AUTHENTICATION & JWT UTILITIES
// ================================================================================================

// 🆕 v3.2.0: Minimal readiness guard for the globally-loaded auth engine (window.JemerAuth,
// injected once by layout.js via <Script strategy="afterInteractive">). That script loads after
// first paint, so a call firing shortly after mount could technically run before it exists —
// this polls briefly instead of assuming it's already there.
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

// DYNAMIC MULTI-ORIGIN BACKEND RESOLVER
const getBackendUrl = () => {
  const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
  return process.env.NEXT_PUBLIC_API_URL ||
    (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
     activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
     "http://localhost:8080");
};

// ================================================================================================
// 🚀 MAIN SNAP PAGE ORCHESTRATOR
// ================================================================================================

export default function SnapPage() {
  // State Controller: 'camera' | 'cropper' | 'results' | 'chat'
  const [activeStage, setActiveStage] = useState("camera");
  const [capturedImage, setCapturedImage] = useState(null);
  
  // Streaming State Management
  const [streamedResponse, setStreamedResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionID, setSessionID] = useState("");

  // Base64 to Blob helper for file uploading
  const base64ToBlob = (base64Data) => {
    if (!base64Data) return null;
    const parts = base64Data.split(';base64,');
    const contentType = parts[0]?.split(':')[1] || 'image/jpeg';
    const rawBase64 = parts[1] || parts[0];
    const raw = window.atob(rawBase64);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };

  // API Execution Pipeline
  const executeSnapAnalysis = async (base64Image, mode) => {
    setIsAnalyzing(true);
    setStreamedResponse("");
    
    // Generate a fresh session ID for database tracking
    const newSessionID = crypto.randomUUID();
    setSessionID(newSessionID);

    try {
      // 🆕 v3.2.0: window.JemerAuth.authenticatedFetch() now handles the expiry check, silent
      // refresh, and dead-session redirect internally, so the manual pre-flight token check that
      // used to live here has been removed. We just make sure the auth engine has finished loading.
      await waitForJemerAuthReady();

      const BACKEND_URL = getBackendUrl();

      // 1. Obtain Presigned URL from Go Backend using window.JemerAuth.authenticatedFetch
      const presignRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/snap/storage/presigned-url`, {
        method: "GET"
      });

      if (!presignRes.ok) {
        const errorText = await presignRes.text().catch(() => "No response body");
        console.error(`Presigned URL Request Failed [HTTP ${presignRes.status}]:`, errorText);
        throw new Error(`Failed to secure upload link (HTTP ${presignRes.status}: ${errorText || presignRes.statusText})`);
      }
      
      const { presigned_url, object_key } = await presignRes.json();

      // 2. Upload Binary Image Directly to Cloudflare R2
      const imageBlob = base64ToBlob(base64Image);
      const uploadRes = await fetch(presigned_url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: imageBlob
      });
      
      if (!uploadRes.ok) {
        const uploadErrText = await uploadRes.text().catch(() => "No response body");
        console.error(`R2 Upload Failed [HTTP ${uploadRes.status}]:`, uploadErrText);
        throw new Error(`Failed to upload image to cloud storage (HTTP ${uploadRes.status})`);
      }

      // 3. Open SSE Stream to Go Backend for AI Generation using window.JemerAuth.authenticatedFetch
      const streamRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/snap/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_id: newSessionID,
          mode: mode,
          user_prompt: "", // Send empty by default unless user typed something extra
          image_r2_key: object_key
        })
      });

      if (!streamRes.ok) {
        const streamErrText = await streamRes.text().catch(() => "No response body");
        console.error(`SSE Stream Init Failed [HTTP ${streamRes.status}]:`, streamErrText);
        throw new Error(`Failed to initialize stream (HTTP ${streamRes.status})`);
      }

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let streamingRowBuffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        streamingRowBuffer += decoder.decode(value, { stream: true });
        const lines = streamingRowBuffer.split('\n');
        streamingRowBuffer = lines.pop() || "";
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith('data:')) {
            const dataStr = trimmedLine.replace('data:', '').trim();
            if (dataStr === '[DONE]') break;
            if (!dataStr || dataStr === '[INITIALIZING]') continue;

            try {
              const payload = JSON.parse(dataStr);
              if (payload.status === "initializing") continue;

              if (payload.content) {
                setStreamedResponse((prev) => prev + payload.content);
              }
              if (payload.error) {
                console.error("AI Error:", payload.error);
                setStreamedResponse((prev) => prev + `\n\n❌ **Error:** ${payload.error}`);
              }
            } catch (e) {
              // Gracefully handle partial/unparseable JSON stream chunks
            }
          }
        }
      }
    } catch (err) {
      console.error("Snap Execution Pipeline Failed:", err);
      setStreamedResponse(err.message || "An error occurred while analyzing the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Transitions
  const handleSnap = (imageData) => {
    setCapturedImage(imageData);
    setActiveStage("cropper");
  };

  const handleCropComplete = (croppedData, actionMode) => {
    // actionMode maps precisely to backend modes: 'explain', 'analyze', 'answer'
    setCapturedImage(croppedData);
    setActiveStage("results");
    
    // Kick off backend process concurrently
    executeSnapAnalysis(croppedData, actionMode);
  };

  const handleCancelCrop = () => {
    setCapturedImage(null);
    setActiveStage("camera");
  };

  const handleResetToCamera = () => {
    setCapturedImage(null);
    setStreamedResponse("");
    setActiveStage("camera");
  };

  // 🚀 NEW: History Selection Route
  const handleHistorySelect = (record) => {
    setCapturedImage(record.image_url);
    setStreamedResponse(record.ai_response || "No analysis content found.");
    setSessionID(record.session_id);
    setIsAnalyzing(false); // Instantly set to false since history is already solved
    setActiveStage("results");
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col animate-fade-in relative min-h-full pb-24 lg:pb-0">
      
      {/* STAGE 1: CAMERA & HISTORY */}
      {activeStage === "camera" && (
        <div className="flex flex-col gap-8 w-full p-4 sm:p-0">
          <header className="mb-2">
            <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              Initialize <span className="text-blue-600 dark:text-blue-500">Scanner</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Position the equation or diagram clearly within the frame.</p>
          </header>
          
          <SnapCamera onSnap={handleSnap} />
          
          <div className="mt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Recent Solutions</h3>
            <SnapHistory onSelectHistory={handleHistorySelect} />
          </div>
        </div>
      )}

      {/* STAGE 1.5: WORKSPACE CROPPER */}
      {activeStage === "cropper" && (
        <SnapCropper 
          imageSource={capturedImage} 
          onAction={handleCropComplete} 
          onCancel={handleCancelCrop} 
        />
      )}

      {/* STAGE 2: AI RESULTS */}
      {activeStage === "results" && (
        <SnapResults 
          imageUrl={capturedImage} 
          onReset={handleResetToCamera} 
          onChat={() => setActiveStage("chat")} 
          streamedResponse={streamedResponse}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* STAGE 3: TUTOR CHAT */}
      {activeStage === "chat" && (
        <SnapChat 
          onBack={() => setActiveStage("results")} 
          sessionID={sessionID}
        />
      )}
    </div>
  );
}