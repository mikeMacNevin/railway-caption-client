import TradingViewWidget from "./TradingViewWidget";
import Headline from "../Headline";
import { Container, Row, Col } from 'react-bootstrap'; // if not already using react-bootstrap

import './finance.css'

import { useState } from 'react';


const Finance = ({financeArticle}, currentPage) => {

    console.log("FINANCE: " + JSON.stringify(financeArticle))
    const [activeTab, setActiveTab] = useState('markets');

    return (
        <div className="container home-container d-flex flex-column  pt-1">
            <div className="container d-flex flex-row justify-content-between align-items-center"> 
                <h2>FINANCE</h2>
                {/* Button Group */}
                <div className="btn-group mb-2 align-self-end pe-3" role="group" aria-label="Markets and News tabs">
                <button
                    type="button"
                    className={`btn ${activeTab === 'markets' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setActiveTab('markets')}
                >
                    Markets
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
          {activeTab === 'markets' ? (
            <div>
              <TradingViewWidget />
            </div>
          ) : (
               <div className="container home-container pt-1 pb-5">
                 <h2 className="mb-1 fw-light text-center text-md-start">{currentPage}</h2>

                <Row xs={1} md={2} lg={2} className="g-3 g-md-4">  {/* adjust columns as desired */}
                  {financeArticle.map((article) => (
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

export default Finance;