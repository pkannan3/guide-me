from fastapi.testclient import TestClient
from main import app
from queries.trips import TripsQueries
from authenticator import authenticator
from queries.accounts import AccountQueries

client = TestClient(app)


class AccountQueryTest:
    def get(self, username: str):
        return {
            "id": 4,
            "first_name": "string1",
            "username": "string1",
            "email": "string1",
        }


def test_get_account():
    app.dependency_overrides[AccountQueries] = AccountQueryTest
    response = client.get("/api/accounts/string1")
    assert response.status_code == 200


class GuideMeAuthenticatorTest:
    def fake_try_get_current_account_data():
        account = {
            "id": 4,
            "first_name": "string1",
            "username": "string1",
            "email": "string1",
        }
        return account


class TripTest:
    def get_all(self, account):
        return [
            {
                "trip_id": 1,
                "trip_name": "Trip 1",
                "start_date": "2023-10-17",
                "end_date": "2024-01-10",
            },
        ]


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


def test_get_all_trips():
    fake_auth = GuideMeAuthenticatorTest
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_auth.fake_try_get_current_account_data
    app.dependency_overrides[TripsQueries] = TripTest

    response = client.get("/trips/")

    assert response.status_code == 200
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
