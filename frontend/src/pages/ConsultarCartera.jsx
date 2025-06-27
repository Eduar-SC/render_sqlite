import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/consultarcartera.css";

export default function ConsultarCartera() {
    const [tipo, setTipo] = useState("");
    const [tipos, setTipos] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [buscado, setBuscado] = useState(false);
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
        setBuscado(true);

        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/consultar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo }),
        });

        const data = await res.json();
        setResultados(data);
    };

    return (
        <div className="contenedor">
            <h2>Consulta de Carteras</h2>
            <form onSubmit={handleSubmit}>
                <div className="campo">
                    <label>Tipo:</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                        <option value="">Seleccione un tipo</option>
                        {tipos.map((t) => (
                            <option key={t.CODTIPCAR} value={t.CODTIPCAR}>{t.NOMTIPCAR}</option>
                        ))}
                    </select>
                </div>
                <div className="centrado">
                    <button type="submit" className="boton">Buscar</button>
                    <button className="boton" onClick={() => navigate("/inicio")}>Regresar</button>
                </div>
            </form>

            {buscado && (
                resultados.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map(r => (
                                <tr key={r.CODCAR}>
                                    <td>{r.CODCAR}</td>
                                    <td>{r.DESCRIPCAR}</td>
                                    <td>{r.NOMTIPCAR}</td>
                                    <td>{r.PRECIOCAR}</td>
                                    <td>{r.FECHACAR}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No se encontraron resultados.</p>
                )
            )}
        </div>
    );
}
