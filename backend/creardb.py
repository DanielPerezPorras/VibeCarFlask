## 
## Script para crear y poblar la base de datos
##
from bson import json_util
import pymongo
from app.rest.config import mongodb_connection_string

_client = pymongo.MongoClient(mongodb_connection_string)
_db = _client["vibecar"]

usuario = _db["usuario"]
trayecto = _db["trayecto"]
reserva = _db["reserva"]
opinion = _db["opinion"]
mensaje = _db["mensaje"]

# Vaciar todo lo que haya en cada colección
usuario.drop()
trayecto.drop()
reserva.drop()
opinion.drop()
mensaje.drop()

with open("datasets/usuario.json", encoding="utf-8") as fstream:
    usuario.insert_many(json_util.loads(fstream.read()))

with open("datasets/trayecto.json", encoding="utf-8") as fstream:
    trayecto.insert_many(json_util.loads(fstream.read()))

with open("datasets/reserva.json", encoding="utf-8") as fstream:
    reserva.insert_many(json_util.loads(fstream.read()))

# with open("datasets/opinion.json", encoding="utf-8") as fstream:
#     opinion.insert_many(json_util.loads(fstream.read()))

# with open("datasets/mensaje.json", encoding="utf-8") as fstream:
#     mensaje.insert_many(json_util.loads(fstream.read()))