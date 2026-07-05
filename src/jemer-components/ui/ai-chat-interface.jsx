/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v4.5.0 - Premium UI/UX Polish & Z-Index Harmonization.
 * 1. Universal CSS Scrollbars: Ripped out native HTML scrollbars. Injected `.jemer-premium-scroll` 
 *    and applied it to the Inline Edit textarea, Feedback Modal textarea, and Reasoning Accordions 
 *    for a pristine, high-end feel.
 * 2. Skeleton Stream Indicator: Replaced the primitive "bouncing dots" with an enterprise-grade 
 *    animated shimmering text skeleton while the AI is generating/thinking.
 * 3. Context Harmonization: Cross-referenced the provided Navbar (z-30) and Sidebar (z-40) to 
 *    ensure the Feedback Modal (z-150) and popovers (z-20) perfectly respect the global stacking context.
 * ================================================================================================
 * 💬 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM AI TUTOR CHAT ARENA COMPONENT (v4.5.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

import React, { useState, useEffect, useRef } from "react"; 
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Imports the crash-proof global theme hook gateway
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx"; // Imports our master decoupled Markdown and Math rendering engine

/**
 * Advanced Markdown Pre-Processor
 * Scans the raw AI text line-by-line to perfectly isolate tables from standard paragraphs.
 * This guarantees that multiple tables generated close together render perfectly in our custom grids.
 */
const tokenizeBlocks = (text) => {
  if (!text) return []; 
  const lines = text.split('\n'); 
  const tokens = []; 
  let currentText = []; 
  let currentTable = []; 
  let inTable = false; 

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = line.trim().startsWith('|') && line.indexOf('|', 1) !== -1;

    if (isTableLine) {
      if (!inTable) {
        inTable = true; 
        if (currentText.length > 0) {
          tokens.push({ type: 'text', content: currentText.join('\n') });
          currentText = []; 
        }
      }
      currentTable.push(line); 
    } else {
      if (inTable) {
        inTable = false; 
        tokens.push({ type: 'table', content: currentTable.join('\n') });
        currentTable = []; 
      }
      currentText.push(line); 
    }
  }

  if (currentText.length > 0) tokens.push({ type: 'text', content: currentText.join('\n') });
  if (currentTable.length > 0) tokens.push({ type: 'table', content: currentTable.join('\n') });

  return tokens; 
};

