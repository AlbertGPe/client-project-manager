import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthStore";

const activeNavLink = ({ isActive }) =>
  isActive ? "nav-link active" : "nav-link";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Navbar() {
  const { user, onUserChange } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    onUserChange();
    navigate("/auth/login");
  }

  const displayName = user?.name ?? user?.username ?? "User";
  const initials = getInitials(displayName);

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

      <div className="sidenav-footer">
        <div className="user-avatar">{initials}</div>
        <div className="user-info">
          <span className="user-name">{displayName}</span>
          <span className="user-role">Admin</span>
        </div>
        <div className="user-status" title="Online" />
        <button className="logout-btn" onClick={handleLogout} title="Sign out">
          ⇥
        </button>
      </div>
    </div>
  );
}

export default Navbar;
