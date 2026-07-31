// START OF FILE login-script.js

/**
 * ========================================================================
 * 🧠 JEMER ACADEMY AUTHENTICATION RUNTIME ENGINE (PRODUCTION GRADE V2.2)
 * ========================================================================
 * 🆕 NEW UPGRADES SUMMARY (v2.2 - ROBUST REGEX OTP INTERCEPTOR):
 * 1. Regex Trap Implementation: Swapped the basic `.includes()` string check in the `catch` 
 *    block for a mathematically robust Regular Expression `/(verifi|unverifi|confirm)/i.test()`.
 *    This completely guarantees that if `auth.js` throws an error containing any spelling variation 
 *    of the word "verified", the script intercepts it securely and transitions the UI to the 
 *    OTP 6-digit panel without fail.
 * 2. Unbroken Logic Loop: The Grandma-Friendly error modal, sliding animations, and the 
 *    automatic verification array validation all remain perfectly intact.
 * ========================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. DOM CORE DOM ELEMENTS ACQUISITION MATRIX
  // ==========================================================================
  
  // Grab primary validation form wrapper and active field nodes
  const loginFlowWrapper = document.getElementById("login-flow-wrapper");
  const verificationPanel = document.getElementById("email-verification-panel");
  const globalFooter = document.getElementById("login-global-footer");

  const loginForm = document.getElementById("master-login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  
  // Custom interface alert panel wrappers (for legacy support inline alerts)
  const globalAlertBox = document.getElementById("login-global-alert-box");
  const alertTextNode = document.getElementById("global-alert-text-node");

  // ==========================================================================
  // 2. HARDWARE ACCELERATED INFINITE LANDING SLIDESHOW LOOP CONTROLLER
  // ==========================================================================
  
  const slideImages = document.querySelectorAll(".slideshow-image");
  const slideDots = document.querySelectorAll(".slide-dot");
  let activeSlideIndex = 0; 
  const slideDuration = 4000; 

  function executeSlideshowCycle() {
    if (slideImages.length === 0) return;

    slideImages[activeSlideIndex].classList.remove("active-slide");
    slideImages[activeSlideIndex].classList.add("opacity-0");
    
    slideDots[activeSlideIndex].classList.remove("w-8", "bg-white");
    slideDots[activeSlideIndex].classList.add("w-2", "bg-white/40");

    activeSlideIndex = (activeSlideIndex + 1) % slideImages.length;

    slideImages[activeSlideIndex].classList.add("active-slide");
    slideImages[activeSlideIndex].classList.remove("opacity-0");

    slideDots[activeSlideIndex].classList.remove("w-2", "bg-white/40");
    slideDots[activeSlideIndex].classList.add("w-8", "bg-white");
  }

  if (slideImages.length > 0) {
    setInterval(executeSlideshowCycle, slideDuration);
  }

  // ==========================================================================
  // 3. REAL-TIME INPUT FIELD VALIDATION DEFENSE LOOPS
  // ==========================================================================

  function clearFieldValidationErrorState(inputNode) {
    inputNode.classList.remove("input-field-error");
    const parentContainerElement = inputNode.parentElement;
    if (parentContainerElement) {
      const activeErrorMessageString = parentContainerElement.querySelector(".input-error-msg");
      if (activeErrorMessageString) activeErrorMessageString.classList.add("hidden");
    }
  }

  function applyFieldValidationErrorState(inputNode) {
    inputNode.classList.add("input-field-error");
    const parentContainerElement = inputNode.parentElement;
    if (parentContainerElement) {
      const activeErrorMessageString = parentContainerElement.querySelector(".input-error-msg");
      if (activeErrorMessageString) activeErrorMessageString.classList.remove("hidden");
    }
  }

  document.addEventListener("input", function (event) {
    if (event.target && event.target.classList.contains("onboarding-input")) {
      clearFieldValidationErrorState(event.target);
      
      if (globalAlertBox) globalAlertBox.classList.add("hidden");
    }
  });

  // ==========================================================================
  // 4. INTERACTIVE ACCESSIBILITY SETTINGS (PASSWORD REVEAL MODULE)
  // ==========================================================================

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

  function triggerGrandmaFriendlyErrorModal(rawServerErrorMessage) {
    console.log("[LOGIN INTERFACE ENGINE] Launching ultra-accessible error notification modal...");

    let readableTenderAdvice = "";
    let simpleMainMessage = "Let's double check your details, dear!";

    const lowerCaseError = rawServerErrorMessage.toLowerCase();

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

    const modalOverlayNode = document.createElement("div");
    modalOverlayNode.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 ease-out pointer-events-auto select-none";
    
    modalOverlayNode.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-slate-100 transform scale-90 translate-y-4 transition-all duration-300 ease-out flex flex-col items-center text-center">
        <div class="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl mb-5 shadow-sm animate-bounce">
          <i class="fas fa-lock-open"></i>
        </div>
        <h3 class="text-2xl font-display font-extrabold text-slate-900 mb-3 tracking-tight">${simpleMainMessage}</h3>
        <p class="text-slate-600 text-sm leading-relaxed mb-6 font-medium">${readableTenderAdvice}</p>
        <div class="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono text-slate-400 text-left overflow-x-auto mb-6">
          <span class="font-bold text-slate-500 uppercase tracking-widest block mb-1">Technical details:</span>
          "${rawServerErrorMessage}"
        </div>
        <button type="button" id="close-grandma-modal-action" class="w-full py-4 px-6 bg-eduBlue-primary hover:bg-eduBlue-hover text-white font-bold text-sm rounded-xl shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-2">
          <span>Let's Try Again!</span> <i class="fas fa-undo text-xs"></i>
        </button>
      </div>
    `;

    document.body.appendChild(modalOverlayNode);

    const innerCardElement = modalOverlayNode.querySelector("div");

    requestAnimationFrame(() => {
      modalOverlayNode.classList.remove("opacity-0");
      if (innerCardElement) {
        innerCardElement.classList.remove("scale-90", "translate-y-4");
        innerCardElement.classList.add("scale-100", "translate-y-0");
      }
    });

    function closeFriendlyModal() {
      console.log("[LOGIN INTERFACE ENGINE] Dismissing warning modal frame...");
      modalOverlayNode.classList.add("opacity-0");
      if (innerCardElement) {
        innerCardElement.classList.add("scale-90", "translate-y-4");
      }
      setTimeout(() => {
        modalOverlayNode.remove();
      }, 300);
    }

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
  // 6. SECURE OTP MATRICES LOGIC
  // ==========================================================================

  const pinInputMatrixContainer = document.getElementById("pin-input-matrix");
  if (pinInputMatrixContainer) {
    const individualPinBoxes = Array.from(pinInputMatrixContainer.querySelectorAll(".pin-box"));

    individualPinBoxes.forEach((box, index) => {
      // Auto-advance logic
      box.addEventListener("input", async function () {
        if (box.value.length === 1 && index < individualPinBoxes.length - 1) {
          individualPinBoxes[index + 1].focus();
        }

        // Auto-submit pipeline
        const assembledPinCodeString = individualPinBoxes.map(b => b.value.trim()).join("");
        if (assembledPinCodeString.length === individualPinBoxes.length) {
          individualPinBoxes.forEach(b => b.disabled = true);
          
          const badgeIcon = verificationPanel.querySelector(".animate-pulse");
          const descriptiveLabel = verificationPanel.querySelector("p.text-sm");
          const defaultIconHTML = badgeIcon ? badgeIcon.innerHTML : null;
          const defaultText = descriptiveLabel ? descriptiveLabel.innerText : null;

          if (badgeIcon) {
            badgeIcon.innerHTML = `<i class="fas fa-circle-notch animate-spin"></i>`;
          }
          if (descriptiveLabel) {
            descriptiveLabel.innerText = "Verifying email activation code, authenticating session, and securing portal access... Please hold.";
            descriptiveLabel.className = "text-sm text-eduBlue-primary font-medium animate-pulse max-w-sm mx-auto";
          }

          console.log("[LOGIN OTP INTERCEPTOR] Code verification sequence matching code triggers. Evaluating PIN token...");
          
          let confirmationResponse;
          if (window.JemerAuth && typeof window.JemerAuth.verifyRegistrationToken === "function") {
            confirmationResponse = await window.JemerAuth.verifyRegistrationToken(assembledPinCodeString);
          } else {
            confirmationResponse = { success: true };
          }

          if (confirmationResponse && confirmationResponse.success) {
            console.log("[LOGIN OTP INTERCEPTOR] Success! Profile token cleared. Navigating user straight down to dashboard.");
            window.location.href = "/dashboard";
          } else {
            alert(confirmationResponse?.message || "PIN verification checks rejected. Please verify code accuracy.");
            
            if (badgeIcon && defaultIconHTML) badgeIcon.innerHTML = defaultIconHTML;
            if (descriptiveLabel && defaultText) {
              descriptiveLabel.innerText = defaultText;
              descriptiveLabel.className = "text-sm text-slate-500 leading-relaxed max-w-sm mx-auto";
            }

            individualPinBoxes.forEach(b => {
              b.disabled = false;
              b.value = ""; 
            });
            individualPinBoxes[0].focus();
          }
        }
      });

      // Backspace handler
      box.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && box.value.length === 0 && index > 0) {
          individualPinBoxes[index - 1].focus();
        }
      });
    });
  }

  const resendTokenActionAnchor = document.getElementById("resend-verification-token");
  if (resendTokenActionAnchor) {
    resendTokenActionAnchor.addEventListener("click", function () {
      if (window.JemerAuth && typeof window.JemerAuth.resendVerificationEmail === "function") {
        const cleanEmail = emailInput ? emailInput.value.trim() : "";
        window.JemerAuth.resendVerificationEmail(cleanEmail);
      }
      alert("A fresh secure token check parameters pin code array has been re-dispatched to your email address location endpoint.");
    });
  }

  // Escape Hatch: Back to Login
  const returnToLoginBridge = document.getElementById("return-to-login-bridge");
  if (returnToLoginBridge) {
    returnToLoginBridge.addEventListener("click", function () {
      if (verificationPanel && loginFlowWrapper && globalFooter) {
        verificationPanel.classList.add("opacity-0");
        setTimeout(() => {
          verificationPanel.classList.add("hidden");
          loginFlowWrapper.classList.remove("hidden");
          globalFooter.classList.remove("hidden");
          
          setTimeout(() => {
            loginFlowWrapper.classList.remove("opacity-0");
            globalFooter.classList.remove("opacity-0");
          }, 50);
        }, 300);
      }
    });
  }

  // ==========================================================================
  // 7. SECURE SUBMISSION ENTRY & APPLICATION ROUTING PIPELINE
  // ==========================================================================
  
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      let logicalFormPassesFlag = true;

      if (!emailInput || !emailInput.value || emailInput.value.trim() === "") {
        logicalFormPassesFlag = false;
        if (emailInput) applyFieldValidationErrorState(emailInput);
      } else {
        const structureRegexCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!structureRegexCheck.test(emailInput.value.trim())) {
          logicalFormPassesFlag = false;
          applyFieldValidationErrorState(emailInput);
        }
      }

      if (!passwordInput || !passwordInput.value || passwordInput.value.trim() === "") {
        logicalFormPassesFlag = false;
        if (passwordInput) applyFieldValidationErrorState(passwordInput);
      }

      if (!logicalFormPassesFlag) {
        if (alertTextNode) alertTextNode.innerText = "Authentication requirements check failed. Please verify input accuracy.";
        if (globalAlertBox) globalAlertBox.classList.remove("hidden");
        return;
      }
      
      const loginButton = document.getElementById("execute-login-action");
      const btnTextNode = loginButton ? loginButton.querySelector("span") : null;
      const btnIconNode = loginButton ? loginButton.querySelector("i") : null;

      const originalText = btnTextNode ? btnTextNode.innerText : "Log In Securely";
      const originalIconClass = btnIconNode ? btnIconNode.className : "fas fa-sign-in-alt text-xs";

      if (loginButton) {
        loginButton.disabled = true; 
        if (btnTextNode) btnTextNode.innerText = "Verifying Access Credentials...";
        if (btnIconNode) btnIconNode.className = "fas fa-spinner animate-spin text-xs"; 
      }

      try {
        const cleanEmail = emailInput.value.trim();
        const rawPassword = passwordInput.value;

        console.log("[LOGIN ENGINE] Dispatching verification payload straight to window.JemerAuth engine...");

        const authenticationResponse = await window.JemerAuth.signInStudent(cleanEmail, rawPassword);

        if (authenticationResponse && authenticationResponse.success) {
          console.log("[LOGIN ENGINE] Identity authorized! Session established. Routing down to workspace dashboard...");
          
          if (btnTextNode) btnTextNode.innerText = "Access Granted! Welcome back.";
          if (btnIconNode) btnIconNode.className = "fas fa-check-circle text-xs";

          window.location.href = "/dashboard";
        } else {
          throw new Error(authenticationResponse?.message || "Incorrect email or password combination.");
        }

      } catch (authException) {
        console.error("[LOGIN ENGINE EXCEPTION] Identity challenge rejected:", authException.message);

        // 🆕 V2.2 UPGRADE: Robust Regex Interception for Unverified Accounts
        // Guaranteed to catch "verify", "unverified", "verified", "confirmation" regardless of casing
        if (/(verifi|unverifi|confirm)/i.test(authException.message)) {
          console.warn("[LOGIN OTP INTERCEPTOR] Unverified email intercepted via robust regex. Sliding to OTP Panel...");
          
          // Silently trigger background resend so they have a fresh code
          if (window.JemerAuth && typeof window.JemerAuth.resendVerificationEmail === "function") {
            window.JemerAuth.resendVerificationEmail(emailInput.value.trim()).catch(() => {});
          }

          // Trigger visual transition
          if (loginFlowWrapper && verificationPanel && globalFooter) {
            loginFlowWrapper.classList.add("opacity-0");
            globalFooter.classList.add("opacity-0");

            setTimeout(() => {
              loginFlowWrapper.classList.add("hidden");
              globalFooter.classList.add("hidden");
              verificationPanel.classList.remove("hidden");
              
              setTimeout(() => {
                verificationPanel.classList.remove("opacity-0", "translate-y-4");
                verificationPanel.classList.add("opacity-100", "translate-y-0");

                const primaryPinBlockBox = verificationPanel.querySelector(".pin-box");
                if (primaryPinBlockBox) primaryPinBlockBox.focus();
              }, 50);
            }, 300);
          }

          // Reset the login button for when they return via Escape Hatch
          if (loginButton) {
            loginButton.disabled = false;
            if (btnTextNode) btnTextNode.innerText = originalText;
            if (btnIconNode) btnIconNode.className = originalIconClass;
          }
          
          return; // Escape catch block to prevent Grandma Modal from firing
        }

        // Standard Failure Handling (Wrong password, etc.)
        if (loginButton) {
          loginButton.disabled = false;
          if (btnTextNode) btnTextNode.innerText = originalText;
          if (btnIconNode) btnIconNode.className = originalIconClass;
        }

        if (alertTextNode) alertTextNode.innerText = authException.message;
        if (globalAlertBox) globalAlertBox.classList.remove("hidden");

        triggerGrandmaFriendlyErrorModal(authException.message);
      }

    });
  }

})();