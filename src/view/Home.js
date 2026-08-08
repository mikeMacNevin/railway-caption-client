//React
import { useEffect, useState } from "react"; 
import { useParams } from 'react-router-dom';

//3rd Party
import axios from "axios";

//Mike
import Headline from "./headlines/Headline";
import Finance from "./headlines/finance/Finance";
import Sports from "./headlines/sports/Sports";
import './Home.scss'

function Home () {
  const { page } = useParams();
  const [data, setData] = useState([]); 
  const [currentPage, setCurrentPage] = useState(['Home']); 

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