/**
 * [NEW BUILD]
 * SUMMARY: Executed v1.0 Vid2Notes SPA State Orchestrator - 1000% Clone of Audiobooks.
 * 1. Zero-Reload SPA Logic: Utilizes `activeStage` state ('input', 'history', 'review', 'loading', 'results', 'chat') to instantly swap visual components within the workspace.
 * 2. Payload Handoff: Seamlessly captures YouTube video data from Input stage, passes to Review stage, triggers Loading sequence, and finally routes to Results.
 * 3. Video Theme Adaptation: Replaces audio blob with video object containing url, videoId, thumbnail, title for YouTube flow.
 * ================================================================================================
 * 🎬 JEMER ACADEMY ECOSYSTEM — VID2NOTES ROUTER (v1.0)
 * ================================================================================================
 */

"use client"; // Marks as client component to allow useState hooks

import React, { useState } from "react"; // Importing useState for SPA routing and payload
// Importing all vid2notes components - same architecture as audiobooks but with vid- prefix
import VidInput from "@/jemer-components/vid2notes/vid-input.jsx"; // YouTube link input engine, replaces audio-record
import VidReview from "@/jemer-components/vid2notes/vid-review.jsx"; // Video review and preview matrix
import VidLoadingSpinner from "@/jemer-components/vid2notes/vid-loading-spinner.jsx"; // Video theme loading animation
import VidResults from "@/jemer-components/vid2notes/vid-results.jsx"; // AI results and transcription output
import VidChat from "@/jemer-components/vid2notes/vid-chat.jsx"; // Contextual tutor chat
import VidHistory from "@/jemer-components/vid2notes/vid-history.jsx"; // Video archives history

// Main page component that orchestrates the entire vid2notes flow
export default function Vid2NotesPage() {
  // ── SPA ROUTING STATES ──
  // Controller: 'input' | 'history' | 'review' | 'loading' | 'results' | 'chat'
  // Starts at 'input' which is the YouTube link entry screen
  const [activeStage, setActiveStage] = useState("input");
  
  // ── DATA PAYLOAD STATES ──
  // Stores the captured YouTube video object containing url, videoId, thumbnail, title
  // This replaces capturedAudio from audiobooks but keeps same handoff pattern
  const [capturedVideo, setCapturedVideo] = useState(null);

  // ── STATE TRANSITION PIPELINES ──

  // Triggered when user pastes a valid YouTube link and confirms
  // Receives videoData object from VidInput and moves to review stage
  const handleVideoCapture = (videoData) => {
    setCapturedVideo(videoData); // Save the video payload to state
    setActiveStage("review"); // Navigate to review matrix
  };

  // Navigates to the history archive when history button is clicked
  const handleOpenHistory = () => {
    setActiveStage("history");
  };

  // Returns from history archive back to the input screen
  const handleCloseHistory = () => {
    setActiveStage("input");
  };

  // Trashes the captured video and returns to the input screen
  // Used when user clicks Cancel in review stage
  const handleDiscardVideo = () => {
    setCapturedVideo(null); // Clear the video data
    setActiveStage("input"); // Go back to start
  };

  // Initiates the AI generation process (Triggers the loading sequence)
  // Called from review stage when user clicks Process
  const handleGenerateNotes = () => {
    setActiveStage("loading"); // Show loading spinner
    
    // Simulating backend processing delay before showing results
    // We will wire this to real Go modular monolith backend later
    setTimeout(() => {
      setActiveStage("results"); // Move to results after simulated delay
    }, 4500); // 4.5 second simulated processing time exactly like audiobooks
  };

  // Resets the entire flow to start fresh from the results screen
  // Used when user wants to process another video
  const handleResetToInput = () => {
    setCapturedVideo(null); // Clear all video data
    setActiveStage("input"); // Reset to initial stage
  };

  return (
    // Master wrapper that holds all stages, animate-fade-in for smooth entry
    <div className="w-full h-full flex flex-col animate-fade-in relative">
      
      {/* STAGE 1: FULL SCREEN YOUTUBE LINK INPUT CAPTURE */}
      {/* This is the entry point, mirrors AudioRecord but for YouTube links */}
      {activeStage === "input" && (
        <VidInput 
          onCapture={handleVideoCapture} // Passes video data up when link is valid
          onOpenHistory={handleOpenHistory} // Opens history archive
        />
      )}

      {/* STAGE 1.5: HISTORY ARCHIVE */}
      {/* Shows past video transcriptions and notes */}
      {activeStage === "history" && (
        <VidHistory 
          onBack={handleCloseHistory} // Returns to input screen
        />
      )}

      {/* STAGE 2: CUSTOM VIDEO REVIEW MATRIX */}
      {/* Shows thumbnail preview and confirmation before processing */}
      {activeStage === "review" && (
        <VidReview 
          videoData={capturedVideo} // Passes captured video object for preview
          onDiscard={handleDiscardVideo} // Discards video and goes back
          onGenerate={handleGenerateNotes} // Starts AI generation flow
        />
      )}

      {/* STAGE 3: MIND-BLOWING VIDEO LOADING ANIMATION OVERLAY */}
      {/* Shows dynamic processing steps with video theme visuals */}
      {activeStage === "loading" && (
        <VidLoadingSpinner />
      )}

      {/* STAGE 4: AI RESULTS & TRANSCRIPTION OUTPUT */}
      {/* Shows generated notes, quiz, key points, transcript etc */}
      {activeStage === "results" && (
        <VidResults 
          videoData={capturedVideo} // Passes video data to display title and player
          onReset={handleResetToInput} // Resets flow to start fresh
          onChat={() => setActiveStage("chat")} // Opens chat tutor
        />
      )}

      {/* STAGE 5: CONTEXTUAL TUTOR CHAT */}
      {/* Chat interface to ask questions about the video content */}
      {activeStage === "chat" && (
        <VidChat 
          onBack={() => setActiveStage("results")} // Returns to results screen
        />
      )}

    </div>
  );
}