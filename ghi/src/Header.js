import React, { useState, useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./Header.css";
import "./Trips.css";
import { UserContext } from "./context";

function Header() {
  const location = useLocation();
  const [refreshNav, setRefreshNav] = useState(false);
  const {isUserLoggedIn, handleLogout} = useContext(UserContext)

  const handleHomeLinkClick = () => {
    if (location.pathname === "/home") {
      window.location.reload();
    }
  };

  const handleLoginLinkClick = () => {
    setRefreshNav(true);
  };

  return (
    <>
      <Navbar
        className={`HeaderNavbar font ${
          location.pathname === "/trips" ? "trips-page" : ""
        }`}
      >
        <Nav className="mr-home">
          <Link to="/home" onClick={handleHomeLinkClick} className="logo-link">
            <img src="/useLogoBold.png" alt="Logo" className="logo" />
          </Link>
        </Nav>
        <div>
          {isUserLoggedIn && location.pathname === "/home" && (
            <Button as={Link} to="/trips" className="my-trips-button font">
              My Trips
            </Button>
          )}
          {isUserLoggedIn ? (
            <Button className="accounts-button font" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button
              as={Link}
              to="/login"
              onClick={handleLoginLinkClick}
              className="accounts-button font"
            >
              Login
            </Button>
          )}
        </div>
      </Navbar>
      {isUserLoggedIn && location.pathname === "/home" && refreshNav && (
        <div className="nav-container">
          <Nav />
        </div>
      )}
    </>
  );
}

export default Header;
