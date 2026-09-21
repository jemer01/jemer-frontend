"use client";

/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — SNAP TO ANSWER ROUTER (v4.0.0)
 * ================================================================================================
 * [NEW UPGRADE — v4.0.0]
 * SUMMARY: Chat Overlay Architecture & DeepSeek Integration Prep
 * 1. Overlay Chat State: Ripped out the rigid `activeStage === "chat"` router block. Introduced 
 *    `isChatOpen` state so the Tutor Chat now mounts as an elegant floating overlay *on top* of 
 *    the Results page. This allows students to still see their scanned image in the background.
 * 2. State Reset Fix: Ensured `setIsChatOpen(false)` triggers correctly during `handleResetToCamera` 
 *    and `handleHistorySelect` to prevent ghost overlays.
 * ================================================================================================
 */

import React, { useState } from "react";
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
            <SnapHistory onSelectHistory={handleHistorySelect} />
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
          onChat={() => setIsChatOpen(true)} // 🚀 FIXED: Trigger overlay instead of unmounting results
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