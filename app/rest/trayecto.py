from flask import request, jsonify, make_response
from flask_pymongo import PyMongo, ObjectId
from ..app import app
from .utils import usuario_existe

mongo = PyMongo(app)
usuario = mongo.db.usuario
trayecto = mongo.db.trayecto

conductor_proj = {"id": 1, "nombre": 1, "url_foto_perfil": 1}



# ---- ENDPOINTS -------------------------------------------------------------------------



@app.route("/api/v1/trayectos", methods=["POST"])
def create_trayecto():
    if request.is_json:
        datos = request.get_json()
        try:
            # Verificar que el conductor existe
            conductor = usuario_existe(datos["conductor"], conductor_proj)

            if conductor is not None:
                res = trayecto.insert_one({
                    "conductor": conductor,
                    "origen": str(datos["origen"]),
                    "destino": str(datos["destino"]),
                    "fecha_hora_salida": str(datos["fecha_hora_salida"]),
                    "duracion_estimada": int(datos["duracion_estimada"]),
                    "plazas": int(datos["plazas"]),
                    "precio": float(datos["precio"]),
                    "permitir_valoraciones": bool(datos["permitir_valoraciones"])
                })
                return jsonify(msg="Trayecto creado", new_id=str(res.inserted_id))
            else:
                respuesta = jsonify(msg="No existe ningún usuario con id = %s" % datos["conductor"])
                return make_response(respuesta, 404)

        except Exception:
            respuesta = jsonify(msg="Petición no válida, faltan campos o no son del tipo correcto")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="Petición no válida, se requiere JSON")
        return make_response(respuesta, 400)

@app.route("/api/v1/trayectos", methods=["GET"])
def get_trayectos():
    
    cursor = None
    origen = request.args.get("origen")
    destino = request.args.get("destino")
    
    if origen is not None and destino is None:
        regex = {
            "$regex": origen.replace("\\", "\\\\"),
            "$options": "i"
            }
        cursor = trayecto.find({"$or":
        [
            {"origen": regex}
        ]})
    elif origen is None and destino is not None:
        regex = {
            "$regex": destino.replace("\\", "\\\\"),
            "$options": "i"
            }
        cursor = trayecto.find({"$or":
        [
            {"destino": regex}
        ]})
    else :
        cursor = trayecto.find()
    
    trayectos = []
    for u in cursor:
        u["_id"] = str(u["_id"])
        conductor = u["conductor"]
        conductor["_id"] = str(conductor["_id"])
        trayectos.append(u)
    return jsonify(trayectos)

@app.route("/api/v1/trayectos/<id>",methods=["GET"])
def get_trayecto(id):
    resultado = trayecto.find_one({"_id": ObjectId(id)})
    if resultado is not None:
        resultado["_id"] = str(resultado["_id"])

        # Convertir el ObjectID del conductor a string
        conductor = resultado["conductor"]
        conductor["_id"] = str(conductor["_id"])

        return jsonify(resultado)
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/trayectos/<id>",methods=["PUT"])
def update_trayecto(id):
    oid = ObjectId(id)
    resultado = trayecto.find_one({"_id" : oid})
    if resultado is not None:
        
        if request.is_json:
            datos = request.get_json()
            try:

                nuevos_valores = {}
                error_id_conductor = False

                if "conductor" in datos:
                    # Verificar que el conductor existe
                    conductor = usuario_existe(datos["conductor"], conductor_proj)

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

@app.route("/api/v1/trayectos/<id>",methods=["DELETE"])
def delete_trayecto(id):
    oid = ObjectId(id)
    resultado = trayecto.find_one({"_id" : oid})
    if resultado is not None:
        trayecto.delete_one({"_id" : oid})
        return jsonify({"msg" : "Trayecto eliminado"})
    else:
        respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/trayectosUsuario/<id>",methods=["GET"])
def trayectos_Usuario(id):
    trayectos = []
    cursor = trayecto.find({"conductor._id":ObjectId(id)})
    for u in cursor:
        u["_id"] = str(u["_id"])
        conductor = u["conductor"]
        conductor["_id"] = str(conductor["_id"])
        trayectos.append(u)

    return jsonify(trayectos)
    
    
# ----------------------------------------------------------------------------------------



# Actualiza los datos del conductor 
def actualizar_conductor(oid_usuario):
    datos_conductor = usuario.find_one({"_id": oid_usuario}, conductor_proj)
    trayecto.update_many(
        {"conductor._id": oid_usuario},
        {"$set": {"conductor": datos_conductor}}
        )