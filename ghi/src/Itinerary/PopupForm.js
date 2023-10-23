import React, { useState } from 'react';

function PopupForm({ onSubmit, onClose }) {
  const [locationName, setLocationName] = useState('');
  const [startTime, setStartTime] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      location_name: locationName,
      start_time: startTime,
    };

    onSubmit(data);

    setLocationName('');
    setStartTime('');
  };

  return (
    <div className="popup-form">
      <h2>Create Itinerary</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
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
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Start Time"
            required
            type="text"
            id="startTime"
            name="startTime"
            className="form-control"
          />
          <label htmlFor="startTime">Start Time</label>
        </div>
        <button className="btn btn-primary">Add event</button>
      </form>
      <button onClick={onClose} className="btn btn-secondary">Close</button>
    </div>
  );
}

export default PopupForm;
