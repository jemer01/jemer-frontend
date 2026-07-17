"use client";
import React, { useState, useRef } from "react";

export default function VidResults({ videoData, onReset, onChat }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "raw_notes", label: "Full Notes" },
    { id: "quiz", label: "Interactive Quiz" },
    { id: "key_points", label: "Key Points" },
    { id: "action_items", label: "Action Items" },
    { id: "transcript", label: "Transcript (Timeline)" }
  ];

  const togglePlayerVisibility = () => {
    if (showPlayer && isPlaying) setIsPlaying(false);
    setShowPlayer(!showPlayer);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) { clearInterval(interval); setIsPlaying(false); return 0; }
          return prev + 0.5;
        });
      }, 100);
      videoRef.current = interval;
    } else {
      clearInterval(videoRef.current);
    }
  };

  return (
    <div className="w-full flex flex-col animate-fade-in max-w-6xl mx-auto pb-20 px-4 sm:px-6">
      <style dangerouslySetInnerHTML={{__html: `
       .vid-premium-scroll::-webkit-scrollbar { height: 6px; }
       .vid-premium-scroll::-webkit-scrollbar-track { background: transparent; }
       .vid-premium-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
       .dark.vid-premium-scroll::-webkit-scrollbar-thumb { background-color: #475569; }
      `}} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 pt-4">
        <div className="w-full md:flex-1 min-w-0 pr-0 md:pr-4">
          <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white mb-3 whitespace-normal break-words leading-tight">
            {videoData?.name || "Advanced Quantum Mechanics Lecture Notes"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50 text- font-black uppercase tracking-widest text-red-600 dark:text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>Video Processed</span>
            <span className="text-xs font-mono text-slate-500">YouTube • {videoData?.videoId || "dQw4w9WgXcQ"}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button onClick={togglePlayerVisibility} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold active:scale-95 shadow-sm ${showPlayer? "bg-red-600 text-white border-red-600" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            {showPlayer? "Hide Video" : "Play Video"}
          </button>
          <button onClick={onChat} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-wider shadow-lg active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Chat Tutor
          </button>
          <button onClick={onReset} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>New Video
          </button>
        </div>
      </div>

      {showPlayer && (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-sm p-4 mb-8 animate-fade-in">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900">
            {isPlaying? (
              <iframe src={`https://www.youtube.com/embed/${videoData?.videoId || "dQw4w9WgXcQ"}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            ) : (
              <>
                <img src={videoData?.thumbnail || `https://img.youtube.com/vi/${videoData?.videoId || "dQw4w9WgXcQ"}/hqdefault.jpg`} alt="thumb" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><button onClick={togglePlayPause} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105"><svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="translate-x-0.5"><polygon points="6 3 20 12 6 21 6 3"/></svg></button></div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <button onClick={togglePlayPause} className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center active:scale-95">
              {isPlaying? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5"><polygon points="6 3 20 12 6 21 6 3"/></svg>}
            </button>
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" style={{ width: `${progress}%` }}></div></div>
            <span className="text-xs font-mono font-bold text-slate-500">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      <div className="w-full border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto vid-premium-scroll">
        <div className="flex gap-1 min-w-max pb-px">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id? "border-red-600 text-red-600 dark:text-red-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="w-full">
        {activeTab === "summary" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Executive Summary</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">This YouTube lecture explores fundamental laws governing system thermodynamics and entropy. The speaker demonstrates how the Second Law parameter dictates state chaos sequences.</p>
            </div>
          </div>
        )}
        {activeTab === "transcript" && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <div className="flex gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40"><button className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-4 py-2 rounded-xl font-mono font-bold text-xs border">00:00</button><div className="text-slate-700 dark:text-slate-300 font-medium">Welcome class. Today we are looking at fundamental laws from this YouTube lecture.</div></div>
              <div className="flex gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40"><button className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-4 py-2 rounded-xl font-mono font-bold text-xs border">01:45</button><div className="text-slate-700 dark:text-slate-300 font-medium">If you look closely at Second Law parameter, you will see natural sequence moves toward chaos.</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}