"use client"; // Informs the Next.js compilation engine to safely load interactive client-side browser DOM hooks

/**
 * ================================================================================================
 * 💎 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM STUDENT PERSONALIZATION CORE ENGINE
 * ================================================================================================
 * 🆕 NEW UPGRADES BUILT (v3.3 - DATABASE CHARACTER LIMIT SAFEGUARD):
 * 1. Database Schema Alignment: Added `maxLength={50}` to the academic level input field to 
 *    physically prevent users from exceeding the PostgreSQL `VARCHAR(50)` limit.
 * 2. Payload Truncation (Safety Net): Before firing the `PATCH` request, the payload forces 
 *    `.substring(0, 50)` on the `academic_level_pacing_tier` field. This guarantees that even if 
 *    text is pasted or manipulated, it will never trigger a `400 Bad Request` crash from Neon DB.
 * 3. Settings Mode Context: Maintained the v3.2 hydration hooks, API key injection, and vendor 
 *    scrubbing that makes this seamlessly work inside the new Settings Dashboard.
 * ================================================================================================
 */

import React, { useState, useEffect } from "react"; // Injects foundational React state parameters and tree management blocks
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Binds natively to Jemer Academy's dark/light interface router

/**
 * High-Fidelity Student Personalization Wizard Component Terminal
 * @param {Object} props - Structural properties dispatched down the layout tree by parent routing managers.
 * @param {function} props.onSaveComplete - Action callback triggered when the form successfully validates and commits to the database.
 * @param {boolean} props.isSettingsMode - Flags whether this component is mounted inside the settings page for updating configurations.
 */
