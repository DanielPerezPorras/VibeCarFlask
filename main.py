# Ejecutar con:
# python main.py runserver -h localhost -p 8080

from flask_script import Manager
from flask_cors import CORS
from app.app import app

manager = Manager(app)
CORS(app)

# Asegurarnos de que se carga el debugger
app.config["DEBUG"] = True 

if __name__ == "__main__":
	manager.run()