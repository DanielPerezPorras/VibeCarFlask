## 
## Script para crear y poblar la base de datos
##
import json
import pymongo

_client = pymongo.MongoClient("mongodb://localhost:27017/")
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

with open("datasets/usuario.json") as fstream:
    usuario.insert_many(json.load(fstream))

# with open("datasets/trayecto.json") as fstream:
#     trayecto.insert_many(json.load(fstream))

# with open("datasets/reserva.json") as fstream:
#     reserva.insert_many(json.load(fstream))

# with open("datasets/opinion.json") as fstream:
#     opinion.insert_many(json.load(fstream))

# with open("datasets/mensaje.json") as fstream:
#     mensaje.insert_many(json.load(fstream))