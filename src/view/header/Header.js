import './Header.scss'

import topLogo from '../../assets/top-logo.png';
import topLogoDark from '../../assets/top-logo-dark.png';
import ThemeToggle from './ThemeToggle';

function header() {

    return (
        <div className="header-container">
            <img src={topLogo} alt="site-logo" className="logo-light" />
            <img src={topLogoDark} alt="site-logo" className="logo-dark" />
            <ThemeToggle />
        </div>
    )
}

export default header;
