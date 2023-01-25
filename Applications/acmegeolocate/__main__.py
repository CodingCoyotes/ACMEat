import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from acmegeolocate.routers.api.geo.v1.geolocate import router as georouter

from acmegeolocate.configuration import setting_required
from acmegeolocate.errors import *
from acmegeolocate.handlers import *

app = FastAPI()

app.include_router(georouter)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AcmegeolocateException, handle_acme_error)


if __name__ == "__main__":
    BIND_IP = setting_required("BIND_IP")
    BIND_PORT = setting_required("BIND_PORT")
    uvicorn.run(app, host=BIND_IP, port=int(BIND_PORT), debug=True)

