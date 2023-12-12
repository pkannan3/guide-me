import React, { useState } from "react";
import ReactDOM from "react-dom";
import { UserContext } from "../context.js";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import videoBG from "./Assets/videoBG.mp4";
import "./LandingPage.css";

const DeveloperCard = ({
  image,
  name,
  blurb,
  comment,
  linkedin,
  portfolio,
  resume,
}) => {
  return (
    <div className="developer-card border mr-4">
      <img
        className="developer-Image"
        src={image} // Use the image prop here
        alt={`Image of ${name}`}
      />
      <div className="developer-details">
        <h3>{name}</h3>
        <h4>{blurb}</h4>
        <p>{comment}</p>
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

const DeveloperCard3_4 = ({
  image1,
  image2,
  name,
  blurb,
  comment,
  linkedin1,
  linkedin2,
}) => {
  return (
    <div className="developer-card border mr-4">
      <img
        className="developer-Image1-2"
        src={image1} // Use the image prop here
        alt={`Image of ${name}`}
      />
      <img
        className="developer-Image1-2"
        src={image2} // Use the image prop here
        alt={`Image of ${name}`}
      />
      <div className="developer-details">
        <h3>{name}</h3>
        <h4>{blurb}</h4>
        <p>{comment}</p>
        <div className="links-container">
          <a href={linkedin1} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={linkedin2} target="_blank" rel="noopener noreferrer">
            LinkedIn
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
            image="/pnk.jpeg"
            name="Priyanka Kannan"
            blurb="Full-Stack Engineer"
            // blurb="As a fresh bootcamp grad and certified software engineer, I've got the coding basics down—from Python and JavaScript to React, Django, and SQL. Keen on leveling up, I'm diving into Java certification, eager to add more tools to my dev belt and jump into exciting software projects. 🚀"
            comment="Developer on v1.0 and v2.0"
            linkedin="https://www.linkedin.com/"
            portfolio="https://www.linkedin.com/"
            resume="/path/to/resume1.pdf"
          />
          <DeveloperCard
            image="/adp.jpeg"
            name="Anastasia Dwarica-Pham"
            blurb="Full-Stack Engineer"
            comment="Developer on v1.0 and v2.0"
            linkedin="https://www.linkedin.com/"
            portfolio="https://www.linkedin.com/"
            resume="/path/to/resume2.pdf"
          />
          <DeveloperCard3_4
            image1="/adp.jpeg"
            image2="/pnk.jpeg"
            name="Austin Sahagun & Matthew Rauschenberg"
            blurb="Full-Stack Engineers"
            comment="Developers on v1.0"
            linkedin1="https://www.linkedin.com/"
            linkedin2="https://www.linkedin.com/"
          />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
