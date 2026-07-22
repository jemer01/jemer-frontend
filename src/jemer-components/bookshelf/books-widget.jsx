/**
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — INTERACTIVE BOOK GRID (v2.0)
 * ================================================================================================
 * SUMMARY: Upgraded digital library with real academic textbooks and native JSX SVGs.
 * 1. Native JSX SVGs: Replaced standard FontAwesome tags with optimized inline React SVGs.
 * 2. Real World Books: Curated real textbooks for WAEC, STEM, and Software Engineering.
 * 3. Search & Category Filter: Instant live search and category pill filtering.
 * 4. Coming Soon Interceptor: Detailed preview modal for each selected book.
 */

"use client";

import React, { useState } from "react";

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
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// 📚 REAL BOOKS DATABASE WITH OPENLIBRARY & ACADEMIC COVER THUMBNAILS
const realBooks = [
  {
    id: 1,
    title: "New School Chemistry for Senior Secondary Schools",
    author: "Osei Yaw Ababio",
    category: "WAEC & High School",
    cover: "https://covers.openlibrary.org/b/isbn/9789781750105-L.jpg",
    fallbackBg: "from-emerald-600 to-teal-800",
    accentColor: "emerald",
    pages: "580 Pages",
    desc: "The definitive WAEC prep textbook covering inorganic, organic, physical chemistry, stoichiometry, and practical laboratory techniques.",
  },
  {
    id: 2,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg",
    fallbackBg: "from-blue-600 to-indigo-800",
    accentColor: "blue",
    pages: "616 Pages",
    desc: "The gold-standard guide to data system architecture, covering storage engines, replication, partitioning, and distributed consensus.",
  },
  {
    id: 3,
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin (Uncle Bob)",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    fallbackBg: "from-cyan-600 to-blue-800",
    accentColor: "cyan",
    pages: "464 Pages",
    desc: "A timeless manual on refactoring, writing meaningful names, constructing clean functions, and unit testing robust applications.",
  },
  {
    id: 4,
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest & Stein",
    category: "Mathematics & Science",
    cover: "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg",
    fallbackBg: "from-purple-600 to-indigo-900",
    accentColor: "purple",
    pages: "1312 Pages",
    desc: "The comprehensive textbook on data structures, dynamic programming, graph algorithms, and computational complexity theory.",
  },
  {
    id: 5,
    title: "You Don't Know JS Yet: Get Started",
    author: "Kyle Simpson",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9781491904244-L.jpg",
    fallbackBg: "from-amber-500 to-orange-700",
    accentColor: "amber",
    pages: "148 Pages",
    desc: "Deep dive into the core mechanics of JavaScript, scope chains, closures, prototypes, and asynchronous event loop execution.",
  },
  {
    id: 6,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    category: "Mathematics & Science",
    cover: "https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg",
    fallbackBg: "from-rose-600 to-red-800",
    accentColor: "rose",
    pages: "1368 Pages",
    desc: "Mathematical rigor and real-world application of single and multivariable calculus, derivatives, integration, and differential equations.",
  },
  {
    id: 7,
    title: "Eloquent JavaScript (3rd Edition)",
    author: "Marijn Haverbeke",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg",
    fallbackBg: "from-yellow-500 to-amber-700",
    accentColor: "yellow",
    pages: "472 Pages",
    desc: "A modern introduction to programming, web applications, node.js, DOM manipulation, and functional programming concepts.",
  },
  {
    id: 8,
    title: "Explicit Physics for Senior Secondary Schools",
    author: "O. J. Okeke",
    category: "WAEC & High School",
    cover: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop",
    fallbackBg: "from-teal-600 to-emerald-800",
    accentColor: "teal",
    pages: "520 Pages",
    desc: "Comprehensive coverage of mechanics, optics, thermodynamics, wave motion, electrostatics, and modern quantum physics for WAEC.",
  },
  {
    id: 9,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    category: "Software Engineering",
    cover: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg",
    fallbackBg: "from-sky-600 to-blue-800",
    accentColor: "sky",
    pages: "352 Pages",
    desc: "Essential career techniques covering software architecture, orthogonality, domain languages, estimation, and pragmatic philosophy.",
  }
];

const categories = ["All", "WAEC & High School", "Software Engineering", "Mathematics & Science"];

export default function BooksWidget() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const filteredBooks = realBooks.filter((book) => {
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const matchesQuery =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="relative w-full h-full pb-12 flex flex-col gap-8">
      
      {/* ── SEARCH & FILTER CONTROLS BAR ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, or topics..."
            className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 bookshelf-premium-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── REAL BOOKS GRID MATRIX ── */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group relative w-full rounded-[24px] bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 overflow-hidden transition-all duration-300 shadow-lg shadow-slate-200/40 dark:shadow-black/40 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99] cursor-pointer ring-1 ring-white/60 dark:ring-white/5"
            >
              {/* BOOK COVER IMAGE / FALLBACK THUMBNAIL CONTAINER */}
              <div className="relative shrink-0 w-full sm:w-28 h-40 sm:h-38 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
                {!imgErrors[book.id] ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    onError={() => handleImageError(book.id)}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${book.fallbackBg} p-3 flex flex-col justify-between text-white`}>
                    <div className="flex justify-between items-start">
                      <BookOpenIcon className="w-5 h-5 opacity-80" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
                        Textbook
                      </span>
                    </div>
                    <p className="text-xs font-bold leading-snug line-clamp-3">{book.title}</p>
                  </div>
                )}

                {/* Subtle Sheen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* BOOK METADATA STACK */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                      {book.category}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-slate-400">
                      {book.pages}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    By {book.author}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {book.desc}
                  </p>
                </div>

                {/* Bottom Action Hint */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <SparklesIcon />
                    <span>Read Preview</span>
                  </span>
                  <ArrowRightIcon className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookOpenIcon className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No books found</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            Try adjusting your search query or switching to another category.
          </p>
        </div>
      )}

      {/* ── COMING SOON INTERCEPTOR MODAL ── */}
      {selectedBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop Blur Lock */}
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fade-in cursor-pointer"
            onClick={() => setSelectedBook(null)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-modal-pro overflow-hidden z-10">
            
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <CloseIcon />
            </button>

            {/* Book Preview Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-28 h-40 shrink-0 rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
                {!imgErrors[selectedBook.id] ? (
                  <img
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${selectedBook.fallbackBg} p-3 flex flex-col justify-center text-white text-xs font-bold text-center`}>
                    {selectedBook.title}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                  {selectedBook.category}
                </span>

                <h2 className="text-xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  {selectedBook.title}
                </h2>

                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  By {selectedBook.author} • {selectedBook.pages}
                </p>
              </div>
            </div>

            {/* Development Notice Box */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                <HammerIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Jemer Academy Feature Building
                </h4>
                <p className="text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                  Our engineering team is currently integrating the digital reader engine and Supabase backend for this textbook. Full interactive reading, highlighting, and AI note synthesis will be enabled shortly.
                </p>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Understood</span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}