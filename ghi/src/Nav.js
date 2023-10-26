import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Nav.css";

function Nav() {
  const location = useLocation();
  const isOnTripsPage = location.pathname === "/trips";
  const isOnCreateTripsPage = location.pathname === "/trips/create";
  const isOnItineraryPage = location.pathname === "/itinerary";
  const isOnBudgetPage = location.pathname === "/expense";

  return (
    <nav className="TabNavbar">
      <div className="TabsNavbar-nav">
        <li className="TabsNavbar-nav-link">
          <NavLink
            className={`nav-link ${isOnTripsPage ? "selected" : ""}`}
            to="/trips"
            id="Trips"
          >
            <span className="vertical-text">Trips</span>
          </NavLink>
        </li>
        <li className="TabsNavbar-nav-link">
          <NavLink className={`nav-link ${isOnCreateTripsPage ? "selected" : ""}`}
            to="/trips/create"
            id="CreateTrips">
            <span className="vertical-text">Create Trips</span>
          </NavLink>
        </li>
        <li className="TabsNavbar-nav-link">
          <NavLink className={`nav-link ${isOnItineraryPage ? "selected" : ""}`}
            to="/itinerary"
            id="Itinerary">
            <span className="vertical-text">Itinerary</span>
          </NavLink>
        </li>
        <li className="TabsNavbar-nav-link">
          <NavLink className={`nav-link ${isOnBudgetPage ? "selected" : ""}`}
            to="/expense"
            id="Budget">
            <span className="vertical-text">Budget</span>
          </NavLink>
        </li>
      </div>
    </nav>
  );
}

export default Nav;
