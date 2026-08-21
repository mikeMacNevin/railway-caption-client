import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.scss';

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
        </nav>
    );
}

export default Navbar;
