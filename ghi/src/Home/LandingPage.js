import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import videoBG from "./Assets/videoBG.mp4";
import "./LandingPage.css";

function LandingPage() {
  return (
    <>
      <div className="mainBG">
        <video src={videoBG} autoPlay loop muted />
      </div>
      <div className="text-container px-4 py-5 my-5 text-center">
        <div className="content">
          <h1 className="display-5 fw-bold">GuideMe</h1>
          <div className="col-lg-7 mx-auto">
            <p className="lead mb-4">Plan your next adventure!</p>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
