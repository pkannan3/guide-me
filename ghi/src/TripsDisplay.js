import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./context";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import BudgetForm from "./Budget";
import ItineraryList from "./Itinerary/itinerary";
import "./Trips.css";
import "./TripsForm";

function TripsList(props) {
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [display, SetDisplay] = useState("trips");
  const { user, setUser } = useContext(UserContext);

  const fetchData = async () => {
    const url = "http://localhost:8000/trips";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setTrips(data);
    }
  };

  useEffect(() => {
    if (display == "trips") {
      fetchData();
    }
  }, [display, user]);

  const handleEditCell = (rowIndex) => {
    setEditMode(rowIndex);
    setEditedValues({
      ...editedValues,
      [rowIndex]: {
        trip_name: trips[rowIndex].trip_name,
        start_date: trips[rowIndex].start_date,
        end_date: trips[rowIndex].end_date,
      },
    });
  };

  const handleSaveCell = async (rowIndex) => {
    const updatedData = {
      ...trips[rowIndex],
      ...editedValues[rowIndex],
    };
    const url = `http://localhost:8000/trips/${updatedData.trip_id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedTrips = [...trips];
      updatedTrips[rowIndex] = updatedData;
      setTrips(updatedTrips);
      setEditMode(null);
    } else {
      console.error("Failed to update trip:", response);
    }
  };

  const handleDelete = (trip_id) => {
    fetch(`http://localhost:8000/trips/${trip_id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setTrips((prevTrips) =>
            prevTrips.filter((t) => t.trip_id !== trip_id)
          );
        }
      })
      .catch((error) => console.error("Error deleting trip:", error));
  };

  const handleInputChange = (rowIndex, field, value) => {
    setEditedValues({
      ...editedValues,
      [rowIndex]: {
        ...editedValues[rowIndex],
        [field]: value,
      },
    });
  };

  const handleSelectTrip = (tripId) => {
    setTripId(tripId);
  };

  const handleClearSelection = () => {
    setTripId(null);
  };

  return (
    <>
      <div className="adp-grid-container">
        <div className="vertical-buttons-container">
          <button
            onClick={() => {
              setTripId(null);
              SetDisplay("trips");
            }}
            className={`vertical-button ${
              display === "trips" ? "active-page" : ""
            }`}
          >
            <span className="vertical-text">Trips</span>
          </button>
          <button
            onClick={() => SetDisplay("map")}
            disabled={tripId ? false : true}
            className={`vertical-button ${
              display === "map" ? "active-page" : ""
            }`}
          >
            <span className="vertical-text">Map</span>
          </button>
          <button
            onClick={() => SetDisplay("budget")}
            disabled={tripId ? false : true}
            className={`vertical-button ${
              display === "budget" ? "active-page" : ""
            }`}
          >
            <span className="vertical-text">Budget</span>
          </button>
          <button
            onClick={() => SetDisplay("itinerary")}
            disabled={tripId ? false : true}
            className={`vertical-button ${
              display === "itinerary" ? "active-page" : ""
            }`}
          >
            <span className="vertical-text">Itinerary</span>
          </button>
        </div>

        <div>
          <h1 className="budget-h1"> Your Trips </h1>
          {display === "trips" && (
            <div
              className="card-container"
              // style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            >
              {trips.map((trip, rowIndex) => (
                <div
                  key={trip.trip_id}
                  className="card-wrapper"
                  onClick={() => {
                    setTripId(trip.trip_id);
                    SetDisplay("trips");
                  }}
                >
                  <Card className="custom-card">
                    <Card.Body>
                      <div class="card">
                        <img
                          src="/stock_profile_pic.jpg"
                          alt={`Image of Dev3 & Dev4`}
                        />
                      </div>
                      <Card.Title className="custom-card-title">
                        <div>
                          <input
                            className="custom-card-title"
                            type="text"
                            value={
                              editMode === rowIndex
                                ? editedValues[rowIndex].trip_name
                                : trip.trip_name
                            }
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                "trip_name",
                                e.target.value
                              )
                            }
                          />
                          {editMode !== rowIndex ? (
                            <>
                              <input
                                className="custom-card-title"
                                type="date"
                                value={trip.start_date}
                                readOnly
                              />
                              <input
                                className="custom-card-title"
                                type="date"
                                value={trip.end_date}
                                readOnly
                              />
                            </>
                          ) : (
                            <>
                              <input
                                className="custom-card-title"
                                type="date"
                                value={editedValues[rowIndex].start_date}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowIndex,
                                    "start_date",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                className="custom-card-title"
                                type="date"
                                value={editedValues[rowIndex].end_date}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowIndex,
                                    "end_date",
                                    e.target.value
                                  )
                                }
                              />
                            </>
                          )}
                          <div className="button-container">
                            {editMode !== rowIndex ? (
                              <>
                                <button
                                  className="edit-button"
                                  onClick={() => handleEditCell(rowIndex)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="delete-button"
                                  onClick={() => handleDelete(trip.trip_id)}
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="save-button"
                                  onClick={() => handleSaveCell(rowIndex)}
                                >
                                  Save
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              ))}
              <Link to="/trips/create">
                <Card className="custom-card add-trip-card-container">
                  <Card.Body>
                    <Card.Title className="custom-card-title">+</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          )}
        </div>

        {tripId && display === "budget" && (
          <BudgetForm
            tripId={tripId}
            tripName={trips.find((trip) => trip.trip_id === tripId)?.trip_name}
          />
        )}
        {tripId && display === "itinerary" && (
          <ItineraryList
            tripId={tripId}
            tripName={trips.find((trip) => trip.trip_id === tripId)?.trip_name}
          />
        )}
      </div>
    </>
  );
}

export default TripsList;
