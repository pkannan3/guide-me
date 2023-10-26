import React, { useEffect, useState } from "react";

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
          <h2>Create Itinerary</h2>
          <form onSubmit={handleSubmit} id="add-itinerary-form">
            <div className="form-floating mb-3">
              <input
                value={locationName}
                onChange={handleLocationNameChange}
                placeholder="Location Name"
                required
                type="text"
                id="locationName"
                name="locationName"
                className="form-control"
              />
              <label htmlFor="name">Location Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                value={visitDate}
                onChange={handleVisitDate}
                placeholder="Date"
                required
                type="date"
                id="visitDate"
                name="visitDate"
                className="form-control"
              />
              <label htmlFor="visitDate">Date</label>
            </div>
            <div className="form-floating mb-3">
              <input
                value={startTime}
                onChange={handleStarttimeChange}
                placeholder="Start Time"
                required
                type="time"
                id="startTime"
                name="startTime"
                className="form-control"
              />
              <label htmlFor="startTime">Start Time</label>
            </div>
            <button className="btn btn-primary">Add event</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ItineraryList({ tripId }) {
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

  const sortedItineraries = itineraries
    .sort((a, b) => {
      const dateComparison = a.visit_date.localeCompare(b.visit_date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return a.start_time.localeCompare(b.start_time);
    });

  function customTimeCovert(time) {
    const [hours, minutes, seconds] = time.split(":");

    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(parseInt(seconds));

    const timeFormatted = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return timeFormatted;
  }

  useEffect(() => {
    loadItineraries();
  }, []);

  return (
    <>
      <div className="font">
        <h1>Itinerary</h1>
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
                        <li style={{ marginRight: "5px" }}>✩</li>
                      </ul>
                    </td>
                    <td className="col-4">
                      <ul style={{ listStyleType: "none" }}>
                        .
                        <li>
                          {editMode === rowIndex ? (
                            <input
                              type="text"
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
                        <li>
                          {editMode === rowIndex ? (
                            <input
                              type="time"
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
                          )}
                        </li>
                      </ul>
                    </td>
                    <td className="col-1 text-right">
                      <ul style={{ listStyleType: "none" }}>
                        .
                        <li>
                          {editMode === rowIndex ? (
                            <button onClick={() => handleSaveCell(rowIndex)}>
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditCell(rowIndex)}
                              className="font button-align-right"
                            >
                              Edit
                            </button>
                          )}
                        </li>
                      </ul>
                    </td>
                    <td className="col-1 text-right">
                      <ul style={{ listStyleType: "none" }}>
                        .
                        <li>
                          <button
                            onClick={() => handleDelete(itinerary.location_id)}
                            className="btn btn-primary font button-align-right"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
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
          <ItineraryForm tripId={tripId}
          onAddItinerary={handleAddItinerary}

          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary font"
          >
            Add Itinerary
          </button>
        )}
      </div>
    </>
  );
}

export default ItineraryList;
