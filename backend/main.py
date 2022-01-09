# Ejecutar con:
# python main.py runserver -h localhost -p 8080

from app.app import app

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=8080)