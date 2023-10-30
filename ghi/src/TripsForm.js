import React, { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { UserContext } from "./context";
import { useNavigate } from "react-router-dom";
import "./Trips.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoibml4c3VhIiwiYSI6ImNsbndqcDY5djA0Zmgya3FoMngzcWdyMTUifQ.Rjyym2-cpc7eoDkt2MXUqg";

function TripForm(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    trip_name: "",
    start_date: "",
    end_date: "",
  });

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    const url = `http://localhost:8000/trips`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setTrips(data.trips);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `http://localhost:8000/trips/create`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(formData),
      headers: {
        Authorization: "Bearer " + user,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, fetchConfig);

    if (response.ok) {
      setFormData({
        trip_name: "",
        start_date: "",
        end_date: "",
      });
      event.target.reset();
      navigate("/trips");
    }
  };

  const handleCancel = () => {
    navigate("/trips");
  };

  const handleFormChange = (e) => {
    const value = e.target.value;
    const inputName = e.target.name;

    setFormData({
      ...formData,
      [inputName]: value,
    });
  };
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div className="row font create-trips-container">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1 className="create-trips-title font">Create a Trip</h1>
          <div ref={mapContainer} className="map-container" />
          <form onSubmit={handleSubmit} id="createTrip">
            <label htmlFor="trip" className="create-trips-labels">
              Trip
            </label>
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder="Trip Name"
                required
                type="text"
                id="trip_name"
                name="trip_name"
                className="form-control font input"
              />
            </div>
            <label htmlFor="start_date" className="create-trips-labels">
              Start Date
            </label>
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder="Start Date"
                required
                type="date"
                id="start_date"
                name="start_date"
                className="form-control font input"
              />
            </div>
            <label htmlFor="end_date" className="create-trips-labels">
              End Date
            </label>
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder="End Date"
                required
                type="date"
                id="end_date"
                name="end_date"
                className="form-control font input"
              />
            </div>
            <button className="btn btn-primary create-trip-button">
              Start Your Adventure
            </button>
            <button
              className="btn btn-primary cancel-trip-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TripForm;
