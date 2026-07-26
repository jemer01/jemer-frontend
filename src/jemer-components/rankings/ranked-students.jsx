"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - RANKED STUDENT DEEP DIVE PROFILE)
 * ================================================================================================
 * 1. FULL-SCREEN PROFILE CANVAS: Designed a breathtaking full-viewport dashboard overlay that 
 *    highlights a single clicked student. Sidebar and Navbar remain visible for UX consistency.
 * 2. DYNAMIC PLOTLY INTEGRATION: Utilizes `next/dynamic` to render a stunning React-Plotly line 
 *    chart demonstrating the student's XP Growth Timeline over 6 months without SSR hydration crashes.
 * 3. ZERO BLANK SPACES: Engineered a perfect CSS Grid mapping out "Subject Masteries" (progress bars), 
 *    the "Trophy Cabinet" (Badges), and the Plotly chart so the entire screen is beautifully populated.
 * ================================================================================================
 */

import React from "react";
import dynamic from "next/dynamic";

// Safe dynamic import for Plotly to prevent Next.js SSR window errors
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
      <i className="fas fa-circle-notch fa-spin text-amber-500 text-2xl"></i>
    </div>
  ),
});

export default function RankedStudents({ student, onBack }) {
  if (!student) return null;

  // Derive an integer XP value to make the Plotly chart realistic
  const rawXP = parseInt(student.xp.replace(/,/g, ""), 10);
  
  // Plotly Line Chart Configuration (XP Growth Curve)
  const lineChartData = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Now"],
      y: [
        rawXP * 0.4, rawXP * 0.55, rawXP * 0.62, rawXP * 0.75, rawXP * 0.85, rawXP * 0.95, rawXP
      ],
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#f59e0b", width: 3, shape: "spline" }, // Smooth curved amber line
      marker: { size: 6, color: "#f59e0b" },
      fill: "tozeroy",
      fillcolor: "rgba(245, 158, 11, 0.1)", // Faded amber fill underneath
      hoverinfo: "y",
    },
  ];

  const lineChartLayout = {
    autosize: true, margin: { t: 10, b: 30, l: 40, r: 10 },
    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
    font: { color: "#64748b", family: "inherit" },
    xaxis: { fixedrange: true, showgrid: false, tickfont: { size: 10 } },
    yaxis: { fixedrange: true, showgrid: true, gridcolor: "rgba(148, 163, 184, 0.1)", tickfont: { size: 10 } },
  };

  // Mock Subject Masteries
  const subjectMasteries = [
    { name: "Mathematics", score: 98, color: "bg-blue-500" },
    { name: "Physics", score: 94, color: "bg-emerald-500" },
    { name: "English Language", score: 88, color: "bg-purple-500" },
    { name: "Chemistry", score: 91, color: "bg-teal-500" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-slide-up pb-12">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          NAVIGATION HEADER
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to Leaderboard
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HERO PROFILE CARD
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-500/20 via-orange-500/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 p-8 sm:p-12">
          
          {/* Avatar & Rank Box */}
          <div className="relative shrink-0">
            <img src={student.avatar} alt={student.name} className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl object-cover ring-4 ring-amber-500/40" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-1.5 rounded-full font-black text-sm border-2 border-white dark:border-slate-900 shadow-lg whitespace-nowrap">
              Rank #{student.rank}
            </div>
          </div>

          {/* Core Info Details */}
          <div className="flex-1 text-center md:text-left space-y-4 pt-2">
            <div>
              <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Global Competitor
              </span>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white mt-3 tracking-tight">
                {student.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-xs">
                  {student.country} Location
                </span>
                <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5">
                  <i className="fas fa-bolt"></i> {student.xp} Total XP
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              This scholar has demonstrated exceptional mastery across multiple global curricula. By maintaining high accuracy and consistent pacing, they have secured their spot among Jemer Academy's elite.
            </p>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          ANALYTICS GRID (Zero Blank Spaces Layout)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Col: Subject Masteries */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <i className="fas fa-brain text-amber-500"></i> Subject Masteries
          </h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {subjectMasteries.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{subject.name}</span>
                  <span className="font-mono">{subject.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${subject.color} rounded-full`} style={{ width: `${subject.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: XP Growth Curve (Plotly) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[300px] sm:h-auto">
          <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <i className="fas fa-chart-line text-amber-500"></i> XP Growth Timeline
          </h3>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot 
              data={lineChartData} 
              layout={lineChartLayout} 
              config={{ displayModeBar: false, responsive: true }} 
              style={{ width: "100%", height: "100%", position: "absolute" }} 
              useResizeHandler={true} 
            />
          </div>
        </div>

        {/* Bottom Full-Span Row: Trophy Cabinet */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white dark:bg-black border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <i className="fas fa-medal text-amber-400"></i> Trophy Cabinet
            </h3>
            <p className="text-xs text-slate-400 font-medium">Earned through exceptional problem solving.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            {student.badges.map((badge, idx) => (
              <div key={idx} className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
                {badge}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}