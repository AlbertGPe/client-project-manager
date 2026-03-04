import { NavLink } from "react-router-dom";
import "./Navbar.css";

const activeNavLink = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'

function Navbar() {
  return (
    <div className="sidenav">
      <li><NavLink to='/' className={activeNavLink}>Home</NavLink></li>
      <li><NavLink to='/' className={activeNavLink}>About</NavLink></li>
      <li><NavLink to='/projects' className={activeNavLink}>Projects</NavLink></li>
      <li><NavLink to='/clients' className={activeNavLink}>Clients</NavLink></li>
    </div>
  );
}

export default Navbar;
