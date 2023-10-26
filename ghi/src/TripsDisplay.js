import React, { useContext, useEffect, useState } from "react";
import BudgetForm from "./Budget";
import ItineraryList from "./Itinerary/itinerary";
import { UserContext } from "./context";

function TripsList(props) {
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [formData, setFormData] = useState({
    trip_name: "",
    start_date: "",
    end_date: "",
  });
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

  return (
    <>
      <div>
        <button
          onClick={() => {
            setTripId(null);
            SetDisplay("trips");
          }}
        >
          Trips
        </button>
        <button
          onClick={() => SetDisplay("budget")}
          disabled={tripId ? false : true}
          className={display == "budget" && "active-display"}
        >
          Budget
        </button>
        <button
          onClick={() => SetDisplay("itinerary")}
          disabled={tripId ? false : true}
          className={display == "itinerary" && "active-display"}
        >
          Itinerary
        </button>
      </div>
      {display === "trips" && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {trips?.map((trip, rowIndex) => {
              return (
                <tr key={trip.trip_id}>
                  <td>
                    {editMode === rowIndex ? (
                      <input
                        type="text"
                        value={editedValues[rowIndex].trip_name}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            [rowIndex]: {
                              ...editedValues[rowIndex],
                              trip_name: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <button onClick={() => setTripId(trip.trip_id)}>
                        {editMode === rowIndex
                          ? editedValues[rowIndex].trip_name
                          : trip.trip_name}
                      </button>
                    )}
                  </td>
                  <td>
                    {editMode === rowIndex ? (
                      <input
                        type="date"
                        value={editedValues[rowIndex].start_date}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            [rowIndex]: {
                              ...editedValues[rowIndex],
                              start_date: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      trip.start_date
                    )}
                  </td>
                  <td>
                    {editMode === rowIndex ? (
                      <input
                        type="date"
                        value={editedValues[rowIndex].end_date}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            [rowIndex]: {
                              ...editedValues[rowIndex],
                              end_date: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      trip.end_date
                    )}
                  </td>
                  <td>
                    {editMode === rowIndex ? (
                      <button onClick={() => handleSaveCell(rowIndex)}>
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEditCell(rowIndex)}>
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(trip.trip_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {tripId && display === "budget" && <BudgetForm tripId={tripId} />}
      {tripId && display === "itinerary" && <ItineraryList tripId={tripId} />}
    </>
  );
}

export default TripsList;
