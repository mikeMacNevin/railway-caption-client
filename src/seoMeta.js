// Shared SEO/meta config for every page route.
//
// This is plain CommonJS (no JSX, no ES-only syntax) on purpose: it's
// imported both by the React app (Home.js, for react-helmet-async) and by
// the plain-Node server.js that server-side-renders <head> tags for
// crawlers and link-unfurlers that don't execute JavaScript. Keeping one
// source of truth means the two can't drift out of sync.

const SITE_URL = 'https://www.caption.news';
// 1200x630 - the standard OG/Twitter "large image" aspect ratio, so link
// previews on Facebook/X/Slack/Discord/iMessage etc. render uncropped.
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const PAGE_META = {
  home:        { title: 'Top Headlines',       description: 'The latest top headlines from across the web, aggregated in one place.' },
  politics:    { title: 'Politics Headlines',  description: 'Breaking political news and analysis from leading news sources.' },
  finance:     { title: 'Finance Headlines',   description: 'Stock market updates, economic news, and financial headlines.' },
  world:       { title: 'World Headlines',     description: 'International news and global headlines from around the world.' },
  sports:      { title: 'Sports Headlines',    description: 'The latest sports scores, trades, and news from top sports outlets.' },
  tech:        { title: 'Tech Headlines',      description: 'Technology news, product launches, and industry updates.' },
  celebs:      { title: 'Celebrity Headlines', description: 'Celebrity gossip, entertainment news, and pop culture updates.' },
  movies:      { title: 'Movie Headlines',     description: 'Film reviews, box office news, and movie industry updates.' },
  tv:          { title: 'TV Headlines',        description: 'Television news, show recaps, and streaming updates.' },
  videogames:  { title: 'Gaming Headlines',    description: 'Video game news, reviews, and release updates.' },
  travel:      { title: 'Travel Headlines',    description: 'Travel tips, destination guides, and tourism news.' },
  health:      { title: 'Health Headlines',    description: 'Medical news, wellness tips, and health industry updates.' },
  science:     { title: 'Science Headlines',   description: 'Scientific discoveries, research news, and technology breakthroughs.' },
};

module.exports = { PAGE_META, SITE_URL, DEFAULT_IMAGE };
