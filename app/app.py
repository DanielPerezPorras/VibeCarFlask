from flask import Flask



app = Flask(__name__)

# Importamos los manejadores del sitio web
from .routes.test import *

# Importamos la API REST
from .rest.usuario import *
from .rest.trayecto import *