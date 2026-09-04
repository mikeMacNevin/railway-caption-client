import './Headline.scss';
import { formatTimeAgo } from '../../formatTimeAgo';

function Headline({ article }) {
  const timeAgo = article.created_at ? formatTimeAgo(article.created_at) : '';

  return (
    <div className="headline-item">
      <div className="headline-row">
        <span className="source-badge">
          <span className="source-badge-top">
            <img
              src={article.site_icon_url}
              alt=""
              aria-hidden="true"
              className="source-icon"
              loading="lazy"
            />
            <a
              href={article.website}
              className="source-name text-decoration-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.source}
            </a>
          </span>
          {timeAgo && (
            <time
              className="source-time"
              dateTime={article.created_at}
              title={new Date(article.created_at).toLocaleString()}
            >
              {timeAgo}
            </time>
          )}
        </span>
        <a
          href={article.url}
          className="headline-text text-decoration-none"
          target="_blank"
          rel="noopener noreferrer"
        >
          {article.title}
        </a>
      </div>
    </div>
  );
}

export default Headline;
