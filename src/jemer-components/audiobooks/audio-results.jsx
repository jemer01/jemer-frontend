/**
 * [NEW]
 * SUMMARY: Phase 5 UI/UX Polish & Production PDF Engine
 * 1. Action Buttons Wrap Fix: Applied `whitespace-nowrap` to the top action buttons (Resources, Record New, Tutor Chat) to enforce a single-line layout on all screen sizes.
 * 2. Direct Cloudflare Audio Download: Upgraded the audio download function to fetch the remote URL into a local Blob, forcing a direct device download rather than a browser redirect.
 * 3. Production PDF Engine (jsPDF): Abandoned DOM-mutating `html2pdf.js`. Implemented a robust, memory-based `jsPDF` engine perfectly matched to the reference logic to generate multi-page PDFs without breaking the React layout.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS RESULTS ENGINE (v5.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

export default function AudioResults({ audioData, onReset, onChat, analysisData, transcript }) {
  // ── CORE STATES ──
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ── CUSTOM PLAYER STATES ──
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ── FILE METADATA ──
  const fileName = audioData?.name || "Analyzed Audio Session";

  useEffect(() => {
    setSelectedAnswers({});
  }, [analysisData]);

  useEffect(() => {
    if (audioData) {
      if (typeof audioData === "string") {
        setAudioUrl(audioData);
        return;
      }
      if (audioData instanceof Blob || audioData instanceof File) {
        try {
          const url = URL.createObjectURL(audioData);
          setAudioUrl(url);
          return () => URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Audio playback initialization failed:", error);
        }
      }
    }
  }, [audioData]);

  // ── AUDIO PLAYER LOGIC ──
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (amount) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += amount;
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds) || timeInSeconds === Infinity) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── 🚀 [NEW] PRODUCTION PDF & DIRECT AUDIO DOWNLOAD ENGINE ──
  const handleDownload = async (type) => {
    setIsDownloading(true);
    
    try {
      if (type === 'audio' && audioUrl) {
        // Fetch to local blob to force native download without redirecting
        try {
          const res = await fetch(audioUrl);
          const blob = await res.blob();
          const localUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = localUrl;
          a.download = `${fileName}.webm`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(localUrl);
        } catch (e) {
          // Fallback if CORS blocks it
          const a = document.createElement('a');
          a.href = audioUrl;
          a.download = `${fileName}.webm`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        setIsResourcesModalOpen(false);
        setIsDownloading(false);
        return;
      }

      // Load jsPDF dynamically (Reference approach)
      const loadJsPDF = () => {
        return new Promise((resolve, reject) => {
          if (window.jspdf) return resolve(window.jspdf.jsPDF);
          const script = document.createElement('script');
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = () => resolve(window.jspdf.jsPDF);
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      const JsPDFClass = await loadJsPDF();
      const doc = new JsPDFClass();
      let y = 20;
      
      const checkPage = (h = 10) => {
        if (y + h > 280) { doc.addPage(); y = 20; }
      };
      
      const addHeader = (txt) => {
        checkPage(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text(txt, 10, y);
        y += 10;
      };
      
      const addText = (txt) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0);
        const lines = doc.splitTextToSize(txt || "", 180);
        lines.forEach(l => {
          checkPage(6);
          doc.text(l, 10, y);
          y += 6;
        });
        y += 5;
      };

      doc.setFontSize(22);
      doc.text(type === 'transcript' ? "Jemer Transcript" : "Jemer Study Pack", 10, 20);
      y = 35;
      doc.setFontSize(14);
      doc.text(fileName ? fileName.substring(0, 50) : "Analyzed Session", 10, y);
      y += 15;

      if (type === 'transcript') {
        addHeader("Full Transcript");
        addText(transcript || "No transcript available.");
        doc.save(`${fileName}_Transcript.pdf`);
      } else if (type === 'notes') {
        addHeader("Summary");
        addText(analysisData?.summary || "No summary");

        if (analysisData?.full_notes) {
          addHeader("Detailed Study Notes");
          addText(analysisData.full_notes.replace(/#/g, '').replace(/\*\*/g, ''));
        }

        if (analysisData?.key_points) {
          addHeader("Key Points");
          addText(analysisData.key_points.replace(/#/g, '').replace(/\*\*/g, ''));
        }

        if (analysisData?.action_items) {
          addHeader("Action Items");
          addText(analysisData.action_items.replace(/#/g, '').replace(/\*\*/g, ''));
        }

        if (analysisData?.interactive_quiz && Array.isArray(analysisData.interactive_quiz)) {
          addHeader("Interactive Quiz");
          analysisData.interactive_quiz.forEach((q, i) => {
            checkPage(20);
            doc.setFont("helvetica", "bold");
            doc.text(`Q${i + 1}: ${q.question}`, 10, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            Object.values(q.options || {}).forEach(o => {
              checkPage(5);
              doc.text(`- ${o}`, 15, y);
              y += 5;
            });
            y += 5;
          });
        }
        
        doc.save(`${fileName}_StudyNotes.pdf`);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to process download. Please try again.");
    }

    setIsResourcesModalOpen(false);
    setIsDownloading(false);
  };

  // ── TRANSCRIPT PARSER LOGIC ──
  const parseTranscriptUI = (rawText) => {
    if (!rawText) return [];
    const lines = rawText.split('\n').filter(line => line.trim().length > 0);
    
    return lines.map((line, idx) => {
      let time = "";
      let speaker = "";
      let content = line.trim();

      const timeMatch = content.match(/\[?\b\d{2}:\d{2}(?::\d{2})?\b\]?/);
      if (timeMatch) {
        time = timeMatch[0].replace(/[\[\]]/g, '');
        content = content.replace(timeMatch[0], '').trim();
      }

      const speakerMatch = content.match(/^([\w\s]+):/);
      if (speakerMatch) {
        speaker = speakerMatch[1].trim();
        content = content.replace(speakerMatch[0], '').trim();
      }

      content = content.replace(/^- /, '').trim();

      return { id: idx, time, speaker, content };
    });
  };

  const TABS = [
    { id: "summary", label: "Summary", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg> },
    { id: "full_notes", label: "Full Notes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { id: "interactive_quiz", label: "Quiz", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { id: "key_points", label: "Key Points", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: "action_items", label: "Action Items", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { id: "transcript", label: "Transcript", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg> }
  ];

  const handleOptionClick = (questionIndex, optionKey) => {
    if (selectedAnswers[questionIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionKey }));
  };

  const renderInteractiveQuiz = () => {
    const quizData = analysisData?.interactive_quiz;
    
    if (!Array.isArray(quizData) || quizData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p className="text-sm font-mono uppercase tracking-widest font-bold">No interactive quiz generated.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-4">
        {quizData.map((q, index) => {
          const isAnswered = !!selectedAnswers[index];
          const selectedKey = selectedAnswers[index];
          
          return (
            <div key={index} className="bg-slate-50 dark:bg-slate-800/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm shrink-0 mt-0.5">{index + 1}</span>
                {q.question}
              </h3>
              
              <div className="flex flex-col gap-3 ml-0 sm:ml-11">
                {Object.entries(q.options || {}).map(([key, value]) => {
                  let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300";
                  
                  if (isAnswered) {
                    if (key === q.correct_answer) {
                      btnClass = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500/50";
                    } else if (key === selectedKey) {
                      btnClass = "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-800 dark:text-red-300 shadow-sm";
                    } else {
                      btnClass = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40";
                    }
                  }

                  return (
                    <button 
                      key={key}
                      onClick={() => handleOptionClick(index, key)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base font-medium transition-all duration-300 ${btnClass} ${!isAnswered ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'} flex items-center`}
                    >
                      <span className="font-black mr-4 text-slate-400 w-5 inline-block">{key}.</span> 
                      <span className="flex-1">{value}</span>
                      
                      {isAnswered && key === q.correct_answer && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 ml-2 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      {isAnswered && key === selectedKey && key !== q.correct_answer && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 ml-2 shrink-0"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-6 ml-0 sm:ml-11 p-5 sm:p-6 bg-indigo-50/80 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 animate-fade-in flex gap-4 items-start shadow-inner">
                  <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                      <span className="font-black block text-xs uppercase tracking-widest text-indigo-500/70 mb-1">AI Explanation</span> 
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getActiveContent = () => {
    return analysisData?.[activeTab] || `*No ${activeTab.replace('_', ' ')} generated for this session.*`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in pb-12 pt-6 px-4 lg:px-6 relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        .results-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: transparent;
          border-radius: 99px;
        }
        .results-slider::-webkit-slider-runnable-track {
          width: 100%; height: 6px; cursor: pointer;
          background: rgba(99, 102, 241, 0.2); border-radius: 99px;
        }
        .dark .results-slider::-webkit-slider-runnable-track { background: rgba(99, 102, 241, 0.3); }
        .results-slider::-webkit-slider-thumb {
          height: 14px; width: 14px; border-radius: 50%;
          background: #6366f1; cursor: pointer; -webkit-appearance: none;
          margin-top: -4px; box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
          transition: transform 0.1s;
        }
        .results-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        
        .tabs-container {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #818cf8 transparent;
        }
        .tabs-container::-webkit-scrollbar { height: 6px; }
        .tabs-container::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .tabs-container::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.5); border-radius: 10px; }
        .tabs-container::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.8); }

        .elite-prose h1 { color: #4f46e5; font-size: 2rem; font-weight: 900; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
        .dark .elite-prose h1 { border-color: #334155; color: #818cf8; }
        .elite-prose h2 { color: #1e293b; font-weight: 800; font-size: 1.5rem; margin-top: 2rem; }
        .dark .elite-prose h2 { color: #e2e8f0; }
        .elite-prose p { line-height: 1.8; font-size: 1.05rem; }
        .elite-prose li { line-height: 1.7; margin-bottom: 0.5rem; }
        .elite-prose strong { color: #312e81; font-weight: 800; }
        .dark .elite-prose strong { color: #c7d2fe; }
      `}} />

      {/* 🚀 RESOURCES DOWNLOAD MODAL */}
      {isResourcesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center relative transform transition-all animate-scale-in">
            <button onClick={() => !isDownloading && setIsResourcesModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              {isDownloading ? (
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Downloads</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              {isDownloading ? "Generating your secure download..." : "Export your analyzed session locally."}
            </p>
            <div className={`flex flex-col gap-3 ${isDownloading ? 'opacity-50 pointer-events-none' : ''}`}>
              <button onClick={() => handleDownload('audio')} className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm flex items-center justify-between transition-colors">
                <span className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg> Original Audio</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button onClick={() => handleDownload('transcript')} className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm flex items-center justify-between transition-colors">
                <span className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg> Transcript PDF</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button onClick={() => handleDownload('notes')} className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm flex items-center justify-between shadow-lg shadow-indigo-500/25 transition-all">
                <span className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> Full Notes PDF</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER PIPELINE ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full">Analyzed Session</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-3">
             {fileName}
          </h1>
        </div>
        
        {/* 🚀 FIXED [NEW]: Action buttons set to whitespace-nowrap preventing text break */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
          <button 
            onClick={() => setIsResourcesModalOpen(true)} 
            className="whitespace-nowrap flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3.5 px-6 rounded-xl font-black uppercase tracking-wider shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Resources
          </button>
          <button 
            onClick={onReset} 
            className="whitespace-nowrap flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3.5 px-6 rounded-xl font-black uppercase tracking-wider shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> Record New
          </button>
          <button 
            onClick={onChat} 
            className="whitespace-nowrap w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3.5 px-6 rounded-xl font-black uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> Tutor Chat
          </button>
        </div>
      </div>

      {/* ── EMBEDDED CUSTOM AUDIO PLAYER ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {audioUrl ? (
          <>
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onTimeUpdate={() => {
                setCurrentTime(audioRef.current?.currentTime || 0);
                if (audioRef.current?.duration && audioRef.current.duration !== Infinity && duration !== audioRef.current.duration) {
                  setDuration(audioRef.current.duration);
                }
              }} 
              onLoadedMetadata={(e) => {
                if (e.target.duration !== Infinity) setDuration(e.target.duration);
              }}
              onEnded={() => setIsPlaying(false)}
              className="hidden" 
            />
            <div className="flex items-center gap-4 shrink-0">
               <button onClick={() => skipTime(-10)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
               </button>
               <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 transition-transform active:scale-95">
                 {isPlaying ? (
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                 )}
               </button>
               <button onClick={() => skipTime(10)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
               </button>
            </div>
            <div className="flex-1 w-full flex flex-col pt-1">
               <input 
                  type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek}
                  className="results-slider mb-2"
                  style={{ background: `linear-gradient(to right, #6366f1 ${(currentTime / (duration || 1)) * 100}%, transparent ${(currentTime / (duration || 1)) * 100}%)` }}
                />
                <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 text-slate-400">
             <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             <span className="text-xs font-mono">Loading audio stream...</span>
          </div>
        )}
      </div>

      {/* ── 6-TAB MATRIX NAVIGATION ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm tabs-container mb-2">
        <div className="flex w-max sm:w-full min-w-full gap-2 pb-1 sm:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-5 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all rounded-xl flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm" 
                  : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className={activeTab === tab.id ? 'opacity-100' : 'opacity-60'}>{tab.icon}</div>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT RENDERER ── */}
      <div className="w-full sm:bg-white sm:dark:bg-slate-900 sm:border sm:border-slate-200 sm:dark:border-slate-800 sm:rounded-3xl sm:p-10 sm:shadow-xl sm:dark:shadow-2xl/50 min-h-[400px]">
        
        {activeTab === "interactive_quiz" ? (
          renderInteractiveQuiz()
        ) : activeTab === "transcript" ? (
          <div className="flex flex-col gap-5 max-w-4xl mx-auto">
            {!transcript ? (
              <p className="text-slate-500 text-center py-10 font-mono text-sm uppercase tracking-widest">No transcript generated for this audio file.</p>
            ) : (
              parseTranscriptUI(transcript).map((block) => (
                <div key={block.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 px-1">
                     <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">{block.time || "00:00"}</span>
                     {block.speaker && <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{block.speaker}</span>}
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl rounded-tl-sm border border-slate-200/70 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 text-sm sm:text-[15px] leading-relaxed shadow-sm">
                     {block.content}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="elite-prose prose dark:prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 relative w-full whitespace-pre-wrap break-words overflow-x-hidden">
            <MarkdownRenderer text={getActiveContent()} />
          </div>
        )}
        
      </div>
      
    </div>
  );
}