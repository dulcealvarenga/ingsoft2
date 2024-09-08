import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';  // Importar los estilos

const Menu = ({ onLogout }) => {

    const navigate = useNavigate();

    useEffect(() => {
        // Si no está autenticado, redirige a la página de inicio de sesión
        if (!onLogout) {
        navigate('/');
        }
    }, [onLogout, navigate]);

  return (
      <main className="menu-main">
        <p>No cuenta con ningun Tablero ahora mismo</p>
        <img src="/img1.png" alt="No se encuentran Tableros" className="menu-image" />
      </main>
  );
};

export default Menu;
