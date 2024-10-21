import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Importar los estilos


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Crear instancia de useNavigate

  const validUsername = 'is2';
  const validPassword = '1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Usuario:', username, 'Contraseña:', password);
    if (username === validUsername && password === validPassword) {
      onLogin();  // Llama a la función que cambia el estado de autenticación en App.js
      navigate('/workspace'); // Redirigir al usuario a la página de Workspace
    } else {
      setErrorMessage('Usuario o contraseña incorrectos', errorMessage);
    }
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: '803348551466-oboa8q0363scjbhe6rp16nakdo999mar.apps.googleusercontent.com',
      callback: handleGoogleSignIn,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-sign-in-button'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  const handleGoogleSignIn = (response) => {
    console.log('Google Sign-In response:', response);
    // Maneja la respuesta de Google Sign-In aquí
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <h1 className="title">TaskFlow</h1>
        <img src="/img2cohete.png" alt="Cohete" className="rocket-image" />
      </div>
      <div className="right-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesion</h2>
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
        <div className="signup-link">
          <p>¿No tienes una cuenta? <a href="/signup">Regístrate aquí</a></p>
        </div>
        <div id="google-sign-in-button" className="google-sso"></div>
      </div>
    </div>
  );
};

export default Login;
