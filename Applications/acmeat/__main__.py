import os

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from starlette.responses import RedirectResponse
from camunda.external_task.external_task import ExternalTask, TaskResult
from camunda.external_task.external_task_worker import ExternalTaskWorker

from acmeat.authentication import Token, authenticate_user, create_token, get_hash
from acmeat.crud import *
from acmeat.database import models
from acmeat.database.db import Session, engine
from acmeat.routers.api.users.v1 import users
from acmeat.configuration import setting_required
from acmeat.services.test_services import echo_task

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

camunda_config = {
    "maxTasks": 100,
    "lockDuration": 0,
    "asyncResponseTimeout": 0,
    "retries": 3,
    "retryTimeout": 5000,
    "sleepSeconds": 0
}


@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    token = create_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


if __name__ == "__main__":
    BIND_IP = setting_required("BIND_IP")
    BIND_PORT = setting_required("BIND_PORT")

    #with Session(future=True) as db:
    #    if not db.query(models.User).first():
    #        quick_create(db, models.User(email="admin@admin.com", password=get_hash(bytes("password", encoding="utf-8")), name="admin",
    #                                     surname="admin"))
    uvicorn.run(app, host=BIND_IP, port=int(BIND_PORT), debug=True)
