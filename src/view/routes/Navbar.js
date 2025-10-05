    import { Link } from 'react-router-dom';


    import "./Navbar.css"

    function Navbar() {

        return (
            <nav>
                <Link to="/">
                    <button type="button" class="btn btn-outline-secondary">
                        Front Page    
                    </button>
                </Link>
                <Link to="/politics">
                    <button type="button" class="btn btn-outline-secondary">
                        Politics 
                    </button>
                </Link>
                <Link to="/finance">
                    <button type="button" class="btn btn-outline-secondary">
                        Finance  
                    </button>
                </Link>
            </nav>
        )
    }

export default Navbar;