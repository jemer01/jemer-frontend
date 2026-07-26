// src/jemer-components/rankings/rankings.jsx
"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.2 - TOP 100 LEADERBOARD WIDGET)
 * ================================================================================================
 * 1. EVENT BUBBLING OPTIMIZATION: Added `e.stopPropagation()` to the CTA buttons to prevent 
 *    double-firing state transitions when the nested button inside the parent container is clicked.
 * 2. PRESERVED HYDRATION & UI: Maintained the deterministic XP generation (which stops the Next.js 
 *    hydration crashes) and the inline SVGs (which fixes the broken globe icon).
 * ================================================================================================
 */

import React, { useMemo } from "react";

// Helper to generate a deterministic, realistic array of 100 students (No Math.random() to prevent Hydration Errors)
const generateDummyLeaderboard = () => {
  const data = [];
  const baseXP = 15000;
  
  // High-fidelity avatars for the top 3
  const topAvatars = [
    "https://i.pravatar.cc/150?img=11", // Rank 1
    "https://i.pravatar.cc/150?img=33", // Rank 2
    "https://i.pravatar.cc/150?img=47"  // Rank 3
  ];

  const firstNames = ["David", "Aisha", "Wei", "Sarah", "Michael", "Elena", "Liam", "Sofia", "Hiroshi", "Chloe"];
  const lastNames = ["Okafor", "Chen", "Smith", "Silva", "Kim", "Patel", "Johnson", "Ali", "Garcia", "Martinez"];
  const countries = ["🇳🇬 NG", "🇺🇸 US", "🇬🇧 UK", "🇨🇳 CN", "🇮🇳 IN", "🇧🇷 BR", "🇨🇦 CA"];
  
  const randomBadges = [
    ["👑", "🔥", "⚡"], ["💎", "🧠"], ["🚀", "🎯", "🌟"], ["🔥"], ["🏆", "🥇"], ["🔬", "⚡"], ["📚"]
  ];

  for (let i = 1; i <= 100; i++) {
    // Deterministic XP Calculation
    const xp = Math.floor(baseXP - (Math.log(i) * 2000) - ((i * 17) % 50));
    const isTop3 = i <= 3;

    data.push({
      id: `usr_${1000 + i}`,
      rank: i,
      name: isTop3 
        ? (i===1 ? "Isabella Chen" : i===2 ? "Chinedu Okafor" : "Alex Mercer")
        : `${firstNames[i % 10]} ${lastNames[(i + 3) % 10]}`,
      avatar: isTop3 ? topAvatars[i - 1] : `https://i.pravatar.cc/150?img=${(i % 50) + 1}`,
      country: isTop3 
        ? (i===1 ? "🇺🇸 US" : i===2 ? "🇳🇬 NG" : "🇬🇧 UK")
        : countries[i % countries.length],
      xp: xp.toLocaleString(),
      badges: isTop3 ? ["👑", "💎", "🔥", "🚀"] : randomBadges[i % randomBadges.length]
    });
  }
  return data;
};

