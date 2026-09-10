import type { NextConfig } from "next";

/**
 * ========================================================================
 * 🧠 JEMER ACADEMY CORE ROUTING AND COMPILER CONFIGURATION (V4.3)
 * ========================================================================
 */
const nextConfig: NextConfig = {
  reactCompiler: true,
  
  allowedDevOrigins: [
    "3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev"
  ],

  experimental: {
    // 💾 SAFE TO KEEP TRUE: The OS symlink routes all of this heavy I/O straight to RAM
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      allowedOrigins: [
        "3000-cs-9c6bf60b-3314-4394-80ef-ef6f4089d8e1.cs-europe-west1-haha.cloudshell.dev",
        "localhost:3000"         
      ]
    }
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/index.html",
        },
      ],
      afterFiles: [
        {
          // 🚀 TUNNEL: Tunneling relative requests safely to the Cloud Run backend
          source: "/api/:path*",
          destination: "https://jemer-academy-backend-606530930960.europe-west4.run.app/api/:path*",
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;