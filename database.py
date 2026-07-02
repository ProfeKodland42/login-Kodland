import sqlite3

DB="leveling.db"

def login(usuario,password):

    conexion=sqlite3.connect(DB)
    cursor=conexion.cursor()
    cursor.execute("""
    SELECT nombre_completo,rol
    FROM usuarios
    WHERE usuario=? AND password=?
    """,(usuario,password))
    datos=cursor.fetchone()
    conexion.close()
    return datos