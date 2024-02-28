import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./context.js";
import SignupForm from "./components/Accounts/signup.js";
import LoginForm from "./components/Accounts/login.js";
import Header from "./Header.js";
import LandingPage from "./Home/LandingPage.js";
import ItineraryList from "./Itinerary/itinerary.js";
import TripsDisplay from "./TripsDisplay";
import TripsForm from "./TripsForm";
import BudgetForm from "./Budget";
import SettingsForm from "./Accounts/settings.js";
import NotFound from "./404/PageDoesNotExist";
import { UserProvider } from "./context.js";

function App() {
  const {isUserLoggedIn} = useContext(UserContext)
  // const [isUserLoggedIn, setUserLoggedIn] = useState(
  //   !!localStorage.getItem("access_token")
  // );

  // const [user, setUser] = useState(localStorage.getItem("access_token"));

  // const handleLogout = () => {
  //   localStorage.removeItem("access_token");
  //   setUserLoggedIn(false);
  //   window.location.reload();
  // };

  // const handleLogin = () => {
  //   setUserLoggedIn(true);
  // };

  return (
    // <UserProvider>
      <BrowserRouter>
        <Header />
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
              <Route path="/settings" element={<SettingsForm />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/register"
                element={<SignupForm/>}
              />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          )}
        </div>
      </BrowserRouter>
    // </UserProvider>
  );
}

export default App;
