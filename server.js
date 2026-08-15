// Lightweight production server for the client.
//
// Serves the static CRA build like `serve -s build` did, but additionally
// rewrites the <head> SEO block (title/description/OG/Twitter/canonical) in
// index.html per-route before sending it. This exists because CRA is a pure
// client-side-rendered app: the raw HTML it ships has no per-page meta, and
// most link-unfurlers (Facebook, X/Twitter, Slack, Discord, iMessage) never
// execute JavaScript, so they only ever see the raw HTML. Googlebot does
// execute JS eventually, but only after a slower second-pass render queue.
//
// This is intentionally NOT a full SSR/Next.js migration - it doesn't
// render any React, it just fixes what crawlers and previews see in <head>
// for each route, using the same PAGE_META that react-helmet-async uses
// client-side (see src/seoMeta.js) so the two can't drift apart.

const express = require('express');
const path = require('path');
const fs = require('fs');
const { PAGE_META, SITE_URL, DEFAULT_IMAGE } = require('./src/seoMeta');

const app = express();
const port = process.env.PORT || 3000;
const buildDir = path.join(__dirname, 'build');

// Read the built index.html once at startup and keep it in memory - it
// doesn't change while the server is running.
const indexTemplate = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

// HTML comments get stripped by CRA's build minifier, so we can't rely on a
// comment marker surviving into build/index.html - match the default
// <title> + description <meta> pair itself instead (see public/index.html).
const SEO_BLOCK_RE = /<title>[\s\S]*?<\/title>\s*<meta\s+name="description"\s+content="[^"]*"\s*\/?>/;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSeoBlock(meta, canonicalUrl) {
  const title = `${meta.title} | caption.news`;
  const description = escapeHtml(meta.description);
  const safeTitle = escapeHtml(title);

  return `<title>${safeTitle}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="caption.news" />
    <meta property="og:image" content="${DEFAULT_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${DEFAULT_IMAGE}" />`;
}

let warnedNoMatch = false;

function renderHtmlForPath(requestPath) {
  const slug = requestPath.split('/').filter(Boolean)[0] || 'home';
  const meta = PAGE_META[slug] || PAGE_META.home;
  const canonicalUrl = `${SITE_URL}${requestPath === '/' ? '' : requestPath}`;

  if (!SEO_BLOCK_RE.test(indexTemplate) && !warnedNoMatch) {
    warnedNoMatch = true;
    console.warn(
      'server.js: SEO_BLOCK_RE did not match build/index.html - falling back to default meta for every route. ' +
      'Check that <title> is immediately followed by the description <meta> tag (see public/index.html).'
    );
  }

  return indexTemplate.replace(SEO_BLOCK_RE, renderSeoBlock(meta, canonicalUrl));
}

// Serve real static assets (JS/CSS/images/manifest/etc). index:false stops
// this from auto-serving build/index.html for "/" so our route below - which
// injects per-page meta - handles every HTML request instead.
app.use(express.static(buildDir, { index: false }));

// Everything else is a client-side (React Router) route - hand back
// index.html with the right <head> for that route, and let the browser's
// React app take over routing from there.
app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(renderHtmlForPath(req.path));
});

app.listen(port, () => {
  console.log(`Client server (with per-route SEO head) running on port ${port}`);
});
