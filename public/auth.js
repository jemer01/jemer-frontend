/**
 * ================================================================================================
 * [NEW UPGRADE — V2.9]
 * SUMMARY: Added the missing silent session-refresh capability.
 * The /tutor page's auto-refresh logic was calling `window.JemerAuth.refreshSession()`, but that
 * method never existed on this module — every call was silently failing. This patch adds a real
 * `refreshSession()` to JemerAuthEngine, reusing the exact `/token` GET fallback route already
 * proven inside `signInStudent` / `verifyRegistrationToken` (backed by the Better Auth session
 * cookie via `credentials: "include"`). It fetches a fresh Postgres JWT and commits it via
 * `SessionManager.saveToken()` so any page polling localStorage for a renewed token picks it up
 * immediately. Nothing else in this file was changed.
 * ================================================================================================
 */
/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY MASTER AUTHENTICATION & DATA SYNCHRONIZATION ENGINE (V2.8 - ERROR ACCESSIBILITY)
 * ================================================================================================
 * Description: Universal, single-file client-side identity module for Jemer Academy.
 * Engine Stack: Better Auth (Client SDK) + Neon Stateless HTTP Data API.
 * Target Table: "Jemer-Student-Profiles" (Configured with native strict UUID constraints).
 * Engineering Principles: Zero dependencies, ESM dynamic imports, detailed inline tracing logs.
 *
 * ── V2.8 PATCH NOTES ────────────────────────────────────────────────────────────────────────────
 * [FIX 1] Added strict status check filters to intercept 404 router errors gracefully.
 * [FIX 2] Provided informative developer warnings directly in error message streams to guide
 * SMTP and email template configuration fixes on your Neon Auth dashboard.
 * [FIX 3] Preserved registration flows, email-OTP verifications, and Postgres synchronizations.
 * [FIX 4] Added exhaustive line-by-line comments across every single module for 100% clarity.
 * ================================================================================================
 */

