// app/billings/page.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.1 - BILLINGS ORCHESTRATOR FIX)
 * ================================================================================================
 * 1. COMPONENT ROUTING UNLOCKED: Fixed the forever loading issue by uncommenting the import 
 *    and mounting the actual `<BuildMeAPlan />` component for Stage 2.
 * 2. STATE TRANSITION: When "Build Me A Plan" is clicked, it now flawlessly replaces the 
 *    overview with the live digital marketplace module.
 * ================================================================================================
 */

import React, { useState } from "react";
import Billings from "@/jemer-components/billings/billings";
import BuildMeAPlan from "@/jemer-components/billings/build-me-a-plan"; // 🆕 Restored Component Import

export default function BillingsPage() {
  // Local State: Tracks the active view stage ('overview' | 'custom_plan')
  const [activeView, setActiveView] = useState("overview");

  /**
   * Transitions the user to the custom plan builder marketplace
   */
  const handleOpenCustomPlan = () => {
    setActiveView("custom_plan");
  };

  /**
   * Returns the user back to the main pricing tiers overview
   */
  const handleBackToOverview = () => {
    setActiveView("overview");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center">
      
      {/* STAGE 1: BILLINGS OVERVIEW & SUBSCRIPTION TIERS */}
      {activeView === "overview" && (
        <div className="w-full animate-fade-in">
          <Billings onOpenCustomPlan={handleOpenCustomPlan} />
        </div>
      )}

      {/* STAGE 2: BUILD ME A PLAN (E-COMMERCE MODULE) */}
      {activeView === "custom_plan" && (
        <div className="w-full animate-fade-in">
          <BuildMeAPlan onBack={handleBackToOverview} />
        </div>
      )}

    </main>
  );
}