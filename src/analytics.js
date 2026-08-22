// Minimal GA4 wrapper.
//
// Two responsibilities, kept separate on purpose:
//   initAnalytics()   - loads gtag.js once and configures it *without* its
//                        automatic pageview (send_page_view: false), because
//                        this is a single-page app - the automatic pageview
//                        only fires on the very first hard load.
//   trackPageview(path) - the one thing that actually records a pageview,
//                        called on every route change (including the first)
//                        so client-side navigation isn't undercounted.
//
// No-ops entirely (including never injecting the script) when
// REACT_APP_GA_MEASUREMENT_ID isn't set, so local dev stays out of your
// real analytics by default.

const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

let initialized = false;

export function initAnalytics() {
    if (!GA_ID || initialized) return;
    initialized = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, { send_page_view: false });
}

export function trackPageview(path) {
    if (!GA_ID || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
    });
}
