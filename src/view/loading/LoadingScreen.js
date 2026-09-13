import './LoadingScreen.scss';

import topLogo from '../../assets/top-logo.png';
import topLogoDark from '../../assets/top-logo-dark.svg';

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-screen-content">
                <img src={topLogo} alt="caption.news" className="loading-logo logo-light" />
                <img src={topLogoDark} alt="caption.news" className="loading-logo logo-dark" />
                <div className="loading-spinner" role="status" aria-label="Loading" />
            </div>
        </div>
    )
}

export default LoadingScreen;
