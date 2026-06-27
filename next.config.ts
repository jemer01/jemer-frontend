import type { NextConfig } from "next";

/**
 * ========================================================================
 * 🧠 JEMER ACADEMY CORE ROUTING AND COMPILER CONFIGURATION (V4.2 - PROXY LOCK)
 * ========================================================================
 * Description: High-performance Next.js engine with direct proxy locks.
 * Fixes applied: Hardcoded exact terminal-provided Cloud Shell hostname strings
 * to satisfy Next.js security headers and clear active WebSocket errors.
 * ========================================================================
 */
const nextConfig: NextConfig = {
  
  // ⚛️ NATIVE REACT COMPILER ACTIVATION
  reactCompiler: true,

  // 🛡️ DEV SERVER PROXY WHITELIST (Hardcoded absolute domains derived from your error log)
  allowedDevOrigins: [
    "3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev"
  ],

  experimental: {
    // 💾 TURBOPACK CACHING MECHANISMS
    turbopackFileSystemCacheForDev: true,

    // 🛡️ SECURITY PATCH: Whitelist Google Cloud Shell Web Preview proxy origins
    serverActions: {
      allowedOrigins: [
        "3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev",
        "localhost:3000"         
      ]
    }
  },

  // 🌐 APERIODIC ROUTING REWRITE INTERACTION MATRIX
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/index.html",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;