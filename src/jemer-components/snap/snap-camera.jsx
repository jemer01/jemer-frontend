/**
 * [NEW UPGRADE]
 * SUMMARY: v2.3 Manifesto UI/UX Refactor (Cognitive Ergonomics & Base-8 Spatial Grid)
 * 1. Eradicated "Vibecoding" Anti-Patterns: Stripped all `bg-gradient-to-r` and `radial-gradient` classes from the mobile entry state and replaced them with solid, high-contrast surface tokens.
 * 2. Removed GPU-Taxing Glassmorphism: Replaced `backdrop-filter: blur()` on camera controls with solid/semi-solid hardware-accelerated layers (`bg-black/80`).
 * 3. Base-8 Spatial Strictness: Normalized arbitrary values (e.g., `p-10` to `p-8`, `w-[68px]` to `w-16`, `w-[84px]` to `w-20`) to strictly adhere to an 8-point typographic and spatial grid.
 * 4. Touch Target Ergonomics: Enforced strict 48x48px (`w-12 h-12`) minimum bounding boxes for all interactive camera hardware controls to eliminate mis-taps.
 * 5. Preserved Infrastructure: 100% of the hardware camera lifecycle, stream processing, and portal teleportation logic remains untouched.
 * 
 * [PREVIOUS UPGRADE]
 * SUMMARY: v2.2 Mobile Camera UI Visibility Fix.
 * ================================================================================================
 * 📷 JEMER ACADEMY DESIGN SYSTEM — SNAP CAMERA ENGINE (v2.3)
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
  const renderCameraUI = () => (
    <div className={`${isMobile ? 'fixed inset-0 z-[9999]' : 'relative w-full aspect-[3/4] sm:aspect-video max-h-[640px] rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800'} bg-black flex flex-col overflow-hidden animate-fade-in`}>
      
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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
          <i className="fas fa-video-slash text-4xl text-red-500 mb-4"></i>
          <h3 className="text-lg font-bold text-white mb-2">Camera Access Denied</h3>
          <p className="text-sm text-slate-400">Please allow camera permissions in your browser settings to scan problems.</p>
        </div>
      )}

      {/* 🎯 Immersive Center Viewfinder Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-xl shadow-sm" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-xl shadow-sm" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-xl shadow-sm" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-xl shadow-sm" />
          </div>
      </div>

      {/* ── TOP CONTROLS BAR ── */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent">
        {/* Flashlight Toggle */}
        <button 
          onClick={toggleFlash} 
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-95 border ${isFlashOn ? 'bg-black/90 text-yellow-400 border-yellow-400/50' : 'bg-black/40 text-white border-white/20 hover:bg-black/60'}`}
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
            className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white transition-colors active:scale-95 hover:bg-black/60"
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
        <label className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all hover:bg-black/60">
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload w-5 h-5 sm:w-6 sm:h-6">
            <path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          </svg>
        </label>

        {/* Center Action: Premium Circular Shutter Button */}
        <button 
          onClick={capturePhoto} 
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/80 bg-transparent flex items-center justify-center active:scale-90 transition-transform group"
          title="Capture Image"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full group-hover:brightness-90 transition-all"></div>
        </button>

        {/* Right Action: Spacer for Perfect Flexbox Symmetry */}
        <div className="w-12 h-12 sm:w-16 sm:h-16"></div>
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
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm animate-fade-in relative overflow-hidden">
          
          <div className="w-24 h-24 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-icon">
              <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2 tracking-tight">Ready to Scan</h2>
          <p className="text-sm text-slate-500 font-medium mb-8">Hardware protocols standing by.</p>
          
          <button 
            onClick={() => setIsMobileCameraOpen(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl tracking-wide text-sm active:scale-95 transition-all shadow-sm"
          >
            Open Camera
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