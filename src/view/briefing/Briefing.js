import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import LoadingScreen from "../loading/LoadingScreen";
import { PAGE_META, DEFAULT_IMAGE } from "../../seoMeta";
import "./Briefing.scss";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// Same grace period Home uses, so a fast load doesn't flash the loading screen.
const LOADING_SCREEN_DELAY_MS = 500;

// "2026-09-20" -> "Sunday, September 20, 2026". Parsed at noon so the
// date can't slip a day from the viewer's timezone offset.
function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// Two links from one outlet get a number so they're distinguishable.
function sourceLabels(articles) {
  const totals = {};
  articles.forEach((a) => { totals[a.source] = (totals[a.source] || 0) + 1; });
  const seen = {};
  return articles.map((a) => {
    seen[a.source] = (seen[a.source] || 0) + 1;
    return totals[a.source] > 1 ? `${a.source} ${seen[a.source]}` : a.source;
  });
}

// For /briefing routes the client server (server.js) writes the briefing into
// the page it serves - for crawlers - and also exposes it as
// window.__BRIEFING__. The first render can start from that instead of
// showing a loading state and fetching what the page already contains.
function readPreloaded(pathname) {
  const pre = typeof window !== "undefined" ? window.__BRIEFING__ : null;
  return pre && pre.path === pathname.replace(/\/$/, "") ? pre : null;
}

function Briefing() {
  const { date } = useParams();
  const { pathname } = useLocation();

  // Read once, on the very first render; consumed by the effect below so a
  // later navigation to another briefing fetches normally.
  const preloadedRef = useRef(undefined);
  if (preloadedRef.current === undefined) preloadedRef.current = readPreloaded(pathname);
  const preloaded = preloadedRef.current;

  const [briefing, setBriefing] = useState(preloaded ? preloaded.briefing : null);
  const [archive, setArchive] = useState(preloaded ? preloaded.archive : []);
  const [status, setStatus] = useState(preloaded ? "ok" : "loading"); // loading | ok | missing | error
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const hadPreloadedArchive = useRef(Boolean(preloaded && preloaded.archive.length > 0));

  useEffect(() => {
    if (preloadedRef.current) {
      // First render already has this briefing - nothing to fetch. Clear the
      // page-level copy too, so coming back to /briefing later in this tab
      // fetches a fresh one instead of reusing this (by then stale) one.
      preloadedRef.current = null;
      window.__BRIEFING__ = null;
      return undefined;
    }

    window.scrollTo(0, 0);
    setStatus("loading");
    setBriefing(null);
    setShowLoadingScreen(false);
    const timer = setTimeout(() => setShowLoadingScreen(true), LOADING_SCREEN_DELAY_MS);

    axios
      .get(date ? `${API_URL}/api/summary/${date}` : `${API_URL}/api/summary`)
      .then((response) => {
        setBriefing(response.data);
        setStatus("ok");
      })
      .catch((err) => {
        // A 404 just means there's no briefing (yet) - not a failure.
        setStatus(err.response && err.response.status === 404 ? "missing" : "error");
      })
      .finally(() => {
        clearTimeout(timer);
        setShowLoadingScreen(false);
      });

    return () => clearTimeout(timer);
  }, [date]);

  useEffect(() => {
    if (hadPreloadedArchive.current) return;
    axios
      .get(`${API_URL}/api/summary/archive`)
      .then((response) => setArchive(response.data.briefings || []))
      .catch(() => setArchive([]));
  }, []);

  const meta = PAGE_META.briefing;
  const canonical = `https://www.caption.news/briefing${date ? `/${date}` : ""}`;
  const currentDate = briefing ? briefing.date : date;
  const earlier = archive.filter((item) => item.date !== currentDate).slice(0, 7);

  if (status === "loading") {
    return showLoadingScreen ? <LoadingScreen /> : null;
  }

  const title = status === "ok" ? `${briefing.headline} | caption.news` : `${meta.title} | caption.news`;
  const description = status === "ok" ? briefing.dek : meta.description;

  return (
    <div className="container briefing-container pt-1">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />
      </Helmet>

      <div className="container-fluid px-0">
        <h2 className="current-page">{meta.title}</h2>
      </div>

      {status !== "ok" && (
        <div className="briefing-empty">
          <p>
            {status === "missing"
              ? "No briefing is available for this date yet — check back soon."
              : "The briefing couldn’t be loaded right now. Please try again in a moment."}
          </p>
          <Link to="/">Back to the front page</Link>
        </div>
      )}

      {status === "ok" && (
        <article className="briefing">
          <p className="briefing-meta">
            {formatDate(briefing.date)}
            <span aria-hidden="true"> · </span>
            Updated {formatTime(briefing.generatedAt)}
          </p>
          <h1 className="briefing-headline">{briefing.headline}</h1>
          <p className="briefing-dek">{briefing.dek}</p>

          {briefing.paragraphs.map((paragraph, i) => {
            const labels = sourceLabels(paragraph.articles);
            return (
              <section className="briefing-paragraph" key={i}>
                <p>{paragraph.text}</p>
                <p className="briefing-sources">
                  <span className="briefing-sources-label">Sources</span>
                  {paragraph.articles.map((article, j) => (
                    <a
                      key={article.url}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={article.title}
                    >
                      {labels[j]}
                    </a>
                  ))}
                </p>
              </section>
            );
          })}

          <p className="briefing-note">
            This briefing is written by AI from the {briefing.articleCount} most relevant headlines
            currently on caption.news, weighted toward the front page and the newest stories.
            It can make mistakes — follow the source links for the full reporting.
          </p>
        </article>
      )}

      {earlier.length > 0 && (
        <nav className="briefing-archive" aria-label="Earlier briefings">
          <h3>Earlier briefings</h3>
          <ul>
            {earlier.map((item) => (
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
    </div>
  );
}

export default Briefing;
