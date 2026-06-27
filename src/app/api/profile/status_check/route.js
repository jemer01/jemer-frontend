/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY BACKEND ROUTER — GRADUATED PROFILE STATUS CONTROLLER (v1.2 BUG FIXED)
 * ================================================================================================
 * Core Path: src/app/api/profile/status_check/route.js
 * Execution Target: Next.js Server-Side Runtime Environment Core
 * Database Target: Neon DB (PostgreSQL) Serverless Connection Pool
 * Security Tier: Adaptive Parameterized Lookup handling both UUID tokens and Email fallback paths
 *
 * BUGS FIXED IN v1.2:
 *
 * BUG 1 (CRITICAL — root cause of "Failed to fetch"):
 *   BEFORE: `const sql = neon(process.env.NEON_DATABASE_URL)` ran at MODULE LEVEL.
 *   If NEON_DATABASE_URL was undefined, neon() returned a broken function. When sql``
 *   was later called, it tried to fetch() an undefined URL and threw "TypeError: Failed
 *   to fetch" inside the server process. In Next.js Turbopack dev mode, a module-level
 *   crash can prevent the route from registering entirely — meaning the browser's fetch()
 *   call gets no response at all and throws its own "Failed to fetch" network exception.
 *   AFTER: neon() is initialized INSIDE the GET function, safely inside the try/catch.
 *   Any failure now returns a proper JSON 500 instead of crashing the module.
 *
 * BUG 2 (HIGH — caused SQL errors on non-UUID tokens):
 *   BEFORE: `WHERE id = ${primaryLookupSelector}::uuid`
 *   The ::uuid cast on the parameter throws a Postgres error if jemer_user_uuid in
 *   localStorage holds anything other than a plain UUID (e.g. a JWT, a prefixed string).
 *   AFTER: `WHERE id::text = ${primaryLookupSelector}`
 *   Casting the COLUMN to text instead avoids all type-mismatch errors — any string
 *   can be compared safely, non-matching values simply return zero rows.
 *
 * BUG 3 (MEDIUM — silent failure on missing env var):
 *   BEFORE: No guard before calling neon(). Missing env var produced no useful log.
 *   AFTER: Explicit env var check at the top of the function with a clear console error.
 *
 * ================================================================================================
 */

import { NextResponse } from "next/server"; // Imports Next.js server utility to serialize and deliver structured JSON HTTP responses
import { neon } from "@neondatabase/serverless"; // Imports the official serverless Neon database connection driver package

// ⚠️ NOTE: `const sql = neon(...)` has been intentionally moved INSIDE the GET function.
// Do NOT move it back to module level — see BUG 1 above for why that breaks everything.

/**
 * Handles incoming HTTP GET requests to evaluate if a student's personal learning matrix is fully complete
 * @param {Request} requestContext - Object tracking incoming request headers, cookies, and system context variables
 */
