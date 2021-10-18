from fastapi import FastAPI
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

apply_handlers(app, db)
