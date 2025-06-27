import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/inicio'
import Login from './pages/login'
import RegistrarCartera from './pages/RegistrarCartera'
import ConsultarCartera from './pages/ConsultarCartera'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inicio" element={<Home />} />
      <Route path="/registrar" element={<RegistrarCartera />} />
      <Route path="/consultar" element={<ConsultarCartera />} />
    </Routes>
  )
}

export default App
