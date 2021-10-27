# Ejecutar con:
# python main.py runserver -h localhost -p 8080

from flask_script import Manager
from app.app import app

manager = Manager(app)

# Asegurarnos de que se carga el debugger
app.config["DEBUG"] = True 

if __name__ == "__main__":
	manager.run()