import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const syncUser = () => {
            try {
                setUser(JSON.parse(localStorage.getItem("user") || "null"));
            } catch {
                setUser(null);
            }
        };
        window.addEventListener("auth-changed", syncUser);
        window.addEventListener("storage", syncUser);
        return () => {
            window.removeEventListener("auth-changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        closeMenu();
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                🩸 <span>LifeDrop</span>
            </div>

            <div
                className={`hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                <li>
                    <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/find-donor" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Find Donor
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/request-blood" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Request Blood
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/requests" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Track Request
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/blood-banks" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                        Blood Banks
                    </NavLink>
                </li>
                {user?.role === "admin" && (
                    <li>
                        <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                            Admin
                        </NavLink>
                    </li>
                )}
                <li>
                    {user ? (
                        <button type="button" className="nav-auth-btn" onClick={logout}>Logout</button>
                    ) : (
                        <NavLink to="/register" onClick={closeMenu} className="nav-register-btn">Register</NavLink>
                    )}
                </li>
                {!user && <li>
                    <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Login</NavLink>
                </li>}
            </ul>
        </nav>
    );
}

export default Navbar;