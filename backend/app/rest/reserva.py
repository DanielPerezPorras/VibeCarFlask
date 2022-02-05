from flask import request, jsonify, make_response
from flask_pymongo import PyMongo, ObjectId
from ..app import app
from .utils import trayecto_existe, escape_regex, usuario_existe


mongo = PyMongo(app)
usuariobd = mongo.db.usuario
trayectobd = mongo.db.trayecto
reserva = mongo.db.reserva

trayecto_proj = {"id": 1, "origen": 1, "destino": 1}
usuario_proj = {"id": 1, "nombre": 1, "url_foto_perfil": 1}


# ---- ENDPOINTS -------------------------------------------------------------------------

@app.route("/api/v1/reservas", methods=["POST"])
def create_reserva():
    if request.is_json:
        datos = request.get_json()

        try:
         # Verificar que el trayecto y el usuario existen
           
            trayecto = trayecto_existe(datos["trayecto"], trayecto_proj)
            cliente = usuario_existe(datos["cliente"],usuario_proj)

            if trayecto is not None and cliente is not None:
                if (str(datos["estado"])) == ("disponible" or "cerrado"):
                    res = reserva.insert_one({
                        "trayecto": trayecto,
                        "cliente": cliente,
                        "fecha_hora_salida": str(datos["fecha_hora_salida"]),
                        "pasajeros": int(datos["pasajeros"]),
                        "estado": str(datos["estado"]),
                    })
                    return jsonify(msg="Reserva creada", new_id=str(res.inserted_id))
                else:
                   respuesta = jsonify(msg="Petición no válida, no hay un estado válido")
                   return make_response(respuesta, 400)
            elif trayecto is None:
                respuesta = jsonify(msg="No existe ningun trayecto con id = %s" % datos["trayecto"])
                return make_response(respuesta, 404)
            else:
                respuesta = jsonify(msg="No existe ningun cliente con id = %s" % datos["cliente"])
                return make_response(respuesta, 404)

        except Exception:
            respuesta = jsonify(msg="Petición no válida, faltan campos o no son del tipo correcto")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="Petición no válida, faltan campos o no son del tipo correcto")
        return make_response(respuesta,400)


@app.route("/api/v1/reservas", methods=["GET"])
def get_reservas():
    
    estado = request.args.get("estado")
    pasajeros = request.args.get("pasajeros")
    trayecto = request.args.get("trayecto")

    condiciones = []
    selector = {"$and": condiciones}

    if estado is not None:
        regex = {
            "$regex": escape_regex(estado),
            "$options": "i"
            }
        condiciones.append({"estado": regex})

    if pasajeros is not None:
        regex = {
            "$regex": escape_regex(pasajeros),
            "$options": "i"
            }
        condiciones.append({"pasajeros": regex})
        
    if trayecto is not None:
        regex = {
            "$regex": escape_regex(trayecto),
            "$options": "i"
            }
        condiciones.append({"trayecto._id": ObjectId(trayecto)})

    if len(condiciones) == 0:
        selector = {}
    
    cursor = reserva.find(selector)
    reservas = []
    for u in cursor:
        u["_id"] = str(u["_id"])
        trayecto = u["trayecto"]
        trayecto["_id"] = str(trayecto["_id"])
        cliente = u["cliente"]
        cliente["_id"]=str(cliente["_id"])
        reservas.append(u)
    return jsonify(reservas)

@app.route("/api/v1/reservas/<id>",methods=["GET"])
def get_reserva(id):
    resultado = reserva.find_one({"_id": ObjectId(id)})
    if resultado is not None:
        resultado["_id"] = str(resultado["_id"])

        trayecto = resultado["trayecto"]
        trayecto["_id"] = str(trayecto["_id"])

        cliente = resultado["cliente"]
        cliente["_id"] = str(cliente["_id"])

        return jsonify(resultado)
    else:
        respuesta = jsonify(msg="No existe ninguna reserva con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/reservas/<id>",methods=["PUT"])
