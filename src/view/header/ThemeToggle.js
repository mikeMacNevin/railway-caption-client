import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa6';
import { resolveTheme, setTheme, getStoredTheme, getSystemTheme } from '../../theme';
import './ThemeToggle.scss';

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
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
    );
}

export default ThemeToggle;
