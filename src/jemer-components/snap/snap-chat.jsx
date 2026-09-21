"use client";

/**
 * ================================================================================================
 * 💬 JEMER ACADEMY DESIGN SYSTEM — SNAP CHAT ENGINE (v7.0.0)
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Unified Surfaces, Professional Flattening & Maximized Viewport.
 * 1. UNIFIED COLOR PALETTE: Eliminated the mismatched header and footer shades. The entire component (Header, Chat Feed, Footer) now uses a single, unbroken solid surface (`bg-slate-50 dark:bg-slate-950`) to create a seamless, professional layout.
 * 2. ANTI-VIBECODING & PROFESSIONALISM: Stripped all decorative drop shadows (`shadow-sm`, `shadow-[0_-4px...]`) and pulse animations. Relying strictly on 1px borders (`border-slate-200 dark:border-slate-800`) to define structural hierarchy per the Synthetic Interface Manifesto.
 * 3. MAXIMIZED MESSAGE AREA: Reduced unnecessary vertical padding in the Header (`py-3`) and flattened the input footer to strictly prioritize maximum vertical real estate for the `flex-1` chat feed column.
 * ================================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

export default function SnapChat({ isOpen, onClose, sessionID }) {
  const [mounted, setMounted] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Forces the `<main>` container to lock its scroll and jump to the top
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (isOpen && mainEl) {
      mainEl.style.overflow = 'hidden';
      mainEl.scrollTop = 0; 
    }
    return () => {
      if (mainEl) mainEl.style.overflow = '';
    };
  }, [isOpen]);

  const getBackendUrl = () => {
    const activeOrigin = typeof window !== "undefined" ? window.location.origin : "";
    return process.env.NEXT_PUBLIC_API_URL ||
      (activeOrigin.includes("jemerplatforms.company") ? "https://academy.jemerplatforms.company" :
       activeOrigin.includes("cloudshell.dev") ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev" :
       "http://localhost:8080");
  };

  const waitForJemerAuthReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
    const isReady = () => typeof window !== "undefined" && window.JemerAuth && typeof window.JemerAuth.authenticatedFetch === "function";
    if (isReady()) return true;
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      if (isReady()) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isOpen || !sessionID) return;

    const fetchHistory = async () => {
      setIsFetchingHistory(true);
      setErrorMsg(null);
      try {
        await waitForJemerAuthReady();
        const res = await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/snap/history/${sessionID}/chat`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setChatLog(data);
          } else {
            setChatLog([]);
          }
        }
      } catch (err) {
        console.error("System Fault: Context sync failed.", err);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    fetchHistory();
  }, [isOpen, sessionID]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatLog, isSending]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const promptText = inputValue.trim();
    setInputValue("");
    setErrorMsg(null);
    setIsSending(true);

    const tempUserMsg = { id: `temp-u-${Date.now()}`, role: "user", content: promptText };
    const tempAiMsg = { id: `temp-a-${Date.now()}`, role: "assistant", isTyping: true };
    setChatLog(prev => [...prev, tempUserMsg, tempAiMsg]);

    try {
      await waitForJemerAuthReady();
      const res = await window.JemerAuth.authenticatedFetch(`${getBackendUrl()}/api/v1/snap/history/${sessionID}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!res.ok) throw new Error("Network latency exceeded timeout thresholds.");
      
      const data = await res.json();
      
      setChatLog(prev => {
        const newLog = [...prev];
        newLog.pop(); 
        newLog.push({ id: `msg-${Date.now()}`, role: "assistant", content: data.response });
        return newLog;
      });

    } catch (err) {
      setErrorMsg("Tutor failed to respond due to network latency. Please check your connection and resubmit your question.");
      setChatLog(prev => {
        const newLog = [...prev];
        newLog.pop(); 
        return newLog;
      });
    } finally {
      setIsSending(false);
    }
  };

  const preprocessMarkdown = (content) => {
    if (!content) return "";
    let processed = content
      .replace(/\\\[/g, '$$$')       .replace(/\\\]/g, '$$$')
      .replace(/\\\(/g, '$')       .replace(/\\\)/g, '$');
    return processed;
  };

  if (!isOpen) return null;

  // ── CORE UI RENDER ──
  const chatUI = (
    <div className="absolute inset-0 z-[200] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden animate-fade-in w-full h-full">
      
      <style dangerouslySetInnerHTML={{__html: `
        main { overflow: hidden !important; }
        main > div:first-child { display: none !important; }
        .chat-scroll::-webkit-scrollbar { width: 6px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
      `}} />

      {/* ── HEADER (Unified Surface & Condensed Height) ── */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 sm:px-8 flex items-center justify-center shrink-0 z-10">
        <div className="w-full max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 18V5"/>
                  <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/>
                  <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/>
                  <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/>
                  <path d="M18 18a4 4 0 0 0 2-7.464"/>
                  <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/>
                  <path d="M6 18a4 4 0 0 1-2-7.464"/>
                  <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>
                </svg>
             </div>
             <div className="flex flex-col">
               <h1 className="font-sans font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">Tutor Analysis Session</h1>
               <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Context Synced
               </span>
             </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none"
            aria-label="Terminate Session"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="w-full bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm font-medium px-4 py-3 text-center shrink-0">
          {errorMsg}
        </div>
      )}

      {/* ── CHAT FEED (Unified Surface & Expanded Height) ── */}
      <div className="flex-1 w-full overflow-y-auto chat-scroll flex justify-center bg-slate-50 dark:bg-slate-950 relative">
        <div className="w-full max-w-4xl p-4 sm:p-6 space-y-6">
          {isFetchingHistory ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-70 pt-16">
               <svg className="w-6 h-6 text-slate-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Initializing Structure...</span>
            </div>
          ) : chatLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 pt-16">
               <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center mb-5">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                 </svg>
               </div>
               <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Diagnostic Ready</h2>
               <p className="text-sm font-medium font-sans text-slate-500 max-w-md mx-auto">Submit a question below to query specific steps, formulas, or logical operations within the generated solution.</p>
            </div>
          ) : (
            chatLog.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[90%] sm:max-w-[75%] bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm text-[15px] font-medium break-words leading-relaxed">
                    {msg.content}
                  </div>
                ) : msg.isTyping ? (
                  <div className="max-w-[90%] sm:max-w-[75%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-sm flex items-center gap-3 text-sm font-bold text-slate-500">
                     <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Synthesizing data...
                  </div>
                ) : (
                  <div className="max-w-[95%] sm:max-w-[85%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl rounded-tl-sm text-[15px] text-slate-800 dark:text-slate-200 font-medium break-words leading-relaxed overflow-hidden">
                    <div className="prose-math overflow-x-auto chat-scroll max-w-full">
                      <MarkdownRenderer text={preprocessMarkdown(msg.content)} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* ── INPUT AREA (Unified Surface) ── */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0 flex justify-center z-10 pb-safe">
        <form onSubmit={handleSend} className="relative w-full max-w-4xl flex items-center gap-3">
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-1.5 transition-colors focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              placeholder="Query solution mechanics..." 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-2.5 text-[15px] text-slate-900 dark:text-white font-medium placeholder-slate-400 disabled:opacity-50"
            />
          </div>
          
          <button 
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="w-12 h-12 shrink-0 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-colors flex items-center justify-center disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:pointer-events-none"
            aria-label="Submit Query"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>

    </div>
  );

  // ── PORTAL MOUNTING ENGINE ──
  if (mounted) {
    const mainNode = document.querySelector('main');
    if (mainNode) {
      return createPortal(chatUI, mainNode);
    }
  }

  return chatUI;
}