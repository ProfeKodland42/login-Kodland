from flask import Flask, render_template, request, jsonify
import sqlite3
import requests
import time
import os
from flask import request, jsonify

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def obtener_conexion():
    conexion = sqlite3.connect(os.path.join(BASE_DIR, "leveling.db"))
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
    datos = request.get_json() or {}
    codigo = datos.get("codigo", "")
    entrada = datos.get("entrada", "")
    try:
        crear = requests.post(
            "https://api.paiza.io/runners/create",
            data={
                "source_code": codigo,
                "language": "python3",
                "input": entrada,
                "api_key": "guest"
            },
            timeout=15
        ).json()
        runner_id = crear.get("id")
        if not runner_id:
            return jsonify({"stderr": "No se pudo iniciar la ejecución. Intenta de nuevo."})
        inicio = time.time()
        while True:
            resultado = requests.get(
                "https://api.paiza.io/runners/get_details",
                params={
                    "id": runner_id,
                    "api_key": "guest"
                },
                timeout=15
            ).json()
            if resultado.get("status") == "completed":
                break
            if time.time() - inicio > 20:
                return jsonify({"stderr": "La ejecución tardó demasiado. Intenta de nuevo."})
            time.sleep(0.5)
        return jsonify(resultado)
    except requests.RequestException:
        return jsonify({"stderr": "No se pudo conectar con el servicio de ejecución."})


@app.route("/python_pro")
def python_pro():
    return render_template("python_pro.html")

@app.route("/minecraft")
def minecraft():
    return render_template("minecraft.html")


if __name__ == "__main__":
    app.run(debug=True)