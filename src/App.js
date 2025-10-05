// import axios from 'axios';

import './App.css';
import { BrowserRouter } from "react-router-dom";

import Home from './view/Home';
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
            /* <Router>
              <div>
                <nav>
                  <ul>
                    <li>
                      <Link to="/">Front Page</Link>
                    </li>
                    <li>
                      <Link to="/politics">Politics</Link>
                    </li>
                    <li>
                      <Link to="/finance">Finance</Link>
                    </li>
                  </ul>
                </nav>
                <hr />
              </div>
            <Routes>
              <Route path="/:page" element={<Home />} />
              <Route path="/" element={<Home />} />
            </Routes>

        </Router> */