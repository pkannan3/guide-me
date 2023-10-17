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


class ExpenseQueries:
    def create_one_expense(self, budget: ExpenseIn) -> Union[ExpenseOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        INSERT INTO budget (expense_name, cost, category)
                        VALUES (%s, %s, %s)
                        RETURNING expense_id, expense_name, cost, category, total;
                        """,
                        [
                            budget.expense_name,
                            budget.cost,
                            budget.category
                        ]
                    )
                    record = None
                    row = db.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                    print("record 2", record)
                    return ExpenseOut(**record)
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

    def get_all(self) -> Union[Error, List[ExpenseOut]]:
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
                        ORDER BY expense_id;
                        """
                    )
                    return [
                        self.record_to_budget_out(record)
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
