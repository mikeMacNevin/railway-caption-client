//React
import { useEffect, useState } from "react"; 
import { useParams } from 'react-router-dom';

//3rd Party
import axios from "axios";
import { Row, Col } from 'react-bootstrap'; // if not already using react-bootstrap

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

            <Row xs={1} md={2} lg={2} className="g-3 g-md-4">
              {data.map((article) => (
                <Col className="home-headline-col" key={article.source}>
                  <Headline article={article} />
                </Col>
              ))}
          </Row>
          </div>
          )
        }
      }
  }
    
export default Home;