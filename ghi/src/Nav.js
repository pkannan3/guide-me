import { NavLink } from "react-router-dom";
import "./Nav.css";

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/trips/create" id="createTrip">
                Create a Trip
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/trips/" id="Trip">
                View Trips
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/itinerary/" id="Itinerary">
                Itinerary
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/expense" id="budget">
                Budget
              </NavLink>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
