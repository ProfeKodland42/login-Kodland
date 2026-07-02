from flask import Flask, render_template, request, jsonify
import sqlite3
import requests
import time
from flask import request, jsonify

app = Flask(__name__)

def obtener_conexion():
    conexion = sqlite3.connect("leveling.db")
    conexion.row_factory = sqlite3.Row
    return conexion

@app.route("/")
def inicio():
    return render_template("login.html")

@app.route("/login", methods=["POST"])
def login():
    datos = request.get_json()
    usuario = datos.get("usuario")
    password = datos.get("password")
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute(
        """
        SELECT *
        FROM usuarios
        WHERE usuario = ?
        """,
        (usuario,)
    )
    usuario_db = cursor.fetchone()
    conexion.close()
    if usuario_db is None:
        return jsonify({
            "success": False,
            "mensaje": "Usuario no encontrado"
        })
    if usuario_db["password"] != password:
        return jsonify({
            "success": False,
            "mensaje": "Contraseña incorrecta"
        })
    return jsonify({
        "success": True,
        "rol": usuario_db["rol"],
        "nombre": usuario_db["nombre_completo"]
    })
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/python")
def python_workspace():
    return render_template("python_workspace.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/ejecutar", methods=["POST"])
def ejecutar():
    datos = request.get_json()
    codigo = datos.get("codigo", "")
    entrada = datos.get("entrada", "")
    crear = requests.post(
    "https://api.paiza.io/runners/create",
    data={
        "source_code": codigo,
        "language": "python3",
        "input": entrada,
        "api_key": "guest"
    }
).json()
    runner_id = crear["id"]
    while True:
        resultado = requests.get(
            "https://api.paiza.io/runners/get_details",
            params={
                "id": runner_id,
                "api_key": "guest"
            }
        ).json()
        if resultado["status"] == "completed":
            break
        time.sleep(0.5)
    return jsonify(resultado)
if __name__ == "__main__":
    app.run(debug=True)