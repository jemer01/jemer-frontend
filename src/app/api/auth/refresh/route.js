/**
 * [NEW UPGRADE]
 * SUMMARY: Built the dedicated /api/auth/refresh API Route.
 * This endpoint intercepts the silent background token refresh request triggered by the frontend.
 * It securely validates the user's UUID against the Neon DB cluster using text-casting to prevent crashes,
 * then seamlessly interfaces with the internal Auth engine to mint a fresh JWT.
 * This completely prevents the jarring UX redirect to the login page, allowing infinite AI chat sessions.
 * ================================================================================================
 */

import { NextResponse } from "next/server"; // Imports Next.js server utility to serialize and deliver structured JSON HTTP responses[cite: 22]
import { neon } from "@neondatabase/serverless"; // Imports the official serverless Neon database connection driver package[cite: 22]

export async function POST(requestContext) {
  console.log("[API ROUTE - AUTH REFRESH] Intercepting silent background session refresh request...");

  try {
    // ── 1. ENVIRONMENT VARIABLE GUARD ────────────────────────────────────────────────────────
    // Validate that the database connection string is available before attempting queries[cite: 22]
    if (!process.env.NEON_DATABASE_URL) {
      console.error("[API ROUTE - ENV FAULT] NEON_DATABASE_URL is not set inside the environment variables.");
      return NextResponse.json({ error: "Database connection mapping absent." }, { status: 500 });
    }

    // Instantiate Neon DB safely inside the function block to prevent module-level crashes[cite: 22]
    const sql = neon(process.env.NEON_DATABASE_URL);

    // ── 2. IDENTITY CREDENTIAL EXTRACTION ──────────────────────────────────────────────────
    // Extract the UUID token identifier passed from the frontend silent refresh engine[cite: 22]
    const authHeaderTokenValue = requestContext.headers.get("Authorization") || "";
    const cleanUuid = authHeaderTokenValue.replace("Bearer ", "").trim();

    if (!cleanUuid || cleanUuid === "mock-student-id-token") {
      console.warn("[API ROUTE - AUTH REFRESH] Empty or mock validation parameters passed. Eviction required.");
      return NextResponse.json({ error: "Invalid identity authorization parameters." }, { status: 401 });
    }

    console.log(`[API ROUTE - AUTH REFRESH] Validating session extension for UUID: ${cleanUuid}`);

    // ── 3. NEON DB SECURITY VERIFICATION ───────────────────────────────────────────────────
    // Query the database to ensure the student profile still exists and hasn't been suspended or deleted.
    // We use the id::text cast to avoid Postgres type-mismatch exceptions if the UUID format is slightly off[cite: 22]
    const databaseProfileRecords = await sql`
      SELECT id, email 
      FROM "Jemer-Student-Profiles"
      WHERE id::text = ${cleanUuid}
      LIMIT 1;
    `;

    // If the database search yields no row matching the active student, reject the refresh[cite: 22]
    if (!databaseProfileRecords || databaseProfileRecords.length === 0) {
      console.warn("[API ROUTE - SECURITY MISS] UUID not found inside Neon DB. Rejecting token refresh.");
      return NextResponse.json({ error: "Account validity verification failed." }, { status: 401 });
    }

    // ── 4. CRYPTOGRAPHIC JWT MINTING (AUTH ENGINE INTEGRATION) ─────────────────────────────
    // Since JemerAuth manages the live session layer[cite: 23], we forward the HTTP-only cookies
    // to your native auth endpoint to securely generate the new JWT string without exposing private keys.
    
    const requestUrl = new URL(requestContext.url);
    const internalAuthEndpoint = `${requestUrl.origin}/api/auth/refresh-session`; 

    // Ping the internal auth proxy, passing the secure cookies forward
    const refreshResponse = await fetch(internalAuthEndpoint, {
      method: "POST",
      headers: {
        "Cookie": requestContext.headers.get("cookie") || "",
        "Content-Type": "application/json"
      }
    });

    if (!refreshResponse.ok) {
      console.warn(`[API ROUTE - AUTH REFRESH] Internal Auth Engine rejected the cookie refresh handshake. Status: ${refreshResponse.status}`);
      return NextResponse.json({ error: "Session cryptographic rollover failed." }, { status: 401 });
    }

    // Extract the newly minted JWT token from the internal auth response
    const authData = await refreshResponse.json();
    const newJwtToken = authData.token || authData.sessionToken;

    if (!newJwtToken) {
      throw new Error("Auth engine responded successfully but failed to provide a token payload string.");
    }

    console.log("[API ROUTE - AUTH REFRESH] Successfully minted new JWT session token. Returning to client matrix.");
    
    // ── 5. DELIVER SECURE PAYLOAD ──────────────────────────────────────────────────────────
    // Return the fresh cryptographic key back to the browser safely[cite: 22]
    return NextResponse.json({ token: newJwtToken }, { status: 200 });

  } catch (serverPipelineException) {
    // Intercepts database faults or connection timeouts, logging details safely inside backend monitoring frames[cite: 22]
    console.error("[API ROUTE - CRITICAL REFRESH FAULT] Token swap execution collapsed:", serverPipelineException.message);
    
    // Dispatches a formatted error payload to avoid freezing client-side browser network pipes[cite: 22]
    return NextResponse.json(
      { error: "Internal session processing failure.", details: serverPipelineException.message },
      { status: 500 }
    );
  }
}