from fastapi import APIRouter, Depends, Response
from typing import Optional, List, Union
from queries.trips import Error, TripsIn, TripsOut, TripsQueries, TripsOut2
from authenticator import authenticator


router = APIRouter()


@router.post("/trips/create", response_model=Union[TripsOut2, Error])
def create_one_trip(
    trips: TripsIn,
    account_data: Optional[dict] = Depends(authenticator.try_get_current_account_data),
    repo: TripsQueries = Depends()):
    return repo.create_one_trip(trips, account_data["id"])


@router.put("/trips/{trip_id}", response_model=Union[TripsOut, Error])
def update_trip(
    trip_id: int,
    trip: TripsIn,
    repo: TripsQueries = Depends(),
) -> Union[Error, TripsOut]:
    return repo.update(trip_id, trip)


@router.get("/trips/{trip_id}", response_model=Optional[TripsOut])
def get_one_trip(
    trip_id: int,
    response: Response,
    repo: TripsQueries = Depends(),
) -> TripsOut:
    trip = repo.get_one(trip_id)
    if trip is None:
        response.status_code = 404
    return trip


@router.get("/trips", response_model=Union[List[TripsOut], Error])
def get_all_trips(
    account_data: Optional[dict] = Depends(authenticator.try_get_current_account_data),
    repo: TripsQueries = Depends(),
):
    return repo.get_all(account_data["id"])


@router.delete("/trips/{trip_id}", response_model=bool)
def delete_trip(
    trip_id: int,
    repo: TripsQueries = Depends(),
) -> bool:
    return repo.delete(trip_id)
