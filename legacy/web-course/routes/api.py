from flask import Blueprint
from flask import jsonify
import json
import os

api_bp = Blueprint(
    "api",
    __name__
)

@api_bp.route("/api/challenge/html/1")
def obtener_reto():

    ruta = os.path.join(
        os.path.dirname(__file__),
        "..",
        "challenges",
        "html",
        "modulo1.json"
    )

    ruta = os.path.abspath(ruta)

    with open(ruta, encoding="utf-8") as archivo:

        datos = json.load(archivo)

    return jsonify(datos)