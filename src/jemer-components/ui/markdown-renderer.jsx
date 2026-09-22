/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.10.0 — Fixed Dead Inline-Math Regex & KaTeX Unicode Crashes
 * 1. DEAD REGEX FIX: Pass 2 of `parseInlineText` (the `$...$` extractor) contained a stray
 *    `\vert{}` — `\v` (vertical-tab escape) followed by literal `ert{}` text — which meant that
 *    pattern essentially never matched. Most single-dollar inline math written mid-paragraph was
 *    silently falling through unrendered, only ever caught by Pass 3's end-of-string fallback.
 *    Replaced with the equivalent, working regex, preserving the exact same non-space-boundary
 *    currency guard (still won't swallow "I have $10 and $20") the original comment described.
 * 2. KATEX UNICODE HARDENING: Added `sanitizeMathUnicode` (used by both InlineMath and BlockMath)
 *    to normalize en/em dash and the true minus sign to a plain hyphen, curly quotes to straight
 *    ones, and swap common currency symbols (₦, ₵, ₹, £, €) for `\text{...}` equivalents — KaTeX's
 *    default font has no glyph metrics for these, which is what produced the "Unrecognized Unicode
 *    character" / "No character metrics" console errors and missing/broken glyphs. Since this is
 *    the shared renderer, every consumer (tutor, snap, audiobooks) gets this automatically.
 * 3. Added `strict: false` to both `katex.renderToString` calls as a backstop for any other
 *    unicode symbol outside the explicit list above, so it degrades quietly instead of spamming
 *    the console.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: Executed v2.9.1 - Robust Type Safeguard for MarkdownRenderer
 * 1. Runtime Type Safety: Added a robust type guard at the start of `renderedBlocks` to check if `text` is a string. If the backend passes objects, arrays, or numbers (such as structured JSON fields in action items or key points), it automatically converts them to a readable JSON string or primitive string instead of crashing with `text.replace is not a function`.
 * ================================================================================================
 * 💎 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM MARKDOWN & MATH RENDERER (v2.10.0)
 * ================================================================================================
 * Location: src/jemer-components/ui/markdown-renderer.jsx
 * Dependencies Required: npm install katex prismjs
 * ================================================================================================
 */

"use client";

import React, { useState, useMemo, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Imports the dark syntax theme for code blocks
// Note: To support specific languages like python, go, or sql, import them sequentially in your root layout:
// import "prismjs/components/prism-python"; import "prismjs/components/prism-go";

/**
 * 🚀 NEW: Strips/normalizes Unicode characters KaTeX's default fonts have no glyph metrics for —
 * en/em dash and the true minus sign become a plain hyphen, curly quotes become straight ones, and
 * common currency symbols become their `\text{...}` equivalent so they render as real upright text
 * instead of a missing-glyph box. Shared by InlineMath and BlockMath below.
 */
const sanitizeMathUnicode = (math) => {
  if (!math) return math;
  return math
    .replace(/[\u2013\u2014\u2212]/g, '-')   // – — − (en/em dash, true minus) → hyphen-minus
    .replace(/[\u2018\u2019]/g, "'")          // curly single quotes
    .replace(/[\u201C\u201D]/g, '"')          // curly double quotes
    .replace(/\u00A0/g, ' ')                  // non-breaking space
    .replace(/\u20A6/g, '\\text{NGN}')        // ₦ Naira
    .replace(/\u20B5/g, '\\text{GHS}')        // ₵ Cedi
    .replace(/\u20B9/g, '\\text{INR}')        // ₹ Rupee
    .replace(/\u00A3/g, '\\text{GBP}')        // £ Pound
    .replace(/\u20AC/g, '\\text{EUR}');       // € Euro
};

/**
 * ── SUB-COMPONENT 1: THE INLINE MATH RENDERER ──
 * Renders algebraic strings (e.g. $E=mc^2$) wrapped directly inside standard paragraph text.
 */
const InlineMath = ({ math }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(sanitizeMathUnicode(math), { displayMode: false, throwOnError: false, strict: false });
    } catch (e) {
      return `<span class="text-red-500 font-mono">${math}</span>`;
    }
  }, [math]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

/**
 * ── SUB-COMPONENT 2: THE BLOCK MATH RENDERER ──
 * Isolates and renders full-width, centered scientific equations with sideways scrolling capability.
 */
const BlockMath = ({ math }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(sanitizeMathUnicode(math), { displayMode: true, throwOnError: false, strict: false });
    } catch (e) {
      return `<span class="text-red-500 font-mono">Math Error: ${e.message}</span>`;
    }
  }, [math]);

  return <div className="w-full overflow-x-auto custom-content-scroll my-4 py-2" dangerouslySetInnerHTML={{ __html: html }} />;
};

