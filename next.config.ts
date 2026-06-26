import type { NextConfig } from "next";

/**
 * ========================================================================
 * 🧠 JEMER ACADEMY CORE ROUTING AND COMPILER CONFIGURATION (V2.1 - RAM FIXED)
 * ========================================================================
 * Description: Main routing architecture module for Next.js compilation loops.
 * Fixes applied: Disabled worker threads, minimized caching, and stripped 
 * dev sourcemaps to drastically lower memory consumption on 4GB RAM PCs.
 * ========================================================================
 */
const nextConfig: NextConfig = {
  
  // ⚛️ NATIVE REACT COMPILER ACTIVATION
  reactCompiler: true,

  // 📉 4GB RAM LOW-MEMORY STACK OPTIMISATIONS
  productionBrowserSourceMaps: false, // Prevents giant source map strings from flooding RAM
  
  experimental: {
    cpus: 1,            // Prevents Next.js from spawning multiple CPU threads
    workerThreads: false, // Forces Webpack to bundle everything on a single low-memory thread
  },

  // 🧹 AGGRESSIVE WEBPACK GARBAGE COLLECTION
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'memory',
        maxGenerations: 1, // Quickly flushes deleted code chunks out of your RAM
      };
    }
    return config;
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
