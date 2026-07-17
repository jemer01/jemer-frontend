"use client";
import React, { useState } from "react";

export default function VidChat({ onBack }) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, role: "ai", text: "Hi! I just generated the study notes from your YouTube video. Do you want me to quiz you on this material, or do you have specific questions about the video content?" }
  ]);

  const handleSend = () => {
    if(!inputText.trim()) return;
    const userMessage = { id: Date.now(), role: "user", text: inputText };
    setMessages(prev=>[...prev, userMessage]);
    setInputText("");
    setTimeout(()=>{ setMessages(prev=>[...prev, { id: Date.now()+1, role:"ai", text: "Great question! Based on the video transcript, I can help you understand that concept better. The key point here is that the video explains..."}]); },1000);
  };
  const handleKeyPress = (e) => { if(e.key==="Enter") handleSend(); };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded- shadow-2xl overflow-hidden animate-slide-up">
      <div className="p-4 border-b flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-95">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </div>
          <div><h3 className="font-black text- leading-none">Video Tutor</h3><p className="text- text-slate-500 font-mono uppercase mt-1">AI • YouTube Context</p></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
        {messages.map((msg)=>(
          <div key={msg.id} className={`flex ${msg.role==="user"? "justify-end":"justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role==="user"? "bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-tr-sm" : "bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-200 rounded-tl-sm"}`}>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white dark:bg-slate-900 shrink-0">
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="bg-slate-50 dark:bg-slate-950 border rounded-2xl p-2 flex items-center shadow-inner focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-400">
            <input type="text" value={inputText} onChange={(e)=>setInputText(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask a question about the video..." className="w-full bg-transparent border-none focus:outline-none p-2 text-sm font-medium placeholder-slate-400"/>
            <button onClick={handleSend} disabled={!inputText.trim()} className="w-10 h-10 shrink-0 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg active:scale-95 ml-2 disabled:opacity-50"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button>
          </div>
          <p className="text- text-slate-400 font-mono uppercase text-center mt-2">AI tutor uses video transcript as context</p>
        </div>
      </div>
    </div>
  );
}