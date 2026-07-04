import './Header.scss'

import topLogo from '../../assets/top-logo.png';

function header() { 

    return (
        <div className="header-container">
            <img src={topLogo} alt="site-logo" />
        </div>
    )
}

export default header;