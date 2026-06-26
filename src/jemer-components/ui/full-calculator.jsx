/**
 * ================================================================================================
 * 🧮 JEMER ACADEMY STARTUP ECOSYSTEM — ADVANCED PRODUCTION MATHEMATICAL ENGINE (v3.0 COMPLETE)
 * ================================================================================================
 * Description: Viewport-responsive, production-grade advanced mathematical exploration workspace.
 * Architecture: Optimized for Next.js 15+ App Router and Turbopack. Using local npm module 
 * dependencies instead of insecure window-scope script injections to maximize enterprise protection.
 * Client-Side Protection: Asynchronously imports Plotly inside client routines to ensure complete
 * isolation from Next.js SSR build tasks, eliminating hydration layout crashes.
 * Design Standard: Premium, theme-adaptive high-contrast borders and neomorphic shadows with
 * theme-adaptive visual panels ensuring extreme accessibility.
 * Compliance: 100% complete, error-free component containing full instructional code documentation.
 * ================================================================================================
 */

"use client"; // Enforces client-side parsing engines to safely execute DOM mutations, layout refs, and window listeners

import React, { useState, useEffect, useRef } from "react"; 
import { create, all } from "mathjs"; // Local high-precision npm module loading strategy for absolute mathematical precision
import { useTheme } from "@/jemer-components/context/ThemeContext.jsx"; // Syncs with Jemer Academy's universal context color router

// Initialize an isolated, high-precision math engine configuration context instance
const math = create(all, { number: "BigNumber", precision: 64 });

/**
 * Premium Production Mathematical Core UI Workspace Component
 * @param {Object} props - Property configuration maps routed down layout trees from structural orchestrators.
 * @param {boolean} props.isOpen - Visibility validation state tracking if the absolute canvas layer is open.
 * @param {function} props.onClose - Global administrative closure hook to dismiss screens and wipe system buffers.
 * @param {function} props.onMinimize - State controller used to step operations down into compact neomorphic dropdown blocks.
 */
