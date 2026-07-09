import sqlite3
import os
# ======================================================
#           TUTOR'S LEVELING DATABASE
# ======================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
conexion = sqlite3.connect(
    os.path.join(BASE_DIR, "leveling.db")
)
cursor = conexion.cursor()
# ======================================================
#                   USUARIOS
# ======================================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo TEXT NOT NULL,
    usuario TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT DEFAULT 'tutor',
    ultimo_login TIMESTAMP
)
""")
# ======================================================
#          ENLACES PARA ESTUDIANTES
# ======================================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS student_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    module TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    views INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1
)
""")
# ======================================================
#               ADMINISTRADOR
# ======================================================
cursor.execute("""
INSERT OR IGNORE INTO usuarios
(nombre_completo, usuario, password, rol)
VALUES
('Administrador','admin','Admin2026','admin')
""")
# ======================================================
#                  TUTORES
# ======================================================
usuarios = [
    ("Jonathan Camilo Burbano Pazos","jburbano","Jonathan123","tutor"),
    ("Myle Urdaneta Cordoba","murdaneta","Myle123","tutor"),
    ("Ehimar Andres Vargas Malaver","evargas","Ehimar123","tutor"),
    ("José Francisco Cabarcas Torrenegra","jcabarcas","Jose123","tutor"),
    ("Camilo Builes","cbuiles","Camilo123","tutor"),
    ("Johanna Rios","jrios","Johanna123","tutor"),
    ("Dainer Quiroz","dquiroz","Dainer123","tutor"),
    ("Lizeth Stefania Bolaños Narvaez","lbolanos","Lizeth123","tutor"),
    ("Lorena Sánchez","lsanchez","Lorena123","tutor"),
    ("Eden","eden","Eden123","tutor"),
    ("Santiago Espinosa Otálvaro","sespinosa","Santiago123","tutor"),
    ("Nicole Ospina","nospina","Nicole123","tutor"),
    ("Martina Curiotto","mcuriotto","Martina123","tutor"),
    ("Cesar Navarro Acosta","cnavarro","Cesar123","tutor"),
    ("Marcela Pinzón","mpinzon","Marcela123","tutor"),
    ("Maryuris","maryuris","Maryuris123","tutor"),
    ("Juan Valderrama","jvalderrama","Juan123","tutor"),
    ("Sarah Saltaren","ssaltaren","Sarah123","tutor"),
    ("Angela Jaramillo","ajaramillo","Angela123","tutor"),
    ("Felipe Garcés","fgarces","Felipe123","tutor"),
    ("Aurora da Cunha","adacunha","Aurora123","tutor"),
    ("Nicolas Arturo Corzo Daza","ncorzo","Nicolas123","tutor"),
    ("Mauricio Quiroga","mquiroga","Mauricio123","tutor"),
    ("Geraldine Barrantes Marín","gbarrantes","Geraldine123","tutor"),
    ("Nicolás Rey León","nrey","Nicolas123","tutor"),
    ("Camila Caicedo","ccaicedo","Camila123","tutor"),
    ("Jose Alejandro Carrillo Téllez","jcarrillo","Jose123","tutor"),
    ("Alarcón Lina","lalarcon","Lina123","tutor"),
    ("Robin Rivero","rrivero","Robin123","tutor"),
    ("Carlos Vargas","cvargas","Carlos123","tutor"),
    ("Rosa Rios","rrios","Rosa123","tutor"),
    ("Johmar Andres Martinez Campo","jmartinez","Johmar123","tutor"),
    ("Alejandro Ceballos","aceballos","Alejandro123","tutor"),
    ("Karol Torres","ktorres","Karol123","tutor"),
    ("Aldo Larios","alarios","Aldo123","tutor"),
    ("Camila Isaza","cisaza","Camila123","tutor"),
    ("Camilo Mahecha","cmahecha","Camilo123","tutor"),
    ("Alejandro López Chacón","alopez","Alejandro123","tutor"),
    ("Alejandra Amaya","aamaya","Alejandra123","tutor"),
    ("Leila Casenaves","lcasenaves","Leila123","tutor"),
    ("Alvaro Lozano","alozano","Alvaro123","tutor"),
    ("Danilza Hurtado","dhurtado","Danilza123","tutor"),
    ("Carlos Arrieta","carrieta","Carlos123","tutor"),
    ("David Rodriguez","drodriguez","David123","tutor"),
    ("Keren Saray Guzman Yepes","kguzman","Keren123","tutor"),
    ("Yuliana Ituyan","yituyan","Yuliana123","tutor"),
    ("Julian Rivera","jrivera","Julian123","tutor"),
    ("Michell Alvarado","malvarado","Michell123","tutor"),
    ("Victor Hugo Lagos Pantoja","vlagos","Victor123","tutor")
]
cursor.executemany("""
INSERT OR IGNORE INTO usuarios
(nombre_completo, usuario, password, rol)
VALUES (?, ?, ?, ?)
""", usuarios)
conexion.commit()
conexion.close()
print("======================================")
print(" Tutor's Leveling")
print("======================================")
print("- Base de datos creada correctamente.")
print("- Usuarios cargados.")
print("- Tabla 'student_links' creada.")
print("======================================")