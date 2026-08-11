// src/jemer-components/brain-training/brain-training-results.jsx
"use client";
/**
 * [NEW UPGRADE]
 * SUMMARY: v2.0 Live Cognitive Analytics Grading Engine.
 * 1. Absolute Real Grading: Completely replaced random dummy numbers with mathematically precise grading based on actual DB telemetry. Compares `userAnswers` against `q.correct_answer`.
 * 2. Plotly Bar Chart Hydration: Dynamically groups the real questions by `sub_topic` and evaluates performance per module to render accurate analytical columns.
 * 3. Review Render Handoff: Correctly loops through the `realSession` questions to populate the post-quiz review log so the user can verify mistakes exactly as the AI graded them.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING COGNITIVE ANALYTICS (v2.0)
 * ================================================================================================
 */

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";

// Safe dynamic import for Plotly to prevent Next.js SSR window errors
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
      <div className="w-8 h-8 rounded-full border-4 border-rose-400 border-t-transparent animate-spin mb-3"></div>
      <span className="text-xs font-bold text-slate-500">Loading Cognitive Analytics...</span>
    </div>
  ),
});

/**
 * Universal E-Sports / Gaming Style Grading System
 */
const getCognitiveTier = (percentage) => {
  if (percentage >= 90) return "S-Tier"; // Master
  if (percentage >= 80) return "A-Tier"; // Expert
  if (percentage >= 70) return "B-Tier"; // Proficient
  if (percentage >= 60) return "C-Tier"; // Competent
  return "D-Tier"; // Novice
};

