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
import SecondLayout from "./SecondLayout.js";
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
    <BrowserRouter>
      <Header onLogout={handleLogout} isUserLoggedIn={isUserLoggedIn} />
      <div className="App-layout">
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/home"
            element={<LandingPage />}
          />
          <Route
            path="/register"
            element={<SignupForm onRegister={handleLogin} />}
          />
          <Route
            path="/login"
            element={<LoginForm />}
          />
          <Route
            element={isUserLoggedIn ? <SecondLayout /> : <Navigate to="/login" />}
          >
            <Route
              path="/trips"
              element={<TripsDisplay />}
            />
            <Route
              path="/trips/create"
              element={<TripsForm />}
            />
            <Route
              path={`/trips/:trip_id/edit`}
              element={<UpdateTripForm />}
            />
            <Route
              path="/itinerary"
              element={<ItineraryList />}
            />
            <Route
              path="/expense"
              element={<BudgetForm />}
            />
          </Route>
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
