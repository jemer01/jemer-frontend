"use client";
import React, { useState, useRef, useEffect } from "react";

export default function VidReview({ videoData, onDiscard, onGenerate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(145);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration - 1) { setIsPlaying(false); return 0; }
          return prev + 1;
        });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, duration]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const handleSeek = (e) => { const pct = e.target.value; setCurrentTime((pct/100)*duration); };
  const handleProcess = () => { setIsProcessing(true); setTimeout(()=>{ setIsProcessing(false); onGenerate(); },1500); };
  const formatTime = (t) => { if(isNaN(t)) return "00:00"; const m=Math.floor(t/60).toString().padStart(2,"0"); const s=Math.floor(t%60).toString().padStart(2,"0"); return `${m}:${s}`; };
  const progressPercentage = duration > 0? (currentTime/duration)*100 : 0;

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 lg:p-12 animate-fade-in bg-slate-50 dark:bg-[#0A0A0A] rounded- shadow-inner relative">
      <style dangerouslySetInnerHTML={{__html: `
       .vid-scrubber { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: rgba(148,163,184,0.2); border-radius: 99px; outline: none; cursor: pointer; position: relative; z-index: 10; }
       .dark.vid-scrubber { background: rgba(255,255,255,0.1); }
       .vid-scrubber::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%; border: 2px solid #ef4444; box-shadow: 0 0 10px rgba(239,68,68,0.5); }
      `}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 dark:bg-red-500/20 rounded-full blur- pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-slate-700/60 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col relative z-10 hover:-translate-y-1 transition-all duration-500">
        <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/50 dark:ring-white/10 pointer-events-none"></div>
        <div className="px-8 py-5 border-b border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between">
          <span className="text-slate-500 text- font-black uppercase tracking-widest font-mono">Review Video</span>
          <div className="flex items-center gap-1.5 text- font-mono font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-full border"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>Ready</div>
        </div>

        <div className="px-8 pt-8 pb-10 flex flex-col items-center gap-8">
          <div className="text-center space-y-3 w-full">
            <div className="w-full aspect-video mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-lg shadow-red-500/20 ring-2 ring-white/20 relative">
              <img src={videoData?.thumbnail || `https://img.youtube.com/vi/${videoData?.videoId}/hqdefault.jpg`} alt="thumb" className="w-full h-full object-cover" />
              {!isPlaying && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444"><path d="M23.498 6.186a3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div></div>}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text- font-mono px-2 py-1 rounded-md">{videoData?.videoId || "VIDEO"}</div>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white truncate">{videoData?.name || "YouTube Video Lecture Notes"}</h2>
            <p className="text-xs text-slate-500 font-mono">YouTube • HQ Video • {videoData?.duration || "12:34"}</p>
          </div>

          <div className="w-full space-y-3">
            <div className="relative w-full h-6 flex items-center">
              <div className="absolute left-0 h- bg-gradient-to-r from-red-500 to-rose-500 rounded-full" style={{ width: `${progressPercentage}%` }} />
              <input type="range" min="0" max="100" value={progressPercentage || 0} onChange={handleSeek} className="vid-scrubber" />
            </div>
            <div className="flex justify-between text-xs font-mono font-bold text-slate-400"><span className="text-red-600">{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          </div>

          <button onClick={togglePlayPause} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white/50 active:scale-90 transition-all ${isPlaying? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-gradient-to-br from-red-500 to-rose-600 text-white"}`}>
            {isPlaying? <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> : <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="translate-x-1"><polygon points="6 3 20 12 6 21 6 3"/></svg>}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 px-8 pb-8">
          <button onClick={onDiscard} className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-white dark:bg-slate-800 border text-slate-600 font-bold text-xs active:scale-95">Cancel</button>
          <button onClick={handleProcess} disabled={isProcessing} className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-full font-black text- uppercase tracking-wider shadow-lg active:scale-95 ${isProcessing? "bg-slate-700 text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"}`}>
            {isProcessing? "Processing..." : "Process"}
          </button>
        </div>
      </div>
    </div>
  );
}