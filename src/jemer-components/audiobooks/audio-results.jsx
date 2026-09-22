/**
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS RESULTS ENGINE (v6.1.0)
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Replaced the Broken jsPDF Exporter with @react-pdf/renderer.
 * 1. ROOT CAUSE OF THE "BROKEN/UGLY" PDF: the old exporter hand-placed text at manually computed
 *    x/y coordinates and did its own page-break math (`checkPageBreak`), and it dumped
 *    `key_points`/`action_items` into the PDF as one raw markdown-stripped text blob instead of
 *    the structured cards/checklist already rendered on screen — that mismatch is what produced
 *    the overlapping/ugly layout.
 * 2. NEW ENGINE: `@react-pdf/renderer` (npm i @react-pdf/renderer) — a real flexbox layout engine
 *    driven by JSX, so wrapping and pagination are handled by the engine instead of by hand.
 *    Requires `npm install @react-pdf/renderer`.
 * 3. TRUE VISUAL PARITY: the PDF now reuses the exact same parsed data already computed on this
 *    page — `parsedTranscript`, `parsedKeyPoints`, `parsedActionItems`, `tokenizedNotes` — so the
 *    numbered key-point cards, the checklist, the table-aware notes section, and the color-coded
 *    quiz answers in the PDF match what's on screen, instead of a separately hand-built export.
 * 4. Repeating header/footer + real page numbers (`Page X of Y`) are now handled natively via
 *    react-pdf's `fixed` views and `render={({ pageNumber, totalPages }) => ...}`, replacing the
 *    old manual `pageCount` bookkeeping.
 * 5. Removed the CDN-script jsPDF loader (`loadJsPDF`) entirely — no longer needed.
 * 6. Everything else in this file (tabs, audio player, resources modal, markdown rendering, quiz/
 *    checklist interactivity, transcript click-to-seek) is unchanged.
 * ================================================================================================
 * [PREVIOUS UPGRADE — v6.0.0]
 * SUMMARY: Phase 2 UI/UX Polish, Portal Modal, Markdown Iron-Cladding & Interactive Modules
 * 1. VIEWPORT-FIXED RESOURCES PORTAL: Wrapped the download modal in `createPortal(..., document.body)`.
 *    The modal now pops up dead-center in the user's viewport with a high-contrast frosted backdrop,
 *    never again getting lost halfway down a long transcript.
 * 2. MARKDOWN & TABLE IRON-CLADDING: Ported the `preprocessMarkdown` and `tokenizeBlocks` engine.
 *    No more swallowed text under headers, stripped ```plaintext artifacts, and custom-styled Tailwind
 *    tables with horizontal scrolling.
 * 3. CUTE & STRUCTURED BENTO MODULES:
 *    - Summary: Rendered in an executive Bento card with read-time and word-count stats.
 *    - Key Points: Parsed into elevated highlight cards with bold takeaways.
 *    - Action Items: Interactive checklist with clickable checkboxes and live progress counter.
 * 4. CLICK-TO-SEEK TRANSCRIPT: Clicking any timestamp block (e.g. [02:15]) seeks the audio player
 *    directly to that second and auto-plays.
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

// 🚀 Markdown block tokenizer for custom Tailwind tables
const tokenizeBlocks = (text) => {
  if (!text) return [];

  const lines = text.split("\n");
  const tokens = [];
  let currentText = [];
  let currentTable = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = line.trim().startsWith("|") && line.indexOf("|", 1) !== -1;

    if (isTableLine) {
      if (!inTable) {
        inTable = true;
        if (currentText.length > 0) {
          tokens.push({ type: "text", content: currentText.join("\n") });
          currentText = [];
        }
      }
      currentTable.push(line);
    } else {
      if (inTable) {
        inTable = false;
        tokens.push({ type: "table", content: currentTable.join("\n") });
        currentTable = [];
      }
      currentText.push(line);
    }
  }

  if (currentText.length > 0) tokens.push({ type: "text", content: currentText.join("\n") });
  if (currentTable.length > 0) tokens.push({ type: "table", content: currentTable.join("\n") });

  return tokens;
};

// 🚀 Preprocessor to prevent markdown parsers from swallowing text under headers
const preprocessMarkdown = (content) => {
  if (!content) return "";
  
  let processed = content
    .replace(/\r\n/g, "\n")
    .replace(/\*\*(#{1,6}\s+[^*]+)\*\*/g, "$1")
    .replace(/\*\*###\s+/g, "### ")
    .replace(/\*\*##\s+/g, "## ")
    .replace(/\*\*#\s+/g, "# ")
    .replace(/```(?:plaintext|text|markdown)?\n?/gi, "")
    .replace(/```/g, "");

  // KaTeX delimiter normalization
  processed = processed.replace(/\\\[/g, "$$$").replace(/\\\]/g, "$$$");
  processed = processed.replace(/\\\(/g, "$").replace(/\\\)/g, "$");

  // Ensure double newlines before headers, tables, and lists
  processed = processed.replace(/([^\n])\n(#{1,6}\s+)/g, "$1\n\n$2");
  processed = processed.replace(/([^\n])\n(\|[\s\S]*?\|)\n([^\n])/g, "$1\n\n$2\n\n$3");
  processed = processed.replace(/([^\n])\n(\|[\s\S]*?\|)(?!\n)/g, "$1\n\n$2");
  processed = processed.replace(/([^\n])\n([-*]\s+)/g, "$1\n\n$2");

  return processed;
};

// ================================================================================================
// 🚀 NEW: @react-pdf/renderer document definitions
// ================================================================================================

const pdfStyles = StyleSheet.create({
  page: { paddingTop: 68, paddingBottom: 46, paddingHorizontal: 40, fontFamily: "Helvetica", fontSize: 10, color: "#334155" },
  headerBanner: { position: "absolute", top: 0, left: 0, right: 0, height: 32, backgroundColor: "#4F46E5", flexDirection: "row", alignItems: "center", paddingHorizontal: 40 },
  headerBannerText: { color: "#FFFFFF", fontSize: 8, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 19, fontFamily: "Helvetica-Bold", color: "#1E293B", marginBottom: 4 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", fontSize: 9, color: "#64748B", marginBottom: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#E2E8F0", marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#4F46E5", marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 10, lineHeight: 1.5, color: "#334155", marginBottom: 8 },
  card: { backgroundColor: "#F8FAFC", borderRadius: 6, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: "#E2E8F0", flexDirection: "row" },
  badge: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#EEF2FF", color: "#4F46E5", fontSize: 8, fontFamily: "Helvetica-Bold", textAlign: "center", paddingTop: 3.5, marginRight: 8 },
  checklistBox: { width: 9, height: 9, borderWidth: 1, borderColor: "#94A3B8", borderRadius: 2, marginRight: 8, marginTop: 1.5 },
  cardText: { flex: 1, fontSize: 9.5, lineHeight: 1.45, color: "#334155" },
  quizCard: { backgroundColor: "#F8FAFC", borderRadius: 6, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  quizQuestion: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#1E293B", marginBottom: 6 },
  quizOption: { fontSize: 9.5, color: "#475569", marginBottom: 3, paddingLeft: 4 },
  quizOptionCorrect: { fontSize: 9.5, color: "#047857", fontFamily: "Helvetica-Bold", marginBottom: 3, paddingLeft: 4 },
  quizExplanation: { fontSize: 9, color: "#4F46E5", marginTop: 6, lineHeight: 1.45 },
  transcriptRow: { marginBottom: 8 },
  transcriptMeta: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#4F46E5", marginBottom: 2 },
  transcriptText: { fontSize: 9.5, lineHeight: 1.4, color: "#334155" },
  tableWrap: { marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 4 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#F1F5F9" },
  tableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#E2E8F0" },
  tableCellHeader: { flex: 1, padding: 5, fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#1E293B" },
  tableCell: { flex: 1, padding: 5, fontSize: 8.5, color: "#334155" },
  footer: { position: "absolute", bottom: 18, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: "#94A3B8" },
});

// Strips markdown syntax markers for plain PDF text — same intent as the old addParagraph cleaner.
const cleanText = (text) => (text || "").replace(/[*#`_]/g, "").trim();

const PDFHeaderBanner = () => (
  <View style={pdfStyles.headerBanner} fixed>
    <Text style={pdfStyles.headerBannerText}>JEMER ACADEMY  //  ACADEMIC STUDY PACK</Text>
  </View>
);

const PDFFooter = () => (
  <View style={pdfStyles.footer} fixed>
    <Text>Generated by Jemer Academy AI Intelligence Core</Text>
    <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </View>
);

function TranscriptPDF({ fileName, parsedTranscript }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page} wrap>
        <PDFHeaderBanner />
        <Text style={pdfStyles.title}>Lecture Audio Transcript</Text>
        <View style={pdfStyles.metaRow}>
          <Text>Source: {(fileName || "").substring(0, 70)}</Text>
          <Text>{new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</Text>
        </View>
        <View style={pdfStyles.divider} />
        {parsedTranscript.length === 0 ? (
          <Text style={pdfStyles.paragraph}>No transcript content available.</Text>
        ) : (
          parsedTranscript.map((block) => (
            <View key={block.id} style={pdfStyles.transcriptRow} wrap={false}>
              {(block.time || block.speaker) && (
                <Text style={pdfStyles.transcriptMeta}>
                  {block.time ? `[${block.time}]  ` : ""}{block.speaker || ""}
                </Text>
              )}
              <Text style={pdfStyles.transcriptText}>{block.content}</Text>
            </View>
          ))
        )}
        <PDFFooter />
      </Page>
    </Document>
  );
}

function StudyPackPDF({ fileName, summary, summaryMetrics, keyPoints, actionItems, quiz, notesTokens }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page} wrap>
        <PDFHeaderBanner />
        <Text style={pdfStyles.title}>Executive Study Notes</Text>
        <View style={pdfStyles.metaRow}>
          <Text>Source: {(fileName || "").substring(0, 70)}</Text>
          <Text>{new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</Text>
        </View>
        <View style={pdfStyles.divider} />

        {summary && (
          <View wrap={false}>
            <Text style={pdfStyles.sectionTitle}>1. Executive Summary</Text>
            <Text style={{ fontSize: 8.5, color: "#94A3B8", marginBottom: 6 }}>
              {summaryMetrics.wordCount} words · ~{summaryMetrics.readTimeMinutes} min read
            </Text>
            <Text style={pdfStyles.paragraph}>{cleanText(summary)}</Text>
          </View>
        )}

        {keyPoints.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>2. Core Conceptual Takeaways</Text>
            {keyPoints.map((point, i) => (
              <View key={i} style={pdfStyles.card} wrap={false}>
                <Text style={pdfStyles.badge}>{i + 1}</Text>
                <Text style={pdfStyles.cardText}>{cleanText(point)}</Text>
              </View>
            ))}
          </View>
        )}

        {actionItems.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>3. Action Items &amp; Study Checklist</Text>
            {actionItems.map((item, i) => (
              <View key={i} style={pdfStyles.card} wrap={false}>
                <View style={pdfStyles.checklistBox} />
                <Text style={pdfStyles.cardText}>{cleanText(item)}</Text>
              </View>
            ))}
          </View>
        )}

        {notesTokens.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>4. Comprehensive Lecture Notes</Text>
            {notesTokens.map((token, tIdx) => {
              if (token.type === "table") {
                const tableLines = token.content.split("\n").map((l) => l.trim()).filter(Boolean);
                if (tableLines.length < 2) return null;
                const headers = tableLines[0].split("|").filter(Boolean).map((h) => cleanText(h));
                let dataStartIndex = 1;
                if (tableLines[1] && tableLines[1].replace(/[-:| ]/g, "") === "") dataStartIndex = 2;
                const bodyLines = tableLines.slice(dataStartIndex).map((line) => line.split("|").filter(Boolean).map((c) => cleanText(c)));
                return (
                  <View key={`table-${tIdx}`} style={pdfStyles.tableWrap} wrap={false}>
                    <View style={pdfStyles.tableHeaderRow}>
                      {headers.map((h, i) => <Text key={i} style={pdfStyles.tableCellHeader}>{h}</Text>)}
                    </View>
                    {bodyLines.map((row, ri) => (
                      <View key={ri} style={pdfStyles.tableRow}>
                        {row.map((cell, ci) => <Text key={ci} style={pdfStyles.tableCell}>{cell}</Text>)}
                      </View>
                    ))}
                  </View>
                );
              }
              const paragraphs = token.content.split("\n").map((l) => cleanText(l)).filter(Boolean);
              return paragraphs.map((p, pi) => (
                <Text key={`p-${tIdx}-${pi}`} style={pdfStyles.paragraph}>{p}</Text>
              ));
            })}
          </View>
        )}

        {quiz.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>5. Self-Assessment Quiz</Text>
            {quiz.map((q, idx) => (
              <View key={idx} style={pdfStyles.quizCard} wrap={false}>
                <Text style={pdfStyles.quizQuestion}>Question {idx + 1}: {cleanText(q.question)}</Text>
                {Object.entries(q.options || {}).map(([k, val]) => (
                  <Text key={k} style={k === q.correct_answer ? pdfStyles.quizOptionCorrect : pdfStyles.quizOption}>
                    {k}. {cleanText(val)}{k === q.correct_answer ? "   ✓ Correct" : ""}
                  </Text>
                ))}
                {q.explanation && (
                  <Text style={pdfStyles.quizExplanation}>{cleanText(q.explanation)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <PDFFooter />
      </Page>
    </Document>
  );
}

export default function AudioResults({ audioData, onReset, onChat, analysisData, transcript }) {
  // ── CORE STATES ──
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completedActions, setCompletedActions] = useState({});
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ── CUSTOM PLAYER STATES ──
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ── FILE METADATA ──
  const fileName = audioData?.fileName || audioData?.name || "Analyzed Audio Session";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedAnswers({});
    setCompletedActions({});
  }, [analysisData]);

  // 🚀 FIXED: Bind duration from audioData metadata if provided
  useEffect(() => {
    if (audioData) {
      if (audioData.duration && isFinite(audioData.duration) && audioData.duration > 0) {
        setDuration(audioData.duration);
      }

      if (typeof audioData === "string") {
        setAudioUrl(audioData);
        return;
      }

      if (audioData instanceof Blob || audioData instanceof File) {
        try {
          const url = URL.createObjectURL(audioData);
          setAudioUrl(url);
          return () => URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Audio playback initialization failed:", error);
        }
      } else if (audioData?.url) {
        setAudioUrl(audioData.url);
      }
    }
  }, [audioData]);

  // ── AUDIO PLAYER CONTROLS ──
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (amount) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += amount;
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // 🚀 NEW: Click-to-seek directly from transcript timestamps
  const handleSeekToSeconds = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds) || !isFinite(timeInSeconds) || timeInSeconds < 0) {
      return "00:00";
    }
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const safeDuration = isFinite(duration) && duration > 0 ? duration : 0;
  const progressPercent = safeDuration > 0 ? (currentTime / safeDuration) * 100 : 0;

  // ── TRANSCRIPT PARSER ── (moved above handleDownload since the PDF export now consumes it too)
  const parsedTranscript = useMemo(() => {
    if (!transcript) return [];
    const lines = transcript.split("\n").filter((l) => l.trim().length > 0);

    return lines.map((line, idx) => {
      let time = "";
      let totalSeconds = 0;
      let speaker = "";
      let content = line.trim();

      const timeMatch = content.match(/\[?\b(\d{2}):(\d{2})(?::(\d{2}))?\b\]?/);
      if (timeMatch) {
        time = timeMatch[0].replace(/[[\]]/g, "");
        const parts = time.split(":").map(Number);
        if (parts.length === 2) {
          totalSeconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
          totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        content = content.replace(timeMatch[0], "").trim();
      }

      const speakerMatch = content.match(/^([\w\s]+):/);
      if (speakerMatch) {
        speaker = speakerMatch[1].trim();
        content = content.replace(speakerMatch[0], "").trim();
      }

      content = content.replace(/^- /, "").trim();

      return { id: idx, time, totalSeconds, speaker, content };
    });
  }, [transcript]);

  // ── SUMMARY STATS COMPUTATION ──
  const summaryMetrics = useMemo(() => {
    const text = analysisData?.summary || "";
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    return { wordCount, readTimeMinutes };
  }, [analysisData?.summary]);

  // ── KEY POINTS PARSER ──
  const parsedKeyPoints = useMemo(() => {
    const raw = analysisData?.key_points || "";
    return raw
      .split("\n")
      .map((l) => l.replace(/^[-*•\d.]\s*/, "").trim())
      .filter((l) => l.length > 0);
  }, [analysisData?.key_points]);

  // ── ACTION ITEMS CHECKLIST ──
  const parsedActionItems = useMemo(() => {
    const raw = analysisData?.action_items || "";
    return raw
      .split("\n")
      .map((l) => l.replace(/^[-*•\d.\[\]x ]\s*/, "").trim())
      .filter((l) => l.length > 0);
  }, [analysisData?.action_items]);

  const formattedNotes = useMemo(() => {
    return preprocessMarkdown(analysisData?.full_notes || "");
  }, [analysisData?.full_notes]);

  const tokenizedNotes = useMemo(() => {
    return tokenizeBlocks(formattedNotes);
  }, [formattedNotes]);

  // ── 🚀 EXPORT ENGINE — @react-pdf/renderer (replaces the old manual-coordinate jsPDF exporter) ──
  const handleDownload = async (type) => {
    setIsDownloading(true);

    try {
      if (type === "audio" && audioUrl) {
        try {
          const res = await fetch(audioUrl);
          const blob = await res.blob();
          const localUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = localUrl;
          a.download = `${fileName}.webm`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(localUrl);
        } catch (e) {
          const a = document.createElement("a");
          a.href = audioUrl;
          a.download = `${fileName}.webm`;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        setIsResourcesModalOpen(false);
        setIsDownloading(false);
        return;
      }

      // 🚀 NEW: build the actual PDF via @react-pdf/renderer, reusing the same parsed data the
      // page already renders on screen — this is what guarantees the PDF matches the UI.
      const docElement =
        type === "transcript" ? (
          <TranscriptPDF fileName={fileName} parsedTranscript={parsedTranscript} />
        ) : (
          <StudyPackPDF
            fileName={fileName}
            summary={analysisData?.summary}
            summaryMetrics={summaryMetrics}
            keyPoints={parsedKeyPoints}
            actionItems={parsedActionItems}
            quiz={Array.isArray(analysisData?.interactive_quiz) ? analysisData.interactive_quiz : []}
            notesTokens={tokenizedNotes}
          />
        );

      const blob = await pdf(docElement).toBlob();
      const localUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = localUrl;
      a.download = type === "transcript" ? `${fileName}_Transcript.pdf` : `${fileName}_StudyPack.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(localUrl);
    } catch (error) {
      console.error("PDF generation pipeline failed:", error);
      alert("Failed to build PDF. Please try again.");
    } finally {
      setIsResourcesModalOpen(false);
      setIsDownloading(false);
    }
  };

  const toggleActionItem = (idx) => {
    setCompletedActions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const actionProgressPercent = useMemo(() => {
    if (parsedActionItems.length === 0) return 0;
    const count = Object.values(completedActions).filter(Boolean).length;
    return Math.round((count / parsedActionItems.length) * 100);
  }, [completedActions, parsedActionItems]);

  const TABS = [
    { id: "summary", label: "Summary", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg> },
    { id: "full_notes", label: "Full Notes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { id: "key_points", label: "Key Points", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: "action_items", label: "Action Items", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { id: "interactive_quiz", label: "Quiz", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { id: "transcript", label: "Transcript", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg> }
  ];

  const handleOptionClick = (questionIndex, optionKey) => {
    if (selectedAnswers[questionIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionKey }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in pb-16 pt-4 px-4 lg:px-6 relative select-none">
      
      <style dangerouslySetInnerHTML={{__html: `
        .results-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: transparent;
          border-radius: 99px;
        }
        .results-slider::-webkit-slider-runnable-track {
          width: 100%; height: 6px; cursor: pointer;
          background: rgba(99, 102, 241, 0.2); border-radius: 99px;
        }
        .dark .results-slider::-webkit-slider-runnable-track { background: rgba(99, 102, 241, 0.3); }
        .results-slider::-webkit-slider-thumb {
          height: 14px; width: 14px; border-radius: 50%;
          background: #6366f1; cursor: pointer; -webkit-appearance: none;
          margin-top: -4px; box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
          transition: transform 0.1s;
        }
        .results-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        
        .tabs-container {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #818cf8 transparent;
        }
        .tabs-container::-webkit-scrollbar { height: 6px; }
        .tabs-container::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .tabs-container::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.5); border-radius: 10px; }
        .tabs-container::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.8); }

        .audio-table-scroll::-webkit-scrollbar { width: 5px; height: 6px; }
        .audio-table-scroll::-webkit-scrollbar-track { background: transparent; }
        .audio-table-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
      `}} />

      {/* 🚀 RESOURCES DOWNLOAD MODAL (PORTAL FIXED TO VIEWPORT) */}
      {isResourcesModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div 
            onClick={() => !isDownloading && setIsResourcesModalOpen(false)}
            className="absolute inset-0 cursor-pointer"
          />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center relative z-10 animate-scale-in">
            <button 
              onClick={() => !isDownloading && setIsResourcesModalOpen(false)} 
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              {isDownloading ? (
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Export Pack</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
              {isDownloading ? "Synthesizing executive PDF export..." : "Select the asset format to save locally to your device."}
            </p>
            <div className={`flex flex-col gap-3 ${isDownloading ? "opacity-50 pointer-events-none" : ""}`}>
              <button 
                onClick={() => handleDownload("audio")} 
                className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg> 
                  Original Audio Stream
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">.webm</span>
              </button>
              <button 
                onClick={() => handleDownload("transcript")} 
                className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg> 
                  Transcript PDF
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">.pdf</span>
              </button>
              <button 
                onClick={() => handleDownload("notes")} 
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-between shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-98"
              >
                <span className="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> 
                  Complete Study Pack
                </span>
                <span className="text-[10px] font-mono text-white/80 uppercase">.pdf</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── HEADER PIPELINE ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-200/50 dark:border-indigo-500/20">
              Analyzed Session
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-3">
             {fileName}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
          <button 
            onClick={() => setIsResourcesModalOpen(true)} 
            className="whitespace-nowrap flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 px-5 rounded-xl font-black uppercase tracking-wider shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Resources
          </button>
          <button 
            onClick={onReset} 
            className="whitespace-nowrap flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 px-5 rounded-xl font-black uppercase tracking-wider shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> Record New
          </button>
          <button 
            onClick={onChat} 
            className="whitespace-nowrap w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3 px-5 rounded-xl font-black uppercase tracking-wider shadow-md shadow-indigo-500/20 transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> Tutor Chat
          </button>
        </div>
      </div>

      {/* ── EMBEDDED CUSTOM AUDIO PLAYER ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {audioUrl ? (
          <>
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onTimeUpdate={() => {
                setCurrentTime(audioRef.current?.currentTime || 0);
                if (audioRef.current?.duration && isFinite(audioRef.current.duration) && audioRef.current.duration > 0 && duration !== audioRef.current.duration) {
                  setDuration(audioRef.current.duration);
                }
              }} 
              onLoadedMetadata={(e) => {
                const d = e.target.duration;
                if (isFinite(d) && d > 0) setDuration(d);
                else if (audioData?.duration && isFinite(audioData.duration) && audioData.duration > 0) {
                  setDuration(audioData.duration);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              className="hidden" 
            />
            <div className="flex items-center gap-3 shrink-0">
               <button onClick={() => skipTime(-10)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
               </button>
               <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 transition-transform active:scale-95 cursor-pointer">
                 {isPlaying ? (
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                 )}
               </button>
               <button onClick={() => skipTime(10)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
               </button>
            </div>
            <div className="flex-1 w-full flex flex-col pt-1">
               <input 
                  type="range" min="0" max={safeDuration > 0 ? safeDuration : 100} value={currentTime} onChange={handleSeek}
                  className="results-slider mb-2"
                  style={{ background: `linear-gradient(to right, #6366f1 ${progressPercent}%, transparent ${progressPercent}%)` }}
                />
                <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(safeDuration)}</span>
                </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 text-slate-400">
             <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             <span className="text-xs font-mono">Initializing player...</span>
          </div>
        )}
      </div>

      {/* ── 6-TAB MATRIX NAVIGATION ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm tabs-container mb-1">
        <div className="flex w-max sm:w-full min-w-full gap-2 pb-1 sm:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all rounded-xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-xs" 
                  : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className={activeTab === tab.id ? "opacity-100 text-indigo-600 dark:text-indigo-400" : "opacity-60"}>{tab.icon}</div>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT RENDERER VIEWPORT ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm min-h-[420px]">
        
        {/* TAB 1: CUTE & MODERN EXECUTIVE SUMMARY */}
        {activeTab === "summary" && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/30 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-200">Executive Briefing</h3>
                  <p className="text-[10px] font-mono text-slate-500">Core Cognitive Synthesis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/80 dark:bg-slate-900/80 rounded-lg text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                  {summaryMetrics.wordCount} words
                </span>
                <span className="px-3 py-1 bg-white/80 dark:bg-slate-900/80 rounded-lg text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                  ~{summaryMetrics.readTimeMinutes} min read
                </span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-[15px] sm:text-base leading-relaxed font-sans font-medium p-2">
              <MarkdownRenderer text={analysisData?.summary || "*No executive summary generated for this session.*"} />
            </div>
          </div>
        )}

        {/* TAB 2: FULL NOTES WITH TOKENIZED TABLES & LATEX */}
        {activeTab === "full_notes" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 animate-fade-in">
            {tokenizedNotes.length === 0 ? (
              <p className="text-slate-500 text-center py-12 font-mono text-xs uppercase tracking-widest">No detailed notes generated.</p>
            ) : (
              tokenizedNotes.map((token, tIdx) => {
                if (token.type === "table") {
                  const tableLines = token.content.split("\n").map((l) => l.trim()).filter(Boolean);
                  if (tableLines.length < 2) return null;
                  const headers = tableLines[0].split("|").filter(Boolean).map((h) => h.trim());
                  let dataStartIndex = 1;
                  if (tableLines[1] && tableLines[1].replace(/[-:| ]/g, "") === "") {
                    dataStartIndex = 2;
                  }
                  const bodyLines = tableLines.slice(dataStartIndex).map((line) => line.split("|").filter(Boolean).map((c) => c.trim()));

                  return (
                    <div key={`table-${tIdx}`} className="audio-table-scroll w-full overflow-x-auto my-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[550px]">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                            {headers.map((h, i) => (
                              <th key={i} className="p-3.5 font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                <MarkdownRenderer text={h} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {bodyLines.map((row, i) => (
                            <tr key={i} className="even:bg-slate-50/50 dark:even:bg-slate-900/30 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-colors">
                              {row.map((cell, j) => (
                                <td key={j} className="p-3.5 text-slate-700 dark:text-slate-300 font-medium align-top">
                                  <MarkdownRenderer text={cell} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return (
                  <div key={`text-${tIdx}`} className="audio-table-scroll w-full overflow-x-auto max-w-full break-words prose dark:prose-invert prose-indigo text-slate-800 dark:text-slate-200 text-[15px] sm:text-base leading-relaxed">
                    <MarkdownRenderer text={token.content} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: ELEVATED BENTO KEY POINTS */}
        {activeTab === "key_points" && (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto animate-fade-in">
            {parsedKeyPoints.length === 0 ? (
              <p className="text-slate-500 text-center py-12 font-mono text-xs uppercase tracking-widest">No key points generated.</p>
            ) : (
              parsedKeyPoints.map((point, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-slate-800 dark:text-slate-200 text-sm sm:text-[15px] font-medium leading-relaxed">
                    <MarkdownRenderer text={point} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: INTERACTIVE ACTION ITEMS CHECKLIST */}
        {activeTab === "action_items" && (
          <div className="flex flex-col gap-5 max-w-4xl mx-auto animate-fade-in">
            {parsedActionItems.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">Goal Completion</span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{actionProgressPercent}% Checked</span>
              </div>
            )}

            {parsedActionItems.length === 0 ? (
              <p className="text-slate-500 text-center py-12 font-mono text-xs uppercase tracking-widest">No action items generated.</p>
            ) : (
              parsedActionItems.map((item, index) => {
                const isChecked = !!completedActions[index];
                return (
                  <div 
                    key={index}
                    onClick={() => toggleActionItem(index)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                      isChecked
                        ? "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/40 dark:border-slate-800 opacity-60"
                        : "bg-white dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:border-indigo-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    }`}>
                      {isChecked && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    <div className={`flex-1 text-sm sm:text-[15px] font-medium leading-relaxed ${isChecked ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                      <MarkdownRenderer text={item} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 5: SELF-ASSESSMENT QUIZ */}
        {activeTab === "interactive_quiz" && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto py-2 animate-fade-in">
            {!Array.isArray(analysisData?.interactive_quiz) || analysisData.interactive_quiz.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p className="text-xs font-mono uppercase tracking-widest font-bold">No interactive quiz generated.</p>
              </div>
            ) : (
              analysisData.interactive_quiz.map((q, index) => {
                const isAnswered = !!selectedAnswers[index];
                const selectedKey = selectedAnswers[index];
                
                return (
                  <div key={index} className="bg-slate-50/70 dark:bg-slate-800/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed flex items-start gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-black shrink-0">{index + 1}</span>
                      {q.question}
                    </h3>
                    
                    <div className="flex flex-col gap-3 ml-0 sm:ml-11">
                      {Object.entries(q.options || {}).map(([key, value]) => {
                        let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400";
                        
                        if (isAnswered) {
                          if (key === q.correct_answer) {
                            btnClass = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/50";
                          } else if (key === selectedKey) {
                            btnClass = "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-800 dark:text-red-300";
                          } else {
                            btnClass = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40";
                          }
                        }

                        return (
                          <button 
                            key={key}
                            onClick={() => handleOptionClick(index, key)}
                            disabled={isAnswered}
                            className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base font-medium transition-all ${btnClass} ${!isAnswered ? "active:scale-[0.99] cursor-pointer" : "cursor-default"} flex items-center`}
                          >
                            <span className="font-black mr-4 text-slate-400 w-5 inline-block">{key}.</span> 
                            <span className="flex-1">{value}</span>
                            
                            {isAnswered && key === q.correct_answer && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 ml-2 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                            {isAnswered && key === selectedKey && key !== q.correct_answer && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 ml-2 shrink-0"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="mt-6 ml-0 sm:ml-11 p-5 bg-indigo-50/80 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex gap-3.5 items-start">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">i</div>
                        <p className="text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                          <span className="font-black uppercase tracking-wider block text-[10px] text-indigo-500 mb-1">Pedagogical Explanation</span>
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 6: CLICK-TO-SEEK TRANSCRIPT */}
        {activeTab === "transcript" && (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto animate-fade-in">
            {parsedTranscript.length === 0 ? (
              <p className="text-slate-500 text-center py-12 font-mono text-xs uppercase tracking-widest">No transcript generated for this audio file.</p>
            ) : (
              parsedTranscript.map((block) => (
                <div key={block.id} className="flex flex-col gap-1.5 group">
                  <div className="flex items-center gap-2 px-1">
                    <button 
                      onClick={() => handleSeekToSeconds(block.totalSeconds)}
                      className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Jump audio to this timestamp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      {block.time || "00:00"}
                    </button>
                    {block.speaker && (
                      <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {block.speaker}
                      </span>
                    )}
                  </div>
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/70 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 text-sm leading-relaxed shadow-xs group-hover:border-indigo-200 dark:group-hover:border-indigo-900/40 transition-colors">
                     {block.content}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
      
    </div>
  );
}