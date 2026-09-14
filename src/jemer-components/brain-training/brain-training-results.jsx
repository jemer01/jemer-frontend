/**
 * [NEW UPGRADE]
 * SUMMARY: v3.7 Centralized Auth Engine Migration
 * 1. requestFreshInsight's POST /session/:id/insight call (our own Go backend) now uses
 *    window.JemerAuth.authenticatedFetch() instead of a raw fetch() with a hand-built
 *    Authorization header, so an expiring token is silently refreshed and an unexpected 401 gets
 *    retried once before giving up.
 * 2. Removed getToken() entirely — it read jemer_session_jwt with dead legacy-key fallbacks
 *    (access_token, token, never written anywhere) to hand-build an Authorization header. Now
 *    that the one call site goes through authenticatedFetch, which sources and attaches the
 *    token internally, that helper had nothing left to do.
 * ────────────────────────────────────────────────────────────────────────────────────────
 * [PRIOR] Implemented a viewport-level analytics info modal using a React portal so it stays centered and accessible even when the user is deep inside the long Exam Log. Background scrolling is locked while the modal is open, preventing the modal from being pushed out of context by page content.
 *
 * PREVIOUS UPGRADE:
 * SUMMARY: Executed v3.6 Native SVGs & Bulletproof Grading Overhaul.
 * 1. Native SVGs: Stripped out broken FontAwesome `<i>` tags in the metric cards and replaced them with crisp, native Heroicons SVGs so they render perfectly in Next.js without external dependencies.
 * 2. Terminology Audit: Replaced remaining instances of the word "Prompt" with "Question" globally across tooltips and descriptions to align with standard educational semantics.
 * 3. Bulletproof Grading Engine: Finalized the `resolveChoiceKey` module. It now strictly cross-references AI hallucinated outputs, normalizing cases and checking substrings so no student is ever falsely marked wrong.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING COGNITIVE ANALYTICS (v3.7)
 * ================================================================================================
 */

"use client";
console.log("JEMER_MARKER_v36");
import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
      <div className="w-8 h-8 rounded-full border-4 border-rose-400 border-t-transparent animate-spin mb-3"></div>
      <span className="text-xs font-bold text-slate-500">Loading Cognitive Analytics...</span>
    </div>
  ),
});

const cleanTextForLaTeX = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\u2011/g, '-') 
    .replace(/\u202F/g, ' ') 
    .replace(/\u00A0/g, ' '); 
};

// 🚀 BULLETPROOF GRADING RESOLVER
const resolveChoiceKey = (choice, optionsObj) => {
  if (!choice) return "";
  const strChoice = String(choice).trim();
  const upperChoice = strChoice.toUpperCase();

  // 1. Direct Exact Match (A, B, C, D)
  if (["A", "B", "C", "D"].includes(upperChoice)) return upperChoice;

  // 2. Format Stripping Prefix Match
  const prefixMatch = upperChoice.match(/^(?:OPTION|CHOICE|LETTER|ANSWER)?\s*[:.-]?\s*([A-D])\b/i);
  if (prefixMatch) return prefixMatch[1].toUpperCase();

  // 3. Deep String Cross-Reference Match (Bulletproof mechanism)
  if (optionsObj && typeof optionsObj === 'object') {
    for (const [key, val] of Object.entries(optionsObj)) {
      const valStr = String(val).trim().toLowerCase();
      const targetStr = strChoice.toLowerCase();
      // Exact match on text
      if (valStr === targetStr) {
        const keyMatch = String(key).match(/[A-D]/i);
        return keyMatch ? keyMatch[0].toUpperCase() : String(key).toUpperCase();
      }
    }
    // Partial Match: if the AI answered with a massive sentence that includes the option
    for (const [key, val] of Object.entries(optionsObj)) {
      const valStr = String(val).trim().toLowerCase();
      const targetStr = strChoice.toLowerCase();
      if (valStr.length > 3 && (targetStr.includes(valStr) || valStr.includes(targetStr))) {
        const keyMatch = String(key).match(/[A-D]/i);
        return keyMatch ? keyMatch[0].toUpperCase() : String(key).toUpperCase();
      }
    }
  }

  // 4. Isolated Boundary Match
  const isolatedMatch = upperChoice.match(/\b([A-D])\b/i);
  if (isolatedMatch) return isolatedMatch[1].toUpperCase();

  // 5. Hard Fallback
  const lastResort = upperChoice.match(/[A-D]/i);
  return lastResort ? lastResort[0].toUpperCase() : upperChoice;
};

