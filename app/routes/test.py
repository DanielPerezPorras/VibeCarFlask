from flask import render_template
from ..app import app

@app.route("/")
def inicio():
    return render_template("index.html")

@app.errorhandler(404)
def error404(error):
    return render_template("error.html",
        codigo=404,
        descripcion="Página no encontrada"), 404