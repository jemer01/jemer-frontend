/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY PLATFORMS — UNIFIED NEON CLIENT BRIDGE CONFIGURATOR (v4.9)
 * ================================================================================================
 * Description: Instantiates the browser-safe connection instance for running SDK operations.
 * Technology Stack: Official @neondatabase/neon-js Client Library
 * Compliance: 100% comprehensive row-by-row commenting for complete code transparency.
 * Location: Saved strictly at src/lib/neon.js
 * ================================================================================================
 */

// Pulls the client compilation factory module directly from your installed Neon JavaScript library
import { createClient } from '@neondatabase/neon-js';

/**
 * Centrally Configured Neon Client Instance Export
 * This object monitors user sessions and automatically packages validation headers 
 * whenever our application screens issue table lookup requests.
 */
export const client = createClient({
  
  // ── AUTHENTICATION LAYER CONFIGURATION ──────────────────────────────────────────────────────
  auth: {
    /**
     * Maps the secure authentication endpoint link. 
     * Uses the exact wandering-bird gateway route confirmed by your console verification specs.
     */
    url: process.env.NEXT_PUBLIC_NEON_AUTH_URL || 'https://ep-wandering-bird-abdexk6a.neonauth.eu-west-2.aws.neon.tech/neondb/auth',
  },
  
  // ── DATABASE REST DATA API LAYER CONFIGURATION ──────────────────────────────────────────────
  dataApi: {
    /**
     * Maps the core target URL responsible for processing relational database table interactions over HTTP.
     * Appends the standard postgrest client rest utility endpoint parameters suffix.
     */
    url: process.env.NEXT_PUBLIC_NEON_DATA_API_URL || 'https://ep-wandering-bird-abdexk6a.apirest.eu-west-2.aws.neon.tech/neondb/rest/v1',
  },
  
});