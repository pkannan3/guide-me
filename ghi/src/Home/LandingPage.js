import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function LandingPage() {
  return (
    <div className="px-4 py-5 my-5 text-center">
      <h1 className="display-5 fw-bold">GuideMe</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          Plan your next adventure!
        </p>
        <Link to="/register">
          <Button variant="primary" size="lg">
            Join Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
