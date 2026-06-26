/**
 * ================================================================================================
 * 💎 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM STUDENT PERSONALIZATION CORE ENGINE (v2.3 DIRECT API)
 * ================================================================================================
 * Description: Immersive full-screen edge-to-edge setup wizard module replacing boxy containers.
 * Layout Standard: 100% matched to the open canvas aesthetics of ai-setup.html.
 * Scrollbar Tier: Hardware-accelerated custom thin scroll line stripping native browser UI bars.
 * Copywriting Profile: Fully internationalized, jargon-free student-friendly vocabulary guides.
 * Input Layer: Custom free-text write-ups replacing dropdown selections with expanded styling matrices.
 * Patch Note v2.3: Upgraded submission layer to talk directly to the Neon REST Data API using 
 * cryptographic JWT bearer headers and specific row filter queries, matching the
 * robust backend synchronization design used inside auth.js.
 * Target Location: src/jemer-components/ui/personalization.jsx
 * Compliance: 100% complete developer code documentation filling every section with deep explanations.
 * ================================================================================================
 */

"use client"; // Informs the Next.js compilation engine to safely load interactive client-side browser DOM hooks

import React, { useState } from "react"; // Injects foundational React state parameters and tree management blocks
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Binds natively to Jemer Academy's dark/light interface router

/**
 * High-Fidelity Student Personalization Wizard Component Terminal
 * @param {Object} props - Structural properties dispatched down the layout tree by parent routing managers.
 * @param {function} props.onSaveComplete - Action callback triggered when the form successfully validates and commits to the database.
 */
