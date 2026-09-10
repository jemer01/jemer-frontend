/**
 * [NEW UPGRADE]
 * SUMMARY: v3.2 Manifesto UI/UX Refactor (Deterministic Actions & Cognitive Layout)
 * 1. Base-8 Spatial Grid: Eliminated arbitrary margin/padding/gap fractional tokens (`p-3.5`, `gap-2.5`, `px-3`) and mapped the entire component to strict base-8 units (`p-4`, `p-6`, `gap-2`, `gap-4`).
 * 2. Eradicated Gradients: Removed the 'vibecoding' `bg-gradient-to-br from-blue-600 to-indigo-600` on the Solve action, replacing it with a solid deterministic `bg-blue-600` token.
 * 3. Surface Steps Over Glassmorphism: Purged all `backdrop-blur-xl` and `backdrop-blur-md` GPU bottlenecks, opting for solid opaque surfaces (`bg-slate-50`, `bg-slate-950`) with explicit 1px borders to establish depth hierarchy.
 * 4. Hover State Affordance: Disabled jarring 110% icon scaling animations and drop-shadow inflations in favor of clean background step-ups (`hover:bg-slate-100`) and brightness shifts.
 * 5. Logic Unaltered: The generation mode parsing, API string uppercase normalization, and `react-cropper` bounding boxes remain exactly as implemented.
 * 
 * [PREVIOUS UPGRADE]
 * SUMMARY: v3.1 Generation Mode Backend Compatibility & Pro Cropper Engine.
 * ================================================================================================
 * ✂️ JEMER ACADEMY DESIGN SYSTEM — SNAP CROPPER ENGINE (v3.2)
 * ================================================================================================
 */

"use client";

import React, { useRef } from "react";
import Cropper from "react-cropper";

export default function SnapCropper({ imageSource, onAction, onCancel }) {
  const cropperRef = useRef(null);

  const handleCropExecution = (mode) => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: '#ffffff',
      });

      const croppedImageData = croppedCanvas.toDataURL('image/jpeg', 0.95);
      
      // Upper-case normalization to guarantee backend API Enum compatibility
      const validMode = (mode || 'explain').toUpperCase();
      
      onAction(croppedImageData, validMode);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0 py-2 sm:py-0">
      {/* High-speed CDN injection of CropperJS CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css" />

      {/* Custom styles for Cropper selection box */}
      <style jsx global>{`
        .cropper-view-box {
          outline: 2px solid #2563eb !important; /* Fixed to solid blue-600 */
          outline-color: #2563eb !important;
          border-radius: 8px;
        }
        .cropper-line {
          background-color: #2563eb !important;
        }
        .cropper-point {
          background-color: #2563eb !important;
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
        }
        .cropper-bg {
          background-image: none !important;
          background-color: #020617 !important; /* slate-950 */
        }
      `}</style>

      <div className="w-full flex flex-col h-[calc(100dvh-130px)] sm:h-[calc(100vh-120px)] animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm relative">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-widest font-mono">
              Adjust Crop Region
            </span>
          </div>
          <button 
            onClick={onCancel} 
            className="text-slate-600 dark:text-slate-400 font-bold text-sm hover:text-slate-900 dark:hover:text-white transition-colors active:scale-95 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>

        {/* ── CROPPER VIEWPORT ENGINE ── */}
        <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden w-full h-full">
          {imageSource ? (
            <Cropper
              src={imageSource}
              style={{ height: "100%", width: "100%" }}
              initialAspectRatio={NaN} 
              guides={true}
              viewMode={1}
              background={false}
              autoCropArea={0.85}
              checkOrientation={false}
              ref={cropperRef}
              className="w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-500 gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-blue-600">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Loading Image Frame...</p>
            </div>
          )}
        </div>

        {/* ── PRO ACTION BUTTON GRID ── */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 shrink-0 z-10">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto w-full">
            
            {/* Action: SOLVE */}
            <button 
              onClick={() => handleCropExecution('explain')} 
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 border border-transparent shadow-sm"
            >
              <div className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                  <path d="M20 3v4"/>
                  <path d="M22 5h-4"/>
                  <path d="M4 17v2"/>
                  <path d="M5 18H3"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">Solve</span>
            </button>
            
            {/* Action: ANALYZE */}
            <button 
              onClick={() => handleCropExecution('analyze')} 
              className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="text-slate-600 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope">
                  <path d="M6 18h8"/>
                  <path d="M3 22h18"/>
                  <path d="M14 22a7 7 0 1 0 0-14h-1"/>
                  <path d="M9 14h2"/>
                  <path d="M9 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2Z"/>
                  <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">Analyze</span>
            </button>
            
            {/* Action: GRADE */}
            <button 
              onClick={() => handleCropExecution('answer')} 
              className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="text-slate-600 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
                  <path d="M22 10v6"/>
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">Grade</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}