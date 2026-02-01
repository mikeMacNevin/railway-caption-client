// import { useEffect } from "react";

import Headline from "../Headline";
import Scores from "./Scores/Scores";

import './sports.css'

import { useState } from 'react';


const Sports = ({sportsArticle}, currentPage) => {


  //For Sports Widget:

    // console.log("SPORTS: " + JSON.stringify(sportsArticle))
    const [activeTab, setActiveTab] = useState('scores');

    return (
        <div className="container home-container d-flex flex-column  pt-3">
            <div className="container"> 
                <h2>SPORTS</h2>
                {/* Button Group */}
                <div className="btn-group mb-4 align-self-end pe-3" role="group" aria-label="Sports and News tabs">
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
            <div className="container home-container d-flex flex-column  pt-3">
                
            <table className="table ">              
              <tbody>
                {sportsArticle.map((article) => (<Headline key={article.source} article={article} ></Headline>))}    
              </tbody> 
            </table>   
              
          
          </div>
          )}
        </div>       
            </div>            
    )
}

export default Sports;