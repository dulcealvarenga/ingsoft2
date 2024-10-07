import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';  // Importar los estilos

const Menu = ({ onLogout }) => {

    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [boards, setBoards] = useState([]);  // Almacena los tableros creados
    const maxBoards = 3; // Máximo número de tableros permitidos
    const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
    const gradients = [
      'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', // Lila a azul
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', // Celeste a azul
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // Lila claro a rosa claro
      'linear-gradient(135deg, #70e1f5 0%, #ffd194 100%)', // Celeste a dorado suave
      'linear-gradient(135deg, #89fffd 0%, #6b9eff 100%)', // Azul suave a celeste
      'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'  // Verde suave a celeste
    ];

    useEffect(() => {
        // Si no está autenticado, redirige a la página de inicio de sesión
        if (!onLogout) {
        navigate('/');
        }
    }, [onLogout, navigate]);

    useEffect(() => {
      if (errorMessage) {
        const timer = setTimeout(() => {
          setErrorMessage(""); // Limpiar el mensaje después de 5 segundos
        }, 5000); // 5 segundos
    
        return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o si cambia el estado
      }
    }, [errorMessage]);    

    const handleCreateBoardClick = () => {
      setShowForm(true); // Mostrar el formulario
    };

    const handleCloseForm = () => {
      setShowForm(false); // Cerrar el formulario
    };

    const handleCreateBoard = (boardTitle) => {
      if (boards.length >= maxBoards) {
        setErrorMessage("Has alcanzado el número máximo de tableros permitidos."); // Establecer el mensaje de error
        return;
      }

      if (boardTitle) {
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        const newBoard = { title: boardTitle, color: randomGradient }; // Agrega el color al tablero
        setBoards([...boards, newBoard]); // Agregar el nuevo tablero al estado
        setShowForm(false); // Cerrar el formulario
      }
    };

    const handleBoardClick = (title) => {
      navigate(`/tableros/${title}`);
    };

    // Función para eliminar un tablero
    const handleDeleteBoard = (index) => {
      const newBoards = boards.filter((_, boardIndex) => boardIndex !== index); // Filtrar los tableros y eliminar el seleccionado
      setBoards(newBoards); // Actualizar el estado con los tableros restantes
      const updatedBoards = [...boards];
      updatedBoards.splice(index, 1);
      setBoards(updatedBoards);
      // Si después de eliminar no quedan tableros, se muestra el mensaje e imagen.
      if (updatedBoards.length === 0) {
        setShowForm(false);
      }
    };

  return (
    <div className="menu-container">
      <header className="menu-header">
        <div className="create-board-icon" onClick={handleCreateBoardClick}>
          <div className="tooltip">
            <img src="img6_Crea_Tablero.png" alt="Crear Tablero" className="create-icon" />
            <span className="tooltiptext">Crear un nuevo tablero</span>
          </div>
        </div>
        <h1>TaskFlow</h1>
        <div className="user-session">
          <i className="fas fa-user-circle"></i>
          <button onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>
      <main className="menu-main">
        {errorMessage && (
          <div className="error-message">
            <span>{errorMessage}</span>
            <button className="close-error" onClick={() => setErrorMessage("")}>✕</button>
          </div>
        )}
        {(boards.length === 0 && !showForm) ||  boards.length === 0 ? (
          <div>
            <img src="/img1.png" alt="No se encuentran Tableros" className="menu-image" />
            <p>No cuentas con ningún tablero ahora mismo :(</p>
          </div>
        ) : (
          <div className="board-list">
            {boards.map((board, index) => (
              <div key={index} className="board" style={{ background: board.color }} onClick={() => handleBoardClick(board.title)}>
                <p style={{ color: 'white' }}>{board.title}</p>
                <button className="delete-board-button" onClick={() => handleDeleteBoard(index)}>
                  <i className="fas fa-times"></i> {/* Usando FontAwesome para el ícono de "X" */}
                </button>
              </div>
            ))}
            <div className="board create-new" onClick={() => setShowForm(true)}>
              <span>+</span>
            </div>
          </div>
        )}
      </main>
      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <div className="form-header">
              <i className="fas fa-arrow-left" onClick={handleCloseForm}></i>
              <h2>Crear Tablero</h2>
              <span className="close-form" onClick={handleCloseForm}>&times;</span>
            </div>
            <div className="form-image-container">
              <img src="img7_Tablero_Default.png" alt="Ejemplo de Tablero" />
            </div>
            <div className="form-group">
              <label htmlFor="boardTitle">Título del Tablero</label>
              <input 
                type="text" 
                id="boardTitle" 
                name="boardTitle" 
                placeholder="Es necesario colocar un título"
                className="input-field" 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreateBoard(e.target.value);
                }}
              />
            </div>
            <button 
              className="create-board-button" 
              onClick={() => handleCreateBoard(document.getElementById('boardTitle').value)}>
              Crear Tablero
            </button>
          </div>
        </div>
      )}
      <footer className="menu-footer">
        <p>© TaskFlow - 2024</p>
      </footer>
    </div>
  );
};

export default Menu;
