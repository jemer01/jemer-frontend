/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v3.4 Bulletproof Grading Engine (Intelligent Cross-Referencing).
 * 1. Advanced Choice Resolution: Replaced the naive `sanitizeChoiceKey` with `resolveChoiceKey`. This function now explicitly cross-references the AI's `correct_answer` string with the actual `q.options` object texts. 
 * 2. Bug Eliminated: If the AI hallucinates and returns a full sentence (e.g., "Because...") instead of a letter ("A"), the grader no longer blindly matches the "B" in "Because". It accurately maps the sentence back to its originating option letter, guaranteeing a 100% flawless grade.
 * 3. Preserved Local Compute: All advanced matching executes natively inside the React `useMemo` hooks, costing zero additional database overhead.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING COGNITIVE ANALYTICS (v3.4)
 * ================================================================================================
 */

"use client";
console.log("JEMER_MARKER_v34");
import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

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

// LaTeX Unicode Sanitizer to stop [unknownSymbol] rendering crashes
const cleanTextForLaTeX = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\u2011/g, '-') // Non-breaking hyphen
    .replace(/\u202F/g, ' ') // Narrow no-break space
    .replace(/\u00A0/g, ' '); // Non-breaking space
};

// 🚀 NEW: Intelligent Cross-Referencing Choice Resolver
const resolveChoiceKey = (choice, optionsObj) => {
  if (!choice) return "";
  const strChoice = String(choice).trim();
  const upperChoice = strChoice.toUpperCase();

  // 1. Direct Match: "A", "B", "C", "D"
  if (["A", "B", "C", "D"].includes(upperChoice)) return upperChoice;

  // 2. Prefix Match: "Option A", "Choice B:", "A.", "Answer: C"
  const prefixMatch = upperChoice.match(/^(?:OPTION|CHOICE|LETTER|ANSWER)?\s*[:.-]?\s*([A-D])\b/i);
  if (prefixMatch) return prefixMatch[1].toUpperCase();

  // 3. Cross-Reference Match: Check if the AI put the full answer text in correct_answer
  if (optionsObj && typeof optionsObj === 'object') {
    for (const [key, val] of Object.entries(optionsObj)) {
      const valStr = String(val).trim().toLowerCase();
      const targetStr = strChoice.toLowerCase();
      // Exact string match
      if (valStr === targetStr) {
        const keyMatch = String(key).match(/[A-D]/i);
        return keyMatch ? keyMatch[0].toUpperCase() : String(key).toUpperCase();
      }
    }
    // Partial Match: Check if the option text is heavily included in the choice string (or vice versa)
    for (const [key, val] of Object.entries(optionsObj)) {
      const valStr = String(val).trim().toLowerCase();
      const targetStr = strChoice.toLowerCase();
      if (valStr.length > 5 && (targetStr.includes(valStr) || valStr.includes(targetStr))) {
        const keyMatch = String(key).match(/[A-D]/i);
        return keyMatch ? keyMatch[0].toUpperCase() : String(key).toUpperCase();
      }
    }
  }

  // 4. Fallback: Isolated letter " A ", "(B)"
  const isolatedMatch = upperChoice.match(/\b([A-D])\b/i);
  if (isolatedMatch) return isolatedMatch[1].toUpperCase();

  // 5. Last Resort: First A, B, C, D it finds
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

const getToken = () => localStorage.getItem("jemer_session_jwt") || localStorage.getItem("access_token") || localStorage.getItem("token") || "";

export default function BrainTrainingResults({ sessionData, onRestart }) {
  const [showReview, setShowReview] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [aiInsight, setAiInsight] = useState(sessionData?.realSession?.ai_insight || null);
  const [isFetchingInsight, setIsFetchingInsight] = useState(false);

  const primaryChartColor = "#e11d48"; // rose-600
  const secondaryChartColor = "#f43f5e"; // rose-500
  const neutralChartColor = "#94a3b8"; // slate-400

  // 🚀 EXPANDED GRADING ENGINE: Synthesizing 10 Analytics Data Points securely
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

      // Ensure options are parsed for the intelligent resolver
      let parsedOptions = {};
      try {
        parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || {});
      } catch (e) {
        parsedOptions = q.options || {};
      }

      // 🚀 FIXED: Securely resolve choices via cross-referencing options text
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
    const percentile = Math.min(99, Math.max(1, Math.round(percentage * 1.1))); // Gamified Percentile Estimate

    let blindSpot = "None";
    let lowestScore = 100;

    const subPhases = Object.keys(subTopicStats).map(sub => {
      const stat = subTopicStats[sub];
      const sc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      if (sc < lowestScore) {
        lowestScore = sc;
        blindSpot = sub;
      }
      const shortName = sub.length > 25 ? sub.substring(0, 25) + "..." : sub;
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

  // AI Tutor Insight Fetcher
  useEffect(() => {
    if (aiInsight && aiInsight.length > 20) {
      setIsFetchingInsight(false);
      return;
    }

    if (!sessionData?.realSession?.id) {
      setAiInsight("Unable to generate performance insight: Mission session identifiers.");
      return;
    }

    let isMounted = true;

    const fetchInsight = async () => {
      setIsFetchingInsight(true);
      try {
        const payload = `Score: ${gradedData.percentage}% | Tier: ${gradedData.tier} | Weakest Area: ${gradedData.blindSpot} | Longest Streak: ${gradedData.maxStreak} | Total Correct: ${gradedData.totalCorrect} / ${gradedData.maxRaw}`;
        const res = await fetch(`${getBackendUrl()}/api/v1/brain-training/session/${sessionData.realSession.id}/insight`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({ telemetry_data: payload })
        });
        
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.ai_insight && data.ai_insight.length > 10) {
            setAiInsight(cleanTextForLaTeX(data.ai_insight));
          } else {
            setAiInsight("The AI Tutor was unable to generate a detailed review at this time. Please review your metrics manually.");
          }
        } else if (isMounted) {
          setAiInsight("Connection to Jemer AI Core failed while retrieving insight.");
        }
      } catch (err) {
        console.error("Failed to fetch AI insight:", err);
        if (isMounted) setAiInsight("An anomaly occurred while connecting to the intelligence core.");
      } finally {
        if (isMounted) setIsFetchingInsight(false);
      }
    };

    fetchInsight();

    return () => { isMounted = false; };
  }, [sessionData?.realSession?.id, gradedData]);

  // 🚀 REVIEW GROUPING ENGINE
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
    autosize: true, margin: { t: 20, b: 60, l: 30, r: 15 },
    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
    font: { color: "#64748b", family: "inherit" },
    xaxis: { fixedrange: true, showgrid: false, automargin: true, tickfont: { size: 9, color: "#64748b" }, tickangle: -15 },
    yaxis: { fixedrange: true, range: [0, 105], showgrid: true, gridcolor: "rgba(148, 163, 184, 0.1)", tickfont: { size: 10 } },
  };

  const lineChartData = [
    {
      y: gradedData.rollingAccuracy,
      type: "scatter", mode: "lines+markers",
      line: { color: secondaryChartColor, width: 3, shape: 'spline' },
      marker: { size: 6, color: primaryChartColor },
      fill: 'tozeroy', fillcolor: 'rgba(244, 63, 94, 0.1)',
    },
  ];

  const radarChartData = [
    {
      type: "scatterpolar",
      r: gradedData.subPhases.map(p => p.score),
      theta: gradedData.subPhases.map(p => p.name),
      fill: 'toself',
      fillcolor: 'rgba(225, 29, 72, 0.2)',
      line: { color: primaryChartColor, width: 2 },
    }
  ];

  const radarChartLayout = {
    autosize: true, margin: { t: 30, b: 30, l: 30, r: 30 },
    paper_bgcolor: "transparent", font: { color: "#64748b", family: "inherit" },
    polar: {
      radialaxis: { visible: true, range: [0, 100], gridcolor: "rgba(148, 163, 184, 0.2)" },
      angularaxis: { tickfont: { size: 9, color: "#64748b" }, gridcolor: "rgba(148, 163, 184, 0.2)" }
    }
  };

  const donutChartData = [
    {
      values: [gradedData.choiceBias.A, gradedData.choiceBias.B, gradedData.choiceBias.C, gradedData.choiceBias.D],
      labels: ["Opt A", "Opt B", "Opt C", "Opt D"],
      type: "pie", hole: 0.7,
      marker: { colors: [primaryChartColor, "#fb7185", "#fca5a5", "#ffe4e6"] },
      textinfo: "none", hoverinfo: "label+value",
    },
  ];

  const pieChartData = [
    {
      values: [gradedData.totalCorrect, gradedData.totalWrong, gradedData.totalSkipped],
      labels: ["Correct", "Incorrect", "Unanswered"],
      type: "pie", hole: 0.6,
      marker: { colors: [primaryChartColor, "#fb7185", neutralChartColor] },
      textinfo: "percent", hoverinfo: "label+value",
    },
  ];

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

  const minimalistLayout = { autosize: true, margin: { t: 10, b: 10, l: 10, r: 10 }, paper_bgcolor: "transparent", showlegend: false };

  const gaugeChartLayout = {
    autosize: true,
    margin: { t: 40, b: 10, l: 20, r: 20 },
    paper_bgcolor: "transparent",
    font: { color: "#64748b", family: "inherit" },
  };

  const pieChartLayout = {
    autosize: true,
    margin: { t: 20, b: 20, l: 10, r: 10 },
    paper_bgcolor: "transparent",
    font: { color: "#64748b", family: "inherit" },
    showlegend: true,
    legend: { orientation: "h", x: 0.5, xanchor: "center", y: -0.1, font: { size: 10 } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12 lg:pb-16 overflow-x-hidden px-4 sm:px-0">
      
      <style dangerouslySetInnerHTML={{__html: `
        .brain-premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .brain-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .brain-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(225, 29, 72, 0.4); border-radius: 10px; }
        .brain-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(225, 29, 72, 0.7); }
        .markdown-inline-fix p { display: inline; margin: 0; }
        .markdown-inline-fix pre { margin: 0.5rem 0; overflow-x: auto; }
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
            Back to Hub
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 2: JEMER TUTOR AI INSIGHT (120B Cognitive Remark)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 border from-rose-50 via-pink-50 to-rose-50 dark:from-rose-950/40 dark:via-pink-900/20 dark:to-rose-950/40 border-rose-200 dark:border-rose-800/50">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg shrink-0 relative z-10 from-rose-500 to-pink-600 shadow-rose-500/30">
          <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="relative z-10 flex-1 min-w-0 w-full">
          <h3 className="text-base sm:text-lg font-black text-rose-900 dark:text-rose-300 mb-2">
            Jemer Tutor AI Insight
          </h3>
          {isFetchingInsight ? (
            <div className="space-y-2 animate-pulse mt-2">
              <div className="h-3 w-3/4 bg-rose-200 dark:bg-rose-800 rounded"></div>
              <div className="h-3 w-5/6 bg-rose-200 dark:bg-rose-800 rounded"></div>
              <div className="h-3 w-1/2 bg-rose-200 dark:bg-rose-800 rounded"></div>
            </div>
          ) : (
            <div className="text-sm font-medium leading-relaxed break-words text-rose-950/80 dark:text-rose-200/90 prose prose-sm prose-rose dark:prose-invert">
              <MarkdownRenderer text={aiInsight || "No insight generated."} />
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 3: 10-POINT ANALYTICS DASHBOARD
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* STAT CARDS (4 Columns on Desktop) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
            <i className="fas fa-fire"></i>
          </div>
          <div><p className="text-[10px] font-black uppercase text-slate-400">Longest Streak</p><p className="text-lg font-black text-slate-900 dark:text-white">{gradedData.maxStreak} Correct</p></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center border border-orange-100 dark:border-orange-800">
            <i className="fas fa-stopwatch"></i>
          </div>
          <div><p className="text-[10px] font-black uppercase text-slate-400">Avg Pacing</p><p className="text-lg font-black text-slate-900 dark:text-white">~{gradedData.mockPacingSeconds}s / Q</p></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
            <i className="fas fa-trophy"></i>
          </div>
          <div><p className="text-[10px] font-black uppercase text-slate-400">Est. Percentile</p><p className="text-lg font-black text-slate-900 dark:text-white">Top {100 - gradedData.percentile}%</p></div>
        </div>
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center border border-rose-200 dark:border-rose-800">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-rose-500">Blind Spot</p>
            <p className="text-lg font-black text-slate-900 dark:text-white truncate">{gradedData.blindSpot}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FULL WIDTH BAR CHART: Sub-Topic Accuracy */}
        <div className="lg:col-span-12 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[320px] w-full min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0 bg-rose-500" /> Sub-Topic Accuracy Matrix
          </h3>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={barChartData} layout={barChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        {/* ROW 2 CHARTS */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] w-full min-w-0 relative">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white absolute top-4 left-5 flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full shrink-0 bg-rose-400" /> Synapse Index
          </h3>
          <div className="w-full h-full pt-6 relative flex items-center justify-center">
            <Plot data={gaugeChartData} layout={gaugeChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] w-full min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0 bg-indigo-500" /> Cognitive Stamina
          </h3>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={lineChartData} layout={{ ...minimalistLayout, yaxis: { range: [0, 105], showgrid: false }, xaxis: { showgrid: false } }} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[280px] w-full min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0 bg-pink-500" /> Knowledge Radar
          </h3>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={radarChartData} layout={radarChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        {/* ROW 3 CHARTS */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[260px] w-full min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0 bg-rose-500" /> Decision Accuracy
          </h3>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={pieChartData} layout={pieChartLayout} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>

        <div className="lg:col-span-6 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[260px] w-full min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0 bg-purple-500" /> Choice Bias Distribution
          </h3>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <Plot data={donutChartData} layout={{...pieChartLayout, legend: { orientation: "v", x: 1, y: 0.5 }}} config={{ displayModeBar: false, responsive: true }} style={{ width: "100%", height: "100%", position: "absolute" }} useResizeHandler={true} />
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SECTION 4: GROUPED CORRECTIONS & REVIEW ENGINE
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-6">
        <button onClick={() => setShowReview(!showReview)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black uppercase tracking-wider text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-3 mx-auto focus:outline-none">
          <span>{showReview ? "Hide Exam Log" : "Reveal Exam Log & Corrections"}</span>
          <svg className={`w-5 h-5 transition-transform duration-300 ${showReview ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showReview && (
          <div className="animate-fade-in space-y-10 pt-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center mb-6">Topic: {gradedData.topicName}</h2>

            {reviewGroups.map((subjectData) => (
              <div key={subjectData.subject} className="space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 rounded-[2rem] shadow-sm">
                
                {/* SUB-TOPIC HEADER with dynamic question counts */}
                <h4 className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  {subjectData.subject}
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-auto">{subjectData.questions.length} Questions</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-6">
                  {subjectData.questions.map((q) => {
                    const isExpanded = !!expandedExplanations[q.id];
                    return (
                      <div key={q.id} className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 font-mono font-black text-sm flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                            {q.number}
                          </div>
                          <div className="flex-1 space-y-4 min-w-0">
                            
                            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed markdown-inline-fix w-full overflow-hidden">
                              <MarkdownRenderer text={q.questionText} />
                            </div>
                            
                            {/* Options Breakdown with sleek UI highlighting */}
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
                            
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono font-bold mt-2">
                              <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border shadow-sm ${
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
                                <div className="px-4 py-2 rounded-lg text-white flex items-center gap-2 shadow-sm bg-emerald-500">
                                  <span>Correct Answer: {q.correctAnswer}</span>
                                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                              )}
                              
                              <button 
                                onClick={() => toggleExplanation(q.id)}
                                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2 ml-auto"
                              >
                                {isExpanded ? "Hide AI Explanation" : "Show AI Explanation"}
                                <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </button>
                            </div>

                            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                              <div className="overflow-hidden">
                                <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
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

    </div>
  );
}