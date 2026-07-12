/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Audiobooks SPA State Orchestrator.
 * 1. Zero-Reload SPA Logic: Utilizes `activeStage` state ('record', 'history', 'review', 'loading', 'results', 'chat') to instantly swap visual components within the workspace.
 * 2. Payload Handoff: Seamlessly captures audio files from the Record stage, passes them to the Review stage, triggers the Loading sequence, and finally routes to Results.
 * ================================================================================================
 * 🎧 JEMER ACADEMY ECOSYSTEM — AUDIOBOOKS ROUTER (v1.0)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
// We will build these components in the next steps. Importing them now to lock the architecture.
import AudioRecord from "@/jemer-components/ui/audio-record.jsx";
import AudioReview from "@/jemer-components/ui/audio-review.jsx";
import AudioLoadingSpinner from "@/jemer-components/ui/audio-loading-spinner.jsx";
import AudioResults from "@/jemer-components/ui/audio-results.jsx";
import AudioChat from "@/jemer-components/ui/audio-chat.jsx";
import AudioHistory from "@/jemer-components/ui/audio-history.jsx";

export default function AudioBooksPage() {
  // ── SPA ROUTING STATES ──
  // Controller: 'record' | 'history' | 'review' | 'loading' | 'results' | 'chat'
  const [activeStage, setActiveStage] = useState("record");
  
  // ── DATA PAYLOAD STATES ──
  // Stores the actual audio file/blob captured from the device or uploaded by the user
  const [capturedAudio, setCapturedAudio] = useState(null);

  // ── STATE TRANSITION PIPELINES ──

  // Triggered when a user finishes recording or uploading a file
  const handleAudioCapture = (audioData) => {
    setCapturedAudio(audioData);
    setActiveStage("review");
  };

  // Navigates to the history archive
  const handleOpenHistory = () => {
    setActiveStage("history");
  };

  // Returns from history archive back to the record screen
  const handleCloseHistory = () => {
    setActiveStage("record");
  };

  // Trashes the captured audio and returns to the record screen
  const handleDiscardAudio = () => {
    setCapturedAudio(null);
    setActiveStage("record");
  };

  // Initiates the AI generation process (Triggers the loading sequence)
  const handleGenerateNotes = () => {
    setActiveStage("loading");
    
    // Simulating backend processing delay before showing results
    // We will wire this to a real backend API call later
    setTimeout(() => {
      setActiveStage("results");
    }, 4500); // 4.5 second simulated processing time
  };

  // Resets the entire flow to start fresh from the results screen
  const handleResetToRecord = () => {
    setCapturedAudio(null);
    setActiveStage("record");
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in relative">
      
      {/* STAGE 1: FULL SCREEN RECORD / UPLOAD CAPTURE */}
      {activeStage === "record" && (
        <AudioRecord 
          onCapture={handleAudioCapture} 
          onOpenHistory={handleOpenHistory} 
        />
      )}

      {/* STAGE 1.5: HISTORY ARCHIVE */}
      {activeStage === "history" && (
        <AudioHistory 
          onBack={handleCloseHistory} 
        />
      )}

      {/* STAGE 2: CUSTOM AUDIO REVIEW MATRIX */}
      {activeStage === "review" && (
        <AudioReview 
          audioData={capturedAudio} 
          onDiscard={handleDiscardAudio} 
          onGenerate={handleGenerateNotes} 
        />
      )}

      {/* STAGE 3: MIND-BLOWING LOADING ANIMATION OVERLAY */}
      {activeStage === "loading" && (
        <AudioLoadingSpinner />
      )}

      {/* STAGE 4: AI RESULTS & TRANSCRIPTION OUTPUT */}
      {activeStage === "results" && (
        <AudioResults 
          audioData={capturedAudio} 
          onReset={handleResetToRecord} 
          onChat={() => setActiveStage("chat")} 
        />
      )}

      {/* STAGE 5: CONTEXTUAL TUTOR CHAT */}
      {activeStage === "chat" && (
        <AudioChat 
          onBack={() => setActiveStage("results")} 
        />
      )}

    </div>
  );
}