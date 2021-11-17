from os import error
from flask import request, jsonify, make_response
from flask_pymongo import PyMongo, ObjectId
from ..app import app

mongo = PyMongo(app)
usuario = mongo.db.usuario
trayecto = mongo.db.trayecto

@app.route("/api/v1/trayectos", methods=["POST"])
def createTrayecto():
    if request.is_json:
        try:
            # Verificar que el conductor existe
            conductor = usuario.find_one({"_id": ObjectId(request.json["conductor"])},
                projection={"id": 1, "nombre": 1, "url_foto_perfil": 1})

            if conductor is None:
                respuesta = jsonify(msg="No existe ningún usuario con id = %s" % request.json["conductor"])
                return make_response(respuesta, 404)

            else:

                res = trayecto.insert_one({
                    "conductor": conductor,
                    "origen": request.json["origen"],
                    "destino": request.json["destino"],
                    "fecha_hora_salida": request.json["fecha_hora_salida"],
                    "duracion_estimada": request.json["duracion_estimada"],
                    "plazas": request.json["plazas"],
                    "precio": request.json["precio"],
                    "permitir_valoraciones": request.json["permitir_valoraciones"]
                })

                return jsonify(msg="Trayecto creado", new_id=str(res.inserted_id))
        except Exception:
            respuesta = jsonify(msg="Petición no válida, faltan campos o no son del tipo correcto")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="Petición no válida, se requiere JSON")
        return make_response(respuesta, 400)

@app.route("/api/v1/trayectos", methods=["GET"])
def getTrayectos():
    trayectos = []
    for doc in trayecto.find():
        doc["_id"] = str(doc["_id"])
        conductor = doc["conductor"]
        conductor["_id"] = str(conductor["_id"])
        trayectos.append(doc)
    return jsonify(trayectos)

@app.route("/api/v1/trayectos/<id>",methods=["GET"])
def getTrayecto(id):
    oid = ObjectId(id)
    resultado = trayecto.find_one({"_id": oid})
    if resultado is not None:
        resultado["_id"] = str(resultado["_id"])
        conductor = resultado["conductor"]
        conductor["_id"] = str(conductor["_id"])
        return jsonify(resultado)
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/trayectos/<id>",methods=["DELETE"])
def deleteTrayecto(id):
    oid = ObjectId(id)
    resultado = trayecto.find_one({"_id" : oid})
    if resultado is not None:
        trayecto.delete_one({"_id" : oid})
        return jsonify({"msg" : "Trayecto eliminado"})
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/trayectos/<id>",methods=["PUT"])
def updateTrayecto(id):
    oid = ObjectId(id)
    resultado = trayecto.find_one({"_id" : oid})
    if resultado is not None:
        nuevos_valores = {}
        if request.is_json:
            datos = request.get_json()
            try:

                error_id_conductor = False

                if "conductor" in datos:
                    # Verificar que el conductor existe
                    conductor = usuario.find_one({"_id": ObjectId(datos["conductor"])},
                        projection={"id": 1, "nombre": 1, "url_foto_perfil": 1})

                    if conductor is None:
                        error_id_conductor = True
                    else:
                        nuevos_valores["conductor"] = conductor

                if "origen" in datos:
                    nuevos_valores["origen"] = str(datos["origen"])
                if "destino" in datos:
                    nuevos_valores["destino"] = str(datos["destino"])
                if "fecha_hora_salida" in datos:
                    nuevos_valores["fecha_hora_salida"] = str(datos["fecha_hora_salida"])
                if "duracion_estimada" in datos:
                    nuevos_valores["duracion_estimada"] = int(datos["duracion_estimada"])
                if "plazas" in datos:
                    nuevos_valores["plazas"] = int(datos["plazas"])
                if "precio" in datos:
                    nuevos_valores["precio"] = float(datos["precio"])
                if "permitir_valoraciones" in datos:
                    nuevos_valores["permitir_valoraciones"] = bool(datos["permitir_valoraciones"])

                if not error_id_conductor:
                    trayecto.update_one({"_id" : oid}, {"$set": nuevos_valores})
                    return jsonify(msg="Trayecto actualizado")
                else:
                    respuesta = jsonify(msg="No existe ningún usuario con id = %s" % datos["conductor"])
                    return make_response(respuesta, 404)

            except Exception:
                respuesta = jsonify(msg="Petición no válida, hay campos que no son del tipo correcto")
                return make_response(respuesta, 400)
        else:
            respuesta = jsonify(msg="Petición no válida, se requiere JSON")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)
