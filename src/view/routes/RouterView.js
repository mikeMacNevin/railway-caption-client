import { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "../Home";
import PrivacyPolicy from "../legal/PrivacyPolicy";
import Terms from "../legal/Terms";
import { initAnalytics, trackPageview } from "../../analytics";

function RouterView() {
    const location = useLocation();

    useEffect(() => {
        initAnalytics();
    }, []);

    useEffect(() => {
        trackPageview(location.pathname);
    }, [location.pathname]);

    return (
        <div className="RouterView d-flex justify-content-center">
           <Routes>
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/:page" element={<Home />} />
              <Route path="/" element={<Home />} />

            </Routes>
        </div>
    )
}
export default RouterView;
