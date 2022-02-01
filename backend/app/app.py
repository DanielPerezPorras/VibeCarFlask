import os
from flask import Flask
from flask_cors import CORS


app = Flask(__name__)

# Evitar problemas con React
CORS(app)

# Asegurarnos de que se carga el debugger
app.config["DEBUG"] = True 

# Para Flask-PyMongo
try:
    # Fichero de configuración encontrado - lo usamos
    from .rest.config import mongodb_connection_string
    app.config["MONGO_URI"] = mongodb_connection_string
except ModuleNotFoundError:
    # Fichero de configuración no encontrado - consultamos variables de entorno
    app.config["MONGO_URI"] = os.environ["MONGO_URI"]

# Importamos la API REST
from .rest.usuario import *
from .rest.trayecto import *
from .rest.reserva import *
from .rest.datosAbiertos import *
from .rest.valoraciones import *