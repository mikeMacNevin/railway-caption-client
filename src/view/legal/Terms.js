import { Helmet } from 'react-helmet-async';
import './legal.scss';

function Terms() {
    return (
        <div className="container home-container pt-1">
            <Helmet>
                <title>Terms of Service | caption.news</title>
                <meta name="description" content="The terms for using caption.news." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="container-fluid px-0">
                <h2 className="current-page">Terms of Service</h2>
            </div>

            <div className="legal-page">
                <p className="legal-updated">Last updated: August 2026</p>

                <p>By using caption.news, you agree to these terms. If that doesn't work for you, please don't use the site.</p>

                <h2>What caption.news is</h2>
                <p>caption.news is a headline aggregator. We automatically collect headlines, links, and source names from other news publishers' websites and display them here, organized by category. We don't host, rewrite, or fact-check the underlying articles — every headline links directly to the original publisher, and that's where the actual reporting lives.</p>

                <h2>No warranty on third-party content</h2>
                <p>We aggregate headlines "as is." We don't control, endorse, or verify the accuracy of the articles we link to, and we're not responsible for their content, availability, or the practices of the sites you're taken to. If a link is broken, outdated, or the source has changed the story since we captured it, that's between you and the publisher.</p>

                <h2>Acceptable use</h2>
                <p>Use the site the way it's meant to be used. Don't try to scrape, overload, or interfere with caption.news's own infrastructure, and don't use it for anything illegal. We may restrict access for anyone who does.</p>

                <h2>Content removal requests</h2>
                <p>If you're a publisher or rights holder and would rather your site not be included in caption.news's aggregation, email <a href="mailto:privacy@caption.news">privacy@caption.news</a> and we'll remove your source — we'd rather do that than have anyone unhappy about being linked to.</p>

                <h2>No liability</h2>
                <p>caption.news is provided as-is, without warranties of any kind. To the extent the law allows, we're not liable for any damages arising from your use of the site or the third-party sites it links to.</p>

                <h2>Changes to these terms</h2>
                <p>We may update these terms as the site changes. Continuing to use caption.news after an update means you accept the new terms.</p>

                <h2>Contact</h2>
                <p>Questions about these terms: <a href="mailto:privacy@caption.news">privacy@caption.news</a></p>

                <p className="legal-note">This is a plain-language summary written for a small, independent site, not a substitute for legal advice.</p>
            </div>
        </div>
    );
}

export default Terms;
