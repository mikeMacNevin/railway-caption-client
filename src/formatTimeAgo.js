// Formats a timestamp as a short relative string ("2h ago") - the fastest
// signal a reader has that a feed is actually live, not stale. Falls back
// to a short date past a week old, though in practice the API only ever
// returns articles from the last 48 hours (see server/routes/articles.js),
// so that branch mostly exists for correctness, not because it fires.
export function formatTimeAgo(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 45) return 'just now';

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.round(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
