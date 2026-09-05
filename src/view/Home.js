//React
import { useEffect, useState } from "react";
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
import { PAGE_META, DEFAULT_IMAGE } from "../seoMeta";
import './Home.scss'

function Home () {
  const { page } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const meta = PAGE_META[page] || PAGE_META['home'];
  const pageTitle = `${meta.title} | caption.news`;
  // The on-page heading (e.g. "Gaming Headlines") - reuses the same friendly
  // title as the SEO meta instead of the raw route slug. Empty on the Front
  // Page, matching the existing "no title on home" behavior.
  const sectionTitle = page ? meta.title : '';

  // Grace period before the loading screen appears, so quick loads don't flash it.
  const LOADING_SCREEN_DELAY_MS = 500;

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    window.scrollTo(0, 0);
    setData([]);
    setIsLoading(true);
    setShowLoadingScreen(false);

    const loadingScreenTimer = setTimeout(() => {
      setShowLoadingScreen(true);
    }, LOADING_SCREEN_DELAY_MS);

    let endpoint = page === undefined
      ? `${API_URL}/api/articles/home`
      : `${API_URL}/api/articles/${page}`;
    axios
      .get(endpoint)
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

    if (isLoading) {
      return showLoadingScreen ? <LoadingScreen /> : null;
    }
    if (data) {
      if (page === 'finance') {
        return (<Finance financeArticle={data} currentPage={sectionTitle}/>)}
      if (page === 'sports') {
        return (<Sports sportsArticle={data} currentPage={sectionTitle} />)}
      else {
        return (
        <div className="container home-container pt-1">
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
          )
        }
      }
  }
    
export default Home;