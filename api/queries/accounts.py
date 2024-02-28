from pydantic import BaseModel
from typing import Optional, Union
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


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    hashed_password: Optional[str] = None


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    hashed_password: Optional[str] = None


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
        self, id: int, account: AccountUpdate
    ) -> Union[AccountOutWithPassword, Error]:
        update_values = {
            "name": account.name,
            "username": account.username,
            "email": account.email,
            "hashed_password": account.hashed_password,
        }
        update_values = {
            k: v for k, v in update_values.items() if v is not None
        }

        if not update_values:
            return Error(message="No fields provided for update.")

        set_clause_parts = []

        for field_name in update_values.keys():
            update_part = f"{field_name} = %s"

            set_clause_parts.append(update_part)

        set_clause = ", ".join(set_clause_parts)

        values_list = []
        for value in update_values.values():
            values_list.append(value)

        values = values_list

        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        f"""
                            UPDATE authentication
                            SET {set_clause}
                            WHERE id = %s;
                            """,
                        values + [id],
                    )
                    return self.account_in_to_out(id, account)
        except Exception as e:
            print(e)
            return {"message": "Could not update that account"}

    def account_in_to_out(self, id: int, account: AccountUpdate):
        old_data = account.dict()
        return AccountOutWithPassword(id=id, **old_data)
