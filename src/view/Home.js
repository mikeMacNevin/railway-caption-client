//React
import { useEffect, useState } from "react"; 
import { useParams } from 'react-router-dom';


//3rd Party
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap'; // if not already using react-bootstrap

//Mike
import Headline from "./headlines/Headline";
import Finance from "./headlines/finance/Finance";
import Sports from "./headlines/sports/Sports";
import './Home.scss'

function Home () {
const { page } = useParams();
const [data, setData] = useState([]); 
const [currentPage, setCurrentPage] = useState([]); 



useEffect(() => {
  window.scrollTo(0, 0);

  // ← Add this line
  setData([]);                   // or setData(null) if you prefer

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      setData([]); // optional: recover by clearing on error
    });

}, [page]);
  if (data) { 
    if (page === 'finance') {
      return (
        <Finance financeArticle={data} currentPage={currentPage}/>
      )
    }

    if (page === 'sports') {
      return (
        <Sports sportsArticle={data} currentPage={currentPage} />
      )
    }
    else {
      return (

      <div className="container home-container pt-1 pb-5">
        <h2 className="mb-1 text-start text-md-start">{currentPage}</h2>

        <Row xs={1} md={2} lg={2} className="g-3 g-md-4">  {/* adjust columns as desired */}
          {data.map((article) => (
            <Col key={article.source}>
              <Headline article={article} />
            </Col>
          ))}
        </Row>
      </div>


          // <div className="container home-container d-flex flex-column  pt-3">
          //   {/* This was the page title.  I removed for now.  Maybe bring back and restyle */}
            
          //   <h2 className="mb-0 ">{currentPage }</h2>   
          //   <table className="table ">              
          //     <tbody>
          //       {data.map((article) => (<Headline key={article.source} article={article} ></Headline>))}    
          //     </tbody> 
          //   </table>   

          // </div>
        )
      }
    }
  }
  

    
export default Home;