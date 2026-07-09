/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Multi-Platform Camera Engine.
 * 1. Mobile Overlay: Features a `z-[100]` absolute full-screen modal that covers the nav and sidebar perfectly, with Cancel, Snap, and Flash horizontal buttons at the bottom.
 * 2. Desktop Inline: Uses a wide, premium glass container directly in the workspace.
 * ================================================================================================
 * 📷 JEMER ACADEMY DESIGN SYSTEM — SNAP CAMERA ENGINE (v1.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";

export default function SnapCamera({ onSnap }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileCameraOpen, setIsMobileCameraOpen] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Dummy action returning a simulated image string
  const triggerCapture = () => {
    setIsMobileCameraOpen(false);
    onSnap("dummy-image-data-url");
  };

  return (
    <>
      {/* ── MOBILE VIEW: Trigger Button ── */}
      {isMobile && !isMobileCameraOpen && (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mb-4 shadow-inner">
            <i className="fas fa-camera"></i>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Ready to Scan</h2>
          <p className="text-xs text-slate-500 mb-6">Camera protocol is standing by.</p>
          <button 
            onClick={() => setIsMobileCameraOpen(true)}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-full uppercase tracking-wider text-xs active:scale-95 transition-transform"
          >
            Open Camera UI
          </button>
        </div>
      )}

      {/* ── MOBILE VIEW: 100% Full Screen Overlay (z-[100]) ── */}
      {isMobile && isMobileCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
          {/* Live Feed Mock */}
          <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_60%)] animate-pulse" />
            <div className="w-64 h-64 border-2 border-white/20 rounded-xl flex items-center justify-center relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />
              <p className="text-white/50 text-xs font-mono uppercase tracking-widest">Live Feed Array</p>
            </div>
          </div>

          {/* Absolute Bottom Controls (Horizontal) */}
          <div className="h-32 bg-black pb-safe flex items-center justify-between px-8 shrink-0">
            <button onClick={() => setIsMobileCameraOpen(false)} className="text-white font-bold text-sm active:scale-95 p-2">
              Cancel
            </button>
            <button onClick={triggerCapture} className="w-20 h-20 rounded-full border-4 border-slate-300 flex items-center justify-center active:scale-90 transition-transform">
              <div className="w-[68px] h-[68px] bg-white rounded-full"></div>
            </button>
            <button onClick={() => setIsFlashOn(!isFlashOn)} className={`text-2xl active:scale-95 p-2 transition-colors ${isFlashOn ? "text-yellow-400" : "text-white"}`}>
              <i className="fas fa-bolt"></i>
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP VIEW: Inline Wide Viewport ── */}
      {!isMobile && (
        <div className="w-full aspect-video max-h-[500px] bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-lg max-h-[300px] border-2 border-white/10 rounded-3xl relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-500 rounded-tl-xl transition-all group-hover:-translate-x-2 group-hover:-translate-y-2" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-tr-xl transition-all group-hover:translate-x-2 group-hover:-translate-y-2" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500 rounded-bl-xl transition-all group-hover:-translate-x-2 group-hover:translate-y-2" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-500 rounded-br-xl transition-all group-hover:translate-x-2 group-hover:translate-y-2" />
              <p className="text-white/40 font-mono tracking-widest text-xs uppercase animate-pulse">Scanning Array Active</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
            <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center text-xl">
              <i className="fas fa-image"></i>
            </button>
            <button onClick={triggerCapture} className="w-20 h-20 rounded-full border-4 border-white/80 bg-transparent flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
              <div className="w-[64px] h-[64px] bg-white rounded-full"></div>
            </button>
            <button onClick={() => setIsFlashOn(!isFlashOn)} className={`w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center text-xl ${isFlashOn ? "text-yellow-400" : "text-white"}`}>
              <i className="fas fa-bolt"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}