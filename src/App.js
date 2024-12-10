import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importa Routes y Route desde react-router-dom
import HotelManager from './components/HotelManager';
import RoomManager from './components/RoomManager';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Menú de navegación */}
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/hotels">Gestionar Hoteles</Link>
            </li>
            <li>
              <Link to="/rooms">Gestionar Tipos de Habitaciones</Link>
            </li>
            <li>
              <Link to="/room-management">Gestionar Habitaciones</Link>
            </li>
          </ul>
        </nav>

        {/* Contenido dinámico según la ruta */}
        <Routes>
          <Route path="/hotels" element={<HotelManager />} />
          <Route path="/rooms" element={<RoomManager />} />
          <Route path="/" element={<h1>Bienvenido al sistema de gestión</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
