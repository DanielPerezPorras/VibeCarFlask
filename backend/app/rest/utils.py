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

reglas_diacriticos = {
    "A": "[aá]",
    "a": "[aá]",
    "E": "[eé]",
    "e": "[eé]",
    "I": "[ií]",
    "i": "[ií]",
    "O": "[oó]",
    "o": "[oó]",
    "U": "[uúü]",
    "u": "[uúü]",
    "Ü": "[uúü]",
    "ü": "[uúü]"
}
def convertir_diacriticos_regex(expr):
    resultado = ""
    for c in expr:
        if c in reglas_diacriticos:
            resultado += reglas_diacriticos[c]
        else:
            resultado += c
    return resultado

def procesar_regex(expr):
    return convertir_diacriticos_regex(escape_regex(expr))