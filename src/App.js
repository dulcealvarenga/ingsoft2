import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';
import Menu from './Menu'; // Importar el nuevo componente

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
      <header className={`app-header ${isAuthenticated ? 'left-aligned' : 'centered'}`}>
          {!isAuthenticated && (
            <div className="header-left">
              <h1>TaskFlow</h1>
            </div>
          )}
        </header>
        <header className={`app-header.menu`}>
          {isAuthenticated && (
            <div className="user-session">
              <h1>TaskFlow</h1>
              <i className="fas fa-user-circle"></i>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/menu" /> : <Login onLogin={handleLogin} />} />
            <Route path="/menu" element={isAuthenticated ? <Menu onLogout={handleLogout} /> : <Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2024 TaskFlow</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
