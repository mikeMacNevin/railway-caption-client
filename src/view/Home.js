//React
import { useEffect } from "react"; 
import { useState } from "react";
import { useParams } from 'react-router-dom';

//3rd Party
import axios from "axios";

//Mike
import Headline from "./headlines/Headline";
import TradingViewWidget from "./headlines/TradingViewWidget";
import './Home.css'


 function Home () {

  const { page } = useParams();
  const [data, setData] = useState([]); 
  // const [currentPage, setCurrentPage] = useState([]); 


  //for both Railway url and fallback local

    
    useEffect(() => {
          //Home Page hack that should probably be redone one day
          if (page === undefined) {
                axios
              .get(`${process.env.REACT_APP_API_URL}/api/articles/home`)
              .then((response) => {
                  setData(response.data.articles);
                  // setCurrentPage("")

              })
              .catch((err) => {
                console.log("fetch error: " + err)
              });
          }
          //any page other than Home Page
          else {
              axios
              .get(`${process.env.REACT_APP_API_URL}/api/articles/${page}`)
              .then((response) => {
                  setData(response.data.articles);
                  // setCurrentPage(page.toUpperCase())
                  console.log("page: " + { page })
              })
              .catch((err) => {
                console.log("fetch error: " + err)
              });
          }
      }, [page]);

        return (
          <div className="container home-container d-flex flex-column  pt-3">
            {/* This was the page title.  I removed for now.  Maybe bring back and restyle */}
            {/* <h2 className="text-start">{currentPage}</h2> */}
            
            <table className="table ">
              <tbody>
                {data.map((article) => (<Headline key={article.source} article={article} ></Headline>))}    
              </tbody> 
            </table>   
              
            
            {page == 'finance' && <div className="container-fluid"> <TradingViewWidget /></div>  }

          </div>
        )

    

}
    
export default Home;