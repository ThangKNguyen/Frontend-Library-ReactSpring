import { NavLink, Link } from "react-router"
export const Navbar = () =>{
    return(
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-2'>
        <div className='container-fluid'>
            <span className='navbar-brand'>Luv 2 Read</span>
            
            <button className='navbar-toggler' type='button' data-bs-toggle='collapse' 
            data-bs-target='#navbarNavDropDown' aria-controls='navbarNavDropDown' aria-expanded='false'
            aria-label='Toggle navigation'>
                <span className='navbar-toggler-icon'></span>
            </button>

            <div className='collapse navbar-collapse' id='navbarNavDropDown'> 
              <ul className='navbar-nav'>

                  <li className='nav-item'>
                      <NavLink className='nav-link' to='/'>Home</NavLink>
                  </li>

                  <li className='nav-item'>
                      <NavLink className='nav-link' to='/search'>Search Books</NavLink>
                  </li>
                  
              </ul>

              <ul className='navbar-nav ms-auto'>
                <li className="nav-item m-1">
                    <a type="button" className="btn btn-outline-light" href="#">Sign In</a>
                </li>
              </ul>
            </div>
        </div>
      
    </nav>
    )
}