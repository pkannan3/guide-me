from fastapi import APIRouter, Depends, Response
from typing import Optional, List, Union
from decimal import Decimal
from queries.budget import (
    Error,
    ExpenseIn,
    ExpenseOut,
    ExpenseQueries
)


router = APIRouter()


@router.post("/expense/create", response_model=Union[ExpenseOut, Error])
def create_one_expense(
    expense: ExpenseIn,
    repo: ExpenseQueries = Depends()
):
    expense.cost = Decimal(expense.cost)
    return repo.create_one_expense(expense)


@router.put("/expense/{expense_id}", response_model=Union[ExpenseOut, Error])
def update_expense(
    expense_id: int,
    expense: ExpenseIn,
    repo: ExpenseQueries = Depends(),
) -> Union[Error, ExpenseOut]:
    return repo.update_expense(expense_id, expense)


@router.get("/expense/{expense_id}", response_model=Optional[ExpenseOut])
def get_one_expense(
    expense_id: int,
    response: Response,
    repo: ExpenseQueries = Depends(),
) -> ExpenseOut:
    expense = repo.get_one(expense_id)
    if expense is None:
        response.status_code = 404
    return expense


@router.get("/expense", response_model=Union[List[ExpenseOut], Error])
def get_all_expense(
    repo: ExpenseQueries = Depends(),
):
    return repo.get_all()


@router.delete("/expense/{expense_id}", response_model=bool)
def delete_expense(
    expense_id: int,
    repo: ExpenseQueries = Depends(),
) -> bool:
    return repo.delete(expense_id)
