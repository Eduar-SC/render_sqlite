from flask import Flask, request, redirect, session, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)
app.secret_key = 'secreto_seguro'

DATABASE = 'basedatos.db'

def obtener_conexion():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def inicializar_bd():
    if os.path.exists(DATABASE):
        return
    conn = obtener_conexion()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE USUARIOS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            clave TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE TIPOCARTERA (
            CODTIPCAR INTEGER PRIMARY KEY AUTOINCREMENT,
            NOMTIPCAR TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE CARTERA (
            CODCAR INTEGER PRIMARY KEY AUTOINCREMENT,
            DESCRIPCAR TEXT NOT NULL,
            PRECIOCAR TEXT NOT NULL,
            FECHACAR TEXT NOT NULL,
            CODTIPCAR INTEGER NOT NULL,
            FOREIGN KEY (CODTIPCAR) REFERENCES TIPOCARTERA(CODTIPCAR)
        )
    ''')

    cursor.execute("INSERT INTO USUARIOS (usuario, clave) VALUES (?, ?)", ('admin', '123'))
    tipos = [('ANDINO',), ('TRADICIONAL',), ('SELVATICO',), ('COSTEÑO',)]
    cursor.executemany("INSERT INTO TIPOCARTERA (NOMTIPCAR) VALUES (?)", tipos)

    conn.commit()
    conn.close()

inicializar_bd()

@app.route('/')
def home():
    return jsonify({"message": "API del backend en Flask funcionando."})

@app.route('/login', methods=['POST'])
def api_login():
    data = request.get_json()
    usuario = data.get('usuario')
    clave = data.get('clave')

    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM USUARIOS WHERE usuario = ? AND clave = ?", (usuario, clave))
    user = cursor.fetchone()
    conn.close()

    if user:
        session['usuario'] = usuario
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401

@app.route('/tipos-cartera', methods=['GET'])
def obtener_tipos_cartera():
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("SELECT CODTIPCAR, NOMTIPCAR FROM TIPOCARTERA")
    tipos = cursor.fetchall()
    conn.close()
    return jsonify([dict(t) for t in tipos])

@app.route('/registrar', methods=['POST'])
def registrar_cartera():
    data = request.get_json()
    descripcion = data.get('descripcion')
    tipo = data.get('tipo')
    precio = data.get('precio')
    fecha = data.get('fecha')

    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO CARTERA (DESCRIPCAR, PRECIOCAR, FECHACAR, CODTIPCAR) VALUES (?, ?, ?, ?)",
        (descripcion, precio, fecha, tipo)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "¡Cartera registrada correctamente!"})

@app.route('/consultar', methods=['POST'])
def consultar_carteras():
    data = request.get_json()
    tipo = data.get('tipo')

    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT C.CODCAR, C.DESCRIPCAR, T.NOMTIPCAR, C.PRECIOCAR, C.FECHACAR 
        FROM CARTERA C 
        JOIN TIPOCARTERA T ON C.CODTIPCAR = T.CODTIPCAR 
        WHERE C.CODTIPCAR = ?
    ''', (tipo,))
    resultados = cursor.fetchall()
    conn.close()

    return jsonify([dict(r) for r in resultados])

if __name__ == '__main__':
    app.run(debug=True)
