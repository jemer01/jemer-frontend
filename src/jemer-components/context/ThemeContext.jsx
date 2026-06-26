/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM SYSTEM — GLOBAL THEME PROVIDER ENGINE (SAFE RE-ROUTED v4.1)
 * ================================================================================================
 * Description: High-integrity React Context system coordinating global display layers.
 * Engineering Focus: Crash-proof defensive fallbacks protecting production UI trees.
 * Location: Saved inside src/jemer-components/context/ThemeContext.jsx
 * ================================================================================================
 */

"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

import React, { createContext, useContext, useState, useEffect } from 'react'; // Pulls vital context orchestration mechanisms out of core React

// Instantiates an independent, isolated React Context channel tracker initializing with an explicit null baseline
const ThemeContext = createContext(null);

/**
 * Global Theme Context Provider Wrapper Component
 * Wraps the top-level body nodes to pipe active theme string variables down to all child screens.
 */
export function ThemeProvider({ children }) {
  // Instantiates our local state tracking string variable. Defaults to "light" for absolute rendering safety.
  const [theme, setTheme] = useState("light");

  /**
   * [WORKSPACE INTROSPECTIVE SYNCHRONIZATION EFFECT]
   * Pulls down user settings or evaluates device hardware parameters on screen initialization.
   */
  useEffect(() => {
    try {
      // Look up previous explicit student theme choices deposited within the browser local cache maps
      const savedUserTheme = localStorage.getItem("jemer_theme_mode");
      
      // Query system environment hardware configurations to evaluate if the operating system is set to dark
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (savedUserTheme === "dark" || (!savedUserTheme && systemPrefersDark)) {
        console.log("[THEME ENGINE CORE] Syncing active workspace canvas to: DARK");
        setTheme("dark");
      } else {
        console.log("[THEME ENGINE CORE] Syncing active workspace canvas to: LIGHT");
        setTheme("light");
      }
    } catch (cacheException) {
      console.error("[THEME ENGINE INITIALIZATION FAULT] Failed to safely parse client environments:", cacheException.message);
    }
  }, []); // Fires exactly once upon component tree assembly

  /**
   * [LIVE ACTIVE THEME CONFIGURATION STATE EMITTER EFFECT]
   * Binds the core class selectors directly to the root document layer when data states adjust.
   */
  useEffect(() => {
    try {
      // Acquire direct access path variables pointing straight to the master root element of the entire webpage document (<html>)
      const rootHtmlElement = document.documentElement;

      if (theme === "dark") {
        rootHtmlElement.classList.add("dark");
        localStorage.setItem("jemer_theme_mode", "dark");
      } else {
        rootHtmlElement.classList.remove("dark");
        localStorage.setItem("jemer_theme_mode", "light");
      }
    } catch (domMutationException) {
      console.error("[DOM MODIFICATION LOCKOUT] Failed to alter system class selectors maps:", domMutationException.message);
    }
  }, [theme]); // Monitored state dependency vector tracking edits made to 'theme'

  // Universal theme flipping loop callback action handler
  const toggleTheme = () => {
    setTheme((previousStateString) => (previousStateString === "dark" ? "light" : "dark"));
  };

  return (
    // Package and pass down variables and control configurations into our context pipeline channels
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Universal Theme Consumer Hook Gateway
 * Provides clean access parameters while shielding the front-end layout components tree from throwing fatal errors.
 */
export function useTheme() {
  // Capture active values tracking context structures traveling down the pipeline tree
  const contextInstance = useContext(ThemeContext);
  
  // ==============================================================================================
  // 🛡️ DEFENSIVE ACCELERATION ENGINEERING FALLBACK
  // ==============================================================================================
  // If a toggle switch is dropped into an out-of-bounds layer lacking a parent provider layout block,
  // we intercept the evaluation context node right here. Instead of returning a fatal runtime crash,
  // we spit out a non-breaking developer warning and return a dummy light-state configuration mockup object!
  if (!contextInstance) {
    console.warn(
      "[THEME ENGINE ARCHITECTURE WARNING] useTheme() context was called outside of an active <ThemeProvider /> container pool. " +
      "Gracefully falling back onto sandbox light-mode parameters state to prevent fatal workspace execution runtime collapses."
    );
    
    // Return safe, dummy mock parameters instances to allow the layout components to compile without dropping threads
    return {
      theme: "light",
      toggleTheme: () => {
        console.warn("[THEME ENGINE INOPERABLE] Manual state toggles are inactive because this button node is structurally un-linked.");
      }
    };
  }
  
  // Return the verified values payload parameters down to the consumer component interface when fully linked
  return contextInstance;
}