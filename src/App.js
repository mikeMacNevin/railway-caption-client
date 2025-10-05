// import axios from 'axios';

import './App.css';
import { BrowserRouter } from "react-router-dom";

import RouterView from './view/routes/RouterView';
import Navbar from './view/routes/Navbar';
import Header from './view/header/Header';

function App() {

      return (

          <BrowserRouter>
              <div className="App"> 
                <Header />
                <Navbar />
                <RouterView />
              </div>        
          </BrowserRouter>      

     )
 
}

export default App;
