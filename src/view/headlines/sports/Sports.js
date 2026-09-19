// import { useEffect } from "react";

import Headline from "../Headline";
import Scores from "./Scores/Scores";
import EmptyState from "../../EmptyState";
import { Row, Col } from 'react-bootstrap'; // if not already using react-bootstrap

import './sports.scss'

import { useState } from 'react';


const Sports = ({sportsArticle, currentPage}) => {

    const [activeTab, setActiveTab] = useState('news');
    // 365Scores' widget script only scans the page for [data-widget-type]
    // divs once, when it first loads - it never re-scans afterward. So once
    // Scores has been shown, it has to stay mounted (just hidden) rather
    // than being torn down on every tab switch, or the divs it gets on a
    // remount would never get picked up and the widgets would render blank.
    const [scoresMounted, setScoresMounted] = useState(false);

    return (
        <div className="container home-container d-flex flex-column pt-1">
            <h2 className="current-page">{currentPage}</h2>

            <div className="container d-flex flex-row justify-content-end align-items-center px-0">
                {/* Button Group */}
                <div className="btn-group mb-2 align-self-end pe-3" role="group" aria-label="Markets and News tabs">

                <button
                    type="button"
                    className={`btn ${activeTab === 'news' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setActiveTab('news')}
                >
                  News
                </button>
                <button
                    type="button"
                    className={`btn ${activeTab === 'scores' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => { setScoresMounted(true); setActiveTab('scores'); }}
                >
                  Teams
                </button>


              </div>
        </div>
         <div>
          {scoresMounted && (
            <div style={{ display: activeTab === 'scores' ? 'block' : 'none' }}>
              <Scores />
            </div>
          )}
          {activeTab !== 'scores' && (
         <div className="container home-container pt-1 pb-5">
        {sportsArticle.length === 0 ? (
          <EmptyState />
        ) : (
          <Row xs={1} md={2} lg={2} className="g-3 g-md-4">  {/* adjust columns as desired */}
            {sportsArticle.map((article) => (
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

export default Sports;