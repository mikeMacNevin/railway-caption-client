// Formats a timestamp as a short relative string ("2h ago") - the fastest
// signal a reader has that a feed is actually live, not stale. Falls back
// to a short date past a week old, though in practice the API only ever
// returns articles from the last 48 hours (see server/routes/articles.js),
// so that branch mostly exists for correctness, not because it fires.
//
// The scraper runs once per hour (server/scrapeWorker.js), so a whole batch
// of articles lands with nearly identical created_at values. Showing exact
// minutes ("17m ago") on a bunch of simultaneous articles just exposes that
// batching and implies a precision the data doesn't have - nothing under one
// scrape cycle is meaningfully "more" or "less" recent. So everything inside
// the current cycle collapses to a single "Just now", and hourly buckets
// only start once we're past it. Keep this in sync with the cron schedule
// in server/scrapeWorker.js if that cadence ever changes.
const SCRAPE_INTERVAL_MINUTES = 60;

export function formatTimeAgo(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < SCRAPE_INTERVAL_MINUTES) return 'Just now';

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
