import bcrypt
import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from acmerestaurant.authentication import Token, authenticate_user, create_token
from acmerestaurant.database import models
from acmerestaurant.database.db import Session, engine
from acmerestaurant.database.enums import UserType

from acmerestaurant.routers.api.user.v1 import user
from acmerestaurant.routers.api.server.v1 import server
from acmerestaurant.routers.api.order.v1 import order

from acmerestaurant.configuration import setting_required
from acmerestaurant.errors import *
from acmerestaurant.handlers import *

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router)
app.include_router(server.router)
app.include_router(order.router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AcmerestaurantException, handle_acme_error)
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
    # Setup parametri di connessione
    BIND_IP = setting_required("BIND_IP")
    BIND_PORT = setting_required("BIND_PORT")
    with Session() as db:
        # Se non esistono utenti ne viene creato uno con il ruolo di amministratore
        if not db.query(models.User).all():
            db.add(models.User(name="Admin", surname="Admin", email=setting_required("ACME_EMAIL"),
                               password=bcrypt.hashpw(bytes(setting_required("ACME_PASSWORD"), encoding="utf-8"),
                                                      bcrypt.gensalt()), kind=UserType.admin))
            db.commit()
    # Viene avviato il server uvicorn
    uvicorn.run(app, host=BIND_IP, port=int(BIND_PORT), debug=True)
