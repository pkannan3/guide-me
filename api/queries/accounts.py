from pydantic import BaseModel
from typing import Optional
from queries.pool import pool


class DuplicateAccountError(ValueError):
    pass


class AccountIn(BaseModel):
    name: str
    username: str
    password: str
    email: str


class AccountOut(BaseModel):
    id: int
    name: str
    username: str
    email: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class Error(BaseModel):
    message: str


class AccountQueries:
    def get_one_account(
        self, username: str
    ) -> Optional[AccountOutWithPassword]:
        print("here in get): " + username)
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT *
                    FROM authentication
                    WHERE username = %s;
                    """,
                    [username],
                )
                try:
                    record = db.fetchone()
                    if record is None:
                        return None
                    return AccountOutWithPassword(
                        id=record[0],
                        name=record[1],
                        username=record[2],
                        hashed_password=record[3],
                        email=record[4],
                    )
                except Exception:
                    print("exception")
                    return {
                        "message": "Could not get account record for this account username"
                    }

    def create_account(
        self, register, hashed_password: str
    ) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as db:
                params = [
                    register.name,
                    register.username,
                    register.email,
                    hashed_password,
                ]
                db.execute(
                    """
                    INSERT INTO authentication
                    (
                        name,
                        username,
                        email,
                        hashed_password
                    )
                    VALUES (%s, %s, %s, %s)
                    RETURNING
                        id,
                        username,
                        name,
                        email,
                        hashed_password
                    """,
                    params,
                )
                record = None
                row = db.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(db.description):
                        record[column.name] = row[i]
                print(record)
                return AccountOutWithPassword(**record)


def edit_account(
    self, username: str, updated_account: AccountIn
) -> Optional[AccountOutWithPassword]:
    with pool.connection() as conn:
        with conn.cursor() as db:
            db.execute(
                """
                UPDATE authentication
                SET
                    name = %s,
                    username = %s,
                    email = %s
                WHERE id = %s
                RETURNING
                    id,
                    username,
                    name,
                    email,
                    hashed_password
                """,
                [
                    updated_account.name,
                    updated_account.username,
                    updated_account.email,
                    id,
                ],
            )
            try:
                record = db.fetchone()
                if record is None:
                    return None
                return AccountOutWithPassword(
                    id=record[0],
                    name=record[1],
                    username=record[2],
                    hashed_password=record[3],
                    email=record[4],
                )
            except Exception as e:
                print(e)
                return {"message": "Could not update that account"}
