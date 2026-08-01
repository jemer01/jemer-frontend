"use client";

/**
 * ================================================================================================
 * 🧮 JEMER ACADEMY ADVANCED SCIENTIFIC CANVAS (v4.2)
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY:
 * 1. MOBILE TAB MINIMIZE ACTION: Added a dedicated 'X' (Minimize) button directly inside the 
 *    mobile scrollable tabs row (`sm:hidden`). This solves the issue of users being trapped 
 *    in the calculator on slim screens.
 * 2. ESSENTIAL BRACKETS & KEYPAD GRID: Re-engineered the keypad grid to include `(` and `)` 
 *    buttons. Formatted the grid perfectly into a 4x6 layout where `Ans` and `=` buttons elegantly 
 *    span 2 columns (`col-span-2`), completing the layout symmetrically.
 * 3. FRIENDLY UX ERROR DIAGNOSTICS: Replaced the generic "Syntax Error" with intelligent, 
 *    student-friendly feedback strings. The engine now parses the `mathjs` crash message to tell 
 *    the user exactly how to fix it (e.g., "Fix: Add missing ')'", "Fix: Complete formula").
 * 4. TOKEN OPTIMIZATION: Maintained the strict minimization of legacy comments for performance.
 * ================================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { create, all } from "mathjs";
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx";
import dynamic from "next/dynamic";

const math = create(all, { number: "BigNumber", precision: 64 });

export default function FullCalculator({ isOpen, onClose, onMinimize }) {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState("calculator");

  // TAB 1: CALCULATOR
  const [expression, setExpression] = useState("");
  const [liveResult, setLiveResult] = useState("0");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [lastAnswer, setLastAnswer] = useState("0");
  const [is2ndActive, setIs2ndActive] = useState(false);
  const [angleMode, setAngleMode] = useState("deg");
  const [isConstModalOpen, setIsConstModalOpen] = useState(false);

  // TAB 2: CONVERTER
  const [unitCategory, setUnitCategory] = useState("length");
  const [unitInputValue, setUnitInputValue] = useState("");
  const [unitFrom, setUnitFrom] = useState("m");
  const [unitTo, setUnitTo] = useState("km");
  const [unitOutput, setUnitOutput] = useState("0");
  
  const [currencyAmount, setCurrencyAmount] = useState("1");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR"); 
  const [currencyOutput, setCurrencyOutput] = useState("0.00");
  const [currencyRateInfo, setCurrencyRateInfo] = useState("Select currencies to see rate.");
  const [currencyLoading, setCurrencyLoading] = useState(true);
  const [currencyRatesCache, setCurrencyRatesCache] = useState({});
  const [currencyList, setCurrencyList] = useState([]);

  // TAB 3: GRAPHING
  const [graphFunctions, setGraphFunctions] = useState([{ id: "fn-1", value: "x^2", color: "#4f46e5" }]);
  const [xMin, setXMin] = useState("-10");
  const [xMax, setXMax] = useState("10");
  const [graphError, setGraphError] = useState("");
  const graphContainerRef = useRef(null);

  // TAB 4: SOLVER
  const [equationType, setEquationType] = useState("linear");
  const [solverCoefficients, setSolverCoefficients] = useState({
    a: "", b: "", c: "", d: "",
    a1: "", b1: "", c1: "",
    a2: "", b2: "", c2: ""
  });
  const [solverResultText, setSolverResultText] = useState("");

  const physicalUnitsDictionary = {
    length: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h16v4M4 4l16 16M4 20h16" /></svg>, units: ["m", "km", "cm", "mm", "mi", "yd", "ft", "in"] },
    mass: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>, units: ["kg", "g", "mg", "lb", "oz", "tonne"] },
    temperature: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>, units: ["celsius", "fahrenheit", "kelvin"] },
    time: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, units: ["s", "min", "h", "day", "week"] },
    area: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4z" /></svg>, units: ["m^2", "km^2", "ha", "ft^2", "acre"] },
    volume: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, units: ["L", "mL", "m^3", "gal", "fl oz"] },
    data: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>, units: ["bit", "byte", "kb", "MB", "GB", "TB"] },
    speed: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, units: ["m/s", "km/h", "mph", "knot"] },
    energy: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, units: ["J", "kJ", "cal", "kcal", "Wh", "kWh"] },
    angle: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, units: ["rad", "deg", "grad"] },
    force: { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, units: ["N", "lbf", "dyn"] }
  };

  const unitLabels = { "m^2": "m²", "km^2": "km²", "ft^2": "ft²", "m^3": "m³", "m/s": "m/s", "km/h": "km/h" };

  // 🆕 INTELLIGENT ERROR DIAGNOSTICS PARSER
  const getFriendlyErrorMessage = (msg) => {
    const lowerMsg = (msg || "").toLowerCase();
    if (lowerMsg.includes("parenthesis") || lowerMsg.includes("bracket")) return "Fix: Add missing ')'";
    if (lowerMsg.includes("unexpected end")) return "Fix: Complete formula";
    if (lowerMsg.includes("value expected")) return "Fix: Missing a number";
    if (lowerMsg.includes("undefined symbol")) return "Fix: Unknown symbol";
    if (lowerMsg.includes("unexpected type")) return "Fix: Invalid format";
    return "Fix: Syntax Error";
  };

  useEffect(() => {
    if (!isOpen || activeTab !== "calculator") return;
    const handleHardwareInputCapture = (eventContext) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      const structuralKeyToken = eventContext.key;
      if (/[0-9.()]/.test(structuralKeyToken)) {
        eventContext.preventDefault();
        setExpression((prev) => prev + structuralKeyToken);
      } else if (["+", "-", "*", "/"].includes(structuralKeyToken)) {
        eventContext.preventDefault();
        const calculationOperatorDictionary = { "+": "+", "-": "-", "*": "×", "/": "÷" };
        setExpression((prev) => prev + calculationOperatorDictionary[structuralKeyToken]);
      } else if (structuralKeyToken === "Enter") {
        eventContext.preventDefault();
        processAbsoluteCalculationResult();
      } else if (structuralKeyToken === "Backspace") {
        eventContext.preventDefault();
        setExpression((prev) => prev.slice(0, -1));
      } else if (structuralKeyToken === "Escape") {
        eventContext.preventDefault();
        setExpression("");
        setLiveResult("0");
      }
    };
    window.addEventListener("keydown", handleHardwareInputCapture);
    return () => window.removeEventListener("keydown", handleHardwareInputCapture);
  }, [isOpen, activeTab, expression, lastAnswer]);

  useEffect(() => {
    if (isOpen) executeLiveCalcPreview();
  }, [expression, angleMode]);

  useEffect(() => {
    if (isOpen) processPhysicalUnitConversion();
  }, [unitCategory, unitInputValue, unitFrom, unitTo]);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchWorldRates() {
      try {
        setCurrencyLoading(true);
        const endpointResponse = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (!endpointResponse.ok) throw new Error("Remote API failure");
        const extractedJSON = await endpointResponse.json();
        setCurrencyRatesCache(extractedJSON.rates);
        const list = Object.keys(extractedJSON.rates).map(code => ({ code, name: code }));
        setCurrencyList(list.sort((a, b) => a.code.localeCompare(b.code)));
        setCurrencyLoading(false);
      } catch (networkFault) {
        console.error(networkFault.message);
        setCurrencyLoading(false);
      }
    }
    fetchWorldRates();
  }, [isOpen]);

  useEffect(() => {
    if (!currencyRatesCache[currencyFrom] || !currencyRatesCache[currencyTo]) return;
    const parsedAmount = parseFloat(currencyAmount);
    if (isNaN(parsedAmount)) {
      setCurrencyOutput("0.00");
      return;
    }
    const baseUSDValue = parsedAmount / currencyRatesCache[currencyFrom];
    const targetedOutcome = baseUSDValue * currencyRatesCache[currencyTo];
    setCurrencyOutput(formatMathResult(targetedOutcome));
    setCurrencyRateInfo(`1 ${currencyFrom} = ${(currencyRatesCache[currencyTo] / currencyRatesCache[currencyFrom]).toFixed(4)} ${currencyTo}`);
  }, [currencyAmount, currencyFrom, currencyTo, currencyRatesCache]);

  useEffect(() => {
    if (activeTab === "graphing" && isOpen) {
      const processingDelayToken = setTimeout(() => { executeCoordinatePlotGeneration(); }, 200);
      return () => clearTimeout(processingDelayToken);
    }
  }, [activeTab, graphFunctions, theme, xMin, xMax]);

  if (!isOpen) return null;

  const formatMathResult = (val) => {
    if (val === undefined || val === null) return "0";
    if (typeof val === 'object' && val.isBigNumber) val = val.toNumber();
    if (typeof val === 'number') {
      if (Math.abs(val) >= 1e15 || (Math.abs(val) < 1e-6 && val !== 0)) return val.toExponential(4);
      return val.toLocaleString('fullwide', { useGrouping: true, maximumFractionDigits: 10 });
    }
    return String(val);
  };

  const executeLiveCalcPreview = () => {
    try {
      if (!expression.trim()) { setLiveResult("0"); return; }
      let target = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/mod/g, "%");
      target = target.replace(/(\d)\(/g, "$1*(").replace(/\)(\d)/g, ")*$1").replace(/\)\(/g, ")*(");
      if (angleMode === "deg") {
        target = target.replace(/\b(a?(?:sin|cos|tan|sec|csc|cot)h?)\(([^)]+)\)/g, (m, f, c) => f.startsWith("a") ? `(${f}(${c})) rad to deg` : `${f}(${c} deg)`);
      }
      const outcome = math.evaluate(target);
      if (outcome !== undefined) setLiveResult(formatMathResult(outcome));
    } catch (e) {}
  };

  const processAbsoluteCalculationResult = () => {
    try {
      if (!expression.trim()) return;
      let target = expression.replace(/Ans/g, lastAnswer).replace(/×/g, "*").replace(/÷/g, "/");
      target = target.replace(/(\d)\(/g, "$1*(").replace(/\)(\d)/g, ")*$1").replace(/\)\(/g, ")*(");
      if (angleMode === "deg") {
        target = target.replace(/\b(a?(?:sin|cos|tan|sec|csc|cot)h?)\(([^)]+)\)/g, (m, f, c) => f.startsWith("a") ? `(${f}(${c})) rad to deg` : `${f}(${c} deg)`);
      }
      const out = math.evaluate(target);
      const strOut = formatMathResult(out);
      setLastAnswer(strOut);
      setHistoryLogs((p) => [{ exp: expression, res: strOut }, ...p]);
      setExpression(strOut);
      setLiveResult(strOut);
    } catch (e) {
      // 🆕 Inject Friendly UX Diagnostic strings instead of raw "Syntax Error"
      setLiveResult(getFriendlyErrorMessage(e.message));
    }
  };

  const handleCalculatorKeyStroke = (k) => {
    if (k === "C") { setExpression(""); setLiveResult("0"); }
    else if (k === "=") processAbsoluteCalculationResult();
    else if (k === "Backspace") setExpression((p) => p.slice(0, -1));
    else if (k === "Ans") setExpression((p) => p + "Ans");
    else setExpression((p) => p + k);
  };

  const handleAdvancedScientificFunction = (fn) => {
    const parenFns = ["log", "ln", "sqrt", "abs", "sin", "cos", "tan", "sec", "csc", "cot", "asin", "acos", "atan"];
    if (parenFns.includes(fn)) setExpression((p) => p + `${fn}(`);
    else if (fn === "sqr") setExpression((p) => p + "^2");
    else if (fn === "inv") setExpression((p) => p + "^-1");
    else if (fn === "fact") setExpression((p) => p + "!");
    else if (fn === "pi") setExpression((p) => p + "pi");
    else if (fn === "e") setExpression((p) => p + "e");
  };

  const processPhysicalUnitConversion = () => {
    try {
      const val = parseFloat(unitInputValue);
      if (isNaN(val)) { setUnitOutput("0"); return; }
      
      const fUnit = math.unit(1, unitFrom);
      const tUnit = math.unit(1, unitTo);
      if (!fUnit.equalBase(tUnit)) {
        setUnitOutput("Incompatible Units");
        return;
      }
      setUnitOutput(formatMathResult(math.unit(val, unitFrom).to(unitTo).toNumber()));
    } catch (e) { setUnitOutput("Error"); }
  };

  const handlePivotUnitCategory = (cat) => {
    setUnitCategory(cat);
    const uList = physicalUnitsDictionary[cat].units;
    setUnitFrom(uList[0]);
    setUnitTo(uList[1] || uList[0]);
  };

  const executeCoordinatePlotGeneration = async () => {
    if (!graphContainerRef.current) return;
    try {
      const PlotlyEngineModule = (await import("plotly.js-dist-min")).default;
      const minB = parseFloat(xMin) || -10;
      const maxB = parseFloat(xMax) || 10;
      if (minB >= maxB) { setGraphError("X-Min must be less than X-Max."); return; }
      setGraphError("");
      
      const traces = [];
      let valid = false;
      
      graphFunctions.forEach((row, i) => {
        if (!row.value.trim()) return;
        try {
          const comp = math.compile(row.value.toLowerCase().replace(/y\s*=/g, ""));
          const xArr = [], yArr = [];
          const step = (maxB - minB) / 350;
          for (let x = minB; x <= maxB; x += step) {
            try {
              const y = comp.evaluate({ x });
              xArr.push(x);
              yArr.push(math.isComplex(y) || isNaN(y) || !isFinite(y) ? null : y);
            } catch (e) {}
          }
          traces.push({ x: xArr, y: yArr, type: "scatter", mode: "lines", name: `y = ${row.value}`, line: { color: row.color, width: 3 } });
          valid = true;
        } catch (e) { setGraphError(`Syntax error on Row ${i + 1}.`); }
      });
      
      if (!valid) { PlotlyEngineModule.purge(graphContainerRef.current); return; }
      
      const isDark = theme === "dark" || document.documentElement.classList.contains("dark");
      
      PlotlyEngineModule.react(graphContainerRef.current, traces, {
        margin: { t: 15, r: 15, b: 35, l: 35 },
        showlegend: true, dragmode: 'pan',
        legend: { orientation: "h", y: -0.18, font: { color: isDark ? "#94a3b8" : "#64748b", size: 10 } },
        paper_bgcolor: "transparent", plot_bgcolor: "transparent", hovermode: "closest",
        xaxis: { gridcolor: isDark ? "#1e293b" : "#f1f5f9", zerolinecolor: isDark ? "#334155" : "#cbd5e1", tickfont: { color: isDark ? "#94a3b8" : "#64748b", size: 10 } },
        yaxis: { gridcolor: isDark ? "#1e293b" : "#f1f5f9", zerolinecolor: isDark ? "#334155" : "#cbd5e1", tickfont: { color: isDark ? "#94a3b8" : "#64748b", size: 10 } },
        autosize: true
      }, { responsive: true, displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'], modeBarButtonsToAdd: ['toImage'] });
    } catch (e) {}
  };

  const handleAppendGraphingFunctionLine = () => {
    const palette = ["#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];
    setGraphFunctions((p) => [...p, { id: `fn-${Date.now()}`, value: "", color: palette[p.length % palette.length] }]);
  };

  const handleUpdateGraphFunctionValue = (id, value) => setGraphFunctions((p) => p.map((f) => (f.id === id ? { ...f, value } : f)));
  const handlePurgeGraphingFunctionLine = (id) => setGraphFunctions((p) => p.filter((f) => f.id !== id));

  const executeEquationAlgebraicResolution = (e) => {
    e.preventDefault();
    try {
      if (equationType === "linear") {
        const a = parseFloat(solverCoefficients.a), b = parseFloat(solverCoefficients.b), c = parseFloat(solverCoefficients.c);
        if ([a,b,c].some(isNaN)) throw new Error("Fields incomplete.");
        if (a === 0) throw new Error("a cannot be 0.");
        const finalX = (c - b) / a;
        setSolverResultText(`1) Isolate x: ${a}x = ${c} - ${b}\n2) Divide by ${a}\n✅ x = ${formatMathResult(finalX)}`);
      } else if (equationType === "quadratic") {
        const a = parseFloat(solverCoefficients.a), b = parseFloat(solverCoefficients.b), c = parseFloat(solverCoefficients.c);
        if ([a,b,c].some(isNaN)) throw new Error("Fields incomplete.");
        if (a === 0) throw new Error("a cannot be 0.");
        const d = b * b - 4 * a * c;
        if (d > 0) setSolverResultText(`Δ = ${d}\n✅ x₁ = ${formatMathResult((-b + Math.sqrt(d)) / (2 * a))}\n✅ x₂ = ${formatMathResult((-b - Math.sqrt(d)) / (2 * a))}`);
        else if (d === 0) setSolverResultText(`Δ = 0\n✅ x = ${formatMathResult(-b / (2 * a))}`);
        else setSolverResultText(`Complex Roots\n✅ x₁ = ${formatMathResult(-b / (2 * a))} + ${formatMathResult(Math.sqrt(-d) / (2 * a))}i\n✅ x₂ = ${formatMathResult(-b / (2 * a))} - ${formatMathResult(Math.sqrt(-d) / (2 * a))}i`);
      } else if (equationType === "cubic") {
        setSolverResultText("Cubic evaluation active.");
      } else if (equationType === "system2x2") {
        const nA1 = parseFloat(solverCoefficients.a1), nB1 = parseFloat(solverCoefficients.b1), nC1 = parseFloat(solverCoefficients.c1);
        const nA2 = parseFloat(solverCoefficients.a2), nB2 = parseFloat(solverCoefficients.b2), nC2 = parseFloat(solverCoefficients.c2);
        if ([nA1, nB1, nC1, nA2, nB2, nC2].some(isNaN)) throw new Error("Incomplete.");
        const D = nA1 * nB2 - nA2 * nB1;
        if (D === 0) throw new Error("No unique solution.");
        setSolverResultText(`D = ${D}\n✅ x = ${formatMathResult((nC1 * nB2 - nC2 * nB1) / D)}\n✅ y = ${formatMathResult((nA1 * nC2 - nA2 * nC1) / D)}`);
      }
    } catch (err) { setSolverResultText(err.message); }
  };

  const handleUpdateCoefficientValue = (k, v) => setSolverCoefficients((p) => ({ ...p, [k]: v }));

  const CurrencySelect = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const r = useRef(null);
    useEffect(() => {
      const clickOut = (e) => { if (r.current && !r.current.contains(e.target)) setOpen(false); };
      document.addEventListener("mousedown", clickOut);
      return () => document.removeEventListener("mousedown", clickOut);
    }, []);
    const filt = currencyList.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));
    return (
      <div className="relative" ref={r}>
        <div onClick={() => setOpen(!open)} className="w-full p-2.5 rounded-b-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer flex justify-between items-center">
          <span>{value}</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
        {open && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto modal-scroll">
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 border-b border-slate-200 dark:border-slate-700 text-xs outline-none bg-transparent text-slate-800 dark:text-slate-200" />
            {filt.length > 0 ? filt.map(c => <div key={c.code} onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">{c.code}</div>) : <div className="p-2 text-xs text-slate-400 text-center">No results</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .modal-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .modal-scroll::-webkit-scrollbar-thumb { background: #475569; }
        .modal-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        .dark .modal-scroll { scrollbar-color: #475569 transparent; }
      `}} />

      <div className="absolute inset-0 w-full h-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between p-2 sm:p-6 lg:p-8 z-20 overflow-hidden sm:rounded-3xl">
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col transition-all duration-300 gap-2 sm:gap-5">
          
          {/* CONTROL BAR */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-800/80 gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-base font-sans font-black text-slate-900 dark:text-white tracking-tight">Jemer Pro Scientific Canvas</h2>
            </div>
            
            <div className="flex items-center bg-slate-200/50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-300/40 dark:border-slate-800/40 shadow-inner w-full sm:w-auto overflow-x-auto modal-scroll">
              {[
                { id: "calculator", name: "Calculator", icon: <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
                { id: "converter", name: "Converter", icon: <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
                { id: "graphing", name: "Graphing", icon: <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> },
                { id: "solver", name: "Solver", icon: <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h16v4M4 4l16 16M4 20h16" /></svg> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 focus:outline-none ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md dark:bg-indigo-500" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
                >
                  {tab.icon} <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
              
              {/* 🆕 MOBILE MINIMIZE: Explicit 'X' button inside the tab scroller to save users on slim screens */}
              <button
                type="button"
                onClick={onMinimize}
                className="sm:hidden px-3 py-1.5 ml-1 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 focus:outline-none text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 hidden sm:flex">
              <button onClick={onMinimize} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-xs"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h16v4M4 4l16 16M4 20h16" /></svg> Minimize</button>
              <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white hover:bg-red-500 hover:border-red-500 hover:text-white dark:bg-slate-900 text-slate-400 transition-all flex items-center justify-center shadow-xs"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>

          {/* MAIN CANVAS */}
          <div className="flex-1 w-full min-h-0 flex flex-col">
            
            {activeTab === "calculator" && (
              <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-3 gap-2 sm:gap-6 items-stretch min-h-0 animate-fade-in overflow-y-auto modal-scroll lg:overflow-hidden">
                
                <div className="hidden lg:flex bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex-col h-full min-h-0">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3 shrink-0">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Tape History
                    </h3>
                    <button onClick={() => setHistoryLogs([])} className="text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 px-2 py-1 rounded">Flush Tape</button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 modal-scroll">
                    {historyLogs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-600 py-12">
                        <svg className="w-8 h-8 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xs font-sans font-medium italic">Evaluated expressions lock here.</p>
                      </div>
                    ) : (
                      historyLogs.map((log, index) => (
                        <div key={index} onClick={() => setExpression(log.res)} className="p-2.5 text-right rounded-xl bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 cursor-pointer">
                          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mb-0.5">{log.exp} =</div>
                          <div className="text-sm font-sans font-black text-slate-800 dark:text-slate-200 truncate">{log.res}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2 sm:p-5 rounded-2xl shadow-xs flex flex-col justify-between gap-2 sm:gap-4 shrink-0 h-full min-h-0">
                  
                  {/* Display Screen */}
                  <div className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 sm:p-5 text-right flex flex-col justify-between font-mono shadow-inner relative min-h-[80px] sm:min-h-[120px] shrink-0 transition-colors">
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-bold truncate tracking-wide font-mono min-h-[18px]">{expression || " "}</div>
                    <div className="w-full flex items-center justify-between gap-4 mt-2">
                      <div className="flex items-center gap-1.5 select-none">
                        <span onClick={() => setAngleMode(p => p === "deg" ? "rad" : "deg")} className="text-[9px] sm:text-[10px] font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950 rounded uppercase cursor-pointer">{angleMode}</span>
                        <span onClick={() => setIsConstModalOpen(true)} className="text-[9px] sm:text-[10px] font-black text-amber-600 px-2 py-0.5 bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-950 rounded uppercase cursor-pointer flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> CONST</span>
                      </div>
                      {/* 🆕 UX FIX: Reduced max text size slightly on mobile to accommodate longer friendly error messages without breaking */}
                      <div className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight truncate max-w-[80%]">
                        {liveResult}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto modal-scroll py-1">
                    
                    {/* Scientific Row */}
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 shrink-0">
                      <button onClick={() => setIs2ndActive(!is2ndActive)} className={`h-10 sm:h-11 rounded-xl text-xs font-bold border transition-all ${is2ndActive ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>2nd</button>
                      <button onClick={() => handleAdvancedScientificFunction(is2ndActive ? "asin" : "sin")} className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{is2ndActive ? "sin⁻¹" : "sin"}</button>
                      <button onClick={() => handleAdvancedScientificFunction(is2ndActive ? "acos" : "cos")} className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{is2ndActive ? "cos⁻¹" : "cos"}</button>
                      <button onClick={() => handleAdvancedScientificFunction(is2ndActive ? "atan" : "tan")} className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{is2ndActive ? "tan⁻¹" : "tan"}</button>
                      <button onClick={() => handleAdvancedScientificFunction("log")} className="hidden md:block h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">log</button>
                      <button onClick={() => handleAdvancedScientificFunction("ln")} className="hidden md:block h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">ln</button>
                      <button onClick={() => handleAdvancedScientificFunction("sqr")} className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">x²</button>
                      <button onClick={() => handleAdvancedScientificFunction("sqrt")} className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">√</button>
                      <button onClick={() => handleAdvancedScientificFunction("inv")} className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">1/x</button>
                      <button onClick={() => handleAdvancedScientificFunction("pi")} className="h-10 sm:h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">π</button>
                      <button onClick={() => handleAdvancedScientificFunction("e")} className="hidden md:block h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">e</button>
                      <button onClick={() => handleAdvancedScientificFunction("fact")} className="hidden md:block h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">n!</button>
                    </div>
                    
                    {/* 🆕 KEYPAD RESTRUCTURE: Integrated `(` and `)` while preserving symmetric 4-column layout constraints */}
                    <div className="grid grid-cols-4 gap-2 flex-1 min-h-0">
                      {["(", ")", "mod", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", "."].map((token) => {
                        const isOperator = ["÷", "×", "-", "+", "mod"].includes(token);
                        const isBracket = ["(", ")"].includes(token);
                        return (
                          <button key={token} onClick={() => handleCalculatorKeyStroke(token)} className={`min-h-[44px] sm:min-h-[48px] rounded-xl text-sm sm:text-base font-bold transition-all focus:outline-none ${
                            isOperator ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" : 
                            isBracket ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" : 
                            "bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}>
                            {token}
                          </button>
                        );
                      })}
                      {/* Control Keys - Forced into the bottom rows logically */}
                      <button onClick={() => handleCalculatorKeyStroke("C")} className="min-h-[44px] sm:min-h-[48px] rounded-xl text-xs font-black bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">C</button>
                      <button onClick={() => handleCalculatorKeyStroke("Backspace")} className="min-h-[44px] sm:min-h-[48px] rounded-xl flex items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                      </button>
                      <button onClick={() => handleCalculatorKeyStroke("Ans")} className="col-span-2 min-h-[44px] sm:min-h-[48px] rounded-xl text-xs font-bold bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Ans</button>
                      <button onClick={() => handleCalculatorKeyStroke("=")} className="col-span-2 min-h-[44px] sm:min-h-[48px] rounded-xl text-base font-extrabold bg-indigo-600 text-white dark:bg-indigo-500">=</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONVERTER */}
            {activeTab === "converter" && (
              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch min-h-0 overflow-y-auto pr-1 modal-scroll animate-fade-in">
                
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col gap-4 h-fit">
                  <div className="flex items-center gap-3.5 pb-2 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                      {physicalUnitsDictionary[unitCategory].icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-sans font-black text-slate-900 dark:text-white leading-tight">Physical Dimensions Transform Core</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 font-mono">Domain</label>
                      <select value={unitCategory} onChange={(e) => handlePivotUnitCategory(e.target.value)} className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold outline-none cursor-pointer">
                        {Object.keys(physicalUnitsDictionary).map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 font-mono">Source</label>
                        <input type="number" value={unitInputValue} onChange={(e) => setUnitInputValue(e.target.value)} placeholder="0" className="w-full p-3 rounded-t-xl bg-white dark:bg-slate-800 border-t border-x border-slate-200 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white outline-none" />
                        <select value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)} className="w-full p-2.5 rounded-b-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer">
                          {physicalUnitsDictionary[unitCategory].units.map((u) => <option key={u} value={u}>{unitLabels[u] || u}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 font-mono">Outcome</label>
                        <div className="w-full p-3 rounded-t-xl bg-slate-100 dark:bg-slate-950 border-t border-x border-slate-200 dark:border-slate-800 font-mono text-base font-black text-indigo-600 dark:text-indigo-400 min-h-[48px] flex items-center truncate select-all">{unitOutput}</div>
                        <select value={unitTo} onChange={(e) => setUnitTo(e.target.value)} className="w-full p-2.5 rounded-b-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer">
                          {physicalUnitsDictionary[unitCategory].units.map((u) => <option key={u} value={u}>{unitLabels[u] || u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col gap-4 h-fit">
                  <div className="flex items-center gap-3.5 pb-2 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-sans font-black text-slate-900 dark:text-white leading-tight">Live Currency Exchange</h3>
                    </div>
                  </div>
                  {currencyLoading ? (
                    <div className="py-8 text-center text-slate-400 font-mono">
                      <svg className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-1 font-mono">Capital Amount</label>
                          <input type="number" value={currencyAmount} onChange={(e) => setCurrencyAmount(e.target.value)} placeholder="1.00" className="w-full p-3 rounded-t-xl bg-white dark:bg-slate-800 border-t border-x border-slate-200 dark:border-slate-700 font-mono text-base font-bold text-slate-900 dark:text-white outline-none" />
                          <CurrencySelect value={currencyFrom} onChange={setCurrencyFrom} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-1 font-mono">Target Value</label>
                          <div className="w-full p-3 rounded-t-xl bg-slate-100 dark:bg-slate-950 border-t border-x border-slate-200 dark:border-slate-800 font-mono text-base font-black text-emerald-600 dark:text-emerald-400 min-h-[48px] flex items-center truncate select-all">{currencyOutput}</div>
                          <CurrencySelect value={currencyTo} onChange={setCurrencyTo} />
                        </div>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 p-3 rounded-xl flex items-center gap-2.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 font-mono select-none">
                        <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p>{currencyRateInfo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: GRAPHING */}
            {activeTab === "graphing" && (
              <div className="w-full h-full flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch min-h-0 animate-fade-in">
                <div className="w-full lg:w-85 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col justify-between gap-4 shrink-0 overflow-y-auto modal-scroll">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2"><svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> Functions</h3>
                      <button onClick={handleAppendGraphingFunctionLine} className="text-[10px] font-black uppercase text-white bg-indigo-600 px-2 py-1 rounded-lg">Add Rule</button>
                    </div>
                    <div className="space-y-2 max-h-[150px] sm:max-h-[320px] overflow-y-auto pr-0.5 modal-scroll">
                      {graphFunctions.map((fn, idx) => (
                        <div key={fn.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-2 rounded-xl">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fn.color }} />
                          <span className="font-mono text-xs text-slate-400">y=</span>
                          <input type="text" value={fn.value} onChange={(e) => handleUpdateGraphFunctionValue(fn.id, e.target.value)} placeholder="x^2" className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-slate-900 dark:text-white font-bold" />
                          {idx > 0 && <button onClick={() => handlePurgeGraphingFunctionLine(fn.id)} className="text-red-400 px-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 p-3 rounded-xl">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-[10px] text-slate-400 font-mono mb-0.5 block">X Min</label><input type="number" value={xMin} onChange={(e) => setXMin(e.target.value)} className="w-full p-2 text-center font-mono text-xs rounded-lg bg-white dark:bg-slate-800 border outline-none dark:text-white" /></div>
                        <div><label className="text-[10px] text-slate-400 font-mono mb-0.5 block">X Max</label><input type="number" value={xMax} onChange={(e) => setXMax(e.target.value)} className="w-full p-2 text-center font-mono text-xs rounded-lg bg-white dark:bg-slate-800 border outline-none dark:text-white" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pt-1">
                    <button onClick={executeCoordinatePlotGeneration} className="w-full py-3 bg-indigo-600 text-white font-black text-xs uppercase rounded-xl">Sync Plot Grid</button>
                    {graphError && <div className="mt-2 p-2 bg-red-50 text-red-600 text-[10px] rounded-lg">{graphError}</div>}
                  </div>
                </div>
                <div className="flex-1 bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-2xl relative overflow-hidden min-h-[250px] sm:min-h-[340px] shadow-inner flex flex-col justify-center items-center">
                  <div ref={graphContainerRef} className="w-full h-full absolute inset-0" />
                </div>
              </div>
            )}

            {/* TAB 4: SOLVER */}
            {activeTab === "solver" && (
              <div className="w-full h-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xs max-w-3xl mx-auto overflow-y-auto modal-scroll animate-fade-in flex flex-col gap-4">
                <div className="w-full">
                  <select value={equationType} onChange={(e) => { setEquationType(e.target.value); setSolverResultText(""); }} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-bold outline-none cursor-pointer">
                    <option value="linear">Linear Equation (ax + b = c)</option>
                    <option value="quadratic">Quadratic Polynomial (ax² + bx + c = 0)</option>
                    <option value="cubic">Cubic Polynomial (ax³ + bx² + cx + d = 0)</option>
                    <option value="system2x2">2-Variable Simultaneous System</option>
                  </select>
                </div>
                <form onSubmit={executeEquationAlgebraicResolution} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-4 shadow-inner">
                  <div className="w-full flex items-center justify-center p-1 overflow-x-auto modal-scroll">
                    {equationType === "linear" && (
                      <div className="flex items-center gap-2 font-mono font-bold whitespace-nowrap">
                        <input type="number" required placeholder="a" value={solverCoefficients.a} onChange={(e) => handleUpdateCoefficientValue("a", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" /><span className="dark:text-white">x +</span>
                        <input type="number" required placeholder="b" value={solverCoefficients.b} onChange={(e) => handleUpdateCoefficientValue("b", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" /><span className="dark:text-white">=</span>
                        <input type="number" required placeholder="c" value={solverCoefficients.c} onChange={(e) => handleUpdateCoefficientValue("c", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
                      </div>
                    )}
                    {equationType === "quadratic" && (
                      <div className="flex items-center gap-2 font-mono font-bold whitespace-nowrap">
                        <input type="number" required placeholder="a" value={solverCoefficients.a} onChange={(e) => handleUpdateCoefficientValue("a", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" /><span className="dark:text-white">x² +</span>
                        <input type="number" required placeholder="b" value={solverCoefficients.b} onChange={(e) => handleUpdateCoefficientValue("b", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" /><span className="dark:text-white">x +</span>
                        <input type="number" required placeholder="c" value={solverCoefficients.c} onChange={(e) => handleUpdateCoefficientValue("c", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" /><span className="dark:text-white">= 0</span>
                      </div>
                    )}
                    {equationType === "system2x2" && (
                      <div className="grid grid-cols-1 gap-3 font-mono font-bold">
                        <div className="flex items-center gap-2">
                          <input type="number" required placeholder="a₁" value={solverCoefficients.a1} onChange={(e) => handleUpdateCoefficientValue("a1", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border rounded-lg" /><span className="dark:text-white">x+</span>
                          <input type="number" required placeholder="b₁" value={solverCoefficients.b1} onChange={(e) => handleUpdateCoefficientValue("b1", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border rounded-lg" /><span className="dark:text-white">y=</span>
                          <input type="number" required placeholder="c₁" value={solverCoefficients.c1} onChange={(e) => handleUpdateCoefficientValue("c1", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border rounded-lg" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" required placeholder="a₂" value={solverCoefficients.a2} onChange={(e) => handleUpdateCoefficientValue("a2", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border rounded-lg" /><span className="dark:text-white">x+</span>
                          <input type="number" required placeholder="b₂" value={solverCoefficients.b2} onChange={(e) => handleUpdateCoefficientValue("b2", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border rounded-lg" /><span className="dark:text-white">y=</span>
                          <input type="number" required placeholder="c₂" value={solverCoefficients.c2} onChange={(e) => handleUpdateCoefficientValue("c2", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-800 border rounded-lg" />
                        </div>
                      </div>
                    )}
                  </div>
                  <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-black text-xs uppercase rounded-xl">Execute Formula Computation</button>
                </form>
                <div className="p-4 rounded-xl bg-slate-100 border-l-4 border-indigo-600 dark:bg-slate-950 dark:border-l-indigo-500 min-h-[90px] flex flex-col justify-center">
                  <div className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">{solverResultText || "System roots values solutions print down here."}</div>
                </div>
              </div>
            )}
          </div>

          {/* ── SEGMENT 3: STATIONARY BOTTOM FOOTER TRACK (Hidden on Mobile) ── */}
          <div className="w-full shrink-0 select-none hidden sm:block border-t border-slate-200 dark:border-slate-900 pt-2 text-center">
            <p className="text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase">Jemer Corporate Enterprise Mathematical Core Infrastructure // 2026</p>
          </div>
        </div>
      </div>

      {/* CONSTANTS MODAL */}
      {isConstModalOpen && (
        <div onClick={() => setIsConstModalOpen(false)} className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in">
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Constants
              </h3>
              <button onClick={() => setIsConstModalOpen(false)} className="text-slate-500 hover:text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-2 max-h-[280px] overflow-y-auto modal-scroll space-y-0.5">
              {[
                { name: "Circular Pi Scalar Ratio", token: "pi", value: "3.141592" },
                { name: "Euler's Base Coefficient (e)", token: "e", value: "2.718281" },
                { name: "Golden Spiral Ratio (φ)", token: "1.618033", value: "1.618033" },
                { name: "Speed of Light constant (c)", token: "299792458", value: "299.7M m/s" }
              ].map((c, i) => (
                <button key={i} onClick={() => { setExpression(p => p + c.token); setIsConstModalOpen(false); }} className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex justify-between items-center cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                  <span className="text-[11px] font-mono font-black text-indigo-600 dark:text-indigo-400">{c.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}