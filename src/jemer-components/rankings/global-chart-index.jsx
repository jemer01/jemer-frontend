"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - GLOBAL CHART INDEX & CHALLENGERS)
 * ================================================================================================
 * 1. 2D FLAT WORLD MAP: Built an immersive geographic visualization using absolute-positioned 
 *    glowing nodes (pulsing lights) mapped across a subtle world map background to signify where 
 *    the top scholars are currently dominating.
 * 2. COUNTRY LEADERBOARD: Added a beautifully designed vertical ranking grid highlighting top 
 *    countries (USA, China, UK, Nigeria, etc.) based on aggregated student XP.
 * 3. THE CHALLENGERS TABLE: Recycled the ultra-sleek Glassmorphism table from the Top 100, 
 *    but automatically generates and ranks students 101 - 200 with realistic XP scaling.
 * 4. SEAMLESS PROP ROUTING: Uses `onStudentClick` to bridge straight to the profile view, and 
 *    `onBack` to safely return to the Stage 1 Top 100 leaderboard.
 * ================================================================================================
 */

import React, { useMemo } from "react";

// Generate Ranks 101 - 200 dynamically
const generateChallengers = () => {
  const data = [];
  let currentXP = 11000; // Starting just below the Rank 100 threshold
  
  const firstNames = ["James", "Fatima", "Yuki", "Maria", "John", "Amara", "Lucas", "Anya", "Kenji", "Zoe"];
  const lastNames = ["Adeyemi", "Wang", "Brown", "Costa", "Lee", "Sharma", "Williams", "Hassan", "Lopez", "Taylor"];
  const countries = ["🇳🇬 NG", "🇺🇸 US", "🇬🇧 UK", "🇨🇳 CN", "🇮🇳 IN", "🇧🇷 BR", "🇨🇦 CA", "🇩🇪 DE", "🇿🇦 ZA", "🇯🇵 JP"];
  
  const randomBadges = [["🔥", "📈"], ["🎯", "💡"], ["🚀"], ["⚡", "🧠"], ["🔬"], ["🏆", "💪"], ["📚", "✏️"]];

  for (let i = 101; i <= 200; i++) {
    currentXP = currentXP - Math.floor(Math.random() * 50 + 10);
    
    data.push({
      id: `usr_${1000 + i}`,
      rank: i,
      name: `${firstNames[i % 10]} ${lastNames[(i + 7) % 10]}`,
      avatar: `https://i.pravatar.cc/150?img=${((i + 15) % 70) + 1}`,
      country: countries[i % countries.length],
      xp: currentXP.toLocaleString(),
      badges: randomBadges[i % randomBadges.length]
    });
  }
  return data;
};

// Mock Country Rankings
const TOP_COUNTRIES = [
  { rank: 1, flag: "🇺🇸", name: "United States", xp: "14.2M", students: 420, trend: "+12%" },
  { rank: 2, flag: "🇨🇳", name: "China", xp: "13.8M", students: 395, trend: "+8%" },
  { rank: 3, flag: "🇬🇧", name: "United Kingdom", xp: "11.5M", students: 310, trend: "-2%" },
  { rank: 4, flag: "🇳🇬", name: "Nigeria", xp: "10.9M", students: 480, trend: "+24%" },
  { rank: 5, flag: "🇮🇳", name: "India", xp: "9.7M", students: 512, trend: "+15%" },
];

export default function GlobalChartIndex({ onStudentClick, onBack }) {
  const challengersData = useMemo(() => generateChallengers(), []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HEADER & NAVIGATION
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="text-left">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-amber-500 transition-colors font-mono mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Top 100
          </button>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Global Chart Index
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl mt-2">
            The geographic heat map of intellectual dominance. See which nations are producing the highest-ranking Jemer scholars globally.
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          GEOGRAPHY MATRIX: 2D MAP & COUNTRY LEADERBOARD
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* The 2D World Map Canvas */}
        <div className="lg:col-span-2 relative w-full h-[350px] sm:h-[450px] bg-slate-900 dark:bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-xl group">
          {/* Faded dot-matrix world map background */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain" style={{ filter: 'invert(1)' }}></div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>

          <div className="absolute top-6 left-6 z-20">
            <span className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-slate-700 text-amber-400 font-mono font-black text-[10px] tracking-widest shadow-lg">
              Live Activity Heatmap
            </span>
          </div>

          {/* GLOWING NODES (Absolute coordinates mapping to major regions) */}
          {/* North America */}
          <div className="absolute top-[35%] left-[22%] z-10">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping absolute inset-0"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full relative shadow-[0_0_15px_#f59e0b]"></div>
          </div>
          <div className="absolute top-[40%] left-[28%] z-10">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping absolute inset-0 delay-150"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full relative shadow-[0_0_10px_#f97316]"></div>
          </div>

          {/* Europe */}
          <div className="absolute top-[28%] left-[48%] z-10">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping absolute inset-0 delay-300"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full relative shadow-[0_0_15px_#eab308]"></div>
          </div>

          {/* Africa (Nigeria) */}
          <div className="absolute top-[52%] left-[51%] z-10">
            <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping absolute inset-0 delay-[50ms] duration-1000"></div>
            <div className="w-4 h-4 bg-emerald-500 rounded-full relative shadow-[0_0_20px_#10b981]"></div>
          </div>

          {/* Asia (China & India) */}
          <div className="absolute top-[38%] left-[72%] z-10">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping absolute inset-0 delay-500"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full relative shadow-[0_0_15px_#f59e0b]"></div>
          </div>
          <div className="absolute top-[48%] left-[68%] z-10">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping absolute inset-0 delay-700"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full relative shadow-[0_0_10px_#ef4444]"></div>
          </div>
        </div>

        {/* Country Leaderboard Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[350px] sm:h-[450px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Top Nations</h3>
            <i className="fas fa-trophy text-amber-500"></i>
          </div>
          
          <div className="flex-1 overflow-y-auto ranking-premium-scroll pr-2 space-y-3">
            {TOP_COUNTRIES.map((country) => (
              <div key={country.rank} className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between group hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400 w-4">{country.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    {country.flag}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{country.name}</span>
                    <span className="text-[9px] font-mono font-medium text-slate-500">{country.students} Elites</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">{country.xp} XP</span>
                  <span className={`text-[9px] font-black ${country.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {country.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          THE CHALLENGERS TABLE: RANKS 101 - 200
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden mt-8 animate-slide-up">
        
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-fist-raised text-amber-500"></i> Rising Challengers
          </h3>
          <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-md">
            Ranks 101 - 200
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
              {challengersData.map((student) => (
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

    </div>
  );
}