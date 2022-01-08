from flask import Flask
from flask_cors import CORS
from .rest.config import mongodb_connection_string


app = Flask(__name__)

# Evitar problemas con React
CORS(app)

# Asegurarnos de que se carga el debugger
app.config["DEBUG"] = True 

# Para Flask-PyMongo
app.config["MONGO_URI"] = mongodb_connection_string + "/vibecar"

# Importamos la API REST
from .rest.usuario import *
from .rest.trayecto import *
from .rest.reserva import *
from .rest.datosAbiertos import *