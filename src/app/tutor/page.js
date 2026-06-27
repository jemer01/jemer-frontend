/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY DASHBOARD FEATURE ENGINE — MASTER AI TUTOR PAGE RUNWAY (v2.3.4 LIVE GO STREAM)
 * ================================================================================================
 * Description: Viewport-locked, fixed screen layout coordinator organizing workspace view streams.
 * Fixed Strategy: Re-engineered with flex-col constraints to eliminate page scrolling completely.
 * Optimization Tier: Cache-first validation layers checking localStorage before querying Neon DB resource pools.
 * Sizing Tier: Enforces a symmetric vertical layout matching prompt box parameters (max-w-4xl).
 * Patch Note v2.3.4: Upgraded the relative fetch operation to explicitly pass browser credentials
 * through the request parameters, allowing the transaction to pass Google Cloud Shell's auth proxy.
 * Compliance: 100% complete line-by-line developer code documentation for maximum clarity.
 * ================================================================================================
 */

"use client"; // Enforces client runtime rules to permit state array mutations, browser storage access, and component mounts

import React, { useState, useEffect } from "react"; // Pulls foundational core React state tracking and lifecycle post-mount structures
import AITutorIntro from "@/jemer-components/ui/ai-tutor-intro.jsx"; // Imports the global curriculum suggestion welcome grid
import AIChatInterface from "@/jemer-components/ui/ai-chat-interface.jsx"; // Imports your matched-width interactive chat arena component
import AITutorPromptBox from "@/jemer-components/ui/ai-tutor-prompt-box.jsx"; // Imports your premium hardware-accelerated prompt control execution box
import PersonalizationEngine from "@/jemer-components/ui/personalization.jsx"; // Injects our high-fidelity multi-step wizard onboarding form component

/**
 * Main Interactive AI Tutor Orchestrator Canvas Page Router Component
 */
