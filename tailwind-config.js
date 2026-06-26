/** * ================================================================================================
 * 🎨 JEMER ACADEMY MASTER TAILWIND FRAMEWORK CONFIGURATION PIPELINE (V3.0 SRC RE-MAPPED)
 * ================================================================================================
 * Description: Standard configuration routing gateway directing Tailwind's Just-In-Time (JIT) compiler.
 * Engineering Focus: Full file-system path coverage to prevent styling compilation erasures.
 * ================================================================================================
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  
  // 🎯 THE CONTENT SCANNING CANOPY:
  // Explicitly registers every single directory node where React, JSX, or Tailwind tokens are used.
  // By adding the './src/' prefix, we ensure the compiler uncovers every dashboard element.
  content: [
    // Scans all app router directories for page layout and template structures
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Scans the standalone components directory for widgets, navbars, and sidebar assets
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // Retains root level checks just in case any legacy onboarding page components remain outside src
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // THEME PARAMETER EXTENSION SUITE:
  // Allows you to inject custom company design tokens (branding colors, specific fonts) 
  // without overriding Tailwind's default utility sets.
  theme: {
    extend: {
      // Custom entry point to introduce specialized typography models later if desired
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      // Placeholder structure to link brand color guidelines seamlessly down the line
      colors: {
        jemerSlate: {
          950: "#020617",
        }
      }
    },
  },

  // REGISTER SYSTEM PLUGINS:
  // Hook up external modules (like custom forms, typography utilities) when expanding monetization channels
  plugins: [],
};