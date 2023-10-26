import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateTripForm(props) {
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    trip_name: "",
    start_date: trips.start_date,
    end_date: trips.end_date,
  });
  const navigate = useNavigate();
  let { trip_id } = useParams();

  const fetchData = async () => {
    const url = `http://localhost:8000/trips/${trip_id}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setTrips(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `http://localhost:8000/trips/${trip_id}`;
    const fetchConfig = {
      method: "put",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, fetchConfig);

    if (response.ok) {
      navigate("/trips");
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
  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1>Update a Trip</h1>
          <form onSubmit={handleSubmit} id="createTrip">
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder={trips.trip_name}
                required
                type="text"
                id="trip_name"
                name="trip_name"
                className="form-control"
              />
              <label htmlFor="trip">Trip name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder={trips.start_date}
                required
                type="text"
                id="start_date"
                name="start_date"
                className="form-control"
              />
              <label htmlFor="start_date">Start Date</label>
            </div>
            <div className="form-floating mb-3">
              <input
                onChange={handleFormChange}
                placeholder={trips.end_date}
                required
                type="text"
                id="end_date"
                name="end_date"
                className="form-control"
              />
              <label htmlFor="end_date">End Date</label>
            </div>
            <button className="btn btn-primary">Update Your Adventure</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateTripForm;
