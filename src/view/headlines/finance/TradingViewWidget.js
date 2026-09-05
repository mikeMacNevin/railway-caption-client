// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';
import { resolveTheme, THEME_CHANGE_EVENT } from '../../../theme';

function buildConfig(theme) {
  return {
    "colorTheme": theme,
    "dateRange": "1D",
    "locale": "en",
    "largeChartUrl": "",
    "isTransparent": true,
    "showFloatingTooltip": false,
    "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
    "plotLineColorFalling": "rgba(41, 98, 255, 1)",
    "gridLineColor": "rgba(240, 243, 250, 0)",
    "scaleFontColor": theme === "dark" ? "#D1D4DC" : "#0F0F0F",
    "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
    "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
    "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
    "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
    "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
    "tabs": [
      {
        "title": "Indices",
        "symbols": [
          {
            "s": "AMEX:SPY",
            "d": "S&P 500 - US Lg Cap",
            "logoid": "spdr-sandp500-etf-tr",
            "currency-logoid": "country/US"
          },
          {
            "s": "AMEX:VIOO",
            "d": "S&P 600 - US Sm Cap",
            "logoid": "vanguard",
            "currency-logoid": "country/US"
          },
          {
            "s": "AMEX:VEA",
            "d": "FTSE Developed Mkts Ex-US",
            "logoid": "vanguard",
            "currency-logoid": "country/US"
          },
          {
            "s": "AMEX:EEM",
            "d": "MSCI Emerging Markets",
            "logoid": "ishares",
            "currency-logoid": "country/US"
          },
          {
            "s": "AMEX:IEV",
            "d": "S&P Europe 350",
            "logoid": "ishares",
            "currency-logoid": "country/US"
          },
          {
            "s": "NASDAQ:MCHI",
            "d": "MSCI China Index",
            "logoid": "ishares",
            "currency-logoid": "country/US"
          }
        ],
        "originalTitle": "Indices"
      },
      {
        "title": "Commodities",
        "symbols": [
          {
            "s": "CMCMARKETS:GOLD",
            "d": "Gold"
          },
          {
            "s": "TVC:SILVER",
            "d": "Silver",
            "logoid": "metal/silver",
            "currency-logoid": "country/US"
          },
          {
            "s": "CAPITALCOM:NATURALGAS",
            "d": "Nat Gas",
            "logoid": "natural-gas",
            "currency-logoid": "country/US"
          },
          {
            "s": "PYTH:WTI3!",
            "d": "WTI Crude Oil"
          },
          {
            "s": "CAPITALCOM:COPPER",
            "d": "Copper",
            "logoid": "metal/copper",
            "currency-logoid": "country/US"
          },
          {
            "s": "CAPITALCOM:WHEAT",
            "d": "Wheat",
            "logoid": "commodity/wheat",
            "currency-logoid": "country/US"
          }
        ],
        "originalTitle": "Futures"
      },
      {
        "title": "Misc",
        "symbols": [
          {
            "s": "FRED:FEDFUNDS",
            "d": "Fed Funds",
            "logoid": "country/US"
          },
          {
            "s": "FRED:UNRATE",
            "d": "US Unemployment Rate",
            "logoid": "country/US"
          },
          {
            "s": "FRED:MORTGAGE30US",
            "d": "30 yr. Fixed Mortgage",
            "logoid": "country/US"
          },
          {
            "s": "FRED:FYFSD",
            "d": "US Deficit",
            "logoid": "country/US",
            "currency-logoid": "country/US"
          },
          {
            "s": "FRED:DGS10",
            "d": "US 10 Yr Yield",
            "logoid": "country/US"
          }
        ]
      }
    ],
    "support_host": "https://www.tradingview.com",
    "width": "auto",
    "height": "500",
    "showSymbolLogo": true,
    "showChart": false
  };
}

function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    function render(theme) {
      // TradingView's own embed has no live "change theme" API - it only
      // reads colorTheme once, at script-injection time - so reflecting a
      // theme change means clearing the widget out and re-injecting it.
      // TradingView's script replaces the placeholder div with an iframe
      // (plus some <style> tags) as direct siblings in this container, so
      // clear everything EXCEPT our own copyright div - a blanket
      // innerHTML='' would delete that too, since React rendered it as a
      // sibling of the widget, not something TradingView's script owns.
      const el = container.current;
      Array.from(el.children).forEach((child) => {
        if (!child.classList.contains('tradingview-widget-copyright')) {
          el.removeChild(child);
        }
      });

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify(buildConfig(theme));
      const copyrightEl = el.querySelector('.tradingview-widget-copyright');
      el.insertBefore(script, copyrightEl);
    }

    render(resolveTheme());

    function handleThemeChange(e) {
      render(e.detail);
    }
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  return (
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow"><span className="blue-text">Market data by TradingView</span></a></div>
      </div>
  );
}

export default memo(TradingViewWidget);
