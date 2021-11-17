from flask import request, jsonify, make_response
from flask_pymongo import PyMongo, ObjectId
from ..app import app
from ..db import trayecto

mongo = PyMongo(app)
db = mongo.db.trayecto

@app.route("/api/v1/trayectos", methods=["POST"])
def createTrayecto():
    if request.is_json:
        try:
            id = db.insert({
                "conductor": request.json["conductor"],
                "origen": request.json["origen"],
                "destino": request.json["destino"],
                "fecha_hora_salida": request.json["fecha_hora_salida"],
                "duracion_estimada": request.json["duracion_estimada"],
                "plazas": request.json["plazas"],
                "precio": request.json["precio"],
                "permitir_valoraciones": request.json["permitir_valoraciones"]
            })
            return jsonify(str(ObjectId(id)))
        except Exception:
            respuesta = jsonify(msg="Petición no válida, faltan campos o no son del tipo correcto")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="Petición no válida, se requiere JSON")
        return make_response(respuesta, 400)

@app.route("/api/v1/trayectos", methods=["GET"])
def getTrayectos():
    trayectos = []
    for doc in db.find():
        trayectos.append({
            "_id": str(ObjectId(doc['_id'])),
            "conductor": doc["conductor"],
            "origen": doc["origen"],
            "destino": doc["destino"],
            "fecha_hora_salida": doc["fecha_hora_salida"],
            "duracion_estimada": doc["duracion_estimada"],
            "plazas": doc["plazas"],
            "precio": doc["precio"],
            "permitir_valoraciones": doc["permitir_valoraciones"]
        })
    return jsonify(trayectos)

@app.route("/api/v1/trayectos/<id>",methods=["GET"])
def getTrayecto(id):
    trayecto = db.find_one({'_id': ObjectId(id)})
    if trayecto is not None:
        return jsonify({
            "_id": str(ObjectId(trayecto['_id'])),
            "conductor": trayecto["conductor"],
            "origen": trayecto["origen"],
            "destino": trayecto["destino"],
            "fecha_hora_salida": trayecto["fecha_hora_salida"],
            "duracion_estimada": trayecto["duracion_estimada"],
            "plazas": trayecto["plazas"],
            "precio": trayecto["precio"],
            "permitir_valoraciones": trayecto["permitir_valoraciones"]
        })
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/trayectos/<id>",methods=["DELETE"])
def deleteTrayecto(id):
    trayecto = db.find_one({'_id' : ObjectId(id)})
    if trayecto is not None:
        db.delete_one({'_id' : ObjectId(id)})
        return jsonify({'msg' : 'User deleted'})
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/trayectos/<id>",methods=["PUT"])
def updateTrayecto(id):
    trayecto = db.find_one({"_id" : ObjectId(id)})
    if trayecto is not None:
        nuevos_valores = {}
        if request.is_json:
            datos = request.get_json()
            try:

                if "conductor" in datos:
                    nuevos_valores["conductor"] = datos["conductor"]
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

                db.update_one({'_id' : ObjectId(id)},{"$set": nuevos_valores})
                return jsonify({'msg' : 'User Updated'})

            except Exception:
                respuesta = jsonify(msg="Petición no válida, hay campos que no son del tipo correcto")
                return make_response(respuesta, 400)
        else:
            respuesta = jsonify(msg="Petición no válida, se requiere JSON")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)
