"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.4 - EXAM PRACTICE DYNAMIC INTEGRATION)
 * ================================================================================================
 * 1. ORANGE THEMING: Injected Orange/Amber (`#f97316`) theme for `mode="practice"` across Hero, 
 *    Plotly charts, badges, table highlights, AI Tutor, and custom scrollbars.
 * 2. SINGLE-SUBJECT GRADING: Adapts the WAEC A1-F9 grading logic strictly for the 1 selected 
 *    practice subject. The Hero Score Card dynamically showcases this single subject's percentage 
 *    and exact WAEC-style grade.
 * 3. NO-BLANK-SPACE LAYOUT: Kept the identical grid structure but ensured that a 1-row table 
 *    doesn't break the visual weight balance compared to the right-side analytics column.
 * 4. DYNAMIC TEXT & INSIGHTS: Replaced UTME/WASSCE jargon with "Practice Session", "Practice 
 *    Readiness Index", and customized the AI Tutor to provide singular subject feedback.
 * 5. CONCISE COMMENTS: Cleaned up older verbose comments to optimize token usage.
 * ================================================================================================
 */

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
      <div className="w-8 h-8 rounded-full border-4 border-slate-400 border-t-transparent animate-spin mb-3"></div>
      <span className="text-xs font-bold text-slate-500">Loading Analytics Engine...</span>
    </div>
  ),
});

const getWaecGrade = (percentage) => {
  if (percentage >= 75) return "A1";
  if (percentage >= 70) return "B2";
  if (percentage >= 65) return "B3";
  if (percentage >= 60) return "C4";
  if (percentage >= 55) return "C5";
  if (percentage >= 50) return "C6";
  if (percentage >= 45) return "D7";
  if (percentage >= 40) return "E8";
  return "F9";
};

