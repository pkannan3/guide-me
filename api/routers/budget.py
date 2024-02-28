from fastapi import APIRouter, Depends, Response
from typing import Optional, List, Union
from decimal import Decimal
from queries.budget import (
    Error,
    ExpenseIn,
    ExpenseOut,
    ExpenseQueries,
    TripBudgetOut,
    TotalIn,
    TotalOut,
)


router = APIRouter()


@router.post(
    "/trips/{trip_id}/expense/create",
    tags=["budget"],
    response_model=Union[TripBudgetOut, Error],
)
def create_one_expense(
    trip_id: int, expense: ExpenseIn, repo: ExpenseQueries = Depends()
):
    expense.cost = Decimal(expense.cost)
    return repo.create_one_expense(expense, trip_id)


@router.put(
    "/expense/{expense_id}",
    tags=["budget"],
    response_model=Union[ExpenseOut, Error],
)
def update_expense(
    expense_id: int,
    expense: ExpenseIn,
    repo: ExpenseQueries = Depends(),
) -> Union[Error, ExpenseOut]:
    return repo.update_expense(expense_id, expense)


@router.get(
    "/expense/{expense_id}",
    tags=["budget"],
    response_model=Optional[ExpenseOut],
)
def get_one_expense(
    expense_id: int,
    response: Response,
    repo: ExpenseQueries = Depends(),
) -> ExpenseOut:
    expense = repo.get_one(expense_id)
    if expense is None:
        response.status_code = 404
    return expense


@router.get(
    "/expense",
    tags=["budget"],
    response_model=Union[List[TripBudgetOut], Error],
)
def get_all_expense(
    repo: ExpenseQueries = Depends(),
):
    return repo.get_all()


@router.delete("/expense/{expense_id}", tags=["budget"], response_model=bool)
def delete_expense(
    expense_id: int,
    repo: ExpenseQueries = Depends(),
) -> bool:
    return repo.delete(expense_id)


@router.put(
    "/trips/{trip_id}/update_budgeted_amount",
    tags=["budget"],
    response_model=Union[TotalOut, Error],
)
def update_total(
    trip_id: int,
    total: TotalIn,
    repo: ExpenseQueries = Depends(),
) -> Union[Error, TotalOut]:
    return repo.update_total(trip_id, total)


@router.get(
    "/trips/{trip_id}/expense/",
    tags=["budget"],
    response_model=Union[List[TripBudgetOut], Error],
)
def get_Trip_Budget(trip_id: int, repo: ExpenseQueries = Depends()):
    return repo.get_budget_trip(trip_id)
