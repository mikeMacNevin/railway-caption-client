

import './Headline.css';

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



return (
        <tr>
            <td className="site-icon"><img className="img-fluid" alt='site-icon' src={article.site_icon_url} /></td>
            <td className="news-source">
                <a className="article-website" href={article.website}>
                    {article.source}
                </a>
            </td>
            <td className="article-title ">
                <a className="link-opacity-50-hover" href={article.url}>
                    {article.title}
                </a>
            </td>
        </tr>

    )
}

export default Headline