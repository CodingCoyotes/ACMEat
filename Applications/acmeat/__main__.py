import bcrypt
import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from acmeat.authentication import Token, authenticate_user, create_token
from acmeat.database import models
from acmeat.database.db import Session, engine
from acmeat.database.enums import UserType

from acmeat.routers.api.users.v1 import users
from acmeat.routers.api.restaurants.v1 import restaurants
from acmeat.routers.api.menus.v1 import menus
from acmeat.routers.api.cities.v1 import cities
from acmeat.routers.api.deliverers.v1 import deliverers
from acmeat.routers.api.orders.v1 import orders

from acmeat.configuration import setting_required
from acmeat.errors import *
from acmeat.handlers import *

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)
app.include_router(restaurants.router)
app.include_router(menus.router)
app.include_router(cities.router)
app.include_router(deliverers.router)
app.include_router(orders.router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AcmeatException, handle_acme_error)
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
    with Session() as db:
        # Se non esistono utenti, crea un utente amministratore.
        if not db.query(models.User).all():
            db.add(models.User(name="Admin", surname="Admin", email="admin@admin.com",
                               password=bcrypt.hashpw(bytes("password", encoding="utf-8"),
                                                      bcrypt.gensalt()), kind=UserType.admin))
            db.commit()
    # Avvia il server uvicorn
    uvicorn.run(app, host=BIND_IP, port=int(BIND_PORT), debug=True)