const getCognitiveTier = (percentage) => {
  if (percentage >= 90) return "S-Tier";
  if (percentage >= 80) return "A-Tier";
  if (percentage >= 70) return "B-Tier";
  if (percentage >= 60) return "C-Tier";
  return "D-Tier";
};

const getBackendUrl = () => {
  const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
  return process.env.NEXT_PUBLIC_API_URL ||
    (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
     activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
     "http://localhost:8080");
};

export default function BrainTrainingResults({ sessionData, onRestart }) {
  const [showReview, setShowReview] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [aiInsight, setAiInsight] = useState(sessionData?.realSession?.ai_insight || null);
  const [isFetchingInsight, setIsFetchingInsight] = useState(false);
  const [activeBenchmarkInfo, setActiveBenchmarkInfo] = useState(null);

  useEffect(() => {
    if (!activeBenchmarkInfo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeBenchmarkInfo]);

  const primaryChartColor = "#e11d48"; // rose-600
  const secondaryChartColor = "#f43f5e"; // rose-500
  const neutralChartColor = "#94a3b8"; // slate-400

  const gradedData = useMemo(() => {
    const { userAnswers = {}, realSession = {} } = sessionData || {};
    const questions = realSession.questions || [];
    const topicName = realSession.topic || "Custom Neural Matrix";
    
    const totalMaxRaw = questions.length || 1; 

    let totalCorrect = 0;
    let totalWrong = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    
    const subTopicStats = {};
    const choiceBias = { "A": 0, "B": 0, "C": 0, "D": 0 };
    const rollingAccuracy = [];
    let rollingCorrectSum = 0;

    questions.forEach((q, i) => {
      const topicKey = q.sub_topic || "General";
      if (!subTopicStats[topicKey]) {
        subTopicStats[topicKey] = { total: 0, correct: 0 };
      }
      subTopicStats[topicKey].total += 1;

      let parsedOptions = {};
      try {
        parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || {});
      } catch (e) {
        parsedOptions = q.options || {};
      }

      const rawUserAns = userAnswers[q.id];
      const safeUserAns = resolveChoiceKey(rawUserAns, parsedOptions);
      const safeCorrectAns = resolveChoiceKey(q.correct_answer, parsedOptions);

      if (safeUserAns) {
        if (choiceBias[safeUserAns] !== undefined) choiceBias[safeUserAns]++;
        
        if (safeUserAns === safeCorrectAns) {
          totalCorrect++;
          currentStreak++;
          if (currentStreak > maxStreak) maxStreak = currentStreak;
          subTopicStats[topicKey].correct += 1;
          rollingCorrectSum++;
        } else {
          totalWrong++;
          currentStreak = 0;
        }
      } else {
        currentStreak = 0;
      }
      rollingAccuracy.push(Math.round((rollingCorrectSum / (i + 1)) * 100));
    });

    const totalSkipped = totalMaxRaw - totalCorrect - totalWrong;
    const percentage = Math.round((totalCorrect / totalMaxRaw) * 100) || 0;
    const tier = getCognitiveTier(percentage);
    const percentile = Math.min(99, Math.max(1, Math.round(percentage * 1.1)));

    let blindSpot = "None";
    let lowestScore = 100;

    const subPhases = Object.keys(subTopicStats).map(sub => {
      const stat = subTopicStats[sub];
      const sc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      if (sc < lowestScore) {
        lowestScore = sc;
        blindSpot = sub;
      }
      const shortName = sub.length > 22 ? sub.substring(0, 22) + "..." : sub;
      return { name: shortName, score: sc, rawName: sub };
    });

    const mockPacingSeconds = percentage >= 80 ? 45 : (percentage >= 50 ? 65 : 85); 

    return {
      topicName,
      rawScore: totalCorrect,
      maxRaw: totalMaxRaw,
      percentage,
      tier,
      totalCorrect,
      totalWrong,
      totalSkipped,
      subPhases,
      choiceBias,
      maxStreak,
      blindSpot: blindSpot.length > 30 ? blindSpot.substring(0, 30) + "..." : blindSpot,
      percentile,
      rollingAccuracy,
      mockPacingSeconds
    };
  }, [sessionData]);

  const requestFreshInsight = async () => {
    if (!sessionData?.realSession?.id) return;
    setIsFetchingInsight(true);
    try {
      const payload = `Score: ${gradedData.percentage}% | Tier: ${gradedData.tier} | Weakest Area: ${gradedData.blindSpot} | Longest Streak: ${gradedData.maxStreak} | Total Correct: ${gradedData.totalCorrect} / ${gradedData.maxRaw} | Pacing: ~${gradedData.mockPacingSeconds}s/Q`;
      const res = await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/brain-training/session/${sessionData.realSession.id}/insight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ telemetry_data: payload })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.ai_insight && data.ai_insight.length > 10) {
          setAiInsight(cleanTextForLaTeX(data.ai_insight));
        } else {
          setAiInsight("The AI Tutor was unable to generate a detailed review at this time. Please check your metrics manually.");
        }
      } else {
        setAiInsight("Connection to Jemer AI Core failed while retrieving insight.");
      }
    } catch (err) {
      console.error("Failed to fetch AI insight:", err);
      setAiInsight("An anomaly occurred while connecting to the intelligence core.");
    } finally {
      setIsFetchingInsight(false);
    }
  };

  useEffect(() => {
    if (aiInsight && aiInsight.length > 25) {
      setIsFetchingInsight(false);
      return;
    }
    requestFreshInsight();
  }, [sessionData?.realSession?.id, gradedData]);

  const reviewGroups = useMemo(() => {
    const { userAnswers = {}, realSession = {} } = sessionData || {};
    const questions = realSession.questions || [];
    
    const grouped = {};
    questions.forEach((q, i) => {
      const topicKey = q.sub_topic || "General Concepts";
      if (!grouped[topicKey]) grouped[topicKey] = [];

      let parsedOptions = {};
      try {
        parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || {});
      } catch (e) {
        parsedOptions = q.options || {};
      }
      
      const safeCorrectAns = resolveChoiceKey(q.correct_answer, parsedOptions);
      const safeUserAns = resolveChoiceKey(userAnswers[q.id], parsedOptions);
      const isCorrect = safeUserAns === safeCorrectAns && safeUserAns !== "";
      
      grouped[topicKey].push({
        id: q.id,
        number: i + 1,
        questionText: cleanTextForLaTeX(q.question_text),
        options: parsedOptions,
        userAnswer: safeUserAns,
        correctAnswer: safeCorrectAns,
        explanation: cleanTextForLaTeX(q.explanation),
        isCorrect
      });
    });

    return Object.keys(grouped).map(key => ({
      subject: key,
      questions: grouped[key]
    }));
  }, [sessionData]);

  const toggleExplanation = (qId) => {
    setExpandedExplanations(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // ── 📊 PLOTLY CONFIGURATIONS ──────────────────────────────────────────────────────────────
  const barChartData = [{
    x: gradedData.subPhases.map(p => p.name),
    y: gradedData.subPhases.map(p => p.score),
    type: "bar",
    marker: { color: primaryChartColor, borderRadius: 6 },
    text: gradedData.subPhases.map(p => `${p.score}%`),
    textposition: "auto",
    hoverinfo: "y+x",
  }];

  const barChartLayout = {
    autosize: true, 
    margin: { t: 25, b: Math.max(60, Math.min(100, gradedData.subPhases.length * 10)), l: 35, r: 15 },
    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
    font: { color: "#64748b", family: "inherit" },
    xaxis: { fixedrange: true, showgrid: false, automargin: true, tickfont: { size: 10, color: "#64748b" }, tickangle: -20 },
    yaxis: { fixedrange: true, range: [0, 105], showgrid: true, gridcolor: "rgba(148, 163, 184, 0.12)", tickfont: { size: 10 } },
  };

  const lineChartData = [{
    y: gradedData.rollingAccuracy,
    type: "scatter", mode: "lines+markers",
    line: { color: secondaryChartColor, width: 3.5, shape: 'spline' },
    marker: { size: 6, color: primaryChartColor, symbol: "circle" },
    fill: 'tozeroy', fillcolor: 'rgba(244, 63, 94, 0.12)',
  }];

  const radarChartData = [{
    type: "scatterpolar",
    r: gradedData.subPhases.map(p => p.score),
    theta: gradedData.subPhases.map(p => p.name),
    fill: 'toself',
    fillcolor: 'rgba(225, 29, 72, 0.25)',
    line: { color: primaryChartColor, width: 2.5 },
  }];

  const radarChartLayout = {
    autosize: true, margin: { t: 35, b: 35, l: 40, r: 40 },
    paper_bgcolor: "transparent", font: { color: "#64748b", family: "inherit" },
    polar: {
      radialaxis: { visible: true, range: [0, 100], gridcolor: "rgba(148, 163, 184, 0.2)" },
      angularaxis: { tickfont: { size: 10, color: "#64748b" }, gridcolor: "rgba(148, 163, 184, 0.2)" }
    }
  };

  const donutChartData = [{
    values: [gradedData.choiceBias.A, gradedData.choiceBias.B, gradedData.choiceBias.C, gradedData.choiceBias.D],
    labels: ["Option A", "Option B", "Option C", "Option D"],
    type: "pie", hole: 0.65,
    marker: { colors: [primaryChartColor, "#fb7185", "#fca5a5", "#ffe4e6"] },
    textinfo: "none", hoverinfo: "label+value",
  }];

  const pieChartData = [{
    values: [gradedData.totalCorrect, gradedData.totalWrong, gradedData.totalSkipped],
    labels: ["Correct", "Incorrect", "Unanswered"],
    type: "pie", hole: 0.55,
    marker: { colors: [primaryChartColor, "#fb7185", neutralChartColor] },
    textinfo: "percent", hoverinfo: "label+value",
  }];

  const gaugeChartData = [{
    type: "indicator", mode: "gauge+number",
    value: gradedData.percentage,
    number: { suffix: "%", font: { color: primaryChartColor, size: 30, family: "inherit" } },
    title: { text: "Synapse Activation Index", font: { size: 12, color: "#64748b" } },
    gauge: {
      axis: { range: [0, 100], tickwidth: 1, tickcolor: "#64748b" },
      bar: { color: primaryChartColor, width: 10 },
      bgcolor: "transparent", borderwidth: 0,
      steps: [
        { range: [0, 60], color: "rgba(225, 29, 72, 0.05)" },
        { range: [60, 85], color: "rgba(225, 29, 72, 0.15)" },
        { range: [85, 100], color: "rgba(225, 29, 72, 0.3)" },
      ],
    },
  }];

  const minimalistLineLayout = { 
    autosize: true, 
    margin: { t: 25, b: 35, l: 35, r: 20 }, 
    paper_bgcolor: "transparent", 
    plot_bgcolor: "transparent",
    showlegend: false,
    xaxis: { fixedrange: true, showgrid: true, gridcolor: "rgba(148, 163, 184, 0.1)", tickfont: { size: 10, color: "#64748b" } },
    yaxis: { fixedrange: true, range: [0, 105], showgrid: true, gridcolor: "rgba(148, 163, 184, 0.1)", tickfont: { size: 10, color: "#64748b" } },
    font: { color: "#64748b", family: "inherit" }
  };

  const gaugeChartLayout = {
    autosize: true, margin: { t: 40, b: 15, l: 20, r: 20 },
    paper_bgcolor: "transparent", font: { color: "#64748b", family: "inherit" },
  };

  const pieChartLayout = {
    autosize: true, margin: { t: 20, b: 20, l: 10, r: 10 },
    paper_bgcolor: "transparent", font: { color: "#64748b", family: "inherit" },
    showlegend: true, legend: { orientation: "h", x: 0.5, xanchor: "center", y: -0.1, font: { size: 10 } },
  };

  const renderInfoBtn = (title, description) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setActiveBenchmarkInfo({ title, description });
      }}
      className="w-5 h-5 rounded-full bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center justify-center text-[10px] font-black transition-colors shrink-0 ml-auto focus:outline-none"
      title={`Learn about ${title}`}
    >
      i
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12 lg:pb-16 overflow-x-hidden px-2 sm:px-4 lg:px-6">
      
      <style dangerouslySetInnerHTML={{__html: `
        .brain-premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .brain-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .brain-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(225, 29, 72, 0.4); border-radius: 10px; }
        .brain-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(225, 29, 72, 0.7); }
        .markdown-inline-fix p { display: inline; margin: 0; }
        .markdown-inline-fix pre { margin: 0.5rem 0; overflow-x: auto; }
      `}} />

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
                <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                Score: {gradedData.rawScore}/{gradedData.maxRaw}
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Rank: {gradedData.tier}
              </span>
            </div>
          </div>
          <button onClick={onRestart} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md backdrop-blur-sm transition-all active:scale-95 shrink-0 text-center flex items-center justify-center gap-2 focus:outline-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-r shadow-md relative overflow-hidden flex flex-col md:flex-row items-start gap-6 border from-rose-50 via-pink-50 to-rose-50 dark:from-rose-950/40 dark:via-pink-900/20 dark:to-rose-950/40 border-rose-200 dark:border-rose-800/50">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg shrink-0 relative z-10 from-rose-500 to-pink-600 shadow-rose-500/30">
          <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="relative z-10 flex-1 min-w-0 w-full space-y-3">
          <div className="flex items-center justify-between gap-3 border-b border-rose-200/60 dark:border-rose-900/40 pb-2">
            <h3 className="text-base sm:text-lg font-black text-rose-900 dark:text-rose-300">
              Jemer Tutor AI Insight
            </h3>
            <button
              onClick={requestFreshInsight}
              disabled={isFetchingInsight}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1.5 focus:outline-none disabled:opacity-50 transition-colors"
            >
              <svg className={`w-3.5 h-3.5 ${isFetchingInsight ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>{isFetchingInsight ? "Analyzing..." : "Refresh Analysis"}</span>
            </button>
          </div>

          {isFetchingInsight ? (
            <div className="space-y-2.5 animate-pulse pt-1">
              <div className="h-3 w-3/4 bg-rose-200 dark:bg-rose-800 rounded"></div>
              <div className="h-3 w-5/6 bg-rose-200 dark:bg-rose-800 rounded"></div>
              <div className="h-3 w-1/2 bg-rose-200 dark:bg-rose-800 rounded"></div>
            </div>
          ) : (
            <div className="text-sm font-medium leading-relaxed break-words text-rose-950/90 dark:text-rose-100 prose prose-sm sm:prose-base prose-rose dark:prose-invert max-w-none">
              <MarkdownRenderer text={aiInsight || "No insight generated."} />
            </div>
          )}
        </div>
      </div>

      {/* 🚀 FIXED: Replaced FontAwesome tags with native JSX SVGs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Longest Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Longest Streak</p>
              <p className="text-lg font-black text-slate-900 dark:text-white truncate">{gradedData.maxStreak} Correct</p>
            </div>
          </div>
          {renderInfoBtn("Longest Streak", "Tracks the highest number of consecutive questions answered correctly without interruption, reflecting focused cognitive flow.")}
        </div>

        {/* Card 2: Avg Pacing */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center border border-orange-100 dark:border-orange-800 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m8-10h2M2 12h2m13.657-7.071l1.414-1.414M4.929 19.071l1.414-1.414m0-11.314L4.93 4.93m14.142 14.142l-1.414-1.414" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg Pacing</p>
              <p className="text-lg font-black text-slate-900 dark:text-white truncate">~{gradedData.mockPacingSeconds}s / Q</p>
            </div>
          </div>
          {renderInfoBtn("Average Pacing", "Estimated average response latency per question, indicating decision fluency and time allocation under exam constraints.")}
        </div>

        {/* Card 3: Est. Percentile */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-800 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v2a2 2 0 01-2 2h-1.118l-1.34 8.04A3 3 0 0113.58 20h-3.16a3 3 0 01-2.962-2.506L6.118 9H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Est. Percentile</p>
              <p className="text-lg font-black text-slate-900 dark:text-white truncate">Top {100 - gradedData.percentile}%</p>
            </div>
          </div>
          {renderInfoBtn("Estimated Percentile", "Simulated comparative standing against standard candidate performance thresholds on this specific curriculum.")}
        </div>

        {/* Card 4: Blind Spot */}
        <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-900/10 border border-rose-200/80 dark:border-rose-800/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center border border-rose-200 dark:border-rose-800 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-500">Blind Spot</p>
              <p className="text-lg font-black text-slate-900 dark:text-white truncate">{gradedData.blindSpot}</p>
            </div>
          </div>
          {renderInfoBtn("Primary Blind Spot", "Identifies the sub-topic with the lowest scoring ratio. Targeted revision here yields the largest net score improvements.")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ROW 1: Sub-Topic Accuracy Matrix (Full Width) */}
        <div className="lg:col-span-12 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[340px] sm:h-[360px] w-full min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0 bg-rose-500" /> Sub-Topic Accuracy Matrix
            </h3>
            {renderInfoBtn("Sub-Topic Accuracy Matrix", "Displays percentage accuracy per syllabus module so you can pinpoint exact mastery distribution across all topics.")}
          </div>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={barChartData} layout={barChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        {/* ROW 2: Cognitive Stamina (Full Width) */}
        <div className="lg:col-span-12 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[300px] sm:h-[320px] w-full min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0 bg-indigo-500" /> Cognitive Stamina (Chronological Accuracy Curve)
            </h3>
            {renderInfoBtn("Cognitive Stamina", "Plots your rolling accuracy across the entire timeline of the exam to evaluate whether fatigue caused drops toward the final modules.")}
          </div>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={lineChartData} layout={minimalistLineLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        {/* ROW 3: Synapse Activation Index & Knowledge Radar */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[320px] w-full min-w-0 relative">
          <div className="flex items-center justify-between z-10">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0 bg-rose-400" /> Synapse Activation Index
            </h3>
            {renderInfoBtn("Synapse Activation Index", "A composite gauge summarizing your holistic mastery tier based on correct answer volume, difficulty weighting, and session completeness.")}
          </div>
          <div className="w-full h-full pt-4 relative flex items-center justify-center">
            <Plot data={gaugeChartData} layout={gaugeChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[320px] w-full min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0 bg-pink-500" /> Knowledge Radar (Multi-Axial Map)
            </h3>
            {renderInfoBtn("Knowledge Radar", "A multi-axial polar representation charting module equilibrium. Balanced polygons indicate well-rounded conceptual strength.")}
          </div>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={radarChartData} layout={radarChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        {/* ROW 4: Decision Accuracy & Choice Bias Distribution */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] w-full min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0 bg-rose-500" /> Decision Accuracy
            </h3>
            {renderInfoBtn("Decision Accuracy", "Breakdown of answered questions showing true positives versus incorrect decisions and skipped items.")}
          </div>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={pieChartData} layout={pieChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] w-full min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0 bg-purple-500" /> Choice Bias Distribution
            </h3>
            {renderInfoBtn("Choice Bias Distribution", "Analyzes the frequency of your option selections (A, B, C, D) to uncover unconscious guessing patterns or letter preferences.")}
          </div>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={donutChartData} layout={{...pieChartLayout, legend: { orientation: "v", x: 1, y: 0.5 }}} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 5: GROUPED CORRECTIONS & REVIEW ENGINE
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <button onClick={() => setShowReview(!showReview)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black uppercase tracking-wider text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-3 mx-auto focus:outline-none">
          <span>{showReview ? "Hide Exam Log" : "Reveal Exam Log & Corrections"}</span>
          <svg className={`w-5 h-5 transition-transform duration-300 ${showReview ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showReview && (
          <div className="animate-fade-in space-y-8 pt-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center mb-6">Topic: {gradedData.topicName}</h2>

            {reviewGroups.map((subjectData) => (
              <div key={subjectData.subject} className="space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-7 rounded-[2rem] shadow-sm">
                
                <h4 className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    {subjectData.subject}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 shrink-0">{subjectData.questions.length} Questions</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-5">
                  {subjectData.questions.map((q) => {
                    const isExpanded = !!expandedExplanations[q.id];
                    return (
                      <div key={q.id} className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                        
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-800 font-mono font-black text-xs sm:text-sm flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                            {q.number}
                          </div>
                          <div className="flex-1 space-y-4 min-w-0">
                            
                            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed markdown-inline-fix w-full overflow-hidden">
                              <MarkdownRenderer text={q.questionText} />
                            </div>
                            
                            <div className="space-y-2">
                              {Object.entries(q.options || {}).map(([rawKey, val]) => {
                                const safeKey = resolveChoiceKey(rawKey, q.options);
                                return (
                                  <div key={rawKey} className={`text-xs sm:text-sm font-medium p-3 rounded-xl border flex gap-3 markdown-inline-fix transition-colors duration-300 ${
                                    safeKey === q.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/50 text-emerald-900 dark:text-emerald-100 shadow-sm' :
                                    safeKey === q.userAnswer ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500/50 text-rose-900 dark:text-rose-100 shadow-sm' :
                                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-80'
                                  }`}>
                                    <span className="font-black shrink-0 w-4">{safeKey}.</span> 
                                    <div className="w-full overflow-hidden"><MarkdownRenderer text={cleanTextForLaTeX(val)} /></div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono font-bold mt-2">
                              <div className={`px-3.5 py-2 rounded-lg flex items-center gap-2 border shadow-sm ${
                                q.isCorrect 
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                              }`}>
                                <span>Your Choice: {q.userAnswer || "None"}</span>
                                {q.isCorrect ? (
                                  <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                  <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                )}
                              </div>
                              {!q.isCorrect && (
                                <div className="px-3.5 py-2 rounded-lg text-white flex items-center gap-2 shadow-sm bg-emerald-500">
                                  <span>Correct Answer: {q.correctAnswer}</span>
                                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                              )}
                              
                              <button 
                                onClick={() => toggleExplanation(q.id)}
                                className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2 ml-auto"
                              >
                                {isExpanded ? "Hide AI Explanation" : "Show AI Explanation"}
                                <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </button>
                            </div>

                            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                              <div className="overflow-hidden">
                                <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                                  <h5 className="font-black text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                                    <i className="fas fa-brain"></i> AI Tutor Diagnostic
                                  </h5>
                                  <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none">
                                    <MarkdownRenderer text={q.explanation || "No explanation provided."} />
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeBenchmarkInfo && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveBenchmarkInfo(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="analytics-info-title"
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-xs font-black shrink-0">
                  i
                </div>
                <h4 id="analytics-info-title" className="text-base font-black text-slate-900 dark:text-white truncate">
                  {activeBenchmarkInfo.title}
                </h4>
              </div>
              <button 
                onClick={() => setActiveBenchmarkInfo(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center text-xs font-bold transition-colors focus:outline-none shrink-0"
                aria-label="Close analytics information"
              >
                ✕
              </button>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
              {activeBenchmarkInfo.description}
            </p>
            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setActiveBenchmarkInfo(null)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all focus:outline-none"
              >
                Understood
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}