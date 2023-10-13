from fastapi import APIRouter, Depends, Response, HTTPException
from typing import Optional, List, Union
from pydantic import BaseModel
from queries.itinerary import (
    Error,
    ItineraryIn,
    ItineraryOut,
    ItineraryQueries
)


router = APIRouter()


@router.post("/itinerary/create", response_model=Union[ItineraryOut, Error])
def create_one_location(
    itinerary: ItineraryIn,
    repo: ItineraryQueries = Depends()
):
    return repo.create_one_location(itinerary)


@router.put("/itinerary/{location_id}", response_model=Union[ItineraryOut, Error])
def update_location(
    location_id: int,
    itinerary: ItineraryIn,
    repo: ItineraryQueries = Depends(),
) -> Union[Error, ItineraryOut]:
    return repo.update(location_id, itinerary)


@router.get("/itinerary/{location_id}", response_model=Optional[ItineraryOut])
def get_one_location(
    location_id: int,
    response: Response,
    repo: ItineraryQueries = Depends(),
) -> ItineraryOut:
    itinerary = repo.get_one(location_id)
    if itinerary is None:
        response.status_code = 404
    return itinerary


@router.get("/itinerary", response_model=Union[List[ItineraryOut], Error])
def get_all_location(
    repo: ItineraryQueries = Depends(),
):
    return repo.get_all()


@router.delete("/itinerary/{location_id}", response_model=bool)
def delete_location(
    location_id: int,
    repo: ItineraryQueries = Depends(),
) -> bool:
    return repo.delete(location_id)
