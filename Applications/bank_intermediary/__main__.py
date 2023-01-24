import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from bank_intermediary.routers.api.intermediary.v1.intermediary import router as intermediaryrouter

from bank_intermediary.configuration import setting_required
from bank_intermediary.errors import *
from bank_intermediary.handlers import *

app = FastAPI()

app.include_router(intermediaryrouter)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(BankIntermediaryException, handle_acme_error)


if __name__ == "__main__":
    BIND_IP = setting_required("BIND_IP")
    BIND_PORT = setting_required("BIND_PORT")
    uvicorn.run(app, host=BIND_IP, port=int(BIND_PORT), debug=True)

