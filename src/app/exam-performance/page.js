// app/performance-history/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.0 - PERFORMANCE HISTORY ORCHESTRATOR)
 * ================================================================================================
 * 1. 2-STAGE MACHINE: Created a streamlined 2-stage state machine (`history_list` -> `history_results`).
 * 2. DYNAMIC PROP PASSING: Captures the specific `mode`, `config`, and `sessionData` of the clicked 
 *    past exam and feeds it perfectly into our existing `<ExamResults />` component.
 * 3. HISTORY VIEW FLAG: Passes `isHistoryView={true}` to the results component to trigger the 
 *    "Back to History" button conversion.
 * ================================================================================================
 */

import React, { useState } from "react";
import PerformanceHistoryWidget from "@/jemer-components/exam/performance-history-widget";
import ExamResults from "@/jemer-components/exam/exam-results";

export default function PerformanceHistoryPage() {
  // Local State: Tracks the active view stage ('history_list' | 'history_results')
  const [viewStage, setViewStage] = useState("history_list");
  
  // Local State: Stores the data payload of the selected historical record
  const [selectedRecord, setSelectedRecord] = useState(null);

  /**
   * Fired when a user clicks a specific exam row in the history list
   */
  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setViewStage("history_results");
  };

  /**
   * Fired from the ExamResults component to return to the history list
   */
  const handleBackToList = () => {
    setSelectedRecord(null);
    setViewStage("history_list");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      
      {/* STAGE 1: PERFORMANCE HISTORY LIST DASHBOARD */}
      {viewStage === "history_list" && (
        <PerformanceHistoryWidget 
          onSelectRecord={handleSelectRecord} 
        />
      )}

      {/* STAGE 2: DYNAMIC EXAM RESULTS DASHBOARD */}
      {viewStage === "history_results" && selectedRecord && (
        <ExamResults 
          // Feed the exact mode (jamb, waec, study, etc.) to trigger the dynamic color theming
          mode={selectedRecord.mode} 
          // Feed the exact past configuration (subjects, questions count)
          config={selectedRecord.config} 
          // (Backend integration future-proofing) Feed actual user answers
          sessionData={selectedRecord.sessionData} 
          // Repurpose the restart callback to act as a "Back" button
          onRestart={handleBackToList} 
          // 🆕 Flag to inform the component it's being viewed in History Mode
          isHistoryView={true} 
        />
      )}

    </main>
  );
}