/**
 * ── SUB-COMPONENT 3: THE PREMIUM CODE BLOCK SANDBOX ──
 * Wraps code outputs in a dark, shadow-rich container equipped with live syntax highlighting and copy actions.
 */
const CodeBlockContainer = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const highlightedCodeHtml = useMemo(() => {
    const validLang = Prism.languages[language] ? language : "javascript"; // Fallback to JS tokenization
    const grammar = Prism.languages[validLang] || Prism.languages.javascript;
    try {
      return Prism.highlight(code, grammar, validLang);
    } catch (e) {
      return code; // Fallback to raw text if parsing fails
    }
  }, [code, language]);

  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-slate-700 shadow-lg bg-slate-900 dark:bg-[#0A0A0A] select-text">
      {/* Utility Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 dark:bg-[#1A1A1A] border-b border-slate-700/60 select-none">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
          {language || "plaintext"}
        </span>
        <button 
          onClick={handleCopy} 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider focus:outline-none"
        >
          {copied ? (
            <><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> COPIED</>
          ) : (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> COPY</>
          )}
        </button>
      </div>
      {/* Code Text Viewport */}
      <div className="p-4 overflow-x-auto custom-content-scroll text-slate-100">
        <pre className="!m-0 !p-0 !bg-transparent text-xs sm:text-sm font-mono leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }} />
        </pre>
      </div>
    </div>
  );
};

/**
 * ── THE MASTER TEXT PARSER ENGINE ──
 * 🚀 NEW UPGRADE: Isolates inline math ($ and \(\)) and formatting (bold/italic) safely out of paragraph blocks.
 * Employs a multi-pass approach to handle tight punctuation, streaming fallbacks, and currency protection.
 */
const parseInlineText = (text) => {
  let counter = 0;
  const store = {};

  // 1. Pass 1: Extract standard LaTeX inline bracket formulations \(...\) safely
  // The (?:\\\)|$) handles active streaming where the closing bracket hasn't arrived.
  let processed = text.replace(/\\\((.*?)(?:\\\)|$)/g, (match, math) => {
    const id = `__INLINE_MATH_${counter++}__`;
    store[id] = math;
    return id;
  });

  // 2. Pass 2: Extract $...$ securely without triggering on currency
  // Matches tightly packed math but enforces non-space boundaries to avoid swallowing "I have $10 and $20"
  // 🚀 FIXED: this previously contained a stray `\vert{}` (a vertical-tab escape + literal "ert{}"
  // text) which made the pattern essentially never match real content. Rewritten to the equivalent,
  // working regex — same non-space-boundary guard, minus the dead token.
  processed = processed.replace(/\$([^\s$](?:[^$]*?[^\s$])?)\$/g, (match, math) => {
    // Anti-Eviction Currency Guard: If it's purely numbers, commas, or decimals (e.g. $100.00), ignore it
    if (/^[\d.,]+$/.test(math.trim())) return match;
    const id = `__INLINE_MATH_${counter++}__`;
    store[id] = math;
    return id;
  });

  // 3. Pass 3: Streaming Fallback for unclosed $ at the absolute end of the generated text
  processed = processed.replace(/\$([^\s$][^$]*)$/, (match, math) => {
    // Currency Guard applies here as well
    if (/^[\d.,]+$/.test(math.trim())) return match;
    const id = `__INLINE_MATH_${counter++}__`;
    store[id] = math;
    return id;
  });

  // 4. Map structural components to the array matrix
  const parts = processed.split(/(__INLINE_MATH_\d+__)/g);

  return parts.map((part, idx) => {
    if (store[part]) {
      return <InlineMath key={idx} math={store[part]} />;
    }

    // Apply strict bold and italic regex over the remaining standard text
    let html = part
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-extrabold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
  });
};


/**
 * ── THE CORE DECOUPLED MARKDOWN RENDERER MODULE ──
 * Receives the raw AI text string, pre-processes the entire payload into mathematical, coding, 
 * and table blocks, and returns the finished React Node tree.
 */
