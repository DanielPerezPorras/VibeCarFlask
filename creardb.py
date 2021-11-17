## 
## Script para crear y poblar la base de datos
##
import json
from bson.objectid import ObjectId
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

# Mapping de IDs de los JSON a ObjectIds
usuario_ids = {}
trayecto_ids = {}

with open("datasets/usuario.json") as fstream:
    json_usuarios = json.load(fstream)
    for u in json_usuarios:
        oid = ObjectId()
        usuario_ids[u["ID"]] = oid
        u.pop("ID")
        u["_id"] = oid

    usuario.insert_many(json_usuarios)

with open("datasets/trayecto.json") as fstream:
    json_trayectos = json.load(fstream)
    for t in json_trayectos:
        oid = ObjectId()
        trayecto_ids[t["ID"]] = oid
        t.pop("ID")
        t["_id"] = oid

        # Remplazar IDs de conductores por sus ObjectIds
        conductor = t["conductor"]
        conductor["_id"] = usuario_ids[conductor["ID"]]
        conductor.pop("ID")

    trayecto.insert_many(json_trayectos)

# with open("datasets/reserva.json") as fstream:
#     reserva.insert_many(json.load(fstream))

# with open("datasets/opinion.json") as fstream:
#     opinion.insert_many(json.load(fstream))

# with open("datasets/mensaje.json") as fstream:
#     mensaje.insert_many(json.load(fstream))