import React, { useState } from "react";
import ReactDOM from "react-dom";
import { UserContext } from "../context.js";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import videoBG from "./Assets/videoBG.mp4";
import "./LandingPage.css";

const DeveloperCard = ({ image, name, blurb, linkedin, portfolio, resume }) => {
  return (
    <div className="developer-card border mr-4">
      <img
        className="developer-image"
        src={image} // Use the image prop here
        alt={`Image of ${name}`}
      />
      <div className="developer-details">
        <h3>{name}</h3>
        <p>{blurb}</p>
        <div className="links-container">
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={portfolio} target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
          <a href={resume} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </div>
      </div>
    </div>
  );
};

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
      {/* <div className="container text-center mt-5"> */}
      <div>
        <div className="developer-container">
          <DeveloperCard
            image="/priyanka.jpeg"
            name="Developer 1"
            blurb="As a recent bootcamp graduate and certified software engineer, I bring expertise in Python, JavaScript, React, Django, and SQL. Committed to continuous learning, I am currently pursuing additional certification in Java to expand my skill set and contribute effectively to diverse software development projects."
            linkedin="https://www.linkedin.com/"
            portfolio="https://www.linkedin.com/"
            resume="/path/to/resume1.pdf"
          />
          <DeveloperCard
            image="/adp.jpeg"
            name="Developer 2"
            blurb="REQUIRED"
            linkedin="https://www.linkedin.com/"
            portfolio="https://www.linkedin.com/"
            resume="/path/to/resume2.pdf"
          />
          <DeveloperCard
            name="Developers 3 & 4"
            blurb="Assisted in building v1.0"
            linkedin="https://www.linkedin.com/"
            portfolio="https://www.linkedin.com/"
            resume="/path/to/resume2.pdf"
          />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
