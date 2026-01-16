import './Header.scss'
import logo from '../../assets/logo.png'

function header() { 

    return (
        <div className="header-container">
            {/* <img src={logo} className='site-logo' alt='site-logo' /> */}
            <h1 className="primary">CAPTION.news</h1>
            {/* <hr className="header-hr"></hr> */}
        </div>
    )
}

export default header;