import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TripsList(props) {
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
      setTrips(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trips]);

  const handleDelete = (trip_id) => {
    fetch(`http://localhost:8000/trips/${trip_id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setTrips((prevResources) =>
            prevResources.filter((resource) => resource.id !== trip_id)
          );
        }
      })
      .catch((error) => console.error("Error deleting resource:", error));
  };
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        {trips?.map((trip) => {
          return (
            <tr key={trip.trip_id}>
              <td>{trip.trip_name}</td>
              <td>{trip.start_date}</td>
              <td>{trip.end_date}</td>
              <td>
                <button onClick={() => handleDelete(trip.trip_id)}>
                  Delete
                </button>
                <Link to={`http://localhost:3000/trips/${trip.trip_id}/edit/`}>
                  <button>Update</button>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TripsList;