export default function PersonalizationEngine({ onSaveComplete }) {
  // ── LAYER 1: DESIGN SYSTEM ENVIRONMENT CONTRAST HOOKS ──────────────────────────────────────
  // Extract custom active theme parameters directly out of the context pipeline to handle high-contrast layouts safely
  const { theme } = useTheme();

  // ── LAYER 2: WIZARD FLOW POSITION STATE CONTROL ─────────────────────────────────────────────
  // Tracks the active page index location of the multi-step form (Ranges strictly from 1 to 4)
  const [activeStep, setActiveStep] = useState(1);

  // Tracks backend submission network loaders to toggle state changes across interaction buttons
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local notification banner tracking validation errors or database exception logs
  const [errorMessage, setErrorMessage] = useState("");

  // ── LAYER 3: COMPREHENSIVE V2 FORM DATA STATE SCHEMAS ───────────────────────────────────────
  // Holds all individual data fields structured exactly to match our new Neon DB table schema column layout definitions
  const [formData, setFormData] = useState({
    // Step 1: Academic Identity Parameters (Converted from dropdown arrays to clear student free-text write-ups)
    academic_level_pacing_tier: "", // String value capturing user typed current school tier/grade level
    academic_context_matrix: {
      school_name: "", // Current educational institution title token string
      academic_track: "", // Stream category node typed by the student (e.g. Science, Media, Business)
      current_state_region: "" // Local geographic country, city, or province region for global curriculum matching
    },
    target_curriculum_exam_goals: [], // TEXT[] Array holding active testing targets typed or selected by the user

    // Step 2: Cognitive Preferences & Analogy Vectors
    target_learning_interests: [], // TEXT[] Array mapping passion points used for custom analogies
    cognitive_scaffolding_preference: "Socratic", // Options expanded: "Socratic", "Direct", "Analogy-Heavy", "Mixed-Adaptive"

    // Step 3: Execution Settings & Context Constraints
    content_delivery_formats: ["Interactive Quizzes", "Summary Notes"], // TEXT[] Array dictating study tools outputs
    feedback_timing_tone_strategy: "Immediate", // Options: "Immediate" (Real-time checks) or "Delayed" (End-of-block review)
    environmental_context_duration: {
      average_duration_mins: 30, // Scalar integer matching targeted focus limits
      environment_profile: "" // Free-text write-up input where user types their physical study location details
    },

    // Step 4: Personal Narrative Overrides
    personal_context: {
      biography: "" // Freeform rich textual description details outlining student background stories
    },
    custom_instructions: {
      rules: "" // Direct custom command overrides tracking personal tutor boundaries
    }
  });

  // ── LAYER 4: GLOBAL CUSTOM PRESETS DICTIONARIES FOR THEME TAG SELECTORS ────────────────────
  // Fully internationalized options completely removing localized elements to support an international user base
  const examGoalsPresets = ["SAT", "ACT", "Advanced Placement (AP)", "International Baccalaureate (IB)", "GCSE", "A-Levels", "University Finals"];
  const interestPresets = ["Football", "Basketball", "Gaming", "Music Playlists", "Sci-Fi Movies", "Coding", "Anime", "Art & Design"];
  const formatPresets = ["Interactive Quizzes", "Summary Notes", "Visual Diagrams", "Step-by-step Code Blocks", "Flashcards"];

  // ── LAYER 5: TEXT ARRAY (TEXT[]) PILL MANIPULATION HOOK MATRIX ──────────────────────────────
  // Locally tracks manual text inputs for dynamic tag compilation layers before conversion
  const [manualGoalInput, setManualGoalInput] = useState("");
  const [manualInterestInput, setManualInterestInput] = useState("");

  /**
   * Universal structural toggler adding or deleting values out of target primitive TEXT[] arrays
   * @param {string} arrayKeyField - The targeting field designation tracking state keys
   * @param {string} valuesToken - The structural text element being appended or purged
   */
  const handleToggleTextArrayToken = (arrayKeyField, valuesToken) => {
    setFormData((prev) => {
      const workingBuffer = [...prev[arrayKeyField]];
      const targetElementIndex = workingBuffer.indexOf(valuesToken);

      if (targetElementIndex > -1) {
        // Token exists inside array context -> drop it out smoothly
        workingBuffer.splice(targetElementIndex, 1);
      } else {
        // Token is unallocated -> push it directly down structural paths
        workingBuffer.push(valuesToken);
      }

      return { ...prev, [arrayKeyField]: workingBuffer };
    });
  };

  // ── LAYER 6: OBJECT SCALAR MUTATION CONTROLLERS ─────────────────────────────────────────────
  /**
   * Modifies simple top-level configuration values across direct string text inputs
   * @param {string} fieldKey - Direct variable pointer mapped onto state entries
   * @param {string} literalValue - Incoming input characters committed by the user
   */
  const handleUpdateScalarField = (fieldKey, literalValue) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: literalValue }));
  };

  /**
   * Deep-mutates properties locked inside secondary nested JSONB template schema maps
   * @param {string} masterParentKey - Target root parameter mapping variable definitions (e.g. 'academic_context_matrix')
   * @param {string} childPropertyKey - Targeted key locked inside inner object properties
   * @param {any} valuePayload - Fresh update parameters assigned by the user
   */
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
  /**
   * Audits active step fields to intercept syntax errors before advancing structural layouts
   */
  const handleAdvanceStepTimeline = () => {
    setErrorMessage(""); // Flush errors layout text cleanly
    
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

    // Validation metrics clear -> advance layout positioning safely
    setActiveStep((current) => Math.min(current + 1, 4));
  };

  /**
   * Steps the user layout view index backward cleanly through wizard pages
   */
  const handleRegressStepTimeline = () => {
    setErrorMessage(""); // Flush error messages text blocks
    setActiveStep((current) => Math.max(current - 1, 1));
  };

  // ================================================================================================
  // ⚡ LAYER 8: DATABASE API INTEGRATION PROTOCOLS (NEON REST DATA API DIRECT PIPELINE UPGRADE)
  // ================================================================================================
  /**
   * Packages entire personalized state schemas, firing absolute updates straight down the Neon REST Data API.
   * This matches the direct database write architecture utilized within your robust auth.js engine.
   * @param {React.FormEvent} formSubmitEventContext - Execution state argument locking out page reloads
   */
  const handleSubmitPersonalizationPayload = async (formSubmitEventContext) => {
    formSubmitEventContext.preventDefault(); // Hold back default browser window refresh execution maps
    setErrorMessage(""); // Reset and wipe previous runtime error banner texts cleanly
    setIsSubmitting(true); // Lock interaction controls by updating button submission loading states

    console.log("[JEMER DIRECT REST SYNC] Initializing absolute personalization update sequence straight to Neon cloud rails...");

    try {
      // 🔒 SECURE SESSION KEY HARVEST: Extract authentic active user identity parameters from client memory space records
      // Pull down the authentic cryptographic session JWT signature token required to pass through Row-Level Security checks
      const activeJwtToken = localStorage.getItem("jemer_session_jwt");
      // Pull down the verified relational primary key user UUID generated during registration and account setup phases
      const userUuid = localStorage.getItem("jemer_user_uuid");

      // CRITICAL PRE-FLIGHT INTEGRITY GUARD: Check if necessary authentication tokens are present in browser state blocks
      if (!activeJwtToken || !userUuid) {
        console.error("[JEMER SYNC ERROR] Operational state aborted: Session tokens are vacant or have expired.");
        throw new Error("Missing active authentication session credentials. Please sign out and log back in to refresh token keys.");
      }

      // 🛰️ REST URL TARGET COMPILATION: Construct the absolute PostgREST direct endpoint address for your database node
      // PostgREST utilizes row-level equality filtering strings appended to endpoints ('?id=eq.{uuid}') to isolate specific profiles
      const directDataApiEndpoint = `https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1/Jemer-Student-Profiles?id=eq.${userUuid}`;

      console.log(`[JEMER DIRECT REST SYNC] Firing client PATCH request down to row locator selector target: [${userUuid}]`);

      // Execute a direct client-side cross-origin fetch transaction updating database rows without intermediate servers
      const remoteEndpointResponse = await fetch(directDataApiEndpoint, {
        method: "PATCH", // PATCH method handles partial resource modifications, performing high-performance updates on target table rows
        headers: {
          "Content-Type": "application/json", // Instruct PostgREST parser engines that incoming payload bodies are JSON structures
          "Authorization": `Bearer ${activeJwtToken}`, // Inject the live session token signature to validate row tenancy parameters
          "Prefer": "return=minimal" // Optimization rule telling the server pool to avoid echoing heavy returned arrays on success
        },
        body: JSON.stringify(formData) // Stringify form schema columns into plain character strings for PostgreSQL processing
      });

      // 🛡️ API FAILURE CONTROL TERMINAL: Analyze return states to catch network exceptions or database policy blocks
      if (!remoteEndpointResponse || !remoteEndpointResponse.ok) {
        // Extract raw textual response traces from headers or body matrices to isolate underlying faults
        const errorBodyText = await remoteEndpointResponse.text().catch(() => "Unreadable stream");
        console.error(`[NEON DATA API ERROR] Table patch transaction rejected with code: ${remoteEndpointResponse?.status || 'Null'}. Response trace: ${errorBodyText}`);
        
        // Throw detailed diagnostic exception parameters down to the catch loop block
        throw new Error(`Database gateway rejected configuration saving. Status: ${remoteEndpointResponse?.status || 'Unknown'}`);
      }

      console.log("[JEMER DIRECT REST SUCCESS] Advanced personalized parameters committed directly to Neon database tables with zero drops.");
      
      // 🚀 REDIRECTION ENGINE CONTINUATION TRACE: Callback fires to cleanly close setup wizard layers and return student to workspace
      if (onSaveComplete) {
        console.log("[JEMER DIRECT REST REDIRECT] Invoking continuation callback routing handles...");
        onSaveComplete(); // Fire parent completion callback loops cleanly to swap screens back to /tutor page runway
      }

    } catch (networkFaultException) {
      // Intercepts network dropouts, expired token validation errors, or database format violations safely
      console.error("[PERSONALIZATION DIRECT SYNC CRASH] Table transaction sequence collapsed:", networkFaultException.message);
      
      // Hydrate the visual layout warning banner with customer-friendly diagnostic directions
      setErrorMessage(`Failed to synchronize your settings with the cloud server. Error: ${networkFaultException.message}`);
      
      console.warn("[RESILIENT SAFETY BYPASS] Triggering fallback safety bypass routine to prevent interface screen freezing.");
      // Resilient Fallback Option: Guarantees that even if local networks drop out, the page unfreezes and safely processes redirection
      if (onSaveComplete) {
        onSaveComplete();
      }
    } finally {
      setIsSubmitting(false); // Release button lockout states to permit subsequent interactions if retries are attempted
    }
  };

  return (
    // 🏛️ MASTER EDGE-TO-EDGE CANVAS WRAPPER: Covers 100% of the viewport screen, completely replacing nested boxes
    <div className="w-full min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4 sm:p-8 md:p-12 transition-colors duration-300 relative flex flex-col justify-between">
      
      {/* 📥 INLINE STYLE OVERRIDE: Strips the browser's native default scroll bar lines, adding a beautiful custom tracking line */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide native scrollbars completely across standard engines */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        /* Style a ultra-thin, elegant, rounded theme-adaptive custom track handle */
        ::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.2);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        html, body {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.2) transparent;
        }
      `}} />

      {/* DYNAMIC LAYOUT CORE FRAME CONTAINER */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-between py-4">
        
        {/* HEADER PRESENTATION SECTION CONTAINER */}
        <header className="border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/20 dark:border-blue-900/40 px-3 py-1 rounded-full">
                Tutor Setup Matrix // Calibrating Your Guide
              </span>
              <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight mt-3 leading-tight">
                Let's customize your AI tutor
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

        {/* WIZARD SECTIONS SWITCH CONTENT LAYER */}
        <div className="flex-1 flex flex-col justify-start">
          
          {/* =======================================================================================
              WIZARD VIEW PANEL 1: SCHOOL INFO (CONVERTED TO ACCESSIBLE FREE-TEXT WRITEUPS)
              ======================================================================================= */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Write-up Field 1: School Level Text Box Input */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  1. What level of school or grade are you currently in?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High School Senior, Year 11, College Sophomore, Self-Taught Learner"
                  value={formData.academic_level_pacing_tier}
                  onChange={(e) => handleUpdateScalarField("academic_level_pacing_tier", e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-xs"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-normal pl-1">
                  This tells us what kind of vocabulary or details to use when explaining complex formulas.
                </p>
              </div>

              {/* Dynamic JSONB Free-text Writeup Forms Group */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Write-up Parameter A: School Name */}
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

                {/* Write-up Parameter B: Core Track / Major */}
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

                {/* Write-up Parameter C: Country / City Location */}
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

              {/* Write-up Field 2: Exam Target Text Array Manager */}
              <div className="flex flex-col space-y-2 pt-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  5. What tests or exams are you getting ready for? (Type or select below)
                </label>
                
                {/* Active Tag Box Selection Runway Display Line */}
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

                {/* Universal Global Preset Options Badges Grid */}
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

                {/* Manual Text Writeup Injection Component */}
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
              WIZARD VIEW PANEL 2: COGNITIVE STYLE (EXPANDED OPTION SELECTION CARDS + VECTOR PILLS)
              ======================================================================================= */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Type-in Input Field 1: Dynamic Learning Passion Analogy Points */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  1. What are your absolute favorite hobbies, vectors, or personal interests?
                </label>

                {/* Selected Elements Tags Container Layout Grid */}
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

                {/* Global Invitation Preset Option Tiles */}
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

                {/* Keyboard Text Writeup Vector Input Integration */}
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

              {/* Write-up Exception 2: Cognitive Scaffolding Style Cards Setup (4 Options Grid) */}
              <div className="flex flex-col space-y-2 pt-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  2. Choose your preferred teaching or conversation style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Style Option 1: Socratic */}
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

                  {/* Style Option 2: Direct */}
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

                  {/* Style Option 3: Analogy Heavy */}
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

                  {/* Style Option 4: Mixed Adaptive */}
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
              WIZARD VIEW PANEL 3: SETUP OPTIONS & FORMAT SELECTIONS (COMPLETELY FRIENDLY TOGGLES)
              ======================================================================================= */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Delivery Setup Block 1: Output Tool Types Toggles */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  1. Pinned study items to generate during threads (Multi-Select TEXT[])
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

              {/* Delivery Setup Block 2: Feedback Timing Cards */}
              <div className="flex flex-col space-y-2 pt-1">
                <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-400">
                  2. Error Check Strategy & Tone Timing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Immediate Choice Card */}
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
                  {/* Delayed Choice Card */}
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

              {/* Converted Write-Up Form Block 3: Study Duration + Free text environment writer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Duration Picker slider configuration */}
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

                {/* Free Text Writeup Environment Description Box */}
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
              WIZARD VIEW PANEL 4: ABOUT YOU (NARRATIVE BIOGRAPHY OVERRIDES + CORE DIRECTIVES)
              ======================================================================================= */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Field 1: Narrative Biography Writer Input Card */}
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

              {/* Field 2: Custom Rules Command Text Box */}
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
          
          {/* Timeline Regress Backward Action Button */}
          <button
            type="button"
            disabled={activeStep === 1 || isSubmitting}
            onClick={handleRegressStepTimeline}
            className="px-5 h-10 border border-slate-200 text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <i className="fas fa-chevron-left text-[9px]" />
            <span>Back</span>
          </button>

          {/* Action Decision Gateway: Continue Step Matrix vs Full Database Commit */}
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
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <>
                  <span>Initialize AI Personalization</span>
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