export default function BrainTrainingResults({ sessionData, onRestart }) {
  const [showReview, setShowReview] = useState(false);

  // Dynamic theme colors for Plotly charts
  const primaryChartColor = "#e11d48"; // rose-600
  const secondaryChartColor = "#f43f5e"; // rose-500
  const neutralChartColor = "#94a3b8"; // slate-400

  // 🚀 FIXED: Genuine Grading Engine Processing Live Telemetry
  const gradedData = useMemo(() => {
    const { userAnswers = {}, realSession = {} } = sessionData || {};
    const questions = realSession.questions || [];
    const topicName = realSession.topic || "Custom Neural Matrix";
    
    const totalMaxRaw = questions.length || 1; 

    let totalCorrect = 0;
    let totalWrong = 0;
    const subTopicStats = {};

    // Execute grading sequence
    questions.forEach(q => {
      const topicKey = q.sub_topic || "General";
      if (!subTopicStats[topicKey]) {
        subTopicStats[topicKey] = { total: 0, correct: 0 };
      }
      subTopicStats[topicKey].total += 1;

      const ans = userAnswers[q.id];
      if (ans) {
        if (ans === q.correct_answer) {
          totalCorrect++;
          subTopicStats[topicKey].correct += 1;
        } else {
          totalWrong++;
        }
      }
    });

    const totalSkipped = totalMaxRaw - totalCorrect - totalWrong;
    const percentage = Math.round((totalCorrect / totalMaxRaw) * 100) || 0;
    const tier = getCognitiveTier(percentage);

    // Map stats safely to Bar Chart data structure based on actual sub_topics
    const subPhases = Object.keys(subTopicStats).map(sub => {
      const stat = subTopicStats[sub];
      const sc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      // Abbreviate very long subtopic names for the chart x-axis
      const shortName = sub.length > 20 ? sub.substring(0, 20) + "..." : sub;
      return { name: shortName, score: sc };
    });

    return {
      topicName,
      rawScore: totalCorrect,
      maxRaw: totalMaxRaw,
      percentage,
      tier,
      totalCorrect,
      totalWrong,
      totalSkipped,
      subPhases
    };
  }, [sessionData]);

  // 🚀 FIXED: Map Real Questions for Post-Quiz Review
  const reviewQuestions = useMemo(() => {
    const { userAnswers = {}, realSession = {} } = sessionData || {};
    const questions = realSession.questions || [];
    
    const grouped = {};
    questions.forEach((q, i) => {
      const topicKey = q.sub_topic || "General";
      if (!grouped[topicKey]) grouped[topicKey] = [];
      
      const uAns = userAnswers[q.id];
      const isCorrect = uAns === q.correct_answer;
      
      grouped[topicKey].push({
        id: q.id,
        number: i + 1,
        questionText: q.question_text,
        userAnswer: uAns,
        correctAnswer: q.correct_answer,
        isCorrect
      });
    });

    return Object.keys(grouped).map(key => ({
      subject: key,
      questions: grouped[key]
    }));
  }, [sessionData]);

  // ── 📊 PLOTLY CONFIGURATIONS ──────────────────────────────────────────────────────────────
  const barChartData = [
    {
      x: gradedData.subPhases.map(p => p.name),
      y: gradedData.subPhases.map(p => p.score),
      type: "bar",
      marker: { color: primaryChartColor, borderRadius: 4 },
      text: gradedData.subPhases.map(p => `${p.score}%`),
      textposition: "auto",
      hoverinfo: "y",
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
      marker: { colors: [primaryChartColor, "#fb7185", neutralChartColor] },
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
      value: gradedData.percentage,
      number: { suffix: "%", font: { color: primaryChartColor, size: 26, family: "inherit" } },
      title: { text: "Synapse Activation Index", font: { size: 11, color: "#64748b" } },
      gauge: {
        axis: { range: [0, 100], tickwidth: 1, tickcolor: "#64748b" },
        bar: { color: primaryChartColor },
        bgcolor: "transparent", borderwidth: 0,
        steps: [
          { range: [0, 60], color: "rgba(225, 29, 72, 0.05)" },
          { range: [60, 85], color: "rgba(225, 29, 72, 0.15)" },
          { range: [85, 100], color: "rgba(225, 29, 72, 0.3)" },
        ],
      },
    },
  ];

  const gaugeChartLayout = { autosize: true, margin: { t: 25, b: 15, l: 25, r: 25 }, paper_bgcolor: "transparent", font: { color: "#64748b", family: "inherit" } };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12 lg:pb-16 overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .brain-premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .brain-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .brain-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(225, 29, 72, 0.4); border-radius: 10px; }
        .brain-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(225, 29, 72, 0.7); }
      `}} />

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 1: CANDIDATE OVERVIEW HERO BANNER
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-rose-900 via-slate-900 to-pink-950 border border-rose-500/20 text-white overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-rose-500/20" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none bg-pink-500/10" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
          <div className="space-y-3 min-w-0 w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono border bg-rose-500/20 text-rose-300 border-rose-500/30">
              <span className="w-2 h-2 rounded-full shrink-0 bg-rose-400 animate-pulse" />
              Neural Pathway Calibrated
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white truncate">
              Topic: <span className="text-rose-400">{gradedData.topicName}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                ID: JEM-BRN-998
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Cognitive Focus
              </span>
            </div>
          </div>
          <button onClick={onRestart} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md backdrop-blur-sm transition-all active:scale-95 shrink-0 text-center flex items-center justify-center gap-2 focus:outline-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Hub
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 2: SCORE BOARD & PLOTLY ANALYTICS ENGINE
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Total Score & Breakdown Table */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-pink-400" />
            
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
              Cognitive Mastery Percentage
            </h2>
            
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                {gradedData.percentage}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400">%</span>
            </div>
            <div className="mt-4 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Rank: {gradedData.tier}
            </div>
          </div>

          <div className="p-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto brain-premium-scroll">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400">Training Module</th>
                    <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400 text-center">Raw</th>
                    <th className="p-3 sm:p-4 text-[11px] sm:text-xs font-black uppercase text-slate-500 dark:text-slate-400 text-right">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                      {gradedData.topicName}
                    </td>
                    <td className="p-3 sm:p-4 text-[11px] sm:text-xs font-mono font-medium text-slate-500 text-center">
                      {gradedData.rawScore}/{gradedData.maxRaw}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm font-black font-mono text-rose-600 dark:text-rose-400 text-right">
                      {gradedData.tier}
                    </td>
                  </tr>
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
                <span className="w-2 h-2 rounded-full shrink-0 bg-rose-500" /> 
                Sub-Topic Accuracy
              </h3>
              <div className="flex-1 w-full h-full min-h-0 relative">
                <Plot data={barChartData} layout={barChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] sm:h-[300px] w-full min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0 bg-pink-500" /> 
                Decision Accuracy
              </h3>
              <div className="flex-1 w-full h-full min-h-0 relative">
                <Plot data={pieChartData} layout={pieChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center h-[200px] sm:h-[220px] w-full min-w-0 relative">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white absolute top-4 left-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0 bg-rose-400" /> 
              Synapse Activation Index
            </h3>
            <div className="w-full h-full pt-4 relative flex items-center justify-center">
              <Plot data={gaugeChartData} layout={gaugeChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
            </div>
          </div>

        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 3: JEMER TUTOR'S REMARK
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 border from-rose-50 via-pink-50 to-rose-50 dark:from-rose-950/40 dark:via-pink-900/20 dark:to-rose-950/40 border-rose-200 dark:border-rose-800/50">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg shrink-0 relative z-10 from-rose-500 to-pink-600 shadow-rose-500/30">
          <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="relative z-10 flex-1 space-y-2 min-w-0">
          <h3 className="text-base sm:text-lg font-black text-rose-900 dark:text-rose-300">
            Jemer Tutor AI Insight
          </h3>
          <p className="text-xs sm:text-sm font-medium leading-relaxed break-words text-rose-950/80 dark:text-rose-200/80">
            {gradedData.percentage >= 80 
              ? `"Incredible cognitive focus! Attaining ${gradedData.tier} status confirms your deep understanding of this topic. Review the few questions below where your logic slipped to achieve absolute perfection."`
              : `"Solid effort. You secured a ${gradedData.tier} ranking. Open the AI Corrections below to see exactly how to bridge the logic gaps and master the neural matrix next time."`
            }
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 4: CORRECTIONS & REVIEW ENGINE
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <button onClick={() => setShowReview(!showReview)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black uppercase tracking-wider text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-3 mx-auto focus:outline-none">
          <span>{showReview ? "Hide Neural Logs" : "Reveal Neural Logs & Corrections"}</span>
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
                      
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-black text-sm flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {q.number}
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed break-words">
                          {q.questionText}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono font-bold">
                          <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border ${
                            q.isCorrect 
                              ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                              : "bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}>
                            <span>Your Choice: {q.userAnswer || "None"}</span>
                            {q.isCorrect ? (
                              <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                          </div>
                          
                          {!q.isCorrect && (
                            <div className="px-3 py-1.5 rounded-lg text-white flex items-center gap-2 shadow-sm bg-emerald-500">
                              <span>Optimal Vector: {q.correctAnswer}</span>
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
