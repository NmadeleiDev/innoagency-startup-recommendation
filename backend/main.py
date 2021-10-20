from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from db.manager import DbManager
from api.handlers import apply_handlers

logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %H:%M:%S :', level=logging.DEBUG)

db = DbManager()
db.init_connection()
db.init_indexes()
db.init_enums()

app = FastAPI(
    title="StartupGuide API",
    description='API docs for StartupGuide backend',
    version="0.0.1",
    contact={
        "name": "Rolling Drones",
        "email": "potemkin3940@gmail.com",
    },
    openapi_url="/openapi.json",
    docs_url="/docs",
    root_path="/backend"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

apply_handlers(app, db)
