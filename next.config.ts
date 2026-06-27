import type { NextConfig } from "next"; // Pulls down the explicit type definition binding mapping from core Next.js packages

/**
 * ========================================================================
 * 🧠 JEMER ACADEMY CORE ROUTING AND COMPILER CONFIGURATION (V4.3 - PROXY TUNNEL)
 * ========================================================================
 * Description: High-performance Next.js engine with direct proxy locks.
 * Fixes applied: Preserves terminal-provided Cloud Shell hostname strings, Whitelists 
 * server action headers, and proxies relative api calls down to Cloud Run serverless paths.
 * Compliance: 100% complete step-by-step code comment documentation.
 * ========================================================================
 */
const nextConfig: NextConfig = {
  
  // ⚛️ NATIVE REACT COMPILER ACTIVATION
  // Enables the production optimization pipeline for automatic component memoization and state tracking
  reactCompiler: true,

  // 🛡️ DEV SERVER PROXY WHITELIST (Hardcoded absolute domains derived from your error log)
  // Authorizes foreign connection protocols originating from designated development wrappers to talk to the engine node
  allowedDevOrigins: [
    "3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev"
  ],

  experimental: {
    // 💾 TURBOPACK CACHING MECHANISMS
    // Instructs compilation builders to persist virtual architecture snapshots onto the disc layout to speed up boot tracks
    turbopackFileSystemCacheForDev: true,

    // 🛡️ SECURITY PATCH: Whitelist Google Cloud Shell Web Preview proxy origins
    // Enforces secure protocol boundaries on Server Actions, blocking cross-site request forgery injections on cloud sandboxes
    serverActions: {
      allowedOrigins: [
        "3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev",
        "localhost:3000"         
      ]
    }
  },

  // 🌐 APERIODIC ROUTING REWRITE INTERACTION MATRIX
  // Declares structural server-side proxy passthroughs that dynamically maps network streams without changing client browser URLs
  async rewrites() {
    return {
      // Zone A: Executes execution passes before Next.js checks the internal page routing file layouts
      beforeFiles: [
        {
          // Automatically maps requests aimed at the base root route over to public static HTML asset maps
          source: "/",
          destination: "/index.html",
        },
      ],
      
      // Zone B: Executes verification lookups after local page files have been fully evaluated
      afterFiles: [
        {
          // 🚀 THE GO CLOUD RUN PROXY PASSTHROUGH UPGRADE FOR OPTION B
          // Catches relative frontend paths (e.g., /api/v1/tutor/stream) sent to the Next.js server
          source: "/api/:path*",
          // Securely tunnels the request server-to-server to Cloud Run with the /api prefix completely preserved
          destination: "https://jemer-academy-backend-606530930960.europe-west4.run.app/api/:path*",
        },
      ],
      
      // Zone C: Acts as a final fallback catch grid routing channel if previous passes turn up empty or unallocated
      fallback: [],
    };
  },
};

export default nextConfig; // Exposes config schemas back out to the orchestration application layer runtime engine securely