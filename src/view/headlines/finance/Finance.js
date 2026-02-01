import TradingViewWidget from "./TradingViewWidget";
import Headline from "../Headline";

import './finance.css'

import { useState } from 'react';


const Finance = ({financeArticle}, currentPage) => {

    console.log("FINANCE: " + JSON.stringify(financeArticle))
    const [activeTab, setActiveTab] = useState('markets');

    return (
        <div className="container home-container d-flex flex-column  pt-3">
            <div className="container"> 
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
            <div className="container home-container d-flex flex-column  pt-3">
                
            <table className="table ">              
              <tbody>
                {financeArticle.map((article) => (<Headline key={article.source} article={article} ></Headline>))}    
              </tbody> 
            </table>   
              
          
          </div>
          )}
        </div>       
            </div>            
    )
}

export default Finance;