import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './Navbar.scss';

const SEARCH_DEBOUNCE_MS = 300;

const mainLinks = [
    { to: '/',         label: 'Front Page', end: true },
    { to: '/politics', label: 'Politics' },
    { to: '/finance',  label: 'Finance' },
    { to: '/world',    label: 'World' },
    { to: '/sports',   label: 'Sports' },
    { to: '/tech',     label: 'Tech' },
];

const moreLinks = [
    { to: '/celebs',     label: 'Celebrities' },
    { to: '/movies',     label: 'Movies' },
    { to: '/tv',         label: 'TV Shows' },
    { to: '/videogames', label: 'Games' },
    { to: '/travel',     label: 'Travel' },
    { to: '/health',     label: 'Health' },
    { to: '/science',    label: 'Science' },
];

function Navbar() {
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchDebounceRef = useRef(null);

    const onSearchPage = location.pathname === '/search';
    // Only reflects the URL while actually on /search - leaving search
    // (clicking Politics, say) should clear it rather than carry a stale
    // query into whatever page you land on next.
    const [searchValue, setSearchValue] = useState(onSearchPage ? (searchParams.get('q') || '') : '');

    useEffect(() => {
        setSearchValue(onSearchPage ? (searchParams.get('q') || '') : '');
    }, [onSearchPage, searchParams]);

    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, []);

    function handleSearchChange(e) {
        const value = e.target.value;
        setSearchValue(value);

        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            const query = value ? `?q=${encodeURIComponent(value)}` : '';
            // Once already on /search, each keystroke replaces history
            // instead of pushing - otherwise the back button would have to
            // click through every character typed.
            navigate(`/search${query}`, { replace: onSearchPage });
        }, SEARCH_DEBOUNCE_MS);
    }

    const isMoreActive = moreLinks.some(link => link.to === location.pathname);

    // Close the "More" panel on an outside click or Escape.
    useEffect(() => {
        function handleClickOutside(e) {
            if (moreRef.current && !moreRef.current.contains(e.target)) {
                setMoreOpen(false);
            }
        }
        function handleEscape(e) {
            if (e.key === 'Escape') setMoreOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    // Also close it whenever a navigation happens.
    useEffect(() => {
        setMoreOpen(false);
    }, [location.pathname]);

    return (
        <nav className="site-navbar">
            {/* Balances the search box on the right so the link list
                lands in the true center instead of hugging the left -
                same width-matching trick as a header with a logo centered
                between two independent side elements. */}
            <span className="site-navbar-spacer" aria-hidden="true" />
            <ul className="site-navbar-list">
                {mainLinks.map(link => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => `site-navbar-link${isActive ? ' active' : ''}`}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
                <li className="site-navbar-more" ref={moreRef}>
                    <button
                        type="button"
                        className={`site-navbar-link site-navbar-more-toggle${isMoreActive ? ' active' : ''}${moreOpen ? ' open' : ''}`}
                        onClick={() => setMoreOpen(prev => !prev)}
                        aria-haspopup="true"
                        aria-expanded={moreOpen}
                    >
                        More
                        <span className="caret" aria-hidden="true" />
                    </button>
                    {moreOpen && (
                        <div className="site-navbar-more-menu" role="menu">
                            {moreLinks.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    role="menuitem"
                                    className={({ isActive }) => `site-navbar-more-item${isActive ? ' active' : ''}`}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </li>
            </ul>
            <div className="site-navbar-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search headlines"
                    value={searchValue}
                    onChange={handleSearchChange}
                    aria-label="Search headlines"
                />
            </div>
        </nav>
    );
}

export default Navbar;
