    import { Link } from 'react-router-dom';


    import "./Navbar.css"

    function Navbar() {

        return (
            <nav>
                <Link to="/">
                    <button type="button" class="btn btn-outline-secondary mt-0">
                        Front Page    
                    </button>
                </Link>
                <Link to="/politics">
                    <button type="button" class="btn btn-outline-secondary mt-0">
                        Politics 
                    </button>
                </Link>
                <Link to="/finance">
                    <button type="button" class="btn btn-outline-secondary mt-0">
                        Finance  
                    </button>
                </Link>
                <Link to="/world">
                    <button type="button" class="btn btn-outline-secondary mt-0">
                        World 
                    </button>
                </Link>
            </nav>
        )
    }

export default Navbar;