import React, { useRef, useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { useNavigate } from "react-router-dom";
import "../../CSS/Trips.css";

function TripsPopUp(props) {
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

  return (
    <>
      <div className="adp-grid-container">
        <Popup
          trigger={
            <Card className="add-trip-card">
              <Card.Body>
                <Card.Title className="add-trip-details">+</Card.Title>
              </Card.Body>
            </Card>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header"> Create Trip </div>
              <div className="content">
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
              <div className="actions">
                <Popup
                  trigger={
                    <button className="trips-card-button">
                      Add Submit Functionality
                    </button>
                  }
                  position="top center"
                  nested
                >
                  <span>
                    When successfully submitted replace form modal with success
                    message text modal.
                  </span>
                </Popup>
                <button
                  className="trips-card-button"
                  onClick={() => {
                    console.log("modal closed ");
                    close();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </>
  );
}

export default TripsPopUp;
