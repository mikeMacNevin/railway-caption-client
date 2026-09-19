import './Header.scss'

import { Link } from 'react-router-dom';
import topLogo from '../../assets/top-logo.png';
import topLogoDark from '../../assets/top-logo-dark.svg';
import ThemeToggle from './ThemeToggle';

function header() {

    return (
        <div className="header-container">
            {/* Wrapper exists purely so CSS can reflow these two into their
                own row above the logo on mobile (see Header.scss) - on
                desktop it's `display: contents` and disappears, leaving
                ThemeToggle's own absolute positioning untouched. */}
            <div className="header-icons">
                <ThemeToggle />
                {/* Desktop's search box lives inline in Navbar.js instead - this
                    icon only shows up on mobile, where there's no room for it. */}
                <Link to="/search" className="header-search-link" aria-label="Search headlines">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </Link>
            </div>
            <Link to="/" aria-label="caption.news home">
                <img src={topLogo} alt="site-logo" className="logo-light" />
                <img src={topLogoDark} alt="site-logo" className="logo-dark" />
            </Link>
        </div>
    )
}

export default header;
