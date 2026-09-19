import { useEffect, useState } from 'react';
import { resolveTheme, THEME_CHANGE_EVENT } from '../../../../../theme';

// 365Scores' widget script only scans the DOM for [data-widget-type]
// elements once, on load (see the script-load guard in ../Scores.js) - it
// doesn't watch data-theme for live updates the way TradingView's web
// component does. So on a theme change we swap `key` to force React to
// tear down and recreate the container div, which the widget script's own
// mutation-watching picks back up with the new data-theme.
const ScoreWidget = ({ entityId }) => {
    const [theme, setTheme] = useState(resolveTheme);

    useEffect(() => {
        function handleThemeChange(e) {
            setTheme(e.detail);
        }
        window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    }, []);

    return (
        <div>
            <div
                key={theme}
                data-widget-type="entityScores"
                data-entity-type="league"
                data-entity-id={entityId}
                data-lang="en"
                data-theme={theme}
            ></div>
            <div id="powered-by">Powered by<a id="powered-by-link" href="https://www.365scores.com" target="_blank" rel="noreferrer">365Scores.com</a></div>
        </div>
    );
};

export default ScoreWidget;
