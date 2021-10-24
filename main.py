from app.app import app

# Asegurarnos de que se carga el debugger
app.config["DEBUG"] = True 

if __name__ == "__main__":
	app.run("localhost", 8080)