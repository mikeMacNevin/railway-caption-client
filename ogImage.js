// Per-briefing share image (1200x630 PNG) for link previews on Reddit,
// Bluesky, X, Slack, iMessage, etc. Drawn as an SVG and rasterized with
// resvg, using the bundled Old Standard TT so it renders the same on a bare
// server with no system fonts.

const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const FONT_FILES = [
  path.join(__dirname, 'fonts', 'OldStandard-Regular.ttf'),
  path.join(__dirname, 'fonts', 'OldStandard-Bold.ttf'),
];

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 80;
const TEXT_WIDTH = WIDTH - MARGIN * 2;
const MAX_LINES = 4;
// Old Standard TT averages roughly this fraction of the font size per
// character. Slightly high on purpose, so wrapped lines err toward short.
const CHAR_WIDTH_EM = 0.5;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function wrap(text, fontSize) {
  const perLine = Math.floor(TEXT_WIDTH / (fontSize * CHAR_WIDTH_EM));
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > perLine) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Largest size that fits the headline in MAX_LINES lines.
function layoutHeadline(headline) {
  for (const size of [76, 68, 60, 54, 48]) {
    const lines = wrap(headline, size);
    if (lines.length <= MAX_LINES) return { size, lines };
  }
  const size = 48;
  const lines = wrap(headline, size).slice(0, MAX_LINES);
  lines[MAX_LINES - 1] = `${lines[MAX_LINES - 1].replace(/[\s.,;:]+$/, '')}…`;
  return { size, lines };
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

function buildSvg({ date, headline }) {
  const { size, lines } = layoutHeadline(headline);
  const lineHeight = Math.round(size * 1.2);
  const blockTop = 210;
  const text = lines
    .map((line, i) => `<text x="${MARGIN}" y="${blockTop + size + i * lineHeight}" font-size="${size}" fill="#1b1b1b">${escapeXml(line)}</text>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="Old Standard TT">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#f7f5f0"/>
  <rect y="${HEIGHT - 16}" width="${WIDTH}" height="16" fill="#17394f"/>
  <text x="${MARGIN}" y="112" font-size="44" font-weight="700" fill="#0b3a72">caption<tspan fill="#00b8d9">.news</tspan></text>
  <text x="${MARGIN}" y="168" font-size="26" letter-spacing="2" fill="#5a5a5a">${escapeXml(`DAILY NEWS BRIEFING · ${formatDate(date).toUpperCase()}`)}</text>
  ${text}
</svg>`;
}

// Small in-memory cache: the same image is requested by every platform that
// unfurls the link. Keyed by content, so a regenerated briefing (new
// headline) gets a fresh image instead of a stale one.
const cache = new Map();
const CACHE_MAX = 200;

function renderBriefingImage({ date, headline }) {
  const key = `${date}|${headline}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const png = new Resvg(buildSvg({ date, headline }), {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Old Standard TT' },
  }).render().asPng();

  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, png);
  return png;
}

module.exports = { renderBriefingImage };
