import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";
import SignupForm from "./Accounts/signup.js";
import LoginForm from "./Accounts/login.js";
import Header from "./Header.js";
import LandingPage from "./Home/LandingPage.js";
import ItineraryList from "./Itinerary/itinerary.js";
import Nav from "./Nav";
import TripsDisplay from "./TripsDisplay";
import TripsForm from "./TripsForm";
import UpdateTripForm from "./TripsUpdate";
import BudgetForm from "./Budget";
import NotFound from "./404/PageDoesNotExist";
import { UserContext } from "./context.js";

function App() {
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
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Header onLogout={handleLogout} isUserLoggedIn={isUserLoggedIn} />
        <div className="Navbar-Body-layout">
          {isUserLoggedIn && !window.location.pathname.startsWith("/home") && (
            <div className="Navbar-left-container">
              <Nav />
            </div>
          )}
          <div className="Body-right-container">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route
                path="/register"
                element={<SignupForm onRegister={handleLogin} />}
              />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/trips"
                element={
                  isUserLoggedIn ? (
                    <Nav /> && <TripsDisplay />
                  ) : (
                    <Navigate to="/login" rm />
                  )
                }
              />
              <Route
                path="/trips/create"
                element={
                  isUserLoggedIn ? <TripsForm /> : <Navigate to="/login" />
                }
              />
              <Route
                path={`/trips/:trip_id/edit`}
                element={
                  isUserLoggedIn ? <UpdateTripForm /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/itinerary"
                element={
                  isUserLoggedIn ? <ItineraryList /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/expense"
                element={
                  isUserLoggedIn ? <BudgetForm /> : <Navigate to="/login" />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
