import { NavLink } from "react-router-dom";
import "./Navbar.css";

// activeNavLink: tells React Router to apply 'nav-link active' to the
// current route, and 'nav-link' to all others.
// The CSS handles the gold border + background for the active state.
const activeNavLink = ({ isActive }) =>
  isActive ? "nav-link active" : "nav-link";

function Navbar() {
  return (
    <div className="sidenav">
      <div className="sidenav-brand">
        <span className="sidenav-brand-name">
          Clojec Manager<span>.</span>
        </span>
        <span className="sidenav-brand-tag">CRM Platform</span>
      </div>

      <nav className="sidenav-nav">
        <ul>
          <span className="nav-section-label">Main</span>

          <li>
            <NavLink to="/" className={activeNavLink} end>
              <span className="nav-icon">⌂</span>
              Home
            </NavLink>
          </li>

          <div className="nav-divider" />

          <span className="nav-section-label">Management</span>

          <li>
            <NavLink to="/clients" className={activeNavLink}>
              <span className="nav-icon">◈</span>
              Clients
            </NavLink>
          </li>

          <li>
            <NavLink to="/projects" className={activeNavLink}>
              <span className="nav-icon">◉</span>
              Projects
            </NavLink>
          </li>
        </ul>
      </nav>

      {/*
        TODO: replace hardcoded name/role/initials with data from
        auth context.
      */}
      <div className="sidenav-footer">
        <div className="user-avatar">AG</div>
        <div className="user-info">
          <span className="user-name">Albert Garcia</span>
          <span className="user-role">Admin</span>
        </div>
        <div className="user-status" title="Online" />
      </div>
    </div>
  );
}

export default Navbar;
