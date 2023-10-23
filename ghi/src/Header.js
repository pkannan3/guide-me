import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom
import Button from 'react-bootstrap/Button';


function Header() {
  const navigate = useNavigate(); // Initialize the history object

  // Check if the user is logged in (you may need to adjust this logic based on your authentication method)
  const isLoggedIn = !!localStorage.getItem("access_token");

  // Function to handle logout and redirect
  const handleLogout = () => {
    // Perform the logout action (e.g., clearing user info from localStorage).
    localStorage.removeItem("access_token");

    // Redirect to the login page after logout
    navigate("/login");
  };

  return (
    <>
      <Navbar>
        <Nav className="mr-auto">
          <Button as={Link} to="/home/">
            Home
          </Button>
          {/* Add more navigation links as needed */}
        </Nav>
        {isLoggedIn ? (
          <Nav>
              {/* Add user-related dropdown items as needed */}
              <Button onClick={handleLogout} type="button" className="btn btn-danger rounded-0">Logout</Button>
          </Nav>
        ) : (
          <Nav>
            <Link to="/login">
              <Button variant="primary" size="lg">
                Login
              </Button>
            </Link>
          </Nav>

        )}
      </Navbar>
    </>
  );
}

export default Header;