def update_reserva(id):
    oid = ObjectId(id)
    resultado = reserva.find_one({"_id" : oid})
    
    if resultado is not None:
        if request.is_json:
            datos = request.get_json()
            try:

                nuevos_valores = {}
                error_id_trayecto = False
                error_id_cliente = False

                if "trayecto" in datos:
                    # Verificar que el trayecto existe
                    trayecto = trayecto_existe(datos["trayecto"], trayecto_proj)

                    if trayecto is None:
                        error_id_trayecto = True
                    else:
                        nuevos_valores["trayecto"] = trayecto

                if "cliente" in datos:
                    #Verificar que el cliente existe
                    cliente = usuario_existe(datos["cliente"],usuario_proj)
                    
                    if cliente is None:
                        error_id_cliente = True
                    else:
                        nuevos_valores["cliente"] = cliente

               

                if "fecha_hora_salida" in datos:
                    nuevos_valores["fecha_hora_salida"] = str(datos["fecha_hora_salida"])
                if "pasajeros" in datos:
                    nuevos_valores["pasajeros"] = int(datos["pasajeros"])
                if "estado" in datos:
                    nuevos_valores["estado"] = str(datos["estado"])



                if not error_id_trayecto and not error_id_cliente:
                    reserva.update_one({"_id" : oid}, {"$set": nuevos_valores})
                    return jsonify(msg="Reserva actualizada")
                elif error_id_trayecto:
                    respuesta = jsonify(msg="No existe ningún trayecto con id = %s" % datos["trayecto"])
                    return make_response(respuesta, 404)
                else:
                    respuesta = jsonify(msg="No existe ningún cliente con id = %s" % datos["cliente"])
                    return make_response(respuesta, 404)

            except Exception:
                respuesta = jsonify(msg="Petición no válida, hay campos que no son del tipo correcto")
                return make_response(respuesta, 400)
        else:
            respuesta = jsonify(msg="Petición no válida, se requiere JSON")
            return make_response(respuesta, 400)
    else:
        respuesta = jsonify(msg="No existe ninguna reserva con id = %s" % id)
        return make_response(respuesta, 404)


@app.route("/api/v1/reservas/<id>",methods=["DELETE"])
def delete_reserva(id):
    oid = ObjectId(id)
    resultado = reserva.find_one({"_id" : oid})
    if resultado is not None:
        reserva.delete_one({"_id" : oid})
        return jsonify({"msg" : "Reserva eliminada"})
    else:
        respuesta = jsonify(msg="No existe ninguna reserva con id = %s" % id)
        return make_response(respuesta, 404)

@app.route("/api/v1/reservasTrayecto/<id>",methods=["GET"])
def reservas_trayecto(id):
    reservas = []
    cursor = reserva.find({"trayecto._id":ObjectId(id)})
    for u in cursor:
        u["_id"] = str(u["_id"])
        trayecto = u["trayecto"]
        trayecto["_id"] = str(trayecto["_id"])
        cliente = u["cliente"]
        cliente["_id"] = str(cliente["_id"])
        reservas.append(u)

    return jsonify(reservas)

@app.route("/api/v1/reservasCliente/<id>",methods=["GET"])
def reservas_cliente(id):
    reservas = []
    cursor = reserva.find({"cliente._id":ObjectId(id)})
    for u in cursor:
        u["_id"] = str(u["_id"])
        cliente = u["cliente"]
        cliente["_id"] = str(cliente["_id"])
        trayecto = u["trayecto"]
        trayecto["_id"] = str(trayecto["_id"])
        reservas.append(u)

    return jsonify(reservas)


# ----------------------------------------------------------------------------------------

# Actualiza los datos del trayecto 
def actualizar_trayecto(oid_trayecto):
    datos_trayecto = trayectobd.find_one({"_id": oid_trayecto}, trayecto_proj)
    reserva.update_many(
        {"trayecto._id": oid_trayecto},
        {"$set": {"trayecto": datos_trayecto}}
        )

# Actualiza los datos del cliente
def actualizar_cliente(oid_cliente):
    datos_cliente = usuariobd.find_one({"_id": oid_cliente}, usuario_proj)
    reserva.update_many(
        {"cliente._id": oid_cliente},
        {"$set": {"cliente": datos_cliente}}
        )