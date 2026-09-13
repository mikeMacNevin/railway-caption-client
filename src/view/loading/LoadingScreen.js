import './LoadingScreen.scss';

import Logo from '../../assets/Logo';

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-screen-content">
                <Logo className="loading-logo" />
                <div className="loading-spinner" role="status" aria-label="Loading" />
            </div>
        </div>
    )
}

export default LoadingScreen;
