/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 SPA State Orchestrator.
 * 1. Zero-Reload SPA Logic: Utilizes `activeStage` state ('camera', 'cropper', 'results', 'chat') to instantly swap visual components within the workspace.
 * 2. Payload Handoff: Seamlessly passes dummy image strings from the Camera down to the Cropper, and then to the Results view.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — SNAP TO ANSWER ROUTER (v1.0)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
import SnapCamera from "@/jemer-components/snap/snap-camera.jsx";
import SnapCropper from "@/jemer-components/snap/snap-cropper.jsx";
import SnapResults from "@/jemer-components/snap/snap-results.jsx";
import SnapChat from "@/jemer-components/snap/snap-chat.jsx";
import SnapHistory from "@/jemer-components/snap/snap-history.jsx";

export default function SnapPage() {
  // State Controller: 'camera' | 'cropper' | 'results' | 'chat'
  const [activeStage, setActiveStage] = useState("camera");
  const [capturedImage, setCapturedImage] = useState(null);

  // Transitions
  const handleSnap = (imageData) => {
    setCapturedImage(imageData);
    setActiveStage("cropper");
  };

  const handleCropComplete = (croppedData, actionMode) => {
    // actionMode can be 'solve', 'analyze', or 'grade'
    setCapturedImage(croppedData);
    setActiveStage("results");
  };

  const handleCancelCrop = () => {
    setCapturedImage(null);
    setActiveStage("camera");
  };

  const handleResetToCamera = () => {
    setCapturedImage(null);
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
        />
      )}

      {/* STAGE 3: TUTOR CHAT */}
      {activeStage === "chat" && (
        <SnapChat 
          onBack={() => setActiveStage("results")} 
        />
      )}

    </div>
  );
}