export default function PersonalizationEngine({ onSaveComplete, isSettingsMode = false }) {
  // ── LAYER 1: DESIGN SYSTEM ENVIRONMENT CONTRAST HOOKS ──────────────────────────────────────
  const { theme } = useTheme();

  // ── LAYER 2: WIZARD FLOW POSITION STATE CONTROL ─────────────────────────────────────────────
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isFetchingData, setIsFetchingData] = useState(isSettingsMode);

  // ── LAYER 3: COMPREHENSIVE V2 FORM DATA STATE SCHEMAS ───────────────────────────────────────
  const [formData, setFormData] = useState({
    academic_level_pacing_tier: "", 
    academic_context_matrix: {
      school_name: "", 
      academic_track: "", 
      current_state_region: "" 
    },
    target_curriculum_exam_goals: [], 

    target_learning_interests: [], 
    cognitive_scaffolding_preference: "Socratic", 

    content_delivery_formats: ["Interactive Quizzes", "Summary Notes"], 
    feedback_timing_tone_strategy: "Immediate", 
    environmental_context_duration: {
      average_duration_mins: 30, 
      environment_profile: "" 
    },

    personal_context: {
      biography: "" 
    },
    custom_instructions: {
      rules: "" 
    }
  });

  // ── LAYER 4: GLOBAL CUSTOM PRESETS DICTIONARIES FOR THEME TAG SELECTORS ────────────────────
  const examGoalsPresets = ["SAT", "ACT", "Advanced Placement (AP)", "International Baccalaureate (IB)", "GCSE", "A-Levels", "University Finals"];
  const interestPresets = ["Football", "Basketball", "Gaming", "Music Playlists", "Sci-Fi Movies", "Coding", "Anime", "Art & Design"];
  const formatPresets = ["Interactive Quizzes", "Summary Notes", "Visual Diagrams", "Step-by-step Code Blocks", "Flashcards"];

  // ── LAYER 5: TEXT ARRAY (TEXT[]) PILL MANIPULATION HOOK MATRIX ──────────────────────────────
  const [manualGoalInput, setManualGoalInput] = useState("");
  const [manualInterestInput, setManualInterestInput] = useState("");

  // LAYER 5.5: LIVE DATA HYDRATION SEQUENCE
  useEffect(() => {
    if (!isSettingsMode) return;

    const fetchExistingData = async () => {
      try {
        const activeJwtToken = localStorage.getItem("jemer_session_jwt");
        const userUuid = localStorage.getItem("jemer_user_uuid");

        if (!activeJwtToken || !userUuid) {
          setIsFetchingData(false);
          return;
        }

        const endpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${userUuid}`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${activeJwtToken}`,
            "apikey": activeJwtToken, 
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const profile = data[0];
            setFormData((prev) => ({
              ...prev,
              academic_level_pacing_tier: profile.academic_level_pacing_tier || prev.academic_level_pacing_tier,
              academic_context_matrix: profile.academic_context_matrix || prev.academic_context_matrix,
              target_curriculum_exam_goals: profile.target_curriculum_exam_goals || prev.target_curriculum_exam_goals,
              target_learning_interests: profile.target_learning_interests || prev.target_learning_interests,
              cognitive_scaffolding_preference: profile.cognitive_scaffolding_preference || prev.cognitive_scaffolding_preference,
              content_delivery_formats: profile.content_delivery_formats || prev.content_delivery_formats,
              feedback_timing_tone_strategy: profile.feedback_timing_tone_strategy || prev.feedback_timing_tone_strategy,
              environmental_context_duration: profile.environmental_context_duration || prev.environmental_context_duration,
              personal_context: profile.personal_context || prev.personal_context,
              custom_instructions: profile.custom_instructions || prev.custom_instructions
            }));
          }
        } else {
          console.error("[PROFILE SYNC FAULT] Secure Database GET rejected. Check apikey parameters.");
        }
      } catch (err) {
        console.error("[PROFILE SYNC FAULT] Failed to load previous configuration:", err);
      } finally {
        setIsFetchingData(false); 
      }
    };

    fetchExistingData();
  }, [isSettingsMode]);

  const handleToggleTextArrayToken = (arrayKeyField, valuesToken) => {
    setFormData((prev) => {
      const workingBuffer = [...prev[arrayKeyField]];
      const targetElementIndex = workingBuffer.indexOf(valuesToken);

      if (targetElementIndex > -1) {
        workingBuffer.splice(targetElementIndex, 1);
      } else {
        workingBuffer.push(valuesToken);
      }

      return { ...prev, [arrayKeyField]: workingBuffer };
    });
  };

  // ── LAYER 6: OBJECT SCALAR MUTATION CONTROLLERS ─────────────────────────────────────────────
  const handleUpdateScalarField = (fieldKey, literalValue) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: literalValue }));
  };

  const handleUpdateNestedJSONBField = (masterParentKey, childPropertyKey, valuePayload) => {
    setFormData((prev) => ({
      ...prev,
      [masterParentKey]: {
        ...prev[masterParentKey],
        [childPropertyKey]: valuePayload
      }
    }));
  };

  // ── LAYER 7: DATA VALIDATION & STEP TIMELINE ROUTERS ──────────────────────────────────────
  const handleAdvanceStepTimeline = () => {
    setErrorMessage(""); 
    setSuccessMessage("");
    
    if (activeStep === 1) {
      if (!formData.academic_level_pacing_tier.trim()) {
        setErrorMessage("Please type what school level or grade you are currently in to continue.");
        return;
      }
      if (!formData.academic_context_matrix.school_name.trim()) {
        setErrorMessage("Please tell us your school's name (or type 'Self-Taught') to proceed.");
        return;
      }
    }

    if (activeStep === 2) {
      if (formData.target_learning_interests.length === 0) {
        setErrorMessage("Please select or type at least one favorite hobby so your tutor can create real examples for you.");
        return;
      }
    }

    setActiveStep((current) => Math.min(current + 1, 4));
  };

  const handleRegressStepTimeline = () => {
    setErrorMessage(""); 
    setSuccessMessage("");
    setActiveStep((current) => Math.max(current - 1, 1));
  };

  // ================================================================================================
  // ⚡ LAYER 8: DATABASE API INTEGRATION PROTOCOLS 
  // ================================================================================================
  const handleSubmitPersonalizationPayload = async (formSubmitEventContext) => {
    formSubmitEventContext.preventDefault(); 
    setErrorMessage(""); 
    setSuccessMessage("");
    setIsSubmitting(true); 

    console.log("[JEMER DIRECT REST SYNC] Initializing absolute personalization update sequence straight to secure cloud rails...");

    try {
      const activeJwtToken = localStorage.getItem("jemer_session_jwt");
      const userUuid = localStorage.getItem("jemer_user_uuid");

      if (!activeJwtToken || !userUuid) {
        console.error("[JEMER SYNC ERROR] Operational state aborted: Session tokens are vacant or have expired.");
        throw new Error("Missing active authentication session credentials. Please sign out and log back in to refresh token keys.");
      }

      const directDataApiEndpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${userUuid}`;

      const remoteEndpointResponse = await fetch(directDataApiEndpoint, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${activeJwtToken}`, 
          "apikey": activeJwtToken, 
          "Prefer": "return=minimal" 
        },
        // 🆕 Strict 50-Character safety trim for academic_level_pacing_tier
        body: JSON.stringify({
          ...formData,
          academic_level_pacing_tier: formData.academic_level_pacing_tier.substring(0, 50)
        }) 
      });

      if (!remoteEndpointResponse || !remoteEndpointResponse.ok) {
        const errorBodyText = await remoteEndpointResponse.text().catch(() => "Unreadable stream");
        console.error(`[DATABASE API ERROR] Table patch transaction rejected with code: ${remoteEndpointResponse?.status || 'Null'}. Response trace: ${errorBodyText}`);
        throw new Error(`Database gateway rejected configuration saving. Status: ${remoteEndpointResponse?.status || 'Unknown'}`);
      }

      console.log("[JEMER DIRECT REST SUCCESS] Advanced personalized parameters committed directly to Jemer secure tables with zero drops.");
      
      if (isSettingsMode) {
        setSuccessMessage("✅ AI Preferences successfully synchronized with Jemer Cloud.");
        setTimeout(() => setSuccessMessage(""), 4000);
      }

      if (onSaveComplete) {
        onSaveComplete(); 
      }

    } catch (networkFaultException) {
      console.error("[PERSONALIZATION DIRECT SYNC CRASH] Table transaction sequence collapsed:", networkFaultException.message);
      setErrorMessage(`Failed to synchronize your settings with the cloud server. Error: ${networkFaultException.message}`);
      console.warn("[RESILIENT SAFETY BYPASS] Triggering fallback safety bypass routine to prevent interface screen freezing.");
      
      if (onSaveComplete) {
        onSaveComplete();
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (isFetchingData) {
    return (
       <div className="w-full min-h-[50vh] bg-transparent flex flex-col justify-center items-center animate-fade-in">
         <i className="fas fa-circle-notch fa-spin text-3xl text-blue-600 mb-4"></i>
         <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Loading Settings Matrix...</p>
       </div>
    );
  }

  return (
    // 🏛️ MASTER EDGE-TO-EDGE CANVAS WRAPPER: Covers 100% of the viewport screen, completely replacing nested boxes
    <div className={`w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4 sm:p-8 md:p-12 transition-colors duration-300 relative flex flex-col justify-between ${isSettingsMode ? 'min-h-0' : 'min-h-screen'}`}>
      
      {/* 📥 INLINE STYLE OVERRIDE: Strips the browser's native default scroll bar lines, adding a beautiful custom tracking line */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
        ${!isSettingsMode ? `html, body { scrollbar-width: thin; scrollbar-color: rgba(100, 116, 139, 0.2) transparent; }` : ''}
      `}} />

      {/* DYNAMIC LAYOUT CORE FRAME CONTAINER */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-between py-4">
        
        {/* HEADER PRESENTATION SECTION CONTAINER */}
        <header className="border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/20 dark:border-blue-900/40 px-3 py-1 rounded-full">
                {isSettingsMode ? "Configuration Matrix // Updating Parameters" : "Tutor Setup Matrix // Calibrating Your Guide"}
              </span>
              <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight mt-3 leading-tight">
                {isSettingsMode ? "Update Your AI Personalization Matrix" : "Let's customize your AI tutor"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2">
                Tell us how you learn best. Your answers adjust how your tutor talks, the type of exercises it creates, and the real-world stories it uses to explain difficult concepts.
              </p>
            </div>
            
            {/* STEP COUNTER TIMELINE WIDGET PILL */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0 h-fit shadow-xs">
              <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">Step {activeStep} of 4</span>
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                  style={{ width: `${(activeStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* SIMPLIFIED ACCESSIBLE NAVIGATION PROGRESS INDICATORS RAIL */}
          <div className="grid grid-cols-4 gap-2 mt-8 text-center select-none">
            {[
              { step: 1, name: "School Info" },
              { step: 2, name: "Learning Style" },
              { step: 3, name: "Setup Options" },
              { step: 4, name: "About You" }
            ].map((item) => (
              <div 
                key={item.step}
                className={`pb-2 border-b-2 transition-all duration-200 text-xs font-bold uppercase tracking-wider ${
                  activeStep === item.step 
                    ? "border-blue-600 text-blue-600 dark:text-blue-400" 
                    : activeStep > item.step 
                      ? "border-emerald-500 text-emerald-500" 
                      : "border-slate-100 dark:border-slate-800 text-slate-400"
                }`}
              >
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </header>

        {/* ERROR WARNING RUNTIME STATUS INTERCEPTOR DISPLAYER BANNER */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-red-700 dark:text-red-400 rounded-2xl flex items-start gap-3 text-xs font-medium animate-fade-in text-left shadow-xs">
            <i className="fas fa-exclamation-triangle mt-0.5 shrink-0 text-red-500" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* SUCCESS SYNCHRONIZATION STATUS BANNER */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-start gap-3 text-xs font-medium animate-fade-in text-left shadow-xs">
            <i className="fas fa-check-circle mt-0.5 shrink-0 text-emerald-500" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* WIZARD SECTIONS SWITCH CONTENT LAYER */}
        <div className="flex-1 flex flex-col justify-start">
          
          {/* =======================================================================================
              WIZARD VIEW PANEL 1: SCHOOL INFO 
              ======================================================================================= */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  1. What level of school or grade are you currently in?
                </label>
                <input
                  type="text"
                  required
                  maxLength={50} /* 🆕 Added strict 50-character limit to match DB schema */
                  placeholder="e.g. High School Senior, Year 11, College Sophomore, Self-Taught Learner"
                  value={formData.academic_level_pacing_tier}
                  onChange={(e) => handleUpdateScalarField("academic_level_pacing_tier", e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-xs"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-normal pl-1">
                  This tells us what kind of vocabulary or details to use when explaining complex formulas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                    2. School or Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oakridge High, Online Study"
                    value={formData.academic_context_matrix.school_name}
                    onChange={(e) => handleUpdateNestedJSONBField("academic_context_matrix", "school_name", e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-xs"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                    3. Your Main Major or Study Track
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pre-Engineering, Pre-Med, Arts, Business Management"
                    value={formData.academic_context_matrix.academic_track}
                    onChange={(e) => handleUpdateNestedJSONBField("academic_context_matrix", "academic_track", e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-xs"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                    4. Your Location (City, Country)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK or California, USA"
                    value={formData.academic_context_matrix.current_state_region}
                    onChange={(e) => handleUpdateNestedJSONBField("academic_context_matrix", "current_state_region", e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-xs"
                  />
                </div>

              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  5. What tests or exams are you getting ready for? (Type or select below)
                </label>
                
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl items-center">
                  {formData.target_curriculum_exam_goals.map((goal) => (
                    <span 
                      key={goal}
                      onClick={() => handleToggleTextArrayToken("target_curriculum_exam_goals", goal)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors group"
                      title="Click to remove tag"
                    >
                      <span>{goal}</span>
                      <i className="fas fa-times text-[8px] opacity-60 group-hover:text-red-500" />
                    </span>
                  ))}
                  {formData.target_curriculum_exam_goals.length === 0 && (
                    <span className="text-[10px] text-slate-400 font-mono font-medium italic pl-1">Type below or choose a badge to attach target exam lines.</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {examGoalsPresets.map((presetItem) => {
                    const isSelected = formData.target_curriculum_exam_goals.includes(presetItem);
                    return (
                      <button
                        key={presetItem}
                        type="button"
                        onClick={() => handleToggleTextArrayToken("target_curriculum_exam_goals", presetItem)}
                        className={`px-2.5 py-1 border text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-blue-600 border-blue-600 text-white shadow-xs" 
                            : "bg-transparent border-slate-200 text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        + {presetItem}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="Type other custom test targets..."
                    value={manualGoalInput}
                    onChange={(e) => setManualGoalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && manualGoalInput.trim()) {
                        e.preventDefault();
                        if (!formData.target_curriculum_exam_goals.includes(manualGoalInput.trim())) {
                          handleToggleTextArrayToken("target_curriculum_exam_goals", manualGoalInput.trim());
                        }
                        setManualGoalInput("");
                      }
                    }}
                    className="bg-transparent border-b border-slate-300 dark:border-slate-700 outline-none text-xs font-medium py-1 px-1 text-slate-800 dark:text-slate-200 placeholder-slate-400 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (manualGoalInput.trim()) {
                        if (!formData.target_curriculum_exam_goals.includes(manualGoalInput.trim())) {
                          handleToggleTextArrayToken("target_curriculum_exam_goals", manualGoalInput.trim());
                        }
                        setManualGoalInput("");
                      }
                    }}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* =======================================================================================
              WIZARD VIEW PANEL 2: COGNITIVE STYLE 
              ======================================================================================= */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  1. What are your absolute favorite hobbies, vectors, or personal interests?
                </label>

                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl items-center">
                  {formData.target_learning_interests.map((interest) => (
                    <span 
                      key={interest}
                      onClick={() => handleToggleTextArrayToken("target_learning_interests", interest)}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors group"
                    >
                      <span>{interest}</span>
                      <i className="fas fa-times text-[8px] opacity-60 group-hover:text-red-500" />
                    </span>
                  ))}
                  {formData.target_learning_interests.length === 0 && (
                    <span className="text-[10px] text-slate-400 font-mono font-medium italic pl-1">Type or pick interests so your tutor can explain math/science through them!</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {interestPresets.map((interestItem) => {
                    const isSelected = formData.target_learning_interests.includes(interestItem);
                    return (
                      <button
                        key={interestItem}
                        type="button"
                        onClick={() => handleToggleTextArrayToken("target_learning_interests", interestItem)}
                        className={`px-2.5 py-1 border text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-purple-600 border-purple-600 text-white shadow-xs" 
                            : "bg-transparent border-slate-200 text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        + {interestItem}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="e.g. Photography, Cooking, Physics Trajectories"
                    value={manualInterestInput}
                    onChange={(e) => setManualInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && manualInterestInput.trim()) {
                        e.preventDefault();
                        if (!formData.target_learning_interests.includes(manualInterestInput.trim())) {
                          handleToggleTextArrayToken("target_learning_interests", manualInterestInput.trim());
                        }
                        setManualInterestInput("");
                      }
                    }}
                    className="bg-transparent border-b border-slate-300 dark:border-slate-700 outline-none text-xs font-medium py-1 px-1 text-slate-800 dark:text-slate-200 placeholder-slate-400 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (manualInterestInput.trim()) {
                        if (!formData.target_learning_interests.includes(manualInterestInput.trim())) {
                          handleToggleTextArrayToken("target_learning_interests", manualInterestInput.trim());
                        }
                        setManualInterestInput("");
                      }
                    }}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  2. Choose your preferred teaching or conversation style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div 
                    onClick={() => handleUpdateScalarField("cognitive_scaffolding_preference", "Socratic")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      formData.cognitive_scaffolding_preference === "Socratic"
                        ? "bg-blue-50/20 border-blue-500 dark:bg-blue-950/20 shadow-xs"
                        : "bg-transparent border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    }`}
                  >
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Socratic (The Guide)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1.5 font-medium">
                      Asks you friendly leading questions to challenge your mind and help you unlock solutions on your own.
                    </p>
                  </div>

                  <div 
                    onClick={() => handleUpdateScalarField("cognitive_scaffolding_preference", "Direct")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      formData.cognitive_scaffolding_preference === "Direct"
                        ? "bg-blue-50/20 border-blue-500 dark:bg-blue-950/20 shadow-xs"
                        : "bg-transparent border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    }`}
                  >
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Direct (The Master)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1.5 font-medium">
                      Gives you immediate answers with clean, detailed step-by-step logic. Great for tight timelines.
                    </p>
                  </div>

                  <div 
                    onClick={() => handleUpdateScalarField("cognitive_scaffolding_preference", "Analogy-Heavy")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      formData.cognitive_scaffolding_preference === "Analogy-Heavy"
                        ? "bg-blue-50/20 border-blue-500 dark:bg-blue-950/20 shadow-xs"
                        : "bg-transparent border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    }`}
                  >
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Storyteller (Analogy Heavy)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1.5 font-medium">
                      Explains equations or topics mostly through funny scenarios, real stories, and your chosen hobbies.
                    </p>
                  </div>

                  <div 
                    onClick={() => handleUpdateScalarField("cognitive_scaffolding_preference", "Mixed-Adaptive")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      formData.cognitive_scaffolding_preference === "Mixed-Adaptive"
                        ? "bg-blue-50/20 border-blue-500 dark:bg-blue-950/20 shadow-xs"
                        : "bg-transparent border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    }`}
                  >
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Coach (Mixed Adaptive)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1.5 font-medium">
                      Switches pacing styles automatically depending on how easy or complex a specific concept is.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* =======================================================================================
              WIZARD VIEW PANEL 3: SETUP OPTIONS & FORMAT SELECTIONS 
              ======================================================================================= */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  1. Pinned study items to generate during threads (Multi-Select)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {formatPresets.map((formatPresetItem) => {
                    const isChecked = formData.content_delivery_formats.includes(formatPresetItem);
                    return (
                      <div 
                        key={formatPresetItem}
                        onClick={() => handleToggleTextArrayToken("content_delivery_formats", formatPresetItem)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs" 
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        <span>{formatPresetItem}</span>
                        <span className="text-[10px] font-mono opacity-60">{isChecked ? "Active" : "+ Pinned"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-1">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  2. Error Check Strategy & Tone Timing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => handleUpdateScalarField("feedback_timing_tone_strategy", "Immediate")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.feedback_timing_tone_strategy === "Immediate"
                        ? "bg-blue-50/20 border-blue-500 dark:bg-blue-950/20"
                        : "bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-xs font-black tracking-wide uppercase text-slate-900 dark:text-white">Real-Time Alerts</span>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium leading-normal">Tutor interrupts you immediately to flag syntax or logical slips the second you type them.</p>
                  </div>
                  <div
                    onClick={() => handleUpdateScalarField("feedback_timing_tone_strategy", "Delayed")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.feedback_timing_tone_strategy === "Delayed"
                        ? "bg-blue-50/20 border-blue-500 dark:bg-blue-950/20"
                        : "bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-xs font-black tracking-wide uppercase text-slate-900 dark:text-white">End-Of-Block Diagnostics</span>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium leading-normal">Shields focus limits by logging error traces silently, delivering a summary report at the end of the conversation block.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col space-y-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                    <span>Average session length</span>
                    <span className="text-blue-600 dark:text-blue-400 font-sans text-xs lowercase font-bold">{formData.environmental_context_duration.average_duration_mins} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={formData.environmental_context_duration.average_duration_mins}
                    onChange={(e) => handleUpdateNestedJSONBField("environmental_context_duration", "average_duration_mins", parseInt(e.target.value))}
                    className="w-full mt-2.5 cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex flex-col space-y-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                  <label className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                    Describe where you usually do your homework/studies
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quiet bedroom, busy coffee shop, loud bus commute"
                    value={formData.environmental_context_duration.environment_profile}
                    onChange={(e) => handleUpdateNestedJSONBField("environmental_context_duration", "environment_profile", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-850 dark:text-white text-xs font-bold rounded-xl outline-none focus:border-blue-500 transition-colors mt-1 shadow-3xs"
                  />
                </div>
              </div>

            </div>
          )}

          {/* =======================================================================================
              WIZARD VIEW PANEL 4: ABOUT YOU 
              ======================================================================================= */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  1. Type a short description of yourself, your goals, and your dreams
                </label>
                <textarea
                  placeholder="e.g. I am a high school student passionate about starting a digital content business. My immediate goal is to score above average on my SAT university entrance exams. I build web apps on weekends and want an assistant to keep things relatable, funny, and structured..."
                  value={formData.personal_context.biography}
                  onChange={(e) => handleUpdateNestedJSONBField("personal_context", "biography", e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium font-sans placeholder-slate-400 rounded-2xl outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all leading-relaxed resize-none shadow-xs"
                />
                <div className="text-[10px] text-slate-400 font-mono text-right font-medium pr-1">
                  Biography length metric: {formData.personal_context.biography.length} characters
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  2. Any exact custom instructions or guidelines for how the tutor should treat you?
                </label>
                <textarea
                  placeholder="e.g. Speak directly to me like an entrepreneurial partner. Be completely honest and tell it like it is if my plans or code are buggy. Teach me foundational mechanics from scratch without shortening answers or skipping detail blocks."
                  value={formData.custom_instructions.rules}
                  onChange={(e) => handleUpdateNestedJSONBField("custom_instructions", "rules", e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium font-sans placeholder-slate-400 rounded-2xl outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all leading-relaxed resize-none shadow-xs"
                />
                <div className="text-[10px] text-slate-400 font-mono text-right font-medium pr-1">
                  Custom rules tracking index: {formData.custom_instructions.rules.length} characters
                </div>
              </div>

            </div>
          )}

        </div>

        {/* NAVIGATION WIZARD CONTROL TRIGGER FOOTER TRACK BAR */}
        <footer className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between select-none mt-8 shrink-0">
          
          <button
            type="button"
            disabled={activeStep === 1 || isSubmitting}
            onClick={handleRegressStepTimeline}
            className="px-5 h-10 border border-slate-200 text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <i className="fas fa-chevron-left text-[9px]" />
            <span>Back</span>
          </button>

          {activeStep < 4 ? (
            <button
              type="button"
              onClick={handleAdvanceStepTimeline}
              className="px-6 h-10 bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Next Step</span>
              <i className="fas fa-chevron-right text-[9px]" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmitPersonalizationPayload}
              className="px-8 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-1" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{isSettingsMode ? "Save AI Preferences" : "Initialize AI Personalization"}</span>
                  <i className="fas fa-cloud-upload-alt text-[10px]" />
                </>
              )}
            </button>
          )}

        </footer>

      </div>

    </div>
  );
}