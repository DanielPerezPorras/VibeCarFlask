from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS #Para evitar problemas con React
from ..app import app
from ..db import trayecto
from .utils import siguiente_id

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/vibecar'
mongo = PyMongo(app)

CORS(app)

db = mongo.db.trayecto

@app.route('/api/v1/trayectos',methods=['POST'])
def createTrayecto():
    nuevo_id = siguiente_id(trayecto)
    db.insert({
        "_id": nuevo_id,
        "id_conductor": request.json['id_conductor'],
        "origen": request.json['origen'],
        "destino": request.json['destino'],
        "fecha_hora_salida": request.json['fecha_hora_salida'],
        "duracion_estimada": request.json['duracion_estimada'],
        "plazas": request.json['plazas'],
        "precio": request.json['precio'],
        "permitir_valoraciones": request.json['permitir_valoraciones']
    })
    return jsonify(new_id=nuevo_id)

@app.route('/api/v1/trayectos',methods=['GET'])
def getTrayectos():
    trayectos = []
    for doc in db.find():
        trayectos.append({
            '_id': doc['_id'],
            "id_conductor": doc['id_conductor'],
            "origen": doc['origen'],
            "destino": doc['destino'],
            "fecha_hora_salida": doc['fecha_hora_salida'],
            "duracion_estimada": doc['duracion_estimada'],
            "plazas": doc['plazas'],
            "precio": doc['precio'],
            "permitir_valoraciones": doc['permitir_valoraciones']
        })
    return jsonify(trayectos)

@app.route('/api/v1/trayecto/<int:id>',methods=['GET'])
def getTrayecto(id):
    trayecto = db.find_one({'_id' : id})
    print(trayecto)
    return jsonify({
        '_id': trayecto['_id'],
        "id_conductor": trayecto['id_conductor'],
        "origen": trayecto['origen'],
        "destino": trayecto['destino'],
        "fecha_hora_salida": trayecto['fecha_hora_salida'],
        "duracion_estimada": trayecto['duracion_estimada'],
        "plazas": trayecto['plazas'],
        "precio": trayecto['precio'],
        "permitir_valoraciones": trayecto['permitir_valoraciones']
    })

@app.route('/api/v1/trayectos/<int:id>',methods=['DELETE'])
def deleteTrayecto(id):
    db.delete_one({'_id' : id})
    return jsonify({'msg' : 'Trayecto deleted'})

@app.route('/api/v1/trayectos/<int:id>',methods=['PUT'])
def updateTrayecto(id):
    db.update_one({
        '_id' : id
    },{'$set':{
        "id_conductor": request.json['id_conductor'],
        "origen": request.json['origen'],
        "destino": request.json['destino'],
        "fecha_hora_salida": request.json['fecha_hora_salida'],
        "duracion_estimada": request.json['duracion_estimada'],
        "plazas": request.json['plazas'],
        "precio": request.json['precio'],
        "permitir_valoraciones": request.json['permitir_valoraciones'] 
    }})
    return jsonify({'msg' : 'Trayecto Updated'})
