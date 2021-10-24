from flask import Flask, render_template



app = Flask(__name__)

@app.route("/")
def inicio():
    return render_template("index.html")

@app.errorhandler(404)
def error404(error):
    return render_template("error.html",
        codigo=404,
        descripcion="Página no encontrada"), 404