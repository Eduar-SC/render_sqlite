import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registrarcartera.css";

export default function RegistrarCartera() {
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("");
    const [precio, setPrecio] = useState("");
    const [fecha, setFecha] = useState("");
    const [tipos, setTipos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarTipos = async () => {
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/tipos-cartera`);
            const data = await res.json();
            setTipos(data);
        };
        cargarTipos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descripcion || !tipo || !precio || !fecha) {
            setMensaje("Por favor, completa todos los campos.");
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/registrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion, tipo, precio, fecha }),
        });

        const data = await res.json();
        setMensaje(data.message || "Registrado");
        setDescripcion(""); setTipo(""); setPrecio(""); setFecha("");
    };

    return (
        <div className="formulario">
            <h2>Registrar Cartera</h2>
            {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <div className="campo">
                    <label>Descripción:</label>
                    <input value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                </div>
                <div className="campo">
                    <label>Tipo:</label>
                    <select value={tipo} onChange={e => setTipo(e.target.value)}>
                        <option value="">Seleccione un tipo</option>
                        {tipos.map(t => (
                            <option key={t.CODTIPCAR} value={t.CODTIPCAR}>{t.NOMTIPCAR}</option>
                        ))}
                    </select>
                </div>
                <div className="campo">
                    <label>Precio:</label>
                    <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} />
                </div>
                <div className="campo">
                    <label>Fecha:</label>
                    <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
                </div>
                <div className="botones">
                    <button type="submit">Grabar</button>
                    <button type="button" onClick={() => navigate("/inicio")}>Regresar</button>
                </div>
            </form>
        </div>
    );
}
