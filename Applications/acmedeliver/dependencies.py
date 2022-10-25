from contextlib import contextmanager

import sqlalchemy
from fastapi import Header, HTTPException
from acmedeliver.database.db import Session


async def get_auth_token(auth: str = Header(...)):
    if auth != "fuf":
        raise HTTPException(status_code=400, detail="tmp")


def dep_dbsession() -> sqlalchemy.orm.Session:
    """
    Dependency which creates a new database session (transaction) and closes it after the request is answered.
    """
    with Session(future=True) as session:
        yield session
