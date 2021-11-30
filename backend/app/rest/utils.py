from flask_pymongo import PyMongo, ObjectId
from ..app import app

mongo = PyMongo(app)
usuario = mongo.db.usuario
trayecto = mongo.db.trayecto

# Devuelve los datos de un usuario si existe, o None en caso contrario
def usuario_existe(id, proj):
    try:
        return usuario.find_one({"_id": ObjectId(id)}, projection=proj)
    except:
        return None

# Devuelve los datos de un trayecto si existe, o None en caso contrario
def trayecto_existe(id, proj):
    try:
        return trayecto.find_one({"_id": ObjectId(id)}, projection=proj)
    except:
        return None

# Escapa caracteres que tienen un significado especial en expresiones regulares
_caracteres_especiales = "\\[]^*+?{}|()$."
def escape_regex(expr):
    for c in _caracteres_especiales:
        expr = expr.replace(c, "\\" + c)
    return expr