import React, { useState } from "react";
import { UserContext } from "../context.js";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import videoBG from "./Assets/videoBG.mp4";
import "./LandingPage.css";

function LandingPage() {
  const [isUserLoggedIn, setUserLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(localStorage.getItem("access_token"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserLoggedIn(false);
  };

  const handleLogin = () => {
    setUserLoggedIn(true);
  };

  return (
    <>
      <div className="mainBG">
        <video src={videoBG} autoPlay loop muted />
      </div>
      <div className="text-container px-4 py-5 my-5 text-center">
        <div className="content">
          <h1 className="title">GuideMe</h1>
          <div className="col-lg-7 mx-auto">
            <p className="lead mb-4 font">Plan your next adventure!</p>
            <UserContext.Provider value={{ user, setUser }}>
              {isUserLoggedIn ? (
                " "
              ) : (
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="lg"
                    className="landing-page-button font"
                  >
                    Join Now
                  </Button>
                </Link>
              )}
            </UserContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
