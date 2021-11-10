from flask import jsonify, make_response, request
from ..app import app
from ..db import usuario
from .utils import siguiente_id


@app.route("/api/v1/usuarios", methods=["GET"])
def getUsuarios():
    cursor = usuario.find()
    resultado = []
    for u in cursor:
        resultado.append(u)
    return jsonify(resultado)


@app.route("/api/v1/usuarios", methods=["POST"])
def crearUsuario():
    if request.is_json:
        datos = request.get_json()
        try:

            # Generar siguiente ID
            sig_id = siguiente_id(usuario)

            usuario.insert_one({
                "_id": sig_id,
                "nombre": str(datos["nombre"]),
                "apellidos": str(datos["apellidos"]),
                "email": str(datos["email"]),
                "telefono": str(datos["telefono"]),
                "contrasenia": str(datos["contrasenia"]),
                "link_paypal": str(datos["link_paypal"]),
                "url_foto_perfil": str(datos["url_foto_perfil"]),
                "rol": int(datos["rol"])
            })

            return jsonify(new_id=sig_id)

        except Exception:
            respuesta = jsonify(msg="Petición no válida, faltan campos o no son del tipo correcto")
            return make_response(respuesta, 400)

    else:
        respuesta = jsonify(msg="Petición no válida, se requiere JSON")
        return make_response(respuesta, 400)

@app.route("/api/v1/usuarios/<int:id>", methods=["GET"])
def getUsuario(id):
    resultado = usuario.find_one(id)
    if resultado is not None:
        return jsonify(resultado)
    else:
        respuesta = jsonify(msg="No existe ningún usuario con id = %d" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/usuarios/<int:id>", methods=["PUT"])
def updateUsuario(id):
    resultado = usuario.find_one(id)
    if resultado is not None:
        nuevos_valores = {}
        if request.is_json:
            datos = request.get_json()

            try:
                if "nombre" in datos:
                    nuevos_valores["nombre"] = str(datos["nombre"])
                if "apellidos" in datos:
                    nuevos_valores["apellidos"] = str(datos["apellidos"])
                if "email" in datos:
                    nuevos_valores["email"] = str(datos["email"])
                if "telefono" in datos:
                    nuevos_valores["telefono"] = str(datos["telefono"])
                if "contrasenia" in datos:
                    nuevos_valores["contrasenia"] = str(datos["contrasenia"])
                if "link_paypal" in datos:
                    nuevos_valores["link_paypal"] = str(datos["link_paypal"])
                if "url_foto_perfil" in datos:
                    nuevos_valores["url_foto_perfil"] = str(datos["url_foto_perfil"])
                if "rol" in datos:
                    nuevos_valores["rol"] = int(datos["rol"])

                usuario.update_one({"_id": id}, {"$set": nuevos_valores})
                return ("", 204)
            except Exception:
                respuesta = jsonify(msg="Petición no válida, hay campos que no son del tipo correcto")
                return make_response(respuesta, 400)

        else:
            respuesta = jsonify(msg="Petición no válida, se requiere JSON")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="No existe ningún usuario con id = %d" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/usuarios/<int:id>", methods=["DELETE"])
def deleteUsuario(id):
    resultado = usuario.find_one(id)
    if resultado is not None:
        usuario.delete_one({"_id": id})
        return ("", 204)
    else:
        respuesta = jsonify(msg="No existe ningún usuario con id = %d" % id)
        return make_response(respuesta, 404)
