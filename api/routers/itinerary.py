from fastapi import APIRouter, Depends, Response
from typing import Optional, List, Union
from queries.itinerary import (
    Error,
    ItineraryIn,
    ItineraryOut,
    ItineraryQueries,
    TripItineraryOut,
)


router = APIRouter()


@router.post(
    "/trips/{trip_id}/itinerary/create",
    tags=["itinerary"],
    response_model=Union[TripItineraryOut, Error],
)
def create_one_location(
    trip_id: int, itinerary: ItineraryIn, repo: ItineraryQueries = Depends()
):
    return repo.create_one_location(itinerary, trip_id)


@router.put(
    "/itinerary/{location_id}",
    tags=["itinerary"],
    response_model=Union[ItineraryOut, Error],
)
def update_location(
    location_id: int,
    itinerary: ItineraryIn,
    repo: ItineraryQueries = Depends(),
) -> Union[Error, ItineraryOut]:
    return repo.update(location_id, itinerary)


@router.get(
    "/itinerary/{location_id}",
    tags=["itinerary"],
    response_model=Optional[ItineraryOut],
)
def get_one_location(
    location_id: int,
    response: Response,
    repo: ItineraryQueries = Depends(),
) -> ItineraryOut:
    itinerary = repo.get_one(location_id)
    if itinerary is None:
        response.status_code = 404
    return itinerary


@router.get(
    "/itinerary",
    tags=["itinerary"],
    response_model=Union[List[TripItineraryOut], Error],
)
def get_all_location(
    repo: ItineraryQueries = Depends(),
):
    return repo.get_all()


@router.delete(
    "/itinerary/{location_id}", tags=["itinerary"], response_model=bool
)
def delete_location(
    location_id: int,
    repo: ItineraryQueries = Depends(),
) -> bool:
    return repo.delete(location_id)


@router.get(
    "/trips/{trip_id}/itinerary/",
    tags=["itinerary"],
    response_model=Union[List[TripItineraryOut], Error],
)
def get_Trip_Itinerary(trip_id: int, repo: ItineraryQueries = Depends()):
    return repo.get_itinerary_trip(trip_id)
