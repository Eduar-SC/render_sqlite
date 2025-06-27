
import React from "react";
import { Link } from "react-router-dom";
import "../styles/inicio.css";

export default function Home() {
    return (
        <div className="container">
            <h1>Menú Principal</h1>
            <nav>
                <Link to="/registrar"><button>Registrar</button></Link>
                <Link to="/consultar"><button>Consultar</button></Link>
            </nav>
        </div>
    );
}
