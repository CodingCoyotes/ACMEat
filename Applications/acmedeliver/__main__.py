import os

import bcrypt
import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from acmedeliver.authentication import Token, authenticate_user, create_token
from acmedeliver.database import models
from acmedeliver.database.db import Session, engine

from acmedeliver.routers.api.users.v1 import users
from acmedeliver.routers.api.clients.v1 import clients
from acmedeliver.routers.api.deliveries.v1 import deliveries

from acmedeliver.configuration import setting_required
from acmedeliver.errors import *
from acmedeliver.handlers import *
from acmedeliver.database.enums import UserType

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)
app.include_router(clients.router)
app.include_router(deliveries.router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AcmedeliverException, handle_acme_error)
app.add_exception_handler(sqlalchemy.exc.NoResultFound, handle_sqlalchemy_not_found)
app.add_exception_handler(sqlalchemy.exc.MultipleResultsFound, handle_sqlalchemy_multiple_results)


@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Funzione di autenticazione. Se le credenziali sono corrette viene restituito un JWT
    :param form_data: informazioni di autenticazione
    :return: un dict contenente il token e il suo tipo
    """
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    token = create_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


if __name__ == "__main__":
    # Configurazione dati collegamento
    BIND_IP = setting_required("BIND_IP")
    BIND_PORT = setting_required("BIND_PORT")
    with Session(future=True) as db:
        # Se non esistono utenti, crea un utente amministratore.
        user = db.query(models.User).filter_by(kind=UserType.admin).first()
        if not user:
            h = bcrypt.hashpw(bytes("password", encoding="utf-8"), bcrypt.gensalt())
            db.add(models.User(name="Admin", surname="Admin", email="admin@admin.com", kind=UserType.admin,
                               password=h))
            db.commit()
    # Avvia il server uvicorn
    uvicorn.run(app, host=BIND_IP, port=int(BIND_PORT), debug=True)