export default function ExamResults({ mode = "jamb", config, sessionData, onRestart }) {
  const isWaecMode = mode === "waec";
  const isPracticeMode = mode === "practice";
  
  // Dynamic theme colors for Plotly charts
  const primaryChartColor = isPracticeMode ? "#f97316" : isWaecMode ? "#2563eb" : "#10b981"; 
  const dangerChartColor = "#f43f5e"; 
  const neutralChartColor = "#94a3b8"; 

  const [showReview, setShowReview] = useState(false);

  const gradedData = useMemo(() => {
    // Default subject mapping based on mode
    const defaultSubjects = isPracticeMode 
      ? [{ id: "english", name: "English Language", count: 40 }]
      : isWaecMode 
        ? [
            { id: "english", name: "English", count: 80 },
            { id: "mathematics", name: "Mathematics", count: 50 },
            { id: "physics", name: "Physics", count: 50 },
            { id: "chemistry", name: "Chemistry", count: 50 },
          ]
        : [
            { id: "english", name: "Use of English", count: 60 },
            { id: "mathematics", name: "Mathematics", count: 40 },
            { id: "physics", name: "Physics", count: 40 },
            { id: "chemistry", name: "Chemistry", count: 40 },
          ];

    const subjects = config?.subjects || defaultSubjects;

    let totalRaw = 0;
    let totalMaxRaw = 0;
    let totalScaled = 0; 
    let totalPercentageSum = 0; 
    let distinctionsCount = 0;
    let creditsCount = 0;

    const subjectBreakdown = subjects.map((sub) => {
      const rawScore = Math.floor(sub.count * (Math.random() * 0.55 + 0.4));
      const percentage = (rawScore / sub.count) * 100;
      const scaledScore = Math.round(percentage); 
      const roundedPct = Math.round(percentage);
      
      const grade = getWaecGrade(roundedPct);
      
      if (["A1", "B2", "B3"].includes(grade)) distinctionsCount++;
      else if (["C4", "C5", "C6"].includes(grade)) creditsCount++;

      totalRaw += rawScore;
      totalMaxRaw += sub.count;
      totalScaled += scaledScore;
      totalPercentageSum += roundedPct;

      return {
        id: sub.id,
        name: sub.name,
        rawScore,
        maxRaw: sub.count,
        scaledScore,
        percentage: roundedPct,
        grade,
      };
    });

    const averagePercentage = Math.round(totalPercentageSum / subjects.length);
    const overallReadiness = isPracticeMode 
      ? subjectBreakdown[0].percentage 
      : isWaecMode 
        ? averagePercentage 
        : Math.round((totalScaled / 400) * 100);

    const totalCorrect = totalRaw;
    const totalWrong = Math.floor((totalMaxRaw - totalCorrect) * 0.8);
    const totalSkipped = totalMaxRaw - totalCorrect - totalWrong;

    return {
      subjectBreakdown,
      totalScaled,
      averagePercentage,
      distinctionsCount,
      creditsCount,
      overallReadiness,
      totalCorrect,
      totalWrong,
      totalSkipped,
    };
  }, [config, isWaecMode, isPracticeMode]);

  const reviewQuestions = useMemo(() => {
    return gradedData.subjectBreakdown.map((sub) => ({
      subject: sub.name,
      questions: Array.from({ length: 5 }).map((_, i) => {
        const isCorrect = Math.random() > 0.4;
        const correctOpt = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
        const userOpt = isCorrect ? correctOpt : ["A", "B", "C", "D"].find(o => o !== correctOpt);
        
        return {
          id: `${sub.id}-${i + 1}`,
          number: i + 1,
          questionText: `Sample question stem for ${sub.name}. What is the correct interpretation of this concept?`,
          userAnswer: userOpt,
          correctAnswer: correctOpt,
          isCorrect,
        };
      }),
    }));
  }, [gradedData]);

  // Plotly Configurations
  const barChartData = [
    {
      x: gradedData.subjectBreakdown.map((s) => s.name.substring(0, 10) + (s.name.length > 10 ? "..." : "")),
      y: gradedData.subjectBreakdown.map((s) => (isWaecMode || isPracticeMode) ? s.percentage : s.scaledScore),
      type: "bar",
      marker: { color: primaryChartColor, borderRadius: 4 },
      text: gradedData.subjectBreakdown.map((s) => (isWaecMode || isPracticeMode) ? `${s.percentage}%` : `${s.scaledScore}`),
      textposition: "auto",
      hoverinfo: "x+y",
    },
  ];

  const barChartLayout = {
    autosize: true, margin: { t: 20, b: 40, l: 30, r: 15 },
    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
    font: { color: "#64748b", family: "inherit" },
    xaxis: { fixedrange: true, showgrid: false, automargin: true, tickfont: { size: 10, color: "#64748b" } },
    yaxis: { fixedrange: true, range: [0, 105], showgrid: true, gridcolor: "rgba(148, 163, 184, 0.1)", tickfont: { size: 10 } },
  };

  const pieChartData = [
    {
      values: [gradedData.totalCorrect, gradedData.totalWrong, gradedData.totalSkipped],
      labels: ["Correct", "Incorrect", "Unanswered"],
      type: "pie", hole: 0.6,
      marker: { colors: [primaryChartColor, dangerChartColor, neutralChartColor] },
      textinfo: "percent", hoverinfo: "label+value",
    },
  ];

  const pieChartLayout = {
    autosize: true, margin: { t: 20, b: 20, l: 20, r: 20 },
    paper_bgcolor: "transparent", font: { color: "#64748b", family: "inherit" },
    showlegend: true, legend: { orientation: "h", y: -0.2, x: 0.5, xanchor: "center" },
  };

  const gaugeChartData = [
    {
      type: "indicator", mode: "gauge+number",
      value: gradedData.overallReadiness,
      number: { suffix: "%", font: { color: primaryChartColor, size: 26, family: "inherit" } },
      title: { text: isPracticeMode ? "Practice Readiness Index" : isWaecMode ? "WASSCE Readiness Index" : "UTME Readiness Index", font: { size: 11, color: "#64748b" } },
      gauge: {
        axis: { range: [0, 100], tickwidth: 1, tickcolor: "#64748b" },
        bar: { color: primaryChartColor },
        bgcolor: "transparent", borderwidth: 0,
        steps: [
          { range: [0, 50], color: "rgba(244, 63, 94, 0.12)" },
          { range: [50, 75], color: "rgba(245, 158, 11, 0.12)" },
          { range: [75, 100], color: isPracticeMode ? "rgba(249, 115, 22, 0.12)" : isWaecMode ? "rgba(37, 99, 235, 0.12)" : "rgba(16, 185, 129, 0.12)" },
        ],
      },
    },
  ];

  const gaugeChartLayout = { autosize: true, margin: { t: 25, b: 15, l: 25, r: 25 }, paper_bgcolor: "transparent", font: { color: "#64748b", family: "inherit" } };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12 lg:pb-16 overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-exam-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-exam-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isPracticeMode ? 'rgba(249, 115, 22, 0.4)' : isWaecMode ? 'rgba(37, 99, 235, 0.4)' : 'rgba(16, 185, 129, 0.4)'}; 
          border-radius: 10px; 
        }
        .custom-exam-scrollbar::-webkit-scrollbar-thumb:hover { 
          background-color: ${isPracticeMode ? 'rgba(249, 115, 22, 0.7)' : isWaecMode ? 'rgba(37, 99, 235, 0.7)' : 'rgba(16, 185, 129, 0.7)'}; 
        }
      `}} />

      {/* SECTION 1: CANDIDATE OVERVIEW HERO BANNER */}
      <div className={`relative rounded-3xl p-5 sm:p-8 bg-gradient-to-br text-white overflow-hidden shadow-2xl border ${
        isPracticeMode ? "from-orange-900 via-slate-900 to-amber-950 border-orange-500/20" :
        isWaecMode ? "from-blue-900 via-slate-900 to-indigo-950 border-blue-500/20" :
        "from-emerald-900 via-slate-900 to-teal-950 border-emerald-500/20"
      }`}>
        <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isPracticeMode ? "bg-orange-500/20" : isWaecMode ? "bg-blue-500/20" : "bg-emerald-500/20"}`} />
        <div className={`absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none ${isPracticeMode ? "bg-amber-500/10" : isWaecMode ? "bg-indigo-500/10" : "bg-teal-500/10"}`} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
          <div className="space-y-3 min-w-0 w-full md:w-auto">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono border ${
              isPracticeMode ? "bg-orange-500/20 text-orange-300 border-orange-500/30" :
              isWaecMode ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
              "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            }`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${isPracticeMode ? "bg-orange-400" : isWaecMode ? "bg-blue-400" : "bg-emerald-400"}`} />
              {isPracticeMode ? "Practice Session Completed" : isWaecMode ? "WASSCE Session Completed" : "JAMB CBT Session Completed"}
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white truncate">
              Candidate: <span className={isPracticeMode ? "text-orange-400" : isWaecMode ? "text-blue-400" : "text-emerald-400"}>John Jonathan</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5 shrink-0">
                <svg className={`w-4 h-4 shrink-0 ${isPracticeMode ? "text-orange-500" : isWaecMode ? "text-blue-500" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                Reg: 202698547210
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <svg className={`w-4 h-4 shrink-0 ${isPracticeMode ? "text-orange-500" : isWaecMode ? "text-blue-500" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time Used: {isPracticeMode ? "Custom Drill" : isWaecMode ? "Subject Varied" : "1 hr 45 mins"}
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <svg className={`w-4 h-4 shrink-0 ${isPracticeMode ? "text-orange-500" : isWaecMode ? "text-blue-500" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {gradedData.subjectBreakdown.length} Subject{gradedData.subjectBreakdown.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button onClick={onRestart} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md backdrop-blur-sm transition-all active:scale-95 shrink-0 text-center">
            Start New Exam
          </button>
        </div>
      </div>

      {/* SECTION 2: SCORE BOARD & PLOTLY ANALYTICS ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Total Score & Breakdown Table */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
              isPracticeMode ? "from-orange-500 to-amber-400" :
              isWaecMode ? "from-blue-500 to-indigo-400" : 
              "from-emerald-500 to-teal-400"
            }`} />
            
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
              {isPracticeMode ? "Practice Score" : isWaecMode ? "WASSCE Global Aggregate" : "Aggregate UTME Score"}
            </h2>
            
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                {isPracticeMode ? gradedData.subjectBreakdown[0]?.percentage : isWaecMode ? gradedData.averagePercentage : gradedData.totalScaled}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400">
                {isPracticeMode || isWaecMode ? "%" : "/ 400"}
              </span>
            </div>

            <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold border ${
              isPracticeMode ? "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50" :
              isWaecMode ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50" :
              "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
            }`}>
              {isPracticeMode 
                ? `Grade Achieved: ${gradedData.subjectBreakdown[0]?.grade}`
                : isWaecMode 
                  ? `${gradedData.distinctionsCount} Distinctions | ${gradedData.creditsCount} Credits`
                  : (gradedData.totalScaled >= 250 ? "Excellent Performance 🚀" : "Average Performance 👍")
              }
            </div>
          </div>

          <div className="p-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-exam-scrollbar">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400">Subject</th>
                    <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400 text-center">Raw</th>
                    
                    {(isWaecMode || isPracticeMode) ? (
                      <>
                        <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400 text-center">Score</th>
                        <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400 text-right">Grade</th>
                      </>
                    ) : (
                      <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400 text-right">JAMB Scaled</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {gradedData.subjectBreakdown.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                        {sub.name}
                      </td>
                      <td className="p-3 sm:p-4 text-[11px] sm:text-xs font-mono font-medium text-slate-500 text-center">
                        {sub.rawScore}/{sub.maxRaw}
                      </td>
                      
                      {(isWaecMode || isPracticeMode) ? (
                        <>
                          <td className="p-3 sm:p-4 text-xs sm:text-sm font-black font-mono text-slate-700 dark:text-slate-300 text-center">
                            {sub.percentage}%
                          </td>
                          <td className={`p-3 sm:p-4 text-xs sm:text-sm font-black font-mono text-right ${
                            ["A1", "B2", "B3"].includes(sub.grade) ? (isPracticeMode ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400") :
                            ["C4", "C5", "C6"].includes(sub.grade) ? (isPracticeMode ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400") :
                            "text-rose-600 dark:text-rose-400"
                          }`}>
                            {sub.grade}
                          </td>
                        </>
                      ) : (
                        <td className="p-3 sm:p-4 text-xs sm:text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 text-right">
                          {sub.scaledScore}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Plotly Data Visualization Stack */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] sm:h-[300px] w-full min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isPracticeMode ? "bg-orange-500" : isWaecMode ? "bg-blue-500" : "bg-emerald-500"}`} /> 
                Subject Mastery
              </h3>
              <div className="flex-1 w-full h-full min-h-0 relative">
                <Plot data={barChartData} layout={barChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] sm:h-[300px] w-full min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isPracticeMode ? "bg-orange-500" : "bg-indigo-500"}`} /> 
                Overall Accuracy
              </h3>
              <div className="flex-1 w-full h-full min-h-0 relative">
                <Plot data={pieChartData} layout={pieChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center h-[200px] sm:h-[220px] w-full min-w-0 relative">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white absolute top-4 left-5 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isPracticeMode ? "bg-amber-400" : isWaecMode ? "bg-blue-400" : "bg-teal-500"}`} /> 
              Speed & Readiness Index
            </h3>
            <div className="w-full h-full pt-4 relative flex items-center justify-center">
              <Plot data={gaugeChartData} layout={gaugeChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: JEMER TUTOR'S REMARK */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 border ${
        isPracticeMode ? "from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/40 dark:via-amber-900/20 dark:to-orange-950/40 border-orange-200 dark:border-orange-800/50" :
        "from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-950/40 dark:via-purple-900/20 dark:to-indigo-950/40 border-indigo-200 dark:border-indigo-800/50"
      }`}>
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg shrink-0 relative z-10 ${
          isPracticeMode ? "from-orange-500 to-amber-600 shadow-orange-500/30" : "from-indigo-500 to-purple-600 shadow-indigo-500/30"
        }`}>
          <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div className="relative z-10 flex-1 space-y-2 min-w-0">
          <h3 className={`text-base sm:text-lg font-black ${isPracticeMode ? "text-orange-900 dark:text-orange-300" : "text-indigo-900 dark:text-indigo-300"}`}>
            Jemer Tutor AI Insight
          </h3>
          <p className={`text-xs sm:text-sm font-medium leading-relaxed break-words ${isPracticeMode ? "text-orange-950/80 dark:text-orange-200/80" : "text-indigo-950/80 dark:text-indigo-200/80"}`}>
            {isPracticeMode 
              ? `"Great practice session, John! You scored ${gradedData.subjectBreakdown[0]?.percentage}% (${gradedData.subjectBreakdown[0]?.grade}) in ${gradedData.subjectBreakdown[0]?.name}. Keep drilling to improve your speed and accuracy before the main exam."`
              : isWaecMode 
                ? `"Excellent performance across your ${gradedData.subjectBreakdown.length} WASSCE subjects, John! Achieving ${gradedData.distinctionsCount} Distinctions is outstanding. However, we noticed a slight pacing issue in English where 15 questions were rushed in the final 10 minutes."`
                : `"Excellent overall aggregate, John! Your mastery in Mathematics and Physics is outstanding. However, we noticed a slight pacing issue in Use of English where 15 questions were rushed in the final 10 minutes."`
            }
          </p>
        </div>
      </div>

      {/* SECTION 4: CORRECTIONS & REVIEW ENGINE */}
      <div className="space-y-4">
        <button onClick={() => setShowReview(!showReview)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black uppercase tracking-wider text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-3 mx-auto">
          <span>{showReview ? "Hide Corrections" : "Reveal Corrections & Review"}</span>
          <svg className={`w-5 h-5 transition-transform duration-300 ${showReview ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showReview && (
          <div className="animate-fade-in space-y-8 pt-4">
            {reviewQuestions.map((subjectData) => (
              <div key={subjectData.subject} className="space-y-4">
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  {subjectData.subject} Review
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  {subjectData.questions.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                      
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-black text-sm flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                        {q.number}
                      </div>

                      <div className="flex-1 space-y-3 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed break-words">
                          {q.questionText}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono font-bold">
                          <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border ${
                            q.isCorrect 
                              ? (isPracticeMode 
                                  ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                  : isWaecMode 
                                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" 
                                    : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800")
                              : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                          }`}>
                            <span>Your Answer: {q.userAnswer || "None"}</span>
                            {q.isCorrect ? (
                              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                          </div>

                          {!q.isCorrect && (
                            <div className={`px-3 py-1.5 rounded-lg text-white flex items-center gap-2 shadow-sm ${
                              isPracticeMode ? "bg-orange-500" : isWaecMode ? "bg-blue-500" : "bg-emerald-500"
                            }`}>
                              <span>Correct Answer: {q.correctAnswer}</span>
                              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}