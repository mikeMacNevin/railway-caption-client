// Server-side rendering for the /briefing pages.
//
// The site is a client-rendered React app, so the HTML it ships is an empty
// shell - a crawler that doesn't run JavaScript (or runs it late) would see
// none of the briefing text, which is the one page of original content on the
// site. server.js uses this module to write the real briefing into the HTML it
// sends, so the text and its source links are in the page itself.
//
// Plain CommonJS on purpose (like seoMeta.js): it's required by the Node
// server, not bundled by React. The markup mirrors
// src/view/briefing/Briefing.js and uses the same class names, so the built
// stylesheet styles it before React takes over.

const { SITE_URL } = require('./src/seoMeta');

const API_URL = process.env.API_URL || process.env.REACT_APP_API_URL || '';
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 4000;
const cache = new Map(); // url -> { data, fetchedAt }

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Fetches JSON from the API with a short timeout and a small cache. Returns
// the last good copy if the API is down, or null if there has never been one -
// the page then just falls back to the normal client-rendered shell.
async function getJson(pathAndQuery) {
  if (!API_URL || typeof fetch !== 'function') return null;

  const url = `${API_URL.replace(/\/$/, '')}${pathAndQuery}`;
  const hit = cache.get(url);
  if (hit && Date.now() - hit.fetchedAt < CACHE_TTL_MS) return hit.data;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!response.ok) return hit ? hit.data : null;
    const data = await response.json();
    cache.set(url, { data, fetchedAt: Date.now() });
    return data;
  } catch (err) {
    return hit ? hit.data : null;
  }
}

// `date` is 'YYYY-MM-DD' for an archive page, or undefined for the latest.
async function loadBriefing(date) {
  const [briefing, archive] = await Promise.all([
    getJson(date ? `/api/summary/${date}` : '/api/summary'),
    getJson('/api/summary/archive'),
  ]);
  if (!briefing || !Array.isArray(briefing.paragraphs)) return null;
  return { briefing, archive: (archive && archive.briefings) || [] };
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

// Two links from one outlet get a number so they're distinguishable.
function sourceLabels(articles) {
  const totals = {};
  articles.forEach((a) => { totals[a.source] = (totals[a.source] || 0) + 1; });
  const seen = {};
  return articles.map((a) => {
    seen[a.source] = (seen[a.source] || 0) + 1;
    return totals[a.source] > 1 ? `${a.source} ${seen[a.source]}` : a.source;
  });
}

function renderBriefingHtml({ briefing, archive }) {
  const paragraphs = briefing.paragraphs.map((paragraph) => {
    const labels = sourceLabels(paragraph.articles);
    const links = paragraph.articles.map((article, i) =>
      `<a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(article.title)}">${escapeHtml(labels[i])}</a>`
    ).join('');
    return `<section class="briefing-paragraph"><p>${escapeHtml(paragraph.text)}</p>` +
      `<p class="briefing-sources"><span class="briefing-sources-label">Sources</span>${links}</p></section>`;
  }).join('');

  const earlier = archive.filter((item) => item.date !== briefing.date).slice(0, 7);
  const archiveHtml = earlier.length === 0 ? '' :
    `<nav class="briefing-archive" aria-label="Earlier briefings"><h3>Earlier briefings</h3><ul>` +
    earlier.map((item) =>
      `<li><a href="/briefing/${escapeHtml(item.date)}"><span class="briefing-archive-date">${escapeHtml(formatDate(item.date))}</span>` +
      `<span class="briefing-archive-headline">${escapeHtml(item.headline)}</span></a></li>`
    ).join('') + `</ul></nav>`;

  return `<div class="container briefing-container pt-1">` +
    `<div class="container-fluid px-0"><h2 class="current-page">Daily News Briefing</h2></div>` +
    `<article class="briefing">` +
    `<p class="briefing-meta">${escapeHtml(formatDate(briefing.date))} · Updated ${escapeHtml(formatTime(briefing.generatedAt))}</p>` +
    `<h1 class="briefing-headline">${escapeHtml(briefing.headline)}</h1>` +
    `<p class="briefing-dek">${escapeHtml(briefing.dek)}</p>` +
    paragraphs +
    `<p class="briefing-note">This briefing is written by AI from the ${escapeHtml(briefing.articleCount)} most relevant headlines currently on caption.news, weighted toward the front page and the newest stories. It can make mistakes — follow the source links for the full reporting.</p>` +
    `</article>` + archiveHtml + `</div>`;
}

// schema.org Article. `citation` lists the reporting the briefing is built
// from, which is exactly what makes this page more than a link list.
function renderJsonLd(briefing, canonicalUrl) {
  const citations = [...new Set(briefing.paragraphs.flatMap((p) => p.articles.map((a) => a.url)))];
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: briefing.headline,
    description: briefing.dek,
    datePublished: new Date(briefing.generatedAt).toISOString(),
    dateModified: new Date(briefing.generatedAt).toISOString(),
    mainEntityOfPage: canonicalUrl,
    author: { '@type': 'Organization', name: 'caption.news', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'caption.news', url: SITE_URL },
    citation: citations,
  }).replace(/</g, '\\u003c');
}

// Data the React page starts from, so it doesn't refetch and flash empty
// after the server-rendered copy is replaced. `<` is escaped so nothing in
// the briefing text can close the surrounding <script> tag.
function renderPreload(path, payload) {
  // U+2028/2029 are valid in JSON but were line terminators in JS before
  // ES2019 - strip them rather than depend on the engine.
  const json = JSON.stringify({ path, ...payload })
    .replace(/</g, '\\u003c')
    .split(String.fromCharCode(0x2028)).join('')
    .split(String.fromCharCode(0x2029)).join('');
  return `<script>window.__BRIEFING__=${json};</script>`;
}

// Adds each dated briefing to the sitemap so search engines can find the
// archive pages. Falls back to the plain static sitemap if the API is down.
async function buildSitemap(baseXml) {
  const archive = (await getJson('/api/summary/archive')) || {};
  const entries = (archive.briefings || []).map((item) =>
    `  <url>\n    <loc>${SITE_URL}/briefing/${escapeHtml(item.date)}</loc>\n    <changefreq>never</changefreq>\n    <priority>0.6</priority>\n  </url>\n`
  ).join('');
  return baseXml.replace('</urlset>', `${entries}</urlset>`);
}

module.exports = { loadBriefing, renderBriefingHtml, renderJsonLd, renderPreload, buildSitemap, escapeHtml };
