import os
from flask import jsonify, make_response, request
from flask_pymongo import PyMongo, ObjectId
from ..app import app

mongo = PyMongo(app)
valoraciones = mongo.db.valoraciones



# ---- ENDPOINTS -------------------------------------------------------------------------


@app.route("/api/v1/valoraciones", methods=["POST"])
def createValoracion():
    if request.is_json:
        if valoraciones.find_one({'idviaje' : ObjectId(request.json['idviaje']), 'usuarioQueValora' : ObjectId(request.json["usuarioQueValora"]), 'usuarioValorado' : ObjectId(request.json['usuarioValorado'])}) is None :
            
            try:
                res = valoraciones.insert_one({
                    "usuarioValorado": ObjectId(request.json["usuarioValorado"]),
                    "nota": str(request.json["nota"]),
                    "descripcion": str(request.json["descripcion"]),
                    "usuarioQueValora": ObjectId(request.json["usuarioQueValora"]),
                    "idviaje": ObjectId(request.json["idviaje"]),
                    "nombre": str(request.json["nombre"]),
                    "apellidos": str(request.json["apellidos"]),
                    "url_foto_perfil": str(request.json["url_foto_perfil"]),
                })
                return jsonify(msg="Valoración creada", new_id=str(res.inserted_id))

            except:
                respuesta = jsonify(msg="Petición no válida, faltan campos o no son del tipo correcto")
                return make_response(respuesta, 400)
        else :
            return jsonify(msg="El usuario ya ha valorado a esa persona en el mismo trayecto")
    else:
        respuesta = jsonify(msg="Petición no válida, se requiere JSON")
        return make_response(respuesta, 400)

@app.route("/api/v1/valoraciones/<id>", methods=["GET"])
def getValoracionesPorUsuario(id):
    media = 0
    res = []
    for doc in valoraciones.find({'usuarioValorado' : ObjectId(id)}):
        media = media + int(doc['nota'])
        res.append({
            '_id' : str(doc['_id']),
            'usuarioValorado' : str(doc['usuarioValorado']),
            'nota' : doc['nota'],
            'descripcion' : doc['descripcion'],
            'usuarioQueValora' : str(doc['usuarioQueValora']),
            'idviaje' : str(doc['idviaje']),
            "nombre": doc["nombre"],
            "apellidos": doc["apellidos"],
            "url_foto_perfil": doc["url_foto_perfil"]
        })

    if media > 0: 
        media = int(media/len(res))
    return jsonify({ 'media' : media, 'valoraciones' : res})
