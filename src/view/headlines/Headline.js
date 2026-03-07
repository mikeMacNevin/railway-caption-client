

import './Headline.scss';

import { Card } from 'react-bootstrap'; // recommended, or use div.card if plain Bootstrap

// import { useEffect } from 'react';
// import { useState } from 'react';

function Headline ( {article}) {



// const [data, setData] = useState([]); 

//  useEffect(() => {
//     if (article.title.length > 100 ) {
//         setData(article.title.substring(0, 97) + "...");
//         console.log("NEWWTITLE: " + article.title.substring(0, 97) + '...')
//     }  
//     else {
//         setData(article.title)
//                 console.log("NEWWTITLE: " + article.title.substring(0, 50))

//     }
//   }, [article.title])





// return (
        // <tr>
        //     <td className="site-icon"><img className="img-fluid" alt='site-icon' src={article.site_icon_url} /></td>
        //     <td className="news-source">
        //         <a className="article-website" href={article.website}>
        //             {article.source}
        //         </a>
        //     </td>
        //     <td className="article-title ">
        //         <a className="" href={article.url}>
        //             {article.title}
        //         </a>
        //     </td>
        // </tr>


  return (
   <Card 
      className="h-100 shadow-sm news-card"
      style={{ transition: 'all 0.18s ease-out' }}
    >
      <Card.Body className="p-2 p-md-3 d-flex flex-column">
        {/* Top row: icon + source, justified */}
        <div className="d-flex justify-content-between align-items-center mb-2 top-row">
          <div className="d-flex align-items-center gap-2">
            <img 
              src={article.site_icon_url} 
              alt={`${article.source} icon`} 
              className="site-icon rounded"
              width={25} 
              height={25} 
              loading="lazy"
            />
            <a 
              href={article.website}
              className="news-source text-decoration-none fw-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.source}
            </a>
          </div>

          {/* Optional: tiny spacer or placeholder on right if you want perfect justification spread */}
          {/* <span className="invisible"> {/* keeps justify balanced if needed </span> */}
        </div>

        {/* Headline – justified, main content */}
        <a 
          href={article.url}
          className="article-title stretched-link text-decoration-none"
          target="_blank"
          rel="noopener noreferrer"
        >
          {article.title}
        </a>
      </Card.Body>
    </Card>
  );
}



export default Headline