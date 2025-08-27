import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { SpinnerLoading } from "../utils/SpinnerLoading";

export const Navbar: React.FC = () => {
  const [roles, setRoles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, loginWithRedirect, logout, getIdTokenClaims, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const claims = await getIdTokenClaims();
        const fetchedRoles =
          (claims && (claims as any)["https://luv2code-react-library.com/roles"]) || [];
        setRoles(fetchedRoles);

        // ✅ print out useful info
        console.log("ID Token Claims:", claims);
        if (claims) {
          console.log("User ID (sub):", (claims as any).sub);
          console.log("User Email:", (claims as any).email);
        }

        // Try fetching an access token for API calls
        const accessToken = await getAccessTokenSilently();
        console.log("Access Token:", accessToken);
      } catch (err) {
        console.error("Error fetching access token:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [isAuthenticated, getIdTokenClaims, getAccessTokenSilently]);

  if (loading) return <SpinnerLoading />;

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Luv 2 Read</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Search Books
              </NavLink>
            </li>

            {/* {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/shelf">
                  Shelf
                </NavLink>
              </li>
            )} */}

            {isAuthenticated && roles?.includes("admin") && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <li className="nav-item m-1">
                <button className="btn btn-outline-light" onClick={handleLogin}>
                  Sign in
                </button>
              </li>
            ) : (
              <li className="nav-item m-1">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};



