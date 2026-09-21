"use client";

/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — SNAP TO ANSWER ROUTER (v4.1.0)
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Lifted History State & Chat Gating
 * 1. HISTORY LIFTED OUT OF SnapHistory: `snapHistory`/`isHistoryLoading` now live here and are
 *    fetched once via `fetchSnapHistory()` on mount. Because SnapPage itself never unmounts across
 *    activeStage transitions (only the JSX inside it is conditionally rendered), the strip no
 *    longer refetches — and re-shows its loading skeleton — every time the user navigates back to
 *    the camera stage. SnapHistory is now a controlled component driven by `history`/`isLoading`/
 *    `onUpdateHistory` props; it no longer fetches on its own.
 * 2. SILENT POST-ANSWER REFRESH: once a snap analysis stream actually finishes (end of the
 *    success path in `executeSnapAnalysis`, not on error), `fetchSnapHistory({ silent: true })`
 *    quietly pulls the fresh list in the background — no loading skeleton, no visible reload —
 *    so the new item appears exactly when "a real question is answered," and otherwise the strip
 *    only reloads on an actual page refresh.
 * 3. CHAT GATING: `onChat` now no-ops while `isAnalyzing` is true, mirroring the disabled state
 *    already enforced on SnapResults' "Tutor Chat" button, so the chat overlay can't be opened
 *    against an in-progress analysis from either side.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: Chat Overlay Architecture & DeepSeek Integration Prep
 * 1. Overlay Chat State: Ripped out the rigid `activeStage === "chat"` router block. Introduced 
 *    `isChatOpen` state so the Tutor Chat now mounts as an elegant floating overlay *on top* of 
 *    the Results page. This allows students to still see their scanned image in the background.
 * 2. State Reset Fix: Ensured `setIsChatOpen(false)` triggers correctly during `handleResetToCamera` 
 *    and `handleHistorySelect` to prevent ghost overlays.
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";
import SnapCamera from "@/jemer-components/snap/snap-camera.jsx";
import SnapCropper from "@/jemer-components/snap/snap-cropper.jsx";
import SnapResults from "@/jemer-components/snap/snap-results.jsx";
import SnapChat from "@/jemer-components/snap/snap-chat.jsx";
import SnapHistory from "@/jemer-components/snap/snap-history.jsx";

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
// 🚀 MAIN SNAP PAGE ORCHESTRATOR
// ================================================================================================

export default function SnapPage() {
  const [activeStage, setActiveStage] = useState("camera");
  const [capturedImage, setCapturedImage] = useState(null);
  
  const [streamedResponse, setStreamedResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionID, setSessionID] = useState("");
  
  // 🚀 NEW: Tutor Chat Overlay State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 🚀 NEW: History now lives here so it survives camera/cropper/results stage switches
  const [snapHistory, setSnapHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

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

  // 🚀 NEW: Single owner of the recent-solutions strip. `silent: true` skips the loading flag so
  // a background refresh after a completed answer never shows a skeleton/reload flash.
  const fetchSnapHistory = async ({ silent = false } = {}) => {
    if (!silent) setIsHistoryLoading(true);
    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();
      const res = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/snap/history`);
      if (res.ok) {
        const data = await res.json();
        setSnapHistory(data || []);
      }
    } catch (err) {
      console.error("Failed to load snap history:", err);
    } finally {
      if (!silent) setIsHistoryLoading(false);
    }
  };

  // Fetch once on mount — SnapPage doesn't unmount when activeStage changes, so this never
  // re-runs just from navigating between camera/cropper/results.
  useEffect(() => {
    fetchSnapHistory();
  }, []);

  const executeSnapAnalysis = async (base64Image, mode) => {
    setIsAnalyzing(true);
    setStreamedResponse("");
    
    const newSessionID = crypto.randomUUID();
    setSessionID(newSessionID);

    try {
      await waitForJemerAuthReady();
      const BACKEND_URL = getBackendUrl();

      const presignRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/snap/storage/presigned-url`, {
        method: "GET"
      });

      if (!presignRes.ok) {
        const errorText = await presignRes.text().catch(() => "No response body");
        throw new Error(`Failed to secure upload link (HTTP ${presignRes.status}: ${errorText || presignRes.statusText})`);
      }
      
      const { presigned_url, object_key } = await presignRes.json();

      const imageBlob = base64ToBlob(base64Image);
      const uploadRes = await fetch(presigned_url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: imageBlob
      });
      
      if (!uploadRes.ok) {
        const uploadErrText = await uploadRes.text().catch(() => "No response body");
        throw new Error(`Failed to upload image to cloud storage (HTTP ${uploadRes.status})`);
      }

      const streamRes = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/snap/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_id: newSessionID,
          mode: mode,
          user_prompt: "", 
          image_r2_key: object_key
        })
      });

      if (!streamRes.ok) {
        const streamErrText = await streamRes.text().catch(() => "No response body");
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

      // 🚀 NEW: A real answer just finished — quietly refresh the history strip so the new
      // solution appears without a visible reload.
      fetchSnapHistory({ silent: true });
    } catch (err) {
      console.error("Snap Execution Pipeline Failed:", err);
      setStreamedResponse(err.message || "An error occurred while analyzing the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSnap = (imageData) => {
    setCapturedImage(imageData);
    setActiveStage("cropper");
  };

  const handleCropComplete = (croppedData, actionMode) => {
    setCapturedImage(croppedData);
    setActiveStage("results");
    executeSnapAnalysis(croppedData, actionMode);
  };

  const handleCancelCrop = () => {
    setCapturedImage(null);
    setActiveStage("camera");
  };

  const handleResetToCamera = () => {
    setCapturedImage(null);
    setStreamedResponse("");
    setIsChatOpen(false); // 🚀 FIXED
    setActiveStage("camera");
  };

  const handleHistorySelect = (record) => {
    setCapturedImage(record.image_url);
    setStreamedResponse(record.ai_response || "No analysis content found.");
    setSessionID(record.session_id);
    setIsAnalyzing(false); 
    setIsChatOpen(false); // 🚀 FIXED
    setActiveStage("results");
  };

  // 🚀 NEW: mirrors SnapResults' own disabled state — chat can't be opened mid-analysis from
  // either side.
  const handleOpenChat = () => {
    if (isAnalyzing) return;
    setIsChatOpen(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col animate-fade-in relative min-h-full pb-24 lg:pb-0">
      
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
            <SnapHistory 
              history={snapHistory}
              isLoading={isHistoryLoading}
              onSelectHistory={handleHistorySelect}
              onUpdateHistory={setSnapHistory}
            />
          </div>
        </div>
      )}

      {activeStage === "cropper" && (
        <SnapCropper 
          imageSource={capturedImage} 
          onAction={handleCropComplete} 
          onCancel={handleCancelCrop} 
        />
      )}

      {activeStage === "results" && (
        <SnapResults 
          imageUrl={capturedImage} 
          onReset={handleResetToCamera} 
          onChat={handleOpenChat} // 🚀 FIXED: guarded against opening mid-analysis
          streamedResponse={streamedResponse}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* 🚀 NEW: Standalone Chat Overlay Engine */}
      <SnapChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)} 
        sessionID={sessionID}
      />

    </div>
  );
}