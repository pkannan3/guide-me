from fastapi.testclient import TestClient
from main import app
from queries.trips import TripsQueries

client = TestClient(app)


class TestTripsQueries:
    fake_db = {
        "trips": [
            {
                "trip_id": 1,
                "trip_name": "Trip 1",
                "start_date": "2023-10-17",
                "end_date": "2024-01-10",
            },
            {
                "trip_id": 2,
                "trip_name": "Trip 2",
                "start_date": "2024-04-17",
                "end_date": "2024-05-10",
            },
        ]
    }

    def get_all(self):
        try:
            return self.fake_db["trips"]
        except Exception as e:
            return {"message": str(e)}

    def create_one_trip(self, trip):
        self.fake_db["trips"].append({"id": 1, **trip.dict()})
        return {
            "trip_id": 1,
            "trip_name": "Trip 1",
            "start_date": "2023-10-17",
            "end_date": "2024-01-10",
        }

    def get_one(self, id):
        for trip in self.fake_db["trips"]:
            if trip["trip_id"] == id:
                return trip
        return {"message": "get_one test failed"}

    def update(self, id, updated_trip):
        for trip in self.fake_db["trips"]:
            if trip["trip_id"] == id:
                trip.update(updated_trip)
                return trip
        return {"message": "update test failed"}


# SEAT
def test_get_all_trips():
    # Setup/Arrange
    app.dependency_overrides[TripsQueries] = TestTripsQueries

    # Enact/Act
    response = client.get("/trips")

    # Assert
    assert response.status_code == 200
    assert response.json() == [
        {
            "trip_id": 1,
            "trip_name": "Trip 1",
            "start_date": "2023-10-17",
            "end_date": "2024-01-10",
        },
        {
            "trip_id": 2,
            "trip_name": "Trip 2",
            "start_date": "2024-04-17",
            "end_date": "2024-05-10",
        },
    ]
    app.dependency_overrides = {}


def test_create_trip():
    # Setup/Arrange
    app.dependency_overrides[TripsQueries] = TestTripsQueries
    new_trip = {
        "trip_name": "Trip 1",
        "start_date": "2023-10-17",
        "end_date": "2024-01-10",
    }
    expected = {
        "trip_id": 1,
        "trip_name": "Trip 1",
        "start_date": "2023-10-17",
        "end_date": "2024-01-10",
    }

    # Enact/Act
    response = client.post(
        "/trips/create",
        headers={"Content-Type": "application/json"},
        json=new_trip,
    )

    # Assert
    assert response.status_code == 200
    assert response.json() == expected

    # Teardown
    app.dependency_overrides = {}


def test_get_one_trip():
    app.dependency_overrides[TripsQueries] = TestTripsQueries

    expected = {
        "trip_id": 1,
        "trip_name": "Trip 1",
        "start_date": "2023-10-17",
        "end_date": "2024-01-10",
    }

    response = client.get("/trips/1")

    assert response.status_code == 200
    assert response.json() == expected

    app.dependency_overrides = {}


def test_update_trip():
    app.dependency_overrides[TripsQueries] = TestTripsQueries
    updated_trip = {
        "trip_id": 1,
        "trip_name": "Trip 1.5",
        "start_date": "2024-10-17",
        "end_date": "2025-01-10",
    }
    expected = updated_trip

    response = client.put(
        "/trips/1",
        headers={"Content-Type": "application/json"},
        json=updated_trip,
    )

    assert response.status_code == 200
    assert response.json() == expected

    app.dependency_overrides = {}
