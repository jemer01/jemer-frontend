/**
 * ================================================================================================
 * ⚡ JEMER ACADEMY CORE WORKSPACE — POSTCSS PIPELINE RUNTIME CONFIGURATION (V4.0 SPECIFIED)
 * ================================================================================================
 * Description: Instantiates the pre-processor compilation routing bridge for Webpack.
 * Patch Notes: Swapped legacy 'tailwindcss' plugin for the explicit '@tailwindcss/postcss' engine
 * to satisfy Tailwind v4 build requirements and eliminate the Node.js evaluation panic.
 * Location: MUST be saved in the absolute root directory next to package.json.
 * ================================================================================================
 */

module.exports = {
  // Registers the active compilation plugin tree that intercepts and processes global stylesheets
  plugins: {
    
    // 🎨 LINK THE TAILWIND V4 COMPILER CONNECTOR:
    // Directs PostCSS to use the newly installed v4 package to expand modern Tailwind directives
    // into optimized, production-ready utility classes.
    '@tailwindcss/postcss': {},
    
    // 📡 LINK THE AUTOPREFIXER ENGINE:
    // Automatically appends required browser vendor prefixes (like -webkit-, -moz-) to your 
    // css attributes to guarantee layout symmetry across Safari, Chrome, and Firefox viewports.
    'autoprefixer': {},
    
  },
};