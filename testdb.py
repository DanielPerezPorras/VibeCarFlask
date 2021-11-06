import pymongo

_client = pymongo.MongoClient("mongodb://localhost:27017/")
_db = _client["vibecar"]


print(_db["usuario"].count_documents(filter={}))

print(_db["trayecto"].count_documents(filter={}))