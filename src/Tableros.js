import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el parámetro de la URL
import './Tableros.css'; 

const Tableros = () => {
  const { title } = useParams(); // Captura el parámetro 'title' de la URL
  const [lists, setLists] = useState([]); // Estado para almacenar las listas
  const [showOptionsIndex, setShowOptionsIndex] = useState(null); // Controlar cuál menú está visible
  const [listName, setListName] = useState(""); // Para capturar el nombre de la nueva lista
  const [showInput, setShowInput] = useState(false); // Controlar cuándo mostrar el input

  // Función para agregar una nueva lista con nombre personalizado
  const handleAddList = () => {
    if (listName.trim() !== "") {
      const newList = { name: listName }; // Usar el nombre personalizado
      setLists([...lists, newList]); // Agregar la nueva lista
      setListName(""); // Limpiar el campo de entrada
      setShowInput(false); // Ocultar el campo de entrada después de agregar
    } else {
      alert("El nombre de la lista no puede estar vacío");
    }
  };

  const handleDeleteList = (index) => {
    const updatedLists = lists.filter((_, i) => i !== index); // Eliminar la lista seleccionada
    setLists(updatedLists); // Actualizar el estado de las listas
    setShowOptionsIndex(null); // Cerrar el menú desplegable
  };

  // Función para mostrar/ocultar el menú de opciones
  const toggleOptions = (index) => {
    setShowOptionsIndex(index === showOptionsIndex ? null : index); // Mostrar u ocultar el menú de la lista seleccionada
  };

  return (
    <div className="tableros-container">
      <div className="tablero-solapa">
          {title} {/* Muestra el título del tablero */}
        </div>
      <main className="tableros-main">
      <div className="list-container">
          {lists.map((list, index) => (
            <div key={index} className="list">
              <h3>{list.name}</h3>
              <div className="options-menu-container">
                <button className="options-button" onClick={() => toggleOptions(index)}>
                  <i className="fas fa-ellipsis-h"></i> {/* Ícono de tres puntitos */}
                </button>
                {showOptionsIndex === index && (
                  <div className="options-menu">
                    <button onClick={() => handleDeleteList(index)}>Eliminar</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Mostrar el campo de entrada para añadir una lista si está habilitado */}
        {showInput ? (
          <div className="add-list-form">
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Ingrese el nombre de la lista..."
            />
            <div className="add-list-buttons">
              <button onClick={handleAddList}>Añadir Lista</button>
              <button onClick={() => setShowInput(false)}>X</button>
            </div>
          </div>
        ) : (
          <div className="add-list">
              <button onClick={() => setShowInput(true)}>
                <i className="fas fa-plus"></i> Añade otra lista
              </button>
          </div>
        )}
      </main>
      <footer className="tableros-footer">
        <p>© TaskFlow - 2024</p>
      </footer>
    </div>
  );
};

export default Tableros; 