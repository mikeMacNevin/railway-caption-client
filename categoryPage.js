// Server-side rendering for the category pages (/celebs, /sports, ...).
//
// Same idea as briefingPage.js: the React app ships an empty shell, so
// without this a crawler's first look at a category page finds no text at
// all. Google was declining to index them ("Crawled - currently not
// indexed"). This writes the day's category overview and the headline list
// into the HTML itself, and leaves both in window globals so the React app's
// first render starts from them instead of blanking the page to refetch.
//
// The markup mirrors src/view/CategoryOverview.js and
// src/view/headlines/Headline.js and uses their class names, so the built
// stylesheet styles it before React takes over.

const { PAGE_META } = require('./src/seoMeta');
const { getJson, escapeHtml, safeJson } = require('./briefingPage');

// Keep in step with LABELS in src/view/CategoryOverview.js.
const LABELS = {
  politics: 'politics',
  finance: 'finance',
  world: 'world',
  sports: 'sports',
  tech: 'tech',
  celebs: 'celebrity',
  movies: 'movie',
  tv: 'TV',
  videogames: 'video game',
  travel: 'travel',
  health: 'health',
  science: 'science',
};

const CATEGORY_ROUTE_RE = /^\/([a-z]+)\/?$/;

function categoryForPath(requestPath) {
  const match = requestPath.match(CATEGORY_ROUTE_RE);
  return match && LABELS[match[1]] ? match[1] : null;
}

// Returns null if neither the overview nor the headlines could be loaded -
// the route is then served as the plain shell, exactly as before.
async function loadCategory(page) {
  const [overview, articlesResponse] = await Promise.all([
    getJson(`/api/summary/category/${page}`),
    getJson(`/api/articles/${page}`),
  ]);
  const articles = (articlesResponse && articlesResponse.articles) || [];
  const hasOverview = overview && Array.isArray(overview.paragraphs);
  if (!hasOverview && articles.length === 0) return null;
  return { page, overview: hasOverview ? { ...overview, page } : null, articles };
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function renderOverview(page, overview) {
  const paragraphs = overview.paragraphs.map((paragraph) => {
    const sources = paragraph.articles
      .map((a) => `<a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.source)}</a>`)
      .join(', ');
    return `<div class="category-overview-paragraph"><p>${escapeHtml(paragraph.text)}</p>` +
      `<p class="category-overview-sources">Sources: ${sources}</p></div>`;
  }).join('');

  return `<section class="category-overview" aria-label="The day in ${escapeHtml(LABELS[page])} news">` +
    `<p class="category-overview-kicker">The day in ${escapeHtml(LABELS[page])} news · ${formatDate(overview.date)}</p>` +
    `<h2 class="category-overview-headline">${escapeHtml(overview.headline)}</h2>${paragraphs}</section>`;
}

function renderHeadline(article) {
  return `<div class="headline-item"><div class="headline-row"><span class="source-badge"><span class="source-badge-top">` +
    (article.site_icon_url ? `<img src="${escapeHtml(article.site_icon_url)}" alt="" aria-hidden="true" class="source-icon" loading="lazy">` : '') +
    `<a href="${escapeHtml(article.website || '')}" class="source-name text-decoration-none" target="_blank" rel="noopener noreferrer">${escapeHtml(article.source)}</a>` +
    `</span></span><a href="${escapeHtml(article.url)}" class="headline-text text-decoration-none" target="_blank" rel="noopener noreferrer">${escapeHtml(article.title)}</a></div></div>`;
}

function renderCategoryHtml({ page, overview, articles }) {
  const title = (PAGE_META[page] || {}).title || '';
  return `<div class="container home-container pt-1">` +
    `<div class="container-fluid px-0"><h2 class="current-page">${escapeHtml(title)}</h2></div>` +
    (overview ? renderOverview(page, overview) : '') +
    `<div class="headline-feed">${articles.map(renderHeadline).join('')}</div></div>`;
}

function renderCategoryPreload({ page, overview, articles }) {
  return `<script>window.__CATEGORY_OVERVIEW__=${safeJson(overview)};` +
    `window.__CATEGORY_ARTICLES__=${safeJson({ page, articles })};</script>`;
}

module.exports = { categoryForPath, loadCategory, renderCategoryHtml, renderCategoryPreload };
