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
import './Home.scss'

const PAGE_META = {
  home:        { title: 'Top Headlines',       description: 'The latest top headlines from across the web, aggregated in one place.' },
  politics:    { title: 'Politics Headlines',  description: 'Breaking political news and analysis from leading news sources.' },
  finance:     { title: 'Finance Headlines',   description: 'Stock market updates, economic news, and financial headlines.' },
  world:       { title: 'World Headlines',     description: 'International news and global headlines from around the world.' },
  sports:      { title: 'Sports Headlines',    description: 'The latest sports scores, trades, and news from top sports outlets.' },
  tech:        { title: 'Tech Headlines',      description: 'Technology news, product launches, and industry updates.' },
  celebs:      { title: 'Celebrity Headlines', description: 'Celebrity gossip, entertainment news, and pop culture updates.' },
  movies:      { title: 'Movie Headlines',     description: 'Film reviews, box office news, and movie industry updates.' },
  tv:          { title: 'TV Headlines',        description: 'Television news, show recaps, and streaming updates.' },
  videogames:  { title: 'Gaming Headlines',    description: 'Video game news, reviews, and release updates.' },
  travel:      { title: 'Travel Headlines',    description: 'Travel tips, destination guides, and tourism news.' },
  health:      { title: 'Health Headlines',    description: 'Medical news, wellness tips, and health industry updates.' },
  science:     { title: 'Science Headlines',   description: 'Scientific discoveries, research news, and technology breakthroughs.' },
};

function Home () {
  const { page } = useParams();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(['Home']);

  const meta = PAGE_META[page] || PAGE_META['home'];
  const pageTitle = `${meta.title} | caption.news`;

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    window.scrollTo(0, 0);
    setData([]);  

    let endpoint = page === undefined 
      ? `${API_URL}/api/articles/home`
      : `${API_URL}/api/articles/${page}`;
    axios
      .get(endpoint)
      .then((response) => {
        setData(response.data.articles || []);
        setCurrentPage(page ? page.toUpperCase() : "");
      })
      .catch((err) => {
        console.log("fetch error:", err);
        setData([]); 
      });

  }, [page]);
    if (data) { 
      if (page === 'finance') {
        return (<Finance financeArticle={data} currentPage={currentPage}/>)}
      if (page === 'sports') {
        return (<Sports sportsArticle={data} currentPage={currentPage} />)}
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
          <div className="container-fluid px-0 mb-3">
            <h2 className="mb-1 current-page text-center">{currentPage}</h2>
          </div>

            <div className="headline-feed">
              {data.map((article) => (
                <Headline key={article.source} article={article} />
              ))}
            </div>
          </div>
          )
        }
      }
  }
    
export default Home;