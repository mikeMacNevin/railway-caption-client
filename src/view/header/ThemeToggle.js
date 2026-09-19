import { useEffect, useState } from 'react';
import { FaMoon } from 'react-icons/fa6';
import { resolveTheme, setTheme, getStoredTheme, getSystemTheme } from '../../theme';
import './ThemeToggle.scss';

// react-icons' FaSun packs its rays in tight and rounded, which at this
// button's small size reads as a gear/settings icon rather than a sun.
// A plain circle with separated straight-line rays (the classic
// Feather/Lucide "sun" glyph) is unambiguous at the same size.
function SunIcon() {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="1.5" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22.5" />
            <line x1="4.51" y1="4.51" x2="6.22" y2="6.22" />
            <line x1="17.78" y1="17.78" x2="19.49" y2="19.49" />
            <line x1="1.5" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22.5" y2="12" />
            <line x1="4.51" y1="19.49" x2="6.22" y2="17.78" />
            <line x1="17.78" y1="6.22" x2="19.49" y2="4.51" />
        </svg>
    );
}

function ThemeToggle() {
    const [theme, setThemeState] = useState(resolveTheme);

    // If the visitor hasn't made an explicit choice, keep following the OS
    // setting live - so switching your system to dark mode updates an
    // already-open tab without needing a reload.
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (!getStoredTheme()) {
                const next = getSystemTheme();
                setThemeState(next);
            }
        };
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, []);

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        setThemeState(next);
    };

    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={label}
            title={label}
        >
            {theme === 'dark' ? <SunIcon /> : <FaMoon />}
        </button>
    );
}

export default ThemeToggle;
