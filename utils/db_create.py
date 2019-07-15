from app import create_app
from extensions import sql

sql.create_all(app=create_app())