export default function MarkdownRenderer({ text }) {
  const renderedBlocks = useMemo(() => {
    if (!text) return null;
    
    // 🚀 Robust Type Safeguard: Ensure safe string processing if objects/arrays are passed
    const safeText = typeof text === 'string' 
      ? text 
      : typeof text === 'object' 
        ? JSON.stringify(text, null, 2) 
        : String(text);
    
    let counter = 0;
    const blockStore = {};

    // 1. Extract Full Code Blocks
    // The (?:```|$) boundary allows live rendering while the AI is actively streaming and hasn't closed the block yet.
    let processed = safeText.replace(/```([\w-]*)\n([\s\S]*?)(?:```|$)/g, (match, lang, code) => {
      const id = `__CODE_BLOCK_${counter++}__`;
      blockStore[id] = { type: 'code', lang: lang.trim(), code: code.trim() };
      return `\n\n${id}\n\n`;
    });

    // 2. Extract Full Math Blocks ($$ ... $$)
    processed = processed.replace(/\$\$([\s\S]*?)(?:\$\$|$)/g, (match, math) => {
      const id = `__MATH_BLOCK_${counter++}__`;
      blockStore[id] = { type: 'math', math: math.trim() };
      return `\n\n${id}\n\n`;
    });

    // 3. Extract Block Math via bracket formatting (\[ ... \])
    processed = processed.replace(/\\\[([\s\S]*?)(?:\\\]|$)/g, (match, math) => {
      const id = `__MATH_BLOCK_${counter++}__`;
      blockStore[id] = { type: 'math', math: math.trim() };
      return `\n\n${id}\n\n`;
    });

    // 4. Split the remaining text cleanly by line breaks to target components
    const chunks = processed.split(/\n\n+/).map(c => c.trim()).filter(Boolean);

    return chunks.map((chunk, idx) => {
      
      // Render injected isolated components
      if (blockStore[chunk]) {
        const block = blockStore[chunk];
        if (block.type === 'code') {
          return <CodeBlockContainer key={idx} language={block.lang} code={block.code} />;
        }
        if (block.type === 'math') {
          return <BlockMath key={idx} math={block.math} />;
        }
      }

      // Handle CSS Table Parsing
      if (chunk.startsWith('|') && chunk.indexOf('|-') !== -1) {
        const tableLines = chunk.split('\n').map(l => l.trim()).filter(Boolean);
        if (tableLines.length >= 2) {
          const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
          
          let dataStart = 1;
          if (tableLines[1] && tableLines[1].replace(/[-:| ]/g, '') === '') {
            dataStart = 2; // Skips the markdown separator line
          }
          
          const bodyLines = tableLines.slice(dataStart).map(line => line.split('|').filter(Boolean).map(c => c.trim()));

          return (
            <div key={idx} className="w-full overflow-x-auto custom-content-scroll my-5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="p-3 border-b border-slate-200 dark:border-slate-700/60 font-bold whitespace-nowrap">
                        {parseInlineText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-950/50">
                  {bodyLines.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                          {parseInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Handle Hierarchical Headers
      const headerMatch = chunk.match(/^(#{1,4})\s+(.*)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const content = headerMatch[2];
        const Tag = `h${level}`;
        const sizes = { 1: "text-2xl", 2: "text-xl", 3: "text-lg", 4: "text-base" };
        return (
          <Tag key={idx} className={`${sizes[level]} font-display font-extrabold text-slate-900 dark:text-white tracking-tight pt-3 pb-1`}>
            {parseInlineText(content)}
          </Tag>
        );
      }

      // Handle Purple Blockquotes
      if (chunk.startsWith('>')) {
        return (
          <blockquote key={idx} className="border-l-4 border-purple-500/60 bg-purple-50/40 dark:bg-purple-900/20 px-4 py-3 rounded-r-xl text-sm italic font-medium text-purple-900 dark:text-purple-300 my-2 shadow-inner">
            {parseInlineText(chunk.replace(/^>\s*/gm, '').trim())}
          </blockquote>
        );
      }

      // Handle Ordered and Unordered Bullet Lists
      if (chunk.match(/^[-*]\s/m) || chunk.match(/^\d+\.\s/m)) {
        return (
          <div key={idx} className="space-y-2 pl-2 my-2">
            {chunk.split('\n').map((listItem, lIdx) => {
              const isOrdered = listItem.match(/^\d+\.\s/);
              const bullet = isOrdered ? listItem.match(/^\d+\./)[0] : "•";
              const cleanText = listItem.replace(/^[-*]\s|^\d+\.\s/, "");
              return (
                <p key={lIdx} className="pl-5 relative before:content-[attr(data-bullet)] before:absolute before:left-0 before:font-bold before:text-blue-600 dark:before:text-blue-400" data-bullet={bullet}>
                  {parseInlineText(cleanText)}
                </p>
              );
            })}
          </div>
        );
      }

      // Standard Formatted Paragraph Output
      return (
        <p key={idx} className="leading-relaxed">
          {parseInlineText(chunk)}
        </p>
      );
    });
  }, [text]);

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-sans font-medium space-y-3 pl-1 break-words">
      
      {/* Custom Sideways Scrollbars and KaTeX Override Configuration */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-content-scroll::-webkit-scrollbar { height: 6px; }
        .custom-content-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-content-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .custom-content-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.5); }
        
        /* Forces KaTeX blocks to respect mobile boundaries and utilize horizontal swiping instead of breaking layout */
        .katex-display { margin: 0 !important; overflow-x: auto; padding: 0.5rem 0; text-align: center; }
        .katex-display::-webkit-scrollbar { height: 4px; }
        .katex-display::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
      `}} />

      {renderedBlocks}
    </div>
  );
}