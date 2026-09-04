import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <span className="site-footer-copy">&copy; {new Date().getFullYear()} caption.news</span>
                <nav className="site-footer-links">
                    <a href="mailto:privacy@caption.news?subject=Report%20an%20issue">Report an Issue</a>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;
