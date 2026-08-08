import './Headline.scss';

function Headline({ article }) {
  return (
    <div className="headline-item">
      <div className="headline-row">
        <span className="source-badge">
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
          <span className="dot-sep" aria-hidden="true" />
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
