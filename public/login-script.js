/**
 * ========================================================================
 * 🧠 JEMER ACADEMY AUTHENTICATION RUNTIME ENGINE (PRODUCTION GRADE V2.0)
 * ========================================================================
 * Description: Client-side lifecycle management, input verification checks,
 * password visibility toggling, and interface routing transitions.
 * Tech Stack Consistency: Pure decoupled Vanilla ES6 JavaScript architecture.
 * Integration Stack: Neon Auth Service Connector with JemerAuth Master Engine.
 * * ── V2.0 PATCH NOTES ───────────────────────────────────────────────────
 * [UPGRADE 1] Migrated simulated login timeouts to the live Neon Auth backend.
 * [UPGRADE 2] Connected form stream straight to window.JemerAuth.signInStudent.
 * [UPGRADE 3] Added an ultra-premium, "grandma-friendly" error notification 
 * modal with smooth micro-animations, clear icons, and warm explanatory copy.
 * ========================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. DOM CORE DOM ELEMENTS ACQUISITION MATRIX
  // ==========================================================================
  
  // Grab primary validation form wrapper and active field nodes
  const loginForm = document.getElementById("master-login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  
  // Custom interface alert panel wrappers (for legacy support inline alerts)
  const globalAlertBox = document.getElementById("login-global-alert-box");
  const alertTextNode = document.getElementById("global-alert-text-node");

  // ==========================================================================
  // 2. HARDWARE ACCELERATED INFINITE LANDING SLIDESHOW LOOP CONTROLLER
  // ==========================================================================
  
  // Acquire branding slideshow nodes (Must align exactly with signup-script setup)
  const slideImages = document.querySelectorAll(".slideshow-image");
  const slideDots = document.querySelectorAll(".slide-dot");
  let activeSlideIndex = 0; // Track the currently active background slider index
  const slideDuration = 4000; // Fixed interval threshold set to 4000ms (4 seconds per loop)

  /**
   * Orchestrates infinite background visual shifts by re-assigning activation utility attributes.
   */
  function executeSlideshowCycle() {
    // Drop execution sequence loops if the layout collapses the graphic canvas entirely (e.g., Mobile Screens)
    if (slideImages.length === 0) return;

    // Remove active formatting classes from the current running foreground index element
    slideImages[activeSlideIndex].classList.remove("active-slide");
    slideImages[activeSlideIndex].classList.add("opacity-0");
    
    // Adjust layout alignment markers on corresponding tracker dot nodes
    slideDots[activeSlideIndex].classList.remove("w-8", "bg-white");
    slideDots[activeSlideIndex].classList.add("w-2", "bg-white/40");

    // Advance index tracking counts, utilizing a modulus operation limit loop parameter check to cycle cleanly
    activeSlideIndex = (activeSlideIndex + 1) % slideImages.length;

    // Apply visibility parameters to the newly selected background target component structure
    slideImages[activeSlideIndex].classList.add("active-slide");
    slideImages[activeSlideIndex].classList.remove("opacity-0");

    // Hydrate width scaling dynamics to the newly activated navigational tracker dot element
    slideDots[activeSlideIndex].classList.remove("w-2", "bg-white/40");
    slideDots[activeSlideIndex].classList.add("w-8", "bg-white");
  }

  // Trigger continuous recurring clock executions governing the interactive image frame engine
  if (slideImages.length > 0) {
    setInterval(executeSlideshowCycle, slideDuration);
  }

  // ==========================================================================
  // 3. REAL-TIME INPUT FIELD VALIDATION DEFENSE LOOPS
  // ==========================================================================

  /**
   * Strips away invalid styling states on field components upon text inputs.
   * @param {HTMLElement} inputNode - Target structural field input.
   */
  function clearFieldValidationErrorState(inputNode) {
    inputNode.classList.remove("input-field-error");
    const parentContainerElement = inputNode.parentElement;
    if (parentContainerElement) {
      const activeErrorMessageString = parentContainerElement.querySelector(".input-error-msg");
      if (activeErrorMessageString) activeErrorMessageString.classList.add("hidden");
    }
  }

  /**
   * Appends warning configurations down to target fields failing logic constraints.
   * @param {HTMLElement} inputNode - Target structural field input.
   */
  function applyFieldValidationErrorState(inputNode) {
    inputNode.classList.add("input-field-error");
    const parentContainerElement = inputNode.parentElement;
    if (parentContainerElement) {
      const activeErrorMessageString = parentContainerElement.querySelector(".input-error-msg");
      if (activeErrorMessageString) activeErrorMessageString.classList.remove("hidden");
    }
  }

  // Listen for text input modifications to clean up error highlights instantly while typing
  document.addEventListener("input", function (event) {
    if (event.target && event.target.classList.contains("onboarding-input")) {
      clearFieldValidationErrorState(event.target);
      
      // Concurrently fold away the global error banner tracking system checks if the user updates content
      if (globalAlertBox) globalAlertBox.classList.add("hidden");
    }
  });

  // ==========================================================================
  // 4. INTERACTIVE ACCESSIBILITY SETTINGS (PASSWORD REVEAL MODULE)
  // ==========================================================================

  // Access eye toggle button listeners to shift input stream mask contexts safely
  document.addEventListener("click", function (event) {
    const toggleTriggerElement = event.target.closest("#toggle-login-pwd-visibility");
    if (!toggleTriggerElement) return;

    const operationalEyeIconElement = document.getElementById("login-eye-icon-target");

    if (passwordInput && operationalEyeIconElement) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        operationalEyeIconElement.className = "far fa-eye-slash text-sm";
      } else {
        passwordInput.type = "password";
        operationalEyeIconElement.className = "far fa-eye text-sm";
      }
    }
  });

  // ==========================================================================
  // 5. 🧸 GRANDMA-FRIENDLY BEAUTIFUL ERROR NOTIFICATION MODAL ENGINE
  // ==========================================================================

  /**
   * Generates and mounts a friendly, ultra-premium error alert modal directly into the DOM body.
   * Uses clear comforting language, animated bounce indicators, and warm action dismissals.
   * @param {string} rawServerErrorMessage - Direct response message from Better Auth database nodes.
   */
  function triggerGrandmaFriendlyErrorModal(rawServerErrorMessage) {
    console.log("[LOGIN INTERFACE ENGINE] Launching ultra-accessible error notification modal...");

    // ── STEP A: DETECT AND REWRITE INTIMIDATING TECHNICAL JARGON ────────────────────────────
    let readableTenderAdvice = "";
    let simpleMainMessage = "Let's double check your details, dear!";

    const lowerCaseError = rawServerErrorMessage.toLowerCase();

    // Map scary tech speak into soft, actionable advice that even a grandparent will feel comfortable with
    if (lowerCaseError.includes("credential") || lowerCaseError.includes("password") || lowerCaseError.includes("incorrect")) {
      simpleMainMessage = "Spelling check, sweetie! 🧸";
      readableTenderAdvice = "Either your email or password has a tiny spelling mistake in it. It happens to the best of us! Take a deep breath, verify your spelling letters slowly, and try typing it again.";
    } else if (lowerCaseError.includes("network") || lowerCaseError.includes("fetch") || lowerCaseError.includes("failed")) {
      simpleMainMessage = "Oh dear, our internet is sleepy! 🌐";
      readableTenderAdvice = "It looks like your connection has took a tiny nap. Check if your Wi-Fi is switched on and glowing nicely, then we can give this another go together.";
    } else if (lowerCaseError.includes("not found") || lowerCaseError.includes("no user")) {
      simpleMainMessage = "Hmm, let's look for your folder! 📁";
      readableTenderAdvice = "We couldn't locate a learning folder for that email. It's totally fine! You might need to press 'Create an account safely' below to establish a new profile.";
    } else {
      simpleMainMessage = "Let's make a tiny adjustment! ✨";
      readableTenderAdvice = "Our security doors need us to review our input spaces. Let's make sure everything is completely filled out with zero empty boxes, and try once more.";
    }

    // ── STEP B: DYNAMICALLY COMPILE PREMIUM MODAL CONTAINER MARKUP ───────────────────────
    const modalOverlayNode = document.createElement("div");
    // Leverage Tailwind utility tags for hardware-accelerated animations, glass blurs, and centered panels
    modalOverlayNode.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 ease-out pointer-events-auto select-none";
    
    // Construct the inner structural card with rounded design tokens and a pulsing lock-shield graphics badge
    modalOverlayNode.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-slate-100 transform scale-90 translate-y-4 transition-all duration-300 ease-out flex flex-col items-center text-center">
        
        <!-- Highly animated brand badge representing secure entrance alerts -->
        <div class="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl mb-5 shadow-sm animate-bounce">
          <i class="fas fa-lock-open"></i>
        </div>
        
        <!-- Big, readable primary header text -->
        <h3 class="text-2xl font-display font-extrabold text-slate-900 mb-3 tracking-tight">${simpleMainMessage}</h3>
        
        <!-- Warm comforting instructional instructions -->
        <p class="text-slate-600 text-sm leading-relaxed mb-6 font-medium">${readableTenderAdvice}</p>
        
        <!-- Tiny technical diagnostics tray (in case a real developer needs to analyze the precise error) -->
        <div class="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono text-slate-400 text-left overflow-x-auto mb-6">
          <span class="font-bold text-slate-500 uppercase tracking-widest block mb-1">Technical details:</span>
          "${rawServerErrorMessage}"
        </div>
        
        <!-- Grand giant-sized high-contrast close button -->
        <button type="button" id="close-grandma-modal-action" class="w-full py-4 px-6 bg-eduBlue-primary hover:bg-eduBlue-hover text-white font-bold text-sm rounded-xl shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-2">
          <span>Let's Try Again!</span> <i class="fas fa-undo text-xs"></i>
        </button>
      </div>
    `;

    // Append modal overlay node directly onto active document boundaries
    document.body.appendChild(modalOverlayNode);

    // Capture child visual card block node to trigger entrance slide transitions
    const innerCardElement = modalOverlayNode.querySelector("div");

    // Force style layout paint calculations to ensure css animation keyframes render elegantly
    requestAnimationFrame(() => {
      modalOverlayNode.classList.remove("opacity-0");
      if (innerCardElement) {
        innerCardElement.classList.remove("scale-90", "translate-y-4");
        innerCardElement.classList.add("scale-100", "translate-y-0");
      }
    });

    // ── STEP C: DEFINE SAFE DISMISSAL LIFECYCLE CONTROLLER ─────────────────────────────────
    function closeFriendlyModal() {
      console.log("[LOGIN INTERFACE ENGINE] Dismissing warning modal frame...");
      // Re-trigger exit animations smoothly
      modalOverlayNode.classList.add("opacity-0");
      if (innerCardElement) {
        innerCardElement.classList.add("scale-90", "translate-y-4");
      }

      // Unmount elements cleanly from browser DOM after the transition interval ends
      setTimeout(() => {
        modalOverlayNode.remove();
      }, 300);
    }

    // Bind event anchors to close actions
    modalOverlayNode.addEventListener("click", function (event) {
      if (event.target === modalOverlayNode) {
        closeFriendlyModal();
      }
    });

    const closeBtnNode = modalOverlayNode.querySelector("#close-grandma-modal-action");
    if (closeBtnNode) {
      closeBtnNode.addEventListener("click", closeFriendlyModal);
    }
  }

  // ==========================================================================
  // 6. SECURE SUBMISSION ENTRY & APPLICATION ROUTING PIPELINE
  // ==========================================================================
  
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      // Intercept standard transmission processes to isolate frontend rendering behavior
      event.preventDefault();

      let logicalFormPassesFlag = true;

      // 1. Audit mandatory text constraints inside the system email fields block
      if (!emailInput || !emailInput.value || emailInput.value.trim() === "") {
        logicalFormPassesFlag = false;
        if (emailInput) applyFieldValidationErrorState(emailInput);
      } else {
        // Enforce basic regular expression checking over structured email parameters
        const structureRegexCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!structureRegexCheck.test(emailInput.value.trim())) {
          logicalFormPassesFlag = false;
          applyFieldValidationErrorState(emailInput);
        }
      }

      // 2. Audit structural requirements inside access credential lines
      if (!passwordInput || !passwordInput.value || passwordInput.value.trim() === "") {
        logicalFormPassesFlag = false;
        if (passwordInput) applyFieldValidationErrorState(passwordInput);
      }

      // Handle structural results depending on validation processing outcomes
      if (!logicalFormPassesFlag) {
        // Hydrate the interface banner message to inform users of input processing errors
        if (alertTextNode) alertTextNode.innerText = "Authentication requirements check failed. Please verify input accuracy.";
        if (globalAlertBox) globalAlertBox.classList.remove("hidden");
        return;
      }

      // ==========================================================================
      // 🚀 PRODUCTION GRADE NEON DB + BETTER AUTH INTEGRATION PIPELINE
      // ==========================================================================
      
      // Update interface buttons to indicate loading state feedback metrics (Freeze interface to prevent duplicate submissions)
      const loginButton = document.getElementById("execute-login-action");
      const btnTextNode = loginButton ? loginButton.querySelector("span") : null;
      const btnIconNode = loginButton ? loginButton.querySelector("i") : null;

      const originalText = btnTextNode ? btnTextNode.innerText : "Log In Securely";
      const originalIconClass = btnIconNode ? btnIconNode.className : "fas fa-sign-in-alt text-xs";

      if (loginButton) {
        loginButton.disabled = true; // Lock interactive states
        if (btnTextNode) btnTextNode.innerText = "Verifying Access Credentials...";
        if (btnIconNode) btnIconNode.className = "fas fa-spinner animate-spin text-xs"; // Spinning feedback indicators
      }

      try {
        const cleanEmail = emailInput.value.trim();
        const rawPassword = passwordInput.value;

        console.log("[LOGIN ENGINE] Dispatching verification payload straight to window.JemerAuth engine...");

        // Invoke the core backend identity layer exposed globally in auth.js
        const authenticationResponse = await window.JemerAuth.signInStudent(cleanEmail, rawPassword);

        // Check if authentication execution cleared successfully
        if (authenticationResponse && authenticationResponse.success) {
          console.log("[LOGIN ENGINE] Identity authorized! Session established. Routing down to workspace dashboard...");
          
          if (btnTextNode) btnTextNode.innerText = "Access Granted! Welcome back.";
          if (btnIconNode) btnIconNode.className = "fas fa-check-circle text-xs";

          // Relocate screen routing references directly onto your dashboard portal directory path
          window.location.href = "/dashboard";
        } else {
          // If response came back successful but internal success was false, bubble down into catch segment
          throw new Error(authenticationResponse?.message || "Incorrect email or password combination.");
        }

      } catch (authException) {
        console.error("[LOGIN ENGINE EXCEPTION] Identity challenge rejected:", authException.message);

        // Restore form buttons back to standard active configurations so users can edit and try again
        if (loginButton) {
          loginButton.disabled = false;
          if (btnTextNode) btnTextNode.innerText = originalText;
          if (btnIconNode) btnIconNode.className = originalIconClass;
        }

        // Hydrate and display the inline error banner as a layout fallback
        if (alertTextNode) alertTextNode.innerText = authException.message;
        if (globalAlertBox) globalAlertBox.classList.remove("hidden");

        // 🧸 Launch the gorgeous Grandma-Friendly modal animation
        triggerGrandmaFriendlyErrorModal(authException.message);
      }

    });
  }

})();