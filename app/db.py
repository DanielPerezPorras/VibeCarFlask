import pymongo

_client = pymongo.MongoClient("mongodb://localhost:27017/")
_db = _client["vibecar"]

# Acceso a las tablas en MongoDB
# from .db import <tabla>

usuario = _db["usuario"]
trayecto = _db["trayecto"]
reserva = _db["reserva"]
opinion = _db["opinion"]
mensaje = _db["mensaje"]