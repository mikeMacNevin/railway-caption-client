// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "colorTheme": "light",
          "dateRange": "1D",
          "locale": "en",
          "largeChartUrl": "",
          "isTransparent": true,
          "showFloatingTooltip": false,
          "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
          "plotLineColorFalling": "rgba(41, 98, 255, 1)",
          "gridLineColor": "rgba(240, 243, 250, 0)",
          "scaleFontColor": "#0F0F0F",
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
          "width": "100%",
          "height": "500",
          "showSymbolLogo": true,
          "showChart": false
        }`;
      container.current.appendChild(script);

      
     return () => {
          // Cleanup: remove the script when the component unmounts or re-renders
          if (container.current && container.current.contains(script)) {
            container.current.removeChild(script);
          }
        };
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Market data by TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewWidget);


