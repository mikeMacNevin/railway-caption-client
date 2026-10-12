import { useEffect, useState } from "react";
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

// The daily written overview above a category page's headlines. Renders
// nothing when there isn't a recent one - the page is then just headlines,
// exactly as before.
function CategoryOverview({ page }) {
  const [overview, setOverview] = useState(() => takePreloaded(page));

  useEffect(() => {
    if (!LABELS[page]) return undefined;
    if (overview && overview.page === page) return undefined;

    let cancelled = false;
    setOverview(null);
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    axios
      .get(`${API_URL}/api/summary/category/${page}`)
      .then((response) => {
        if (!cancelled) setOverview(response.data);
      })
      .catch(() => {
        // 404 just means no overview yet - nothing to show.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (!LABELS[page] || !overview || overview.page !== page) return null;

  return (
    <section className="category-overview" aria-label={`The day in ${LABELS[page]} news`}>
      <p className="category-overview-kicker">
        The day in {LABELS[page]} news · {formatDate(overview.date)}
      </p>
      <h2 className="category-overview-headline">{overview.headline}</h2>
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
    </section>
  );
}

export default CategoryOverview;
