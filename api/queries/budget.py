from pydantic import BaseModel
from typing import List, Optional, Union
from queries.pool import pool


class Error(BaseModel):
    message: str


class AuthenticationException(ValueError):
    pass


class ExpenseIn(BaseModel):
    expense_name: str
    cost: float
    category: str


class ExpenseOut(BaseModel):
    expense_id: int
    cost: float
    expense_name: str
    category: str


class TotalIn(BaseModel):
    total: float


class TotalOut(BaseModel):
    total: float


class TripBudgetOut(BaseModel):
    expense_id: int
    cost: float
    expense_name: str
    category: str
    total: int
    trip_id: int


class ExpenseQueries:
    def create_one_expense(self, budget: ExpenseIn, trip_id) -> Union[TripBudgetOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        INSERT INTO budget (expense_name, cost, category, trip_id)
                        VALUES (%s, %s, %s, %s)
                        RETURNING expense_id, expense_name, cost, category, total, trip_id;
                        """,
                        [
                            budget.expense_name,
                            budget.cost,
                            budget.category,
                            trip_id
                        ]
                    )
                    record = None
                    row = db.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                    print("record 2", record)
                    return TripBudgetOut(**record)
        except Exception as e:
            return {"message": str(e)}

    def update_expense(self, expense_id: int, budget: ExpenseIn) -> Union[ExpenseOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE budget
                        SET
                            expense_name = %s,
                            cost = %s,
                            category = %s
                        WHERE expense_id = %s
                        """,
                        [
                            budget.expense_name,
                            budget.cost,
                            budget.category,
                            expense_id
                        ]
                    )
                    return self.budget_in_to_out(expense_id, budget)
        except Exception as e:
            print(e)
            return {"message": "Could not update that expense"}

    def get_one(self, expense_id: int) -> Optional[ExpenseOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            expense_id,
                            expense_name,
                            cost,
                            category
                        FROM budget
                        WHERE expense_id = %s
                        """,
                        [expense_id]
                    )
                    record = db.fetchone()
                    if record is None:
                        return None
                    return self.record_to_budget_out(record)
        except Exception as e:
            print(e)
            return {"message": "Could not get that location"}

    def get_all(self) -> Union[Error, List[TripBudgetOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT *
                        FROM budget
                        ORDER BY expense_id;
                        """
                    )
                    return [
                        self.record_to_budget_trip_out(record)
                        for record in db
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get all expenses"}

    def delete(self, expense_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM budget
                        WHERE expense_id = %s
                        """,
                        [expense_id]
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def budget_in_to_out(self, id: int, budget: ExpenseIn):
        old_data = budget.dict()
        return ExpenseOut(expense_id=id, **old_data)

    def record_to_budget_out(self, record):
        return ExpenseOut(
            expense_id=record[0],
            expense_name=record[1],
            cost=float(record[2]),
            category=record[3]
        )

    def update_total(self, budget: TotalIn) -> Union[TotalOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE budget
                        SET
                            total = %s
                        """,
                        [
                            budget.total
                        ]
                    )
                    return TotalOut(total=budget.total)
        except Exception as e:
            print(e)
            return {"message": "Could not update the total"}

    def get_budget_trip(self, trip_id) -> Union[Error, List[ExpenseOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            expense_id,
                            expense_name,
                            cost,
                            category,
                            total,
                            trip_id
                        FROM
                            budget as b WHERE b.trip_id = %s
                        """,
                        [trip_id]

                    )
                    return [
                        self.record_to_budget_trip_out(record)
                        for record in db
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get trip_id to expenses"}

    def record_to_budget_trip_out(self, record):
        return TripBudgetOut(
            expense_id=record[0],
            expense_name=record[1],
            cost=float(record[2]),
            category=record[3],
            total=record[4],
            trip_id=record[5]
        )
