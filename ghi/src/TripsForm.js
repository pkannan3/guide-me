import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1Ijoibml4c3VhIiwiYSI6ImNsbndqcDY5djA0Zmgya3FoMngzcWdyMTUifQ.Rjyym2-cpc7eoDkt2MXUqg";

function TripForm() {
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

  const fetchData = async () => {
    const url = `http://localhost:8000/trips/`;
    const response = await fetch(url);
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
    }
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
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <div ref={mapContainer} className="map-container" />
          <h1>Create a Trip</h1>
          <form onSubmit={handleSubmit} id="createTrip">
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder="Trip Name"
                required
                type="text"
                id="trip_name"
                name="trip_name"
                className="form-control"
              />
              <label htmlFor="trip">Trip</label>
            </div>
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder="Start Date"
                required
                type="date"
                id="start_date"
                name="start_date"
                className="form-control"
              />
              <label htmlFor="start_date">Start Date</label>
            </div>
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder="End Date"
                required
                type="date"
                id="end_date"
                name="end_date"
                className="form-control"
              />
              <label htmlFor="end_date">End Date</label>
            </div>
            <button className="btn btn-primary">Start Your Adventure</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TripForm;
