/**
 * ================================================================================================
 * ⚙️ JEMER ACADEMY MASTER SETTINGS ENGINE — 2-STAGE STATE MACHINE
 * 
 * NEW UPGRADES BUILT:
 * 1. Vertical Full-Width List: Replaced the horizontal grid with a stacked flex-col layout.
 * 2. Logout Warning Interceptor: Added a native browser confirmation prompt before redirecting.
 * 3. Space Eradication: Forced width to 100% (w-full) on cards and stage-2 sections to seamlessly 
 *    consume all empty viewport estate.
 * ================================================================================================
 */

"use client";

import React, { useState } from 'react';

export default function SettingsEngine() {
  const [activeStage, setActiveStage] = useState("overview");

  const settingsCategories = [
    { id: "account", title: "Account Info", icon: "👤", desc: "Manage your personal credentials and bio details" },
    { id: "ai", title: "AI & Personalization", icon: "🤖", desc: "Configure generation parameters and tutor styles" },
    { id: "theme", title: "Appearance & Theme", icon: "🌗", desc: "Toggle contrast modes and visual density settings" },
    { id: "security", title: "Security & Data", icon: "🔐", desc: "Passwords, active session tracking, and exports" },
    { id: "legal", title: "Legal Center", icon: "📜", desc: "Terms of service, privacy, and ed-tech guidelines" },
    { id: "help", title: "Help Center", icon: "❓", desc: "System FAQs, diagnostic support logs, and tickets" },
    { id: "danger", title: "Account Deletion", icon: "⚠️", desc: "Permanent destructive data removal", isDanger: true },
  ];

  const handleLogout = () => {
    // ⚠️ Added confirmation interceptor before executing the external logout redirect
    const confirmLogout = window.confirm("Are you sure you want to log out of your active Jemer Academy session?");
    if (confirmLogout) {
      window.location.href = '/login.html';
    }
  };

  const renderActiveSection = () => {
    switch (activeStage) {
      case "account":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">First Name</label>
                <input type="text" defaultValue="Jemer" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Last Name</label>
                <input type="text" defaultValue="Student" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Email Address</label>
                <input type="email" defaultValue="student@jemeracademy.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" />
              </div>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-8 py-3 rounded-xl text-sm font-bold mt-2 shadow-md transition-all active:scale-95">Save Changes</button>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">AI & Personalization Engine</h3>
            <div className="space-y-4 w-full">
              <div className="p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 transition-colors w-full">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-2.5">Default Tutor Tone</label>
                <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none cursor-pointer">
                  <option>Strict & Concise</option>
                  <option>Detailed Step-by-Step</option>
                  <option>WAEC / JAMB Exam Focused</option>
                </select>
              </div>
              <div className="p-5 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center group cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-full">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Vid2Notes Auto-Processing</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Automatically extract transcripts when a video link is pasted.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center p-1 shrink-0 shadow-inner">
                  <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case "theme":
        return (
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">Appearance & Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {['Light', 'Dark', 'System Sync'].map((theme, i) => (
                <div key={i} className="border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer h-32 transition-all hover:shadow-md w-full">
                  <div className={`w-8 h-8 rounded-full mb-3 shadow-inner ${i === 0 ? 'bg-white border border-slate-200' : i === 1 ? 'bg-slate-900 border border-slate-700' : 'bg-gradient-to-r from-white to-slate-900 border border-slate-400'}`}></div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{theme}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "danger":
        return (
          <div className="space-y-6 animate-fade-in border-2 border-red-500/20 bg-red-50/80 dark:bg-red-950/20 p-6 sm:p-8 rounded-3xl shadow-sm w-full">
            <h3 className="text-xl font-display font-bold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-900/50 pb-4">Danger Zone: Account Deletion</h3>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-300 leading-relaxed">
              This action is strictly permanent. All generated courses, study logs, WAEC preparation parameters, and profile data will be permanently purged from the database.
            </p>
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-red-500 font-mono">Type "DELETE" to confirm</label>
              <input type="text" placeholder="DELETE" className="w-full bg-white dark:bg-black border border-red-300 dark:border-red-900/80 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30" />
            </div>
            <button className="w-full bg-red-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold mt-4 hover:bg-red-700 transition-colors shadow-md">Permanently Delete Account</button>
          </div>
        );

      default:
        return (
          <div className="space-y-5 animate-fade-in text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/30 dark:bg-slate-950/30 w-full">
            <span className="text-5xl block mb-4">🛠️</span>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Module Initializing</h3>
            <p className="text-sm text-slate-500 font-medium mx-auto w-full">The <span className="uppercase text-slate-700 dark:text-slate-300">{activeStage}</span> interface is structurally locked pending content population.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col space-y-6 lg:space-y-8 w-full max-w-7xl mx-auto">
      
      {/* ========================================================================================
          HERO IDENTITY COMPONENT (Expanded w-full)
          ======================================================================================== */}
      <section className="w-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300 relative overflow-hidden group hover:shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 z-10 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-950 border-[3px] border-slate-100 dark:border-slate-800 shadow-md flex items-center justify-center p-2 sm:p-3 overflow-hidden shrink-0 transition-transform group-hover:scale-105 duration-300">
            <img 
              src="/assets/brand/jemer-logo.png" 
              alt="Jemer Academy Logo" 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-2xl font-mono text-slate-400 font-bold">JA</span>';
              }}
            />
          </div>
          
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                Jemer Student
              </h2>
              <span className="text-[10px] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
                NG 🇳🇬
              </span>
            </div>
            <p className="text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded border border-blue-100 dark:border-blue-800/50 inline-block">
              ID: jemer_usr_001
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pt-1 max-w-lg">
              Jemer Academy Main Profile Configuration. Manage your examination parameters, system themes, and AI defaults here.
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="z-10 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 md:w-auto w-full shrink-0 hover:border-red-200 dark:hover:border-red-900/50"
        >
          <span>Log out</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </section>

      {/* ========================================================================================
          STAGE 2: ACTIVE DETAIL VIEW (Expanded w-full)
          ======================================================================================== */}
      {activeStage !== "overview" && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 w-full animate-fade-in flex flex-col md:flex-row gap-8">
          <div className="shrink-0 md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
            <button 
              onClick={() => setActiveStage("overview")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-mono w-full p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Overview
            </button>
          </div>
          
          <div className="flex-1 w-full max-w-full">
            {renderActiveSection()}
          </div>
        </section>
      )}

      {/* ========================================================================================
          STAGE 1: VERTICAL FULL-WIDTH OVERVIEW LIST
          ======================================================================================== */}
      {activeStage === "overview" && (
        <section className="flex flex-col space-y-4 animate-fade-in w-full">
          {settingsCategories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => setActiveStage(cat.id)}
              className={`
                group cursor-pointer rounded-2xl p-4 sm:p-6 border transition-all duration-300 flex items-center justify-between w-full hover:-translate-y-0.5 hover:shadow-md
                ${cat.isDanger 
                  ? "bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-800" 
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600"
                }
              `}
            >
              <div className="flex items-center gap-4 sm:gap-5 w-full">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner border
                  ${cat.isDanger 
                    ? "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 text-red-600" 
                    : "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors"
                  }
                `}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm sm:text-lg font-display font-extrabold tracking-tight ${cat.isDanger ? "text-red-700 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1.5 line-clamp-1 sm:line-clamp-none">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors transform group-hover:translate-x-1 ml-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </section>
      )}

    </div>
  );
}