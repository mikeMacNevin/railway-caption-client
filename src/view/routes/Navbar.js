    import { Link } from 'react-router-dom';


    import "./Navbar.css"

    function Navbar() {

        // const pages = [
        //     '/', '/politics', '/finance', '/world', '/people'
        // ]
        // pages.map((navlink) => 
        // <Link to="/">
        //              <button type="button" class="btn btn-outline-success mt-0">
        //                  Front Page    
        //              </button>
        // </Link>
        // )


        return (
            <nav>
                <Link to="/">
                    <button type="button" class="btn btn-outline-success mt-0">
                        Front Page    
                    </button>
                </Link>
                <Link to="/politics">
                    <button type="button" class="btn btn-outline-success mt-0">
                        Politics 
                    </button>
                </Link>
                <Link to="/finance">
                    <button type="button" class="btn btn-outline-success mt-0">
                        Finance  
                    </button>
                </Link>
                <Link to="/world">
                    <button type="button" class="btn btn-outline-success mt-0">
                        World 
                    </button>
                </Link>
                <Link to="/sports">
                    <button type="button" class="btn btn-outline-success mt-0">
                        Sports
                    </button>
                </Link>
                <Link to="/tech">
                    <button type="button" class="btn btn-outline-success mt-0">
                        Tech
                    </button>
                </Link>
                <Link to="/celebs">
                    <button type="button" class="btn btn-outline-success mt-0">
                        Celebs
                    </button>
                </Link>

            </nav>
        )
    }

export default Navbar;