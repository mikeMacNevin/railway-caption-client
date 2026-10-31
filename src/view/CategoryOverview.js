import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./CategoryOverview.scss";

// "The day in ___ news" - keyed by route slug.
const LABELS = {
  politics: "politics",
  finance: "finance",
  world: "world",
  sports: "sports",
  tech: "tech",
  celebs: "celebrity",
  movies: "movie",
  tv: "TV",
  videogames: "video game",
  travel: "travel",
  health: "health",
  science: "science",
};

// The Front Page has no category of its own - it shows the site-wide daily
// briefing instead, which comes back in the same headline + paragraphs shape.
const HOME = "home";

function kicker(page) {
  return page === HOME ? "Today's briefing" : `The day in ${LABELS[page]} news`;
}

function endpoint(page) {
  return page === HOME ? "/api/summary" : `/api/summary/category/${page}`;
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// server.js writes the overview into the page's initial HTML for crawlers
// and leaves a copy in window.__CATEGORY_OVERVIEW__, so the first render can
// use it instead of fetching again (and the text doesn't flash out and back).
function takePreloaded(page) {
  const pre = typeof window !== "undefined" ? window.__CATEGORY_OVERVIEW__ : null;
  if (!pre || pre.page !== page) return null;
  window.__CATEGORY_OVERVIEW__ = null;
  return pre;
}

// The daily written overview beside (desktop) or above (mobile) a page's
// headlines. Starts collapsed to the headline and the first couple of lines,
// with "Read more" for the rest. Renders nothing when there isn't a recent
// one - the page is then just headlines, exactly as before.
function CategoryOverview({ page = HOME }) {
  const [overview, setOverview] = useState(() => takePreloaded(page));
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
    if (page !== HOME && !LABELS[page]) return undefined;
    if (overview && overview.page === page) return undefined;

    let cancelled = false;
    setOverview(null);
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    axios
      .get(`${API_URL}${endpoint(page)}`)
      .then((response) => {
        if (!cancelled) setOverview({ ...response.data, page });
      })
      .catch(() => {
        // 404 just means no overview yet - nothing to show.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (!overview || overview.page !== page) return null;

  return (
    <section
      className={`category-overview${expanded ? " expanded" : ""}`}
      aria-label={kicker(page)}
    >
      <p className="category-overview-kicker">
        {kicker(page)} · {formatDate(overview.date)}
      </p>
      <h2 className="category-overview-headline">{overview.headline}</h2>
      <div className="category-overview-body" id="category-overview-body">
        {overview.paragraphs.map((paragraph, i) => (
          <div className="category-overview-paragraph" key={i}>
            <p>{paragraph.text}</p>
            <p className="category-overview-sources">
              Sources:{" "}
              {paragraph.articles.map((article, j) => (
                <span key={article.url}>
                  {j > 0 && ", "}
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.source}
                  </a>
                </span>
              ))}
            </p>
          </div>
        ))}
        {page === HOME && (
          <Link className="category-overview-more" to="/briefing">
            Open the full briefing
          </Link>
        )}
      </div>
      <button
        type="button"
        className="category-overview-toggle"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="category-overview-body"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </section>
  );
}

export default CategoryOverview;
