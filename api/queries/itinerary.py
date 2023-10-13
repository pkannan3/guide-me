from pydantic import BaseModel
from datetime import date, time
from typing import List, Optional, Union
from queries.pool import pool


class Error(BaseModel):
    message: str


class AuthenticationException(ValueError):
    pass


class ItineraryIn(BaseModel):
    location_name: str
    visit_date: date
    start_time: time


class ItineraryOut(BaseModel):
    location_id: int
    location_name: str
    visit_date: date
    start_time: time


class ItineraryQueries:
    def create_one_location(self, itinerary: ItineraryIn) -> Union[ItineraryOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        INSERT INTO itinerary (location_name, visit_date, start_time)
                        VALUES (%s, %s, %s)
                        RETURNING location_id, location_name, visit_date, start_time;
                        """,
                        [
                            itinerary.location_name,
                            itinerary.visit_date,
                            itinerary.start_time
                        ]
                    )
                    record = None
                    row = db.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                    return ItineraryOut(**record)
        except Exception as e:
            return {"message": str(e)}

    def update(self, location_id: int, itinerary: ItineraryIn) -> Union[ItineraryOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE itinerary
                        SET
                            location_name = %s,
                            visit_date = %s,
                            start_time = %s
                        WHERE location_id = %s
                        """,
                        [
                            itinerary.location_name,
                            itinerary.visit_date,
                            itinerary.start_time,
                            location_id
                        ]
                    )
                    return self.itinerary_in_to_out(location_id, itinerary)
        except Exception as e:
            print(e)
            return {"message": "Could not update that location"}

    def get_one(self, location_id: int) -> Optional[ItineraryOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            location_id,
                            location_name,
                            visit_date,
                            start_time
                        FROM itinerary
                        WHERE location_id = %s
                        """,
                        [location_id]
                    )
                    record = db.fetchone()
                    if record is None:
                        return None
                    return self.record_to_itinerary_out(record)
        except Exception as e:
            print(e)
            return {"message": "Could not get that location"}

    def get_all(self) -> Union[Error, List[ItineraryOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            location_id,
                            location_name,
                            visit_date,
                            start_time
                        FROM itinerary
                        ORDER BY visit_date, start_time;
                        """
                    )
                    return [
                        self.record_to_itinerary_out(record)
                        for record in db
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get all locations"}

    def delete(self, location_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM itinerary
                        WHERE location_id = %s
                        """,
                        [location_id]
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def itinerary_in_to_out(self, id: int, itinerary: ItineraryIn):
        old_data = itinerary.dict()
        return ItineraryOut(location_id=id, **old_data)

    def record_to_itinerary_out(self, record):
        return ItineraryOut(
            location_id=record[0],
            location_name=record[1],
            visit_date=record[2],
            start_time=record[3]
        )
