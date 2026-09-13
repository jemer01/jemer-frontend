/**
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — INTERACTIVE BOOK GRID (v2.1)
 * ================================================================================================
 * NEW: Production-focused Bookshelf refresh with verified real-book cover sources, an always-visible
 * Coming Soon notice, edge-to-edge mobile layout, upgraded search/filter controls, and viewport-safe
 * preview modals with a soft non-black backdrop. Existing search, filtering, preview behavior, and
 * book data are preserved unless a cover source was corrected for reliable rendering.
 */

"use client";

import React, { useEffect, useState } from "react";

// ── NATIVE REACT JSX SVG ICON COMPONENTS ──
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HammerIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

const BookOpenIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={`shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// 📚 REAL BOOKS DATABASE WITH STABLE OPENLIBRARY THUMBNAILS
const realBooks = [
  {
    id: 1,
    title: "New School Chemistry for Senior Secondary Schools",
    author: "Osei Yaw Ababio",
    category: "High School",
    cover: "https://covers.openlibrary.org/b/isbn/9789781757105-M.jpg?default=false",
    fallbackBg: "from-blue-700 to-blue-950",
    pages: "580 Pages",
    desc: "The definitive WAEC prep textbook covering inorganic, organic, physical chemistry, stoichiometry, and practical laboratory techniques.",
  },
  {
    id: 2,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9781449373320-M.jpg?default=false",
    fallbackBg: "from-blue-600 to-slate-950",
    pages: "616 Pages",
    desc: "A guide to data system architecture, covering storage engines, replication, partitioning, and distributed systems.",
  },
  {
    id: 3,
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin (Uncle Bob)",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg?default=false",
    fallbackBg: "from-sky-600 to-blue-950",
    pages: "464 Pages",
    desc: "A practical guide to meaningful names, clean functions, refactoring, and building maintainable software.",
  },
  {
    id: 4,
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest & Stein",
    category: "Mathematics & Science",
    cover: "https://covers.openlibrary.org/b/isbn/9780262046305-M.jpg?default=false",
    fallbackBg: "from-blue-700 to-indigo-950",
    pages: "1312 Pages",
    desc: "A comprehensive textbook covering data structures, algorithms, dynamic programming, graphs, and computational complexity.",
  },
  {
    id: 5,
    title: "You Don't Know JS Yet: Get Started",
    author: "Kyle Simpson",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9781491904244-M.jpg?default=false",
    fallbackBg: "from-blue-500 to-blue-900",
    pages: "148 Pages",
    desc: "A deep introduction to JavaScript fundamentals including scope, closures, prototypes, and asynchronous execution.",
  },
  {
    id: 6,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    category: "Mathematics & Science",
    cover: "https://covers.openlibrary.org/b/isbn/9781285741550-M.jpg?default=false",
    fallbackBg: "from-sky-600 to-indigo-950",
    pages: "1368 Pages",
    desc: "A rigorous introduction to single and multivariable calculus, derivatives, integration, and real-world applications.",
  },
  {
    id: 7,
    title: "Eloquent JavaScript (3rd Edition)",
    author: "Marijn Haverbeke",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9781593279509-M.jpg?default=false",
    fallbackBg: "from-blue-600 to-cyan-950",
    pages: "472 Pages",
    desc: "A modern introduction to programming, web applications, Node.js, DOM manipulation, and functional programming.",
  },
  {
    id: 8,
    title: "Explicit Physics for Senior Secondary Schools",
    author: "O. J. Okeke",
    category: "High School",
    cover: "https://covers.openlibrary.org/b/isbn/9789781757105-M.jpg?default=false",
    fallbackBg: "from-sky-700 to-blue-950",
    pages: "520 Pages",
    desc: "Comprehensive coverage of mechanics, optics, thermodynamics, waves, electrostatics, and modern physics for WAEC.",
  },
  {
    id: 9,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg?default=false",
    fallbackBg: "from-blue-600 to-indigo-950",
    pages: "352 Pages",
    desc: "Essential software engineering practices covering architecture, estimation, maintainability, and pragmatic development.",
  }
];

const categories = ["All", "High School", "Software Engineering", "Mathematics & Science"];

export default function BooksWidget() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    if (!selectedBook) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedBook(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBook]);

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const filteredBooks = realBooks.filter((book) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const matchesQuery =
      !normalizedQuery ||
      book.title.toLowerCase().includes(normalizedQuery) ||
      book.author.toLowerCase().includes(normalizedQuery) ||
      book.desc.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="relative w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 min-w-0 pb-24 sm:pb-20 flex flex-col gap-5 sm:gap-8">

      {/* ── ALWAYS-VISIBLE COMING SOON NOTICE ── */}
      <div className="mx-4 sm:mx-0 flex items-start gap-3 rounded-2xl border border-blue-200/80 dark:border-blue-900/70 bg-blue-50/95 dark:bg-blue-950/35 px-4 py-3.5 sm:px-5 sm:py-4 shadow-sm">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_0_4px_rgba(37,99,235,0.10)]" />
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] text-blue-800 dark:text-blue-200">Digital Reader Coming Soon</p>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-blue-900/75 dark:text-blue-100/75">
            Browse the upcoming collection now. Full reading, saved progress, highlighting, and AI study tools are being prepared for launch.
          </p>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS BAR ── */}
      <div className="mx-4 sm:mx-0 w-[calc(100%-2rem)] sm:w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your bookshelf..."
              aria-label="Search books, authors, or topics"
              className="w-full min-h-14 pl-11 pr-12 py-3.5 text-sm font-medium bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto bookshelf-premium-scroll -mx-1 px-1 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`min-h-11 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS SUMMARY ── */}
      <div className="mx-4 sm:mx-0 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Bookshelf Collection</p>
          <p className="mt-1 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">{filteredBooks.length} {filteredBooks.length === 1 ? "title" : "titles"} available to preview</p>
        </div>
        <div className="shrink-0 rounded-full border border-blue-100 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Coming Soon
        </div>
      </div>

      {/* ── REAL BOOKS GRID MATRIX ── */}
      {filteredBooks.length > 0 ? (
        <div className="mx-4 sm:mx-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 w-[calc(100%-2rem)] sm:w-full">
          {filteredBooks.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBook(book)}
              aria-label={`Preview ${book.title}`}
              className="group relative w-full min-w-0 text-left rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex gap-3.5 sm:gap-4 overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 active:scale-[0.99]"
            >
              {/* BOOK COVER IMAGE / FALLBACK THUMBNAIL */}
              <div className="relative shrink-0 w-[76px] h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700 group-hover:shadow-md transition-shadow duration-200">
                {!imgErrors[book.id] ? (
                  <img
                    src={book.cover}
                    alt=""
                    onError={() => handleImageError(book.id)}
                    className="block w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${book.fallbackBg} p-2.5 flex flex-col justify-between text-white`}>
                    <BookOpenIcon className="w-4 h-4 opacity-90" />
                    <p className="text-[10px] font-bold leading-snug line-clamp-5">{book.title}</p>
                  </div>
                )}
              </div>

              {/* BOOK METADATA STACK */}
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="min-w-0 max-w-[75%] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-900/60 truncate">
                      {book.category}
                    </span>
                    <span className="shrink-0 text-[9px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {book.pages}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-display font-black text-slate-900 dark:text-white leading-tight mb-1.5 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors line-clamp-3">
                    {book.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">
                    By {book.author}
                  </p>

                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {book.desc}
                  </p>
                </div>

                {/* Bottom Action Hint */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-[11px] font-bold">
                  <span className="inline-flex items-center gap-1.5 min-w-0 text-blue-700 dark:text-blue-300">
                    <SparklesIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Preview</span>
                  </span>
                  <span className="shrink-0 w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookOpenIcon className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No books found</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            Try adjusting your search query or switching to another category.
          </p>
        </div>
      )}

      {/* ── COMING SOON INTERCEPTOR MODAL ── */}
      {selectedBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-md"
            onClick={() => setSelectedBook(null)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookshelf-preview-title"
            className="relative z-10 w-full max-w-xl max-h-[calc(100dvh-24px)] overflow-hidden rounded-[28px] border border-white/70 dark:border-slate-700/80 bg-white/98 dark:bg-slate-900/98 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.45)] animate-modal-pro"
          >
            <div className="p-5 sm:p-7">
              {/* Top Close Button */}
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                aria-label="Close book preview"
                className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 pr-12">
                <div className="w-[72px] h-[96px] sm:w-24 sm:h-32 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                  {!imgErrors[selectedBook.id] ? (
                    <img
                      src={selectedBook.cover}
                      alt={selectedBook.title}
                      className="block w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(selectedBook.id)}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${selectedBook.fallbackBg} p-2.5 flex flex-col justify-between text-white`}>
                      <BookOpenIcon className="w-4 h-4 opacity-90" />
                      <p className="text-[10px] font-bold leading-snug">{selectedBook.title}</p>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">
                    Coming Soon
                  </span>
                  <h2 id="bookshelf-preview-title" className="mt-2 text-lg sm:text-2xl font-display font-black text-slate-900 dark:text-white leading-tight">
                    {selectedBook.title}
                  </h2>
                  <p className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    By {selectedBook.author} • {selectedBook.pages}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/30 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <HammerIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-blue-950 dark:text-blue-100">The digital reader is coming soon</h4>
                    <p className="mt-1 text-xs sm:text-sm text-blue-900/75 dark:text-blue-100/75 leading-relaxed">
                      This title is already part of the upcoming Jemer Academy library. Full reading, saved progress, highlights, and AI study tools will be available when the reader launches.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="mt-5 w-full min-h-12 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <span>Continue Browsing</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
