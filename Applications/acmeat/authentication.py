"""
Questo modulo contiene utility di autenticazione.
"""
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from acmeat.database import models
from acmeat.deps.user import get_user_by_email
from acmeat.database.db import Session
from acmeat.configuration import JWT_KEY

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120


class Token(BaseModel):
    """
    Schema di risposta del token
    """
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """
    Schema contenuti token
    """
    email: Optional[str] = None


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def check_password(h, password):
    """
    Funzione di verifica password. Dato un hash, verifica se la password corrisponde.
    :param h: hash
    :param password: password
    :return: un booleano
    """
    return pwd_context.verify(password, h)


def get_hash(password):
    """
    Funzione di hashing
    :param password: password
    :return: un hash
    """
    return pwd_context.hash(password)


def authenticate_user(email: str, password: str):
    """
    Data una combinazione di email e password, verifica se questa combinazione corrisponde ad un utente valido.
    :param email: la mail dell'utente
    :param password: password
    :return: a boolean or an user
    """
    with Session(future=True) as db:
        user: models.User = get_user_by_email(db, email)
        if not user:
            return False
        if not check_password(user.password, password):
            return False
        return user


def create_token(data: dict):
    """
    Crea un token JWT
    :param data: dict contenente i dati da codificare
    :return: il token JWT
    """
    encode = data.copy()
    encode.update({"exp": datetime.utcnow() + timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)})
    return jwt.encode(encode, JWT_KEY, ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Partendo dal token, rintraccia l'utente a cui corrisponde
    :param token: il token JWT
    :return: l'utente
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    with Session(future=True) as db:
        user = get_user_by_email(db, token_data.email)
        if user is None:
            raise credentials_exception
        return user
