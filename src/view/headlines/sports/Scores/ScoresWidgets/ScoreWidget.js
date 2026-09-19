import { useMemo } from 'react';
import { resolveTheme } from '../../../../../theme';

// 365Scores' widget script silently no-ops on any [data-widget-type] div
// that doesn't also carry a data-widget-id - confirmed by comparing their
// own widget generator's output with/without one. It just needs to be
// present and unique, not registered anywhere, so a random id generated
// once per mount is enough.
//
// It also only scans the DOM once, when its script first loads, and never
// again - confirmed that neither mutating an existing widget div nor
// re-injecting the script re-triggers it. So unlike the TradingView web
// component, this can't react live to a theme toggle: it reads the theme
// once at mount (correct whenever the Teams tab is opened/reopened, since
// Scores unmounts on tab switch) and just leaves it as-is if the user
// flips dark/light while already sitting on the tab, rather than forcing
// a remount that would only leave the widget blank.
function makeWidgetId() {
    return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
}

const ScoreWidget = ({ entityId }) => {
    const theme = useMemo(resolveTheme, []);
    const widgetId = useMemo(makeWidgetId, []);

    return (
        <div>
            <div
                data-widget-type="entityScores"
                data-entity-type="league"
                data-entity-id={entityId}
                data-lang="en"
                data-widget-id={widgetId}
                data-theme={theme}
            ></div>
            <div id="powered-by">Powered by<a id="powered-by-link" href="https://www.365scores.com" target="_blank" rel="noreferrer">365Scores.com</a></div>
        </div>
    );
};

export default ScoreWidget;
