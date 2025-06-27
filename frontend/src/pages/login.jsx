import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usuario || !clave) {
            setMensaje("Por favor, completa todos los campos.");
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, clave }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setMensaje("¡Inicio de sesión exitoso!");
                navigate("/inicio");
            } else {
                setMensaje(data.message || "Usuario o contraseña incorrectos.");
            }
        } catch (error) {
            setMensaje("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="login-contenedor">
            <h2>Iniciar Sesión</h2>
            {mensaje && <div className="mensaje">{mensaje}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}
