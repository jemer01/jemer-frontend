/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.2 Mobile Camera UI Visibility Fix.
 * 1. CSS Conflict Resolution: Identified and resolved a severe Tailwind CSS specificity bug where the `relative` class was silently overriding the `fixed` class on mobile devices. By cleanly separating these classes based on the viewport, the mobile camera UI now successfully mounts as a true 100% full-screen overlay without collapsing to zero height.
 * 2. Preserved Portal Architecture: Maintained the `createPortal` teleportation to ensure the UI escapes any parent transform boundaries safely.
 * ================================================================================================
 * 📷 JEMER ACADEMY DESIGN SYSTEM — SNAP CAMERA ENGINE (v2.2)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // Teleports the mobile UI to escape CSS transforms

export default function SnapCamera({ onSnap }) {
  // ── DEVICE & UI STATE ──
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileCameraOpen, setIsMobileCameraOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Tracks client hydration for safe Portals
  
  // ── HARDWARE CAMERA STATE ──
  const [stream, setStream] = useState(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);

  // ── DOM REFS ──
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Viewport detector and Hydration tracker
  useEffect(() => {
    setMounted(true); // Hydration complete
    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    checkViewport(); // Initial check
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Hardware Camera Lifecycle Engine
  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        setHasPermissionError(false);
        // Requests the rear-facing camera prioritizing high resolution
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        
        activeStream = mediaStream;
        setStream(mediaStream);
        
        // Bind the active stream directly to the React video node
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("[CAMERA HARDWARE FAULT] Access denied or unavailable:", err);
        setHasPermissionError(true);
      }
    };

    // Auto-mount camera if on desktop, or if mobile user clicked "Take a Photo"
    if (!isMobile || (isMobile && isMobileCameraOpen)) {
      startCamera();
    }

    // Cleanup: Completely disconnect the camera hardware when the component unmounts or state shifts
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMobile, isMobileCameraOpen]);

  // Flashlight Hardware Controller
  const toggleFlash = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    
    try {
      const capabilities = videoTrack.getCapabilities();
      if (capabilities.torch) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !isFlashOn }]
        });
        setIsFlashOn(!isFlashOn);
      } else {
        alert("Flashlight is not supported by your device's current camera.");
      }
    } catch (error) {
      console.warn("[HARDWARE OVERRIDE FAILED] Flashlight integration error:", error);
    }
  };

  // Image Snapshot Processing Engine
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Size the canvas exactly to the video feed's native resolution
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Extract base64 image data payload and dispatch to orchestrator (Stage 1.5)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onSnap(dataUrl);
  };

  // Device File Upload Processing
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Bypasses the camera entirely and ships the uploaded file directly to the cropper
      onSnap(event.target.result);
    };
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeMobileCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsMobileCameraOpen(false);
    setIsFlashOn(false);
  };

  // ── EXTRACTED UI RENDER BLOCK ──
  // 🚀 THE FIX: Cleanly separated `fixed inset-0 z-[9999]` from `relative`. No CSS overriding!
  const renderCameraUI = () => (
    <div className={`${isMobile ? 'fixed inset-0 z-[9999]' : 'relative w-full aspect-[3/4] sm:aspect-video max-h-[600px] rounded-[2rem] shadow-2xl border border-slate-800'} bg-black flex flex-col overflow-hidden animate-fade-in`}>
      
      {/* Hardware Video Stream Output */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover z-0" 
      />

      {/* Fallback Permission Error Message */}
      {hasPermissionError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md px-6 text-center">
          <i className="fas fa-video-slash text-4xl text-red-500 mb-4"></i>
          <h3 className="text-lg font-bold text-white mb-2">Camera Access Denied</h3>
          <p className="text-sm text-slate-400">Please allow camera permissions in your browser settings to scan problems.</p>
        </div>
      )}

      {/* 🎯 Immersive Center Viewfinder Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white/80 rounded-tl-2xl shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white/80 rounded-tr-2xl shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white/80 rounded-bl-2xl shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white/80 rounded-br-2xl shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
          </div>
      </div>

      {/* ── TOP CONTROLS BAR ── */}
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent">
        {/* Flashlight Toggle */}
        <button 
          onClick={toggleFlash} 
          className={`w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors active:scale-95 ${isFlashOn ? 'text-yellow-400 bg-black/60' : 'text-white'}`}
          title="Toggle Flashlight"
        >
          {/* Optimized Next.js Lucide Flashlight SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flashlight-icon w-5 h-5 sm:w-6 sm:h-6">
            <path d="M12 13v1"/>
            <path d="M17 2a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8A4 4 0 0 0 16 12v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V3a1 1 0 0 1 1-1z"/>
            <path d="M6 6h12"/>
          </svg>
        </button>
        
        {/* Back/Close Button (Crucial for exiting full-screen mobile view) */}
        {isMobile && (
          <button 
            onClick={closeMobileCamera} 
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-colors active:scale-95"
            title="Cancel and Go Back"
          >
            {/* Optimized Next.js Lucide Arrow Left SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon w-5 h-5 sm:w-6 sm:h-6">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── BOTTOM CONTROLS BAR ── */}
      <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 to-transparent pb-safe flex items-center justify-between px-8 sm:px-16 z-20">
        
        {/* Left Action: Device File Upload */}
        <label className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all hover:bg-black/50">
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload">
            <path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          </svg>
        </label>

        {/* Center Action: Premium Circular Shutter Button */}
        <button 
          onClick={capturePhoto} 
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[4px] border-white/80 bg-transparent flex items-center justify-center active:scale-90 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
          title="Capture Image"
        >
          <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] bg-white rounded-full group-hover:bg-slate-200 transition-colors"></div>
        </button>

        {/* Right Action: Spacer for Perfect Flexbox Symmetry */}
        <div className="w-14 h-14"></div>
      </div>
    </div>
  );

  // ── RENDER PIPELINE ──

  return (
    <>
      {/* Invisible Canvas for holding image data */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── MOBILE VIEW: Premium Initiation Screen ── */}
      {isMobile && !isMobileCameraOpen && (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] animate-fade-in relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-inner ring-1 ring-blue-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-icon">
              <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2 tracking-tight">Ready to Scan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Hardware protocols standing by.</p>
          
          <button 
            onClick={() => setIsMobileCameraOpen(true)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-full uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            Take a Photo
          </button>
        </div>
      )}

      {/* ── UNIFIED CAMERA UI ── */}
      {(!isMobile || (isMobile && isMobileCameraOpen)) && (
        isMobile && mounted ? createPortal(renderCameraUI(), document.body) : renderCameraUI()
      )}
    </>
  );
}