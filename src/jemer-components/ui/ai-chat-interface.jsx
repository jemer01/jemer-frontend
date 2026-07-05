/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.6.0 UI/UX Production Fixes.
 * 1. Dark Mode Harmonization: Replaced all hardcoded hex colors with native Tailwind `slate` scales (e.g., `dark:bg-slate-800`) to guarantee a beautiful dark mode.
 * 2. Pure SVG Engine: Stripped out unreliable FontAwesome classes and replaced all icons (Edit, Copy, Thumbs, Restart, Chevron) with crisp, inline SVGs.
 * 3. Table Overhaul: Upgraded the markdown parser to handle infinite multiple tables flawlessly. Wrapped tables in a custom `.custom-table-scroll` class for elegant sideways swiping.
 * 4. Branding & Geometry: Replaced the dummy "J" with the authentic Jemer Academy logo. Upgraded user bubbles to `rounded-3xl rounded-tr-sm` for a premium chat-tail look. Removed the "More" action button.
 * ================================================================================================
 * 💬 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM AI TUTOR CHAT ARENA COMPONENT (v2.6.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef } from "react"; 
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; 

export default function AIChatInterface({ 
  activeChatLog, 
  onInterruptedEdit, 
  onRegenerateResponse,
  isStreaming 
}) {
  const { theme } = useTheme();

  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [copyStatusTracker, setCopyStatusTracker] = useState({});
  const [likedMessages, setLikedMessages] = useState({});
  const [dislikedMessages, setDislikedMessages] = useState({});

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editDraftText, setEditDraftText] = useState("");
  const [expandedPrompts, setExpandedPrompts] = useState({});
  const [expandedReasoning, setExpandedReasoning] = useState({});

  const messagesEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Monitor user interaction to cancel auto-scroll if they try to read up
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

  // Re-enable auto-scroll automatically when a new stream starts
  useEffect(() => {
    if (isStreaming) setAutoScroll(true);
  }, [isStreaming]);

  // Execute the smooth scroll
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

  const handleToggleLikeSentiment = (messageId) => {
    setLikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
    setDislikedMessages((prev) => ({ ...prev, [messageId]: false })); 
  };

  const handleToggleDislikeSentiment = (messageId) => {
    setDislikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
    setLikedMessages((prev) => ({ ...prev, [messageId]: false })); 
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

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 py-6 select-none animate-fade-in">
      
      {/* 🚀 UPGRADE: Custom sleek CSS scrollbar for tables */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-table-scroll::-webkit-scrollbar { height: 6px; }
        .custom-table-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-table-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .custom-table-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.5); }
      `}} />

      {visibleMessages.map((msg, index) => {
        const isUserMessage = msg.sender === "user"; 

        // ── USER MESSAGE INTERACTIVE ROW CONTAINER ──────────────────────────────────────────────
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
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm sm:text-base font-sans font-medium outline-none resize-none leading-relaxed"
                    style={{ minHeight: "60px", maxHeight: "300px", overflowY: "auto" }}
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button onClick={cancelInlineEdit} className="px-4 py-2 rounded-full text-xs font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
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

                  {/* 🚀 UPGRADE: Advanced geometry - rounded-3xl with a sharp tail (rounded-tr-sm) and deep shadow */}
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

        // ── AI MODEL RESPONSE VIEWPORT CONTAINER ────────────────────────────────────────────────
        const associatedUserPrompt = visibleMessages[index - 1] || visibleMessages[0]; 
        const isCurrentlyStreaming = msg.isThinking === true; 
        const internalReasoningText = msg.reasoning || "";
        const isReasoningExpanded = expandedReasoning[msg.id] || false;

        let stageWord = "Formulating approach...";
        if (isCurrentlyStreaming) {
          if (!internalReasoningText && !msg.text) stageWord = "Analyzing...";
          else if (internalReasoningText && !msg.text) stageWord = "Thinking...";
          else stageWord = "Replying...";
        }

        return (
          <div
            key={msg.id}
            className="w-full max-w-4xl mx-auto px-4 flex flex-col items-start text-left border-b border-slate-100/60 dark:border-slate-800/40 pb-6 animate-fade-in"
          >
            <div className="flex items-center gap-2 mb-2.5 select-none pl-1">
              {/* 🚀 UPGRADE: Authentic Corporate Branding Image */}
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
                  <div className="mt-2 pl-3 border-l-2 border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1 bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-r-xl shadow-inner animate-fade-in max-h-[300px] overflow-y-auto custom-table-scroll">
                    <p className="whitespace-pre-line leading-relaxed break-words font-medium">
                      {internalReasoningText}
                    </p>
                  </div>
                )}
              </div>
            )}

            {isCurrentlyStreaming && !msg.text.trim() && (
              <div className="text-xs font-sans font-bold text-slate-500 dark:text-slate-400 pl-1 py-2 flex items-center gap-2 select-none animate-fade-in">
                <span className="flex gap-1 items-center h-full pt-1">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                </span>
                <span className="ml-1 tracking-wide">{stageWord}</span>
              </div>
            )}

            <div className="w-full text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-sans font-medium space-y-3 pl-1 break-words">
              {msg.text.split("\n\n").map((paragraphBlock, pIdx) => {
                if (!paragraphBlock.trim()) return null;

                // 🚀 UPGRADE: Robust Multi-Table Engine
                if (paragraphBlock.trim().startsWith("|") && paragraphBlock.indexOf("|-") !== -1) {
                  const tableLines = paragraphBlock.trim().split("\n").filter(l => l.trim().startsWith("|"));
                  
                  if (tableLines.length >= 2) {
                    const headers = tableLines[0].split("|").filter(Boolean).map(h => h.trim());
                    const bodyLines = tableLines.slice(2).map(line => line.split("|").filter(Boolean).map(c => c.trim()));

                    return (
                      <div key={pIdx} className="w-full overflow-x-auto custom-table-scroll my-5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
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
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }

                const headerMatch = paragraphBlock.match(/^(#{1,4})\s(.*)/);
                if (headerMatch) {
                  const level = headerMatch[1].length;
                  const content = headerMatch[2];
                  const Tag = `h${level}`;
                  const sizes = { 1: "text-2xl", 2: "text-xl", 3: "text-lg", 4: "text-base" };
                  return (
                    <Tag key={pIdx} className={`${sizes[level]} font-display font-extrabold text-slate-900 dark:text-white tracking-tight pt-3 pb-1`}>
                      {content.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </Tag>
                  );
                }

                if (paragraphBlock.startsWith(">")) {
                  return (
                    <blockquote key={pIdx} className="border-l-4 border-purple-500/60 bg-purple-50/40 dark:bg-purple-900/20 px-4 py-3 rounded-r-xl text-sm italic font-medium text-purple-900 dark:text-purple-300 my-2 shadow-inner">
                      {paragraphBlock.replace(/^>\s*/gm, "").trim()}
                    </blockquote>
                  );
                }

                if (paragraphBlock.match(/^[-*]\s/m) || paragraphBlock.match(/^\d+\.\s/m)) {
                  return (
                    <div key={pIdx} className="space-y-2 pl-2 my-2">
                      {paragraphBlock.split("\n").map((listItem, lIdx) => {
                        const isOrdered = listItem.match(/^\d+\.\s/);
                        const bullet = isOrdered ? listItem.match(/^\d+\./)[0] : "•";
                        return (
                          <p key={lIdx} className="pl-5 relative before:content-[attr(data-bullet)] before:absolute before:left-0 before:font-bold before:text-blue-600 dark:before:text-blue-400" data-bullet={bullet}>
                            <span dangerouslySetInnerHTML={{
                              __html: listItem.replace(/^[-*]\s|^\d+\.\s/, "")
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-extrabold">$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                            }} />
                          </p>
                        );
                      })}
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

            {/* 🚀 UPGRADE: Pure SVG Action Strip with strictly mapped Slate dark mode borders */}
            <div className={`flex items-center gap-2 mt-5 pl-1 select-none animate-fade-in transition-opacity duration-200 ${isCurrentlyStreaming ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
              
              <button
                type="button"
                onClick={() => handleToggleLikeSentiment(msg.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
                  likedMessages[msg.id]
                    ? "bg-slate-200 text-slate-900 dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent dark:border-slate-700/60"
                }`}
                title="Good response"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
              </button>

              <button
                type="button"
                onClick={() => handleToggleDislikeSentiment(msg.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
                  dislikedMessages[msg.id]
                    ? "bg-slate-200 text-slate-900 dark:bg-slate-100 dark:text-slate-900 shadow-sm"
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
    </div>
  );
}