import React from "react";
import { Outlet } from "react-router-dom";
import "./SecondLayout.css";
import Nav from "../Nav";

function SecondLayout() {
  return (
    <div className="second-layout-container">
      <div className="Nav-container">
        <Nav />
      </div>
      <div className="second-layout-content-container">
        <Outlet /> {/* This will render child routes */}
      </div>
    </div>
  );
}

export default SecondLayout;
