from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from typing import Union
from jwtdown_fastapi.authentication import Token

from authenticator import authenticator

from pydantic import BaseModel

from queries.accounts import (
    AccountIn,
    AccountOut,
    AccountQueries,
    DuplicateAccountError,
    AccountOutWithPassword,
    Error,
    AccountUpdate,
)


class AccountForm(BaseModel):
    username: str
    password: str


class AccountToken(Token):
    account: AccountOut


class HttpError(BaseModel):
    detail: str


router = APIRouter()


@router.get("/protected", tags=["accounts"], response_model=bool)
async def get_protected(
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    return True


@router.get("/token", tags=["accounts"], response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: AccountOut = Depends(authenticator.try_get_current_account_data),
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }


@router.post(
    "/register", tags=["accounts"], response_model=AccountToken | HttpError
)
async def create_account(
    info: AccountIn,
    request: Request,
    response: Response,
    queries: AccountQueries = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = queries.create_account(info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials",
        )
    form = AccountForm(
        name=info.name,
        username=info.username,
        password=info.password,
        email=info.email,
    )
    token = await authenticator.login(response, request, form, queries)
    return AccountToken(account=account, **token.dict())


@router.get(
    "/api/accounts/{username}/", tags=["accounts"], response_model=AccountOut
)
async def get_account(
    username: str,
    accounts: AccountQueries = Depends(),
):
    return accounts.get_one_account(username)


@router.put(
    "/accounts/{id}",
    tags=["accounts"],
    response_model=Union[AccountOutWithPassword, Error],
)
def update_account(
    id: int,
    account: AccountUpdate,
    repo: AccountQueries = Depends(),
):
    if account.password:
        hashed_password = authenticator.hash_password(account.password)
        account.hashed_password = hashed_password

    updated_account = repo.edit_account(id, account)
    if isinstance(updated_account, Error):
        raise HTTPException(status_code=400, detail=updated_account.message)
    return updated_account
