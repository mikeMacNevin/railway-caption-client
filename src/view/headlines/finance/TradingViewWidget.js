// TradingViewWidget.jsx
//
// Rewritten on TradingView's newer Web Component embed
// (<tv-market-overview>) instead of the classic script+iframe embed.
// The classic embed is a genuinely cross-origin iframe, so our page's CSS
// can never reach its background - isTransparent + colorTheme:"dark" still
// left a white card behind the ticker rows, and we could only ever nudge
// things around the OUTSIDE of it (see the old copyright-alignment fix).
// The web component instead renders into this document's own tree (behind
// a shadow root), so real CSS custom properties from our page cascade
// into it, and its `theme` attribute updates live - no more clearing the
// container and re-injecting a whole new script on every theme toggle.
//
// Trade-off: this widget's symbol-sectors config only takes plain
// "EXCHANGE:TICKER" strings, not the classic embed's richer
// {s, d, logoid} objects - so the custom display names/logos are gone in
// favor of TradingView's own default names (verified these read fine,
// e.g. "State Street SPDR S&P 500 ETF" for SPY). It also includes its own
// attribution ("World markets by TradingView") built into the component,
// so we no longer render or position that ourselves at all.
import { useEffect, useState, memo } from 'react';
import { resolveTheme, THEME_CHANGE_EVENT } from '../../../theme';
import './finance.css';

const SCRIPT_SRC = 'https://widgets.tradingview-widget.com/w/en/tv-market-overview.js';

// The defining script only ever needs to load once for the custom element
// to be registered - cache the load so remounting this component (e.g.
// switching tabs and back) doesn't inject it again.
let scriptLoadPromise = null;
function loadWidgetScript() {
    if (!scriptLoadPromise) {
        scriptLoadPromise = new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.type = 'module';
            script.src = SCRIPT_SRC;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load TradingView widget script'));
            document.head.appendChild(script);
        });
    }
    return scriptLoadPromise;
}

const SYMBOL_SECTORS = JSON.stringify([
    {
        sectionName: 'Stocks',
        // S&P 500, S&P 600, Nasdaq, DOW, International (Europe), International (Asia)
        symbols: ['AMEX:SPY', 'AMEX:VIOO', 'NASDAQ:QQQ', 'AMEX:DIA', 'AMEX:IEV', 'NASDAQ:AAXJ'],
    },
    {
        sectionName: 'Bonds',
        // Fed Funds, Corp AAA, Corp BBB, Corp Junk, 2yr/10yr/30yr Treasury
        symbols: ['FRED:FEDFUNDS', 'FRED:AAA', 'FRED:BAA', 'AMEX:HYG', 'FRED:DGS2', 'FRED:DGS10', 'FRED:DGS30'],
    },
    {
        sectionName: 'Commodities',
        symbols: ['CMCMARKETS:GOLD', 'TVC:SILVER', 'PYTH:WTI3!', 'CAPITALCOM:NATURALGAS', 'CAPITALCOM:COPPER', 'AMEX:URA'],
    },
    {
        // Everything that used to live under "Misc".
        sectionName: 'Econ',
        symbols: ['FRED:FEDFUNDS', 'FRED:UNRATE', 'FRED:MORTGAGE30US', 'FRED:FYFSD', 'FRED:DGS10'],
    },
]);

function TradingViewWidget() {
    const [theme, setTheme] = useState(resolveTheme);
    const [scriptReady, setScriptReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        loadWidgetScript()
            .then(() => { if (!cancelled) setScriptReady(true); })
            .catch((err) => console.error(err.message));
        return () => { cancelled = true; };
    }, []);

    // Unlike the old iframe embed, this one just takes a live attribute
    // update - no clearing/re-injecting anything.
    useEffect(() => {
        function handleThemeChange(e) {
            setTheme(e.detail);
        }
        window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    }, []);

    if (!scriptReady) {
        return <div className="tradingview-widget-container" style={{ minHeight: 500 }} />;
    }

    return (
        <div className="tradingview-widget-container">
            <tv-market-overview
                theme={theme}
                locale="en"
                symbol-sectors={SYMBOL_SECTORS}
            ></tv-market-overview>
        </div>
    );
}

export default memo(TradingViewWidget);
