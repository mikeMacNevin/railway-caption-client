import './Header.css'
import logo from '../../assets/logo.png'

function header() {

    return (
        <div className="container my-3">
            <img src={logo} className='site-logo' />
            {/* <hr className="header-hr"></hr> */}
        </div>
    )
}

export default header;