from pydantic import BaseModel
from datetime import date
from typing import List, Optional, Union
from queries.pool import pool


class Error(BaseModel):
    message: str


class DuplicateTripError(ValueError):
    pass


class AuthenticationException(ValueError):
    pass


class TripsIn(BaseModel):
    trip_name: str
    start_date: date
    end_date: date


class TripsOut(BaseModel):
    trip_id: int
    trip_name: str
    start_date: date
    end_date: date


class TripsOut2(BaseModel):
    trip_id: int
    trip_name: str
    start_date: date
    end_date: date
    auth_id: int


class TripsQueries:
    def create_one_trip(self, trips: TripsIn, auth_id) -> Union[TripsOut2, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        INSERT INTO trips (trip_name, start_date, end_date, auth_id)
                        VALUES (%s, %s, %s, %s)
                        RETURNING trip_id, trip_name, start_date, end_date, auth_id;
                        """,
                        [
                            trips.trip_name,
                            trips.start_date,
                            trips.end_date,
                            auth_id
                        ]
                    )
                    record = None
                    row = db.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                    return TripsOut2(**record)
        except Exception as e:
            return {"message": str(e)}

    def update(self, trip_id: int, trip: TripsIn) -> Union[TripsOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE trips
                        SET
                            trip_name = %s,
                            start_date = %s,
                            end_date = %s
                        WHERE trip_id = %s
                        """,
                        [
                            trip.trip_name,
                            trip.start_date,
                            trip.end_date,
                            trip_id
                        ]
                    )
                    return self.trip_in_to_out(trip_id, trip)
        except Exception as e:
            print(e)
            return {"message": "Could not update that trip"}

    def get_one(self, trip_id: int) -> Optional[TripsOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            trip_id,
                            trip_name,
                            start_date,
                            end_date
                        FROM trips
                        WHERE trip_id = %s
                        """,
                        [trip_id]
                    )
                    record = db.fetchone()
                    if record is None:
                        return None
                    return self.record_to_trip_out(record)
        except Exception as e:
            print(e)
            return {"message": "Could not get that trip"}

    def get_all(self, user_id: int) -> Union[Error, List[TripsOut2]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            trip_id,
                            trip_name,
                            start_date,
                            end_date
                        FROM trips
                        WHERE auth_id = %s
                        ORDER BY start_date;
                        """,
                        [user_id]
                    )
                    return [
                        self.record_to_trip_out(record)
                        for record in db
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get all trips"}

    def delete(self, trip_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM trips
                        WHERE trip_id = %s
                        """,
                        [trip_id]
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def trip_in_to_out(self, id: int, trip: TripsIn):
        old_data = trip.dict()
        return TripsOut(trip_id=id, **old_data)

    def record_to_trip_out(self, record):
        return TripsOut(
            trip_id=record[0],
            trip_name=record[1],
            start_date=record[2],
            end_date=record[3],
        )

    def record_to_trip_out2(self, record):
        return TripsOut2(
            trip_id=record[0],
            trip_name=record[1],
            start_date=record[2],
            end_date=record[3],
            auth_id=record[4]
        )

    def get_auth_trip(self, auth_id) -> Union[Error, List[TripsOut2]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            trip_id,
                            trip_name,
                            start_date,
                            end_date,
                            auth_id
                        FROM
                            trip as t WHERE t.auth_id = %s
                        """,
                        [auth_id]

                    )
                    return [
                        self.record_to_trip_out2(record)
                        for record in db
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get auth_id to trip"}