export default function TutorPage() {
  // ── LAYER 1: CONVERSATIONAL LOG ENGINE STATES ───────────────────────────────────────────────
  // Instantiates an array list tracking active message object logs traveling across child sub-components
  const [chatLog, setChatLog] = useState([]);
  
  // Tracks textual data injected dynamically from introduction card suggestion tiles
  const [injectedText, setInjectedText] = useState("");

  // ── LAYER 2: PERFORMANCE-OPTIMIZED SMART GATING STATE HOOKS ─────────────────────────────────
  // Monitors if the application is actively checking client cache or running remote backend network sweeps
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // Controls the visibility tracking status parameter for the neomorphic notification gateway popup dialog box
  const [showGateModal, setShowGateModal] = useState(false);

  // Toggles the high-priority absolute 100% viewport layout mask layer wrapper for the personalization form
  const [forceFormOverlay, setForceFormOverlay] = useState(false);

  // ── LAYER 3: CACHE-FIRST INTUITION TIMELINE PROFILE VERIFIER (LIFECYCLE ENGINE) ─────────────
  /**
   * Post-mount effect tracking logic. Validates local memory state fields before calling server endpoints.
   * This completely bypasses expensive server roundtrips if the profile has been calibrated previously.
   */
  useEffect(() => {
    // Encapsulate execution loops within a clean serverless background routine to process asynchronous lookups safely
    async function executeSmartOnboardingGateCheck() {
      try {
        // Logs operational state initialization tags straight down the developer execution console
        console.log("[TUTOR GATING CHECK] Auditing student personalization registration keys...");
        
        // UPGRADED STEP: IMMEDIATE CLIENT-SIDE AUTHENTICATION RADAR CHECK
        // Pull down the active cryptographic access signature and unique user UUID tracking tokens out of browser storage
        const activeJwtSessionToken = localStorage.getItem("jemer_session_jwt");
        const activeUserUuidToken = localStorage.getItem("jemer_user_uuid");

        // If either security key identifier is vacant or unallocated, the client is a logged-out visitor. Eject immediately to the gate page.
        if (!activeJwtSessionToken || !activeUserUuidToken) {
          console.warn("[SECURITY REJECTION] Logged-out user detected attempting to access secure runway. Actuating immediate eviction...");
          window.location.href = "/login.html"; // Evict browser context cleanly down to public directory login route
          return; // Terminate execution loops instantly to prevent memory execution trails
        }

        // Pull down the profile completion verification token out of browser local memory spaces
        const localCacheValidationToken = localStorage.getItem("jemer_profile_calibrated");

        // PERFORMANCE CONVERSION GATE: If cache entry hit reads true, exit checker loop instantly
        if (localCacheValidationToken === "true") {
          console.log("[TUTOR GATING CACHE HIT] User profile validated via client memory map. Releasing gateway locks.");
          setIsCheckingProfile(false); // Drop initial system loaders safely
          return; // Terminate execution branch early
        }

        console.log("[TUTOR GATING CACHE MISS] Local token missing. Pulling profile database metrics via API handler... Same method sync verification.");

        // ── 🛡️ PURE RELATIVE ORIGIN PROXY TUNNEL PASSTHROUGH UPGRADE ──
        // Fires a fast background HTTP GET query sequence down to our status checker endpoint.
        // Injected credentials: "include" configuration parameter to ensure that your active browser sessions
        // pass through Google Cloud Shell's proxy domain restrictions without collapsing into a "Failed to fetch" block.
        const remoteServerHandshakeResponse = await fetch("/api/profile/status_check", {
          method: "GET", // High-efficiency resource query action verb configuration
          credentials: "include", // 🔑 CRITICAL PROXY TUNNEL UPGRADE: Forces the browser to forward Google session identification cookies past the proxy fence
          headers: {
            "Authorization": activeUserUuidToken, // Inject UUID directly into standard header fields to guide backend table lookups
            "Content-Type": "application/json"   // Declares JSON structure compliance to the backend API receiver layout
          }
        });

        // UPGRADED STEP: SERVER-SIDE AUTHORIZATION EXCLUSION EVICTION
        // If the server explicitly returns a 401 Unauthorized because of a falsified or expired token signature string, route them back to login
        if (remoteServerHandshakeResponse && remoteServerHandshakeResponse.status === 401) {
          console.warn("[SECURITY EVICTION] Server engine returned 401 Unauthorized status flag. Flushing storage keys and returning user to portal.");
          localStorage.removeItem("jemer_session_jwt"); // Flush session tokens
          localStorage.removeItem("jemer_user_uuid"); // Flush user UUID identifiers
          window.location.href = "/login.html"; // Redirect context out cleanly
          return;
        }

        // DEVELOPER RESILIENCY OVERRIDE BOUNDARY: If route handler responds with 404/500 errors during local development,
        // intercept exception states and gracefully force the onboarding form modal to launch instead of throwing unhandled crashes.
        if (!remoteServerHandshakeResponse || !remoteServerHandshakeResponse.ok) {
          console.warn(`[TUTOR GATING API WARNING] Server endpoint returned un-hydrated configuration. Defaulting to uncalibrated profile mapping rules.`);
          setShowGateModal(true); // Open calibration warning popover layout dialog box
          setIsCheckingProfile(false); // Release application startup loader state
          return; // Kill layout evaluation lines early
        }

        // De-serialize incoming text variables into a readable JSON schema framework structure
        const verificationResultJSON = await remoteServerHandshakeResponse.json();

        // Server inspects all ten new Postgres columns, reporting true only if registration parameters are 100% filled out
        if (verificationResultJSON.isProfileComplete === true) {
          console.log("[TUTOR GATING API VERIFIED] Complete profile records found on Neon DB. Hydrating localStorage cache line.");
          localStorage.setItem("jemer_profile_calibrated", "true"); // Anchor tracking cache token parameter permanently
          setIsCheckingProfile(false); // Turn off background execution parameters
        } else {
          console.warn("[TUTOR GATING INCOMPLETE] Profile fields unhydrated. Triggering beautiful onboarding warnings.");
          setShowGateModal(true); // Fire up the beautiful modal overlay informing the user about personalization profile requirements
          setIsCheckingProfile(false); // Release main interface loader screens
        }

      } catch (networkInterruptionHandshakeFault) {
        console.error("[TUTOR GATING EXCEPTION HANDLER] Network pipeline transaction failed:", networkInterruptionHandshakeFault.message);
        // Robust Fallback: Treat backend handshaking dropouts as uncalibrated state zones to lock interfaces safely
        setShowGateModal(true); // Pop open dialog options to guarantee layout safety metrics are enforced
        setIsCheckingProfile(false); // Drop loader variables
      }
    }

    executeSmartOnboardingGateCheck(); // Trigger the validation routine processing loop execution
  }, []); // Static media tracking bounds vector running precisely once upon path instantiation execution loops

  // ── LAYER 4: ONBOARDING DATA ROUTING ACTIONS CALLBACK HANDLERS ──────────────────────────────
  /**
   * Closes out the popover alert container and invokes the 100% full screen form overlay track frame
   */
  const handleTransitionToCalibrationForm = () => {
    // Shuts off the pop-over system warning prompt dialog container cleanly
    setShowGateModal(false); 
    // Triggers the conditional state hook to switch on the full viewport overlay block canvas layout
    setForceFormOverlay(true); 
  };

  /**
   * Action callback executed cleanly when PersonalizationEngine successfully syncs all 10 columns to Neon DB
   */
  const handlePersonalizationOnboardingSuccess = () => {
    console.log("[ORCHESTRATOR Core Success] Database rows committed. Releasing gate variables.");
    localStorage.setItem("jemer_profile_calibrated", "true"); // Drop validation markers into cache to protect database resources
    setForceFormOverlay(false); // Unmount and lift the 100% full screen layout frame block, releasing the tutor page views
  };

  // ── LAYER 5: CORE UTILITY EVENT PIPELINES ──────────────────────────────────────────────────
  /**
   * Catches selected starter prompt configurations and injects them straight into the input box text state
   * @param {string} promptTextString - The global-focused question chosen by the student on the suggestion card.
   */
  const handleCaptureIntroPromptChoice = (promptTextString) => {
    console.log("[ORCHESTRATOR CORE] Suggestion tile triggered. Packaging text for injection:", promptTextString);
    setInjectedText(promptTextString); // Updates state parameters to feed the prompt box component instantly
  };

  /**
   * Processes outbound user payloads and coordinates real-time streaming connections to Go back-end
   * @param {Object} messagePayload - Complete packed data object emitted from the prompt box execution module.
   */
  const handleProcessOutboundPrompt = async (messagePayload) => {
    console.log("[ORCHESTRATOR CORE] Outbound payload intercepted. Initializing transit lines...", messagePayload);

    // Abort processing operations early if the payload boundary or prompt text content arrives vacant
    if (!messagePayload || !messagePayload.promptText) return;

    // Package and compile the clean user query message block tracking unique parameters
    const userMessageNode = {
      id: `user-msg-${Date.now()}`, // Attach a unique timestamp tracking signature identifier
      sender: "user", // Assigns authorship role to the active student browser profile
      text: messagePayload.promptText // Capture raw text characters passed straight out of the workspace input area
    };

    // Instantiate a standalone unique identity marker token for the real-time AI tutor answer stream node
    const aiMessageId = `ai-msg-${Date.now()}`;

    // Compile the initial empty placeholder AI node structure mapping specialized tracking parameters
    const aiTutorResponseNode = {
      id: aiMessageId, // Bind with precalculated identity timestamp tags
      sender: "ai", // Identifies authorship as the assigned learning system avatar model
      text: "", // Progressively maps visible student-facing markdown content blocks
      reasoning: "", // Progressively aggregates chain-of-thought/reasoning tokens for thinking boxes
      isThinking: true // Flags that the model is actively sorting its computational logic pipelines
    };

    // Synchronously append both nodes into the state log array map to eliminate interface stuttering layout jumps
    setChatLog((prevLog) => [...prevLog, userMessageNode, aiTutorResponseNode]);
    
    // Flush input text fields completely to clean workspace buffers for the upcoming student turn
    setInjectedText("");

    // ── GO CLOUD RUN ROUTER CONFIGURATION CHANNEL ──
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const ENDPOINT_PATH = `${BACKEND_URL}/api/v1/tutor/stream`;

    try {
      // Pull operational clearance authentication tokens straight from client browser memory maps
      const activeJwtSessionToken = localStorage.getItem("jemer_session_jwt") || "";
      const sessionId = "00000000-0000-0000-0000-000000000000"; // Default baseline placeholder transaction UUID token

      // Execute high-performance fetch primitive to establish real-time HTTP stream connections
      const serverStreamResponse = await fetch(ENDPOINT_PATH, {
        method: "POST", // Standard network transit execution verb instruction
        headers: {
          "Content-Type": "application/json", // States payload data type structure parameters explicitly
          "Authorization": `Bearer ${activeJwtSessionToken}`, // Injects student cryptographic authorization signatures
        },
        // Transmit the precise structural payload configuration variables required by the Go monolithic router schema
        body: JSON.stringify({
          session_id: sessionId,   // Links active query transaction lines straight to postgres tracking indices
          tutor_id: messagePayload.selectedTutor || "jay", // Selects target pedagogical persona context mapping keys
          user_prompt: messagePayload.promptText, // Delivers literal raw text characters downstream to compilers
        }),
      });

      // Intercept and throw errors early if the backend proxy returns an explicit network exception status code
      if (!serverStreamResponse.ok) {
        throw new Error(`Server execution failure status code: ${serverStreamResponse.status}`);
      }

      // Instantiate a hardware-level stream reader handle directly on the response body data stream thread
      const streamBodyReader = serverStreamResponse.body.getReader();
      
      // Instantiate a standard TextDecoder primitive configured to cleanly decode binary packet arrays back into string characters
      const characterDecoder = new TextDecoder("utf-8");
      
      // Local tracking allocation buffer tracking fragmented line entries across network transfer frames
      let streamingRowBuffer = "";

      // Enter continuous high-performance extraction loop to drain inbound streaming packets
      while (true) {
        // Read next binary chunk array segment off the host socket adapter network card allocation
        const { value: packetChunkBytes, done: isNetworkClosed } = await streamBodyReader.read();
        
        // Break out of data extraction loop structures naturally the moment the connection terminates or finishes data cycles
        if (isNetworkClosed) {
          break;
        }

        // Decode binary buffer segments progressively and add text blocks to the local processing buffer layout
        streamingRowBuffer += characterDecoder.decode(packetChunkBytes, { stream: true });

        // Divide extracted stream data segments using standard Server-Sent Event newline line split rules
        const streamLines = streamingRowBuffer.split("\n");
        
        // Isolate trailing incomplete lines back into the buffer map to guarantee boundary safety across fragmented arrivals
        streamingRowBuffer = streamLines.pop() || "";

        // Evaluate unpacked protocol payload rows line-by-line frame-by-frame
        for (const rawStreamLine of streamLines) {
          // Trim redundant padding matrices to evaluate characters safely against criteria tests
          const trimmedStreamLine = rawStreamLine.trim();

          // Skip empty spacing indicators used natively by Server-Sent Event networks to segment packets
          if (trimmedStreamLine === "") continue;

          // Terminal Pattern: If the Go backend emits a [DONE] statement string, toggle off all residual logic thinking clocks
          if (trimmedStreamLine === "data: [DONE]") {
            setChatLog((prevLog) =>
              prevLog.map((msgItem) =>
                msgItem.id === aiMessageId ? { ...msgItem, isThinking: false } : msgItem
              )
            );
            break;
          }

          // Intercept active data packet rows containing core JSON string values
          if (trimmedStreamLine.startsWith("data:")) {
            // Strip the standard event string prefix to cleanly expose the raw text JSON object properties underneath
            const cleanedJsonContentString = trimmedStreamLine.replace("data:", "").trim();

            try {
              // Parse the cleaned JSON text block directly into a readable system data token object map
              const unpackedChunkMetrics = JSON.parse(cleanedJsonContentString);

              // ── SYSTEM CHANNEL ROUTER INTERCEPT MATRIX ──

              // CASE A: Handle incoming chain-of-thought/deep reasoning internal computation tokens
              if (unpackedChunkMetrics.reasoning_content) {
                setChatLog((prevLog) =>
                  prevLog.map((msgItem) =>
                    msgItem.id === aiMessageId
                      ? { ...msgItem, reasoning: msgItem.reasoning + unpackedChunkMetrics.reasoning_content }
                      : msgItem
                  )
                );
              }

              // CASE B: Handle visible conversational academic content text structures
              if (unpackedChunkMetrics.content) {
                setChatLog((prevLog) =>
                  prevLog.map((msgItem) =>
                    msgItem.id === aiMessageId
                      ? { ...msgItem, isThinking: false, text: msgItem.text + unpackedChunkMetrics.content }
                      : msgItem
                  )
                );
              }

            } catch (payloadParseAnomalyError) {
              // Capture malformed network pak files safely without throwing main system environment thread locks
              console.warn("⚠️ Stream chunk unmarshalling phase skipped due to syntax structure mismatch:", payloadParseAnomalyError, cleanedJsonContentString);
            }
          }
        }
      }

    } catch (criticalPipelineCommunicationException) {
      console.error("❌ Critical streaming communication infrastructure crash occurred:", criticalPipelineCommunicationException);
      
      // Inject a student-friendly system error banner directly inline inside the specific message slot to preserve interface layout continuity
      setChatLog((prevLog) =>
        prevLog.map((msgItem) =>
          msgItem.id === aiMessageId
            ? { 
                ...msgItem, 
                isThinking: false, 
                text: `❌ **Connection Timeout Error:** Unable to establish reliable streaming link with Cloud Run. ${criticalPipelineCommunicationException.message || "Please verify your local Go development server execution states and try again."}` 
              }
            : msgItem
        )
      );
    }
  };

  /**
   * Intercepts chat interface edits to stop generations and return text back to inputs
   * @param {string} rawPromptTextString - The specific prompt payload chosen for quick rewrites.
   */
  const handleExecuteInterruptedEditRollback = (rawPromptTextString) => {
    console.log("[ORCHESTRATOR CORE] Processing interactive edit request. Returning string to input arena:", rawPromptTextString);
    setInjectedText(rawPromptTextString); // Inject text right back into the prompt box state
  };

  /**
   * Clears out downstream conversational threads and triggers a fresh model iteration loop
   * @param {Object} targetUserPromptRecord - The structural query block referencing the requested subject track.
   */
  const handleProcessResponseRegeneration = (targetUserPromptRecord) => {
    console.log("[ORCHESTRATOR CORE] Restart token authorized. Regenerating response row for prompt text:", targetUserPromptRecord.text);
    
    // Simulate a fresh transmission cycle by feeding the text right back into our core processing pipeline
    handleProcessOutboundPrompt({
      promptText: targetUserPromptRecord.text, // Re-pass original prompt string values
      selectedTutor: "jay" // Fall back onto baseline settings safely
    });
  };

  // ── LAYER 6: UNIVERSAL COMPONENT VARIABLE EVALUATIONS SCOPE ────────────────────────────────
  // Evaluates state layout rules dynamically: true if messages are present, false if the timeline is unstarted.
  // This top-level variable is now explicitly declared here to neutralize runtime ReferenceError vulnerabilities.
  const isConversationActive = chatLog && chatLog.length > 0;

  // ── LAYER 7: ISOLATED LOW-LATENCY PROFILE LOADING VIEW MASK ─────────────────────────────────
  // Locks the screen into a neat, layout-shift-free loading runway while validating local memory state parameters
  if (isCheckingProfile) {
    return (
      <div className="h-full w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center select-none">
        <div className="text-center font-mono space-y-2 text-xs text-slate-400 dark:text-slate-500">
          <i className="fas fa-circle-notch fa-spin text-lg text-blue-600 mb-1" />
          <p className="uppercase tracking-widest font-black">Calibrating Jemer Tutor Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    // 🏛️ CENTRAL VIEWPORT LOCKDOWN CORE: Sets up a strict full-height, flex-column inner panel layout.
    // Clamping `h-full overflow-hidden` blocks window stretching, providing an immediate all-in-one screen presentation view.
    <div className="h-full w-full flex flex-col justify-between overflow-hidden p-2 sm:p-4 md:p-6 max-w-4xl mx-auto relative">
      
      {/* ── ZONE 1: SEGMENTED INTERNAL SCROLL TRAY ── */}
      {/* Takes up all active center space and handles scrolling independently, preventing the prompt box from getting pushed away. */}
      <div className="flex-1 w-full overflow-y-auto pr-1 scrollbar-none pb-4 flex flex-col min-h-0 justify-start">
        {isConversationActive ? (
          // Renders your unified aligned chat interface if messages are flowing through logs
          <AIChatInterface 
            activeChatLog={chatLog} 
            onInterruptedEdit={handleExecuteInterruptedEditRollback}
            onRegenerateResponse={handleProcessResponseRegeneration}
          />
        ) : (
          // Centers the welcome suggestions block vertically if no chat session is active yet
          <div className="my-auto w-full">
            <AITutorIntro onSelectPrompt={handleCaptureIntroPromptChoice} />
          </div>
        )}
      </div>

      {/* ── ZONE 2: STATIONARY BOUNDED BASELINE PROMPT ENGAGEMENT TRACK ── */}
      {/* Clamped inline as a non-shrinking element. It sits safely at the bottom margin inside full view at all times. */}
      <div className="w-full shrink-0 pt-2 pb-2 block z-20 bg-transparent">
        <AITutorPromptBox 
          onSendMessage={handleProcessOutboundPrompt} 
          injectedPromptText={injectedText} // Connect structural prop mappings to the prompt box engine
        />
      </div>

      {/* =======================================================================================
          💎 UX OVERHAUL DESIGN ELEMENT A: PROGRESSIVE ONBOARDING VERIFICATION POP-OVER GATING MODAL
          ====================================================================================== */}
      {/* Fades cleanly into view when backend records return an uncalibrated flag, pausing layout usage contextually */}
      {showGateModal && (
        <div className="fixed inset-0 z-[60] bg-slate-950/10 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <section 
            aria-labelledby="onboarding-gate-title"
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-5 select-none"
          >
            {/* Visual Micro-Calibration Gear Vector Asset Icon Grid */}
            <div className="w-12 h-12 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-2xl border border-blue-100/30 shadow-inner flex items-center justify-center text-base mx-auto">
              <i className="fas fa-sliders-h" />
            </div>

            {/* Explanatory Contextual Content Text Area Headers */}
            <div className="space-y-1.5">
              <h2 id="onboarding-gate-title" className="text-lg font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Profile Setup Required!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium leading-relaxed px-1">
                Welcome to Jemer Academy! To deliver highly tailored study tracks and context-aware analogies, you must configure your personalization matrix before utilizing conversational tutors.
              </p>
            </div>

            {/* Interaction Onboarding Form Transition Anchor Link Trigger */}
            <button
              type="button"
              onClick={handleTransitionToCalibrationForm}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-500/10 active:scale-[0.98] cursor-pointer"
            >
              Configure Learning Profile
            </button>
          </section>
        </div>
      )}

      {/* =======================================================================================
          💎 UX OVERHAUL DESIGN ELEMENT B: 100% VISUAL VIEWPORT LAYER FORM ENVELOPE WRAPPER
          ======================================================================================= */}
      {/* FORCE LAYOUT OVERRIDE: Bound at a superior stacking position (z-[100]) using fixed inset bounds.
          This completely expands across 100% of the display monitor, masking out the master top Navbar, 
          left side rails, and conversational timeline trays to force user form completion parameters! */}
      {forceFormOverlay && (
        <div className="fixed inset-0 w-screen h-screen bg-slate-50 dark:bg-slate-950 z-[100] overflow-y-auto p-3 sm:p-6 md:p-10 transition-colors duration-300 flex items-start justify-center">
          <div className="w-full my-auto">
            {/* Mount our production personalization form component, wiring down the compilation complete event trigger */}
            <PersonalizationEngine onSaveComplete={handlePersonalizationOnboardingSuccess} />
          </div>
        </div>
      )}

    </div>
  );
}