import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./Header.css"; // Import the CSS file

function Header({ onLogout, isUserLoggedIn }) {
  const location = useLocation();

  const handleHomeLinkClick = () => {
    if (location.pathname === "/home") {
      window.location.reload();
    }
  };

  return (
    <>
      <Navbar className="HeaderNavbar font">
        <Nav className="mr-home">
          <Button
            as={Link}
            to="/home"
            onClick={handleHomeLinkClick}
            className="home"
          >
            Home
          </Button>
        </Nav>
        <div className="header-buttons">
          {isUserLoggedIn && location.pathname === "/home" && (
            <Button as={Link} to="/trips" className="button">
              My Trips
            </Button>
          )}
          {isUserLoggedIn ? (
            <Link onClick={onLogout} type="link" className="button">
              Logout
            </Link>
          ) : (
            <Button as={Link} to="/login" className="button">
              Login
            </Button>
          )}
        </div>
      </Navbar>
    </>
  );
}

export default Header;
