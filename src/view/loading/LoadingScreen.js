import './LoadingScreen.scss';

import topLogo from '../../assets/top-logo.png';

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-screen-content">
                <img src={topLogo} alt="caption.news" className="loading-logo" />
                <div className="loading-spinner" role="status" aria-label="Loading" />
            </div>
        </div>
    )
}

export default LoadingScreen;
