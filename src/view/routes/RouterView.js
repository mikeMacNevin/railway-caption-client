import { Routes, Route} from "react-router-dom";

import Home from "../Home";

function RouterView() {

    return (
        <div className="RouterView d-flex justify-content-center">
          {/* <nav>
            <Link to="/">Front Page | </Link>
            <Link to="/politics">Politics | </Link>
            <Link to="/finance">Finance</Link>
          </nav> */}
          <hr />
           <Routes>
              <Route path="/:page" element={<Home />} />
              <Route path="/" element={<Home />} />
            </Routes>
        </div>
       
    )
}

export default RouterView;