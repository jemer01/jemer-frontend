"use client";

/**
 * ================================================================================================
 * 💬 JEMER ACADEMY DESIGN SYSTEM — SNAP CHAT ENGINE (v4.6.0)
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Desktop Fixed Alignment & LaTeX Preprocessor Injection.
 * 1. FIXED VIEWPORT ALIGNMENT: Upgraded desktop container from `absolute` to `fixed top-0 right-0 z-[100] h-[100dvh]`. 
 *    This completely detaches it from document scroll flow. It now spans cleanly over the navbar and stays permanently locked to the right side of the screen regardless of how far down the user scrolls.
 * 2. LATEX NORMALIZATION: Hooked the `preprocessMarkdown` regex directly into the chat message rendering loop. DeepSeek's math arrays now format flawlessly via KaTeX.
 * 3. AESTHETIC POLISH: Enhanced padding and borders to deliver a truly pro-level split-pane look.
 * ================================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

export default function SnapChat({ isOpen, onClose, sessionID }) {
  const [isMobileView, setIsMobileView] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const messagesEndRef = useRef(null);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const executeViewportAudit = () => setIsMobileView(window.innerWidth < 1024);
    executeViewportAudit();
    window.addEventListener("resize", executeViewportAudit);
    return () => window.removeEventListener("resize", executeViewportAudit);
  }, []);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientY);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientY);
  const handleTouchEndAction = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    if (distance > 75) onClose();
    setTouchStart(0);
    setTouchEnd(0);
  };

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
        console.error("Failed to load chat history:", err);
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

      if (!res.ok) throw new Error("Tutor failed to respond.");
      
      const data = await res.json();
      
      setChatLog(prev => {
        const newLog = [...prev];
        newLog.pop(); 
        newLog.push({ id: `msg-${Date.now()}`, role: "assistant", content: data.response });
        return newLog;
      });

    } catch (err) {
      setErrorMsg("Network error: Tutor failed to respond.");
      setChatLog(prev => {
        const newLog = [...prev];
        newLog.pop(); 
        return newLog;
      });
    } finally {
      setIsSending(false);
    }
  };

  // 🚀 FIXED: DeepSeek Markdown Preprocessor for Chat
  const preprocessMarkdown = (content) => {
    if (!content) return "";
    let processed = content
      .replace(/\\\[/g, '$$$')
      .replace(/\\\]/g, '$$$')
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');
    return processed;
  };

  if (!isOpen) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes chatSheetSlide { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes chatPanelRightSlide { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-chat-sheet { animation: chatSheetSlide 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-chat-panel-right { animation: chatPanelRightSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.5); }
      `}} />

      {/* 📡 UNIVERSAL TRANSLUCENT BACKDROP DIM OVERLAY */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/20 dark:bg-black/40 backdrop-blur-sm z-[90] transition-all duration-300"
        />
      )}

      {/* 🚀 FIXED: Desktop transforms into a full-height right-aligned side panel permanently anchored to the screen edge */}
      <div
        onTouchStart={isMobileView ? handleTouchStart : undefined}
        onTouchMove={isMobileView ? handleTouchMove : undefined}
        onTouchEnd={isMobileView ? handleTouchEndAction : undefined}
        className={`bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-all duration-300 shadow-2xl dark:shadow-[0_0_60px_rgba(0,0,0,0.6)] ${
          isMobileView
            ? "fixed bottom-0 left-0 right-0 h-[85vh] z-[100] rounded-t-[40px] border-t border-slate-200/90 dark:border-slate-800 animate-chat-sheet overflow-hidden"
            : "fixed top-0 right-0 z-[100] w-[400px] lg:w-[450px] xl:w-[500px] h-[100dvh] rounded-none border-l border-slate-200 dark:border-slate-800 animate-chat-panel-right overflow-hidden"
        }`}
      >
        
        {isMobileView && <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-4 shrink-0" />}

        {/* Header */}
        <div className={`px-6 py-5 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-slate-800 ${isMobileView ? "mt-2" : ""}`}>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
             <div>
               <h3 className="font-black text-base tracking-tight text-slate-900 dark:text-white leading-none">Jemer Tutor</h3>
               <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Analyzing Snap
               </span>
             </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-500 focus:outline-none">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-[11px] font-bold px-4 py-2.5 rounded-xl text-center shadow-sm animate-fade-in shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto chat-scroll p-6 space-y-5 bg-white/40 dark:bg-slate-950/40">
          {isFetchingHistory ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
               <svg className="w-7 h-7 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">Syncing Context...</span>
            </div>
          ) : chatLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50 px-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
               </svg>
               <p className="text-sm font-medium font-sans text-slate-600 dark:text-slate-400">Have a question about the solution? Ask the tutor below.</p>
            </div>
          ) : (
            chatLog.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] bg-blue-600 text-white p-4 rounded-3xl rounded-tr-sm text-[15px] font-medium shadow-sm break-words leading-relaxed">
                    {msg.content}
                  </div>
                ) : msg.isTyping ? (
                  <div className="max-w-[85%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-3 text-xs font-bold text-slate-500">
                     <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Tutor is thinking...
                  </div>
                ) : (
                  <div className="max-w-[95%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl rounded-tl-sm text-[15px] text-slate-800 dark:text-slate-200 shadow-sm font-medium break-words leading-relaxed overflow-hidden">
                    <div className="prose-math overflow-x-auto chat-scroll max-w-full">
                      {/* 🚀 FIXED: DeepSeek formatting injected securely into Markdown renderer */}
                      <MarkdownRenderer text={preprocessMarkdown(msg.content)} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0 pb-safe">
          <form onSubmit={handleSend} className="relative w-full flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-1.5 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              placeholder="Ask a follow-up question..." 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-2.5 text-[15px] text-slate-900 dark:text-white font-medium placeholder-slate-400 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="w-11 h-11 shrink-0 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </form>
        </div>

      </div>
    </>
  );
}