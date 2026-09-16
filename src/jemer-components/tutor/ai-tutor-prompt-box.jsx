"use client";

/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM AI TUTOR PROMPT BOX (v4.0.0)
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v4.0.0 - PREMIUM UI & SANITIZATION POLISH)
 * 1. FILE SANITIZATION & 300MB LIMIT: Injected a regex string-replacer to strip `+` and special 
 *    characters from filenames, preventing R2 URL encoding breaks. Enforced a strict 300MB hard limit.
 * 2. PREMIUM UI TOAST ERRORS: Ripped out all native `alert()` boxes. Errors (file too large, max 10 files) 
 *    now trigger a beautiful, floating UI Toast.
 * 3. CHATGPT-STYLE ATTACHMENT STAGING: Relocated the file attachment chips to sit ABOVE the textarea. 
 *    Redesigned them into compact, premium document chips.
 * 4. MOBILE KEYBOARD AUTO-SCROLL: Added `onFocus` scrolling logic to the textarea so the UI perfectly 
 *    glides above the mobile software keyboard.
 * 5. COMING SOON PADLOCKS: Added SVG locks to Canvas and Deep Research. Activating them triggers 
 *    the new Toast interceptor instead of modifying state.
 * ================================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx";

export default function AITutorPromptBox({ onSendMessage, injectedPromptText, isStreaming, onStopStream }) {
  const { theme } = useTheme();
  
  const [textPrompt, setTextPrompt] = useState("");
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [showGlow, setShowGlow] = useState(true);
  
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [tutorMenuOpen, setTutorMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [imageGenDropdownOpen, setImageGenDropdownOpen] = useState(false);
  
  // 🚀 NEW: Sleek UI Toast Error State
  const [uiToastError, setUiToastError] = useState(null);

  const tutorProfiles = [
    {
      id: "jay",
      name: "Teacher Jay",
      description: "The most powerful and intelligent tutor at Jemer Academy. Witty, direct and a deep thinker.",
      badge: "PRO",
      badgeStyle: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/30"
    },
    {
      id: "emily",
      name: "Teacher Emily",
      description: "The second most intelligent tutor at Jemer Academy. Methodical, precise, and a master of logic.",
      badge: "EXPERT",
      badgeStyle: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
    },
    {
      id: "dave",
      name: "Teacher Dave",
      description: "The default tutor. Encouraging, patient, and wise. Great for beginners.",
      badge: "DEFAULT",
      badgeStyle: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    },
    {
      id: "jemerai",
      name: "Jemer AI",
      description: "General purpose AI with broad knowledge and Google search capabilities.",
      badge: "GENERAL",
      badgeStyle: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400"
    }
  ];
  const [activeTutor, setActiveTutor] = useState(tutorProfiles[0]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [imageGenMode, setImageGenMode] = useState("adaptive");
  const [deepResearchActive, setDeepResearchActive] = useState(false);
  const [canvasActive, setCanvasActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const promptContainerRef = useRef(null);

  // 🚀 NEW: Helper to trigger sleek UI alerts
  const triggerToast = (msg) => {
    setUiToastError(msg);
    setTimeout(() => setUiToastError(null), 4000);
  };

  useEffect(() => {
    if (injectedPromptText) {
      setTextPrompt(injectedPromptText);
    }
  }, [injectedPromptText]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const glowTimer = setTimeout(() => {
      setShowGlow(false);
    }, 3000);
    const savedTutorId = localStorage.getItem("selectedTutorId");
    if (savedTutorId) {
      const matchedProfile = tutorProfiles.find((t) => t.id === savedTutorId);
      if (matchedProfile) {
        setActiveTutor(matchedProfile);
      }
    }
    const savedImageGen = localStorage.getItem("jemer_image_gen_mode");
    if (savedImageGen && savedImageGen !== "off") {
      setImageGenMode(savedImageGen);
    } else {
      setImageGenMode("adaptive");
    }
    const savedCanvas = localStorage.getItem("jemer_canvas_active");
    if (savedCanvas === "true") setCanvasActive(true);
    const savedDeepResearch = localStorage.getItem("jemer_deep_research_active");
    if (savedDeepResearch === "true") setDeepResearchActive(true);
    
    return () => {
      clearTimeout(glowTimer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const next = Math.min(ta.scrollHeight, 200);
    ta.style.height = next + "px";
    ta.style.overflowY = ta.scrollHeight > 200 ? "auto" : "hidden";
  }, [textPrompt]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (promptContainerRef.current && !promptContainerRef.current.contains(event.target)) {
        setPlusMenuOpen(false);
        setTutorMenuOpen(false);
        setImageGenDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleTutorSelectionChange = (tutorTargetProfile) => {
    setActiveTutor(tutorTargetProfile);
    localStorage.setItem("selectedTutorId", tutorTargetProfile.id);
    localStorage.setItem("selectedTutorName", tutorTargetProfile.name);
    setTutorMenuOpen(false);
  };

  const activateTool = (toolType, mode = null) => {
    // 🚀 FIXED: Padlocked Features trigger toast error
    if (toolType === 'canvas' || toolType === 'deepResearch') {
        triggerToast("This feature is currently in development. Coming soon!");
        setPlusMenuOpen(false);
        return;
    }
    if (toolType === 'imageGen') {
      const nextMode = mode || "adaptive";
      setImageGenMode(nextMode);
      localStorage.setItem("jemer_image_gen_mode", nextMode);
    }
  };

  const uploadFileToR2 = async (fileInstance, fileUID, sanitizedName) => {
    try {
      const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
        (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" : 
         activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" : 
         "http://localhost:8080");
      
      const presignedUrlResponse = await window.JemerAuth.authenticatedFetch(`${BACKEND_URL}/api/v1/tools/storage/presigned-url?filename=${encodeURIComponent(sanitizedName)}`);
      
      if (!presignedUrlResponse.ok) {
        throw new Error("Failed to get secure upload link from server.");
      }

      const { presigned_url, object_key } = await presignedUrlResponse.json();

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presigned_url, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setAttachedFiles((prev) => prev.map(f => f.uid === fileUID ? { ...f, progress: percentComplete } : f));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setAttachedFiles((prev) => prev.map(f => f.uid === fileUID ? { ...f, status: 'completed', objectKey: object_key, progress: 100 } : f));
        } else {
          setAttachedFiles((prev) => prev.map(f => f.uid === fileUID ? { ...f, status: 'error' } : f));
        }
      };

      xhr.onerror = () => {
        setAttachedFiles((prev) => prev.map(f => f.uid === fileUID ? { ...f, status: 'error' } : f));
      };
      
      xhr.send(fileInstance);
    } catch (error) {
      console.error("[FILE UPLOAD SYSTEM] Pipeline failure:", error);
      setAttachedFiles((prev) => prev.map(f => f.uid === fileUID ? { ...f, status: 'error' } : f));
    }
  };

  const processIncomingAttachments = (eventContext) => {
    const targetedFiles = Array.from(eventContext.target.files || []);
    
    if (attachedFiles.length + targetedFiles.length > 10) {
      triggerToast("You can only attach a maximum of 10 files per prompt.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const verifiedBuffer = [];
    const filesToUpload = [];

    targetedFiles.forEach((fileInstance) => {
      // 🚀 NEW: Strict 300MB Memory Shield
      if (fileInstance.size > 300 * 1024 * 1024) {
          triggerToast(`Rejected: "${fileInstance.name}" exceeds the 300MB maximum limit.`);
          return;
      }

      if (fileInstance.type.startsWith("image/") || fileInstance.type.startsWith("video/")) {
        triggerToast(`Rejected: "${fileInstance.name}" is an image or video file.`);
      } else {
        const isDuplicate = attachedFiles.some(existingFile => existingFile.originalName === fileInstance.name);
        if (isDuplicate) {
          triggerToast(`File "${fileInstance.name}" is already attached.`);
        } else {
          // 🚀 FIXED: Filename Sanitizer - Replaces spaces, +, and special chars with underscores
          const sanitizedName = fileInstance.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileUID = `${Date.now()}-${sanitizedName}`;
          
          verifiedBuffer.push({
            uid: fileUID,
            name: sanitizedName,
            originalName: fileInstance.name,
            sizeInBytes: fileInstance.size,
            status: 'uploading',
            progress: 0,
            objectKey: null
          });
          filesToUpload.push({ fileInstance, uid: fileUID, sanitizedName });
        }
      }
    });

    if (verifiedBuffer.length > 0) {
      setAttachedFiles((prev) => [...prev, ...verifiedBuffer]);
      filesToUpload.forEach(item => uploadFileToR2(item.fileInstance, item.uid, item.sanitizedName));
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setPlusMenuOpen(false);
  };

  const handlePurgeAttachedFile = (fileUidToken) => {
    setAttachedFiles((prev) => prev.filter((item) => item.uid !== fileUidToken));
  };

  const handleDispatchPromptMessage = () => {
    const successfullyUploadedKeys = attachedFiles
      .filter(f => f.status === 'completed' && f.objectKey)
      .map(f => f.objectKey);

    if (!textPrompt.trim() && successfullyUploadedKeys.length === 0) return;

    const finalDataPayload = {
      promptText: textPrompt.trim(),
      selectedTutor: activeTutor.id,
      attached_files: successfullyUploadedKeys, 
      toolingContext: {
        imageGeneration: imageGenMode,
        deepResearch: deepResearchActive,
        canvasWorkspace: canvasActive
      }
    };
    
    if (onSendMessage) onSendMessage(finalDataPayload);
    
    setTextPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
    setAttachedFiles([]);
    setHasSentFirstMessage(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative select-none">

      {/* 🚀 NEW: Sleek Floating UI Error Toast */}
      {uiToastError && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-[100] bg-rose-50 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in text-[11px] font-bold w-max max-w-[90%] pointer-events-none">
           <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           <span className="truncate">{uiToastError}</span>
        </div>
      )}

      {showGlow && (
        <>
          <div className="absolute rounded-[48px] z-0 pointer-events-none" style={{
            top: "-10px", bottom: "-10px", left: "0", right: "0",
            background: "linear-gradient(90deg,#818cf8,#a855f7,#ec4899,#f43f5e,#f97316,#fbbf24,#34d399,#22d3ee,#6366f1,#818cf8)",
            backgroundSize: "350% 100%", filter: "blur(22px)",
            animation: "rainbowSlide 2s linear infinite, glowFadeOut 3s ease-out forwards",
          }} />
          <div className="absolute rounded-[48px] z-0 pointer-events-none" style={{
            top: "-4px", bottom: "-4px", left: "0", right: "0",
            background: "linear-gradient(90deg,#818cf8,#a855f7,#ec4899,#f43f5e,#f97316,#fbbf24,#34d399,#22d3ee,#6366f1,#818cf8)",
            backgroundSize: "350% 100%", filter: "blur(10px)", opacity: 0.85,
            animation: "rainbowSlide 2s linear infinite, glowFadeOut 3s ease-out forwards",
          }} />
          <div className="absolute rounded-[48px] z-0 pointer-events-none" style={{
            top: "-2px", bottom: "-2px", left: "0", right: "0",
            background: "linear-gradient(90deg,#818cf8,#a855f7,#ec4899,#f43f5e,#f97316,#fbbf24,#34d399,#22d3ee,#6366f1,#818cf8)",
            backgroundSize: "350% 100%", filter: "blur(3px)", opacity: 0.9,
            animation: "rainbowSlide 2s linear infinite, glowFadeOut 3s ease-out forwards",
          }} />
        </>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rainbowSlide {
          0%   { background-position: 0% 0%; }
          100% { background-position: 350% 0%; }
        }
        @keyframes glowFadeOut {
          0%   { opacity: 0; }
          8%   { opacity: 1; }
          70%  { opacity: 0.95; }
          100% { opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes slideUpDesktop {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        .animate-slide-up-desktop { animation: slideUpDesktop 0.2s cubic-bezier(0.16,1,0.3,1); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .prompt-textarea::-webkit-scrollbar { width: 3px; }
        .prompt-textarea::-webkit-scrollbar-track { background: transparent; }
        .prompt-textarea::-webkit-scrollbar-thumb {
          background-color: rgba(148,163,184,0.35);
          border-radius: 2px;
        }
        .prompt-textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148,163,184,0.6);
        }
        .modal-scroll::-webkit-scrollbar { display: none; }
        .modal-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div ref={promptContainerRef} className="relative w-full rounded-[38px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 p-3 sm:p-3.5 flex flex-col gap-2.5 transition-all duration-300 z-10 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05),0_30px_60px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.5),0_40px_70px_-15px_rgba(0,0,0,0.75)]">
        
        {/* 🚀 FIXED: Moved Attached Files Array ABOVE the Text Area to match ChatGPT UI */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-2 px-1 max-h-[120px] overflow-y-auto modal-scroll animate-fade-in">
            {attachedFiles.map((file) => (
              <div 
                key={file.uid}
                className="relative overflow-hidden flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 px-3 py-2 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm group"
              >
                {file.status === 'uploading' && (
                  <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300" style={{ width: `${file.progress}%` }} />
                )}
                
                <div className="flex-shrink-0">
                  {file.status === 'completed' && (
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {file.status === 'uploading' && (
                    <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {file.status === 'error' && (
                    <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {(!file.status || !['completed', 'uploading', 'error'].includes(file.status)) && (
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                
                <div className="flex flex-col min-w-0">
                  <span className="truncate max-w-[120px] sm:max-w-[150px] font-bold text-[11px]">{file.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-slate-500 font-mono uppercase">{formatFileSize(file.sizeInBytes)}</span>
                    {file.status === 'uploading' && <span className="text-[9px] text-blue-500 font-mono font-bold">{file.progress}%</span>}
                    {file.status === 'error' && <span className="text-[9px] text-rose-500 font-bold">Failed</span>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePurgeAttachedFile(file.uid)}
                  className="text-slate-400 hover:text-rose-500 transition-colors ml-1 cursor-pointer focus:outline-none p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 z-10"
                  title="Remove file"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="w-full">
          <textarea
            ref={textareaRef}
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            disabled={isStreaming}
            // 🚀 FIXED: Mobile Keyboard Auto-Scroll Alignment
            onFocus={(e) => {
              if (isMobileView) {
                setTimeout(() => {
                   e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isStreaming && !attachedFiles.some(f => f.status === 'uploading')) {
                  handleDispatchPromptMessage();
                }
              }
            }}
            placeholder={isStreaming ? "Tutor is replying..." : hasSentFirstMessage ? "Reply Tutor..." : "What can I Teach you today?"}
            className={`prompt-textarea w-full bg-transparent text-slate-900 dark:text-slate-100 font-sans font-medium text-base sm:text-lg placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none leading-relaxed transition-all duration-200 px-1 ${isStreaming ? "opacity-40 cursor-not-allowed" : ""}`}
            style={{ minHeight: "42px", maxHeight: "200px", overflowY: "hidden" }}
            rows={1}
          />
        </div>
        
        <div className="flex flex-row items-center justify-between gap-2 pt-1 w-full border-t border-transparent">
          
          <div className="flex flex-row items-center gap-2 relative min-w-0">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPlusMenuOpen(!plusMenuOpen);
                  setTutorMenuOpen(false);
                }}
                disabled={isStreaming}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none shadow-sm ${isStreaming ? "opacity-50 pointer-events-none" : ""} ${
                  plusMenuOpen 
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900" 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }`}
                title="Upload files & Tools"
              >
                <svg className={`w-5 h-5 transition-transform duration-200 ${plusMenuOpen ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              {plusMenuOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-72 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/90 dark:border-slate-700/80 p-3 z-50 animate-slide-up shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
                  
                  <div className="space-y-1 mb-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2 px-2">Upload Files (Max 10)</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={processIncomingAttachments} 
                      multiple 
                      disabled={attachedFiles.length >= 10}
                      className="hidden" 
                      accept="*/*"
                    />
                    <button
                      type="button"
                      disabled={attachedFiles.length >= 10}
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                         </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">Upload Document</span>
                        <span className="text-[10px] text-slate-400 font-medium">PDFs, Text, Datasets (Max 300MB)</span>
                      </div>
                    </button>
                  </div>
                  <hr className="border-slate-100 dark:border-slate-800/60 my-2" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2 px-2">Jemer Tools</p>
                    
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Image Generation</span>
                      </div>
                      
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setImageGenDropdownOpen(!imageGenDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <span className="flex items-center gap-2 font-medium">
                            {imageGenMode === "adaptive" ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span>Adaptive (Auto)</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                <span>Only When Asked</span>
                              </>
                            )}
                          </span>
                          <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${imageGenDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {imageGenDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-20 overflow-hidden animate-fade-in">
                            <button
                              type="button"
                              onClick={() => {
                                activateTool('imageGen', 'adaptive');
                                setImageGenDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between text-left px-3 py-2.5 text-sm transition-colors ${
                                imageGenMode === "adaptive" 
                                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-bold" 
                                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
                              }`}
                            >
                              <span>Adaptive</span>
                              {imageGenMode === "adaptive" && (
                                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                activateTool('imageGen', 'only-when-asked');
                                setImageGenDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between text-left px-3 py-2.5 text-sm transition-colors ${
                                imageGenMode === "only-when-asked" 
                                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-bold" 
                                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium"
                              }`}
                            >
                              <span>Only When Asked</span>
                              {imageGenMode === "only-when-asked" && (
                                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => activateTool('canvas')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                      </div>
                      <span className="font-bold flex-1 text-left">Canvas</span>
                      {/* 🚀 FIXED: Injected SVG Padlock to indicate Coming Soon */}
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => activateTool('deepResearch')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                         </svg>
                      </div>
                      <span className="font-bold flex-1 text-left">Deep Research</span>
                      {/* 🚀 FIXED: Injected SVG Padlock to indicate Coming Soon */}
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative min-w-0">
              <button
                type="button"
                onClick={() => {
                  setTutorMenuOpen(!tutorMenuOpen);
                  setPlusMenuOpen(false);
                }}
                disabled={isStreaming}
                className={`h-10 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2.5 px-3.5 text-sm font-bold transition-all duration-200 cursor-pointer focus:outline-none shadow-sm max-w-[130px] sm:max-w-none ${isStreaming ? "opacity-50 pointer-events-none" : "active:scale-98"}`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                <span className="hidden sm:inline truncate">{activeTutor.name}</span>
                <span className="sm:hidden truncate">{activeTutor.name.replace("Teacher ", "")}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${tutorMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {tutorMenuOpen && (
                <div className="absolute bottom-full left-0 sm:left-auto mb-3 w-65 sm:w-80 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/90 dark:border-slate-700/80 p-3 z-50 animate-slide-up shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2 px-2">Select Active Tutor</p>
                  <div className="space-y-1 modal-scroll max-h-[60vh] overflow-y-auto">
                    {tutorProfiles.map((tutor) => {
                      const isCurrentlySelected = tutor.id === activeTutor.id;
                      return (
                        <button
                          key={tutor.id}
                          type="button"
                          onClick={() => handleTutorSelectionChange(tutor)}
                          className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border focus:outline-none ${
                            isCurrentlySelected 
                              ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800" 
                              : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-black tracking-tight ${isCurrentlySelected ? "text-indigo-700 dark:text-indigo-300" : "text-slate-900 dark:text-white"}`}>
                              {tutor.name}
                            </span>
                            <span className={`text-[9px] font-black tracking-wider font-mono uppercase px-1.5 py-0.5 rounded ${tutor.badgeStyle}`}>
                              {tutor.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-normal">
                            {tutor.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center px-2">
                      Jemer tutors may make mistakes, please crosscheck work.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center shrink-0">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStream}
                className="w-10 h-10 sm:w-auto p-0 sm:px-4 rounded-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 shrink-0"
                title="Stop generation"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="hidden sm:flex gap-0.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                  <span className="hidden sm:inline-block ml-1">Stop</span>
                  <svg className="w-3 h-3 sm:w-2.5 sm:h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDispatchPromptMessage}
                disabled={(!textPrompt.trim() && attachedFiles.length === 0) || attachedFiles.some(f => f.status === 'uploading')}
                className="w-10 h-10 sm:w-auto p-0 sm:px-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-sans font-black tracking-wide text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none shrink-0"
                title="Send message"
              >
                <span className="hidden sm:inline-block">Send</span>
                <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}