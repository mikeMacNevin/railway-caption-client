import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <span className="site-footer-copy">&copy; {new Date().getFullYear()} caption.news</span>
                <nav className="site-footer-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;
