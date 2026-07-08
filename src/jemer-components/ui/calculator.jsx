/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.2.0 - Core UX & Stability Overhaul.
 * 1. Broken Icon Fix: Eradicated the fragile raw SVG on the backspace button. Replaced it with 
 * a bulletproof FontAwesome `<i className="fas fa-backspace" />` class to guarantee visibility.
 * 2. NaN20 Crash Patch: Built a Type-Guard matrix in `handleExecuteSingleParamSciCalc`. Empty 
 * screens now safely evaluate as '0'. Results cleanly flag as calculated, eliminating the string 
 * concatenation bug that caused "NaN20 is not defined" crashes.
 * 3. Premium UX Chaining: Introduced the `isCalculated` state tracker. Pressing a number after `=` 
 * now smartly starts a fresh calculation. Pressing an operator (`+`, `-`) seamlessly chains the math. 
 * Typing multiple operators consecutively (e.g., `+` then `×`) instantly overwrites the last one.
 * 4. Desktop Smart Controls: Injected a global `useEffect` keyboard listener tracking numbers, operators, 
 * Enter, Backspace, and Escape. Added active element validation to prevent hijacking typing when the 
 * student is chatting in the prompt box!
 * 5. Branding Update: Successfully updated the footer watermark to 'Jemer pro Calculator'.
 * ================================================================================================
 * 🧮 JEMER ACADEMY STARTUP ECOSYSTEM — HIGH-FIDELITY ADAPTIVE MATHEMATICAL ENGINE (v2.2.0)
 * ================================================================================================
 */

"use client"; // Directs the compilation pipeline to build and manage state parameters strictly on the client browser DOM instance

import React, { useState, useEffect, useRef } from "react"; // Pulls standard state hooks and element references from React core
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Binds natively with your platform's dark/light theme context stream

/**
 * High-Fidelity Neomorphic Adaptive Calculator Component
 * @param {Object} props - Structural properties dispatched by parent orchestrator layout containers.
 * @param {boolean} props.isOpen - Monitor token checking if the calculator sheet is visible.
 * @param {function} props.onClose - Execution closure callback mapping empty background tap dismissals.
 * @param {function} props.onMaximize - Execution callback bridge tracking transitions into full screen mathematical workspaces.
 */
