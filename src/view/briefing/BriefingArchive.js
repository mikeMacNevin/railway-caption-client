import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import { PAGE_META, DEFAULT_IMAGE } from "../../seoMeta";
import "./Briefing.scss";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const CANONICAL = "https://www.caption.news/briefing/archive";

// "2026-09-20" -> "Sunday, September 20, 2026" (noon, so the viewer's
// timezone can't shift the day).
function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// client/server.js writes the list into the served page and exposes it as
// window.__BRIEFING_ARCHIVE__, so the first render needs no fetch.
function readPreloaded() {
  const pre = typeof window !== "undefined" ? window.__BRIEFING_ARCHIVE__ : null;
  return Array.isArray(pre) ? pre : null;
}

function BriefingArchive() {
  const preloadedRef = useRef(undefined);
  if (preloadedRef.current === undefined) preloadedRef.current = readPreloaded();

  const [briefings, setBriefings] = useState(preloadedRef.current || []);
  const [status, setStatus] = useState(preloadedRef.current ? "ok" : "loading"); // loading | ok | error

  useEffect(() => {
    if (preloadedRef.current) {
      // Clear the page-level copy so a later visit in this tab fetches fresh.
      preloadedRef.current = null;
      window.__BRIEFING_ARCHIVE__ = null;
      return;
    }
    window.scrollTo(0, 0);
    axios
      .get(`${API_URL}/api/summary/archive`)
      .then((response) => {
        setBriefings(response.data.briefings || []);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  const meta = PAGE_META.briefingArchive;
  const title = `${meta.title} | caption.news`;

  return (
    <div className="container briefing-container pt-1">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />
      </Helmet>

      <div className="container-fluid px-0">
        <h2 className="current-page">{meta.title}</h2>
      </div>

      {status === "error" && (
        <div className="briefing-empty">
          <p>The archive couldn’t be loaded right now. Please try again in a moment.</p>
        </div>
      )}

      {status === "ok" && briefings.length === 0 && (
        <div className="briefing-empty">
          <p>No briefings yet — check back soon.</p>
        </div>
      )}

      {status === "ok" && briefings.length > 0 && (
        <nav className="briefing-archive briefing-archive-full" aria-label="All briefings">
          <ul>
            {briefings.map((item) => (
              <li key={item.date}>
                <Link to={`/briefing/${item.date}`}>
                  <span className="briefing-archive-date">{formatDate(item.date)}</span>
                  <span className="briefing-archive-headline">{item.headline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className="briefing-archive-back">
        <Link to="/briefing">Today’s briefing</Link>
      </p>
    </div>
  );
}

export default BriefingArchive;
