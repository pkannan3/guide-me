import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import Card from "react-bootstrap/Card";
import BudgetForm from "../../components/Budget/Budget.js";
import ItineraryList from "../../components/Itinerary/itinerary.js";
import "../../CSS/Trips.css";
import "../../CSS/Base.css";
import edit from "./edit.png";
import save from "./save.png";
import del from "./delete.png";

function TripsList(props) {
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [display, SetDisplay] = useState("trips");
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
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
          {/* <h1 className="body-container-h1"> Your Trips </h1> */}
          {display === "trips" && (
            <div
              className="trips-card-container"
              // style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            >
              {trips.map((trip, rowIndex) => (
                <div
                  key={trip.trip_id}
                  className={`card-wrapper ${
                    selectedTripIndex === rowIndex ? "selected-trip" : ""
                  }`}
                  onClick={() => {
                    setTripId(trip.trip_id);
                    SetDisplay("trips");
                    setSelectedTripIndex(rowIndex);
                  }}
                >
                  <div class="trips-card">
                    <Card>
                      <Card.Body>
                        <div>
                          <img
                            src="/stock_profile_pic.jpg"
                            alt={`Image of Location`}
                          />
                        </div>
                        <Card.Title>
                          <div>
                            <ul>
                              <li>
                                <input
                                  className="trips-card-details trips-cards-input"
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
                              </li>
                              {editMode !== rowIndex ? (
                                <>
                                  <li>
                                    <input
                                      className="trips-card-details trips-cards-input"
                                      type="date"
                                      value={trip.start_date}
                                      readOnly
                                    />
                                  </li>
                                  <li>
                                    <input
                                      className="trips-card-details trips-cards-input"
                                      type="date"
                                      value={trip.end_date}
                                      readOnly
                                    />
                                  </li>
                                </>
                              ) : (
                                <>
                                  <input
                                    className="trips-card-details trips-cards-input"
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
                                    className="trips-card-details trips-cards-input"
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
                            </ul>
                            <div className="button-container">
                              {/* <button className="trips-card-select-button">
                                View
                              </button> */}
                              {editMode !== rowIndex ? (
                                <>
                                  <button
                                    className="trips-card-button"
                                    onClick={() => handleEditCell(rowIndex)}
                                  >
                                    <img src={edit} alt="✎" />
                                  </button>
                                  <button
                                    className="trips-card-button"
                                    onClick={() => handleDelete(trip.trip_id)}
                                  >
                                    <img src={del} alt="save" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="trips-card-button"
                                    onClick={() => handleSaveCell(rowIndex)}
                                  >
                                    <img src={save} alt="save" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              ))}
              {/* <Link to="/trips/create">
                <Card className="add-trip-card">
                  <Card.Body>
                    <Card.Title className="add-trip-details">+</Card.Title>
                  </Card.Body>
                </Card>
              </Link> */}

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
                      {" "}
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Atque, a nostrum. Dolorem, repellat quidem ut, minima sint
                      vel eveniet quibusdam voluptates delectus doloremque,
                      explicabo tempore dicta adipisci fugit amet dignissimos?
                      <br />
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Consequatur sit commodi beatae optio voluptatum sed eius
                      cumque, delectus saepe repudiandae explicabo nemo nam
                      libero ad, doloribus, voluptas rem alias. Vitae?
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
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Beatae magni omnis delectus nemo, maxime
                          molestiae dolorem numquam mollitia, voluptate ea,
                          accusamus excepturi deleniti ratione sapiente!
                          Laudantium, aperiam doloribus. Odit, aut.
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