export default function Calculator({ isOpen, onClose, onMaximize }) {
  // ── LAYER 1: DESIGN SYSTEM THEME INTERACTION HOOKS ──────────────────────────────────────────
  const { theme } = useTheme();

  // ── LAYER 2: SYSTEM CALCULATION ENGINE MUTATION STATES ────────────────────────────────────────
  const [displayValue, setDisplayValue] = useState("");
  const [equationHistory, setEquationHistory] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [scientificPanelOpen, setScientificPanelOpen] = useState(false);
  
  // 🚀 NEW UPGRADE: Tracks if the current display is a finished result to enable smart UX chaining
  const [isCalculated, setIsCalculated] = useState(false);

  // ── LAYER 3: RESPONSIVE MEDIA & SMART KEYBOARD LISTENERS EFFECTS ────────────────────────────
  
  useEffect(() => {
    const executeViewportAudit = () => {
      setIsMobileView(window.innerWidth < 768); 
    };
    executeViewportAudit(); 
    window.addEventListener("resize", executeViewportAudit); 
    return () => window.removeEventListener("resize", executeViewportAudit); 
  }, []);

  // 🚀 NEW UPGRADE: Smart Desktop Keyboard Controls Matrix
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e) => {
      // Security Check: Ignore keystrokes if the user is typing in a chat box or textarea
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      const key = e.key;

      if (/^[0-9.]$/.test(key)) {
        e.preventDefault();
        handleAppendToken(key);
      } else if (key === "+" || key === "-") {
        e.preventDefault();
        handleAppendToken(key);
      } else if (key === "*" || key === "x" || key === "X") {
        e.preventDefault();
        handleAppendToken("×");
      } else if (key === "/") {
        e.preventDefault();
        handleAppendToken("÷");
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEvaluateTotalResult();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspaceSlice();
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        e.preventDefault();
        handleResetMemory();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, displayValue, isCalculated, equationHistory]);

  // ── LAYER 4: ARITHMETIC CORE TRANSACTION OPERATORS LOGIC ──────────────────────────────────────

  const handleAppendToken = (token) => {
    const isOperator = ["+", "-", "×", "÷"].includes(token);

    setDisplayValue((prev) => {
      // Clean up past syntax errors automatically
      if (prev === "Syntax Error" || prev === "Math Error") return isOperator ? "0" + token : token;

      // 🚀 NEW UX UPGRADE: Smart calculation chaining
      if (isCalculated) {
        setIsCalculated(false);
        if (isOperator) {
          return prev + token; // Chain the result (e.g. 4 + ...)
        } else {
          return token; // Start a fresh calculation block
        }
      }

      // 🚀 NEW UX UPGRADE: Operator Overwrite Matrix (prevents "++" or "+x" crashes)
      if (isOperator && prev.length > 0) {
        const lastChar = prev.slice(-1);
        if (["+", "-", "×", "÷"].includes(lastChar)) {
          return prev.slice(0, -1) + token; // Instantly replace the old operator with the new one!
        }
      }
      
      // Prevent ugly leading zeros (e.g. "05")
      if (prev === "0" && !isOperator && token !== ".") {
        return token;
      }

      return prev + token;
    });
  };

  const handleBackspaceSlice = () => {
    setIsCalculated(false); // Reset calculation flag so backspacing allows continued editing
    setDisplayValue((prev) => {
      if (prev === "Syntax Error" || prev === "Math Error" || prev.length <= 1) return "";
      return prev.toString().slice(0, -1); 
    });
  };

  const handleResetMemory = () => {
    setDisplayValue(""); 
    setEquationHistory(""); 
    setIsCalculated(false);
  };

  const handleToggleSignModifier = () => {
    setDisplayValue((prev) => {
      if (!prev || prev === "Syntax Error" || prev === "Math Error" || prev === "0") return "-";
      if (prev.startsWith("-")) return prev.slice(1);
      return "-" + prev;
    });
  };

  const handleExecuteSingleParamSciCalc = (mode) => {
    try {
      // 🚀 NEW UX UPGRADE: Treat empty/error screens as '0' to prevent NaN crashes
      let cleanDisplay = displayValue.trim();
      if (cleanDisplay === "Syntax Error" || cleanDisplay === "Math Error") cleanDisplay = "0";
      
      // Strip hanging trailing operators before processing scientific equations
      if (["+", "-", "×", "÷"].includes(cleanDisplay.slice(-1))) {
        cleanDisplay = cleanDisplay.slice(0, -1);
      }

      const currentScalarValue = cleanDisplay === "" ? 0 : parseFloat(cleanDisplay);
      if (isNaN(currentScalarValue)) throw new Error("Null Parse");

      let calculatedOutput = 0; 

      switch (mode) {
        case "sqrt":
          if (currentScalarValue < 0) return setDisplayValue("Math Error"); 
          calculatedOutput = Math.sqrt(currentScalarValue || 0); 
          setEquationHistory(`√(${cleanDisplay || 0})`); 
          break;
        case "sqr":
          calculatedOutput = Math.pow(currentScalarValue || 0, 2); 
          setEquationHistory(`(${cleanDisplay || 0})²`);
          break;
        case "percent":
          calculatedOutput = (currentScalarValue || 0) / 100; 
          setEquationHistory(`(${cleanDisplay || 0})%`);
          break;
        case "sin":
          calculatedOutput = Math.sin((currentScalarValue * Math.PI) / 180); 
          setEquationHistory(`sin(${cleanDisplay || 0}°)`);
          break;
        case "cos":
          calculatedOutput = Math.cos((currentScalarValue * Math.PI) / 180);
          setEquationHistory(`cos(${cleanDisplay || 0}°)`);
          break;
        case "tan":
          calculatedOutput = Math.tan((currentScalarValue * Math.PI) / 180);
          setEquationHistory(`tan(${cleanDisplay || 0}°)`);
          break;
        case "pi":
          calculatedOutput = Math.PI; 
          if (cleanDisplay !== "" && cleanDisplay !== "0") {
            calculatedOutput = currentScalarValue * Math.PI;
            setEquationHistory(`${cleanDisplay} × π`);
          } else {
            setEquationHistory("π");
          }
          break;
        default:
          return;
      }

      setDisplayValue(Number(calculatedOutput.toFixed(6)).toString());
      setIsCalculated(true); // 🚀 NEW UX UPGRADE: Flag as completed calculation
    } catch (sciException) {
      setDisplayValue("Syntax Error");
      setIsCalculated(true);
    }
  };

  const handleEvaluateTotalResult = () => {
    try {
      if (!displayValue || !displayValue.trim()) return; 

      let sanitizedFormulaText = displayValue
        .replace(/×/g, "*") 
        .replace(/÷/g, "/"); 

      sanitizedFormulaText = sanitizedFormulaText.replace(/(\d)\(/g, "$1*(");
      sanitizedFormulaText = sanitizedFormulaText.replace(/\)(\d)/g, ")*$1");
      sanitizedFormulaText = sanitizedFormulaText.replace(/\)\(/g, ")*(");

      const sandboxedEvaluator = new Function(`return FormulaEvaluationOutput = (${sanitizedFormulaText});`);
      const absoluteScalarResult = sandboxedEvaluator(); 

      if (!isFinite(absoluteScalarResult) || isNaN(absoluteScalarResult)) {
        setDisplayValue("Math Error");
        setIsCalculated(true); // Lock screen state to prevent string contamination
        return;
      }

      setEquationHistory(displayValue); 
      setDisplayValue(Number(absoluteScalarResult.toFixed(6)).toString()); 
      setIsCalculated(true); // 🚀 NEW UX UPGRADE: Triggers the chaining state!
    } catch (syntaxError) {
      console.error("[MATH PARSING FAULT] Equation layout verification failed:", syntaxError.message); 
      setDisplayValue("Syntax Error"); 
      setIsCalculated(true);
    }
  };

  if (!isOpen) return null; 

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes imageCalcSheetSlide {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes imageCalcDropdownSlide {
          from { transform: translateY(-12px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .animate-calc-image-sheet { animation: imageCalcSheetSlide 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-calc-image-dropdown { animation: imageCalcDropdownSlide 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      {isMobileView && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/10 dark:bg-black/50 backdrop-blur-xs z-45 transition-all duration-300"
        />
      )}

      <div
        className={`bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between z-50 transition-all duration-300 border border-slate-200/90 dark:border-slate-900 shadow-[0_24px_64px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.4)] select-none ${
          isMobileView
            ? "fixed bottom-0 left-0 right-0 h-[80vh] rounded-t-[40px] px-5 pb-5 pt-4 animate-calc-image-sheet overflow-hidden"
            : "absolute top-18 right-8 w-[305px] max-h-[calc(100vh-6rem)] rounded-[32px] p-4.5 animate-calc-image-dropdown overflow-hidden"
        }`}
      >
        {isMobileView && (
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-3 shrink-0" />
        )}

        {/* ── ZONE 1: HIGH-FIDELITY SCROLLING FORMULA DISPLAY LAYER ── */}
        <div className="w-full flex flex-col items-end justify-end px-2 pt-2 pb-1 shrink-0 font-sans tracking-tight min-h-[76px]">
          <div className="text-[12px] font-bold text-slate-400 dark:text-slate-500 max-w-full truncate pr-1 font-mono tracking-normal leading-none min-h-[14px]">
            {equationHistory}
          </div>
          <div className="text-3xl sm:text-4xl font-light text-slate-800 dark:text-slate-100 max-w-full truncate flex items-center justify-end gap-1.5 leading-tight pt-0.5">
            <span className="text-slate-300 dark:text-slate-700 font-normal text-xl sm:text-2xl">=</span>
            <span className="font-sans font-normal tracking-tight">{displayValue || "0"}</span>
          </div>
        </div>

        {/* ── ZONE 2: ADVANCED VIEW PRESENTATION LAYER CONTROL STRIP ── */}
        <div className="w-full flex items-center justify-between py-2.5 border-y border-slate-100 dark:border-slate-900/60 shrink-0 my-1.5">
          <label className="flex items-center gap-2.5 cursor-pointer group relative">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              onChange={() => {
                console.log("[CALCULATOR SYSTEM] Elevating computational pipeline matrices into full screen view...");
                if (onMaximize) onMaximize(); 
              }}
            />
            <div className="w-8 h-4.5 bg-slate-100 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-slate-400 dark:after:bg-slate-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#8B3DFF] border border-slate-200/40 dark:border-transparent transition-colors" />
            <span className="text-[9px] font-sans font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
              Full Screen View
            </span>
          </label>

          <button
            type="button"
            onClick={() => setScientificPanelOpen(!scientificPanelOpen)}
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer focus:outline-none ${
              scientificPanelOpen 
                ? "bg-[#8B3DFF] border-[#8B3DFF] text-white rotate-180" 
                : "bg-slate-50 border-slate-200/60 text-slate-400 hover:text-slate-700 dark:bg-slate-900 dark:border-slate-800"
            }`}
            title="Expand secondary calculation parameters suite"
          >
            <i className="fas fa-chevron-down text-[9px]" />
          </button>
        </div>

        {scientificPanelOpen && (
          <div className="w-full grid grid-cols-5 gap-1 pb-2 pt-0.5 animate-fade-in shrink-0">
            <button type="button" onClick={() => handleExecuteSingleParamSciCalc("sin")} className="h-7 rounded-lg text-[9px] font-bold font-mono uppercase bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer focus:outline-none">sin</button>
            <button type="button" onClick={() => handleExecuteSingleParamSciCalc("cos")} className="h-7 rounded-lg text-[9px] font-bold font-mono uppercase bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer focus:outline-none">cos</button>
            <button type="button" onClick={() => handleExecuteSingleParamSciCalc("tan")} className="h-7 rounded-lg text-[9px] font-bold font-mono uppercase bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer focus:outline-none">tan</button>
            <button type="button" onClick={() => handleExecuteSingleParamSciCalc("sqr")} className="h-7 rounded-lg text-[9px] font-bold font-mono bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer focus:outline-none">x²</button>
            <button type="button" onClick={() => handleExecuteSingleParamSciCalc("pi")} className="h-7 rounded-lg text-[9px] font-bold font-mono bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer focus:outline-none">π</button>
          </div>
        )}

        {/* ── ZONE 3: NEOMORPHIC CIRCULAR BUTTON KEYPAD COMPRESSION GRID ── */}
        <div className="flex-1 grid grid-cols-4 gap-2 sm:gap-2.5 items-center justify-items-center min-h-0 overflow-y-auto modal-scroll py-1">
          
          <button type="button" onClick={handleResetMemory} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFB020] text-white text-base font-bold flex items-center justify-center transition-all active:scale-90 shadow-sm hover:brightness-105 cursor-pointer focus:outline-none">C</button>
          <button type="button" onClick={() => handleAppendToken("(")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F2EDE4] text-slate-700 dark:bg-[#2A2824] dark:text-amber-100/80 text-sm font-bold flex items-center justify-center transition-all active:scale-90 shadow-3xs cursor-pointer focus:outline-none">(</button>
          <button type="button" onClick={() => handleAppendToken(")")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F2EDE4] text-slate-700 dark:bg-[#2A2824] dark:text-amber-100/80 text-sm font-bold flex items-center justify-center transition-all active:scale-90 shadow-3xs cursor-pointer focus:outline-none">)</button>
          <button type="button" onClick={() => handleAppendToken("÷")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EAF0FD] text-[#557AE0] dark:bg-[#1E2538] dark:text-[#8AA4E8] text-base font-bold flex items-center justify-center transition-all active:scale-90 shadow-3xs cursor-pointer focus:outline-none">÷</button>

          <button type="button" onClick={() => handleExecuteSingleParamSciCalc("sqrt")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 text-slate-600 dark:bg-[#222] dark:text-slate-300 text-sm font-bold flex items-center justify-center transition-all active:scale-90 shadow-4xs cursor-pointer focus:outline-none">√</button>
          <button type="button" onClick={() => handleExecuteSingleParamSciCalc("percent")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 text-slate-600 dark:bg-[#222] dark:text-slate-300 text-sm font-bold flex items-center justify-center transition-all active:scale-90 shadow-4xs cursor-pointer focus:outline-none">%</button>
          <button type="button" onClick={handleToggleSignModifier} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 text-slate-600 dark:bg-[#222] dark:text-slate-300 text-sm font-bold flex items-center justify-center transition-all active:scale-90 shadow-4xs cursor-pointer focus:outline-none">±</button>
          <button type="button" onClick={() => handleAppendToken("×")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EAF0FD] text-[#557AE0] dark:bg-[#1E2538] dark:text-[#8AA4E8] text-base font-bold flex items-center justify-center transition-all active:scale-90 shadow-3xs cursor-pointer focus:outline-none">×</button>

          <button type="button" onClick={() => handleAppendToken("7")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">7</button>
          <button type="button" onClick={() => handleAppendToken("8")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">8</button>
          <button type="button" onClick={() => handleAppendToken("9")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">9</button>
          <button type="button" onClick={() => handleAppendToken("-")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EAF0FD] text-[#557AE0] dark:bg-[#1E2538] dark:text-[#8AA4E8] text-lg font-bold flex items-center justify-center transition-all active:scale-90 shadow-3xs cursor-pointer focus:outline-none">−</button>

          <button type="button" onClick={() => handleAppendToken("4")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">4</button>
          <button type="button" onClick={() => handleAppendToken("5")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">5</button>
          <button type="button" onClick={() => handleAppendToken("6")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">6</button>
          <button type="button" onClick={() => handleAppendToken("+")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EAF0FD] text-[#557AE0] dark:bg-[#1E2538] dark:text-[#8AA4E8] text-base font-bold flex items-center justify-center transition-all active:scale-90 shadow-3xs cursor-pointer focus:outline-none">+</button>

          <div className="col-span-3 grid grid-cols-3 gap-2 sm:gap-2.5 w-full items-center justify-items-center">
            <button type="button" onClick={() => handleAppendToken("1")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">1</button>
            <button type="button" onClick={() => handleAppendToken("2")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">2</button>
            <button type="button" onClick={() => handleAppendToken("3")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">3</button>

            <button type="button" onClick={() => handleAppendToken(".")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">.</button>
            <button type="button" onClick={() => handleAppendToken("0")} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 dark:bg-[#2C2C2C] dark:text-slate-100 text-base font-medium flex items-center justify-center transition-all active:scale-90 shadow-4xs border border-slate-100 dark:border-transparent cursor-pointer focus:outline-none">0</button>
            
            {/* 🚀 NEW UPGRADE: Replaced fragile SVG with bulletproof FontAwesome icon */}
            <button 
              type="button" 
              onClick={handleBackspaceSlice} 
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-500 hover:text-slate-800 dark:bg-[#222] dark:text-slate-400 dark:hover:text-slate-200 text-sm flex items-center justify-center transition-all active:scale-90 shadow-4xs cursor-pointer focus:outline-none" 
              title="Delete trailing character entry token"
            >
              <i className="fas fa-backspace"></i>
            </button>
          </div>

          <div className="col-span-1 h-full flex items-center justify-center w-full min-h-[94px] sm:min-h-[102px] pb-0.5">
            <button
              type="button"
              onClick={handleEvaluateTotalResult}
              className="w-full h-full rounded-[32px] bg-[#8B3DFF] text-white text-xl font-bold flex items-center justify-center transition-all active:scale-95 shadow-md shadow-purple-600/20 hover:brightness-105 cursor-pointer focus:outline-none"
              title="Compute mathematical result string expression"
            >
              =
            </button>
          </div>

        </div>

        {/* ── ZONE 4: BRAND SECURITY REGIONAL FOOTER LABELS STRIP ── */}
        <div className="w-full text-center shrink-0 pt-2 border-t border-slate-100 dark:border-slate-900/60 select-none mt-1.5">
          <p className="text-[9px] font-mono font-bold text-slate-300 dark:text-slate-700 tracking-wider uppercase">
            Jemer pro Calculator
          </p>
        </div>

      </div>
    </>
  );
}