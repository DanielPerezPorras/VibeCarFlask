from flask import request, jsonify, make_response
from flask_pymongo import PyMongo, ObjectId
from ..app import app
from .utils import usuario_existe, escape_regex
from urllib.request import urlopen
import json, geojson

mongo = PyMongo(app)
db = mongo.db


aparcamientos_url = "https://datosabiertos.malaga.eu/recursos/aparcamientos/ocupappublicosmun/ocupappublicosmunfiware.json"
incidencias_url = "https://opendata.arcgis.com/datasets/a64659151f0a42c69a38563e9d006c6b_0.geojson"

datos_aparcamientos = []
datos_incidencias = []

@app.route("/api/v1/aparcamientos", methods=['GET'])
def getAparcamientos():

    return "HELLO WORLD"

@app.route("/api/v1/incidencias/search", methods=['GET'])
def getIncidencias():

    global datos_incidenciasprovincia


    try:
        provincia = request.args['provincia']
    except:
        provincia = None

    try:    
        localidad = request.args['localidad']
    except:
        localidad = None

    datos = []
    if (localidad is not None):
        datos = incidenciasLocalidad(localidad)

    elif(provincia is not None):
        datos = incidenciasProvincia(provincia)

    else:
        return jsonify({'msg' : 'No se han introducido parametros de búsqueda'})

    return datos

def incidenciasLocalidad(localidad):
    global datos_incidencias
    
    getAllIncidencias()

    datos = []

    for feature in datos_incidencias["features"]:
        if localidad.lower() == feature["properties"]["poblacion"].lower():
            datos.append(feature)
    
    if len(datos)==0:
        return jsonify({'msg' : 'La localidad buscada no contiene incidencias o no existe'})
    else:
        return jsonify(datos)

def incidenciasProvincia(provincia):
    global datos_incidencias
    
    getAllIncidencias()

    carreteras = []

    for lugar in datos_incidencias["features"]:
        if provincia.lower() == lugar["properties"]["provincia"].lower():
            keys_to_extract  = ("carretera", "sentido", "causa")
            a_subset = {key: lugar["properties"][key] for key in keys_to_extract}
            carreteras.append(a_subset)

    if(len(carreteras) == 0):
        return jsonify({'msg' : 'La provincia no es correcta o ninguna carretera tiene incidencias'})
    else:
        return jsonify(carreteras)

@app.route("/api/v1/incidencias", methods=['GET'])
def getAllIncidencias():
    global datos_incidencias

    if len(datos_incidencias)==0:
        response = urlopen(incidencias_url)
        data = response.read()
        json_data = geojson.loads(data)
        datos_incidencias=json_data
    
    return jsonify(datos_incidencias)