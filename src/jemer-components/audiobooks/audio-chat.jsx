"use client";

/**
 * ================================================================================================
 * 💬 JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS CHAT ENGINE (v6.0.0)
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: 100% Snap-Parity Architecture & Markdown Rendering Fix.
 * 1. DETERMINISTIC FULL-SCREEN TAKEOVER: Upgraded to match Snap Chat 100%. Replaced the mobile-sheet and desktop-sidebar with a `createPortal` architecture that injects directly into the `<main>` tag. It safely applies `display: none` to the background content and locks scroll, reserving 100% of the workspace strictly for the chat interface while preserving the global Navbar and Sidebar.
 * 2. MARKDOWN TEARDOWN FIX: Fixed the bug where "only the header shows up". The AI was wrapping responses in ````markdown ... ```` code blocks, which swallowed the body text. Upgraded `preprocessMarkdown` to safely strip rogue wrappers and parse all content correctly into standard prose.
 * 3. GLOBAL LATEX HARDENING: Ported over the exact KaTeX and LaTeX normalization engine from Snap Results, including function-based `$$` replacers, `overflow-x: auto` protection for long formulas, and `sanitizeMathUnicode` to prevent crashes on unsupported characters.
 * 4. MANIFESTO COMPLIANCE: Eradicated vibecoded gradients (replaced `bg-gradient-to-br` with solid `bg-indigo-600`), normalized all padding to the base-8 grid, enforced 48x48 touch targets, and unified the background surfaces.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: Ghost Cache Annihilation & Memory Purge.
 * ================================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

// 🚀 FIXED: Strips Unicode characters KaTeX's default font has no glyph metrics for inside math blocks
const sanitizeMathUnicode = (text) => {
  if (!text) return text;
  const clean = (s) => s
    .replace(/[\u2013\u2014]/g, '-')   // – — → hyphen
    .replace(/\u20A6/g, 'NGN')         // ₦ → NGN
    .replace(/[\u2018\u2019]/g, "'")   // curly single quotes
    .replace(/[\u201C\u201D]/g, '"');  // curly double quotes
  return text.replace(/\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g, (match, block, inline) =>
    block !== undefined ? `$$${clean(block)}$$` : `$${clean(inline)}$`
  );
};

export default function AudioChat({ isOpen, onClose, sessionID }) {
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

  // 🚀 FIXED: Deterministic Parent Scroll Lock & Layout Control
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
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      (activeOrigin.includes("jemerplatforms.company")
        ? "https://academy.jemerplatforms.company"
        : activeOrigin.includes("cloudshell.dev")
        ? "https://3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev"
        : "http://localhost:8080")
    );
  };

  const waitForJemerAuthReady = async (timeoutMs = 3000, pollIntervalMs = 100) => {
    const isReady = () =>
      typeof window !== "undefined" &&
      window.JemerAuth &&
      typeof window.JemerAuth.authenticatedFetch === "function";
    if (isReady()) return true;
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      if (isReady()) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isOpen) {
      setChatLog([]);
      setInputValue("");
      setErrorMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !sessionID || sessionID === "undefined" || sessionID === "null") return;

    const fetchHistory = async () => {
      setIsFetchingHistory(true);
      setErrorMsg(null);
      try {
        await waitForJemerAuthReady();
        const cacheBuster = `?t=${Date.now()}`;
        const res = await window.JemerAuth.authenticatedFetch(
          `${getBackendUrl()}/api/v1/audiobooks/history/${sessionID}/chat${cacheBuster}`
        );
        
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
    setChatLog((prev) => [...prev, tempUserMsg, tempAiMsg]);

    try {
      await waitForJemerAuthReady();
      const res = await window.JemerAuth.authenticatedFetch(
        `${getBackendUrl()}/api/v1/audiobooks/history/${sessionID}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText }),
        }
      );

      if (!res.ok) throw new Error("Network latency exceeded timeout thresholds.");

      const data = await res.json();

      setChatLog((prev) => {
        const newLog = [...prev];
        newLog.pop(); 
        newLog.push({ id: `msg-${Date.now()}`, role: "assistant", content: data.response });
        return newLog;
      });
    } catch (err) {
      setErrorMsg("Tutor failed to respond due to network latency. Please check your connection and resubmit your question.");
      setChatLog((prev) => {
        const newLog = [...prev];
        newLog.pop();
        return newLog;
      });
    } finally {
      setIsSending(false);
    }
  };

  // 🚀 FIXED: Comprehensive Markdown and LaTeX Preprocessing
  const preprocessMarkdown = (content) => {
    if (!content) return "";
    
    let processed = content
      .replace(/\r\n/g, "\n")
      .replace(/\*\*(#{1,6}\s+[^*]+)\*\*/g, '$1')
      .replace(/\*\*###\s+/g, '### ')
      .replace(/\*\*##\s+/g, '## ')
      .replace(/\*\*#\s+/g, '# ');

    processed = processed.replace(/```(?:math|latex|tex)\n([\s\S]*?)```/gi, (m, p1) => `\n$$\n${p1}\n$$\n`);
    
    // Strips rogue code blocks that swallow standard text
    processed = processed.replace(/```(?:plaintext|text|markdown)?\n?/gi, '').replace(/```/g, '');

    // Function-based replacements for DeepSeek LaTeX
    processed = processed.replace(/\\\[/g, () => '$$');     processed = processed.replace(/\\\]/g, () => '$$'); 
    processed = processed.replace(/\\\(/g, () => '$');     processed = processed.replace(/\\\)/g, () => '$');

    // Protect bare \begin environments
    processed = processed.replace(/(\\begin\{[a-z*]+\}[\s\S]*?\\end\{[a-z*]+\})/gi, (match) => {
      return `\n$$\n${match}\n$$\n`;
    }).replace(/\$\$\s*\n*\s*\$\$/g, '$$');

    processed = processed.replace(/([^\n])\n(#{1,6}\s+)/g, '$1\n\n$2');
    processed = processed.replace(/([^\n])\n([-*]\s+)/g, '$1\n\n$2');

    // Strip KaTeX hostile unicode
    processed = sanitizeMathUnicode(processed);

    return processed;
  };

  if (!isOpen) return null;

  // ── CORE UI RENDER ──
  const chatUI = (
    <div className="absolute inset-0 z-[200] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden animate-fade-in w-full h-full">
      
      {/* 🚀 DETERMINISTIC TAKEOVER ENGINE */}
      <style dangerouslySetInnerHTML={{__html: `
        main { overflow: hidden !important; }
        main > div:first-child { display: none !important; }
        .audio-chat-scroll::-webkit-scrollbar { width: 6px; }
        .audio-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .audio-chat-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .audio-chat-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
        /* Force KaTeX blocks to constrain perfectly within their parent width and scroll horizontally if needed */
        .prose-math .katex-display { 
          overflow-x: auto !important; 
          overflow-y: hidden !important; 
          max-width: 100% !important; 
          padding-top: 0.5em;
          padding-bottom: 0.5em;
        }
        .prose-math {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
      `}} />

      {/* ── HEADER (Unified Surface) ── */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 sm:px-8 flex items-center justify-center shrink-0 z-10">
        <div className="w-full max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M16 10h.01" />
                </svg>
             </div>
             <div className="flex flex-col">
               <h1 className="font-sans font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">Audiobook Tutor</h1>
               <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Context Synced
               </span>
             </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-600 focus:outline-none"
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

      {/* ── CHAT FEED (Unified Surface) ── */}
      <div className="flex-1 w-full overflow-y-auto audio-chat-scroll flex justify-center bg-slate-50 dark:bg-slate-950 relative">
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
               <p className="text-sm font-medium font-sans text-slate-500 max-w-md mx-auto">Submit a question below to analyze specific concepts, theories, or logical sequences within the audiobook transcript.</p>
            </div>
          ) : (
            chatLog.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[90%] sm:max-w-[75%] bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm text-[15px] font-medium break-words leading-relaxed">
                    {msg.content}
                  </div>
                ) : msg.isTyping ? (
                  <div className="max-w-[90%] sm:max-w-[75%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-sm flex items-center gap-3 text-sm font-bold text-slate-500">
                     <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Synthesizing data...
                  </div>
                ) : (
                  <div className="max-w-[95%] sm:max-w-[85%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl rounded-tl-sm text-[15px] text-slate-800 dark:text-slate-200 font-medium break-words leading-relaxed overflow-hidden">
                    <div className="prose-math overflow-x-auto audio-chat-scroll max-w-full">
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
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-1.5 transition-colors focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 flex items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              placeholder="Query transcript mechanics..." 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-2.5 text-[15px] text-slate-900 dark:text-white font-medium placeholder-slate-400 disabled:opacity-50"
            />
          </div>
          
          <button 
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="w-12 h-12 shrink-0 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 transition-colors flex items-center justify-center disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:pointer-events-none"
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