export default function Rankings({ onStudentClick, onOpenGlobalIndex }) {
  // Memoize the data so it doesn't shuffle infinitely on re-renders
  const leaderboardData = useMemo(() => generateDummyLeaderboard(), []);
  
  // Extract Podium (Ranks 1, 2, 3) vs Table (Ranks 4-100)
  const podiumTop3 = leaderboardData.slice(0, 3);
  const tableChallengers = leaderboardData.slice(3, 100);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 animate-fade-in pb-12">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HEADER: PAGE INTRO & PRESTIGE TITLE
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Live Academic Leaderboard
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Jemer's Top 100 Students Globally
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Welcome to the Hall of Fame. These elite scholars have accumulated the highest Experience Points (XP) across all our international test modules, outperforming millions worldwide.
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          THE PODIUM: ANIMATED BAR CHART VIEW (1st, 2nd, 3rd)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="relative pt-12 pb-6 px-4">
        {/* Ambient background glow behind podium */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-64 bg-amber-500/10 dark:bg-amber-500/5 rounded-[100%] blur-3xl pointer-events-none" />

        <div className="flex items-end justify-center gap-2 sm:gap-6 h-[400px] max-w-4xl mx-auto z-10 relative">
          
          {/* SILVER - Rank 2 (Left) */}
          <div 
            onClick={() => onStudentClick(podiumTop3[1])}
            className="flex flex-col items-center w-28 sm:w-40 cursor-pointer group animate-slide-up" style={{ animationDelay: '150ms' }}
          >
            <div className="flex flex-col items-center mb-4 transition-transform group-hover:-translate-y-2">
              <div className="relative">
                <img src={podiumTop3[1].avatar} alt={podiumTop3[1].name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 dark:border-slate-400 shadow-xl object-cover" />
                <div className="absolute -bottom-2 -right-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white dark:border-slate-900 shadow-sm text-xs">
                  #2
                </div>
              </div>
              <h3 className="mt-3 text-sm sm:text-base font-black text-slate-900 dark:text-white text-center line-clamp-1">{podiumTop3[1].name}</h3>
              <p className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 mt-0.5">{podiumTop3[1].xp} XP</p>
            </div>
            {/* The Silver Bar (With Typography) */}
            <div className="w-full h-48 bg-gradient-to-t from-slate-400 to-slate-200 dark:from-slate-700 dark:to-slate-400 rounded-t-2xl shadow-[0_0_15px_rgba(148,163,184,0.3)] relative overflow-hidden group-hover:brightness-110 transition-all border-x border-t border-slate-300 dark:border-slate-500 flex flex-col justify-end items-center pb-6">
              <span className="text-white/60 font-black text-sm tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>2ND PLACE</span>
              <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
          </div>

          {/* GOLD - Rank 1 (Center) */}
          <div 
            onClick={() => onStudentClick(podiumTop3[0])}
            className="flex flex-col items-center w-32 sm:w-48 cursor-pointer group animate-slide-up z-20" 
          >
            <div className="flex flex-col items-center mb-4 transition-transform group-hover:-translate-y-2 relative">
              <div className="absolute -top-10 text-4xl animate-bounce drop-shadow-md">👑</div>
              <div className="relative">
                <img src={podiumTop3[0].avatar} alt={podiumTop3[0].name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 dark:border-amber-500 shadow-2xl object-cover ring-4 ring-amber-500/30" />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-300 to-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-2 border-white dark:border-slate-900 shadow-md text-sm">
                  #1
                </div>
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 text-center line-clamp-1">{podiumTop3[0].name}</h3>
              <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-500 mt-1">{podiumTop3[0].xp} XP</p>
            </div>
            {/* The Gold Bar (With Typography) */}
            <div className="w-full h-64 bg-gradient-to-t from-amber-600 to-yellow-300 dark:from-amber-700 dark:to-yellow-500 rounded-t-3xl shadow-[0_0_30px_rgba(245,158,11,0.5)] relative overflow-hidden group-hover:brightness-110 transition-all border-x border-t border-amber-300 dark:border-amber-400 flex flex-col justify-end items-center pb-8">
              <span className="text-white/80 font-black text-lg tracking-widest drop-shadow-sm" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>1ST PLACE</span>
              <div className="absolute inset-0 bg-white/30 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-100" />
            </div>
          </div>

          {/* BRONZE - Rank 3 (Right) */}
          <div 
            onClick={() => onStudentClick(podiumTop3[2])}
            className="flex flex-col items-center w-28 sm:w-40 cursor-pointer group animate-slide-up" style={{ animationDelay: '300ms' }}
          >
            <div className="flex flex-col items-center mb-4 transition-transform group-hover:-translate-y-2">
              <div className="relative">
                <img src={podiumTop3[2].avatar} alt={podiumTop3[2].name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-400 dark:border-orange-600 shadow-xl object-cover" />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-orange-400 to-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white dark:border-slate-900 shadow-sm text-xs">
                  #3
                </div>
              </div>
              <h3 className="mt-3 text-sm sm:text-base font-black text-slate-900 dark:text-white text-center line-clamp-1">{podiumTop3[2].name}</h3>
              <p className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 mt-0.5">{podiumTop3[2].xp} XP</p>
            </div>
            {/* The Bronze Bar (With Typography) */}
            <div className="w-full h-36 bg-gradient-to-t from-orange-700 to-orange-400 dark:from-red-900 dark:to-orange-600 rounded-t-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)] relative overflow-hidden group-hover:brightness-110 transition-all border-x border-t border-orange-300 dark:border-orange-500 flex flex-col justify-end items-center pb-4">
              <span className="text-white/60 font-black text-sm tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>3RD PLACE</span>
              <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-200" />
            </div>
          </div>

        </div>
        
        {/* Glass Floor Line */}
        <div className="w-full h-2 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent rounded-full mt-[-2px] relative z-0" />
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          THE LEADERBOARD TABLE: RANKS 4 - 100
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '450ms' }}>
        
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-list-ol text-amber-500"></i> Global Challengers
          </h3>
          <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-md">
            Ranks 4 - 100
          </span>
        </div>

        <div className="overflow-x-auto ranking-premium-scroll max-h-[600px]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50/80 dark:bg-slate-950/80 sticky top-0 z-20 backdrop-blur-md shadow-sm">
              <tr>
                <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider w-20 text-center">Rank</th>
                <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider">Student Profile</th>
                <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider text-center">Badges</th>
                <th className="p-4 sm:p-5 text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {tableChallengers.map((student) => (
                <tr 
                  key={student.id} 
                  onClick={() => onStudentClick(student)}
                  className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer group"
                >
                  <td className="p-4 sm:p-5 text-center">
                    <span className="text-sm font-black font-mono text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      #{student.rank}
                    </span>
                  </td>
                  
                  <td className="p-4 sm:p-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img src={student.avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{student.country}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4 sm:p-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {student.badges.map((badge, idx) => (
                        <span key={idx} className="text-lg drop-shadow-sm transform group-hover:scale-110 transition-transform">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 sm:p-5 text-right">
                    <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/50 shadow-xs">
                      {student.xp}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          BOTTOM CTA: GLOBAL CHART INDEX ROUTING
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full flex justify-center animate-fade-in pt-4" style={{ animationDelay: '600ms' }}>
        <div 
          onClick={onOpenGlobalIndex}
          className="w-full sm:w-auto p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center shadow-inner border border-amber-500/30 shrink-0">
              {/* React Inline SVG explicitly replacing FontAwesome to guarantee rendering */}
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-black tracking-tight">Global Rankings Index</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">View the 2D Map & Extended Records (Ranks 101-200)</p>
            </div>
          </div>
          <button 
            // 🆕 Stop propagation prevents this button from firing a double event if the parent div is clicked
            onClick={(e) => { e.stopPropagation(); onOpenGlobalIndex(); }} 
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Map</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}