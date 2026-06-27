/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY BACKEND ROUTER — STUDENT PROFILE NAME BRIDGE ROUTE (v1.0.0)
 * ================================================================================================
 * Core Path: src/app/api/profile/me/route.js
 * Execution Target: Next.js Server-Side Runtime Environment Core
 * Database Target: Neon DB (PostgreSQL) Serverless Connection Pool
 *
 * PURPOSE & WHY THIS FILE EXISTS:
 * Sidebar.jsx was calling client.auth.getSession() directly from the browser. That call
 * makes a cross-origin HTTP request from *.cloudshell.dev → *.neonauth.eu-west-2.aws.neon.tech.
 * The browser's CORS policy refuses it before a single byte arrives, throwing:
 *   "TypeError: Failed to fetch"
 *
 * This route is the server-side bridge that replaces that pattern. Sidebar.jsx now calls
 * this local relative URL (/api/profile/me) instead. This handler runs in Node.js —
 * no browser, no CORS policy, no Cloud Shell proxy blockade. It queries Neon directly
 * using NEON_DATABASE_URL and returns only the firstName and lastName the Sidebar needs.
 *
 * FOLLOWS THE SAME SAFE PATTERNS AS status_check/route.js v1.2:
 *   - neon() initialised INSIDE the function (not at module level)
 *   - id::text cast instead of ::uuid cast to prevent SQL type errors
 *   - NEON_DATABASE_URL guard at the top
 *
 * EXPECTED REQUEST:
 *   GET /api/profile/me
 *   Headers: { Authorization: "<jemer_user_uuid>", Content-Type: "application/json" }
 *   Cookies: forwarded automatically via credentials: "include" on the client side
 *
 * EXPECTED RESPONSE:
 *   { firstName: string, lastName: string }
 * ================================================================================================
 */

import { NextResponse } from "next/server"; // Imports Next.js server utility to serialize and deliver structured JSON HTTP responses
import { neon } from "@neondatabase/serverless"; // Imports the official serverless Neon database connection driver package

// ⚠️ NOTE: neon() is intentionally initialised INSIDE the GET function — not at module level.
// See status_check/route.js BUG 1 notes for the full explanation of why this matters.

/**
 * Handles incoming HTTP GET requests to fetch the display name for the active student session.
 * @param {Request} requestContext - Object tracking incoming request headers, cookies, and system context variables
 */
export async function GET(requestContext) {
  console.log("[API ROUTE - PROFILE ME] Intercepting incoming GET profile name request context...");

  try {
    // ── ENVIRONMENT VARIABLE GUARD ────────────────────────────────────────────────────────────
    // Validate the database connection string is available before attempting anything.
    // If this log appears in your terminal, rename `_env.local` to `.env.local` at the project root.
    if (!process.env.NEON_DATABASE_URL) {
      console.error("[API ROUTE - ENV FAULT] NEON_DATABASE_URL is not set. Check that .env.local exists at the project root and restart the dev server.");
      return NextResponse.json({ firstName: "Student", lastName: "Workspace" }, { status: 200 });
    }

    // ── neon() INITIALISED INSIDE THE FUNCTION (not module level) ─────────────────────────────
    const sql = neon(process.env.NEON_DATABASE_URL);

    // 🔒 SECURITY LAYER: Extract the user identifier from the Authorization header.
    // Sidebar.jsx reads jemer_user_uuid from localStorage and injects it here,
    // mirroring the same pattern page.js uses for the status_check route.
    const authHeaderTokenValue = requestContext.headers.get("Authorization") || "";
    const userEmailHeaderValue = requestContext.headers.get("X-User-Email") || "";

    // Pick up whichever identifier is present, preferring email if both arrive
    const primaryLookupSelector = userEmailHeaderValue || authHeaderTokenValue;

    console.log(`[API ROUTE - PROFILE ME] Intercepted lookup selector: ${primaryLookupSelector}`);

    // Guard: block requests with no valid identifier to protect infrastructure
    if (!primaryLookupSelector) {
      console.warn("[API ROUTE - PROFILE ME] No identification parameter received. Returning default display values.");
      return NextResponse.json({ firstName: "Student", lastName: "Workspace" }, { status: 200 });
    }

    // 🧬 HYBRID QUERY EXECUTION PATHWAY — email vs UUID token
    let profileRecords = [];

    if (primaryLookupSelector.includes("@")) {
      // ── EMAIL LOOKUP PATH ───────────────────────────────────────────────────────────────────
      console.log(`[API ROUTE - PROFILE ME] Selector evaluated as Email. Running email lookup scan...`);
      profileRecords = await sql`
        SELECT first_name, last_name
        FROM "Jemer-Student-Profiles"
        WHERE email = ${primaryLookupSelector}
        LIMIT 1;
      `;
    } else {
      // ── UUID / TOKEN LOOKUP PATH (safe text-cast, no ::uuid error risk) ────────────────────
      // Using id::text = ${val} instead of id = ${val}::uuid to prevent Postgres type errors
      // if the token value is not a strictly valid UUID string format.
      console.log(`[API ROUTE - PROFILE ME] Selector evaluated as Token/UUID. Running safe text-cast lookup scan...`);
      profileRecords = await sql`
        SELECT first_name, last_name
        FROM "Jemer-Student-Profiles"
        WHERE id::text = ${primaryLookupSelector} OR email = ${primaryLookupSelector}
        LIMIT 1;
      `;
    }

    // If no matching row was found, return neutral fallback display values.
    // This keeps the Sidebar UI functional for new or unconfigured accounts.
    if (!profileRecords || profileRecords.length === 0) {
      console.log(`[API ROUTE - PROFILE ME] No profile row found for selector: ${primaryLookupSelector}. Returning defaults.`);
      return NextResponse.json({ firstName: "Student", lastName: "Workspace" }, { status: 200 });
    }

    // ── RESOLVE AND RETURN THE NAME PAYLOAD ──────────────────────────────────────────────────
    const profileRow = profileRecords[0];
    const firstName = (profileRow.first_name || "").trim() || "Jemer";
    const lastName  = (profileRow.last_name  || "").trim() || "Innovator";

    console.log(`[API ROUTE - PROFILE ME] Successfully resolved name for selector ${primaryLookupSelector}: ${firstName} ${lastName}`);
    return NextResponse.json({ firstName, lastName }, { status: 200 });

  } catch (serverPipelineException) {
    // Intercepts database faults or connection timeouts safely
    console.error("[API ROUTE - PROFILE ME FAULT] Handshake execution collapsed:", serverPipelineException.message);

    // Return neutral fallback values — the sidebar stays functional even on server errors
    return NextResponse.json(
      { firstName: "Student", lastName: "Workspace" },
      { status: 200 }
    );
  }
}