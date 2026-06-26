/**
 * ========================================================================
 * 🧠 JEMER ACADEMY REGISTRATION RUNTIME ENGINE (PRODUCTION GRADE V1.2)
 * ========================================================================
 * Description: Client-side lifecycle management, multi-step validation loops,
 * password complexity criteria evaluation, and interface state transitions.
 * Tech Stack Consistency: Pure decoupled Vanilla ES6 JavaScript architecture.
 * ========================================================================
 */

(function () {
  "use strict";

  // Primary workflow navigation containers and interactive targets
  const flowWrapper = document.getElementById("registration-flow-wrapper");
  const verificationPanel = document.getElementById("email-verification-panel");
  const globalFooter = document.getElementById("onboarding-global-footer");

  // Navigation controller action triggers
  const btnNext = document.getElementById("next-step-action");
  const btnPrev = document.getElementById("prev-step-action");
  const btnArrow = document.getElementById("action-btn-arrow");

  // Visual metric tracking components
  const progressFill = document.getElementById("step-progress-fill");
  const numericalIndicator = document.getElementById("step-numerical-indicator");
  const percentageTracker = document.getElementById("step-percentage-tracker");

  // Multi-step individual fieldset collection arrays
  const stepCards = Array.from(document.querySelectorAll(".step-card"));
  
  // Total steps boundary constraints calculated dynamically from the DOM layout lengths
  const totalSteps = stepCards.length;
  // Initialize state tracker tracking active layout positioning
  let currentStep = 1;

  // Acquire slideshow structural nodes
  const slideImages = document.querySelectorAll(".slideshow-image");
  const slideDots = document.querySelectorAll(".slide-dot");
  let activeSlideIndex = 0;
  const slideDuration = 4000; // Fixed interval threshold set to 4000ms (4 seconds per slide transition)

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

  /**
   * Evaluates current tracking integers to paint geometric scale fills and adjust text matrices.
   */
  function reconcileProgressMetrics() {
    // Establish structural ratios tracking completed steps boundaries
    const computedPercentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
    
    // Apply layout transformations down to the progress meter fill line wrapper element
    if (progressFill) progressFill.style.width = `${computedPercentage}%`;
    
    // Update structural caption text strings to support clear visibility and orientation metrics
    if (numericalIndicator) numericalIndicator.innerText = `Step ${currentStep} of ${totalSteps}`;
    if (percentageTracker) percentageTracker.innerText = `${computedPercentage}% Complete`;

    // Configure text descriptions inside the action confirmation trigger buttons dynamically
    if (currentStep === totalSteps) {
      btnNext.querySelector("span").innerText = "Create Account";
      if (btnArrow) {
        btnArrow.className = "fas fa-check-circle text-xs"; // Transition pointer arrows into system compliance symbols
      }
    } else {
      btnNext.querySelector("span").innerText = "Continue";
      if (btnArrow) {
        btnArrow.className = "fas fa-chevron-right text-xs";
      }
    }

    // Toggle functional activation states on the previous navigation button interface to lock early bounds
    btnPrev.disabled = currentStep === 1;
  }

  /**
   * Adjusts active selection elements, toggling visibility parameters cleanly across steps.
   */
  function displayActiveStepCard() {
    stepCards.forEach((card, index) => {
      const stepIndexNumber = index + 1;
      if (stepIndexNumber === currentStep) {
        card.classList.remove("hidden");
        card.setAttribute("data-step-active", "true");
        
        // Relocate focused context positions immediately down to incoming form field label structures
        const initialInputTarget = card.querySelector("input, select");
        if (initialInputTarget) initialInputTarget.focus();
      } else {
        card.classList.add("hidden");
        card.setAttribute("data-step-active", "false");
      }
    });

    // Fire UI structural measurements adjustment passes
    reconcileProgressMetrics();
  }

  /**
   * Strips away invalid styling states on field components upon text inputs.
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
   */
  function applyFieldValidationErrorState(inputNode) {
    inputNode.classList.add("input-field-error");
    const parentContainerElement = inputNode.parentElement;
    if (parentContainerElement) {
      const activeErrorMessageString = parentContainerElement.querySelector(".input-error-msg");
      if (activeErrorMessageString) activeErrorMessageString.classList.remove("hidden");
    }
  }

  /**
   * Audits active fields, processing constraint conditions before granting step transition routes.
   */
  function validateActiveStepDataMatrix() {
    const currentActiveCard = document.querySelector(`.step-card[data-step-active="true"]`);
    if (!currentActiveCard) return true;

    // Collect validation components required for verification inside the current active scope
    const requiredInputs = Array.from(currentActiveCard.querySelectorAll("input[required], select[required]"));
    let absoluteValidationPassFlag = true;

    requiredInputs.forEach(input => {
      // Validate string length and input definition values
      if (!input.value || input.value.trim() === "") {
        absoluteValidationPassFlag = false;
        applyFieldValidationErrorState(input);
      } else {
        clearFieldValidationErrorState(input);
      }

      // Explicit pattern matching audits targeting structured system email blocks (Step 4 specific checks)
      if (input.type === "email" && input.value) {
        const standardEmailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!standardEmailValidationRegex.test(input.value.trim())) {
          absoluteValidationPassFlag = false;
          applyFieldValidationErrorState(input);
        }
      }
    });

    // Execute custom password integrity audits and match evaluation parameters if analyzing Step 4
    if (currentActiveCard.id === "onboarding-step-4") {
      const passwordInputField = document.getElementById("user-password");
      const confirmPasswordInputField = document.getElementById("confirm-password");
      const mismatchErrorDisplayNode = document.getElementById("password-mismatch-alert");
      const termsAgreementBox = document.getElementById("accept-terms");
      const privacyAgreementBox = document.getElementById("accept-privacy");
      const cookieAgreementBox = document.getElementById("accept-cookies");
      const complianceErrorDisplayNode = document.getElementById("checkbox-compliance-alert");

      // Verify complex pattern matching tests pass on core access credential inputs
      const complexPasswordMetState = auditPasswordComplexityStrings(passwordInputField ? passwordInputField.value : "");
      
      if (!complexPasswordMetState) {
        absoluteValidationPassFlag = false;
        if (passwordInputField) applyFieldValidationErrorState(passwordInputField);
      }

      // Enforce clean equivalence parameter mapping between password input streams
      if (passwordInputField && confirmPasswordInputField && passwordInputField.value !== confirmPasswordInputField.value) {
        absoluteValidationPassFlag = false;
        applyFieldValidationErrorState(confirmPasswordInputField);
        if (mismatchErrorDisplayNode) mismatchErrorDisplayNode.classList.remove("hidden");
      } else {
        if (mismatchErrorDisplayNode) mismatchErrorDisplayNode.classList.add("hidden");
      }

      // Evaluate legality frameworks parameters tracking data policy check criteria approvals
      if (termsAgreementBox && privacyAgreementBox && cookieAgreementBox) {
        if (!termsAgreementBox.checked || !privacyAgreementBox.checked || !cookieAgreementBox.checked) {
          absoluteValidationPassFlag = false;
          if (complianceErrorDisplayNode) complianceErrorDisplayNode.classList.remove("hidden");
        } else {
          if (complianceErrorDisplayNode) complianceErrorDisplayNode.classList.add("hidden");
        }
      }
    }

    return absoluteValidationPassFlag;
  }

  /**
   * Evaluates text inputs against strict complexity regular expressions.
   */
  function auditPasswordComplexityStrings(passwordValueString) {
    // Core parameters structural criteria maps
    const criteriaEvaluations = {
      len: passwordValueString.length >= 8,
      alpha: /[a-zA-Z]/.test(passwordValueString),
      num: /[0-9]/.test(passwordValueString),
      sym: /[!@#$%^&*(),.?":{}|<>_+\-=[\]\\]/.test(passwordValueString)
    };

    // Toggle real-time design tokens and interface classes on UI elements
    updateComplexityVisualIndicatorRow("chk-len", criteriaEvaluations.len);
    updateComplexityVisualIndicatorRow("chk-alpha", criteriaEvaluations.alpha);
    updateComplexityVisualIndicatorRow("chk-num", criteriaEvaluations.num);
    updateComplexityVisualIndicatorRow("chk-sym", criteriaEvaluations.sym);

    // Return explicit state verification metrics monitoring operational success parameters
    return criteriaEvaluations.len && criteriaEvaluations.alpha && criteriaEvaluations.num && criteriaEvaluations.sym;
  }

  /**
   * Injects dynamic styles into verification rows to give users real-time validation status.
   */
  function updateComplexityVisualIndicatorRow(targetRowId, checkPassConditionFlag) {
    const rowDOMNode = document.getElementById(targetRowId);
    if (!rowDOMNode) return;

    const configurationStatusIcon = rowDOMNode.querySelector("i");

    if (checkPassConditionFlag) {
      rowDOMNode.className = "flex items-center gap-2 matrix-requirement-valid transition-colors duration-150";
      if (configurationStatusIcon) configurationStatusIcon.className = "fas fa-check-circle text-[10px]";
    } else {
      rowDOMNode.className = "flex items-center gap-2 text-slate-400 transition-colors duration-150";
      if (configurationStatusIcon) configurationStatusIcon.className = "fas fa-circle-notch text-[10px]";
    }
  }

  // Bind keyup and change telemetry logging events into password field sequences
  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "user-password") {
      auditPasswordComplexityStrings(event.target.value);
    }
    // Remove error highlights instantly when a user changes an invalid select element or updates a text field
    if (event.target && event.target.classList.contains("onboarding-input")) {
      clearFieldValidationErrorState(event.target);
    }
  });

  // Password visibility field context switcher
  document.addEventListener("click", function (event) {
    const toggleTriggerElement = event.target.closest("#toggle-pwd-visibility");
    if (!toggleTriggerElement) return;

    const targetPasswordFieldNode = document.getElementById("user-password");
    const operationalEyeIconElement = document.getElementById("eye-icon-target");

    if (targetPasswordFieldNode && operationalEyeIconElement) {
      if (targetPasswordFieldNode.type === "password") {
        targetPasswordFieldNode.type = "text";
        operationalEyeIconElement.className = "far fa-eye-slash text-sm";
      } else {
        targetPasswordFieldNode.type = "password";
        operationalEyeIconElement.className = "far fa-eye text-sm";
      }
    }
  });

  if (btnNext) {
    btnNext.addEventListener("click", function () {
      // Execute security check loops before unlocking the next operational card panel path
      const activeStepIsValid = validateActiveStepDataMatrix();
      if (!activeStepIsValid) return;

      if (currentStep < totalSteps) {
        // Step forward up the sequential framework ladder
        currentStep++;
        displayActiveStepCard();
      } else {
        // Final registration execution point reached
        executeFinalAccountSubmissionPipeline();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      if (currentStep > 1) {
        // Step down the workflow processing array path
        currentStep--;
        displayActiveStepCard();
      }
    });
  }

  /**
   * Compiles multi-step form data layers and maps execution straight down to Neon endpoints via JemerAuth.
   * If registration succeeds, transitions UI seamlessly over to the secure PIN entry mask modal.
   */
  async function executeFinalAccountSubmissionPipeline() {
    if (!flowWrapper || !verificationPanel || !globalFooter) return;

    // Acquire loading-state button elements to safely transition interface visual feedback
    const primarySubmitBtn = document.getElementById("next-step-action");
    const btnTextSpan = primarySubmitBtn ? primarySubmitBtn.querySelector("span") : null;
    const btnIcon = primarySubmitBtn ? primarySubmitBtn.querySelector("i") : null;

    // LAYER A: EXTRACT COMPREHENSIVE ONBOARDING DATA UTILITY FIELDS
    // We scrape all values from inputs across the active multi-step viewport cards setup
    const emailValue = document.querySelector('input[type="email"]')?.value || "";
    const passwordValue = document.getElementById("user-password")?.value || "";
    const firstNameValue = document.querySelector('input[name="first_name"]')?.value || "";
    const lastNameValue = document.querySelector('input[name="last_name"]')?.value || "";
    const dobValue = document.querySelector('input[name="dob"]')?.value || "";
    const universityValue = document.querySelector('input[name="institution"]')?.value || "";
    const degreeValue = document.querySelector('input[name="degree"]')?.value || "";
    const countryValue = document.getElementById("user-country")?.value || "";
    const languageValue = document.getElementById("user-language")?.value || "";

    // Assemble individual value mappings into a cohesive, standardized profile configuration payload bundle
    const studentEnrollmentPayload = {
      email: emailValue,
      password: passwordValue,
      firstName: firstNameValue,
      lastName: lastNameValue,
      dateOfBirth: dobValue,
      university: universityValue,
      degree: degreeValue,
      country: countryValue,
      language: languageValue
    };

    // 🔒 LAYER B: ACTIVE TRANSACTION PROCESSING FEEDBACK LOOPS
    // Freeze interaction buttons during flight duration to avoid duplicative thread execution calls
    if (primarySubmitBtn) primarySubmitBtn.disabled = true;
    if (btnTextSpan) btnTextSpan.innerText = "Creating Account Empire...";
    if (btnIcon) btnIcon.className = "fas fa-spinner animate-spin text-xs"; // Spin loader metrics graphics

    // Dispatch payload data arguments unto our globalized single-file authentication script layer engine
    const authPipelineResponse = await window.JemerAuth.signUpStudent(studentEnrollmentPayload);

    // Check transaction tracking outcomes; handle fallback execution blocks if parameters fail validations
    if (!authPipelineResponse || !authPipelineResponse.success) {
      alert(authPipelineResponse?.message || "Neon registration pipeline handshake parameters rejected.");
      // Unlock operations targets to allow clients to correct misconfigured text fields inputs
      if (primarySubmitBtn) primarySubmitBtn.disabled = false;
      if (btnTextSpan) btnTextSpan.innerText = "Create Account";
      if (btnIcon) btnIcon.className = "fas fa-check-circle text-xs";
      return; // Cut short processing operations immediately
    }

    // Trigger visual exit translations by fading out active components smoothly
    flowWrapper.classList.add("opacity-0");

    setTimeout(() => {
      // Unmount input field forms out of processing lines entirely
      flowWrapper.classList.add("hidden");
      globalFooter.classList.add("hidden");

      // Remount the email pin check layout elements matrix cleanly
      verificationPanel.classList.remove("hidden");
      
      // Force layout calculation refresh metrics transformations
      setTimeout(() => {
        verificationPanel.classList.remove("opacity-0", "translate-y-4");
        verificationPanel.classList.add("opacity-100", "translate-y-0");

        // Lock immediate interface focus directly onto the initial digit block position
        const primaryPinBlockBox = verificationPanel.querySelector(".pin-box");
        if (primaryPinBlockBox) primaryPinBlockBox.focus();
      }, 50);

    }, 300);
  }

  // Auto-focus progression manager for verification digit entry blocks (UPGRADED PIN PROCESSING LOOP)
  const pinInputMatrixContainer = document.getElementById("pin-input-matrix");
  if (pinInputMatrixContainer) {
    const individualPinBoxes = Array.from(pinInputMatrixContainer.querySelectorAll(".pin-box"));

    individualPinBoxes.forEach((box, index) => {
      // Listen for text input modifications to shift context focus forward automatically
      box.addEventListener("input", async function () {
        if (box.value.length === 1 && index < individualPinBoxes.length - 1) {
          individualPinBoxes[index + 1].focus();
        }

        // ⚡ SLICK AUTO-SUBMISSION PIPELINE UX WITH LOADING STATES
        // Continuously probe box matrices arrays to verify if the final character has been captured
        const assembledPinCodeString = individualPinBoxes.map(b => b.value.trim()).join("");
        if (assembledPinCodeString.length === individualPinBoxes.length) {
          // Temporarily freeze digit boxes fields to lock data changes while round-trip operations execute
          individualPinBoxes.forEach(b => b.disabled = true);
          
          // Elevate UX during flight duration by replacing helper labels with a status indicator
          const badgeIcon = verificationPanel.querySelector(".animate-pulse");
          const descriptiveLabel = verificationPanel.querySelector("p.text-sm");
          const defaultIconHTML = badgeIcon ? badgeIcon.innerHTML : null;
          const defaultText = descriptiveLabel ? descriptiveLabel.innerText : null;

          if (badgeIcon) {
            badgeIcon.innerHTML = `<i class="fas fa-circle-notch animate-spin"></i>`;
          }
          if (descriptiveLabel) {
            descriptiveLabel.innerText = "Verifying email activation code, authenticating session, and synchronizing profile with database... Please hold.";
            descriptiveLabel.className = "text-sm text-eduBlue-primary font-medium animate-pulse max-w-sm mx-auto";
          }

          console.log("[SIGNUP ENGINE] Code verification sequence matching code triggers. Evaluating PIN token...");
          // Submit the compiled verification PIN token straight through our JemerAuth runtime core instance
          const confirmationResponse = await window.JemerAuth.verifyRegistrationToken(assembledPinCodeString);

          if (confirmationResponse && confirmationResponse.success) {
            console.log("[SIGNUP ENGINE] Success! Profile token cleared. Navigating users down into login spaces.");
            // Route the workspace context link directly to your static login.html file
            window.location.href = "login.html";
          } else {
            // Alert user of expired or invalid character sequences inputs parameters
            alert(confirmationResponse?.message || "PIN verification checks rejected. Please verify code accuracy.");
            
            // Restore visual layout standards to permit retries
            if (badgeIcon && defaultIconHTML) badgeIcon.innerHTML = defaultIconHTML;
            if (descriptiveLabel && defaultText) {
              descriptiveLabel.innerText = defaultText;
              descriptiveLabel.className = "text-sm text-slate-500 leading-relaxed max-w-sm mx-auto";
            }

            // Reset character cell definitions to permit sequential retries tracks setup paths
            individualPinBoxes.forEach(b => {
              b.disabled = false;
              b.value = ""; // Clear values
            });
            // Bring input cursor anchors tightly back down onto the initial target input location block element
            individualPinBoxes[0].focus();
          }
        }
      });

      // Capture backspace events to shift context focus backward cleanly
      box.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && box.value.length === 0 && index > 0) {
          individualPinBoxes[index - 1].focus();
        }
      });
    });
  }

  // Wire up action logging listeners for simulated retransmission links
  const resendTokenActionAnchor = document.getElementById("resend-verification-token");
  if (resendTokenActionAnchor) {
    resendTokenActionAnchor.addEventListener("click", function () {
      alert("A fresh secure token check parameters pin code array has been re-dispatched to your email address location endpoint.");
    });
  }

  // ==========================================================================
  // 8. INTERFACE INITIALIZATION LIFE-CYCLE MODULES ENTRY
  // ==========================================================================
  displayActiveStepCard();

})();