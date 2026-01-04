import { useEffect } from "react";

const FootballScores = () => {
            useEffect(() => {
            // Load 365Scores script only once
            const script = document.createElement('script');
            script.src = 'https://widgets.365scores.com/main.js';
            script.async = true;
            document.body.appendChild(script);
        
            // Optional: cleanup on unmount (rarely needed)
         return () => {
      document.body.removeChild(script);
    };
          }, []); 
      return (
        <div>
          <h3 className="mb-4">Football Scores</h3>
          <div
            data-widget-type="entityScores"
            data-entity-type="league"
            data-entity-id="352"  
            data-lang="en"
            data-widget-id="1bf5adf5-13bb-421a-bed4-6dd908294076"  
          ></div>
          <div id="powered-by">
            Powered by{' '}
            <a
              id="powered-by-link"
              href="https://www.365scores.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              365Scores.com
            </a>
          </div>
                

        </div>
      ) 

};

export default FootballScores;