from flask import json, jsonify, make_response, request
from ..app import app
from ..db import usuario

proj_usuario = {
    "nombre": 1,
    "apellidos": 1,
    "email": 1,
    "telefono": 1,
    "link_paypal": 1,
    "url_foto_perfil": 1,
    "rol": 1
}

@app.route("/api/v1/usuarios/<int:id>", methods=["GET"])
def api_usuarios_id(id):
    resultado = usuario.find_one(id, projection=proj_usuario)
    if (resultado != None):
        return jsonify(resultado)
    else:
        respuesta = jsonify(message="No existe ningún usuario con id = %d" % id)
        return make_response(respuesta, 404)
