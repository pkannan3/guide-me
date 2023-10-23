import React, { useEffect, useState } from 'react';


function ItineraryForm(){
    const [locationName, setLocationName] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [startTime, setStartTime] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {};

        data.location_name = locationName;
        data.visit_date = visitDate;
        data.start_time = `${startTime}:00`;
;


        const itineraryUrl = "http://localhost:8000/itinerary/create";
        const fetchOptions = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(itineraryUrl, fetchOptions);
        if (response.ok) {
            const newItinerary = await response.json();
            setLocationName('');
            setVisitDate('')
            setStartTime('');

            window.location.reload();

        }
    };

    const handleLocationNameChange = (event) => {
        const value = event.target.value;
        setLocationName(value);
    }

        const handleVisitDate = (event) => {
        const value = event.target.value;
        setVisitDate(value);
    }

    const handleStarttimeChange = (event) => {
        const value = event.target.value;
        setStartTime(value);
    }



    return(
         <div className="row">
            <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                    <h2>Create Itinerary</h2>
                    <form onSubmit={handleSubmit} id="add-itinerary-form">
                        <div className="form-floating mb-3">
                            <input value={locationName} onChange={handleLocationNameChange} placeholder="Location Name" required type="text" id="locationName" name="locationName" className="form-control" />
                            <label htmlFor="name">Location Name</label>
                        </div>
                         <div className="form-floating mb-3">
                            <input value={visitDate} onChange={handleVisitDate} placeholder="Date" required type="date" id="visitDate" name="visitDate" className="form-control" />
                            <label htmlFor="visitDate">Date</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input value={startTime} onChange={handleStarttimeChange} placeholder="Start Time" required type="time" id="startTime" name="startTime" className="form-control" />
                            <label htmlFor="startTime">Start Time</label>
                        </div>
                        <button className="btn btn-primary">Add event</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

function ItineraryList() {
    const [showForm, setShowForm] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [editMode, setEditMode] = useState(null); // Edit By Row
    const [editedValues, setEditedValues] = useState({});

    async function loadItineraries() {
        try {
            const response = await fetch('http://localhost:8000/itinerary');
            if (response.ok) {
                const data = await response.json();
                setItineraries(data)
            } else {
                console.error(response);
            }
        } catch (e) {
            console.error("No itinerary found", e)
        }
    }

    // function formatTimeIn12HourFormat(date) {
    //     const time = new Date(date);
    //     return time.toLocaleTimeString('en-US', {
    //         hour: 'numeric',
    //         minute: '2-digit',
    //         hour12: true,
    //     });
    // }

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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            const updatedItineraries = [...itineraries];
            updatedItineraries[rowIndex] = updatedData;
            setItineraries(updatedItineraries);
            setEditMode(null);
            window.location.reload();
        } else {
            console.error("Failed to update itinerary:", response);
        }
    };


    const handleDelete = async (location_id) => {
        const url = `http://localhost:8000/itinerary/${location_id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.reload();
        } else {
           return {"message": "Could not delete location."}
        }
    }

    function customTimeCovert(time) {

        const [hours, minutes, seconds] = time.split(':');


        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));
        date.setSeconds(parseInt(seconds));


        const timeFormatted = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return timeFormatted;
}


    useEffect(() => {
        loadItineraries()
    }, [])

    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {itineraries.length > 0 ? (
                        itineraries.map((itinerary, rowIndex) => (
                            <tr key={itinerary.location_id}>
                                <td>
                                    {editMode === rowIndex ? (
                                        <input
                                            type="text"
                                            value={editedValues[rowIndex]['location_name']}
                                            onChange={(e) =>
                                                setEditedValues({
                                                    ...editedValues,
                                                    [rowIndex]: { ...editedValues[rowIndex], location_name: e.target.value },
                                                })
                                            }
                                        />
                                    ) : (
                                        itinerary.location_name
                                    )}
                                </td>
                                <td>
                                    {editMode === rowIndex ? (
                                        <input
                                            type="time"
                                            value={editedValues[rowIndex]['start_time']}
                                            onChange={(e) =>
                                                setEditedValues({
                                                    ...editedValues,
                                                    [rowIndex]: { ...editedValues[rowIndex], start_time: e.target.value },
                                                })
                                            }
                                        />
                                    ) : (
                                        customTimeCovert(itinerary.start_time)
                                    )}
                                </td>
                                <td>
                                    {editMode === rowIndex ? (
                                        <button onClick={() => handleSaveCell(rowIndex)}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditCell(rowIndex)}>Edit</button>
                                    )}
                                    <button onClick={() => handleDelete(itinerary.location_id)} className='btn btn-primary'>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No itineraries found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showForm ? (
                <ItineraryForm onSubmit={handleAddItinerary} />
            ) : (
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                    Add Itinerary
                </button>
            )}
        </>
    );
}

export default ItineraryList;
