/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY BACKEND ROUTER — GRADUATED PROFILE STATUS CONTROLLER (v1.1 HYBRID FIX)
 * ================================================================================================
 * Core Path: src/app/api/profile/status_check/route.js
 * Execution Target: Next.js Server-Side Runtime Environment Core
 * Database Target: Neon DB (PostgreSQL) Serverless Connection Pool
 * Security Tier: Adaptive Parameterized Lookup handling both UUID tokens and Email fallback paths
 * Compliance: 100% complete line-by-line developer code documentation for complete clarity
 * ================================================================================================
 */

import { NextResponse } from "next/server"; // Imports Next.js server utility to serialize and deliver structured JSON HTTP responses
import { neon } from "@neondatabase/serverless"; // Imports the official serverless Neon database connection driver package

// Instantiates a secure, isolated database driver utility mapping to your server's secret environment variables pool
const sql = neon(process.env.NEON_DATABASE_URL);

/**
 * Handles incoming HTTP GET requests to evaluate if a student's personal learning matrix is fully complete
 * @param {Request} requestContext - Object tracking incoming request headers, cookies, and system context variables
 */
export async function GET(requestContext) {
  console.log("[API ROUTE - STATUS CHECK] Intercepting incoming GET verification profile request context...");

  try {
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
      console.log(`[API ROUTE - RESOLVER] Target parameter evaluated as Email. Running email lookups index scan...`);
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
      console.log(`[API ROUTE - RESOLVER] Target parameter evaluated as Token identifier string. Running primary key lookup scan...`);
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
        WHERE id = ${primaryLookupSelector}::uuid OR email = ${primaryLookupSelector};
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
      { status: 500 } // Dispatches an HTTP 500 Internal Server Error status
    );
  }
}