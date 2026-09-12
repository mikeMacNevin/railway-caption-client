import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import Headline from "../headlines/Headline";
import { PAGE_META } from "../../seoMeta";
import "./Search.scss";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // Separate from urlQuery so every keystroke feels instant - the URL (and
  // the actual fetch) only catches up after the debounce below settles.
  const [inputValue, setInputValue] = useState(urlQuery);
  const [results, setResults] = useState([]);
  const [activeSource, setActiveSource] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const meta = PAGE_META.search;
  const pageTitle = `${meta.title} | caption.news`;

  // Keeps the input in sync with the URL when ?q= changes from outside a
  // keystroke here - back/forward navigation, or arriving via a shared link.
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  const runSearch = useCallback((term) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const trimmed = term.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    axios
      .get(`${API_URL}/api/search`, { params: { q: trimmed }, signal: controller.signal })
      .then((response) => {
        setResults(response.data.articles || []);
        setHasSearched(true);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // superseded by a newer keystroke
        console.log("search fetch error:", err);
        setResults([]);
        setHasSearched(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // The URL's ?q= is the single source of truth a search actually runs
  // against, so typing and arriving via a shared link both go through the
  // same path.
  useEffect(() => {
    runSearch(urlQuery);
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [urlQuery, runSearch]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setInputValue(value);
    setActiveSource("all");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchParams(value ? { q: value } : {}, { replace: true });
    }, DEBOUNCE_MS);
  }

  const sources = Array.from(new Set(results.map((a) => a.source))).sort();
  const visibleResults =
    activeSource === "all" ? results : results.filter((a) => a.source === activeSource);

  return (
    <div className="container search-container pt-1">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={meta.description} />
        {/* Every query renders this same route with different results - not
            worth indexing, and would otherwise compete with the category
            pages for the same headlines. */}
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Desktop's search box lives in Navbar.js instead, next to the
          category links - this one is the mobile equivalent, reached via
          the search icon in Header.js. */}
      <div className="search-input-row d-md-none">
        <svg
          className="search-input-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search headlines"
          value={inputValue}
          onChange={handleChange}
          autoFocus
          aria-label="Search headlines"
        />
      </div>

      {urlQuery.trim().length > 0 && urlQuery.trim().length < MIN_QUERY_LENGTH && (
        <p className="search-hint">Keep typing — at least {MIN_QUERY_LENGTH} characters.</p>
      )}

      {hasSearched && !isLoading && (
        <div className="search-meta">
          <span className="search-count">
            <b>{results.length}</b> result{results.length === 1 ? "" : "s"} for &ldquo;{urlQuery}&rdquo;
          </span>
        </div>
      )}

      {sources.length > 1 && (
        <div className="search-chips">
          <button
            type="button"
            className={`search-chip${activeSource === "all" ? " active" : ""}`}
            onClick={() => setActiveSource("all")}
          >
            All sources
          </button>
          {sources.map((source) => (
            <button
              key={source}
              type="button"
              className={`search-chip${activeSource === source ? " active" : ""}`}
              onClick={() => setActiveSource(source)}
            >
              {source}
            </button>
          ))}
        </div>
      )}

      {hasSearched && !isLoading && results.length === 0 && (
        <p className="search-empty">No headlines match &ldquo;{urlQuery}&rdquo;.</p>
      )}

      {visibleResults.length > 0 && (
        <div className="headline-feed">
          {visibleResults.map((article) => (
            <Headline key={article.url} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
