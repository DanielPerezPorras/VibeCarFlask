from flask import Flask
from flask_cors import CORS



app = Flask(__name__)

# Evitar problemas con React
CORS(app)

# Asegurarnos de que se carga el debugger
app.config["DEBUG"] = True 

# Para Flask-PyMongo
app.config["MONGO_URI"] = "mongodb://localhost/iweb"

# Importamos la API REST
from .rest.usuario import *
from .rest.trayecto import *
from .rest.datosAbiertos import *