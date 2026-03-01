// import { useEffect } from "react";

import Headline from "../Headline";
import Scores from "./Scores/Scores";
import { Container, Row, Col } from 'react-bootstrap'; // if not already using react-bootstrap

import './sports.scss'

import { useState } from 'react';


const Sports = ({sportsArticle}, currentPage) => {


  //For Sports Widget:

    // console.log("SPORTS: " + JSON.stringify(sportsArticle))
    const [activeTab, setActiveTab] = useState('scores');

    return (
        <div className="container home-container d-flex flex-column pt-1">
            
            

            <div className="container d-flex flex-row justify-content-between align-items-center"> 
              <h2>SPORTS</h2>
                {/* Button Group */}
                <div className="btn-group mb-2 align-self-end pe-3" role="group" aria-label="Markets and News tabs">

                <button
                    type="button"
                    className={`btn ${activeTab === 'scores' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setActiveTab('scores')}
                >
                    Scores
                </button>
                <button
                    type="button"
                    className={`btn ${activeTab === 'news' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setActiveTab('news')}
                >
                News
                </button>

              </div>
        </div>
        {/* <h2 className="text-start">{currentPage}</h2> */}                  
         <div>
          {activeTab === 'scores' ? (
            <div>
              <Scores />
            </div>
          ) : (
         <div className="container home-container pt-1 pb-5">
        <h2 className="mb-4 fw-light text-center text-md-start">{currentPage}</h2>

        <Row xs={1} md={2} lg={2} className="g-3 g-md-4">  {/* adjust columns as desired */}
          {sportsArticle.map((article) => (
            <Col key={article.source}>
              <Headline article={article} />
            </Col>
          ))}
        </Row>
      </div>

          )}
        </div>       
            </div>            
    )
}

export default Sports;