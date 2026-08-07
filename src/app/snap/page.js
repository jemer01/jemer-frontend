/**
 * [NEW UPGRADE]
 * SUMMARY: On-Demand JWT Refresh & Multi-Origin Backend Synchronization.
 * 1. Shared On-Demand JWT Architecture: Replicated `fetchJwtOnDemand`, `jemerAuthenticatedFetch`,
 *    and `window.__jemerAuthRefreshLock` to handle token refreshes on demand whenever a user
 *    triggers an action (e.g., analyze, explain, or answer).
 * 2. Multi-Origin Backend URL Resolution: Integrated dynamic origin matching (`jemerplatforms.company`,
 *    `cloudshell.dev`, or local fallback) directly matching tutor page CORS handling.
 * 3. Auto Re-Authentication Flow: Automatically triggers silent token rotation if tokens are near
 *    expiry or if 401/400 errors are returned, with emergency redirect fallback to `/login.html`.
 * 4. Preserved Pipeline & Components: 100% preservation of all existing SPA stages (Camera, Cropper,
 *    Results, Chat), state management, Base64 conversion, R2 uploads, and SSE stream readers.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — SNAP TO ANSWER ROUTER (v3.0)
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

// Shared cross-module lock for JWT refresh synchronization
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

// ON-DEMAND JWT FETCHER
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

// AUTHENTICATED FETCH WRAPPER WITH RETRY & HEADERS
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
      // 🚀 ON-DEMAND PRE-FLIGHT CHECK: Refresh JWT right before dispatching network calls
      const onDemandToken = await fetchJwtOnDemand();
      const currentToken = onDemandToken || localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token");

      if (!currentToken || isTokenExpiringSoon(currentToken, 60)) {
        window.location.href = "/login.html";
        return;
      }

      const BACKEND_URL = getBackendUrl();

      // 1. Obtain Presigned URL from Go Backend using jemerAuthenticatedFetch
      const presignRes = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/snap/storage/presigned-url`, {
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

      // 3. Open SSE Stream to Go Backend for AI Generation using jemerAuthenticatedFetch
      const streamRes = await jemerAuthenticatedFetch(`${BACKEND_URL}/api/v1/snap/stream`, {
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
            <SnapHistory />
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