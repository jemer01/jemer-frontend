// app/rankings/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.2 - GLOBAL RANKINGS ORCHESTRATOR)
 * ================================================================================================
 * 1. UNLOCKED COMPONENT ROUTING: Removed the placeholder "Loading..." screens from the initial 
 *    build phase. The orchestrator now successfully imports and mounts the real `<GlobalChartIndex />` 
 *    and `<RankedStudents />` components.
 * 2. SEAMLESS STATE TRANSITIONS: When a user clicks a student or the map button, the UI will 
 *    now seamlessly swap to the fully built components instead of getting stuck on the placeholder text.
 * ================================================================================================
 */

import React, { useState } from "react";
import Rankings from "@/jemer-components/rankings/rankings.jsx";
import GlobalChartIndex from "@/jemer-components/rankings/global-chart-index.jsx"; // 🆕 Unlocked Import
import RankedStudents from "@/jemer-components/rankings/ranked-students.jsx"; // 🆕 Unlocked Import

export default function RankingsPage() {
  // Local State: Tracks the active view stage ('top_100' | 'global_index' | 'student_profile')
  const [activeView, setActiveView] = useState("top_100");
  
  // Local State: Stores the data payload of the selected student record for deep-dive
  const [selectedStudent, setSelectedStudent] = useState(null);

  /**
   * Fired when a user clicks a specific student on the leaderboard or global map
   */
  const handleStudentClick = (studentData) => {
    setSelectedStudent(studentData);
    setActiveView("student_profile");
  };

  /**
   * Fired when a user clicks the bottom CTA to view the 2D Global Map
   */
  const handleOpenGlobalIndex = () => {
    setActiveView("global_index");
  };

  /**
   * Universal back button handler to return to the master top 100 list
   */
  const handleBackToRankings = () => {
    setSelectedStudent(null);
    setActiveView("top_100");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      
      {/* STAGE 1: JEMER TOP 100 STUDENTS GLOBALLY */}
      {activeView === "top_100" && (
        <Rankings 
          onStudentClick={handleStudentClick}
          onOpenGlobalIndex={handleOpenGlobalIndex}
        />
      )}

      {/* STAGE 2: 2D GLOBAL CHART INDEX & RANKS 101-200 */}
      {/* 🆕 Replaced placeholder text with the actual mounted component */}
      {activeView === "global_index" && (
        <div className="w-full animate-fade-in">
          <GlobalChartIndex 
            onStudentClick={handleStudentClick} 
            onBack={handleBackToRankings} 
          />
        </div>
      )}

      {/* STAGE 3: INDIVIDUAL STUDENT FULL-SCREEN PROFILE */}
      {/* 🆕 Replaced placeholder text with the actual mounted component */}
      {activeView === "student_profile" && selectedStudent && (
        <div className="w-full animate-fade-in">
          <RankedStudents 
            student={selectedStudent} 
            onBack={handleBackToRankings} 
          />
        </div>
      )}

    </main>
  );
}