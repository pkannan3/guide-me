import React, { useState } from "react";
import ReactDOM from "react-dom";
import { UserContext } from "../context.js";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
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
      <div className="video-container">
        <video src="/videoBG.mp4" autoPlay loop muted />

        <div className="text-container px-4 py-5 my-5">
          <div className="content">
            <h1 className="site-title">GuideMe</h1>
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
      </div>

      <div className="card-container">
        <main class="card">
          <article>
            <img src="/pnk.jpeg" alt={`Image of Dev1`} />
            <div class="text">
              <h2>Dev1</h2>
              <h4>Full-Stack Developer</h4>
              <p>Developer on v1.0 and 2.0</p>
              <button className="developer-card">
                <a
                  href="https://www.linkedin.com/.."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </button>
              <button className="developer-card">
                <a
                  href="https://www.linkedin.com/.."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>
              </button>
              <button className="developer-card">
                <a
                  href="/pnk_Resume.pdf"
                  target="_parent"
                  rel="noopener noreferrer"
                >
                  Resume
                </a>
              </button>
            </div>
            <p className="arrow down"> \/ </p>
          </article>

          <article>
            <img src="/adp.jpeg" alt={`Image of Dev2`} />
            <div class="text">
              <h2>Dev2</h2>
              <h4>Full-Stack Developer</h4>
              <p>Developer on v1.0 and 2.0</p>
              <button className="developer-card">
                <a
                  href="https://www.linkedin.com/.."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </button>
              <button className="developer-card">
                <a
                  href="https://www.linkedin.com/.."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>
              </button>
              <button className="developer-card">
                <a
                  href="/pnk_Resume.pdf"
                  target="_parent"
                  rel="noopener noreferrer"
                >
                  Resume
                </a>
              </button>
            </div>
          </article>

          <article>
            <img src="/stock_profile_pic.jpg" alt={`Image of Dev3 & Dev4`} />
            <div class="text">
              <h2>Austin & Matthew</h2>
              <h4>Full-Stack Developers</h4>
              <p>Developers on v1.0</p>
              <button className="developer-card">
                <a
                  href="https://www.linkedin.com/.."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </button>
              <button className="developer-card">
                <a
                  href="https://www.linkedin.com/.."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </button>
              <button className="developer-card">
                <a
                  href="https://www.gitlab.com/.."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Version 1.0
                </a>
              </button>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}

export default LandingPage;
