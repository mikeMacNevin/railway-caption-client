import { useEffect } from "react";
const BasketballScores = () => {


  return (
    <div>
      <h3 className="mb-4">Basketball Scores</h3>
      <div
        data-widget-type="entityScores"
        data-entity-type="league"
        data-entity-id="103"  
        data-lang="en"
        data-widget-id="5e7643e8-8c1a-4818-8a8a-172ea5a23991"  
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
  );
};

export default BasketballScores;