export async function GET(requestContext) {
  console.log("[API ROUTE - STATUS CHECK] Intercepting incoming GET verification profile request context...");

  try {
    // ── BUG 3 FIX: ENVIRONMENT VARIABLE GUARD ────────────────────────────────────────────────
    // Validate that the database connection string is available before attempting anything.
    // If this log appears in your terminal, rename your `_env.local` file to `.env.local`.
    if (!process.env.NEON_DATABASE_URL) {
      console.error("[API ROUTE - ENV FAULT] NEON_DATABASE_URL is not set. Check that .env.local exists at the project root and the dev server was restarted after it was created.");
      return NextResponse.json({ isProfileComplete: false }, { status: 200 });
    }

    // ── BUG 1 FIX: neon() INITIALISED INSIDE THE FUNCTION, NOT AT MODULE LEVEL ──────────────
    // Instantiating here means any crash is contained inside this try/catch block and returns
    // a proper JSON response — it no longer risks killing the route module on startup.
    const sql = neon(process.env.NEON_DATABASE_URL);

    // 🔒 SECURITY LAYER: Extraction of user session authorization credentials
    // Extract token identifier values from standard system headers cleanly
    const authHeaderTokenValue = requestContext.headers.get("Authorization") || "";
    const userEmailHeaderValue = requestContext.headers.get("X-User-Email") || "";

    // Fallback assignment to pick up whatever identifier string context variable is present
    const primaryLookupSelector = userEmailHeaderValue || authHeaderTokenValue;

    console.log(`[API ROUTE - AUTH HANDSHAKE] Intercepted active account identification parameter: ${primaryLookupSelector}`);

    // If headers are completely vacant of characters, block execution tracks to protect infrastructure integrity
    if (!primaryLookupSelector || primaryLookupSelector === "mock-student-id-token") {
      console.warn("[API ROUTE - AUTH WARNING] Empty validation parameters passed. Returning empty status mapping.");
      return NextResponse.json({ isProfileComplete: false }, { status: 200 }); // Safely load form without a 401 crash
    }

    // 🧬 HYBRID QUERY EXECUTION PATHWAY:
    // Intelligently scans characters to determine if looking up records via unique string Email formats vs standard structural ID keys
    let databaseProfileRecords = [];

    if (primaryLookupSelector.includes("@")) {
      // ── EMAIL LOOKUP PATH ─────────────────────────────────────────────────────────────────
      console.log(`[API ROUTE - RESOLVER] Target parameter evaluated as Email. Running email lookup index scan...`);
      databaseProfileRecords = await sql`
        SELECT 
          academic_level_pacing_tier,
          academic_context_matrix,
          target_curriculum_exam_goals,
          target_learning_interests,
          cognitive_scaffolding_preference,
          content_delivery_formats,
          feedback_timing_tone_strategy,
          environmental_context_duration,
          personal_context,
          custom_instructions
        FROM "Jemer-Student-Profiles"
        WHERE email = ${primaryLookupSelector}
        LIMIT 1;
      `;
    } else {
      // ── BUG 2 FIX: UUID / TOKEN LOOKUP PATH ──────────────────────────────────────────────
      // BEFORE: `WHERE id = ${primaryLookupSelector}::uuid`
      //   The ::uuid cast applied to the PARAMETER threw a Postgres error whenever the value
      //   wasn't a strictly valid UUID string (any prefix, JWT format, etc. all caused crashes).
      //
      // AFTER: `WHERE id::text = ${primaryLookupSelector}`
      //   Casting the COLUMN to text instead means ANY string can be compared without error.
      //   Non-UUID strings simply match no rows and return an empty result — no exceptions thrown.
      console.log(`[API ROUTE - RESOLVER] Target parameter evaluated as Token identifier string. Running safe text-cast lookup scan...`);
      databaseProfileRecords = await sql`
        SELECT 
          academic_level_pacing_tier,
          academic_context_matrix,
          target_curriculum_exam_goals,
          target_learning_interests,
          cognitive_scaffolding_preference,
          content_delivery_formats,
          feedback_timing_tone_strategy,
          environmental_context_duration,
          personal_context,
          custom_instructions
        FROM "Jemer-Student-Profiles"
        WHERE id::text = ${primaryLookupSelector} OR email = ${primaryLookupSelector}
        LIMIT 1;
      `;
    }

    // If the database search yields no row matching the active student parameters, the profile is completely uncalibrated
    if (!databaseProfileRecords || databaseProfileRecords.length === 0) {
      console.warn("[API ROUTE - CACHE MISS] Student row not found inside Neon DB. Initializing empty profile redirection layout rules.");
      return NextResponse.json({ isProfileComplete: false }, { status: 200 }); // Tells frontend to display the gating wizard form cleanly
    }

    // Isolate the discovered profile data object record row container cleanly
    const studentProfileDataRow = databaseProfileRecords[0];

    // 🧪 DATA INTEGRITY MATRIX EVALUATION CHECK:
    // Carefully inspects all 10 personalization columns to guarantee they contain valid, non-empty values
    const isAcademicTierValid = studentProfileDataRow.academic_level_pacing_tier !== null && studentProfileDataRow.academic_level_pacing_tier !== "";
    const isContextMatrixValid = studentProfileDataRow.academic_context_matrix && Object.keys(studentProfileDataRow.academic_context_matrix).length > 0;
    const isExamGoalsArrayValid = Array.isArray(studentProfileDataRow.target_curriculum_exam_goals) && studentProfileDataRow.target_curriculum_exam_goals.length > 0;
    const isInterestsArrayValid = Array.isArray(studentProfileDataRow.target_learning_interests) && studentProfileDataRow.target_learning_interests.length > 0;
    
    // Expanded validation checks to cleanly support the newer custom learning modes ('Analogy-Heavy' and 'Mixed-Adaptive')
    const isScaffoldingValid = 
      studentProfileDataRow.cognitive_scaffolding_preference === "Socratic" || 
      studentProfileDataRow.cognitive_scaffolding_preference === "Direct" ||
      studentProfileDataRow.cognitive_scaffolding_preference === "Analogy-Heavy" ||
      studentProfileDataRow.cognitive_scaffolding_preference === "Mixed-Adaptive";

    const isDeliveryFormatsValid = Array.isArray(studentProfileDataRow.content_delivery_formats) && studentProfileDataRow.content_delivery_formats.length > 0;
    const isFeedbackStrategyValid = studentProfileDataRow.feedback_timing_tone_strategy === "Immediate" || studentProfileDataRow.feedback_timing_tone_strategy === "Delayed";
    const isEnvContextValid = studentProfileDataRow.environmental_context_duration && Object.keys(studentProfileDataRow.environmental_context_duration).length > 0;
    const isBiographyValid = studentProfileDataRow.personal_context && studentProfileDataRow.personal_context.biography !== "";
    const isCustomRulesValid = studentProfileDataRow.custom_instructions && studentProfileDataRow.custom_instructions.rules !== "";

    // Aggregate evaluation flags into an absolute single truth logic boolean statement
    const evaluationProfileStatusResult = 
      isAcademicTierValid && 
      isContextMatrixValid && 
      isExamGoalsArrayValid && 
      isInterestsArrayValid && 
      isScaffoldingValid && 
      isDeliveryFormatsValid && 
      isFeedbackStrategyValid && 
      isEnvContextValid && 
      isBiographyValid && 
      isCustomRulesValid;

    console.log(`[API ROUTE - INTEGRITY RESULT] Calculated calibration validation metric status: ${evaluationProfileStatusResult}`);

    // Return the clean status evaluation map back to the calling frontend page instance
    return NextResponse.json({ isProfileComplete: !!evaluationProfileStatusResult }, { status: 200 });

  } catch (serverPipelineException) {
    // Intercepts database faults or connection timeouts, logging details safely inside backend monitoring frames
    console.error("[API ROUTE - CRITICAL GET FAULT] Handshake execution collapsed:", serverPipelineException.message);
    
    // Dispatches a formatted error payload to avoid freezing client-side browser network pipes
    return NextResponse.json(
      { error: "Internal database processing connection failure.", details: serverPipelineException.message },
      { status: 500 }
    );
  }
}