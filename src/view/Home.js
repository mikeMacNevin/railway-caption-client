//React
import { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

//3rd Party
import axios from "axios";

//Mike
import Headline from "./headlines/Headline";
import Finance from "./headlines/finance/Finance";
import Sports from "./headlines/sports/Sports";
import LoadingScreen from "./loading/LoadingScreen";
import EmptyState from "./EmptyState";
import CategoryOverview from "./CategoryOverview";
import { PAGE_META, DEFAULT_IMAGE } from "../seoMeta";
import './Home.scss'

// server.js writes a category page's headlines into its initial HTML (see
// categoryPage.js) and leaves them in window.__CATEGORY_ARTICLES__. Starting
// from that copy means the server-rendered list isn't blanked out and
// refetched the moment React takes over. Used once, for the first page only.
let preloadedArticles = typeof window !== "undefined" ? window.__CATEGORY_ARTICLES__ : null;

function takePreloadedArticles(page) {
  const pre = preloadedArticles;
  preloadedArticles = null;
  return pre && pre.page === page ? pre.articles : null;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function articlesEndpoint(page) {
  return page === undefined ? `${API_URL}/api/articles/home` : `${API_URL}/api/articles/${page}`;
}

// An open page checks for fresher headlines on its own - the Front Page is
// re-scraped every 10 minutes and its API cache lasts 2 (server/routes/
// articles.js), so without this a tab left open never changes. New stories
// aren't dropped in under the reader; a button offers them instead.
const REFRESH_INTERVAL_MS = 2 * 60 * 1000;

function Home () {
  const { page } = useParams();
  const [initialArticles] = useState(() => takePreloadedArticles(page));
  const [data, setData] = useState(initialArticles || []);
  const [isLoading, setIsLoading] = useState(!initialArticles);
  const skipFirstFetch = useRef(Boolean(initialArticles));
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  // A fresher list waiting behind the "N new headlines" button.
  const [pending, setPending] = useState(null);

  const meta = PAGE_META[page] || PAGE_META['home'];
  const pageTitle = `${meta.title} | caption.news`;
  // The on-page heading (e.g. "Gaming Headlines") - reuses the same friendly
  // title as the SEO meta instead of the raw route slug. Empty on the Front
  // Page, matching the existing "no title on home" behavior.
  const sectionTitle = page ? meta.title : '';

  // Grace period before the loading screen appears, so quick loads don't flash it.
  const LOADING_SCREEN_DELAY_MS = 500;

  useEffect(() => {
    setPending(null);

    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return undefined;
    }

    window.scrollTo(0, 0);
    setData([]);
    setIsLoading(true);
    setShowLoadingScreen(false);

    const loadingScreenTimer = setTimeout(() => {
      setShowLoadingScreen(true);
    }, LOADING_SCREEN_DELAY_MS);

    axios
      .get(articlesEndpoint(page))
      .then((response) => {
        setData(response.data.articles || []);
      })
      .catch((err) => {
        console.log("fetch error:", err);
        setData([]);
      })
      .finally(() => {
        clearTimeout(loadingScreenTimer);
        setIsLoading(false);
        setShowLoadingScreen(false);
      });

    return () => clearTimeout(loadingScreenTimer);
  }, [page]);

  // Checks every couple of minutes while the tab is visible, and right away
  // when the reader comes back to it. A hidden tab doesn't poll at all.
  useEffect(() => {
    if (isLoading) return undefined;

    let cancelled = false;
    let lastChecked = Date.now();

    const check = () => {
      if (document.visibilityState !== 'visible') return;
      lastChecked = Date.now();
      axios
        .get(articlesEndpoint(page))
        .then((response) => {
          if (cancelled) return;
          const fresh = response.data.articles || [];
          if (fresh.length === 0) return;
          const shown = new Set(data.map((article) => article.url));
          const count = fresh.filter((article) => !shown.has(article.url)).length;
          if (count > 0) {
            setPending({ articles: fresh, count });
          } else {
            // Same stories - update retitles and the "time ago" labels in
            // place, since nothing moves.
            setData(fresh);
          }
        })
        .catch(() => {
          // A missed check just waits for the next one.
        });
    };

    const timer = setInterval(check, REFRESH_INTERVAL_MS);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastChecked > REFRESH_INTERVAL_MS / 2) check();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [page, isLoading, data]);

  function showNewHeadlines() {
    setData(pending.articles);
    setPending(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Always rendered so screen readers announce the button when it appears.
  const newHeadlines = (
    <div className="new-headlines" aria-live="polite">
      {pending && (
        <button type="button" className="new-headlines-button" onClick={showNewHeadlines}>
          <span aria-hidden="true">&uarr;</span>
          {pending.count} new headline{pending.count === 1 ? '' : 's'}
        </button>
      )}
    </div>
  );

    if (isLoading) {
      return showLoadingScreen ? <LoadingScreen /> : null;
    }
    if (data) {
      if (page === 'finance') {
        return (<>{newHeadlines}<Finance financeArticle={data} currentPage={sectionTitle}/></>)}
      if (page === 'sports') {
        return (<>{newHeadlines}<Sports sportsArticle={data} currentPage={sectionTitle} /></>)}
      else {
        return (
        <div className="container home-container pt-1">
          {newHeadlines}
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={meta.description} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:url" content={`https://www.caption.news${page ? `/${page}` : ''}`} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={DEFAULT_IMAGE} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={DEFAULT_IMAGE} />
            <script type="application/ld+json">{JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": meta.title,
              "url": `https://www.caption.news${page ? `/${page}` : ''}`,
              "itemListElement": data.map((article, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "NewsArticle",
                  "headline": article.title,
                  "url": article.url,
                  "publisher": {
                    "@type": "Organization",
                    "name": article.source,
                    "url": article.website,
                    "logo": {
                      "@type": "ImageObject",
                      "url": article.site_icon_url
                    }
                  },
                  "datePublished": article.created_at
                }
              }))
            })}</script>
          </Helmet>
          {sectionTitle && (
            <div className="container-fluid px-0">
              <h2 className="current-page">{sectionTitle}</h2>
            </div>
          )}
          <div className="summary-layout">
            <CategoryOverview page={page} />

            {data.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="headline-feed">
                {data.map((article) => (
                  <Headline key={article.url} article={article} />
                ))}
              </div>
            )}
          </div>
          </div>
          )
        }
      }
  }
    
export default Home;