import { Helmet } from 'react-helmet-async';
import './legal.scss';

function PrivacyPolicy() {
    return (
        <div className="container home-container pt-1">
            <Helmet>
                <title>Privacy Policy | caption.news</title>
                <meta name="description" content="How caption.news collects and uses information from visitors." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="container-fluid px-0">
                <h2 className="current-page">Privacy Policy</h2>
            </div>

            <div className="legal-page">
                <p className="legal-updated">Last updated: September 2026</p>

                <p>caption.news ("we," "the site") aggregates news headlines from other publishers and links out to their websites. This page explains what information we collect from visitors, and what we don't.</p>

                <h2>Information we collect</h2>
                <p>We use Google Analytics to understand how people use the site — things like device and browser type, approximate location (derived from IP address, not precise location), which pages are viewed, how long you stay, and what site referred you here. Google Analytics sets cookies to do this.</p>
                <p>We also show ads through Google AdSense. Google and the advertising companies it works with may use cookies and similar technology to serve ads and measure how they perform, including based on your activity on this and other websites.</p>
                <p>We don't have user accounts, sign-ups, or comments, so we never collect your name, email address, or any account information directly. We don't know who you are.</p>

                <h2>Cookies</h2>
                <p>Google Analytics sets first- and third-party cookies to distinguish visitors and measure usage. Google AdSense and its advertising partners also set their own cookies to serve ads and personalize them based on your browsing activity. You can block or delete cookies at any time through your browser settings; the site works fine without them, though ads may be less relevant and we won't be able to tell you were here.</p>

                <h2>Third-party links</h2>
                <p>Every headline on caption.news links to the original article on the publisher's own website. Once you click through, you're on their site, subject to their privacy policy and practices — we have no control over, and no visibility into, what happens there.</p>

                <h2>How information is used and shared</h2>
                <p>We use analytics data to understand what's popular, fix what's broken, and improve the site. We don't sell personal information, and we don't share it with anyone beyond the service providers who help us run the site (currently, Google Analytics and Google AdSense — see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> for how they handle that data).</p>

                <h2>Your choices</h2>
                <p>You can opt out of Google Analytics tracking across all websites using <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google's browser opt-out add-on</a>, or block cookies generally in your browser's privacy settings. To opt out of personalized advertising from Google, visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google's Ad Settings</a>; many other ad companies offer similar controls through the <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance's opt-out page</a>.</p>
                <p>If you're in the EU/UK, California, or anywhere else with data-access or deletion rights under laws like the GDPR or CCPA, email us at the address below and we'll handle your request — we're a small site without a self-service tool for this yet, so it'll be a manual reply, but we will respond.</p>

                <h2>Children's privacy</h2>
                <p>caption.news isn't directed at children, and we don't knowingly collect information from anyone under 13.</p>

                <h2>Changes to this policy</h2>
                <p>We'll update this page whenever what we collect or how we use it changes. Check back occasionally if you're curious.</p>

                <h2>Contact</h2>
                <p>Questions, requests, or concerns about privacy: <a href="mailto:privacy@caption.news">privacy@caption.news</a></p>

                <p className="legal-note">This is a plain-language policy written for a small, independent site, not a substitute for legal advice. If you have specific legal concerns about how caption.news handles your data, an attorney is a better resource than this page.</p>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
