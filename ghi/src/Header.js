import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./Header.css";

function Header({ onLogout, isUserLoggedIn }) {
  const location = useLocation();
  const [refreshNav, setRefreshNav] = useState(false);

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
      <Navbar className="HeaderNavbar font">
        <Nav className="mr-home">
          <Link to="/home" onClick={handleHomeLinkClick} className="logo-link">
            <img src="/logoImage1.png" alt="Logo" className="logo" />
          </Link>
        </Nav>
        <div>
          {isUserLoggedIn && location.pathname === "/home" && (
            <Button as={Link} to="/trips" className="my-trips-button font">
              My Trips
            </Button>
          )}
          {isUserLoggedIn ? (
            <Button className="accounts-button font" onClick={onLogout}>
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
        <div className="Nav-container">
          <Nav />
        </div>
      )}
    </>
  );
}

export default Header;