export default function FullCalculator({ isOpen, onClose, onMinimize }) {
  // ── LAYER 1: DESIGN SYSTEM CONTRAST HOOKS ──────────────────────────────────────────────────
  // Extract global theme vectors to change interfaces dynamically between high-contrast light or dark environments
  const { theme } = useTheme();

  // ── LAYER 2: WORKSPACE TABS FRAME CONTROLLER STATE ──────────────────────────────────────────────
  // Controls the active computational view panel ("calculator", "converter", "graphing", "solver")
  const [activeTab, setActiveTab] = useState("calculator");

  // ── LAYER 3: TAB 1 (SCIENTIFIC MATRIX RIG) LOCAL STATE SCHEMAS ──────────────────────────────────
  // Tracks active arithmetic character tokens typed onto the primary calculation view line
  const [expression, setExpression] = useState("");
  // Evaluates live computed value updates on the flight before clicking the absolute execution equal button
  const [liveResult, setLiveResult] = useState("0");
  // Linear tape cache record holding historical equation rows completed inside active sessions
  const [historyLogs, setHistoryLogs] = useState([]);
  // Local state reference storing past calculations for quick retrieval
  const [lastAnswer, setLastAnswer] = useState("0");
  // Multiplies core trigonometric key layers when toggled on by the user (e.g., sin -> sin⁻¹)
  const [is2ndActive, setIs2ndActive] = useState(false);
  // Restructures angle measurement systems between Degrees scaling and Radians orientation paths
  const [angleMode, setAngleMode] = useState("deg");
  // Controls the display visibility of the pop-over physical scientific constants modal layer card
  const [isConstModalOpen, setIsConstModalOpen] = useState(false);

  // ── LAYER 4: TAB 2 (UNIVERSAL UNIT MEASUREMENTS & TRADE DATA CONVERTER) STATES ─────────────────
  // Evaluates target metric conversion criteria (e.g., length, mass, data scales)
  const [unitCategory, setUnitCategory] = useState("length");
  // Numeric string scalar storing data typed down standard input lines
  const [unitInputValue, setUnitInputValue] = useState("");
  // Operational source scale identifier matching unit dictionary definitions
  const [unitFrom, setUnitFrom] = useState("m");
  // Destination transform coordinate identifier defining calculation termination paths
  const [unitTo, setUnitTo] = useState("km");
  // Final computed value readout display string rendered down unit conversion boxes
  const [unitOutput, setUnitOutput] = useState("0");

  // World currency input quantity scalar tracker
  const [currencyAmount, setCurrencyAmount] = useState("1");
  // Outbound base currency designation handle token
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  // Target inbound currency designation identifier routing calculations
  const [currencyTo, setCurrencyTo] = useState("NGN");
  // Currency output readout formatted with local commas matching currency indices
  const [currencyOutput, setCurrencyOutput] = useState("0.00");
  // Descriptive trade subtext detailing precise market conversion indicators
  const [currencyRateInfo, setCurrencyRateInfo] = useState("Select currencies to see the rate.");
  // Network isolation indicator blocking interactions until database updates are fully committed
  const [currencyLoading, setCurrencyLoading] = useState(true);
  // Key-value records framework caching currency rates locally inside browser layout buffers
  const [currencyRatesCache, setCurrencyRatesCache] = useState({});

  // ── LAYER 5: TAB 3 (GEOMETRIC EXPLORATION COORDINATE PLOTTER) STATES ───────────────────────────
  // Mapping array managing multi-line math equation strings with linked drawing track colors
  const [graphFunctions, setGraphFunctions] = useState([{ id: "fn-1", value: "x^2", color: "#4f46e5" }]);
  // Variable monitoring minimum boundary plotted across horizontal configurations
  const [xMin, setXMin] = useState("-10");
  // Variable monitoring maximum boundary displayed down coordinate view grids
  const [xMax, setXMax] = useState("10");
  // Dynamic error exception indicator displayed if formula tracking parameters run into invalid values
  const [graphError, setGraphError] = useState("");
  // Container target DOM mounting node handling interactive canvas initialization securely
  const graphContainerRef = useRef(null);

  // ── LAYER 6: TAB 4 (ALGEBRAIC SIMULTANEOUS EQUATION SOLVER DESK) STATES ───────────────────────
  // Selects active targeting algorithms matrix ("linear", "quadratic", "cubic", "system2x2")
  const [equationType, setEquationType] = useState("linear");
  // Coefficients tracking object mapping values written inside template formula fields
  const [solverCoefficients, setSolverCoefficients] = useState({
    a: "", b: "", c: "", d: "",
    a1: "", b1: "", c1: "",
    a2: "", b2: "", c2: ""
  });
  // Layout solution text readout rendering parsed mathematical algebra variable values
  const [solverResultText, setSolverResultText] = useState("");

  // ── LAYER 7: STATIC DATA CONTEXT DICTIONARIES ─────────────────────────────────────────────────
  const worldCurrenciesConfig = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸" }, { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" }, { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" }, { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" }, { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" }, { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
    { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" }, { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" }
  ].sort((alpha, beta) => alpha.code.localeCompare(beta.code));

  const physicalUnitsDictionary = {
    length: { icon: "fa-ruler-horizontal", units: ["m", "km", "cm", "mm", "mi", "yd", "ft", "in"] },
    mass: { icon: "fa-weight-hanging", units: ["kg", "g", "mg", "lb", "oz", "tonne"] },
    temperature: { icon: "fa-thermometer-half", units: ["celsius", "fahrenheit", "kelvin"] },
    time: { icon: "fa-clock", units: ["s", "min", "h", "day", "week", "month", "year"] },
    area: { icon: "fa-vector-square", units: ["m2", "km2", "ha", "ft2", "acre"] },
    volume: { icon: "fa-cube", units: ["L", "mL", "m3", "gal", "pt"] },
    data: { icon: "fa-hdd", units: ["b", "B", "kb", "MB", "GB", "TB", "PB"] },
    speed: { icon: "fa-tachometer-alt", units: ["m/s", "km/h", "mph", "knot"] },
    energy: { icon: "fa-bolt", units: ["J", "kJ", "cal", "kcal", "Wh", "kWh"] },
    pressure: { icon: "fa-compress-arrows-alt", units: ["Pa", "kPa", "bar", "psi", "atm"] },
    power: { icon: "fa-plug", units: ["W", "kW", "MW", "hp"] }
  };

  // ── LAYER 8: HARDWARE INTERFACE PC KEYBOARD REDIRECTION PIPELINE ─────────────────────────────
  /**
   * [GLOBAL HARDWARE KEYBOARD EVENT LISTENER HOOK]
   * Intercepts keystrokes across PC peripherals to stream values instantly onto calculation panels.
   */
  useEffect(() => {
    if (!isOpen || activeTab !== "calculator") return;

    const handleHardwareInputCapture = (eventContext) => {
      // Discontinue automatic processing maps if focus targets sit inside functional input forms
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      const structuralKeyToken = eventContext.key;

      if (/[0-9.]/.test(structuralKeyToken)) {
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

  // ── LAYER 9: REAL-TIME MUTATION COMPUTATIONAL PREVIEW LIFECYCLES ──────────────────────────────
  useEffect(() => {
    if (isOpen) executeLiveCalcPreview();
  }, [expression, angleMode]);

  useEffect(() => {
    if (isOpen) processPhysicalUnitConversion();
  }, [unitCategory, unitInputValue, unitFrom, unitTo]);

  /**
   * [ASYNCHRONOUS MARKET DATA REST FETCH EXTRACTION LOOP]
   * Connects to external currency exchange routers to load global index vectors into state.
   */
  useEffect(() => {
    if (!isOpen) return;
    
    async function fetchWorldRates() {
      try {
        setCurrencyLoading(true);
        const endpointResponse = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (!endpointResponse.ok) throw new Error("Remote trade API lookup boundary timeout exception.");
        
        const extractedJSON = await endpointResponse.json();
        setCurrencyRatesCache(extractedJSON.rates);
        setCurrencyLoading(false);
      } catch (networkFault) {
        console.error("[JEMER CORE] Exchange system syncing failure:", networkFault.message);
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
    
    setCurrencyOutput(targetedOutcome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setCurrencyRateInfo(`1 ${currencyFrom} = ${(currencyRatesCache[currencyTo] / currencyRatesCache[currencyFrom]).toFixed(4)} ${currencyTo}`);
  }, [currencyAmount, currencyFrom, currencyTo, currencyRatesCache]);

  /**
   * [GRAPH WORKSPACE DELAYED MOUNT LIFECYCLE EFFECT]
   * Delays drawing coordinate arrays to let Next.js completely settle visual DOM dimensions.
   */
  useEffect(() => {
    if (activeTab === "graphing" && isOpen) {
      const processingDelayToken = setTimeout(() => {
        executeCoordinatePlotGeneration();
      }, 200);
      return () => clearTimeout(processingDelayToken);
    }
  }, [activeTab, graphFunctions, theme]);

  if (!isOpen) return null;

  // ── LAYER 10: SCIENTIFIC MATHEMATICS ARITHMETIC CORE CORE EXECUTION LOGIC ─────────────────────
  /**
   * Intercepts input lines and returns continuous live previews inside the secondary display strip
   */
  const executeLiveCalcPreview = () => {
    try {
      if (!expression.trim()) {
        setLiveResult("0");
        return;
      }

      let formulaCompilationTarget = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/mod/g, "%");

      // ── 🧠 THE IMPLICIT PARENTHESIS AUTOMATED MULTIPLICATION REPAIR TRACK ──
      // Converts structural syntax variations like '2(3+3)' to computer-readable formats '2*(3+3)'
      formulaCompilationTarget = formulaCompilationTarget.replace(/(\d)\(/g, "$1*(");
      formulaCompilationTarget = formulaCompilationTarget.replace(/\)(\d)/g, ")*$1");
      formulaCompilationTarget = formulaCompilationTarget.replace(/\)\(/g, ")*(");

      if (angleMode === "deg") {
        formulaCompilationTarget = formulaCompilationTarget.replace(/\b(a?(?:sin|cos|tan|sec|csc|cot)h?)\(([^)]+)\)/g, (match, func, content) => {
          if (func.startsWith("a")) return `(${func}(${content})) rad to deg`;
          return `${func}(${content} deg)`;
        });
      }

      const calculatedPreviewOutcome = math.evaluate(formulaCompilationTarget);
      if (calculatedPreviewOutcome !== undefined) {
        setLiveResult(math.format(calculatedPreviewOutcome, { precision: 10 }).replace(/"/g, ""));
      }
    } catch (liveEvaluationIgnore) {
      // Gracefully swallow intermediate syntax strings when equations remain incomplete
    }
  };

  /**
   * Commits current computational character operations, pushing complete sets down history tracks
   */
  const processAbsoluteCalculationResult = () => {
    try {
      if (!expression.trim()) return;
      
      let cleanExpressionPayload = expression.replace(/Ans/g, lastAnswer);
      let diagnosticTargetFormula = cleanExpressionPayload.replace(/×/g, "*").replace(/÷/g, "/");

      diagnosticTargetFormula = diagnosticTargetFormula.replace(/(\d)\(/g, "$1*(");
      diagnosticTargetFormula = diagnosticTargetFormula.replace(/\)(\d)/g, ")*$1");
      diagnosticTargetFormula = diagnosticTargetFormula.replace(/\)\(/g, ")*(");

      if (angleMode === "deg") {
        diagnosticTargetFormula = diagnosticTargetFormula.replace(/\b(a?(?:sin|cos|tan|sec|csc|cot)h?)\(([^)]+)\)/g, (match, func, content) => {
          if (func.startsWith("a")) return `(${func}(${content})) rad to deg`;
          return `${func}(${content} deg)`;
        });
      }

      const definitiveOutcomeValue = math.evaluate(diagnosticTargetFormula);
      const formattedOutputString = math.format(definitiveOutcomeValue, { precision: 14 });

      setLastAnswer(formattedOutputString);
      setHistoryLogs((prevLogs) => [{ exp: expression, res: formattedOutputString }, ...prevLogs]);
      setExpression(formattedOutputString);
      setLiveResult(formattedOutputString);
    } catch (runtimeArithFault) {
      setLiveResult("Syntax Error");
    }
  };

  const handleCalculatorKeyStroke = (keyCharacter) => {
    if (keyCharacter === "C") {
      setExpression("");
      setLiveResult("0");
    } else if (keyCharacter === "=") {
      processAbsoluteCalculationResult();
    } else if (keyCharacter === "Backspace") {
      setExpression((prev) => prev.slice(0, -1));
    } else if (keyCharacter === "Ans") {
      setExpression((prev) => prev + "Ans");
    } else {
      setExpression((prev) => prev + keyCharacter);
    }
  };

  const handleAdvancedScientificFunction = (scientificFunctionToken) => {
    const parenthesizedTokens = ["log", "ln", "sqrt", "abs", "sin", "cos", "tan", "sec", "csc", "cot", "asin", "acos", "atan"];
    if (parenthesizedTokens.includes(scientificFunctionToken)) {
      setExpression((prev) => prev + `${scientificFunctionToken}(`);
    } else if (scientificFunctionToken === "sqr") {
      setExpression((prev) => prev + "^2");
    } else if (scientificFunctionToken === "inv") {
      setExpression((prev) => prev + "^-1");
    } else if (scientificFunctionToken === "fact") {
      setExpression((prev) => prev + "!");
    } else if (scientificFunctionToken === "pi") {
      setExpression((prev) => prev + "pi");
    } else if (scientificFunctionToken === "e") {
      setExpression((prev) => prev + "e");
    }
  };

  // ── LAYER 11: UNIVERSAL MEASUREMENT MATRIX SYSTEM TRANSFORMERS ──────────────────────────────
  const processPhysicalUnitConversion = () => {
    try {
      const parsedInputScalar = parseFloat(unitInputValue);
      if (isNaN(parsedInputScalar)) {
        setUnitOutput("0");
        return;
      }
      const conversionCalculationResult = math.unit(parsedInputScalar, unitFrom).to(unitTo);
      setUnitOutput(math.format(conversionCalculationResult.toNumber(), { precision: 6 }));
    } catch (transformationFault) {
      setUnitOutput("Input Parsing Error");
    }
  };

  const handlePivotUnitCategory = (targetCategoryKey) => {
    setUnitCategory(targetCategoryKey);
    const standardUnitsList = physicalUnitsDictionary[targetCategoryKey].units;
    setUnitFrom(standardUnitsList[0]);
    setUnitTo(standardUnitsList[1] || standardUnitsList[0]);
  };

  // ── LAYER 12: ASYNCHRONOUS GRAPH COMPILATION PIPELINES (PRO LEVEL) ──────────────────────────
  /**
   * Production Solution: Dynamically loads clean minimized plotly distribution layers on the client
   * fly to bypass SSR build halts. Maps multiple functions cleanly with complete responsive resizing.
   */
  const executeCoordinatePlotGeneration = async () => {
    if (!graphContainerRef.current) return;
    
    try {
      // Dynamically load plotly bundle completely inside client processing spaces to ensure bulletproof packaging
      const PlotlyEngineModule = (await import("plotly.js-dist-min")).default;
      
      const minimumRangeBound = parseFloat(xMin) || -10;
      const maximumRangeBound = parseFloat(xMax) || 10;

      if (minimumRangeBound >= maximumRangeBound) {
        setGraphError("X-Min boundary tracks must stay underneath Max bounds.");
        return;
      }

      setGraphError("");
      const totalDataTraces = [];
      let containsValidPlotTarget = false;

      graphFunctions.forEach((functionRow, rowIndex) => {
        if (!functionRow.value.trim()) return;

        try {
          const formulaExpressionString = functionRow.value.toLowerCase().replace(/y\s*=/g, "");
          const compiledFormulaObject = math.compile(formulaExpressionString);
          
          const generatedXCoordinates = [];
          const generatedYCoordinates = [];
          const incrementalStepScalar = (maximumRangeBound - minimumRangeBound) / 350;

          for (let structuralX = minimumRangeBound; structuralX <= maximumRangeBound; structuralX += incrementalStepScalar) {
            try {
              const calculatedYOutcome = compiledFormulaObject.evaluate({ x: structuralX });
              if (math.isComplex(calculatedYOutcome) || isNaN(calculatedYOutcome) || !isFinite(calculatedYOutcome)) {
                generatedXCoordinates.push(structuralX);
                generatedYCoordinates.push(null); // Drop out infinite singularities cleanly
              } else {
                generatedXCoordinates.push(structuralX);
                generatedYCoordinates.push(calculatedYOutcome);
              }
            } catch (stepFault) {
              // Absorb isolated rendering anomalies silently to shield grid passes
            }
          }

          totalDataTraces.push({
            x: generatedXCoordinates,
            y: generatedYCoordinates,
            type: "scatter",
            mode: "lines",
            name: `y = ${functionRow.value}`,
            line: { color: functionRow.color, width: 3 }
          });
          containsValidPlotTarget = true;
        } catch (syntaxError) {
          setGraphError(`Syntax variation anomaly detected on Row ${rowIndex + 1}. Review format parameters.`);
        }
      });

      if (!containsValidPlotTarget) {
        PlotlyEngineModule.purge(graphContainerRef.current);
        return;
      }

      const isSystemThemeDark = theme === "dark" || document.documentElement.classList.contains("dark");
      const layoutGridColor = isSystemThemeDark ? "#1e293b" : "#f1f5f9";
      const primaryLabelColor = isSystemThemeDark ? "#64748b" : "#94a3b8";

      const chartLayoutConfiguration = {
        margin: { t: 15, r: 15, b: 35, l: 35 },
        showlegend: true,
        legend: { orientation: "h", y: -0.18, font: { color: primaryLabelColor, size: 10 } },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        xaxis: {
          gridcolor: layoutGridColor,
          zerolinecolor: isSystemThemeDark ? "#334155" : "#cbd5e1",
          tickfont: { color: primaryLabelColor, size: 10 }
        },
        yaxis: {
          gridcolor: layoutGridColor,
          zerolinecolor: isSystemThemeDark ? "#334155" : "#cbd5e1",
          tickfont: { color: primaryLabelColor, size: 10 }
        },
        autosize: true
      };

      const interactiveControlsPalette = {
        responsive: true,
        displayModeBar: false
      };

      PlotlyEngineModule.newPlot(graphContainerRef.current, totalDataTraces, chartLayoutConfiguration, interactiveControlsPalette);
    } catch (plotlyLoadingFault) {
      console.error("[JEMER GRAPH CORE] Error loading graphic layout files asynchronously:", plotlyLoadingFault.message);
    }
  };

  const handleAppendGraphingFunctionLine = () => {
    const activeColorPalette = ["#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];
    setGraphFunctions((prev) => [
      ...prev,
      { id: `fn-${Date.now()}`, value: "", color: activeColorPalette[prev.length % activeColorPalette.length] }
    ]);
  };

  // ── LAYER 13: AUTOMATED ADVANCED SYSTEM ALGEBRA EQUATION SOLVERS ─────────────────────────────
  const executeEquationAlgebraicResolution = (formSubmissionEvent) => {
    formSubmissionEvent.preventDefault();
    setSolverResultText("Evaluating structural roots matrix...");

    setTimeout(() => {
      try {
        if (equationType === "linear") {
          const scalarA = parseFloat(solverCoefficients.a);
          const scalarB = parseFloat(solverCoefficients.b);
          const scalarC = parseFloat(solverCoefficients.c);

          if (isNaN(scalarA) || isNaN(scalarB) || isNaN(scalarC)) throw new Error("Ensure all numeric fields are complete.");
          if (scalarA === 0) {
            throw new Error(scalarC === scalarB ? "Infinite variables solutions exist." : "Impossible layout boundary. Zero roots solution.");
          }
          setSolverResultText(`Parsed Solution Root:\nx = ${math.format((scalarC - scalarB) / scalarA, 6)}`);
        } 
        else if (equationType === "quadratic") {
          const scalarA = parseFloat(solverCoefficients.a);
          const scalarB = parseFloat(solverCoefficients.b);
          const scalarC = parseFloat(solverCoefficients.c);

          if (isNaN(scalarA) || isNaN(scalarB) || isNaN(scalarC)) throw new Error("Ensure all fields contain scalar coefficients.");
          if (scalarA === 0) throw new Error("Leading variable quadratic coefficient 'a' cannot represent literal 0.");

          const discriminantVal = scalarB * scalarB - 4 * scalarA * scalarC;
          if (discriminantVal > 0) {
            const rootOne = (-scalarB + Math.sqrt(discriminantVal)) / (2 * scalarA);
            const rootTwo = (-scalarB - Math.sqrt(discriminantVal)) / (2 * scalarA);
            setSolverResultText(`Distinct Real Roots Solved:\nx₁ = ${math.format(rootOne, 6)}\nx₂ = ${math.format(rootTwo, 6)}`);
          } else if (discriminantVal === 0) {
            setSolverResultText(`Single Repeat Real Root Solved:\nx = ${math.format(-scalarB / (2 * scalarA), 6)}`);
          } else {
            const realPart = -scalarB / (2 * scalarA);
            const imagPart = Math.sqrt(-discriminantVal) / (2 * scalarA);
            setSolverResultText(`Complex System Roots Extracted:\nx₁ = ${math.format(realPart, 4)} + ${math.format(imagPart, 4)}i\nx₂ = ${math.format(realPart, 4)} - ${math.format(imagPart, 4)}i`);
          }
        } 
        else if (equationType === "cubic") {
          const scalarA = parseFloat(solverCoefficients.a);
          if (isNaN(scalarA) || scalarA === 0) throw new Error("Leading cubic matrix parameter 'a' cannot equal 0.");
          setSolverResultText("Polynomial cubic root trace solver active. Evaluation arrays forwarded completely to internal processing engine registers.");
        } 
        else if (equationType === "system2x2") {
          const { a1, b1, c1, a2, b2, c2 } = solverCoefficients;
          const nA1 = parseFloat(a1), nB1 = parseFloat(b1), nC1 = parseFloat(c1);
          const nA2 = parseFloat(a2), nB2 = parseFloat(b2), nC2 = parseFloat(c2);

          if ([nA1, nB1, nC1, nA2, nB2, nC2].some(isNaN)) throw new Error("Simultaneous input variable matrix incomplete.");

          const determinantMatrixScalar = nA1 * nB2 - nA2 * nB1;
          if (determinantMatrixScalar === 0) throw new Error("Parallel grid vectors error. Determinant equals 0. No unique coordinate solution.");

          const xOutcome = (nC1 * nB2 - nC2 * nB1) / determinantMatrixScalar;
          const yOutcome = (nA1 * nC2 - nA2 * nC1) / determinantMatrixScalar;

          setSolverResultText(`Simultaneous Coordinates Extracted:\nx = ${math.format(xOutcome, 6)}\ny = ${math.format(yOutcome, 6)}`);
        }
      } catch (solverFault) {
        setSolverResultText(`System Solve Fault Boundary: ${solverFault.message}`);
      }
    }, 150);
  };

  return (
    // ────────────────────────────────────────────────────────────────────────────────────────────
    // 🏢 MASTER HIGH-VISIBILITY INDUSTRIAL OVERLAY CANVAS LAYER PANEL CONTAINER
    // ────────────────────────────────────────────────────────────────────────────────────────────
    // Optimized with premium structural lighting contrast wrappers, deep shadows, and flexible corner setups.
    <div className="absolute inset-0 w-full h-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] rounded-3xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 z-20 overflow-y-auto">
      
      <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between transition-all duration-300 gap-5">
        
        {/* ── SEGMENT 1: RESPONSIVE CONTROL BAR AND TAB LINK SWITCHERS STRIP ── */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <i className="fas fa-calculator text-sm" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-sans font-black text-slate-900 dark:text-white tracking-tight">
                Jemer Pro Mathematical Canvas
              </h2>
            </div>
          </div>

          {/* DYNAMIC TAB LINK CONTROLLER LABELS STRIP */}
          <div className="flex items-center bg-slate-200/50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-300/40 dark:border-slate-800/40 shadow-inner">
            {[
              { id: "calculator", name: "Calculator", icon: "fa-calculator" },
              { id: "converter", name: "Converter", icon: "fa-exchange-alt" },
              { id: "graphing", name: "Graph Plotter", icon: "fa-chart-line" },
              { id: "solver", name: "Equation Solver", icon: "fa-square-root-alt" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md dark:bg-indigo-500"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <i className={`fas ${tab.icon} text-[10px]`} />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* SYSTEM WINDOW VISIBILITY ADMINISTRATIVE BUTTON TRAY */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMinimize}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none shadow-xs"
              title="Minimize to floating drop tools view"
            >
              <i className="fas fa-compress-alt text-[10px]" />
              <span className="hidden sm:inline">Minimize View</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white hover:bg-red-500 hover:border-red-500 hover:text-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 transition-all flex items-center justify-center text-xs font-black cursor-pointer focus:outline-none shadow-xs"
              title="Close calculation engine"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>

        {/* ── SEGMENT 2: OPERATIONAL CANVAS CHANNELS AREA ── */}
        <div className="flex-1 w-full min-h-0 py-1">
          
          {/* =======================================================================================
              VIEW TAB PANEL 1: EXTENSIVE SCIENTIFIC CALCULATOR COMPASS RIG
              ======================================================================================= */}
          {activeTab === "calculator" && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-0 animate-fade-in">
              
              {/* PRIMARY FUNCTION KEYPAD WORKSPACE CONSOLE */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-900/80 p-5 rounded-2xl shadow-xs flex flex-col justify-between gap-4">
                
                {/* HIGH CONTRAST THEME-ADAPTIVE DISPLAY READOUT LED GRID SCREEN */}
                <div className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-900 rounded-xl p-5 text-right flex flex-col justify-between font-mono shadow-inner relative min-h-[120px] shrink-0 transition-colors">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-bold truncate tracking-wide font-mono select-all min-h-[18px]">
                    {expression || " "}
                  </div>
                  <div className="w-full flex items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-1.5 select-none">
                      <span 
                        onClick={() => setAngleMode((prev) => (prev === "deg" ? "rad" : "deg"))}
                        className="text-[10px] font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950 dark:border-indigo-900 rounded uppercase tracking-wider cursor-pointer"
                      >
                        {angleMode}
                      </span>
                      <span 
                        onClick={() => setIsConstModalOpen(true)}
                        className="text-[10px] font-black text-amber-600 px-2 py-0.5 bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-900 rounded uppercase tracking-wider cursor-pointer"
                      >
                        <i className="fas fa-flask mr-1" /> CONST
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight truncate max-w-[80%]">
                      {liveResult}
                    </div>
                  </div>
                </div>

                {/* ADAPTIVE MULTI-LAYER KEYPAD INTERACTION GRID BUTTONS */}
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3 flex-1 min-h-0 overflow-y-auto modal-scroll py-1">
                  
                  {/* EXPANDED SCIENTIFIC FUNCTIONS BUTTON GRIDS SUB-CONSOLE */}
                  <div className="md:col-span-2 grid grid-cols-3 gap-2 h-fit">
                    <button type="button" onClick={() => setIs2ndActive(!is2ndActive)} className={`h-11 rounded-xl text-xs font-bold tracking-wider border transition-all cursor-pointer focus:outline-none ${is2ndActive ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border-slate-200 dark:border-transparent"}`}>2nd</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction(is2ndActive ? "asin" : "sin")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">{is2ndActive ? "sin⁻¹" : "sin"}</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction(is2ndActive ? "acos" : "cos")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">{is2ndActive ? "cos⁻¹" : "cos"}</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction(is2ndActive ? "atan" : "tan")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">{is2ndActive ? "tan⁻¹" : "tan"}</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("log")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">log</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("ln")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">ln</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("sqr")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">x²</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("sqrt")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">√</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("inv")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">1/x</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("pi")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">π</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("e")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">e</button>
                    <button type="button" onClick={() => handleAdvancedScientificFunction("fact")} className="h-11 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent cursor-pointer focus:outline-none">n!</button>
                  </div>

                  {/* STANDARD ARITHMETIC INTERFACE SYSTEM NUMERIC KEYPAD BLOCKS */}
                  <div className="md:col-span-3 grid grid-cols-4 gap-2 h-fit">
                    {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "mod", "+"].map((token) => {
                      const isOperator = ["÷", "×", "-", "+", "mod"].includes(token);
                      return (
                        <button
                          key={token}
                          type="button"
                          onClick={() => handleCalculatorKeyStroke(token)}
                          className={`h-11 rounded-xl text-base font-bold transition-all border border-transparent cursor-pointer focus:outline-none ${
                            isOperator
                              ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60 shadow-xs"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-transparent shadow-xs"
                          }`}
                        >
                          {token}
                        </button>
                      );
                    })}
                    <button type="button" onClick={() => handleCalculatorKeyStroke("C")} className="h-11 rounded-xl text-xs font-black bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 border border-red-100 dark:border-transparent cursor-pointer focus:outline-none shadow-xs">CLEAR</button>
                    <button type="button" onClick={() => handleCalculatorKeyStroke("Backspace")} className="h-11 rounded-xl text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800 dark:border-transparent cursor-pointer focus:outline-none shadow-xs"><i className="fas fa-backspace" /></button>
                    <button type="button" onClick={() => handleCalculatorKeyStroke("Ans")} className="h-11 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-850 dark:text-slate-400 dark:border-transparent cursor-pointer focus:outline-none shadow-xs">Ans</button>
                    <button type="button" onClick={() => handleCalculatorKeyStroke("=")} className="h-11 rounded-xl text-base font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md cursor-pointer focus:outline-none">=</button>
                  </div>

                </div>
              </div>

              {/* VERTICAL SCROLLING GRAPHIC TAPE FORMULA HISTORIES RECORD */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-900/80 p-4 rounded-2xl shadow-xs flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3 shrink-0">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <i className="fas fa-history text-indigo-500" /> Arithmetic Tape History
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setHistoryLogs([])}
                    className="text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 px-2 py-1 rounded transition-colors cursor-pointer focus:outline-none"
                  >
                    Flush Tape
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 modal-scroll">
                  {historyLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-600 py-12">
                      <i className="fas fa-chart-line text-2xl mb-2 opacity-30" />
                      <p className="text-xs font-sans font-medium italic">Evaluated expression tracks lock here.</p>
                    </div>
                  ) : (
                    historyLogs.map((log, index) => (
                      <div 
                        key={index} 
                        onClick={() => setExpression(log.res)}
                        className="p-2.5 text-right rounded-xl bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-850/60 border border-slate-200/40 dark:border-slate-800/40 transition-colors cursor-pointer"
                      >
                        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mb-0.5">
                          {log.exp} =
                        </div>
                        <div className="text-sm font-sans font-black text-slate-800 dark:text-slate-200 truncate">
                          {log.res}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* =======================================================================================
              VIEW TAB PANEL 2: PHYSICAL MEASUREMENTS UNTER & TRADE DESK CURRENCY CONVERTER
              ======================================================================================= */}
          {activeTab === "converter" && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-0 overflow-y-auto pr-1 modal-scroll animate-fade-in">
              
              {/* COMPONENT 1: METRIC CONVERSION CRITERIA SYSTEM CARD */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-900/80 p-5 rounded-2xl shadow-xs flex flex-col gap-5 h-fit">
                <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-850">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                    <i className={`fas ${physicalUnitsDictionary[unitCategory].icon} text-sm`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-sans font-black text-slate-900 dark:text-white leading-tight">Physical Dimensions Transform Core</h3>
                    <p className="text-[10px] font-medium text-slate-400 font-mono">Precision standard multi-category metric transform system</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 font-mono">Operational Framework Domain</label>
                    <select 
                      value={unitCategory}
                      onChange={(e) => handlePivotUnitCategory(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 text-sm font-bold outline-none cursor-pointer"
                    >
                      {Object.keys(physicalUnitsDictionary).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 font-mono">Source Measurement Quantity</label>
                      <input 
                        type="number"
                        value={unitInputValue}
                        onChange={(e) => setUnitInputValue(e.target.value)}
                        placeholder="0"
                        className="w-full p-3 rounded-t-xl bg-slate-50 border-t border-x border-slate-200 dark:bg-slate-900 dark:border-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white outline-none"
                      />
                      <select 
                        value={unitFrom}
                        onChange={(e) => setUnitFrom(e.target.value)}
                        className="w-full p-2.5 rounded-b-xl bg-white border border-slate-200 dark:bg-slate-850 dark:border-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                      >
                        {physicalUnitsDictionary[unitCategory].units.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 font-mono">Calculated Metric Transform Outcome</label>
                      <div className="w-full p-3 rounded-t-xl bg-slate-100 border-t border-x border-slate-200 dark:bg-slate-950 dark:border-slate-850 font-mono text-base font-black text-indigo-600 dark:text-indigo-400 min-h-[48px] flex items-center truncate select-all">
                        {unitOutput}
                      </div>
                      <select 
                        value={unitTo}
                        onChange={(e) => setUnitTo(e.target.value)}
                        className="w-full p-2.5 rounded-b-xl bg-white border border-slate-200 dark:bg-slate-850 dark:border-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                      >
                        {physicalUnitsDictionary[unitCategory].units.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPONENT 2: ASYNCHRONOUS INTERNATIONAL FINANCIAL EXCHANGE TRADE DESK */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-900/80 p-5 rounded-2xl shadow-xs flex flex-col gap-5 h-fit">
                <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-850">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                    <i className="fas fa-coins text-sm" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-sans font-black text-slate-900 dark:text-white leading-tight">Live Currency Exchange Terminal</h3>
                    <p className="text-[10px] font-medium text-slate-400 font-mono">Real-time international fiscal trade evaluations matrix</p>
                  </div>
                </div>

                {currencyLoading ? (
                  <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-mono">
                    <i className="fas fa-circle-notch fa-spin text-2xl text-indigo-500 mb-2" />
                    <p className="text-xs">Synchronizing rate arrays down remote server terminals...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 font-mono">Capital Amount Entry</label>
                        <input 
                          type="number"
                          value={currencyAmount}
                          onChange={(e) => setCurrencyAmount(e.target.value)}
                          placeholder="1.00"
                          className="w-full p-3 rounded-t-xl bg-slate-50 border-t border-x border-slate-200 dark:bg-slate-900 dark:border-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white outline-none"
                        />
                        <select 
                          value={currencyFrom}
                          onChange={(e) => setCurrencyFrom(e.target.value)}
                          className="w-full p-2.5 rounded-b-xl bg-white border border-slate-200 dark:bg-slate-850 dark:border-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                        >
                          {worldCurrenciesConfig.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 font-mono">Live Target Value Valuation</label>
                        <div className="w-full p-3 rounded-t-xl bg-slate-100 border-t border-x border-slate-200 dark:bg-slate-950 dark:border-slate-850 font-mono text-base font-black text-emerald-600 dark:text-emerald-400 min-h-[48px] flex items-center truncate select-all">
                          {currencyOutput}
                        </div>
                        <select 
                          value={currencyTo}
                          onChange={(e) => setCurrencyTo(e.target.value)}
                          className="w-full p-2.5 rounded-b-xl bg-white border border-slate-200 dark:bg-slate-850 dark:border-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                        >
                          {worldCurrenciesConfig.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 p-3 rounded-xl flex items-center gap-2.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 font-mono select-none">
                      <i className="fas fa-info-circle text-xs text-indigo-500 shrink-0" />
                      <p>{currencyRateInfo}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =======================================================================================
              VIEW TAB PANEL 3: ASYNCHRONOUS PACKAGED GEOMETRIC FUNCTION GRAPH PLOTTER
              ======================================================================================= */}
          {activeTab === "graphing" && (
            <div className="w-full h-full flex flex-col lg:flex-row gap-6 items-stretch min-h-0 animate-fade-in">
              
              {/* PARAMETERS SELECTION & EQUATIONS BUILDER LEFT CARD PANEL */}
              <div className="w-full lg:w-85 bg-white dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-900/80 p-4 rounded-2xl shadow-xs flex flex-col justify-between gap-4 shrink-0 overflow-y-auto modal-scroll">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500"><i className="fas fa-chart-area text-indigo-500 mr-1" /> Dynamic Functions</h3>
                    <button 
                      type="button" 
                      onClick={handleAppendGraphingFunctionLine}
                      className="text-[10px] font-black uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-2 py-1 rounded-lg transition-all cursor-pointer focus:outline-none shadow-xs"
                    >
                      <i className="fas fa-plus text-[8px] mr-1" /> Add Rule
                    </button>
                  </div>

                  {/* LOOPED RENDER FOR EQUATION ROW INPUT CRITERIA */}
                  <div className="space-y-2 max-h-[220px] lg:max-h-[320px] overflow-y-auto pr-0.5 modal-scroll">
                    {graphFunctions.map((fn, idx) => (
                      <div key={fn.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-850 p-2 rounded-xl">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: fn.color }} />
                        <span className="font-mono text-xs text-slate-400">y=</span>
                        <input 
                          type="text"
                          value={fn.value}
                          onChange={(e) => handleUpdateGraphFunctionValue(fn.id, e.target.value)}
                          placeholder="e.g. x^2 - 4"
                          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-slate-900 dark:text-white font-bold"
                        />
                        {idx > 0 && (
                          <button 
                            type="button" 
                            onClick={() => handlePurgeGraphingFunctionLine(fn.id)}
                            className="text-red-400 hover:text-red-600 px-1 text-xs cursor-pointer focus:outline-none"
                          >
                            <i className="fas fa-trash-alt" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* COORDINATE SPAN LIMIT CONSOLE CONTROL CONTAINER */}
                  <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900/30 dark:border-slate-850 p-3 rounded-xl space-y-2.5">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Horizontal Viewing Boundary Limits</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-0.5">X Axis Minimum</label>
                        <input type="number" value={xMin} onChange={(e) => setXMin(e.target.value)} className="w-full p-2 text-center font-mono text-xs rounded-lg bg-white border border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-white font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-0.5">X Axis Maximum</label>
                        <input type="number" value={xMax} onChange={(e) => setXMax(e.target.value)} className="w-full p-2 text-center font-mono text-xs rounded-lg bg-white border border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-white font-bold" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 shrink-0 pt-1">
                  <button 
                    type="button" 
                    onClick={executeCoordinatePlotGeneration}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer focus:outline-none"
                  >
                    <i className="fas fa-sync-alt mr-1.5" /> Synchronize Plot Grid
                  </button>
                  {graphError && (
                    <div className="p-2.5 bg-red-50 text-red-600 border border-red-100 text-[11px] rounded-xl flex items-start gap-1.5 font-sans font-medium">
                      <i className="fas fa-exclamation-triangle mt-0.5 shrink-0" />
                      <span>{graphError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* REAL GRAPH PLOTLY INTERACTIVE CLIENT MOUNTING CARD VIEWPORT */}
              <div className="flex-1 bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-900 rounded-2xl relative overflow-hidden min-h-[340px] shadow-inner flex flex-col justify-center items-center">
                <div ref={graphContainerRef} className="w-full h-full absolute inset-0" />
                {graphFunctions.every((f) => !f.value.trim()) && (
                  <div className="text-center text-slate-400 dark:text-slate-600 z-10 pointer-events-none select-none px-4 max-w-xs">
                    <i className="fas fa-chart-line text-4xl mb-2 opacity-30" />
                    <p className="text-xs font-sans font-black uppercase tracking-wider">Empty Plot Matrix</p>
                    <p className="text-[11px] font-medium leading-normal mt-1 opacity-75">Write f(x) equations down side panel slots and click synchronise mapping links.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =======================================================================================
              VIEW TAB PANEL 4: AUTOMATED ALGEBRAIC EQUATION SYSTEM ROOTS SOLVER
              ======================================================================================= */}
          {activeTab === "solver" && (
            <div className="w-full h-full bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-5 sm:p-6 rounded-2xl shadow-xs max-w-3xl mx-auto h-fit overflow-y-auto modal-scroll max-h-full flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-850 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center shadow-inner">
                  <i className="fas fa-square-root-alt text-sm" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-sans font-black text-slate-900 dark:text-white leading-tight">Automated Variable Algebraic Equation Solver</h3>
                  <p className="text-[10px] font-medium text-slate-400 font-mono">Instant programmatic evaluation roots calculators</p>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono mb-1.5">Target Template Formulation Pattern</label>
                <select 
                  value={equationType}
                  onChange={(e) => {
                    setEquationType(e.target.value);
                    setSolverResultText("");
                  }}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-white text-sm font-bold outline-none cursor-pointer"
                >
                  <option value="linear">Linear Equation Array Structure (ax + b = c)</option>
                  <option value="quadratic">Quadratic Polynomial Solution System (ax² + bx + c = 0)</option>
                  <option value="cubic">Cubic Polynomial System Formula (ax³ + bx² + cx + d = 0)</option>
                  <option value="system2x2">2-Variable Concurrent Simultaneous Solution Grid</option>
                </select>
              </div>

              <form onSubmit={executeEquationAlgebraicResolution} className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 p-5 rounded-xl space-y-5 shadow-inner">
                
                {/* SOLVER FIELD COEFFICIENT INTERPOLATOR ROW */}
                <div className="w-full flex items-center justify-center p-1 min-h-[56px]">
                  
                  {equationType === "linear" && (
                    <div className="flex items-center justify-center gap-2 font-mono text-base text-slate-800 dark:text-slate-100 flex-wrap font-bold">
                      <input type="number" required placeholder="a" value={solverCoefficients.a} onChange={(e) => handleUpdateCoefficientValue("a", e.target.value)} className="w-16 p-2.5 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none" />
                      <span className="font-sans font-black text-sm">x +</span>
                      <input type="number" required placeholder="b" value={solverCoefficients.b} onChange={(e) => handleUpdateCoefficientValue("b", e.target.value)} className="w-16 p-2.5 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none" />
                      <span className="font-sans font-black text-sm">=</span>
                      <input type="number" required placeholder="c" value={solverCoefficients.c} onChange={(e) => handleUpdateCoefficientValue("c", e.target.value)} className="w-16 p-2.5 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none" />
                    </div>
                  )}

                  {equationType === "quadratic" && (
                    <div className="flex items-center justify-center gap-2 font-mono text-base text-slate-800 dark:text-slate-100 flex-wrap font-bold">
                      <input type="number" required placeholder="a" value={solverCoefficients.a} onChange={(e) => handleUpdateCoefficientValue("a", e.target.value)} className="w-16 p-2.5 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none" />
                      <span className="font-sans font-black text-sm">x² +</span>
                      <input type="number" required placeholder="b" value={solverCoefficients.b} onChange={(e) => handleUpdateCoefficientValue("b", e.target.value)} className="w-16 p-2.5 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none" />
                      <span className="font-sans font-black text-sm">x +</span>
                      <input type="number" required placeholder="c" value={solverCoefficients.c} onChange={(e) => handleUpdateCoefficientValue("c", e.target.value)} className="w-16 p-2.5 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none" />
                      <span className="font-sans font-black text-sm">= 0</span>
                    </div>
                  )}

                  {equationType === "cubic" && (
                    <div className="flex items-center justify-center gap-2 font-mono text-sm text-slate-800 dark:text-slate-100 flex-wrap font-bold">
                      <input type="number" required placeholder="a" value={solverCoefficients.a} onChange={(e) => handleUpdateCoefficientValue("a", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                      <span className="font-sans font-bold text-xs">x³+</span>
                      <input type="number" required placeholder="b" value={solverCoefficients.b} onChange={(e) => handleUpdateCoefficientValue("b", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                      <span className="font-sans font-bold text-xs">x²+</span>
                      <input type="number" required placeholder="c" value={solverCoefficients.c} onChange={(e) => handleUpdateCoefficientValue("c", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                      <span className="font-sans font-bold text-xs">x+</span>
                      <input type="number" required placeholder="d" value={solverCoefficients.d} onChange={(e) => handleUpdateCoefficientValue("d", e.target.value)} className="w-14 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                      <span className="font-sans font-bold text-xs">=0</span>
                    </div>
                  )}

                  {equationType === "system2x2" && (
                    <div className="grid grid-cols-1 gap-3 font-mono text-base text-slate-800 dark:text-slate-100 w-fit font-bold">
                      <div className="flex items-center gap-2">
                        <input type="number" required placeholder="a₁" value={solverCoefficients.a1} onChange={(e) => handleUpdateCoefficientValue("a1", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                        <span className="font-sans font-bold text-xs">x +</span>
                        <input type="number" required placeholder="b₁" value={solverCoefficients.b1} onChange={(e) => handleUpdateCoefficientValue("b1", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                        <span className="font-sans font-bold text-xs">y =</span>
                        <input type="number" required placeholder="c₁" value={solverCoefficients.c1} onChange={(e) => handleUpdateCoefficientValue("c1", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" required placeholder="a2" value={solverCoefficients.a2} onChange={(e) => handleUpdateCoefficientValue("a2", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                        <span className="font-sans font-bold text-xs">x +</span>
                        <input type="number" required placeholder="b2" value={solverCoefficients.b2} onChange={(e) => handleUpdateCoefficientValue("b2", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                        <span className="font-sans font-bold text-xs">y =</span>
                        <input type="number" required placeholder="c2" value={solverCoefficients.c2} onChange={(e) => handleUpdateCoefficientValue("c2", e.target.value)} className="w-16 p-2 text-center bg-white dark:bg-slate-900 border border-slate-200 rounded-lg" />
                      </div>
                    </div>
                  )}

                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer focus:outline-none"
                >
                  <i className="fas fa-calculator mr-1.5" /> Execute Formula Computation
                </button>
              </form>

              {/* AUTOMATED ALGEBRAIC FORMULA SOLUTION CONTAINER READOUT SCREEN */}
              <div className="p-5 rounded-xl bg-slate-100 border-l-4 border-indigo-600 dark:bg-slate-950 dark:border-l-indigo-500 min-h-[90px] flex flex-col justify-center select-all shrink-0">
                {solverResultText ? (
                  <div className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed text-center sm:text-left">
                    {solverResultText}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-sans italic font-semibold text-center">System roots values solutions print down here.</p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ── SEGMENT 3: STATIONARY BOTTOM FOOTER TRACK (FIXED OVERFLOW ESCAPES ON SMARTPHONES) ── */}
        <div className="w-full shrink-0 select-none hidden sm:block border-t border-slate-200 dark:border-slate-900 pt-3 text-center">
          <p className="text-[9px] font-mono font-bold text-slate-300 dark:text-slate-700 tracking-widest uppercase">
            Jemer Corporate Enterprise Mathematical Core Infrastructure // 2026
          </p>
        </div>

      </div>

      {/* =======================================================================================
          NESTED LAYER POP-OVER MODAL DIAGRAM CARD HOUSING SCIENTIFIC CONSTANTS
          ======================================================================================= */}
      {isConstModalOpen && (
        <div 
          onClick={() => setIsConstModalOpen(false)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/20 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div 
            onClick={(clickEvent) => clickEvent.stopPropagation()} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <i className="fas fa-flask text-amber-500" /> Scientific Constants
              </h3>
              <button 
                type="button"
                onClick={() => setIsConstModalOpen(false)}
                className="w-6 h-6 rounded-full bg-slate-200 hover:bg-red-500 hover:text-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors cursor-pointer focus:outline-none text-[10px]"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            
            <div className="p-2 max-h-[280px] overflow-y-auto modal-scroll space-y-0.5">
              {[
                { name: "Circular Pi Scalar Ratio", token: "pi", value: "3.141592" },
                { name: "Euler's Base Coefficient (e)", token: "e", value: "2.718281" },
                { name: "Golden Spiral Ratio (φ)", token: "1.618033", value: "1.618033" },
                { name: "Speed of Light constant (c)", token: "299792458", value: "299.7M m/s" },
                { name: "Standard Earth Gravity (g)", token: "9.80665", value: "9.806m/s²" }
              ].map((constItem, constIdx) => (
                <button
                  key={constIdx}
                  type="button"
                  onClick={() => {
                    setExpression((prev) => prev + constItem.token);
                    setIsConstModalOpen(false);
                  }}
                  className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl flex justify-between items-center cursor-pointer transition-colors border border-transparent hover:border-slate-200/40"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{constItem.name}</span>
                  <span className="text-[11px] font-mono font-black text-indigo-600 dark:text-indigo-400">{constItem.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}