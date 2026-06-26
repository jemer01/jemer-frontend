/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY PASSWORD RECOVERY RUNTIME ENGINE (PRODUCTION GRADE V2.1)
 * ================================================================================================
 * Description: Multi-phase state management, manual PIN auto-focus routes,
 * real-time input validation matrix, and secure credential override.
 * Tech Stack Consistency: Pure decoupled Vanilla ES6 JavaScript architecture.
 * Integration Stack: Better Auth Client SDK Security APIs via window.JemerAuth gateway.
 *
 * ── V2.1 PATCH NOTES ────────────────────────────────────────────────────────────────────────────
 * [FIX 1] Connected all security steps directly to the Better Auth Client SDK methods in auth.js.
 * [FIX 2] Expanded the system OTP verification system to handle 6-digit PIN tracking perfectly.
 * [FIX 3] Configured auto-advancing and auto-rewinding matrix cursor focus shifts across 6 fields.
 * [FIX 4] Programmed automated OTP submit actions the split second the 6th digit is captured.
 * [FIX 5] Embedded "grandma-friendly" comforting alert modals and a celebration screen.
 * ================================================================================================
 */

(function () {
  "use strict"; // Enforce strict JavaScript evaluation rules to protect global scopes and prevent silent exceptions

  // ==========================================================================
  // 1. DOM CORE DOM ELEMENTS ACQUISITION MATRIX
  // ==========================================================================
  
  // Acquire primary structural wizard navigation controllers
  const btnNext = document.getElementById("next-phase-action"); // The main progress/submission button
  const btnPrev = document.getElementById("prev-phase-action"); // The backward/cancellation button
  const btnArrow = document.getElementById("phase-btn-arrow"); // The sliding chevron/spinner dynamic icon tag

  // Acquire visual wizard progress indicators and description headers
  const progressFill = document.getElementById("phase-progress-fill"); // Blue indicator progress line
  const numericalIndicator = document.getElementById("phase-numerical-indicator"); // "Phase X of 3" indicator tag
  const labelTracker = document.getElementById("phase-label-tracker"); // Conversational step label tag

  // Assemble sequential step containers into a clean array index for phase tracking
  const phaseCards = [
    document.getElementById("recovery-phase-1"), // Email identification card
    document.getElementById("recovery-phase-2"), // 6-digit security OTP PIN matrix card
    document.getElementById("recovery-phase-3")  // Password overwrite credentials form card
  ];

  // Map individual data input elements across wizard cards
  const emailInput = document.getElementById("recovery-email"); // Email text field
  const passwordInput = document.getElementById("new-password"); // New password text field
  const confirmPasswordInput = document.getElementById("confirm-new-password"); // Confirmation password text field
  const pinContainer = document.getElementById("recovery-pin-matrix"); // Wrapper container holding numeric inputs
  
  // Extract all available digit fields dynamically (Automatically targets 6 boxes after HTML expansion)
  const pinBoxes = pinContainer ? Array.from(pinContainer.querySelectorAll(".pin-box")) : [];

  // Acquire custom error notification nodes
  const pinAlert = document.getElementById("pin-verification-alert"); // Warning placeholder below pin matrix

  // Set structural wizard control parameters
  const totalPhases = phaseCards.length; // Total sequence length is 3 phases
  let currentPhase = 1; // Instantiate sequence placement tracker (Step 1 to Step 3)

  // ==========================================================================
  // 2. HARDWARE ACCELERATED INFINITE LANDING SLIDESHOW LOOP CONTROLLER
  // ==========================================================================
  
  // Target left-column background slideshow containers and pagination trackers
  const slideImages = document.querySelectorAll(".slideshow-image"); // Sliding graphic image panels
  const slideDots = document.querySelectorAll(".slide-dot"); // Translucent navigation pagination indicator nodes
  let activeSlideIndex = 0; // Tracks current running visual panel array position
  const slideDuration = 4000; // Fixed transition loop clock interval set to 4000ms (4 seconds per loop)

  /**
   * Orchestrates endless graphical slide fading loops by shifting visual classes.
   */
  function executeSlideshowCycle() {
    // Drop executions instantly if layout scales away graphic panel on mobile/handset devices
    if (slideImages.length === 0) return;

    // Remove active styles from current visual index
    slideImages[activeSlideIndex].classList.remove("active-slide");
    slideImages[activeSlideIndex].classList.add("opacity-0");
    
    // Contract active slide pagination dot trackers
    slideDots[activeSlideIndex].classList.remove("w-8", "bg-white");
    slideDots[activeSlideIndex].classList.add("w-2", "bg-white/40");

    // Advance loop trackers utilizing modulus constraint limits to cycle smoothly
    activeSlideIndex = (activeSlideIndex + 1) % slideImages.length;

    // Fade in selected incoming target slide panel
    slideImages[activeSlideIndex].classList.add("active-slide");
    slideImages[activeSlideIndex].classList.remove("opacity-0");

    // Expand visual progress dot on newly chosen active index position
    slideDots[activeSlideIndex].classList.remove("w-2", "bg-white/40");
    slideDots[activeSlideIndex].classList.add("w-8", "bg-white");
  }

  // Bind slideshow transitions onto active execution clocks on static view initialization
  if (slideImages.length > 0) {
    setInterval(executeSlideshowCycle, slideDuration);
  }

  // ==========================================================================
  // 3. MULTI-PHASE TRACK NAVIGATION AND PROGRESS RECONCILIATION
  // ==========================================================================

  /**
   * Evaluates current active step counts to slide structural indicators and update text tags.
   */
  function reconcilePhaseProgressMetrics() {
    // Mathematically translate phase numbers into corresponding step completion percentages
    const computedPercentage = Math.round((currentPhase / totalPhases) * 100);
    
    // Adjust blue geometric indicator lines width dimensions
    if (progressFill) progressFill.style.width = `${computedPercentage}%`;
    
    // Hydrate textual page description trackers
    if (numericalIndicator) numericalIndicator.innerText = `Phase ${currentPhase} of ${totalPhases}`;

    // Update conversational header descriptions and configure back button labels dynamically
    if (labelTracker) {
      if (currentPhase === 1) {
        labelTracker.innerText = "Account Identification";
        if (btnPrev) btnPrev.innerText = "Cancel"; // Cancel returns safely to login pages
      } else if (currentPhase === 2) {
        labelTracker.innerText = "Identity Verification";
        if (btnPrev) btnPrev.innerText = "Back"; // Back steps backward one phase
      } else if (currentPhase === 3) {
        labelTracker.innerText = "Secure Reset Override";
        if (btnPrev) btnPrev.innerText = "Back";
      }
    }

    // Configure main submission buttons descriptive text layouts depending on current workflow placement
    if (currentPhase === totalPhases) {
      btnNext.querySelector("span").innerText = "Update Password & Log In";
      if (btnArrow) btnArrow.className = "fas fa-check-circle text-xs"; // Use check icon for completion step
    } else if (currentPhase === 2) {
      btnNext.querySelector("span").innerText = "Verify Token";
      if (btnArrow) btnArrow.className = "fas fa-shield-alt text-xs"; // Shield icon for OTP validation step
    } else {
      btnNext.querySelector("span").innerText = "Continue";
      if (btnArrow) btnArrow.className = "fas fa-chevron-right text-xs"; // Dynamic right chevron for normal steps
    }
  }

  /**
   * Toggles visibility attributes on sequential wizard steps using performance-friendly classes.
   */
  function displayActivePhaseCard() {
    phaseCards.forEach((card, index) => {
      if (!card) return;
      const cardPhaseNumber = index + 1; // Map 0-indexed arrays back to human counts
      
      if (cardPhaseNumber === currentPhase) {
        card.classList.remove("hidden"); // Remove utility hiding parameters
        card.setAttribute("data-phase-active", "true"); // Track step status programmatically
        
        // Relocate focused context positions immediately down onto newly rendered input forms
        if (currentPhase === 2 && pinBoxes.length > 0) {
          pinBoxes[0].focus(); // Target first code input box automatically on Phase 2 transition
        } else {
          const initialFieldInput = card.querySelector("input");
          if (initialFieldInput) initialFieldInput.focus(); // Shift focus to input elements on normal panels
        }
      } else {
        card.classList.add("hidden"); // Conceal inactive structural card views
        card.setAttribute("data-phase-active", "false");
      }
    });

    reconcilePhaseProgressMetrics(); // Re-align structural meters and labels
  }

  // ==========================================================================
  // 4. VALIDATION DEFENSE CHECKS MODULE
  // ==========================================================================

  /**
   * Cleans away invalid highlight visual states on input boundary nodes.
   * @param {HTMLElement} inputNode - Target input block element.
   */
  function clearFieldValidationErrorState(inputNode) {
    inputNode.classList.remove("input-field-error");
    const parent = inputNode.parentElement;
    if (parent) {
      const errorMsgText = parent.querySelector(".input-error-msg");
      if (errorMsgText) errorMsgText.classList.add("hidden");
    }
  }

  /**
   * Applies invalid styling and reveals warning descriptors on failing inputs.
   * @param {HTMLElement} inputNode - Target input block element.
   */
  function applyFieldValidationErrorState(inputNode) {
    inputNode.classList.add("input-field-error");
    const parent = inputNode.parentElement;
    if (parent) {
      const errorMsgText = parent.querySelector(".input-error-msg");
      if (errorMsgText) errorMsgText.classList.remove("hidden");
    }
  }

  /**
   * Assesses active input components against corresponding database formatting rules.
   * @returns {boolean} Outcome indicating if active requirements passed.
   */
  function validateCurrentPhaseData() {
    // PHASE 1 DATA AUDITING: Check for empty spaces and structured email layout parameters
    if (currentPhase === 1) {
      if (!emailInput || !emailInput.value || emailInput.value.trim() === "") {
        if (emailInput) applyFieldValidationErrorState(emailInput);
        return false;
      }
      // Apply strict regular expression scanning to guarantee compliant email configurations
      const structuredEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!structuredEmailRegex.test(emailInput.value.trim())) {
        applyFieldValidationErrorState(emailInput);
        return false;
      }
      clearFieldValidationErrorState(emailInput);
      return true;
    }

    // PHASE 2 DATA AUDITING: Inspect completeness variables of the newly expanded 6-digit PIN matrix
    if (currentPhase === 2) {
      // Confirm that every single digit input contains exactly one valid numerical symbol
      const pinBoxesAreComplete = pinBoxes.every(box => box.value && box.value.trim().length === 1);
      if (!pinBoxesAreComplete) {
        if (pinAlert) pinAlert.classList.remove("hidden"); // Reveal missing token warnings
        pinBoxes.forEach(box => box.classList.add("border-red-500")); // Highlight input boundaries red
        return false;
      }
      if (pinAlert) pinAlert.classList.add("hidden"); // Conceal warnings on complete entry checks
      pinBoxes.forEach(box => box.classList.remove("border-red-500"));
      return true;
    }

    // PHASE 3 DATA AUDITING: Audit credential complexity rules and matching patterns
    if (currentPhase === 3) {
      let phase3Passes = true;
      const complexPassConditionMet = auditPasswordComplexityStrings(passwordInput ? passwordInput.value : "");
      
      if (!complexPassConditionMet) {
        phase3Passes = false;
        if (passwordInput) applyFieldValidationErrorState(passwordInput); // Redline primary password fields on failure
      }

      // Ensure confirmation passwords align perfectly with first entries
      if (passwordInput && confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
        phase3Passes = false;
        if (confirmPasswordInput) applyFieldValidationErrorState(confirmPasswordInput);
      } else {
        if (confirmPasswordInput) clearFieldValidationErrorState(confirmPasswordInput);
      }

      return phase3Passes;
    }

    return true;
  }

  // Clear focus highlights instantly upon monitoring natural keystroke updates
  document.addEventListener("input", function (event) {
    if (event.target && event.target.classList.contains("onboarding-input")) {
      clearFieldValidationErrorState(event.target);
    }
  });

  // ==========================================================================
  // 5. 6-DIGIT PIN MATRIX INTERCEPT AUTO-SHIFT & AUTO-SUBMIT ARCHITECTURE
  // ==========================================================================
  if (pinBoxes.length > 0) {
    pinBoxes.forEach((box, index) => {
      // Listen for keystrokes to advance input focal pointers sequentially
      box.addEventListener("input", function () {
        // Shift cursor focus forward to next cell if digit is entered and sibling exists
        if (box.value.length === 1 && index < pinBoxes.length - 1) {
          pinBoxes[index + 1].focus();
        }
        
        // Clean away residual validation warning alerts
        if (pinAlert) pinAlert.classList.add("hidden");
        box.classList.remove("border-red-500");

        // PREMIUM AUTO-SUBMIT TRIGGER: Automatically submit when the final 6th cell is filled
        const allDigitsAreCaptured = pinBoxes.every(b => b.value && b.value.trim().length === 1);
        if (allDigitsAreCaptured) {
          console.log("[OTP MATRIX] All 6 digits captured. Triggering automated verification sequence...");
          executePasswordRecoveryTransitionPipeline(); // Auto-fire security pipeline on full entry
        }
      });

      // Catch backspace keydowns to pull focus backward cleanly across cells
      box.addEventListener("keydown", function (event) {
        // Auto-step back onto previous input card if backspacing over an empty boundary
        if (event.key === "Backspace" && box.value.length === 0 && index > 0) {
          pinBoxes[index - 1].focus();
        }
      });
    });
  }

  // ==========================================================================
  // 6. COMPLEXITY METRICS RECONCILIATION ENGINE (PHASE 3 STRENGTH METERS)
  // ==========================================================================
  
  /**
   * Evaluates text parameters against strict safety requirements.
   * Aligned perfectly with our 6-character structural threshold expectations.
   * @param {string} passwordStringValue - The raw text entered inside new password fields.
   * @returns {boolean} Success value indicating if password meets security goals.
   */
  function auditPasswordComplexityStrings(passwordStringValue) {
    const metricsFlags = {
      len: passwordStringValue.length >= 6, // Production criteria explicitly expecting Min 6 characters
      alpha: /[a-zA-Z]/.test(passwordStringValue), // Must contain letters
      num: /[0-9]/.test(passwordStringValue), // Must contain numbers
      sym: /[!@#$%^&*(),.?":{}|<>_+\-=[\]\\]/.test(passwordStringValue) // Must contain special character symbols
    };

    // Reflect check results on checklist UI items dynamically
    updateComplexityVisualIndicatorRow("chk-len", metricsFlags.len);
    updateComplexityVisualIndicatorRow("chk-alpha", metricsFlags.alpha);
    updateComplexityVisualIndicatorRow("chk-num", metricsFlags.num);
    updateComplexityVisualIndicatorRow("chk-sym", metricsFlags.sym);

    // Form passes if all structural rules are satisfied
    return metricsFlags.len && metricsFlags.alpha && metricsFlags.num && metricsFlags.sym;
  }

  /**
   * Sets appropriate presentation classes and icons on checklist tracking boxes depending on validation.
   */
  function updateComplexityVisualIndicatorRow(targetRowId, checkPassConditionFlag) {
    const rowDOMNode = document.getElementById(targetRowId);
    if (!rowDOMNode) return;

    const validationStatusIcon = rowDOMNode.querySelector("i");

    if (checkPassConditionFlag) {
      rowDOMNode.className = "flex items-center gap-2 matrix-requirement-valid transition-colors duration-150";
      if (validationStatusIcon) validationStatusIcon.className = "fas fa-check-circle text-[10px]"; // Verified circle
    } else {
      rowDOMNode.className = "flex items-center gap-2 text-slate-400 transition-colors duration-150";
      if (validationStatusIcon) validationStatusIcon.className = "fas fa-circle-notch text-[10px]"; // Spinner outline notch
    }
  }

  // Run dynamic strength analyses while student updates password fields
  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "new-password") {
      auditPasswordComplexityStrings(event.target.value);
    }
  });

  // Toggle mask context displays for secure viewing options
  document.addEventListener("click", function (event) {
    const visibilityTriggerElement = event.target.closest("#toggle-recovery-pwd-visibility");
    if (!visibilityTriggerElement) return;

    const targetEyeIconElement = document.getElementById("recovery-eye-icon-target");

    if (passwordInput && targetEyeIconElement) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        targetEyeIconElement.className = "far fa-eye-slash text-sm"; // Reveal password characters
      } else {
        passwordInput.type = "password";
        targetEyeIconElement.className = "far fa-eye text-sm"; // Obscure password characters
      }
    }
  });

  // ==========================================================================
  // 7. 🧸 GRANDMA-FRIENDLY BEAUTIFUL ERRORS & CELEBRATION MODALS ENGINE
  // ==========================================================================

  /**
   * Launches a tender, premium alert modal translating complex codes into comforting descriptions.
   * Includes complete diagnostic trackers at the bottom for developer verification.
   * @param {string} rawServerErrorMessage - Raw response message returned from system transactions.
   */
  function triggerGrandmaFriendlyErrorModal(rawServerErrorMessage) {
    console.log("[RECOVERY ENGINE] Hydrating Grandma-friendly error notification module...");

    let simpleMainMessage = "Let's make a tiny adjustment! ✨";
    let readableTenderAdvice = "We need to verify our input details. Let's look over the form slow and steady, honey.";

    const lowerCaseError = rawServerErrorMessage.toLowerCase();

    // Soft translation map converting intimidating code strings into helpful family copy
    if (lowerCaseError.includes("not found") || lowerCaseError.includes("no user") || lowerCaseError.includes("invalid email")) {
      simpleMainMessage = "Let's check our learning folder! 📁";
      readableTenderAdvice = "We couldn't find an account matching that exact email address. Ask your parent or coach if they registered under a different email, or check for typos, sweetie!";
    } else if (lowerCaseError.includes("incorrect") || lowerCaseError.includes("invalid token") || lowerCaseError.includes("expired") || lowerCaseError.includes("verification")) {
      simpleMainMessage = "Oh dear, that key didn't fit! 🔑";
      readableTenderAdvice = "The 6-digit number you typed doesn't match the verification code sent to your inbox. Slowly check your inbox again—and peek inside the Spam folder too, dear!";
    } else if (lowerCaseError.includes("network") || lowerCaseError.includes("fetch") || lowerCaseError.includes("failed")) {
      simpleMainMessage = "Our internet is taking a tiny nap! 🌐";
      readableTenderAdvice = "It seems your Wi-Fi is feeling a bit tired. Make sure your internet box is glowing with bright friendly lights and try clicking the button again.";
    } else if (lowerCaseError.includes("complexity") || lowerCaseError.includes("strength") || lowerCaseError.includes("password") || lowerCaseError.includes("length")) {
      simpleMainMessage = "Let's choose a stronger key! 🔒";
      readableTenderAdvice = "Your new password needs just a tiny bit more power. Let's make sure it has at least 6 letters, includes a number (like 1, 2, 3), and has a special symbol (like @, #, or $)!";
    }

    // Dynamic compilation of the custom modal layout overlay directly in active DOM trees
    const modalOverlayNode = document.createElement("div");
    // Leverage Tailwind transition and backdrop styles for high visual quality
    modalOverlayNode.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 ease-out pointer-events-auto select-none";
    
    modalOverlayNode.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-slate-100 transform scale-90 translate-y-4 transition-all duration-300 ease-out flex flex-col items-center text-center">
        
        <!-- Bouncing warning badge -->
        <div class="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl mb-5 shadow-sm animate-bounce">
          <i class="fas fa-lock"></i>
        </div>
        
        <!-- Highly readable header -->
        <h3 class="text-2xl font-display font-extrabold text-slate-900 mb-3 tracking-tight">${simpleMainMessage}</h3>
        
        <!-- Reassuring description copy -->
        <p class="text-slate-600 text-sm leading-relaxed mb-6 font-medium">${readableTenderAdvice}</p>
        
        <!-- Diagnostic container block for developers -->
        <div class="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono text-slate-400 text-left overflow-x-auto mb-6">
          <span class="font-bold text-slate-500 uppercase tracking-widest block mb-1">Technical code diagnostics:</span>
          "${rawServerErrorMessage}"
        </div>
        
        <!-- Easy-to-tap close action trigger -->
        <button type="button" id="close-recovery-modal" class="w-full py-4 px-6 bg-eduBlue-primary hover:bg-eduBlue-hover text-white font-bold text-sm rounded-xl shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-2">
          <span>Let's Try Again!</span> <i class="fas fa-undo text-xs"></i>
        </button>
      </div>
    `;

    document.body.appendChild(modalOverlayNode);

    const innerCardElement = modalOverlayNode.querySelector("div");

    // Force frame layout repaints to trigger smooth CSS pop transitions
    requestAnimationFrame(() => {
      modalOverlayNode.classList.remove("opacity-0");
      if (innerCardElement) {
        innerCardElement.classList.remove("scale-90", "translate-y-4");
        innerCardElement.classList.add("scale-100", "translate-y-0");
      }
    });

    // Clean unmounting sequence on close
    function closeFriendlyModal() {
      modalOverlayNode.classList.add("opacity-0");
      if (innerCardElement) {
        innerCardElement.classList.add("scale-90", "translate-y-4");
      }
      setTimeout(() => {
        modalOverlayNode.remove();
      }, 300);
    }

    modalOverlayNode.addEventListener("click", function (event) {
      if (event.target === modalOverlayNode) closeFriendlyModal();
    });

    const closeBtn = modalOverlayNode.querySelector("#close-recovery-modal");
    if (closeBtn) closeBtn.addEventListener("click", closeFriendlyModal);
  }

  /**
   * Spawns a premium celebration popup upon successful password updates.
   * Features high contrast actions, celebratory graphics, and guides students back to login page.
   */
  function triggerGrandmaFriendlySuccessCelebrationModal() {
    console.log("[RECOVERY ENGINE] Spawning grand success celebration modal popup...");

    const successOverlayNode = document.createElement("div");
    // Deep blur backdrop overlay
    successOverlayNode.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md opacity-0 transition-opacity duration-300 ease-out pointer-events-auto select-none";

    successOverlayNode.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-slate-100 transform scale-90 translate-y-4 transition-all duration-300 ease-out flex flex-col items-center text-center">
        
        <!-- Pulsing celebratory emoji badge -->
        <div class="w-20 h-20 bg-amber-50 border-2 border-amber-200 text-amber-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner animate-pulse">
          🥳
        </div>
        
        <!-- Cheerful heading -->
        <h3 class="text-3xl font-display font-extrabold text-slate-900 mb-3 tracking-tight">All done, smarty-pants! ✨</h3>
        
        <!-- Warm copy -->
        <p class="text-slate-600 text-sm leading-relaxed mb-8 font-medium">
          Your learning folder is securely locked with your brand-new key! You did such an amazing job stepping through our check gates. Let's log back in and start studying!
        </p>
        
        <!-- Large high-contrast proceed button -->
        <button type="button" id="celebrate-login-action" class="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base rounded-2xl shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2">
          <span>Proceed to Login!</span> <i class="fas fa-sign-in-alt text-sm"></i>
        </button>
      </div>
    `;

    document.body.appendChild(successOverlayNode);

    const innerCardElement = successOverlayNode.querySelector("div");

    requestAnimationFrame(() => {
      successOverlayNode.classList.remove("opacity-0");
      if (innerCardElement) {
        innerCardElement.classList.remove("scale-90", "translate-y-4");
        innerCardElement.classList.add("scale-100", "translate-y-0");
      }
    });

    const routeBtn = successOverlayNode.querySelector("#celebrate-login-action");
    if (routeBtn) {
      routeBtn.addEventListener("click", function () {
        // Clear recovery parameters before routing back to log in
        sessionStorage.removeItem("jemer_recovery_email");
        sessionStorage.removeItem("jemer_recovery_token");
        
        // Relocate student securely back into login interface paths
        window.location.href = "login.html";
      });
    }
  }

  // ==========================================================================
  // 8. ASYNCHRONOUS FORM STEPPING TRANSACTION DISPATCHER
  // ==========================================================================
  
  /**
   * Orchestrates the 3-phase password recovery workflow.
   * Invokes SDK methods from window.JemerAuth and transitions UI blocks.
   */
  async function executePasswordRecoveryTransitionPipeline() {
    // Validate inputs within current active card before dispatching transactions
    const isFormPhaseValid = validateCurrentPhaseData();
    if (!isFormPhaseValid) return;

    // Freeze inputs and trigger loading states on action buttons
    btnNext.disabled = true;
    const btnText = btnNext.querySelector("span");
    const originalText = btnText ? btnText.innerText : "Continue";
    const originalIconClass = btnArrow ? btnArrow.className : "fas fa-chevron-right text-xs";

    // Set interactive feedback configurations
    if (btnText) btnText.innerText = "Securing transaction...";
    if (btnArrow) btnArrow.className = "fas fa-spinner animate-spin text-xs"; // Add dynamic spinning indicators

    try {
      // ─── PHASE 1: EMAIL DISPATCH VIA CLIENT SDK ──────────────────────────────
      if (currentPhase === 1) {
        const cleanEmail = emailInput.value.trim();
        console.log(`[RECOVERY PIPELINE] Executing SDK dispatch for email: ${cleanEmail}`);

        // Call Better Auth client SDK method through auth.js wrapper
        const apiResponse = await window.JemerAuth.sendPasswordResetToken(cleanEmail);

        if (apiResponse && apiResponse.success) {
          console.log("[RECOVERY PIPELINE] Reset OTP dispatched successfully. Transitioning to Phase 2...");
          
          // Cache verified email string to reference across subsequent phases
          sessionStorage.setItem("jemer_recovery_email", cleanEmail);

          // Transition UI to step 2 (PIN Matrix input)
          currentPhase = 2;
          displayActivePhaseCard();
        } else {
          throw new Error(apiResponse?.message || "We encountered an issue looking up your account.");
        }
      }

      // ─── PHASE 2: 6-DIGIT OTP VALIDATION ────────────────────────────────────
      else if (currentPhase === 2) {
        const cachedEmail = sessionStorage.getItem("jemer_recovery_email");
        // Flatten entered character cells into a single string PIN
        const enteredCodeToken = pinBoxes.map(b => b.value.trim()).join("");

        console.log(`[RECOVERY PIPELINE] Running validation formats on OTP PIN: ${enteredCodeToken} for: ${cachedEmail}`);

        if (!cachedEmail) {
          throw new Error("Onboarding recovery session missing. Please reload page and try again.");
        }

        // Call Phase 2 validation hook in auth.js
        const apiResponse = await window.JemerAuth.verifyPasswordResetToken(cachedEmail, enteredCodeToken);

        if (apiResponse && apiResponse.success) {
          console.log("[RECOVERY PIPELINE] Pin verification format accepted. Transitioning to Phase 3...");
          
          // Cache token inside session parameters to authorize the final password override execution
          sessionStorage.setItem("jemer_recovery_token", enteredCodeToken);

          // Transition UI to Step 3 (Credential reset form)
          currentPhase = 3;
          displayActivePhaseCard();
        } else {
          // Wipe entered fields and snap focus back to box 1 to make retry extremely easy for grandma
          pinBoxes.forEach(b => b.value = "");
          pinBoxes[0].focus();
          throw new Error(apiResponse?.message || "Verification code is incorrect or has expired.");
        }
      }

      // ─── PHASE 3: SECURE CREDENTIAL reset OVERRIDE VIA CLIENT SDK ───────────
      else if (currentPhase === 3) {
        const cachedEmail = sessionStorage.getItem("jemer_recovery_email");
        const cachedToken = sessionStorage.getItem("jemer_recovery_token");
        const newPasswordText = passwordInput.value;

        console.log(`[RECOVERY PIPELINE] Overwriting system credential records for email: ${cachedEmail}`);

        if (!cachedEmail || !cachedToken) {
          throw new Error("Password override transaction aborted: Missing active recovery tokens.");
        }

        // Send reset parameters straight to Better Auth using Client SDK methods in auth.js
        const apiResponse = await window.JemerAuth.resetPasswordWithToken(cachedEmail, cachedToken, newPasswordText);

        if (apiResponse && apiResponse.success) {
          console.log("[RECOVERY PIPELINE] Credentials updated inside database. Launching celebration module...");
          
          // Unveil the grand victory celebration modal popup
          triggerGrandmaFriendlySuccessCelebrationModal();
        } else {
          throw new Error(apiResponse?.message || "PostgreSQL password override transaction failed.");
        }
      }

    } catch (pipelineError) {
      console.error("[RECOVERY PIPELINE EXCEPTION] Stage execution collapsed:", pipelineError.message);
      
      // Launch grandma friendly error popup module
      triggerGrandmaFriendlyErrorModal(pipelineError.message);
    } finally {
      // Restore main submit button back to active interactive configurations
      btnNext.disabled = false;
      if (btnText) btnText.innerText = originalText;
      if (btnArrow) btnArrow.className = originalIconClass;
    }
  }

  // Bind step progressions click handlers
  if (btnNext) {
    btnNext.addEventListener("click", executePasswordRecoveryTransitionPipeline);
  }

  // Bind backward navigation click handlers
  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      if (currentPhase > 1) {
        // Step backward one phase card
        currentPhase--;
        displayActivePhaseCard();
      } else {
        // Clear caches and return securely back to login view path on cancel
        sessionStorage.clear();
        window.location.href = "login.html";
      }
    });
  }

  // ==========================================================================
  // 9. INTERFACE INITIALIZATION LIFE-CYCLE ENTRY
  // ==========================================================================
  
  // Wipe residual recovery cache keys to ensure a clean starting state
  sessionStorage.removeItem("jemer_recovery_email");
  sessionStorage.removeItem("jemer_recovery_token");
  
  // Render initial card set
  displayActivePhaseCard();

})();