import './Header.scss'

import { Link } from 'react-router-dom';
import topLogo from '../../assets/top-logo.png';
import topLogoDark from '../../assets/top-logo-dark.svg';
import ThemeToggle from './ThemeToggle';

function header() {

    return (
        <div className="header-container">
            <img src={topLogo} alt="site-logo" className="logo-light" />
            <img src={topLogoDark} alt="site-logo" className="logo-dark" />
            {/* Desktop's search box lives inline in Navbar.js instead - this
                icon only shows up on mobile, where there's no room for it. */}
            <Link to="/search" className="header-search-link" aria-label="Search headlines">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </Link>
            <ThemeToggle />
        </div>
    )
}

export default header;
