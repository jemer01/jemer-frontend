/**
 * ========================================================================
 * 🧠 JEMER ACADEMY LANDING ENGINE PLATFORM ORCHESTRATION LAYER (V2.2)
 * ========================================================================
 * Description: Client-side router, geolocation processing engine, financial
 * forex calculator, and UI interactions architecture.
 * Standards: Production hardened, clean dependency execution loop paths.
 * Fixes: Resolved Three.js execution context inside decoupled script files.
 * ========================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. GLOBAL ENVIRONMENT ENGINES & CONSTANTS
  // ==========================================================================
  const UNIRATE_KEY = "2XP1aQYZknjq4dtLZzSOQAwLcW6A6YVQHA82y5vbDXNo3kA77SnZ4jixqmT731SQ";
  const CACHE_DURATION = 8 * 60 * 60 * 1000; // Fixed 8-hour client local cache TTL layer
  const FLW_SUPPORTED = ["GBP", "CAD", "XAF", "XOF", "GHS", "KES", "NGN", "RWF", "SLL", "ZAR", "TZS", "UGX", "USD", "ZMW", "EUR"];

  // ==========================================================================
  // 2. REGIONAL COPY ARCHITECTURE MAPS (GLOBALIZATION REFACTORING ENGINE)
  // ==========================================================================
  const GEO_CONFIGS = {
    US: {
      pill: "North American AI Learning Platform",
      heroBase: "Master Every",
      heroTarget: "SAT & AP Topic.",
      heroPara: "Shatter expectations. From Ivy League configurations to advanced specialized high school diagnostics, our customized AI Tutor systems and Vid2Notes transcript tools help American students learn 10x faster.",
      conversionSub: "American high school and college students maximize their target GPA metrics within just 30 days.",
      matrixCurriculum: "SAT, AP, & CollegeBoard Adaptive AI Fine-Tuning Arrays",
      faqTitle: "Is Jemer Academy calibrated precisely for CollegeBoard SAT and Advanced Placement standards?",
      faqCopy: "Absolutely. The system uses specific vector configurations tailored directly to North American educational rubrics, ensuring you train directly against expected exam questions.",
      mobileWidget: "SAT Scoring Diagnostic Active",
      badges: [
        { icon: "fa-graduation-cap", name: "SAT PREP" },
        { icon: "fa-book", name: "ADVANCED PLACEMENT" },
        { icon: "fa-university", name: "COLLEGEBOARD" },
        { icon: "fa-award", name: "ACT ASSESSMENT" },
        { icon: "fa-certificate", name: "IB CERTIFICATION" }
      ],
      testimonials: [
        { text: "Snap-to-Solve explains concepts better than my private tutor. It maps out steps perfectly for my AP Physics assignments.", user: "Michael T.", locale: "Texas, USA" },
        { text: "The SAT exam simulator environment matches the digital adaptive format flawlessly. Scored a 1560 on my actual test!", user: "Brittany S.", locale: "Boston, USA" },
        { text: "Vid2Notes is saving my life in undergraduate chemistry. I feed long video lectures into it and get pristine guides immediately.", user: "David L.", locale: "California, USA" }
      ]
    },
    GB: {
      pill: "United Kingdom AI Learning Platform",
      heroBase: "Master Every",
      heroTarget: "IGCSE & A-Level Topic.",
      heroPara: "Unlock premium academic scores. Tailored directly for British curriculum systems, our adaptive high-performance AI engines convert complex tutorials into structured study materials seamlessly.",
      conversionSub: "UK students break top grading curves across Oxford, Cambridge, and local standard benchmarks inside 30 days.",
      matrixCurriculum: "Cambridge, Edexcel, & Pearson Curriculum AI Fine-Tuning Arrays",
      faqTitle: "Are the study systems optimized for IGCSE, GCSE, and A-Level testing tracks?",
      faqCopy: "Yes. The front-facing engine dynamically pulls localized database material containing deep past question sets for Edexcel, Cambridge International, and AQA assessment modules.",
      mobileWidget: "A-Level Tracking Module Engaged",
      badges: [
        { icon: "fa-globe-europe", name: "CAMBRIDGE INT" },
        { icon: "fa-certificate", name: "IGCSE EXAMS" },
        { icon: "fa-shapes", name: "PEARSON EDEXCEL" },
        { icon: "fa-graduation-cap", name: "A-LEVEL METRICS" },
        { icon: "fa-book-open", name: "AQA MATRIX" }
      ],
      testimonials: [
        { text: "The IGCSE simulator is actually harder than the real exams, which made the final testing routine feel straightforward. Got top marks in Advanced Math!", user: "Sarah Jenkins", locale: "London, UK" },
        { text: "Vid2Notes cut down my study layout creation time by 80%. Absolute game changer for my A-Level revisions.", user: "James O.", locale: "Manchester, UK" },
        { text: "Incredible interface optimization on my tablet device. The AI responses load instantaneously.", user: "Emma W.", locale: "Edinburgh, UK" }
      ]
    },
    EU: {
      pill: "European Digital Intelligence Platform",
      heroBase: "Master Any",
      heroTarget: "IB & Matric Topic.",
      heroPara: "The premium cognitive architecture for European learners. Navigate complex multilingual or universal curricula effortlessly with 24/7 dedicated AI study processing paths.",
      conversionSub: "European Baccalaureate and high-tier learners optimize validation performance checks within 30 days.",
      matrixCurriculum: "International Baccalaureate & Bologna Accord AI Fine-Tuning Arrays",
      faqTitle: "Does the processing system recognize multiple European language parameters?",
      faqCopy: "Yes. Our natural language translation structures accommodate semantic context patterns seamlessly across primary European languages, matching regional curriculum outlines.",
      mobileWidget: "IB Baccalaureate Metrics Armed",
      badges: [
        { icon: "fa-globe-europe", name: "EUROPEAN BACCALAUREATE" },
        { icon: "fa-certificate", name: "INTERNATIONAL BACCALAUREATE" },
        { icon: "fa-university", name: "BOLOGNA ALIGNED" },
        { icon: "fa-graduation-cap", name: "MATRIC EXAM TRACKS" }
      ],
      testimonials: [
        { text: "Jemer Academy maps out international curriculum structures seamlessly. It's an indispensable addition to my daily learning toolchain.", user: "Elena R.", locale: "Madrid, Spain" },
        { text: "Perfect cross-device execution. The responsive formatting allows me to seamlessly transition from my laptop to my foldable phone.", user: "Lucas M.", locale: "Berlin, Germany" },
        { text: "Exceptional speed. The localized server response loops keep the chat interface executing with zero latency lag.", user: "Chloe B.", locale: "Paris, France" }
      ]
    },
    NG: {
      pill: "Premium Nigerian AI Learning Platform",
      heroBase: "Master Any",
      heroTarget: "JAMB, WAEC & NECO Topic.",
      heroPara: "Pass your exams in a single sitting with a 100% guarantee. Use our real timed Computer Based Test (CBT) simulator and state-of-the-art Vid2Notes processing system to scale your scores instantly.",
      conversionSub: "Nigerian students secure straightforward straight-A parallel grades within 30 days of standard operations.",
      matrixCurriculum: "JAMB CBT, WAEC Past Questions, & NECO AI Fine-Tuning Arrays",
      faqTitle: "Is Jemer Academy calibrated precisely for WAEC, NECO, and JAMB CBT specifications?",
      faqCopy: "Absolutely. The database features over 50,000 highly verified past questions directly supporting accurate Nigerian curriculum guidelines, mapping exact software interfaces used in standard examinations.",
      mobileWidget: "JAMB CBT Simulator Armed",
      badges: [
        { icon: "fa-book-reader", name: "WAEC CORE MATRIX" },
        { icon: "fa-university", name: "JAMB CBT PORTAL" },
        { icon: "fa-certificate", name: "NECO CERTIFICATION" },
        { icon: "fa-graduation-cap", name: "POST-UTME PIPELINES" }
      ],
      testimonials: [
        { text: "I applied Vid2Notes directly to my lecture recordings and saved hours of manual writing. Jemer is hands down the best platform.", user: "Anthony K.", locale: "Lagos, Nigeria" },
        { text: "The JAMB CBT simulator interface operates exactly like the real computer exam setup. My score moved from a 210 diagnostic to 325 final!", user: "Blessing E.", locale: "Abuja, Nigeria" },
        { text: "Very gentle on data consumption metrics. The low-bandwidth infrastructure configuration lets me study cleanly even in low-network regions.", user: "Tunde A.", locale: "Port Harcourt, Nigeria" }
      ]
    },
    CN: {
      pill: "Advanced Eastern AI Learning Platform",
      heroBase: "Master Any",
      heroTarget: "Gaokao & Core Topic.",
      heroPara: "Accelerate your academic potential. Leverage massive multi-model processing frameworks optimized to handle intricate technical equations and rigorous testing parameters smoothly.",
      conversionSub: "Students optimize conceptual retention rates and speed metrics within 30 days of initialization.",
      matrixCurriculum: "Gaokao Specialized Mathematical & Analytical AI Fine-Tuning Arrays",
      faqTitle: "Does the system support high-level complex analytical engineering formulations?",
      faqCopy: "Yes. The multimodal vision model framework processes structural mathematics, advanced mechanics, and organic structural chemistry diagrams step by step.",
      mobileWidget: "Analytical Compute Pipeline Active",
      badges: [
        { icon: "fa-brain", name: "GAOKAO COGNITIVE REVISION" },
        { icon: "fa-calculator", name: "ZHONGKAO SIMULATIONS" },
        { icon: "fa-microchip", name: "MASSIVE QUANT ARCHITECTURE" }
      ],
      testimonials: [
        { text: "The processing speed of the Snap-to-Solve engine is exceptional. Complex physics diagrams resolve with pristine documentation strings.", user: "Wei L.", locale: "Shanghai, China" },
        { text: "Highly effective for reviewing system engineering problems. The interface layout remains incredibly scannable.", user: "Jun H.", locale: "Beijing, China" }
      ]
    },
    KR: {
      pill: "Premium Specialized Learning Portal",
      heroBase: "Master Any",
      heroTarget: "Suneung CSAT Topic.",
      heroPara: "Engineered to maximize cognitive performance metrics under intense testing configurations. Optimize structural parsing, pattern identification, and complex question handling.",
      conversionSub: "Learners establish clean computational speed gains across standard examination limits within 30 days.",
      matrixCurriculum: "Suneung CSAT Curriculum High-Density AI Fine-Tuning Arrays",
      faqTitle: "Is the platform optimized to assist with rapid text comprehension checks?",
      faqCopy: "Yes. The AI summary pipeline uses highly sophisticated logical layout parsers to extract critical semantic themes from complex texts instantly.",
      mobileWidget: "CSAT Speed Processing Engaged",
      badges: [
        { icon: "fa-graduation-cap", name: "SUNEUNG CSAT TRACK" },
        { icon: "fa-book-open", name: "HIGH DENSITY REVISION" },
        { icon: "fa-bolt", name: "COMPUTE ENGINES ACTIVE" }
      ],
      testimonials: [
        { text: "The automated flashcard processing feature handles long academic video modules with absolute precision.", user: "Min-Ji K.", locale: "Seoul, South Korea" },
        { text: "A clean, highly responsive application frame. It tracks and supports layout formatting seamlessly across multiple devices.", user: "Hyun-Woo J.", locale: "Busan, South Korea" }
      ]
    },
    CA: {
      pill: "Canadian Personalized AI Learning Platform",
      heroBase: "Master Every",
      heroTarget: "Curriculum Track.",
      heroPara: "From provincial assessment frameworks to international standards, Jemer Academy deploys adaptive learning paths designed to keep Canadian high school and university students at the cutting edge.",
      conversionSub: "Canadian learners elevate their structural performance evaluations inside 30 days of active use.",
      matrixCurriculum: "Provincial Diplomas & OSSD Aligned AI Fine-Tuning Arrays",
      faqTitle: "Are specific provincial curriculum maps supported in the simulator database?",
      faqCopy: "Yes. The system parses regional educational parameters to present relevant localized assignments, custom mock configurations, and target study parameters.",
      mobileWidget: "OSSD Target Tracking Activated",
      badges: [
        { icon: "fa-leaf", name: "PROVINCIAL CURRICULUM" },
        { icon: "fa-certificate", name: "OSSD CORE TRACKS" },
        { icon: "fa-university", name: "HIGH-EFFICIENCY REVISION" }
      ],
      testimonials: [
        { text: "Vid2Notes completely transformed how I process lecture streams. The generated semantic summaries are exceptionally high quality.", user: "Liam B.", locale: "Toronto, Canada" },
        { text: "Excellent responsive design system. The app tracks scaling transformations on my foldable device cleanly.", user: "Maya S.", locale: "Vancouver, Canada" }
      ]
    },
    GLOBAL: {
      pill: "Global Universal Learning Platform",
      heroBase: "Master Any",
      heroTarget: "Academic Topic.",
      heroPara: "Experience the ultimate frontier in decentralized intelligent education. From localized entrance exams to international qualification matrices, our multi-model AI systems maximize your academic performance 10x faster.",
      conversionSub: "Learners worldwide consistently bypass legacy performance metrics within 30 days of engine activation.",
      matrixCurriculum: "Universal Multi-Curriculum Fine-Tuning Core AI Arrays",
      faqTitle: "Can Jemer Academy synchronize with custom individual curriculum paths?",
      faqCopy: "Absolutely. The platform is designed with universal adaptability. By uploading system materials or querying the Socratic AI Tutor, the workspace configures itself to your explicit specifications.",
      mobileWidget: "Global Compute Portal Active",
      badges: [
        { icon: "fa-globe-americas", name: "IB CORE REVISION" },
        { icon: "fa-graduation-cap", name: "UNIVERSAL SIMULATORS" },
        { icon: "fa-shapes", name: "PEARSON INT CORES" },
        { icon: "fa-university", name: "GLOBAL ACADEMIC DEPLOYMENT" }
      ],
      testimonials: [
        { text: "An exceptional piece of software engineering. It combines fast rendering layouts with highly intelligent contextual output modeling.", user: "Alexandre M.", locale: "Geneva, Switzerland" },
        { text: "The gamified structural loop keeps me highly motivated while ensuring absolute conceptual retention.", user: "Yuki S.", locale: "Tokyo, Japan" },
        { text: "A masterful implementation of full-stack AI logic. It handles all complex educational tracks with absolute ease.", user: "Amara C.", locale: "Nairobi, Kenya" }
      ]
    }
  };

  // ==========================================================================
  // 3. SEO ANTI-SPOOFING & CRAWLER PROTECTION LOGIC
  // ==========================================================================
  function isSearchEngineCrawler() {
    const userAgent = navigator.userAgent.toLowerCase();
    const crawlerSignatures = [
      "googlebot", "bingbot", "yandexbot", "baiduspider", "duckduckbot",
      "slurp", "ia_archiver", "lighthouse", "chrome-lighthouse"
    ];
    return crawlerSignatures.some(signature => userAgent.includes(signature));
  }

  // ==========================================================================
  // 4. LOW-LATENCY FOREX EXCHANGE API PIPELINE
  // ==========================================================================
  async function fetchExchangeRate(targetCurrency) {
    if (targetCurrency === "USD") return 1;
    const cacheKey = `jemer_fx_${targetCurrency}`;
    const cachedAsset = localStorage.getItem(cacheKey);

    if (cachedAsset) {
      const parsedData = JSON.parse(cachedAsset);
      if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
        return parsedData.rate;
      }
    }

    try {
      const response = await fetch(`https://api.unirateapi.com/api/rates?api_key=${UNIRATE_KEY}&base=USD&currencies=${targetCurrency}`);
      const payload = await response.json();
      let derivedRate = null;

      if (payload.rates && payload.rates[targetCurrency]) {
        derivedRate = payload.rates[targetCurrency];
      } else if (payload.data && payload.data[targetCurrency]) {
        derivedRate = payload.data[targetCurrency];
      }

      if (derivedRate) {
        localStorage.setItem(cacheKey, JSON.stringify({ rate: derivedRate, timestamp: Date.now() }));
        return derivedRate;
      }
    } catch (error) {
      console.error("Forex Pipeline Interruption Logs:", error);
    }
    return cachedAsset ? JSON.parse(cachedAsset).rate : 1;
  }

  // ==========================================================================
  // 5. DOM HYDRATION ENGINE (MARKETING & METRIC INJECTIONS)
  // ==========================================================================
  function getCurrencySymbol(currencyCode) {
    const symbolMap = { "USD": "$", "NGN": "₦", "GBP": "£", "EUR": "€", "GHS": "₵", "KES": "KSh", "ZAR": "R", "CAD": "C$" };
    return symbolMap[currencyCode] || `${currencyCode} `;
  }

  function renderPricingStructure(rate, currencyCode, isPremiumRegion) {
    let standardUsdBase = isPremiumRegion ? 8.50 : 5.00;
    let eliteUsdBase = isPremiumRegion ? 17.00 : 10.00;

    const standardTargetElement = document.getElementById("price-display-standard");
    const eliteTargetElement = document.getElementById("price-display-elite");
    const currencySymbol = getCurrencySymbol(currencyCode);

    if (standardTargetElement) {
      let localizedStandard = (standardUsdBase * rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      standardTargetElement.innerText = `${currencySymbol}${localizedStandard}`;
    }
    if (eliteTargetElement) {
      let localizedElite = (eliteUsdBase * rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      eliteTargetElement.innerText = `${currencySymbol}${localizedElite}`;
    }
  }

  function hydrateLocalizedDOM(regionKey) {
    const data = GEO_CONFIGS[regionKey] || GEO_CONFIGS.GLOBAL;

    const pillElement = document.getElementById("dynamic-pill-text");
    const heroBaseElement = document.getElementById("dynamic-hero-base");
    const heroTargetElement = document.getElementById("dynamic-hero-target");
    const heroParagraphElement = document.getElementById("dynamic-hero-paragraph");
    const conversionSubtextElement = document.getElementById("dynamic-conversion-subtext");
    const matrixTitleElement = document.getElementById("matrix-curriculum-title");
    const faqTitleElement = document.getElementById("faq-title-curriculum");
    const faqCopyElement = document.getElementById("faq-copy-curriculum");
    const mobileWidgetElement = document.getElementById("dynamic-mobile-widget-text");

    if (pillElement) pillElement.innerText = data.pill;
    if (heroBaseElement) heroBaseElement.innerText = data.heroBase;
    if (heroTargetElement) heroTargetElement.innerText = data.heroTarget;
    if (heroParagraphElement) heroParagraphElement.innerText = data.heroPara;
    if (conversionSubtextElement) conversionSubtextElement.innerHTML = data.conversionSub;
    if (matrixTitleElement) matrixTitleElement.innerText = data.matrixCurriculum;
    if (faqTitleElement) faqTitleElement.innerText = data.faqTitle;
    if (faqCopyElement) faqCopyElement.innerText = data.faqCopy;
    if (mobileWidgetElement) mobileWidgetElement.innerText = data.mobileWidget;

    const marqueeContainer = document.getElementById("dynamic-marquee-container");
    if (marqueeContainer) {
      marqueeContainer.innerHTML = "";
      let badgeHtmlContent = data.badges.map(badge => `
        <div class="text-xl font-bold text-white flex items-center gap-2">
          <i class="fas ${badge.icon} text-blue-500"></i> ${badge.name}
        </div>
      `).join("");
      marqueeContainer.innerHTML = badgeHtmlContent + badgeHtmlContent;
    }

    const testimonialGrid = document.getElementById("dynamic-testimonial-grid");
    if (testimonialGrid) {
      testimonialGrid.innerHTML = "";
      testimonialGrid.innerHTML = data.testimonials.map((item, index) => `
        <div class="glass-panel p-8 rounded-2xl relative reveal-up ${index === 1 ? 'bg-white/5 border-blue-500/30' : ''}">
          <p class="text-slate-300 mb-6 relative z-10 font-light leading-relaxed">"${item.text}"</p>
          <h4 class="text-white font-bold tracking-wide">${item.user}</h4>
          <p class="text-xs text-slate-500 font-mono mt-1">${item.locale}</p>
        </div>
      `).join("");
    }
  }

  // ==========================================================================
  // 6. 3D HARDWARE CANVAS SYSTEM CONFIGURATION (THREE.JS VECTOR GLOBE EXECUTOR)
  // ==========================================================================
  const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    // Guard Clause: Instantly drop operational execution if the container target element is unmounted
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limits resolution processing overhead bounds to 2 for mobile frame rate locks
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color(0xA855F7); // Branding Purple Token Matrix
    const color2 = new THREE.Color(0x06B6D4); // Branding Cyan Token Matrix

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 8; 
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = i % 2 === 0 ? color1 : color2;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const globe = new THREE.Points(geometry, material);
    scene.add(globe);

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

   // The clock variable has been removed to clear unused variable linter warnings
    // since the rotation runs on a clean, fixed increment per frame.
    function animate() {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      globe.rotation.x += (mouseY * 0.1 - globe.rotation.x) * 0.05;
      globe.rotation.z += (mouseX * 0.1 - globe.rotation.z) * 0.05;
      renderer.render(scene, camera);
    }
    animate();

    function animate() {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      globe.rotation.x += (mouseY * 0.1 - globe.rotation.x) * 0.05;
      globe.rotation.z += (mouseX * 0.1 - globe.rotation.z) * 0.05;
      renderer.render(scene, camera);
    }
    animate();

    // Fluid responsive transformation observer hook matrix for dynamic view adjustments across devices
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  // ==========================================================================
  // 7. PIPELINE ORCHESTRATION ENGINE ENTRY SYSTEM
  // ==========================================================================
  async function runOrchestrationPipeline() {
    if (isSearchEngineCrawler()) {
      hydrateLocalizedDOM("GLOBAL");
      renderPricingStructure(1, "USD", false);
      return;
    }

    let detectedCountry = "GLOBAL";
    let targetCurrency = "USD";
    let isPremiumRegion = false;

    try {
      const geoResult = await fetch("https://ipapi.co/json/");
      const geoData = await geoResult.json();

      if (geoData && geoData.country_code) {
        let countryCode = geoData.country_code.toUpperCase();
        
        if (GEO_CONFIGS[countryCode]) {
          detectedCountry = countryCode;
        } else if (["AT", "BE", "DE", "ES", "FR", "IE", "IT", "NL", "PT", "FI", "GR"].includes(countryCode)) {
          detectedCountry = "EU";
        }

        if (geoData.currency && FLW_SUPPORTED.includes(geoData.currency.toUpperCase())) {
          targetCurrency = geoData.currency.toUpperCase();
        }

        if (["USD", "GBP", "EUR"].includes(targetCurrency) || ["US", "GB", "EU"].includes(detectedCountry)) {
          isPremiumRegion = true;
        }
      }
    } catch (error) {
      console.warn("Telemetry endpoint error fallback active:", error);
    }

    hydrateLocalizedDOM(detectedCountry);
    const calculatedFxRate = await fetchExchangeRate(targetCurrency);
    renderPricingStructure(calculatedFxRate, targetCurrency, isPremiumRegion);
  }

  // ==========================================================================
  // 8. USER INTERFACE COMPONENTS BINDING PIPELINES
  // ==========================================================================
  function initializeUIBindings() {
    const menuButton = document.getElementById("mobile-menu-button");
    const mobileMenuPanel = document.getElementById("mobile-menu");

    if (menuButton && mobileMenuPanel) {
      menuButton.addEventListener("click", function () {
        const isCurrentlyExpanded = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", !isCurrentlyExpanded);

        if (mobileMenuPanel.classList.contains("hidden")) {
          mobileMenuPanel.classList.remove("hidden");
          setTimeout(() => {
            mobileMenuPanel.classList.remove("opacity-0", "translate-y-[-10px]");
            mobileMenuPanel.classList.add("opacity-100", "translate-y-0");
          }, 20);
        } else {
          mobileMenuPanel.classList.remove("opacity-100", "translate-y-0");
          mobileMenuPanel.classList.add("opacity-0", "translate-y-[-10px]");
          
          const clearPanelState = function(e) {
            if (e.propertyName === "transform" || e.propertyName === "opacity") {
              mobileMenuPanel.classList.add("hidden");
              mobileMenuPanel.removeEventListener("transitionend", clearPanelState);
            }
          };
          mobileMenuPanel.addEventListener("transitionend", clearPanelState);
        }
      });

      mobileMenuPanel.addEventListener("click", function (e) {
        if (e.target.closest(".mobile-nav-link")) {
          menuButton.setAttribute("aria-expanded", "false");
          mobileMenuPanel.classList.remove("opacity-100", "translate-y-0");
          mobileMenuPanel.classList.add("opacity-0", "translate-y-[-10px]");
          mobileMenuPanel.classList.add("hidden");
        }
      });
    }

    const faqRootContainer = document.getElementById("faq-container");
    if (faqRootContainer) {
      faqRootContainer.addEventListener("click", function (event) {
        const structuralQuestionTarget = event.target.closest(".faq-question");
        if (!structuralQuestionTarget) return;

        const parentItemNode = structuralQuestionTarget.parentElement;
        const entireFaqItemQueue = faqRootContainer.querySelectorAll(".faq-item");

        entireFaqItemQueue.forEach(item => {
          if (item !== parentItemNode) {
            item.classList.remove("open");
            const btnNode = item.querySelector(".faq-question");
            if (btnNode) btnNode.setAttribute("aria-expanded", "false");
          }
        });

        const activeStateToggle = parentItemNode.classList.toggle("open");
        structuralQuestionTarget.setAttribute("aria-expanded", activeStateToggle ? "true" : "false");
      });
    }
  }

  // ==========================================================================
  // 9. SYSTEM INITIALIZATION DOM EVENT LIFECYCLE CONTROLS
  // ==========================================================================
  const bootstrapWorkspace = () => {
    initializeUIBindings();
    runOrchestrationPipeline();
    // Fire WebGL initialization safety loop if the browser context supports WebGL
    if (window.WebGLRenderingContext && typeof THREE !== 'undefined') {
      initThreeJS();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrapWorkspace);
  } else {
    bootstrapWorkspace();
  }
})();