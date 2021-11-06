import pymongo

# Función para calcular el siguiente ID de cualquier colección
def siguiente_id(coleccion):
    cursor = coleccion.find(projection={"_id": 1}).sort("_id", pymongo.DESCENDING).limit(1)
    if coleccion.count_documents(filter={}) > 0:
        return cursor.next()["_id"] + 1
    else:
        return 1