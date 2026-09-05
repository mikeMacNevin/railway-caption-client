import TradingViewWidget from "./TradingViewWidget";
import Headline from "../Headline";
import EmptyState from "../../EmptyState";
import { Row, Col } from 'react-bootstrap'; // if not already using react-bootstrap

import './finance.css'

import { useState } from 'react';


const Finance = ({financeArticle, currentPage}) => {

    const [activeTab, setActiveTab] = useState('markets');

    return (
        <div className="container home-container d-flex flex-column  pt-1">
            <h2 className="current-page">{currentPage}</h2>

            <div className="container d-flex flex-row justify-content-end align-items-center px-0">
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
         <div>
          {activeTab === 'markets' ? (
            <div>
              <TradingViewWidget />
            </div>
          ) : (
               <div className="container home-container pt-1 pb-5">
                {financeArticle.length === 0 ? (
                  <EmptyState />
                ) : (
                  <Row xs={1} md={2} lg={2} className="g-3 g-md-4">  {/* adjust columns as desired */}
                    {financeArticle.map((article) => (
                      <Col className="home-headline-col" key={article.url}>
                        <Headline article={article} />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
              )}
        </div>
            </div>
    )
}

export default Finance;