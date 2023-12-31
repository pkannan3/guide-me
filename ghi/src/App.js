import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./context.js";
import SignupForm from "./Accounts/signup.js";
import LoginForm from "./Accounts/login.js";
import Header from "./Header.js";
import LandingPage from "./Home/LandingPage.js";
import ItineraryList from "./Itinerary/itinerary.js";
import TripsDisplay from "./TripsDisplay";
import TripsForm from "./TripsForm";
import BudgetForm from "./Budget";
import NotFound from "./404/PageDoesNotExist";

function App() {
  const [isUserLoggedIn, setUserLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(localStorage.getItem("access_token"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserLoggedIn(false);
    window.location.reload();
  };

  const handleLogin = () => {
    setUserLoggedIn(true);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Header onLogout={handleLogout} isUserLoggedIn={isUserLoggedIn} />
        <div className="App-layout">
          {isUserLoggedIn ? (
            <Routes>
              <Route path="/trips" element={<TripsDisplay />} />
              <Route path="/trips/create" element={<TripsForm />} />
              <Route path="/itinerary" element={<ItineraryList />} />
              <Route path="/expense" element={<BudgetForm />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/register"
                element={<SignupForm onRegister={handleLogin} />}
              />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
