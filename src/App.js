// import axios from 'axios';

import './App.css';
import { BrowserRouter } from "react-router-dom";

import RouterView from './view/routes/RouterView';
import Navbar from './view/routes/Navbar';
import Header from './view/header/Header';

import NewNavbar from './view/routes/NewNavbar'
function App() {


      return (

          <BrowserRouter>
              <div className="App"> 
                <Header />
                <div className="d-none d-md-block"> 
                  <Navbar />
                </div>
                <RouterView />
                <div className="d-block d-md-none"> 
                  <NewNavbar />
                </div>
              </div>        
          </BrowserRouter>      

     )
    
}

export default App;
