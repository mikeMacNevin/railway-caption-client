// Formats a timestamp as a short relative string ("2h ago") - the fastest
// signal a reader has that a feed is actually live, not stale. Falls back
// to a short date past a week old, though in practice the API only ever
// returns articles from the last 48 hours (see server/routes/articles.js),
// so that branch mostly exists for correctness, not because it fires.
//
// created_at is when the scraper first saw a headline (server/db/
// saveToDatabase.js). The Front Page is scraped every 10 minutes, so that's
// as precise as the times get - anything inside one cycle is just "Just now",
// and minutes after that count in whole cycles ("20m ago") rather than
// implying a precision the data doesn't have. Keep this in sync with
// SCRAPE_INTERVAL_MINUTES in server/scrapeWorker.js.
const SCRAPE_INTERVAL_MINUTES = 10;

export function formatTimeAgo(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < SCRAPE_INTERVAL_MINUTES) return 'Just now';
    if (minutes < 60) return `${Math.floor(minutes / SCRAPE_INTERVAL_MINUTES) * SCRAPE_INTERVAL_MINUTES}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
