/**
 * ================================================================================================
 * 💬 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM AI TUTOR CHAT ARENA COMPONENT (v1.0)
 * ================================================================================================
 * Description: Viewport-aligned, theme-adaptive interactive streaming chat interface module.
 * Sizing Tier: 100% matched to prompt box constraints (max-w-4xl) across modern devices.
 * Interaction Layer: Equips students with in-line text edits, data copying, and model feedback vectors.
 * Compliance: 100% complete line-by-line developer code documentation for maximum transparency.
 * ================================================================================================
 */

"use client"; // Directs the Next.js framework engine to treat this module as an interactive client component running within browser DOM scopes

import React, { useState } from "react"; // Injects standard state and lifecycle parameters from React core
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Imports our global theme hook pipeline router to safely track display profiles

/**
 * Universal AI Tutor Chat Interface Component Terminal
 * @param {Object} props - Structural property configurations assigned by parent layout managers.
 * @param {Array} props.activeChatLog - Array containing real conversational message schemas traveling down the layout tree.
 * @param {function} props.onInterruptedEdit - Callback hook fired when a student stops active generations to edit an outbound message string.
 * @param {function} props.onRegenerateResponse - Callback hook fired when a student commands the backend engine to restart an AI response block.
 */
export default function AIChatInterface({ 
  activeChatLog, 
  onInterruptedEdit, 
  onRegenerateResponse 
}) {
  // ── LAYER 1: DESIGN SYSTEM THEME INTERACTION HOOKS ──────────────────────────────────────────
  // Extract custom active theme parameters directly out of the context pipeline to handle text layers safely
  const { theme } = useTheme();

  // ── LAYER 2: INTERACTIVE ACTION SELECTION STATES ──────────────────────────────────────────────
  // Tracks the ID string of the specific user bubble currently receiving cursor hover or tap focuses
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  
  // Tracks message keys mapped to string status indicators ("copied-user" / "copied-ai") to render brief verification icon checks
  const [copyStatusTracker, setCopyStatusTracker] = useState({});
  
  // Local object mapping dictionaries tracking like/dislike state flags across message items
  const [likedMessages, setLikedMessages] = useState({});
  const [dislikedMessages, setDislikedMessages] = useState({});

  // 📑 ACADEMY SMART EDUCATIONAL DUMMY PHRASINGS MATRIX
  // Highly structured, realistic academic definitions designed to provide a cohesive playground before final API wiring
  const educationalFallbacks = {
    userDefault: "Explain how structural parameters dictate thermodynamics and system entropy boundaries.",
    aiDefault: `### Understanding System Entropy & Thermodynamic Boundaries

In structural physics and chemistry, **Entropy** serves as the mathematical metric tracking molecular disorder within an isolated system. To break this down step-by-step:

1. **The Second Law Parameter:** Any natural thermodynamic sequence moves toward an escalated boundary of state chaos. Energy spontaneously dissipates if unconstrained.
2. **Structural Envelopes:** When matter undergoes conversion limits, the geometric alignment of system nodes dictates total heat capacity dispersion coefficients.

> *Core Takeaway:* To suppress system entropy escalations, thermal input weights must cross matching structural threshold resistances.`
  };

  // Static fallback array utilized strictly if parent layout engines pass down un-hydrated or empty chat records
  const fallbackChatData = [
    { id: "mock-msg-1", sender: "user", text: educationalFallbacks.userDefault },
    { id: "mock-msg-2", sender: "ai", text: educationalFallbacks.aiDefault }
  ];

  // Compile our working target message matrix by evaluating properties input availability
  const visibleMessages = (activeChatLog && activeChatLog.length > 0) ? activeChatLog : fallbackChatData;

  // ── LAYER 3: CORE UTILITY TRANSACTION HANDLERS ────────────────────────────────────────────────
  /**
   * Safely captures plain text or structured markdown and pipes it directly into the client computer clipboard
   * @param {string} textToCapture - Raw textual message string or code block payload.
   * @param {string} messageId - Unique key tracking the target message card row layout.
   */
  const executeSystemTextCopy = (textToCapture, messageId) => {
    navigator.clipboard.writeText(textToCapture).then(() => {
      // Affix a transient verification status flag to highlight checkmark icons visually
      setCopyStatusTracker((prev) => ({ ...prev, [messageId]: true }));
      
      // Clear out checking state hooks after exactly 2000 milliseconds have elapsed
      setTimeout(() => {
        setCopyStatusTracker((prev) => ({ ...prev, [messageId]: false }));
      }, 2000);
    }).catch((err) => {
      console.error("[CLIPBOARD LOCKOUT] Failed to commit text string to system memory registries:", err.message);
    });
  };

  /**
   * Intercepts student edit clicks to halt background responses and cycle prompts back to inputs
   * @param {Object} messageItem - The detailed user prompt message record chosen for modifications.
   */
  const handleInitiatePromptEditSequence = (messageItem) => {
    console.log("[CHAT INTERFACE TRACE] Halting streaming workflows to execute prompt revision override:", messageItem);
    // Forward the specific prompt text back to the parent component context to hydrate the prompt box text state
    if (onInterruptedEdit) {
      onInterruptedEdit(messageItem.text);
    }
  };

  /**
   * Signals parent controllers to wipe subsequent rows and re-trigger model processing pipelines
   * @param {Object} targetUserPromptRecord - The initial query block referencing the requested subject track.
   */
  const handleTriggerModelRegeneration = (targetUserPromptRecord) => {
    console.log("[CHAT INTERFACE TRACE] Issuing restart token sequence for prompt ID:", targetUserPromptRecord.id);
    // Dispatches target instructions upstream to clear buffers and trigger fresh streaming typewriter iterations
    if (onRegenerateResponse) {
      onRegenerateResponse(targetUserPromptRecord);
    }
  };

  /**
   * Registers a student's positive valuation and automatically counter-clears dislike marks
   * @param {string} messageId - Tracking target reference key string.
   */
  const handleToggleLikeSentiment = (messageId) => {
    setLikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
    setDislikedMessages((prev) => ({ ...prev, [messageId]: false })); // Enforce clean mutual exclusivity
  };

  /**
   * Registers a student's negative valuation and automatically counter-clears like marks
   * @param {string} messageId - Tracking target reference key string.
   */
  const handleToggleDislikeSentiment = (messageId) => {
    setDislikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
    setLikedMessages((prev) => ({ ...prev, [messageId]: false })); // Enforce clean mutual exclusivity
  };

  return (
    // 🏢 MASTER CONVERSATIONAL ARENA RUNWAY: Vertically stacks messages with fluid adaptive padding layouts
    <div className="w-full flex flex-col gap-6 sm:gap-8 py-6 select-none animate-fade-in">
      {visibleMessages.map((msg, index) => {
        const isUserMessage = msg.sender === "user";

        // ── USER MESSAGE INTERACTIVE ROW CONTAINER ──────────────────────────────────────────────
        if (isUserMessage) {
          return (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
              onClick={() => setHoveredMessageId(hoveredMessageId === msg.id ? null : msg.id)} // Dual-tap mobile support
              className="w-full max-w-4xl mx-auto px-4 flex flex-col items-end relative group transition-all duration-150"
            >
              {/* UTILITY ACTIONS OVERLAY CONTAINER: Fades into view smoothly during cursor hovers or element clicks */}
              <div 
                className={`absolute -top-7 right-6 flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-1.5 py-1 rounded-xl shadow-sm z-20 transition-all duration-200 ${
                  hoveredMessageId === msg.id ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-95 pointer-events-none"
                }`}
              >
                {/* 📝 Prompt Editing Command Trigger Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Restrict event tracking actions to button scope boundaries
                    handleInitiatePromptEditSequence(msg);
                  }}
                  className="w-6 h-6 rounded-md text-slate-500 hover:text-blue-900 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer focus:outline-none"
                  title="Halt tutor processing and revise this prompt text"
                >
                  <i class="fas fa-pen" />
                </button>

                {/* 📋 Outbound User Message Copy Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    executeSystemTextCopy(msg.text, msg.id);
                  }}
                  className="w-6 h-6 rounded-md text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center text-[11px] transition-all cursor-pointer focus:outline-none"
                  title="Copy prompt characters to clipboard"
                >
                  <i className={`fas ${copyStatusTracker[msg.id] ? "fa-check text-emerald-500" : "fa-copy"}`} />
                </button>
              </div>

              {/* 🎯 USER BUBBLE WRAPPER ENVELOPE: Enforces total structural rounding properties as requested */}
              <div className="max-w-[85%] sm:max-w-[75%] bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded-3xl rounded-tr-sm px-4 py-3 text-left shadow-2xs group-hover:shadow-xs transition-shadow duration-200">
                <p className="text-sm sm:text-base font-sans font-medium text-slate-900 dark:text-slate-100 leading-relaxed break-words">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        }

        // ── AI MODEL RESPONSE VIEWPORT CONTAINER ────────────────────────────────────────────────
        // FIXED SIZING: Clamped exactly to matching prompt box width rules (max-w-4xl) across modern display breakpoints
        const associatedUserPrompt = visibleMessages[index - 1] || visibleMessages[0];
        
        return (
          <div
            key={msg.id}
            className="w-full max-w-4xl mx-auto px-4 flex flex-col items-start text-left border-b border-slate-100/60 dark:border-slate-800/20 pb-6 animate-fade-in"
          >
            {/* Model Identity Brand Row Label Header */}
            <div className="flex items-center gap-2 mb-2.5 select-none pl-1">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-900 to-purple-900 dark:from-blue-600 dark:to-purple-600 text-white flex items-center justify-center font-black text-[9px] shadow-inner">
                J
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Jemer Academy AI Tutor Pipeline
              </span>
            </div>

            {/* 🛡️ THEME-ADAPTIVE AI TYPOGRAPHY FRAME CORE */}
            {/* Formatted cleanly to parse dummy textbook strings using structured contrast styles natively */}
            <div className="w-full text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-sans font-medium space-y-3 pl-1 break-words">
              {/* Simple internal markdown mapping loop rendering sub-elements nicely without complex package structures */}
              {msg.text.split("\n\n").map((paragraphBlock, pIdx) => {
                if (paragraphBlock.startsWith("###")) {
                  return (
                    <h3 key={pIdx} className="text-base sm:text-lg font-display font-extrabold text-slate-900 dark:text-white tracking-tight pt-2">
                      {paragraphBlock.replace("###", "").trim()}
                    </h3>
                  );
                }
                if (paragraphBlock.startsWith(">")) {
                  return (
                    <blockquote key={pIdx} className="border-l-4 border-purple-500/60 bg-purple-50/40 dark:bg-purple-950/20 px-3.5 py-2 rounded-r-xl text-xs sm:text-sm italic font-medium text-purple-900 dark:text-purple-300">
                      {paragraphBlock.replace(">", "").trim()}
                    </blockquote>
                  );
                }
                if (paragraphBlock.match(/^\d+\./)) {
                  return (
                    <div key={pIdx} className="space-y-1.5 pl-2">
                      {paragraphBlock.split("\n").map((listItem, lIdx) => (
                        <p key={lIdx} className="pl-4 relative before:content-[attr(data-bullet)] before:absolute before:left-0 before:font-bold before:text-blue-900 dark:before:text-blue-400" data-bullet={listItem.match(/^\d+\./)?.[0] || "•"}>
                          {listItem.replace(/^\d+\.\s*/, "")}
                        </p>
                      ))}
                    </div>
                  );
                }
                return (
                  <p key={pIdx} dangerouslySetInnerHTML={{
                    __html: paragraphBlock
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-extrabold">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                  }} />
                );
              })}
            </div>

            {/* ── BASELINE UTILITY COMPONENT ACTION BAR STRIP ── */}
            {/* Equips students with copy controls, evaluation sentiment triggers, and iteration resets */}
            <div className="flex items-center gap-1 mt-4 pl-0.5 select-none animate-fade-in">
              
              {/* Option 1: Complete Markdown Structural Copy Trigger */}
              <button
                type="button"
                onClick={() => executeSystemTextCopy(msg.text, msg.id)}
                className="h-7 px-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 text-[10px] font-bold transition-all cursor-pointer focus:outline-none shadow-2xs"
                title="Copy structural tutor text markup parameters down to note apps"
              >
                <i className={`fas ${copyStatusTracker[msg.id] ? "fa-check text-emerald-500" : "fa-copy"}`} />
                <span>{copyStatusTracker[msg.id] ? "Copied Structure" : "Copy Response"}</span>
              </button>

              {/* Option 2: Positive Assessment sentiment click vector toggle */}
              <button
                type="button"
                onClick={() => handleToggleLikeSentiment(msg.id)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] transition-all cursor-pointer focus:outline-none shadow-2xs ${
                  likedMessages[msg.id]
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900/40 dark:text-emerald-400"
                    : "border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-slate-400 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400"
                }`}
                title="Verify accuracy by liking tutor text block"
              >
                <i class="fas fa-thumbs-up" />
              </button>

              {/* Option 3: Negative Assessment sentiment click vector toggle */}
              <button
                type="button"
                onClick={() => handleToggleDislikeSentiment(msg.id)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] transition-all cursor-pointer focus:outline-none shadow-2xs ${
                  dislikedMessages[msg.id]
                    ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-900/40 dark:text-red-400"
                    : "border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                }`}
                title="Flag structural anomalies by disliking tutor text block"
              >
                <i class="fas fa-thumbs-down" />
              </button>

              {/* Option 4: Response Matrix Restart Processing Token */}
              <button
                type="button"
                onClick={() => handleTriggerModelRegeneration(associatedUserPrompt)}
                className="h-7 px-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-slate-400 hover:text-blue-900 dark:text-slate-500 dark:hover:text-blue-400 flex items-center gap-1.5 text-[10px] font-bold transition-all cursor-pointer focus:outline-none shadow-2xs"
                title="Restart token generation queries loops for this prompt block"
              >
                <i class="fas fa-sync-alt text-[9px]" />
                <span>Restart Response</span>
              </button>

            </div>

          </div>
        );
      })}
    </div>
  );
}