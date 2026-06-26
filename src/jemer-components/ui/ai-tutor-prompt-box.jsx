/**
🤖 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM AI TUTOR PROMPT BOX CORE ENGINE (v2.4.0 FULL UPGRADE)
Description: Viewport-responsive, theme-adaptive AI prompt execution box panel with high depth and radius.
Performance Tier: Hardware-Accelerated 3-Second Perimeter Animation Hydration Loop.
Design Tokens: Integrated with useTheme() to match global high-contrast display layers.
Modification Layer: Equipped with local storage synchronization and glassmorphic shadow profiling.
Compliance: 100% comprehensive line-by-line developer documentation for extreme clarity.
*/
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx";

export default function AITutorPromptBox({ onSendMessage, injectedPromptText }) {
  // Pull high-contrast active theme details from the centralized theme application layer context 
  const { theme } = useTheme();
  
  // State vector holding raw literal textual student characters typed inside input arenas
  const [textPrompt, setTextPrompt] = useState("");
  
  // Tracks if initial dispatch sequence triggered to switch greeting placeholders contextually
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  
  // Controls hardware-accelerated animated edge lighting aura runtime visibility loops
  const [showGlow, setShowGlow] = useState(true);
  
  // Toggles workspace file attachment and tool expansion context slider layers open or closed
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  
  // Toggles conversational teacher profiles sheet list components open or closed
  const [tutorMenuOpen, setTutorMenuOpen] = useState(false);
  
  // Track viewport dimension constraints to change layouts between mobile sliders and desktop flyouts
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Custom dropdown display toggles for configuring active image synthesis properties
  const [imageGenDropdownOpen, setImageGenDropdownOpen] = useState(false);

  // Hardcoded textbook profile identities assigning unique behavioral traits to available instruction targets
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

  // Active student instruction target state choice pointer reference
  const [activeTutor, setActiveTutor] = useState(tutorProfiles[0]);
  
  // File attachments stack buffering documents before form payload dispatch operations
  const [attachedFiles, setAttachedFiles] = useState([]);
  
  // UPGRADE 7 & 1: Defaults to adaptive mode; the 'off' choice option has been fully purged from the selection grids
  const [imageGenMode, setImageGenMode] = useState("adaptive");
  
  // Active toggle flag state mapping deep investigation query structures
  const [deepResearchActive, setDeepResearchActive] = useState(false);
  
  // Active toggle flag state tracking custom canvas inline workspaces
  const [canvasActive, setCanvasActive] = useState(false);
  
  // Native DOM handle referencing system file upload browse dialogues safely
  const fileInputRef = useRef(null);
  
  // Native DOM node mapping the micro expanding text area bounding boxes
  const textareaRef = useRef(null);

  // Synchronizes outside prompt card choice inputs straight into the prompt state string layer
  useEffect(() => {
    if (injectedPromptText) {
      setTextPrompt(injectedPromptText);
    }
  }, [injectedPromptText]);

  // Unified application post-mount hardware calibration and local storage hydration life-cycle routine
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

    // ── UPGRADE 2: LOAD SELECTIONS FROM LOCAL STORAGE PERSISTENCE LAYERS ──
    const savedImageGen = localStorage.getItem("jemer_image_gen_mode");
    if (savedImageGen && savedImageGen !== "off") {
      setImageGenMode(savedImageGen);
    } else {
      setImageGenMode("adaptive");
    }

    const savedCanvas = localStorage.getItem("jemer_canvas_active");
    if (savedCanvas === "true") {
      setCanvasActive(true);
    }

    const savedDeepResearch = localStorage.getItem("jemer_deep_research_active");
    if (savedDeepResearch === "true") {
      setDeepResearchActive(true);
    }

    return () => {
      clearTimeout(glowTimer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Recalculates bounding viewport heights on character updates to expand input size smoothly
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const next = Math.min(ta.scrollHeight, 200);
    ta.style.height = next + "px";
    ta.style.overflowY = ta.scrollHeight > 200 ? "auto" : "hidden";
  }, [textPrompt]);

  // Saves selected instruction targets into local storage parameters across page updates
  const handleTutorSelectionChange = (tutorTargetProfile) => {
    setActiveTutor(tutorTargetProfile);
    localStorage.setItem("selectedTutorId", tutorTargetProfile.id);
    localStorage.setItem("selectedTutorName", tutorTargetProfile.name);
    setTutorMenuOpen(false);
  };

  // ── UPGRADE 1 & 2: RE-ENGINEERED CONCURRENT TOOL EXTRACTION ACTIVATOR ──
  // Keeps image synthesis settings completely active alongside custom workspace panels concurrent
  const activateTool = (toolType, mode = null) => {
    if (toolType === 'canvas') {
      const nextCanvas = !canvasActive;
      setCanvasActive(nextCanvas);
      localStorage.setItem("jemer_canvas_active", String(nextCanvas));
      // Workspace layout panels maintain strict mutual exclusivity against each other
      if (nextCanvas) {
        setDeepResearchActive(false);
        localStorage.setItem("jemer_deep_research_active", "false");
      }
    } else if (toolType === 'deepResearch') {
      const nextDeepResearch = !deepResearchActive;
      setDeepResearchActive(nextDeepResearch);
      localStorage.setItem("jemer_deep_research_active", String(nextDeepResearch));
      // Workspace layout panels maintain strict mutual exclusivity against each other
      if (nextDeepResearch) {
        setCanvasActive(false);
        localStorage.setItem("jemer_canvas_active", "false");
      }
    } else if (toolType === 'imageGen') {
      const nextMode = mode || "adaptive";
      setImageGenMode(nextMode);
      localStorage.setItem("jemer_image_gen_mode", nextMode);
    }
  };

  // Inspects uploads, rejecting deep heavy media layers to prioritize light core content data streams
  const processIncomingAttachments = (eventContext) => {
    const targetedFiles = Array.from(eventContext.target.files || []);
    const verifiedBuffer = [];

    targetedFiles.forEach((fileInstance) => {
      if (fileInstance.type.startsWith("image/") || fileInstance.type.startsWith("video/")) {
        alert(`Attachment Rejected: "${fileInstance.name}" is an image or video file.`);
      } else {
        const isDuplicate = attachedFiles.some(existingFile => existingFile.name === fileInstance.name);
        if (isDuplicate) {
          alert(`File "${fileInstance.name}" is already attached.`);
        } else {
          verifiedBuffer.push({
            uid: `${Date.now()}-${fileInstance.name}`,
            name: fileInstance.name,
            sizeInBytes: fileInstance.size,
            rawHandle: fileInstance
          });
        }
      }
    });

    if (verifiedBuffer.length > 0) {
      setAttachedFiles((prev) => [...prev, ...verifiedBuffer]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setPlusMenuOpen(false);
  };

  // Erases precise files from attachment stack buffer slots
  const handlePurgeAttachedFile = (fileUidToken) => {
    setAttachedFiles((prev) => prev.filter((item) => item.uid !== fileUidToken));
  };

  // Assembles structured transaction state items and forwards payloads up to orchestration layers
  const handleDispatchPromptMessage = () => {
    if (!textPrompt.trim() && attachedFiles.length === 0) return;
    const finalDataPayload = {
      promptText: textPrompt.trim(),
      selectedTutor: activeTutor.id,
      attachments: attachedFiles,
      toolingContext: {
        imageGeneration: imageGenMode,
        deepResearch: deepResearchActive,
        canvasWorkspace: canvasActive
      }
    };

    console.log("[PROMPT ENGINE DISPATCH] Transmitting payload:", finalDataPayload);

    if (onSendMessage) {
      onSendMessage(finalDataPayload);
    }

    // Flushes text buffers safely
    setTextPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
    setAttachedFiles([]);
    
    // ── UPGRADE 3: REMOVED CONTEXT DEACTIVATION RESETS ──
    // Selections remain pinned inside prompt arena frames across continuous turns
    setHasSentFirstMessage(true);
  };

  // Formats data sizes cleanly for display readouts
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative select-none">
      {/* ── UPGRADE 5 & 6: ADVANCED RADIUS CO-ALIGNED RAINBOW GLOW ELEMENT CHASSIS (rounded-[48px]) ── */}
      {showGlow && (
        <>
          {/* Layer A: Wide blur peripheral dispersion track */}
          <div className="absolute rounded-[48px] z-0 pointer-events-none" style={{
            top: "-10px", bottom: "-10px", left: "0", right: "0",
            background: "linear-gradient(90deg,#818cf8,#a855f7,#ec4899,#f43f5e,#f97316,#fbbf24,#34d399,#22d3ee,#6366f1,#818cf8)",
            backgroundSize: "350% 100%", filter: "blur(22px)",
            animation: "rainbowSlide 2s linear infinite, glowFadeOut 3s ease-out forwards",
          }} />
          {/* Layer B: Ambient mid-layer illumination contour path */}
          <div className="absolute rounded-[48px] z-0 pointer-events-none" style={{
            top: "-4px", bottom: "-4px", left: "0", right: "0",
            background: "linear-gradient(90deg,#818cf8,#a855f7,#ec4899,#f43f5e,#f97316,#fbbf24,#34d399,#22d3ee,#6366f1,#818cf8)",
            backgroundSize: "350% 100%", filter: "blur(10px)", opacity: 0.85,
            animation: "rainbowSlide 2s linear infinite, glowFadeOut 3s ease-out forwards",
          }} />
          {/* Layer C: Sharp close-proximity contour rim light ring */}
          <div className="absolute rounded-[48px] z-0 pointer-events-none" style={{
            top: "-2px", bottom: "-2px", left: "0", right: "0",
            background: "linear-gradient(90deg,#818cf8,#a855f7,#ec4899,#f43f5e,#f97316,#fbbf24,#34d399,#22d3ee,#6366f1,#818cf8)",
            backgroundSize: "350% 100%", filter: "blur(3px)", opacity: 0.9,
            animation: "rainbowSlide 2s linear infinite, glowFadeOut 3s ease-out forwards",
          }} />
        </>
      )}
      
      {/* Structural inline animation configuration matrices */}
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

      {/* ── UPGRADE 4, 5 & DEPTH: MASTER CHASSIS BOX PANELS WITH FROSTED GLASS & MULTI-ALTITUDE SHADOWS ──
          - Swapped standard rounding to high pebble-style curve rounded-[48px]
          - Decreased padding from p-4 sm:p-5 to p-3 sm:p-3.5 and gap to gap-2.5 to contract vertical length footprint
          - Added bg-white/90 dark:bg-slate-900/90 and backdrop-blur-xl for smooth frosted surface glassmorphism
          - Injected high-altitude layered ambient shadows simulation pop out from base document layers
      */}
      <div className="relative w-full rounded-[48px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 p-3 sm:p-3.5 flex flex-col gap-2.5 transition-all duration-300 z-10 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05),0_30px_60px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.5),0_40px_70px_-15px_rgba(0,0,0,0.75)]">
        
        {/* Active Indicators Area Row */}
        {(canvasActive || deepResearchActive) && (
          <div className="flex flex-wrap items-center gap-2 animate-fade-in">
            {canvasActive && (
              <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 px-3 py-1 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Canvas</span>
                <button
                  onClick={() => {
                    setCanvasActive(false);
                    localStorage.setItem("jemer_canvas_active", "false");
                  }}
                  className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors cursor-pointer"
                  title="Disable Canvas"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {deepResearchActive && (
              <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Deep Research</span>
                <button
                  onClick={() => {
                    setDeepResearchActive(false);
                    localStorage.setItem("jemer_deep_research_active", "false");
                  }}
                  className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors cursor-pointer"
                  title="Disable Deep Research"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Text Input Block Wrapper Cell */}
        <div className="w-full">
          <textarea
            ref={textareaRef}
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleDispatchPromptMessage();
              }
            }}
            placeholder={hasSentFirstMessage ? "Reply Tutor..." : "What can I Teach you today?"}
            className="prompt-textarea w-full bg-transparent text-slate-900 dark:text-slate-100 font-sans font-medium text-base sm:text-lg placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            style={{ minHeight: "42px", maxHeight: "200px", overflowY: "hidden" }}
            rows={1}
          />
        </div>

        {/* Buffered Documents Rows Area */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60 max-h-[120px] overflow-y-auto scrollbar-none animate-fade-in">
            {attachedFiles.map((file) => (
              <div 
                key={file.uid}
                className="flex items-center gap-2.5 bg-slate-800 dark:bg-slate-800 border border-slate-700 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 dark:text-slate-200 shadow-sm group"
              >
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex flex-col min-w-0">
                  <span className="truncate max-w-[150px] sm:max-w-[200px] font-medium">{file.name}</span>
                  <span className="text-[10px] text-slate-400">{formatFileSize(file.sizeInBytes)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handlePurgeAttachedFile(file.uid)}
                  className="text-slate-400 hover:text-red-400 transition-colors ml-1 cursor-pointer focus:outline-none p-0.5 hover:bg-slate-700 rounded"
                  title="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── ZONE 3: ENGAGEMENT ACTIONS INTERACTION RAIL ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center flex-wrap gap-2 relative">
            
            <div className="relative">
              {/* ── UPGRADE 6: FILE SLIDER PLUS MENU TRIGGER — SHIFTED TO PILL GEOMETRY (rounded-full) ── */}
              <button
                type="button"
                onClick={() => {
                  setPlusMenuOpen(!plusMenuOpen);
                  setTutorMenuOpen(false);
                }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none ${
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
                /* ── UPGRADE DEPTH: ADDED CUSTOM HIGH ALTITUDE DROP SHADOW EXTRACTS ON EXPANSIONS ── */
                <div className="absolute bottom-full left-0 mb-3 w-72 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/90 dark:border-slate-700/80 p-3 z-50 animate-slide-up shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
                  
                  <div className="space-y-1 mb-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2 px-2">Upload Files</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={processIncomingAttachments} 
                      multiple 
                      className="hidden" 
                      accept="*/*"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
                    >
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="font-semibold">Upload files</span>
                        <span className="text-[10px] text-slate-400">Documents, PDFs, text</span>
                      </div>
                    </button>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-700 my-2" />

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2 px-2">Tools</p>
                    
                    {/* Image Generation Segment Config Section */}
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Image Generation</span>
                      </div>
                      
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setImageGenDropdownOpen(!imageGenDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <span className="flex items-center gap-2">
                            {/* ── UPGRADE 7: OFF OPTION REMOVED FROM ALL CORE EVALUATION BLOCKS ── */}
                            {imageGenMode === "adaptive" ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span>Adaptive</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                <span>Only When I Ask</span>
                              </>
                            )}
                          </span>
                          <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${imageGenDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {imageGenDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-20 overflow-hidden animate-fade-in">
                            {/* ── UPGRADE 7: REMOVED THE OFF INTERACTING LINK TRIGGER COMPLETELY ── */}
                            <button
                              type="button"
                              onClick={() => {
                                activateTool('imageGen', 'adaptive');
                                setImageGenDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between text-left px-3 py-2.5 text-sm transition-colors ${
                                imageGenMode === "adaptive" 
                                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" 
                                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
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
                                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" 
                                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                              }`}
                            >
                              <span>Only When I Ask</span>
                              {imageGenMode === "only-when-asked" && (
                                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <p className="mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {imageGenMode === "adaptive" ? "AI will decide when to generate images" : "Only generates when explicitly requested"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => activateTool('canvas')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none ${
                        canvasActive
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Canvas</span>
                      {canvasActive && <span className="ml-auto text-xs">✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => activateTool('deepResearch')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none ${
                        deepResearchActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" 
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Deep Research</span>
                      {deepResearchActive && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center">
                      Only one workspace tool can be active at a time
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              {/* ── UPGRADE 6: ACTIVE TUTOR TRIGGER SELECTOR BUTTON — CONVERTED TO PILL GEOMETRY (rounded-full) ── */}
              <button
                type="button"
                onClick={() => {
                  setTutorMenuOpen(!tutorMenuOpen);
                  setPlusMenuOpen(false);
                }}
                className="h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2.5 px-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-98 focus:outline-none shadow-sm"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>{activeTutor.name}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${tutorMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {tutorMenuOpen && isMobileView && (
                <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                  <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                    onClick={() => setTutorMenuOpen(false)}
                  />
                  <div
                    className="relative w-full bg-white dark:bg-slate-900 pointer-events-auto animate-slide-up flex flex-col overflow-hidden"
                    style={{ height: "70vh", borderRadius: "20px 20px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                      <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    </div>

                    <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Choose Your Tutor</h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          Active: <span className="font-semibold text-indigo-500">{activeTutor.name}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setTutorMenuOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mx-5 h-px bg-slate-100 dark:bg-slate-800 flex-shrink-0" />

                    <div className="modal-scroll flex-1 overflow-y-auto px-4 py-3 space-y-2">
                      {tutorProfiles.map((tutor) => {
                        const isCurrentlySelected = tutor.id === activeTutor.id;
                        const avatarGradient =
                          tutor.id === "jay"     ? "from-blue-500 to-indigo-600"
                        : tutor.id === "emily"   ? "from-amber-400 to-orange-500"
                        : tutor.id === "dave"    ? "from-slate-400 to-slate-600"
                        :                          "from-purple-500 to-violet-600";
                        return (
                          <button
                            key={tutor.id}
                            type="button"
                            onClick={() => handleTutorSelectionChange(tutor)}
                            className={`w-full text-left flex items-center gap-3 px-3 py-3.5 rounded-2xl transition-all cursor-pointer focus:outline-none ${
                              isCurrentlySelected
                                ? "bg-indigo-50 dark:bg-indigo-900/25 ring-2 ring-indigo-400 dark:ring-indigo-500"
                                : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                          >
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                              <span className="text-lg font-black text-white leading-none">
                                {tutor.name.split(" ").pop().charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-sm font-bold ${isCurrentlySelected ? "text-indigo-700 dark:text-indigo-300" : "text-slate-900 dark:text-white"}`}>
                                  {tutor.name}
                                </span>
                                <span className={`text-[9px] font-black tracking-wider font-mono uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${tutor.badgeStyle}`}>
                                  {tutor.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                {tutor.description}
                              </p>
                            </div>
                            {isCurrentlySelected && (
                              <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="px-5 py-3 flex-shrink-0">
                      <div className="h-px bg-slate-100 dark:bg-slate-800 mb-3" />
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                        Jemer tutors may make mistakes — please crosscheck your work.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tutorMenuOpen && !isMobileView && (
                <div className="absolute bottom-full left-0 mb-3 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50 animate-slide-up shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2 px-2">Select Active Tutor</p>
                  <div className="space-y-1">
                    {tutorProfiles.map((tutor) => {
                      const isCurrentlySelected = tutor.id === activeTutor.id;
                      return (
                        <button
                          key={tutor.id}
                          type="button"
                          onClick={() => handleTutorSelectionChange(tutor)}
                          className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                            isCurrentlySelected 
                              ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800" 
                              : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-bold ${isCurrentlySelected ? "text-indigo-700 dark:text-indigo-300" : "text-slate-900 dark:text-white"}`}>
                              {tutor.name}
                            </span>
                            <span className={`text-[9px] font-black tracking-wider font-mono uppercase px-1.5 py-0.5 rounded ${tutor.badgeStyle}`}>
                              {tutor.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {tutor.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                      Jemer tutors may make mistakes, please crosscheck work.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex items-center gap-2">
            {/* ── UPGRADE 6: PROMPT OUTBOUND SEND DISPATCH TRIGGER BUTTON — SHIFTED TO PILL GEOMETRY (rounded-full) ── */}
            <button
              type="button"
              onClick={handleDispatchPromptMessage}
              disabled={!textPrompt.trim() && attachedFiles.length === 0}
              className="h-10 px-5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
              title="Send message"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}