/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — JEMERPLAY MASTER VIEW CONTROLLER (FIXED COMPONENT INTEGRATION)
 * ================================================================================================
 * NEW UPGRADES:
 * 1. Fixed rendering issue by replacing inline template views with the actual modular imported component files (`JemerPlayHome`, `JemerPlaySearchResults`, `JemerPlayMediaPlayer`).
 * 2. Passed the required props down seamlessly from `page.js` into the dedicated component modules.
 */

"use client";

import React, { useState } from "react";

// ── IMPORT MODULAR COMPONENT FILES ──
import JemerPlayHome from "@/jemer-components/jemerplay/jemerplay-home.jsx";
import JemerPlaySearchResults from "@/jemer-components/jemerplay/jemerplay-search-results.jsx";
import JemerPlayMediaPlayer from "@/jemer-components/jemerplay/jemerplay-media-player.jsx";

// ── DUMMY DATABASE PAYLOAD ──
const DUMMY_VIDEOS = [
  { id: "1", title: "Introduction to React Next.js Architecture", channel: "Jemer Code", duration: "14:20", views: "1.2M", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80" },
  { id: "2", title: "Advanced Quantum Mechanics Simplified", channel: "Science Academy", duration: "45:00", views: "340K", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80" },
  { id: "3", title: "The History of Ancient Civilizations", channel: "History Daily", duration: "22:15", views: "890K", thumbnail: "https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?w=800&q=80" },
  { id: "4", title: "Understanding Graph Data Structures", channel: "Dev Mastery", duration: "18:45", views: "2.1M", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" },
  { id: "5", title: "Mastering Tailwind CSS Grids", channel: "UI Wizards", duration: "30:10", views: "450K", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80" },
];

export default function JemerPlayPage() {
  // ── ROUTING STATE MACHINE ──
  const [activeView, setActiveView] = useState("home"); // Options: 'home', 'results', 'player'
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  // ── ACTION HANDLERS ──
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) setActiveView("results");
  };

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    setActiveView("player");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Auto-scroll to top when a video is clicked
  };

  const resetToHome = () => {
    setActiveView("home");
    setSearchQuery("");
  };

  return (
    <div className="w-full min-h-full animate-fade-in text-slate-900 dark:text-slate-100 relative">
      {/* Component Mounting Logic - Now rendering the imported modular files correctly */}
      {activeView === "home" && (
        <JemerPlayHome 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
          onVideoSelect={handleVideoSelect} 
          dummyVideos={DUMMY_VIDEOS}
        />
      )}
      {activeView === "results" && (
        <JemerPlaySearchResults 
          searchQuery={searchQuery} 
          goHome={resetToHome} 
          onVideoSelect={handleVideoSelect} 
          dummyVideos={DUMMY_VIDEOS}
        />
      )}
      {activeView === "player" && (
        <JemerPlayMediaPlayer 
          video={activeVideo} 
          goHome={resetToHome} 
          onVideoSelect={handleVideoSelect} 
          dummyVideos={DUMMY_VIDEOS}
        />
      )}
    </div>
  );
}