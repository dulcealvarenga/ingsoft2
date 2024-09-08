import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';

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
        <header className="app-header">
          <h1>TaskFlow</h1>
          {isAuthenticated && (
            <button onClick={handleLogout}>Cerrar sesión</button>
          )}
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <p>Este es el contenido principal de la aplicación.</p>
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
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
