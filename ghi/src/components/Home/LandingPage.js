// LandingPage.css
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { UserContext } from "../../context.js";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../../CSS/LandingPage.css";

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

  const handleScrollToTop = () => {
    const topElement = document.getElementById("top");
    topElement.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="video-container">
        <video src="/videoBG.mp4" autoPlay loop muted />

        <div className="text-container px-4 py-5 my-5">
          <div className="content">
            <h1 className="site-title">GuideMe</h1>
            <div className="col-lg-7 mx-auto">
              <p className="font site-subtitle">Plan your next adventure!</p>
              <UserContext.Provider value={{ user, setUser }}>
                {isUserLoggedIn ? (
                  " "
                ) : (
                  <Link to="/register" className="landing-page-button-div font">
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
          <div className="arrow-div">
            <div className="arrow-container" onClick={handleScrollToTop}>
              <div className="arrow down">
                <a href="#top"></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="top"></div>
      <div className="landing-card-container">
        <main class="landing-page-cards">
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