export default function AIChatInterface({ 
  activeChatLog, 
  onInterruptedEdit, 
  onRegenerateResponse,
  isStreaming 
}) {
  const { theme } = useTheme(); 

  // Core application tracking elements state parameters
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [copyStatusTracker, setCopyStatusTracker] = useState({});
  const [likedMessages, setLikedMessages] = useState({});
  const [dislikedMessages, setDislikedMessages] = useState({});

  // Expansion and text draft edit pointers states handles
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editDraftText, setEditDraftText] = useState("");
  const [expandedPrompts, setExpandedPrompts] = useState({});
  const [expandedReasoning, setExpandedReasoning] = useState({});

  // FEEDBACK ENGINE STATE VARIABLES WITH AI CONTEXT
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); 
  const [activeFeedbackType, setActiveFeedbackType] = useState(null); 
  const [activeMessageId, setActiveMessageId] = useState(null); 
  const [activeMessageText, setActiveMessageText] = useState(""); 
  const [feedbackText, setFeedbackText] = useState(""); 
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false); 

  const messagesEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (isStreaming) setAutoScroll(false); 
    };
    window.addEventListener('wheel', handleUserInteraction);
    window.addEventListener('touchmove', handleUserInteraction);
    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
    };
  }, [isStreaming]);

  useEffect(() => {
    if (isStreaming) setAutoScroll(true);
  }, [isStreaming]);

  useEffect(() => {
    if (isStreaming && autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatLog, isStreaming, autoScroll]);

  const fallbackChatData = [
    { id: "mock-msg-1", sender: "user", text: "Explain how structural parameters dictate thermodynamics and system entropy boundaries.", isThinking: false, reasoning: "" },
    { id: "mock-msg-2", sender: "ai", text: `### Understanding System Entropy & Thermodynamic Boundaries\n\nIn structural physics and chemistry, **Entropy** serves as the mathematical metric tracking molecular disorder within an isolated system. To break this down step-by-step:\n\n1. **The Second Law Parameter:** Any natural thermodynamic sequence moves toward an escalated boundary of state chaos.\n2. **Structural Envelopes:** When matter undergoes conversion limits, the geometric alignment of system nodes dictates total heat capacity.\n\n| Concept | Definition | Impact |\n|---|---|---|\n| Entropy | Measure of disorder | Increases naturally |\n| Enthalpy | Total heat content | Dictates energy flow |\n\n> *Core Takeaway:* To suppress system entropy escalations, thermal input weights must cross matching structural threshold resistances.`, isThinking: false, reasoning: "" }
  ];

  const visibleMessages = (activeChatLog && activeChatLog.length > 0) ? activeChatLog : fallbackChatData;

  const executeSystemTextCopy = (textToCapture, messageId) => {
    navigator.clipboard.writeText(textToCapture).then(() => {
      setCopyStatusTracker((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopyStatusTracker((prev) => ({ ...prev, [messageId]: false }));
      }, 2000);
    }).catch((err) => {
      console.error("[CLIPBOARD LOCKOUT] Failed to commit text string to system memory registries:", err.message);
    });
  };

  // Capture full `msg` object to extract AI text payload for engineering review
  const handleToggleLikeSentiment = (msg) => {
    setActiveMessageId(msg.id);
    setActiveMessageText(msg.text); 
    setActiveFeedbackType("like");
    setFeedbackText(""); 
    setIsFeedbackModalOpen(true); 
  };

  const handleToggleDislikeSentiment = (msg) => {
    setActiveMessageId(msg.id);
    setActiveMessageText(msg.text); 
    setActiveFeedbackType("dislike");
    setFeedbackText(""); 
    setIsFeedbackModalOpen(true); 
  };

  const togglePromptExpansion = (id) => {
    setExpandedPrompts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleReasoningAccordion = (id) => {
    setExpandedReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startInlineEdit = (msg) => {
    setEditingMessageId(msg.id);
    setEditDraftText(msg.text);
  };

  const cancelInlineEdit = () => {
    setEditingMessageId(null);
    setEditDraftText("");
  };

  const saveInlineEdit = (msg) => {
    if (!editDraftText.trim()) return; 
    setEditingMessageId(null); 
    if (onRegenerateResponse) {
      onRegenerateResponse({ ...msg, text: editDraftText.trim() });
    }
  };

  // NEON REST DATA TABLE RECONCILIATION PIPE
  const handleSubmitFeedbackPayload = async (formEventContext) => {
    formEventContext.preventDefault(); 
    setIsSubmittingFeedback(true); 

    try {
      const activeJwtToken = localStorage.getItem("jemer_session_jwt"); 
      const userUuid = localStorage.getItem("jemer_user_uuid"); 

      if (!activeJwtToken || !userUuid) {
        throw new Error("Missing active session credentials tags. Please authenticate to lock records.");
      }

      const feedbackApiEndpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/ai-tutors-response-feedback`;

      const endpointNetworkResponse = await fetch(feedbackApiEndpoint, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeJwtToken}`, 
          "Prefer": "return=minimal" 
        },
        body: JSON.stringify({
          user_id: userUuid, 
          message_id: activeMessageId, 
          ai_response_text: activeMessageText, 
          sentiment: activeFeedbackType, 
          feedback_text: feedbackText.trim() 
        })
      });

      if (!endpointNetworkResponse || !endpointNetworkResponse.ok) {
        throw new Error(`Neon table interface rejected recording. Code status parameter: ${endpointNetworkResponse?.status || 'Null'}`);
      }

      if (activeFeedbackType === "like") {
        setLikedMessages((prev) => ({ ...prev, [activeMessageId]: true }));
        setDislikedMessages((prev) => ({ ...prev, [activeMessageId]: false }));
      } else {
        setDislikedMessages((prev) => ({ ...prev, [activeMessageId]: true }));
        setLikedMessages((prev) => ({ ...prev, [activeMessageId]: false }));
      }

      setIsFeedbackModalOpen(false); 
    } catch (criticalSyncFault) {
      console.error("[TELEMETRY DIRECT WRITE FAULT] Pipeline execution failed:", criticalSyncFault.message);
      alert(`Feedback Recording Drop Alert: ${criticalSyncFault.message}`);
    } finally {
      setIsSubmittingFeedback(false); 
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 py-6 select-none animate-fade-in relative">
      
      {/* 🚀 NEW UPGRADE: Universal Premium Scrollbar & Shimmer Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Premium custom scrollbar eradicating ugly HTML defaults */
        .jemer-premium-scroll::-webkit-scrollbar { width: 5px; height: 6px; }
        .jemer-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .jemer-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .jemer-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.5); }
        
        /* Shimmer Animation for Premium UI Loading State */
        @keyframes chatShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-chat-shimmer {
          background: linear-gradient(90deg, rgba(226,232,240,0.4) 25%, rgba(203,213,225,0.8) 50%, rgba(226,232,240,0.4) 75%);
          background-size: 200% 100%;
          animation: chatShimmer 1.5s infinite linear;
        }
        .dark .animate-chat-shimmer {
          background: linear-gradient(90deg, rgba(30,41,59,0.4) 25%, rgba(51,65,85,0.8) 50%, rgba(30,41,59,0.4) 75%);
        }
      `}} />

      {visibleMessages.map((msg, index) => {
        const isUserMessage = msg.sender === "user"; 

        if (isUserMessage) {
          const isEditing = editingMessageId === msg.id;
          const isExpanded = expandedPrompts[msg.id];
          const shouldTruncate = msg.text.length > 300;
          const displayText = shouldTruncate && !isExpanded ? msg.text.substring(0, 300) + "..." : msg.text;

          return (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
              onClick={() => setHoveredMessageId(hoveredMessageId === msg.id ? null : msg.id)} 
              className="w-full max-w-4xl mx-auto px-4 flex flex-col items-end relative group transition-all duration-150"
            >
              {isEditing ? (
                <div className="w-full max-w-[95%] sm:max-w-[85%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ring-2 ring-blue-600 rounded-3xl p-4 shadow-2xl flex flex-col gap-3 animate-fade-in">
                  <textarea
                    value={editDraftText}
                    onChange={(e) => {
                      setEditDraftText(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    // 🚀 NEW UPGRADE: Applied the jemer-premium-scroll class to the inline edit textarea
                    className="jemer-premium-scroll w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm sm:text-base font-sans font-medium outline-none resize-none leading-relaxed"
                    style={{ minHeight: "60px", maxHeight: "300px", overflowY: "auto" }}
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button onClick={cancelInlineEdit} className="px-4 py-2 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => saveInlineEdit(msg)} className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-95">
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className={`absolute -top-7 right-6 flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-1 rounded-xl shadow-sm z-20 transition-all duration-200 ${
                      hoveredMessageId === msg.id ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-95 pointer-events-none"
                    }`}
                  >
                    {!isStreaming && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          startInlineEdit(msg);
                        }}
                        className="w-6 h-6 rounded-md text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                        title="Edit this prompt"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        executeSystemTextCopy(msg.text, msg.id);
                      }}
                      className="w-6 h-6 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                      title="Copy prompt"
                    >
                      {copyStatusTracker[msg.id] ? (
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      )}
                    </button>
                  </div>

                  <div className="max-w-[85%] sm:max-w-[75%] bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/50 rounded-3xl rounded-tr-sm px-5 py-4 text-left shadow-md dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] group-hover:shadow-lg transition-shadow duration-200">
                    <p className="text-sm sm:text-base font-sans font-medium text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap break-words">
                      {displayText}
                    </p>
                    
                    {shouldTruncate && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); togglePromptExpansion(msg.id); }}
                        className="mt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                      >
                        {isExpanded ? "Show Less" : "See More"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        }

        const associatedUserPrompt = visibleMessages[index - 1] || visibleMessages[0]; 
        const isCurrentlyStreaming = msg.isThinking === true; 
        const internalReasoningText = msg.reasoning || "";
        const isReasoningExpanded = expandedReasoning[msg.id] || false;

        let stageWord = "Formulating approach...";
        if (isCurrentlyStreaming) {
          if (!internalReasoningText && !msg.text) stageWord = "Analyzing parameters...";
          else if (internalReasoningText && !msg.text) stageWord = "Synthesizing logic...";
          else stageWord = "Generating response...";
        }

        const responseTokens = tokenizeBlocks(msg.text);

        return (
          <div
            key={msg.id}
            className="w-full max-w-4xl mx-auto px-4 flex flex-col items-start text-left border-b border-slate-100/60 dark:border-slate-800/40 pb-6 animate-fade-in"
          >
            <div className="flex items-center gap-2 mb-2.5 select-none pl-1">
              <img 
                src="/assets/brand/jemer-logo.png" 
                alt="Jemer AI" 
                className="w-5 h-5 object-contain rounded-md shadow-inner shrink-0 bg-white" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Jemer AI Tutor
              </span>
            </div>

            {internalReasoningText.trim() !== "" && (
              <div className="w-full mb-4">
                <button 
                  onClick={() => toggleReasoningAccordion(msg.id)}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none pl-1"
                >
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isReasoningExpanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  <span>Thinking Process</span>
                </button>
                
                {isReasoningExpanded && (
                  // 🚀 NEW UPGRADE: Applied the jemer-premium-scroll class to the reasoning accordion box
                  <div className="jemer-premium-scroll mt-2 pl-3 border-l-2 border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1 bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-r-xl shadow-inner animate-fade-in max-h-[300px] overflow-y-auto">
                    <p className="whitespace-pre-line leading-relaxed break-words font-medium">
                      {internalReasoningText}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 🚀 NEW UPGRADE: Premium Shimmer Skeleton Loading Indicator */}
            {isCurrentlyStreaming && !msg.text.trim() && (
              <div className="w-full animate-fade-in space-y-3 mt-1 pl-1 max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-circle-notch fa-spin text-blue-500 text-[10px]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{stageWord}</span>
                </div>
                <div className="w-[85%] h-4 rounded-md animate-chat-shimmer" />
                <div className="w-[100%] h-4 rounded-md animate-chat-shimmer" />
                <div className="w-[60%] h-4 rounded-md animate-chat-shimmer" />
              </div>
            )}

            <div className="w-full text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-sans font-medium space-y-3 pl-1 break-words">
              {responseTokens.map((token, tIdx) => {
                
                if (token.type === "table") {
                  const tableLines = token.content.split('\n').map(l => l.trim()).filter(Boolean);
                  if (tableLines.length < 2) return null; 

                  const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
                  
                  let dataStartIndex = 1;
                  if (tableLines[1] && tableLines[1].replace(/[-:| ]/g, '') === '') {
                    dataStartIndex = 2;
                  }
                  
                  const bodyLines = tableLines.slice(dataStartIndex).map(line => line.split('|').filter(Boolean).map(c => c.trim()));

                  return (
                    // 🚀 NEW UPGRADE: Replaced custom-table-scroll with our global jemer-premium-scroll
                    <div key={`table-${tIdx}`} className="jemer-premium-scroll w-full overflow-x-auto my-5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                      <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                          <tr>
                            {headers.map((h, i) => (
                              <th key={i} className="p-3 border-b border-slate-200 dark:border-slate-700/60 font-bold whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-950/50">
                          {bodyLines.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              {row.map((cell, j) => (
                                <td key={j} className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                                  <span dangerouslySetInnerHTML={{
                                    __html: cell
                                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-extrabold">$1</strong>')
                                      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                                  }} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (token.type === "text") {
                  return (
                    <div key={`text-${tIdx}`} className="w-full animate-fade-in transition-all duration-200">
                      <MarkdownRenderer text={token.content} />
                    </div>
                  );
                }
              })}
            </div>

            <div className={`flex items-center gap-2 mt-5 pl-1 select-none animate-fade-in transition-opacity duration-200 ${isCurrentlyStreaming ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
              
              <button
                type="button"
                onClick={() => handleToggleLikeSentiment(msg)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
                  likedMessages[msg.id]
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 shadow-xs border border-emerald-200/40"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent dark:border-slate-700/60"
                }`}
                title="Good response"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
              </button>

              <button
                type="button"
                onClick={() => handleToggleDislikeSentiment(msg)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
                  dislikedMessages[msg.id]
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 shadow-xs border border-rose-200/40"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent dark:border-slate-700/60"
                }`}
                title="Bad response"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2a2 2 0 012 2v7a2 2 0 01-2 2h-2"/></svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onRegenerateResponse) onRegenerateResponse(associatedUserPrompt);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent dark:border-slate-700/60 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                title="Regenerate response"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </button>

              <button
                type="button"
                onClick={() => executeSystemTextCopy(msg.text, msg.id)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent dark:border-slate-700/60 flex items-center justify-center transition-all cursor-pointer focus:outline-none relative"
                title="Copy response"
              >
                {copyStatusTracker[msg.id] ? (
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                )}
              </button>
            </div>

          </div>
        );
      })}
      
      <div ref={messagesEndRef} className="h-1 w-full" />

      {/* 🚀 Z-INDEX HARMONIZATION: Modal locked to z-[150] to clear Navbar (z-30) and Sidebar (z-40) */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/30 dark:bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center transition-all duration-300 p-0 md:p-6">
          
          <div 
            onClick={() => setIsFeedbackModalOpen(false)} 
            className="absolute inset-0 bg-transparent cursor-pointer" 
          />

          <div className="w-full md:max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t md:border border-slate-200/50 dark:border-slate-700/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl flex flex-col justify-between z-10 select-none font-sans h-[75vh] md:h-auto rounded-t-[40px] md:rounded-[32px] animate-slide-up overflow-hidden">
            
            <div className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0">
               <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>

            <form onSubmit={handleSubmitFeedbackPayload} className="flex-1 flex flex-col justify-between h-full w-full">
              
              <div className="px-5 md:px-6 pt-2 pb-4 text-left shrink-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shadow-inner ${
                      activeFeedbackType === "like" 
                        ? "bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 dark:from-emerald-900/50 dark:to-teal-900/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50" 
                        : "bg-gradient-to-br from-rose-100 to-red-50 text-rose-600 dark:from-rose-900/50 dark:to-red-900/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50"
                    }`}>
                      <i className={`fas ${activeFeedbackType === "like" ? "fa-thumbs-up" : "fa-thumbs-down"} text-sm`} />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        {activeFeedbackType === "like" ? "Share Your Success Story" : "Help Us Optimize Pacing"}
                      </h3>
                      <p className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                        Jemer Core Analytics Registry
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    <i className="fas fa-times text-xs" />
                  </button>
                </div>
              </div>

              <div className="px-5 md:px-6 pb-2 shrink-0">
                 {/* 🚀 NEW UPGRADE: Applied jemer-premium-scroll to the preview box to handle extremely long AI text beautifully */}
                 <div className="jemer-premium-scroll p-3.5 bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 font-mono italic shadow-inner relative max-h-[80px] overflow-y-auto">
                   <div className="absolute top-2 right-3 text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">AI Snippet</div>
                   <span className="pr-6 leading-relaxed">"{activeMessageText}"</span>
                 </div>
              </div>

              <div className="flex-1 px-5 md:px-6 pb-4 flex flex-col justify-start text-left min-h-0">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 pl-1">
                  Qualitative Student Commentary (Optional)
                </label>
                <textarea
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    activeFeedbackType === "like"
                      ? "What made this great? Was the analogy perfect? Did the code structure click? Let our strategy team know..."
                      : "What went sideways? Did the tutor hallucinate parameters, overcomplicate the physics equation, or drop detail tracks? Tell us how to fix it..."
                  }
                  // 🚀 NEW UPGRADE: Applied jemer-premium-scroll class to the feedback input box
                  className="jemer-premium-scroll w-full flex-1 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm font-medium placeholder-slate-400 rounded-[20px] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 transition-all leading-relaxed resize-none font-sans shadow-sm"
                />
              </div>

              <div className="px-5 md:px-6 py-4 border-t border-slate-100 dark:border-slate-800/50 shrink-0 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                    activeFeedbackType === "like"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20"
                      : "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-500/20"
                  } disabled:opacity-40 disabled:pointer-events-none`}
                >
                  {isSubmittingFeedback ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-1" />
                      <span>Logging Metrics...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Logs</span>
                      <i className="fas fa-paper-plane text-[10px]" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}