from flask import Flask, render_template, request, jsonify, url_for
import string, random, secrets, os, time, requests, sqlite3
from flask import request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)
# CORS: necesario en producción para que el frontend (Vercel) pueda llamar al
# backend (Render), que están en dominios distintos. Import seguro: si flask-cors
# no está instalado en local, no rompe el servidor de desarrollo.
try:
    from flask_cors import CORS
    CORS(app)
except ImportError:
    pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def obtener_conexion():
    conexion = sqlite3.connect(os.path.join(BASE_DIR, "leveling.db"))
    conexion.row_factory = sqlite3.Row
    return conexion

def obtener_link_estudiante(codigo):
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("""
        SELECT *
        FROM student_links
        WHERE code = ?
        AND active = 1
    """, (codigo,))
    link = cursor.fetchone()
    conexion.close()
    return link
# ======================================================
#       BORRAR ENLACES CREADOS 
# ======================================================
def limpiar_enlaces_expirados():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("""
        DELETE FROM student_links
        WHERE datetime(created_at) <= datetime('now', '-1 hour')
    """)
    conexion.commit()
    conexion.close()
# ======================================================
#           GENERAR CÓDIGO ÚNICO
# ======================================================
def generar_codigo(longitud=8):
    caracteres = string.ascii_uppercase + string.digits
    return "".join(random.choice(caracteres) for _ in range(longitud))
# ======================================================
#        GENERAR CÓDIGO PARA ESTUDIANTE
# ======================================================
def generar_codigo():
    caracteres = string.ascii_uppercase + string.digits
    while True:
        codigo = "".join(
            secrets.choice(caracteres)
            for _ in range(8)
        )
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute("""
            SELECT id
            FROM student_links
            WHERE code = ?
        """,(codigo,))
        existe = cursor.fetchone()
        conexion.close()
        if not existe:
            return codigo
# ======================================================
#       CREAR LINK DE ESTUDIANTE
# ======================================================
def crear_link_estudiante(modulo):
    codigo = generar_codigo()
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("""
        INSERT INTO student_links
        (code,module)
        VALUES
        (?,?)
    """,
    (
        codigo,
        modulo
    ))
    conexion.commit()
    conexion.close()
    return codigo

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

@app.route("/student/<codigo>")
def student(codigo):
    link = obtener_link_estudiante(codigo)
    if link is None:
        return render_template(
            "student_error.html",
            mensaje="Este enlace no existe o fue desactivado."
        )
    modulo = link["module"]
    if modulo == "python":
        return render_template(
            "python_workspace.html",
            student_mode=True
        )
    elif modulo == "python_pro":
        return render_template(
            "python_pro.html",
            student_mode=True
        )
## AGREGAR MODULOS FALTANTES DE SCRATCH, DWEB, A MI NO ME APARECEN LOS CODIGOS. 
    elif modulo == "minecraft":
        return render_template(
            "minecraft.html",
            student_mode=True
        )
## AGREGAR MODULOS FALTANTES DE SCRATCH, DWEB, A MI NO ME APARECEN LOS CODIGOS. 
    return render_template(
        "student_error.html",
        mensaje="Módulo no encontrado."
    )

# JSON para el frontend React: dado un código, devuelve el módulo del enlace.
@app.route("/student_link/<codigo>")
def student_link(codigo):
    link = obtener_link_estudiante(codigo)
    if link is None:
        return jsonify({"success": False, "message": "Enlace inválido o expirado."})
    return jsonify({"success": True, "module": link["module"]})

@app.route("/dashboard")
def dashboard():
    return render_template(
        "dashboard.html",
        student_generator=False
    )
@app.route("/students")
def students():
    return render_template(
        "dashboard.html",
        student_generator=True
    )
# ======================================================
#      GENERAR ENLACE PARA ESTUDIANTE
# ======================================================
@app.route("/generate_student_link", methods=["POST"])
def generate_student_link():
    datos = request.get_json()
    modulo = datos.get("module")
    if modulo not in [
        "python",
        "python_pro",
        "minecraft"
        ## AGREGAR MODULOS FALTANTES DE SCRATCH, DWEB, A MI NO ME APARECEN LOS CODIGOS. 
    ]:
        return jsonify({
            "success":False,
            "message":"Módulo inválido."
        })
    codigo = crear_link_estudiante(modulo)
    return jsonify({
        "success":True,
        "url":request.host_url.rstrip("/")
              + "/student/"
              + codigo
    })
# ======================================================
#           GENERAR ENLACE ESTUDIANTE
# ======================================================
# ======================================================
#           GENERAR ENLACE ESTUDIANTE
# ======================================================
@app.route("/generate_link", methods=["POST"])
def generate_link():
    datos = request.get_json()
    modulo = datos.get("module")
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    # ----------------------------------
    # Eliminar enlaces de más de 1 hora
    # ----------------------------------
    cursor.execute("""
        DELETE FROM student_links
        WHERE datetime(created_at)
        <= datetime('now','-1 hour')
    """)
    # ----------------------------------
    # Generar código único
    # ----------------------------------
    while True:
        codigo = generar_codigo()
        cursor.execute("""
            SELECT id
            FROM student_links
            WHERE code=?
        """,(codigo,))
        if cursor.fetchone() is None:
            break
    # ----------------------------------
    # Guardar
    # ----------------------------------
    cursor.execute("""
        INSERT INTO student_links
        ( code,module)
        VALUES
        (?,?)
    """,(codigo,modulo))
    conexion.commit()
    conexion.close()
    enlace = request.host_url.rstrip("/") + url_for(
        "student",
        codigo=codigo
    )
    return jsonify({
        "success":True,
        "code":codigo,
        "link":enlace
    })
if __name__ == "__main__":
    app.run(debug=True)