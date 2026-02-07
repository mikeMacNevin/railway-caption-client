// import axios from 'axios';

import './App.scss';
import { BrowserRouter } from "react-router-dom";

import RouterView from './view/routes/RouterView';
import Navbar from './view/routes/Navbar';
import Header from './view/header/Header';
import BottomNavbar from './view/routes/BottomNavbar.js'
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
                  <BottomNavbar />
                </div>
              </div>        
          </BrowserRouter>      


     )
    
}

export default App;
