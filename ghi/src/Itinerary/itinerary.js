import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "./Itinerary.css";

function ItineraryForm({ tripId, onAddItinerary }) {
  const [locationName, setLocationName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {};
    data.location_name = locationName;
    data.visit_date = visitDate;
    data.start_time = `${startTime}:00`;
    const itineraryUrl = `http://localhost:8000/trips/${tripId}/itinerary/create`;
    const fetchOptions = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(itineraryUrl, fetchOptions);
    if (response.ok) {
      const newItinerary = await response.json();
      setLocationName("");
      setVisitDate("");
      setStartTime("");
      onAddItinerary(newItinerary);
    }
  };

  const handleLocationNameChange = (event) => {
    const value = event.target.value;
    setLocationName(value);
  };

  const handleVisitDate = (event) => {
    const value = event.target.value;
    setVisitDate(value);
  };

  const handleStarttimeChange = (event) => {
    const value = event.target.value;
    setStartTime(value);
  };

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h2 className="location-h2">Create Itinerary</h2>
          <form onSubmit={handleSubmit} id="add-itinerary-form">
            <label htmlFor="name font location-labels">Location Name</label>
            <div className="form-floating mb-3">
              <input
                value={locationName}
                onChange={handleLocationNameChange}
                placeholder="Location Name"
                required
                type="text"
                id="locationName"
                name="locationName"
                className="form-control font"
              />
            </div>
            <label htmlFor="visitDate location-labels font">Date</label>
            <div className="form-floating mb-3">
              <input
                value={visitDate}
                onChange={handleVisitDate}
                placeholder="Date"
                required
                type="date"
                id="visitDate"
                name="visitDate"
                className="form-control font"
              />
            </div>
            <label htmlFor="startTime font location-labels">Start Time</label>
            <div className="form-floating mb-3">
              <input
                value={startTime}
                onChange={handleStarttimeChange}
                placeholder="Start Time"
                required
                type="time"
                id="startTime"
                name="startTime"
                className="form-control font"
              />
            </div>
            <button className="btn btn-primary save-button">Add event</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ItineraryList(props) {
  const { tripId, tripName } = props;
  const [showForm, setShowForm] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  async function loadItineraries() {
    try {
      const response = await fetch(
        `http://localhost:8000/trips/${tripId}/itinerary/`
      );
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      } else {
        console.error(response);
      }
    } catch (e) {
      console.error("No itinerary found", e);
    }
  }
  useEffect(() => {
    loadItineraries();
  }, [tripId]);

  const uniqueDates = Array.from(
    new Set(itineraries.map((itinerary) => itinerary.visit_date))
  );

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleAddItinerary = (itineraryData) => {
    setItineraries([...itineraries, itineraryData]);
    setShowForm(false);
  };

  const handleEditCell = (rowIndex) => {
    setEditMode(rowIndex);
    setEditedValues({
      ...editedValues,
      [rowIndex]: {
        location_name: itineraries[rowIndex].location_name,
        start_time: itineraries[rowIndex].start_time,
      },
    });
  };

  const handleSaveCell = async (rowIndex) => {
    const updatedData = { ...itineraries[rowIndex], ...editedValues[rowIndex] };
    const url = `http://localhost:8000/itinerary/${updatedData.location_id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedItineraries = [...itineraries];
      updatedItineraries[rowIndex] = updatedData;
      setItineraries(updatedItineraries);
      setEditMode(null);
      // window.location.reload();
    } else {
      console.error("Failed to update itinerary:", response);
    }
  };

  const handleDelete = async (location_id) => {
    const url = `http://localhost:8000/itinerary/${location_id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const updatedItineraries = itineraries.filter(
        (itinerary) => itinerary.location_id !== location_id
      );
      setItineraries(updatedItineraries);

      loadItineraries();
    } else {
      return { message: "Could not delete location." };
    }
  };

  function customTimeCovert(time) {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    // date.setSeconds(parseInt(seconds));

    const timeFormatted = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return timeFormatted;
  }

  const sortedItineraries = itineraries.sort((a, b) => {
    const dateComparison = a.visit_date.localeCompare(b.visit_date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.start_time.localeCompare(b.start_time);
  });

  useEffect(() => {
    loadItineraries();
  }, []);

  return (
    <>
      <div className="font">
        <h1 className="location-h1">Itinerary for Trip: {tripName}</h1>
        <div>
          <label htmlFor="itineraryDate"> Select Date: </label>
          <select
            id="itineraryDate"
            value={selectedDate}
            onChange={handleDateChange}
          >
            <option value=""> All Dates </option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="budget-th">Location</th>
              <th className="budget-th">Time</th>
            </tr>
          </thead>
          <tbody>
            {itineraries.length > 0 ? (
              itineraries
                .filter((itinerary) =>
                  selectedDate ? itinerary.visit_date === selectedDate : true
                )
                .map((itinerary, rowIndex) => (
                  <tr key={itinerary.location_id}>
                    <td className="col-1">
                      <ul
                        style={{
                          listStyleType: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <li style={{ marginRight: "5px" }}>
                          {editMode === rowIndex ? (
                            <input
                              type="text"
                              className="font"
                              value={editedValues[rowIndex]["location_name"]}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  [rowIndex]: {
                                    ...editedValues[rowIndex],
                                    location_name: e.target.value,
                                  },
                                })
                              }
                            />
                          ) : (
                            itinerary.location_name
                          )}
                        </li>
                      </ul>
                    </td>
                    <td className="col-4">
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          {editMode === rowIndex ? (
                            <input
                              type="time"
                              className="font"
                              value={editedValues[rowIndex]["start_time"]}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  [rowIndex]: {
                                    ...editedValues[rowIndex],
                                    start_time: e.target.value,
                                  },
                                })
                              }
                            />
                          ) : (
                            customTimeCovert(itinerary.start_time)
                            // itinerary.start_time
                          )}
                        </li>
                      </ul>
                    </td>
                    <td className="col-1 text-right">
                      {editMode === rowIndex ? (
                        <button
                          onClick={() => handleSaveCell(rowIndex)}
                          className="save-button"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditCell(rowIndex)}
                          className="font button-align-right edit-button"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(itinerary.location_id)}
                        className="font delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4">No itineraries found</td>
              </tr>
            )}
          </tbody>
        </table>
        {showForm ? (
          <ItineraryForm tripId={tripId} onAddItinerary={handleAddItinerary} />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="add-location-card"
          >
            <Card>
              <Card.Body>
                <Card.Title className="add-location-card-title">+</Card.Title>
              </Card.Body>
            </Card>
          </button>
        )}
      </div>
    </>
  );
}

export default ItineraryList;
