import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Construct from "./Construct.js";
// import ErrorNotification from "./ErrorNotification";
import "./App.css";
import SignupForm from "./Accounts/signup.js";
import LoginForm from "./Accounts/login.js";
import Header from "./Header.js";
import LandingPage from "./Home/LandingPage.js";
import ItineraryList from "./Itinerary/itinerary.js";
// import ItineraryPage from './Itinerary/ItineraryPage.js';
// import LocationForm from './Itinerary/LocationForm.js';

import Nav from "./Nav";
import TripsDisplay from "./TripsDisplay";
import TripsForm from "./TripsForm";
import UpdateTripForm from "./TripsUpdate";
import BudgetForm from "./Budget";

function App() {
  return (
    <BrowserRouter>
      {/* <Nav /> */}
      <Header />
      <div className="container">
        <Routes>
          <Route path="/itinerary/" element={<ItineraryList />} />
          <Route path="/home/" element={<LandingPage />} />
          <Route path="/register/" element={<SignupForm />} />
          <Route path="/login/" element={<LoginForm />} />
          <Route path="/trips/" element={<TripsDisplay />} />
          <Route path="/trips/create/" element={<TripsForm />} />
          <Route path={`/trips/:trip_id/edit/`} element={<UpdateTripForm />} />
          <Route path="/expense/" element={<BudgetForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
