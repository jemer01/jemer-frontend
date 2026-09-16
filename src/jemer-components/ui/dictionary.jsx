"use client";

/**
 * [NEW UPGRADE]
 * SUMMARY: v1.5.0 UI/UX Polishing, Engine Expansion & Audio Synthesis
 * 1. NATIVE AUDIO SYNTHESIS: Replaced the missing Wikimedia audio files with the browser's native `window.speechSynthesis` API. This guarantees 100% audio coverage for every word searched, without relying on external media files.
 * 2. HYDRATION GLITCH FIX: The "half open" flash was caused by `isMobileView` defaulting to `false` during SSR hydration, rendering the desktop dropdown for a millisecond before the `useEffect` caught the mobile screen size. Added a `mounted` state shield to delay rendering until the viewport is accurately measured.
 * 3. ENGINE EXPANSION (DATAMUSE TRIPLE-FETCH): Upgraded the Datamuse fallback to fetch three parallel datasets: Synonyms (`rel_syn`), Antonyms (`rel_ant`), and Rhymes (`rel_rhy`).
 * 4. RICH UI CHIPS: Mapped the new Antonyms and Rhymes data into the UI using distinct color-coded chips (Rose for Antonyms, Purple for Rhymes) to provide a vastly richer, more comprehensive lexicon experience.
 * ================================================================================================
 * 📖 JEMER ACADEMY DICTIONARY ENGINE (v1.5.0)
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";

export default function Dictionary({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false); // 🚀 FIXED: Prevents the hydration layout shift glitch
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dictData, setDictData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Swipe-to-close logic
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const executeViewportAudit = () => setIsMobileView(window.innerWidth < 768);
    executeViewportAudit();
    setMounted(true); // Reveal component only after viewport is known
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

  const handleSearch = async (e, overrideWord) => {
    if (e && e.preventDefault) e.preventDefault();

    const rawTerm = typeof overrideWord === "string" ? overrideWord : searchQuery;
    const term = rawTerm.trim();
    if (!term) return;

    setIsLoading(true);
    setErrorMsg(null);
    setDictData(null);

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000);

    try {
      // 🚀 NEW: Expanded Parallel Fetching for Synonyms, Antonyms, and Rhymes
      const [wikiRes, synRes, antRes, rhyRes] = await Promise.all([
        fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(term.toLowerCase())}`, { signal: abortController.signal }),
        fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(term.toLowerCase())}&max=5`, { signal: abortController.signal }).catch(() => null),
        fetch(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(term.toLowerCase())}&max=5`, { signal: abortController.signal }).catch(() => null),
        fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(term.toLowerCase())}&max=5`, { signal: abortController.signal }).catch(() => null)
      ]);

      if (wikiRes.status === 404) {
        setErrorMsg(`No definitions found for "${term}". Check the spelling and try again.`);
        return;
      }
      
      if (!wikiRes.ok) {
        throw new Error(`Wikimedia service returned status ${wikiRes.status}.`);
      }

      const wikiData = await wikiRes.json();
      const enData = wikiData.en;

      if (!enData || !Array.isArray(enData) || enData.length === 0) {
        setErrorMsg(`No definitions found for "${term}". Check the spelling and try again.`);
        return;
      }

      // Extract rich data from Datamuse endpoints
      let synonyms = [], antonyms = [], rhymes = [];
      if (synRes && synRes.ok) { const dm = await synRes.json(); synonyms = dm.map(i => i.word); }
      if (antRes && antRes.ok) { const dm = await antRes.json(); antonyms = dm.map(i => i.word); }
      if (rhyRes && rhyRes.ok) { const dm = await rhyRes.json(); rhymes = dm.map(i => i.word); }

      const stripHtml = (htmlStr) => htmlStr ? htmlStr.replace(/<[^>]*>?/gm, '').trim() : '';

      const mappedData = {
        word: term,
        meanings: enData.map((m, index) => ({
          partOfSpeech: m.partOfSpeech.toLowerCase(),
          definitions: m.definitions.map(d => ({
            definition: stripHtml(d.definition),
            example: d.parsedExamples && d.parsedExamples.length > 0 ? stripHtml(d.parsedExamples[0].example) : null
          })),
          // Inject rich data into the first meaning block for a clean UI
          synonyms: index === 0 ? synonyms : [],
          antonyms: index === 0 ? antonyms : [],
          rhymes: index === 0 ? rhymes : []
        }))
      };

      setDictData(mappedData);
    } catch (err) {
      if (err.name === "AbortError") {
        setErrorMsg("The dictionary took too long to respond. Please try again.");
      } else {
        setErrorMsg("Couldn't reach the dictionary service. Check your connection and try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  // 🚀 NEW: Bulletproof Native Audio Playback
  const playAudio = (wordText) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // Slightly slower for clearer pronunciation
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio pronunciation is not supported in this browser.");
    }
  };

  if (!isOpen || !mounted) return null; // 🚀 FIXED: Wait until mounted to prevent UI flashing

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dictSheetSlide { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes dictDropdownSlide { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-dict-sheet { animation: dictSheetSlide 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-dict-dropdown { animation: dictDropdownSlide 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .dict-scroll::-webkit-scrollbar { width: 4px; }
        .dict-scroll::-webkit-scrollbar-track { background: transparent; }
        .dict-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
      `}} />

      {isMobileView && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/20 dark:bg-black/60 backdrop-blur-xs z-[45] transition-all duration-300"
        />
      )}

      <div
        onTouchStart={isMobileView ? handleTouchStart : undefined}
        onTouchMove={isMobileView ? handleTouchMove : undefined}
        onTouchEnd={isMobileView ? handleTouchEndAction : undefined}
        className={`bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col z-[50] transition-all duration-300 border border-slate-200/90 dark:border-slate-800 shadow-[0_24px_64px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.4)] ${
          isMobileView
            ? "fixed bottom-0 left-0 right-0 h-[85vh] rounded-t-[40px] px-5 pb-5 pt-4 animate-dict-sheet overflow-hidden"
            : "absolute top-18 right-[72px] w-[340px] h-[550px] rounded-[32px] p-5 animate-dict-dropdown overflow-hidden"
        }`}
      >
        {isMobileView && <div className="w-10 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4 shrink-0" />}

        {/* Header & Search Bar */}
        <div className="shrink-0 mb-4">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">Dictionary</h3>
             </div>
             {!isMobileView && (
               <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
             )}
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any word..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all placeholder-slate-400"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto dict-scroll pr-1 pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
               <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Searching Lexicon...</span>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
               <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-3">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{errorMsg}</p>
            </div>
          ) : dictData ? (
            <div className="animate-fade-in flex flex-col gap-5">
              
              {/* Word Header & Audio Player */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white capitalize leading-none">{dictData.word}</h2>
                </div>
                {/* 🚀 FIXED: Now uses the native synthesis API so the button always appears and works for every word */}
                <button onClick={() => playAudio(dictData.word)} className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-sm active:scale-95">
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
              </div>

              {/* Meanings & Rich Data Loop */}
              {dictData.meanings.map((meaning, mIdx) => (
                <div key={mIdx} className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">{meaning.partOfSpeech}</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  </div>
                  
                  <ul className="space-y-3 pl-4 list-disc marker:text-blue-500">
                    {meaning.definitions.slice(0, 3).map((def, dIdx) => (
                      <li key={dIdx} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {def.definition}
                        {def.example && <span className="block mt-1 text-[13px] text-slate-500 italic">"{def.example}"</span>}
                      </li>
                    ))}
                  </ul>

                  {/* 🚀 NEW: Comprehensive Lexicon Data Matrices */}
                  {meaning.synonyms && meaning.synonyms.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 w-16">Synonyms</span>
                      {meaning.synonyms.slice(0, 4).map((syn, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm" onClick={() => { setSearchQuery(syn); handleSearch(null, syn); }}>
                          {syn}
                        </span>
                      ))}
                    </div>
                  )}

                  {meaning.antonyms && meaning.antonyms.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 w-16">Antonyms</span>
                      {meaning.antonyms.slice(0, 4).map((ant, aIdx) => (
                        <span key={aIdx} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60 rounded-md text-[11px] font-bold cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/80 transition-colors shadow-sm" onClick={() => { setSearchQuery(ant); handleSearch(null, ant); }}>
                          {ant}
                        </span>
                      ))}
                    </div>
                  )}

                  {meaning.rhymes && meaning.rhymes.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 w-16">Rhymes</span>
                      {meaning.rhymes.slice(0, 4).map((rhy, rIdx) => (
                        <span key={rIdx} className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/60 rounded-md text-[11px] font-bold cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/80 transition-colors shadow-sm" onClick={() => { setSearchQuery(rhy); handleSearch(null, rhy); }}>
                          {rhy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
               <svg className="w-12 h-12 mb-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
               <p className="text-xs font-medium font-mono uppercase tracking-widest text-slate-500">Oxford Dictionary Integration</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}