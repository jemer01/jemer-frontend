"use client";
import React, { useState, useRef, useEffect } from "react";

export default function VidHistory({ onBack }) {
  const [logs, setLogs] = useState([
    { id: 1, title: "Advanced Quantum Mechanics - MIT Lecture", date: "Today", duration: "45:20", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", pinned: false },
    { id: 2, title: "Philosophy 101 - Ethics Explained", date: "Yesterday", duration: "1:12:05", thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg", pinned: false },
    { id: 3, title: "Biology Cellular Structures Documentary", date: "Oct 24", duration: "22:15", thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg", pinned: false },
    { id: 4, title: "Math Formulas Crash Course", date: "Oct 22", duration: "05:30", thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg", pinned: true },
    { id: 5, title: "Economics Market Trends 2024", date: "Oct 18", duration: "50:00", thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg", pinned: false },
  ]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const longPressTimer = useRef(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const sortedLogs = [...logs].sort((a,b) => {
    if(a.pinned===b.pinned) return b.id-a.id;
    return a.pinned? -1 : 1;
  });

  useEffect(() => {
    const handleClickOutside = (e) => { if(menuRef.current &&!menuRef.current.contains(e.target)) setActiveMenuId(null); };
    if(activeMenuId){ document.addEventListener("mousedown",handleClickOutside); document.addEventListener("touchstart",handleClickOutside); }
    return () => { document.removeEventListener("mousedown",handleClickOutside); document.removeEventListener("touchstart",handleClickOutside); };
  }, [activeMenuId]);

  const handleTouchStart = (e,id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    longPressTimer.current = setTimeout(()=>{ setMenuPosition({top: rect.top+48, left: Math.min(rect.left+rect.width-180, window.innerWidth-200)}); setActiveMenuId(id); },600);
  };
  const handleTouchEnd = () => { if(longPressTimer.current){ clearTimeout(longPressTimer.current); longPressTimer.current=null; } };
  const openMenu = (e,id) => { e.stopPropagation(); const rect=e.currentTarget.getBoundingClientRect(); setMenuPosition({top: rect.bottom+8, left: Math.min(rect.left-140, window.innerWidth-200)}); setActiveMenuId(id); };

  const togglePin = () => { setLogs(p=>p.map(l=>l.id===activeMenuId?{...l,pinned:!l.pinned}:l)); setActiveMenuId(null); };
  const openRename = () => { const log=logs.find(l=>l.id===activeMenuId); if(log){ setRenameValue(log.title); setRenamingId(activeMenuId); setRenameModalOpen(true);} setActiveMenuId(null); };
  const confirmRename = () => { if(renamingId && renameValue.trim()) setLogs(p=>p.map(l=>l.id===renamingId?{...l,title:renameValue.trim()}:l)); setRenameModalOpen(false); setRenamingId(null); setRenameValue(""); };
  const openDelete = () => { setDeletingId(activeMenuId); setDeleteModalOpen(true); setActiveMenuId(null); };
  const confirmDelete = () => { if(deletingId) setLogs(p=>p.filter(l=>l.id!==deletingId)); setDeleteModalOpen(false); setDeletingId(null); };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in p-4 sm:p-0 max-w-5xl mx-auto min-h-[calc(100vh-80px)] mt-6 sm:mt-8">
      <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-95">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
        <div><h3 className="font-black text-xl text-slate-900 dark:text-white">Video Archives</h3><p className="text- text-slate-500 font-mono uppercase tracking-widest">Past Video Transcriptions & Notes</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {sortedLogs.map((log)=>(
          <div key={log.id} onTouchStart={(e)=>handleTouchStart(e,log.id)} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchEnd} className={`group relative bg-white dark:bg-slate-900 border rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer ${log.pinned? "border-red-300 dark:border-red-800 ring-1 ring-red-200" : "border-slate-200 dark:border-slate-800"}`}>
            {log.pinned && <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 9h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z"/></svg></div>}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
              <img src={log.thumbnail} alt={log.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text- font-mono font-bold px-1.5 py-0.5 rounded">{log.duration}</div>
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0"><h4 className="font-bold text-sm truncate">{log.title}</h4><div className="flex items-center gap-2 mt-1"><span className="text- font-mono text-slate-500 uppercase">{log.date}</span><span className="w-1 h-1 bg-slate-300 rounded-full"></span><span className="text- font-mono text-slate-500">{log.duration}</span></div></div>
              <button onClick={(e)=>openMenu(e,log.id)} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
            </div>
          </div>
        ))}
        {sortedLogs.length===0 && <div className="col-span-full flex flex-col items-center py-16 text-slate-400 gap-3"><p className="text-sm font-medium">No video archives found.</p></div>}
      </div>

      {activeMenuId && (
        <>
          <div className="fixed inset-0 z-40" onClick={()=>setActiveMenuId(null)} />
          <div ref={menuRef} className="fixed z-50 w-44 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden" style={{top: menuPosition.top, left: menuPosition.left}}>
            <button onClick={togglePin} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800">{logs.find(l=>l.id===activeMenuId)?.pinned? "Unpin" : "Pin"}</button>
            <div className="h-px bg-slate-200 dark:bg-slate-700 mx-3"/>
            <button onClick={openRename} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800">Rename</button>
            <div className="h-px bg-slate-200 dark:bg-slate-700 mx-3"/>
            <button onClick={openDelete} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button>
          </div>
        </>
      )}

      {renameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setRenameModalOpen(false)}/>
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border p-6">
            <h4 className="text-sm font-black mb-1">Rename Video</h4><p className="text- text-slate-500 font-mono uppercase mb-4">Enter a new title below</p>
            <input type="text" value={renameValue} onChange={(e)=>setRenameValue(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && confirmRename()} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold focus:ring-2 focus:ring-red-500 mb-4" autoFocus/>
            <div className="grid grid-cols-2 gap-3"><button onClick={()=>setRenameModalOpen(false)} className="py-3 rounded-full border text-xs font-bold">Cancel</button><button onClick={confirmRename} className="py-3 rounded-full bg-red-600 text-white text-xs font-black uppercase">Save</button></div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setDeleteModalOpen(false)}/>
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border p-6 text-center">
            <h4 className="text-sm font-black mb-1">Delete Video?</h4><p className="text-xs text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3"><button onClick={()=>setDeleteModalOpen(false)} className="py-3 rounded-full border text-xs font-bold">Cancel</button><button onClick={confirmDelete} className="py-3 rounded-full bg-red-600 text-white text-xs font-black uppercase">Delete</button></div>
          </div>
        </div>
      )}
    </div>
  );
}