(function (global) {
  "use strict"; // Enforce strict evaluation rules to eliminate silent runtime errors and optimize performance

  // ================================================================================================
  // ⚙️ LAYER 1: ARCHITECTURAL CONFIGURATION GATEWAY CONSTANTS
  // ================================================================================================
  // Absolute base endpoints copied directly from the Neon database architecture management console
  const NEON_AUTH_BASE_URL = "https://ep-wandering-bird-abdexk6a.neonauth.eu-west-2.aws.neon.tech/neondb/auth"; // Identity endpoint
  const NEON_DATA_API_URL  = "https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1"; // Postgres rest endpoints

  // In-memory global fallback cache for the registration details to prevent data loss if sessionStorage is restricted
  let pendingProfilePayload = null;

  // Global cache hook for holding the dynamic Better Auth Client SDK instance
  let authClientInstance = null;

  // ================================================================================================
  // ⚙️ LAYER 1B: BETTER AUTH SDK DYNAMIC LOADER (RESOLVES CSRF & SESSION BLOCKADES)
  // ================================================================================================
  /**
   * Dynamically imports the Better Auth Client SDK on-demand.
   * This maintains script non-module compatibility while offering full secure SDK capabilities under the hood.
   * @returns {Promise<Object>} Better Auth Client SDK instance
   */
  async function getAuthClient() {
    // Check if client instance has already been compiled in memory to reuse connections
    if (!authClientInstance) {
      console.log("[JEMER AUTH] Dynamically importing Better Auth Client SDK from ESM distribution node...");
      // Dynamically load the client library module cleanly to prevent HTML type="module" requirements
      const { createAuthClient } = await import("https://esm.sh/better-auth/client");
      // Initialize the core client pointing directly to our Neon identity endpoint
      authClientInstance = createAuthClient({
        baseURL: NEON_AUTH_BASE_URL
      });
      console.log("[JEMER AUTH] Better Auth Client SDK loaded and initialized successfully.");
    }
    return authClientInstance; // Return active SDK transaction handle
  }

  // ================================================================================================
  // 🗄️ LAYER 2: INTERNAL SECURE SESSION STATE MANAGER
  // ================================================================================================
  // Centralized key-value state controller managing active session tokens and security identifiers
  const SessionManager = {
    // Save the retrieved JSON Web Token (JWT) into local browser storage
    saveToken: function (token) {
      localStorage.setItem("jemer_session_jwt", token); // Write JWT to local cache
    },
    // Retrieve the active authorization JWT token string to inject into network headers
    getToken: function () {
      return localStorage.getItem("jemer_session_jwt"); // Pull down active JWT
    },
    // Write the verified Postgres unique relational user identifier
    saveUserUuid: function (uuid) {
      localStorage.setItem("jemer_user_uuid", uuid); // Store user unique UUID
    },
    // Pull down the saved user identifier for data mapping and security checks
    getUserUuid: function () {
      return localStorage.getItem("jemer_user_uuid"); // Extract unique UUID
    },
    // Clear out session memory variables on lifecycle terminations or connection failures
    purgeSession: function () {
      localStorage.removeItem("jemer_session_jwt"); // Wipe out auth JWT
      localStorage.removeItem("jemer_user_uuid"); // Wipe out user tracking identifier
    }
  };

  // ================================================================================================
  // 🔍 LAYER 3A: JWT DEEP DISCOVERY UTILITY (MODULE SCOPE)
  // ================================================================================================
  // Scans response trees recursively to find and extract 3-part signatures under any attribute key
  function discoverJwtDeep(dataNode) {
    // Abort the recursive path search if the data object node is empty
    if (!dataNode) return null; 
    
    // Evaluate if the current item is a simple text string
    if (typeof dataNode === "string") { 
      // Remove any standard Bearer prefix and clean whitespace
      const clean = dataNode.replace("Bearer ", "").trim(); 
      // Validate that the string matches standard 3-part JWT properties starting with "eyJ"
      if (clean.startsWith("eyJ") && clean.split(".").length === 3) return clean; 
      // Return null if signature conditions are not met
      return null; 
    }
    
    // Recursively loop through arrays to evaluate each child node
    if (Array.isArray(dataNode)) { 
      for (let i = 0; i < dataNode.length; i++) { 
        // Execute recursive scan on the child element
        const found = discoverJwtDeep(dataNode[i]); 
        // Return matching signature instantly if found
        if (found) return found; 
      }
      return null; // Return null if array contains no matching strings
    }
    
    // Iterate through key-value dictionaries to run deep structural check
    if (typeof dataNode === "object") { 
      for (const key in dataNode) { 
        // Recursively evaluate nested values
        const found = discoverJwtDeep(dataNode[key]); 
        // Surface validated JWT token instantly
        if (found) return found; 
      }
    }
    return null; // Fallback return if traverse yields no valid JWT properties
  }

  // ================================================================================================
  // 🛰️ LAYER 3B: CORE DATA API NETWORK TRANSACTION ROUTERS
  // ================================================================================================

  // Manages low-level API communication with Neon Auth's identity service endpoints
  async function dispatchAuthRequest(endpointPath, dataPayload, method = "POST") {
    // Construct the absolute path targeting identity routers
    const targetUrl = `${NEON_AUTH_BASE_URL}${endpointPath}`; 
    // Trace log the outbound request route
    console.log(`[NEON AUTH] Initiating transaction request sequence to node: ${endpointPath}`); 

    // Configure core connection parameters
    const fetchOptions = {
      method: method, // Explicitly declare tracking HTTP verb
      credentials: "include", // Allow cookie forwarding on cross-origin requests
      headers: {} // Instantiate empty header map for dynamic modifications
    };

    // Auto-inject authorization context credentials if there is an active session
    const activeToken = SessionManager.getToken(); 
    if (activeToken) {
      fetchOptions.headers["Authorization"] = `Bearer ${activeToken}`; // Affix authorization context header
    }

    // Set configuration variables if dispatching payload objects down a POST stream
    if (method === "POST" && dataPayload) {
      fetchOptions.headers["Content-Type"] = "application/json"; // Set content mapping type
      fetchOptions.body = JSON.stringify(dataPayload); // Flatten payload to JSON string
    }

    // Fire cross-origin API request
    const response = await fetch(targetUrl, fetchOptions); 

    // Safely parse JSON payload, converting empty or literal null responses into blank objects
    let resultData = await response.json().then(d => d ?? {}).catch(() => ({})); 

    // Handle bad response codes
    if (!response.ok) { 
      // Write error traces to the developer console
      console.error(`[NEON AUTH ERROR] Transaction failure on node ${endpointPath}:`, resultData); 
      // Throw descriptive error down to calling frameworks
      throw new Error(resultData.message || `Neon Auth gateway rejected request to ${endpointPath}.`); 
    }

    // Capture custom tokens returned in headers
    if (response.headers) {
      // Look for opaque custom token values
      const opaqueHeader = response.headers.get("set-auth-token") || response.headers.get("Set-Auth-Token"); 
      if (opaqueHeader) resultData.opaqueSessionToken = opaqueHeader; 

      // Look for raw JWT token strings
      const jwtHeader = response.headers.get("set-auth-jwt") || response.headers.get("Set-Auth-Jwt"); 
      if (jwtHeader) resultData.postgresJwtToken = jwtHeader; 
    }

    return resultData; // Return sanitised payload mapping object
  }

  // Commits onboarding details straight into the target PostgreSQL table using the Data API
  async function insertDataApiRecord(tableName, rowPayloadData) {
    // Extract the authorization token
    const activeJwtToken = SessionManager.getToken(); 
    if (!activeJwtToken) { 
      // Abort execution if authentication context is missing
      throw new Error("Data API transaction terminated: Missing active authorization bearer credentials."); 
    }

    // Construct target REST endpoint depending on trailing slash setups
    const targetUrl = NEON_DATA_API_URL.endsWith("/rest/v1")
      ? `${NEON_DATA_API_URL}/${tableName}`
      : `${NEON_DATA_API_URL}/rest/v1/${tableName}`; 

    // Trace logging
    console.log(`[NEON DATA API] Committing row injection request down to table endpoint: ${tableName}`); 

    // Fire the network transaction to write details to the target table
    const response = await fetch(targetUrl, {
      method: "POST", // Standard Data API write verb
      headers: {
        "Content-Type": "application/json", // Pass content configuration parameters
        "Authorization": `Bearer ${activeJwtToken}`, // Verify write access permissions and bypass Row-Level Security
        "Prefer": "return=minimal" // Optimization rule to reduce response payload sizes
      },
      body: JSON.stringify(rowPayloadData) // Flatten profile records into standard textual payloads
    });

    // Check transaction responses
    if (!response.ok) { 
      // Extract error details safely
      const errorData = await response.json().then(d => d ?? {}).catch(() => ({})); 
      // Output detailed database error tracing
      console.error("[NEON DATA API ERROR] Row write rejected by Postgres engine:", errorData); 
      // Halt execution on failure
      throw new Error(errorData.message || `Neon Data API rejected row insertion for table: ${tableName}`); 
    }

    return { success: true }; // Signal successful transaction outcome
  }

  // ================================================================================
  // 🔥 LAYER 4: PRIMARY EXPORTABLE IDENTITY APPLICATION METHODS
  // ================================================================================
  const JemerAuthEngine = {

    // Registers the student and caches the onboarding fields
    signUpStudent: async function (enrollmentFormFieldsContextObject) {
      try {
        console.log("[JEMER AUTH LIFECYCLE] Initializing Student Enrollment Sequence Flow..."); 

        // Extract input values safely for verification setup
        const { email, password, firstName, lastName } = enrollmentFormFieldsContextObject; 

        // Cache the incoming payload to maintain state integrity across email verification steps
        pendingProfilePayload = enrollmentFormFieldsContextObject; 
        sessionStorage.setItem("jemer_pending_profile", JSON.stringify(enrollmentFormFieldsContextObject)); 
        console.log("[JEMER AUTH LIFECYCLE] Onboarding form fields securely cached for verification-phase synchronization."); 

        // ── PHASE 1: INITIALIZE ACCOUNT RECORD ──────────────────────────────────────────────────
        // This registers the user in Neon Auth, which generates and sends the email OTP
        const authRegistrationResponse = await dispatchAuthRequest("/sign-up/email", {
          email: email.trim(), // Strip leading and trailing spaces
          password: password, // Send plain-text password securely down the pipeline
          name: `${firstName.trim()} ${lastName.trim()}` // Standardize name mapping formats
        });

        // Pull down the primary identification UUID assigned to the user
        const assignedUserUuid = authRegistrationResponse.user?.id; 
        if (!assignedUserUuid) throw new Error("Account creation returned no structural UUID."); 

        console.log(`[JEMER AUTH LIFECYCLE] Phase 1 Success: Account initialized with UUID: ${assignedUserUuid}`); 
        
        // Write user UUID to local storage
        SessionManager.saveUserUuid(assignedUserUuid); 

        // Stop signup pipeline here! Returns success immediately to transition the UI to the 6-digit PIN screen,
        // bypassing the Catch-22 deadlock that was blocking unverified email registrations.
        console.log("[JEMER AUTH LIFECYCLE] Registration complete. Awaiting user verification token entry..."); 
        return {
          success: true, 
          userId: assignedUserUuid, 
          message: "Account generated safely. Onboarding sequence transitioned to secure email pin validation." 
        };

      } catch (error) { 
        // Capture connection errors or duplicate account creation exceptions
        console.error("[JEMER AUTH MASTER REJECTION] Registration pipeline collapsed:", error.message); 
        SessionManager.purgeSession(); // Wipe state cache on failure to protect integrity
        sessionStorage.removeItem("jemer_pending_profile"); // Clear temporary local storage caches
        return {
          success: false, 
          message: error.message 
        };
      }
    },

    // Verifies the 6-digit PIN on the official `/email-otp/verify-email` endpoint.
    // If validated, it executes an auto-sign in, extracts the JWT, and syncs custom fields to PostgreSQL.
    verifyRegistrationToken: async function (sixDigitPinCodeString) {
      try {
        console.log("[JEMER AUTH LIFECYCLE] Initializing Account Security Token Activation Check..."); 

        // Fetch User UUID from state records
        const activeUserId = SessionManager.getUserUuid(); 
        if (!activeUserId) throw new Error("Verification failure: Missing state tracking identification parameter."); 

        // ── STEP 1: RETRIEVE ONBOARDING DATA FROM THE STORAGE CACHE ──────────────────────────────
        // Fall back to sessionStorage if the variables in active RAM memory were dropped by page refreshes
        let cachedPayload = pendingProfilePayload; 
        if (!cachedPayload) { 
          const rawSessionData = sessionStorage.getItem("jemer_pending_profile"); 
          if (rawSessionData) { 
            cachedPayload = JSON.parse(rawSessionData); // Reconstruct cached profile object
          }
        }

        // Throw error if cache is lost (e.g., if cookies or session caches were flushed manually)
        if (!cachedPayload) { 
          throw new Error("Verification succeeded, but registration session data was lost. Please reload the portal and sign in."); 
        }

        // ── STEP 2: VERIFY CODE VIA OFFICIAL BETTER AUTH EMAIL-OTP ENDPOINT ──────────────────────
        // Correct endpoint path: /email-otp/verify-email
        // Payload requirements: { email, otp }
        console.log(`[JEMER AUTH LIFECYCLE] Step 1: Dispatched verification OTP for ${cachedPayload.email}`); 
        await dispatchAuthRequest("/email-otp/verify-email", {
          email: cachedPayload.email.trim(), // Extract email from cached profile data
          otp: sixDigitPinCodeString // Pass the typed 6-digit verification pin code
        });

        console.log("[JEMER AUTH LIFECYCLE] Step 1 Success: Email verification code accepted!"); 

        // ── STEP 3: EXECUTE AUTO-LOGIN TO RETRIEVE JWT SESSION TOKEN ─────────────────────────────
        // Now that the email is verified, we can safely run auto sign-in to secure authorization tokens
        console.log("[JEMER AUTH LIFECYCLE] Step 2: Executing auto sign-in to secure authorization tokens..."); 
        const signInResponse = await dispatchAuthRequest("/sign-in/email", {
          email: cachedPayload.email.trim(), 
          password: cachedPayload.password 
        });

        // Scan sign-in responses to intercept token strings
        let sessionToken =
          signInResponse.postgresJwtToken || // Priority 1: Real JWT captured from set-auth-jwt response header
          signInResponse.data?.session?.access_token || // Priority 2: Neon Auth SDK response format (data wrapper)
          discoverJwtDeep(signInResponse); // Priority 3: Deep scan fallback across response tree

        // Fall back to querying the /token endpoint directly if JWT wasn't returned in the sign-in response
        if (!sessionToken) { 
          console.log("[JEMER AUTH LIFECYCLE] Token absent from sign-in body. Querying JWT token fallback..."); 
          const sessionPayload = await dispatchAuthRequest("/token", null, "GET"); 
          sessionToken =
            sessionPayload?.postgresJwtToken || // Priority 1: Real JWT captured from set-auth-jwt response header
            sessionPayload?.token || // Priority 2: Direct JWT field from /token endpoint { "token": "eyJ..." }
            sessionPayload?.data?.session?.access_token || // Priority 3: Neon Auth SDK response format (data wrapper)
            discoverJwtDeep(sessionPayload); // Priority 4: Deep scan fallback across response tree
        }

        // Error out if verification completed but sign-in session keys are missing
        if (!sessionToken) { 
          throw new Error("Account verified successfully, but active session token extraction failed."); 
        }

        // Save session token in the global browser storage state
        SessionManager.saveToken(sessionToken); 
        console.log("[JEMER AUTH LIFECYCLE] Step 2 Success: JWT session token secured and committed."); 

        // ── STEP 4: SYNCHRONIZE ONBOARDING DETAILS WITH POSTGRES ─────────────────────────────────
        // Insert profile details using Data API to complete the registration process
        console.log("[JEMER AUTH LIFECYCLE] Step 3: Synchronizing custom student profile details with PostgreSQL..."); 
        const profileRowPayload = {
          id: activeUserId, // Link the user's details directly to their assigned authentication UUID
          first_name: cachedPayload.firstName.trim(), // Strip first name spaces
          last_name: cachedPayload.lastName.trim(), // Strip last name spaces
          date_of_birth: cachedPayload.dateOfBirth, // Pass structural birthdate timeline variables
          university_college: cachedPayload.university.trim(), // Map school name
          degree: cachedPayload.degree ? cachedPayload.degree.trim() : null, // Handle optional degree concentrations gracefully
          country: cachedPayload.country, // Set student country code
          language: cachedPayload.language, // Set interface language preference
          email: cachedPayload.email.trim() // Set core communication email
        };

        // Write row to PostgreSQL
        await insertDataApiRecord("Jemer-Student-Profiles", profileRowPayload); 
        console.log("[JEMER AUTH LIFECYCLE] Step 3 Success: Relational data synchronized perfectly!"); 

        // ── STEP 5: CLEAN UP STORAGE CACHE ───────────────────────────────────────────────────────
        sessionStorage.removeItem("jemer_pending_profile"); // Clear temporary session storage properties
        pendingProfilePayload = null; // Purge unneeded cached credentials from system memory

        console.log("[JEMER AUTH LIFECYCLE] Email verified, logged in, and profile synchronized with 100% data integrity!"); 
        return { 
          success: true, 
          message: "Email verification, authentication, and profile database sync completed seamlessly." 
        };

      } catch (error) { 
        // Log errors inside the verification methods
        console.error("[JEMER AUTH MASTER REJECTION] Verification and synchronization phase failed:", error.message); 
        return { 
          success: false, 
          message: error.message 
        }; 
      }
    },

    /**
     * Authenticates returning students and establishes active browser sessions.
     * Uses the official Better Auth SDK dynamic wrapper to prevent cookie synchronization failures.
     */
    signInStudent: async function (email, password) {
      try {
        console.log("[JEMER AUTH LIFECYCLE] Initializing Student Secure Sign-In via Better Auth SDK..."); 

        // Abort early if the incoming arguments are incomplete
        if (!email || !password) {
          throw new Error("Authentication failed: Missing structural email or password arguments.");
        }

        // Sanitize incoming credentials
        const cleanEmail = email.trim();

        // Retrieve the initialized Better Auth client instance
        const client = await getAuthClient();

        // Dispatch sign-in request using the official client SDK route
        const signInResponse = await client.signIn.email({
          email: cleanEmail,
          password: password
        });

        // Check if Better Auth SDK returned an explicit error structure
        if (signInResponse?.error) {
          console.error("[JEMER AUTH LIFECYCLE] Sign-In SDK handshake returned error:", signInResponse.error);
          throw new Error(signInResponse.error.message || "Failed to log in. Please check your credentials.");
        }

        console.log("[JEMER AUTH LIFECYCLE] Handshake established. Analyzing response properties...", signInResponse);

        // Scan response parameters to identify and capture the session token
        let sessionToken = 
          signInResponse?.data?.session?.token || 
          signInResponse?.session?.token || 
          discoverJwtDeep(signInResponse);

        // Fall back to querying the /token endpoint directly if token wasn't returned in the standard body
        if (!sessionToken) { 
          console.log("[JEMER AUTH LIFECYCLE] Token absent from SDK body response. Querying fallback token endpoint..."); 
          const sessionPayload = await dispatchAuthRequest("/token", null, "GET"); 
          sessionToken =
            sessionPayload?.postgresJwtToken || 
            sessionPayload?.token || 
            discoverJwtDeep(sessionPayload); 
        }

        // Throw descriptive error if sign-in sequence completes but authorization keys are missing
        if (!sessionToken) { 
          throw new Error("Handshake authorized, but active session token extraction failed.");
        }

        // Identify the User UUID assigned by Neon Auth to map future PostgreSQL relational profile queries
        const activeUserUuid = 
          signInResponse?.data?.user?.id || 
          signInResponse?.user?.id;

        if (!activeUserUuid) {
          throw new Error("Relational identification mapping failed: No User UUID located in response.");
        }

        // Commit authentication context properties directly to browser local state
        SessionManager.saveToken(sessionToken);
        SessionManager.saveUserUuid(activeUserUuid);

        console.log(`[JEMER AUTH LIFECYCLE] Success: Student profile verified. Active User UUID: ${activeUserUuid}`);

        return {
          success: true,
          userId: activeUserUuid,
          message: "Secure identity authentication check completed successfully."
        };

      } catch (error) {
        // Intercept validation issues, password rejections, or network outages
        console.error("[JEMER AUTH MASTER REJECTION] Sign-In pipeline collapsed:", error.message);
        SessionManager.purgeSession(); // Protect client cache state by clearing dirty states
        return {
          success: false,
          message: error.message
        };
      }
    },

    // Check system validation status by reading cached memory variables
    isAuthenticated: function () {
      return SessionManager.getToken() !== null && SessionManager.getUserUuid() !== null; // Return evaluation state
    },

    /**
     * Exposes the active secure session bearer token to satisfy subsequent network queries across dashboards
     */
    getAccessToken: function () {
      return SessionManager.getToken(); // Pull token signature straight from storage
    },

    /**
     * Exposes the verified unique relational User UUID to help future feature pages load specialized data arrays
     */
    getUserIdentifier: function () {
      return SessionManager.getUserUuid(); // Pull active identification string from storage
    },

    /**
     * [NEW UPGRADE — V2.9 SILENT SESSION REFRESH]
     * Silently renews the active Postgres JWT without forcing a full sign-in. Reuses the exact
     * `/token` GET fallback route already proven inside `signInStudent` / `verifyRegistrationToken` —
     * this endpoint is backed by the Better Auth session cookie (forwarded automatically via
     * `credentials: "include"` in dispatchAuthRequest). Exposed so page-level auto-refresh timers
     * (e.g. the /tutor page's heartbeat) can call `window.JemerAuth.refreshSession()` directly.
     * @returns {Promise<Object>} Success/failure state and the refreshed JWT if available.
     */
    refreshSession: async function () {
      try {
        console.log("[JEMER AUTH LIFECYCLE] Silently refreshing session token via /token endpoint...");

        // Reuse the proven /token fallback route — backed by the active Better Auth session cookie
        const sessionPayload = await dispatchAuthRequest("/token", null, "GET");

        // Same JWT-extraction waterfall priority order used elsewhere in this file
        const refreshedToken =
          sessionPayload?.postgresJwtToken || // Priority 1: Real JWT captured from set-auth-jwt response header
          sessionPayload?.token || // Priority 2: Direct JWT field from /token endpoint { "token": "eyJ..." }
          sessionPayload?.data?.session?.access_token || // Priority 3: Neon Auth SDK response format (data wrapper)
          discoverJwtDeep(sessionPayload); // Priority 4: Deep scan fallback across response tree

        if (!refreshedToken) {
          throw new Error("Session refresh completed, but no valid JWT was returned by the /token endpoint.");
        }

        // Commit the freshly renewed JWT so subsequent authorized requests pick it up immediately
        SessionManager.saveToken(refreshedToken);
        console.log("[JEMER AUTH LIFECYCLE] Silent session refresh success: JWT renewed and committed.");

        return {
          success: true,
          token: refreshedToken
        };

      } catch (error) {
        // A failure here means the underlying session cookie is genuinely gone or expired —
        // not a network fluke — so we surface it clearly instead of swallowing it silently.
        console.error("[JEMER AUTH REJECTION] Silent session refresh failed:", error.message);
        return {
          success: false,
          message: error.message
        };
      }
    },

    /**
     * Closes active sessions and purges credential records from the browser during logouts
     */
    signOutStudent: function () {
      console.log("[JEMER AUTH LIFECYCLE] Purging system credentials. Closing user session...");
      SessionManager.purgeSession(); // Purge tokens & tracking keys from localStorage
      sessionStorage.clear(); // Safe clean out of sessionStorage structures
      return {
        success: true,
        message: "System session purged successfully."
      };
    },

    // ================================================================================================
    // 🔑 LAYER 5: FORGOT PASSWORD & SECURITY CODE OVERRIDE SDK INTEGRATIONS (V2.9 OTP SPECIFIED)
    // ================================================================================================

    /**
     * [RECOVERY PHASE 1 - SDK OTP DISPATCH]
     * Dispatches a secure 6-digit verification code to the student's email using Neon Auth's explicit OTP SDK route.
     * Bypasses the missing legacy /forget-password endpoint to completely eliminate the 404 routing error.
     * @param {string} email - The student's registered email address target.
     * @returns {Promise<Object>} Operational success or failure state payload wrapper.
     */
    sendPasswordResetToken: async function (email) {
      try {
        // Log the active initiation sequence trace directly to the developer console
        console.log(`[JEMER AUTH RECOVERY] Initiating password reset OTP dispatch via SDK for: ${email}`);
        
        // Enforce strict parameter verification check to reject empty data frames early
        if (!email) {
          throw new Error("Please supply a valid registered email address.");
        }

        // Sanitize incoming textual data by stripping out leading and trailing whitespaces
        const cleanEmail = email.trim();

        // Dynamically import or pull down the compiled Better Auth Client SDK instance cache
        const client = await getAuthClient();

        // Fire the specific Neon OTP email request endpoint using the official SDK sub-method tree
        const sdkResponse = await client.forgetPassword.emailOtp({
          email: cleanEmail // Target destination address receiving the security code
        });

        // Intercept any functional errors returned directly inside the Better Auth transaction promise
        if (sdkResponse?.error) {
          // Log detailed backend error metrics straight to the debugging console trace
          console.error("[JEMER AUTH RECOVERY] SDK forgetPassword.emailOtp returned error:", sdkResponse.error);
          // Throw custom developer error message down to the client interface layer
          throw new Error(sdkResponse.error.message || `Password recovery dispatch failed with status: ${sdkResponse.error.status}`);
        }

        // Trace successful round-trip execution context logs
        console.log("[JEMER AUTH RECOVERY] Phase 1 Success: OTP dispatch completed successfully:", sdkResponse);
        
        // Return structured affirmative validation properties to transition the user interface wizard
        return {
          success: true,
          message: "A secure 6-digit password reset OTP has been successfully dispatched to your email."
        };

      } catch (error) {
        // Intercept pipeline rejections or network connectivity timeouts gracefully
        console.error("[JEMER AUTH RECOVERY REJECTION] Failed to send recovery token via SDK OTP:", error.message);
        // Return negative response states to safely trigger the Grandma-Friendly alert modal popup
        return {
          success: false,
          message: error.message
        };
      }
    },

    /**
     * [RECOVERY PHASE 2 - OTP VALIDATION GATE]
     * Performs direct server-side verification check of the 6-digit security code against the database.
     * Ensures code accuracy and validation integrity before allowing the client to view password override components.
     * @param {string} email - The student's validated communication email address.
     * @param {string} recoveryCodeString - The 6-digit numeric security pin entered by the user.
     * @returns {Promise<Object>} Operational execution status flags tracking token verification accuracy.
     */
    verifyPasswordResetToken: async function (email, recoveryCodeString) {
      try {
        // Log validation phase tracing logs directly into the standard runtime framework
        console.log(`[JEMER AUTH RECOVERY] Running server-side verification checks for email: ${email}`);

        // Validate parameter input availability to prevent partial payload submissions
        if (!email || !recoveryCodeString) {
          throw new Error("Missing parameters: Please verify email and security token input arrays.");
        }

        // Strip unexpected space padding from code parameters string
        const cleanCode = recoveryCodeString.trim();

        // Enforce strict client-side pattern constraints prior to initiating network handshakes
        if (cleanCode.length !== 6) {
          throw new Error("Validation check rejected: OTP security token must be exactly 6 digits.");
        }

        // Fetch the active secure Better Auth client SDK connector framework instance
        const client = await getAuthClient();

        // Execute live verification check utilizing Neon's official OTP validation route parameters mapping
        const sdkResponse = await client.emailOtp.checkVerificationOtp({
          email: email.trim(), // The student account unique string identity identifier
          otp: cleanCode, // The manual typed 6-digit characters code block matrix
          type: 'forget-password' // Specify transaction classification type context to clear verification tables
        });

        // Intercept invalid configurations, token expirations, or code mismatch error payloads
        if (sdkResponse?.error) {
          // Output clear error diagnostic tracers to assist system logging verification
          console.error("[JEMER AUTH RECOVERY] SDK checkVerificationOtp endpoint returned error:", sdkResponse.error);
          // Terminate routine and pass descriptive guidance down into the interface alerts
          throw new Error(sdkResponse.error.message || "The verification code is incorrect, spent, or has expired.");
        }

        // Trace successful server authorization checkpoint clearance logs
        console.log("[JEMER AUTH RECOVERY] Phase 2 Success: Server-side OTP code cleared! Transitioning to override card...");
        
        // Return affirmative status to unlock Phase 3 credential modification fields safely
        return {
          success: true,
          message: "Code verification format verified successfully."
        };

      } catch (error) {
        // Catch verification faults and display proper warnings
        console.error("[JEMER AUTH RECOVERY REJECTION] Phase 2 validation checks rejected by backend:", error.message);
        // Bubble down descriptive details to ensure client forms reset accurately
        return {
          success: false,
          message: error.message
        };
      }
    },

    /**
     * [RECOVERY PHASE 3 - SDK PASSWORD RESET OVERRIDE]
     * Overwrites old account credentials directly inside PostgreSQL using the explicit Neon OTP SDK method.
     * Authorizes the changes via the token parameter and cleans up any remaining recovery session properties.
     * @param {string} email - Core target student account email address.
     * @param {string} recoveryCodeString - The verified 6-digit verification security token array.
     * @param {string} newPasswordString - The fresh safe password character string.
     * @returns {Promise<Object>} Success tracking results matrix determining system redirect behaviors.
     */
    resetPasswordWithToken: async function (email, recoveryCodeString, newPasswordString) {
      try {
        // Trace pipeline updates to record secure ledger modifications operations
        console.log(`[JEMER AUTH RECOVERY] Committing secure password reset override via SDK OTP for email: ${email}`);

        // Confirm fields are non-empty before packaging transactional JSON blocks
        if (!email || !recoveryCodeString || !newPasswordString) {
          throw new Error("All fields are mandatory to finalize password override sequence.");
        }

        // Retrieve active initialized client SDK pipeline structures
        const client = await getAuthClient();

        // Commit credential updates using Neon Auth's official emailOtp password reset sub-method array
        const sdkResponse = await client.emailOtp.resetPassword({
          email: email.trim(), // Reference account identity path mapping criteria
          otp: recoveryCodeString.trim(), // Verification clearance security token key parameters
          password: newPasswordString // The incoming fresh access credential string
        });

        // Intercept password complexity rejections or low-level database transmission drops
        if (sdkResponse?.error) {
          // Output diagnostic technical tracers straight to development consoles
          console.error("[JEMER AUTH RECOVERY] SDK emailOtp.resetPassword endpoint returned error:", sdkResponse.error);
          // Halt processing sequences and broadcast failures back to user interface cards
          throw new Error(sdkResponse.error.message || "Failed to update your password on the server.");
        }

        // Log final successful completion traces
        console.log("[JEMER AUTH RECOVERY] Phase 3 Success: PostgreSQL credentials overwritten with full relational integrity:", sdkResponse);
        
        // Return true flag to trigger the success celebration screen frame module popup
        return {
          success: true,
          message: "System credential reset accomplished with full relational integrity."
        };

      } catch (error) {
        // Handle unexpected schema mutation failures or server exceptions
        console.error("[JEMER AUTH RECOVERY REJECTION] Password override update failed on database server:", error.message);
        // Safe return states preventing unexpected UI crashes
        return {
          success: false,
          message: error.message
        };
      }
    }

  };

  global.JemerAuth = JemerAuthEngine; // Bind identity module cleanly to universal global context

})(window); // Safely execute within closure scopes to preserve namespace integrity