// Dark mode: resolution, persistence, and applying it to the document.
//
// Bootstrap 5.3 only flips its own components dark when data-bs-theme is
// explicitly "dark" or "light" on an ancestor - it has no built-in
// prefers-color-scheme fallback of its own. So rather than leaving the
// attribute unset for "system" and relying on a CSS media query (which
// would cover this app's own tokens but not Bootstrap's), this always
// resolves to a concrete value and sets the attribute explicitly: the
// user's stored choice if they've made one, otherwise the OS preference
// at the moment it's read.
//
// public/index.html runs this same resolution inline, synchronously,
// before first paint, so there's no flash of the wrong theme on load.

const STORAGE_KEY = 'caption-news-theme';

export function getStoredTheme() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : null;
    } catch (e) {
        return null;
    }
}

export function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function resolveTheme() {
    return getStoredTheme() || getSystemTheme();
}

// Name of the event dispatched on `window` whenever the active theme
// changes. Most of the app never needs this - it's all CSS custom
// properties, so the whole page repaints for free the moment the
// data-bs-theme attribute changes. It only matters for things that bake a
// color choice into non-CSS state at mount time, like the TradingView
// widget's colorTheme config - those need an explicit signal to redo that
// work.
export const THEME_CHANGE_EVENT = 'caption-news-theme-change';

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
}

// Persists an explicit user choice and applies it immediately.
export function setTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
        // Private browsing / storage disabled - theme still applies for
        // this page load, it just won't persist across visits.
    }
    applyTheme(theme);
}
