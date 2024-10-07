import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import './App.css';
import Login from './Login';
import SignUp from './SignUp';
import Menu from './Menu'; // Importar el nuevo componente
import Tableros from './Tableros'; // La nueva página que mostraremos

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <main className="app-main">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/menu" /> : <Login onLogin={handleLogin} />} />
            <Route path="/menu" element={isAuthenticated ? <Menu onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/tableros/:title" element={<Tableros />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
