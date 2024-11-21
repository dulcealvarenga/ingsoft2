import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Tableros.css';
import Modal from './Modal';

const Tableros = () => {
  const { title } = useParams();
  const [lists, setLists] = useState([]);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);
  const [listName, setListName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [cardName, setCardName] = useState("");
  const [showCardInputIndex, setShowCardInputIndex] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [modifiedDate, setModifiedDate] = useState(new Date());
  const [subtareas, setSubtareas] = useState([]);
  const [newSubtarea, setNewSubtarea] = useState('');
  const [showSubtareaInput, setShowSubtareaInput] = useState(false);
  const [visibility, setVisibility] = useState('Pendiente');
  const [etiqueta, setEtiqueta] = useState('');
  const [showSubtareaModal, setShowSubtareaModal] = useState(false);
  const [selectedSubtarea, setSelectedSubtarea] = useState(null);
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null); // Estado para la tarjeta arrastrada 
  const [personaAsignada, setPersonaAsignada] = useState(''); // Estado para la persona asignada
  const [warningMessage, setWarningMessage] = useState(""); // Estado para el mensaje de advertencia
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const maxWords = 50;
  const navigate = useNavigate();

  const handleDescripcionChange = (e) => {
    const words = e.target.value.split(/\s+/);
    if (words.length <= maxWords) {
      setDescripcion(e.target.value);
    }
  };

  const handlePersonaAsignadaChange = (event) => {
    setPersonaAsignada(event.target.value); // Actualiza la persona asignada
  };

  const toggleSubtareaInput = () => {
    setShowSubtareaInput(!showSubtareaInput);
  };

  const [workspace, setWorkspace] = useState({
    nombre: "Arqui Web",
    usuarios: [
      { nombre: "AGONZALEZ", avatar: null }, // Avatar puede ser null para usar iniciales
      { nombre: "DALVAREM", avatar: null },
      // Agrega más usuarios aquí
    ]
  });

  const getInitials = (nombre) => {
    return nombre
        .split(" ")
        .map((n) => n[0])
        .join("");
  };

  useEffect(() => {
    const textarea = document.querySelector('.descripcion-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [descripcion]);

  const sumarDias = (fecha, dias) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    return nuevaFecha;
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleGoToMenu = () => {
    navigate('/menu');
  };

  const handleEditListName = (index) => {
    setEditingListIndex(index);
    setIsEditingListName(true);
    setListName(lists[index].name);
  };

  const handleSaveListName = (index) => {
    const updatedLists = [...lists];
    updatedLists[index].name = listName;
    setLists(updatedLists);
    setIsEditingListName(false);
    setEditingListIndex(null);
  };

  const handleAddSubtarea = () => {
    if (newSubtarea.trim() !== '' && selectedCard) {
      const updatedLists = [...lists];
      const { listIndex, cardIndex } = selectedCard;

      if (updatedLists[listIndex] && updatedLists[listIndex].cards[cardIndex]) {
        updatedLists[listIndex].cards[cardIndex].subtareas.push({
          text: newSubtarea,
          estado: 'En Curso'
        });
        setLists(updatedLists);
        setSubtareas([...updatedLists[listIndex].cards[cardIndex].subtareas]);
        setNewSubtarea('');
      } else {
        console.error('La tarjeta seleccionada no es válida.');
      }
    }
  };

  const handleAddList = () => {
    if (listName.trim() !== "") {
      const newList = { name: listName, cards: [] };
      setLists([...lists, newList]);
      setListName("");
      setShowInput(false);
    } else {
      alert("El nombre de la lista no puede estar vacío");
    }
  };

  const handleDeleteList = (index) => {
    const updatedLists = lists.filter((_, i) => i !== index);
    setLists(updatedLists);
    setShowOptionsIndex(null);
  };

  const toggleOptions = (index) => {
    setShowOptionsIndex(index === showOptionsIndex ? null : index);
  };

  const handleAddCard = (index) => {
    if (cardName.trim() !== "") {
      const updatedLists = [...lists];
      updatedLists[index].cards.push({
        name: cardName,
        subtareas: [],
        etiquetaColor: getRandomGradient(),
      });

      const fechaModificada = sumarDias(new Date(), 7);
      setLists(updatedLists);
      setCardName("");
      setShowCardInputIndex(null);
      setCreatedDate(getCurrentDate());
      setModifiedDate(fechaModificada.toLocaleString());
    } else {
      alert("El nombre de la tarjeta no puede estar vacío");
    }
  };

  const handleCardClick = (listIndex, cardIndex) => {
    const selectedCard = lists[listIndex]?.cards[cardIndex];
    if (selectedCard) {
      setSelectedCard({ ...selectedCard, listIndex, cardIndex });
      const currentDate = new Date();
      if (modifiedDate <= currentDate && (selectedCard.estado === "Pendiente" || selectedCard.estado === "En Curso")) {
        setWarningMessage(" Esta tarea ya venció y necesita ser regularizada. ");
      } else {
        setWarningMessage(""); // Limpia el mensaje si la fecha no ha vencido
      }
      setSubtareas([...selectedCard.subtareas]);
      setShowModal(true);
    } else {
      console.error('No se encontró la tarjeta.');
    }
  };

  const handleCloseModal = () => {
    if (selectedCard) {
      const updatedLists = [...lists];
      const { listIndex, cardIndex } = selectedCard;
      updatedLists[listIndex].cards[cardIndex].etiqueta = etiqueta;
      setLists(updatedLists);
    }
    setShowModal(false);
    setSelectedCard(null);
    setWarningMessage(""); // Limpia el mensaje de advertencia al cerrar el modal
  };

  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #B993D6 0%, #8CA6DB 100%)',
      'linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%)',
      'linear-gradient(135deg, #A18CD1 0%, #5D26C1 100%)',
      'linear-gradient(135deg, #C471ED 0%, #12C2E9 100%)',
      'linear-gradient(135deg, #D9AFD9 0%, #97D9E1 100%)',
      'linear-gradient(135deg, #F3A4E9 0%, #5190EB 100%)'
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  };

  // Función para iniciar el arrastre de una tarjeta
  const handleDragStart = (listIndex, cardIndex) => {
    setDraggedCard({ listIndex, cardIndex });
  };

  // Función para soltar la tarjeta en una lista de destino
  const handleDrop = (targetListIndex) => {
    if (!draggedCard) return;

    const { listIndex, cardIndex } = draggedCard;
    const updatedLists = [...lists];

    // Remueve la tarjeta de la lista original
    const [movedCard] = updatedLists[listIndex].cards.splice(cardIndex, 1);

    // Agrega la tarjeta a la lista de destino
    updatedLists[targetListIndex].cards.push(movedCard);

    setLists(updatedLists);
    setDraggedCard(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necesario para permitir el drop
  };

  // Función para manejar el cambio en el filtro de usuario
  const handleFiltroUsuarioChange = (event) => {
    setFiltroUsuario(event.target.value);
  };

  // Función para manejar el cambio en el filtro de etiqueta
  const handleFiltroEtiquetaChange = (event) => {
    setFiltroEtiqueta(event.target.value);
  };

  // Filtrar tarjetas según los filtros de usuario y etiqueta
  const filtrarTarjetas = (cards) => {
    return cards.filter((card) => {
      const cumpleUsuario = filtroUsuario ? card.personaAsignada === filtroUsuario : true;
      const cumpleEtiqueta = filtroEtiqueta ? card.etiqueta === filtroEtiqueta : true;
      return cumpleUsuario && cumpleEtiqueta;
    });
  };

  const handleCloseSubtareaModal = () => {
    setSelectedSubtarea(null);
    setShowSubtareaModal(false);
  };

  const handleSubtareaClick = (subtarea) => {
    setSelectedSubtarea({
      text: subtarea.text,
      estado: subtarea.estado || "Pendiente",
      descripcion: subtarea.descripcion || "",
      persona: subtarea.persona || "",
      fechaVencimiento: subtarea.fechaVencimiento || sumarDias(new Date(), 7).toISOString(),
    });
    setShowSubtareaModal(true);
  };

  return (
      <div className="tableros-container">
        <div className="tablero-header">
          <div className="tablero-solapa">
            {title}
          </div>
          <div className="tablero-filtro">
            <label>
              Filtrar por usuario:
              <select value={filtroUsuario} onChange={handleFiltroUsuarioChange}>
                <option value="">Todos los usuarios</option>
                {workspace.usuarios.map((usuario, index) => (
                    <option key={index} value={usuario.nombre}>{usuario.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Filtrar por etiqueta:
              <input
                  type="text"
                  value={filtroEtiqueta}
                  onChange={handleFiltroEtiquetaChange}
                  placeholder="Escribe una etiqueta"
              />
            </label>
          </div>
          <div className="users-container">
            {workspace.usuarios.map((usuario, index) => (
                <div key={index} className="users-icon" title={usuario.nombre}>
                  {usuario.avatar ? (
                      <img src={usuario.avatar} alt={usuario.nombre} className="users-avatar" />
                  ) : (
                      getInitials(usuario.nombre)
                  )}
                </div>
            ))}
          </div>
        </div>
        <main className="tableros-main">
          <div className="list-scroll-container">
            <div className={`list-container ${lists.length === 0 ? 'no-lists' : ''}`}>
              {lists.map((list, index) => (
                  <div
                      key={index}
                      className="list"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)} // Maneja el drop en esta lista
                  >
                    {isEditingListName && editingListIndex === index ? (
                        <input
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            onBlur={() => handleSaveListName(index)}
                            autoFocus
                            className="editable-list-name"
                            placeholder={lists[index].name}
                        />
                    ) : (
                        <h3 onClick={() => handleEditListName(index)} className="list-name">{list.name}</h3>
                    )}
                    <div className="options-menu-container">
                      <button className="options-button" onClick={() => toggleOptions(index)}>
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      {showOptionsIndex === index && (
                          <div className="options-menu">
                            <button onClick={() => handleDeleteList(index)}>Eliminar</button>
                          </div>
                      )}
                    </div>
                    <div className="cards-container">

                      {filtrarTarjetas(list.cards).map((card, cardIndex) => (
                          <div key={cardIndex} className="card" draggable onDragStart={() => handleDragStart(index, cardIndex)} onClick={() => handleCardClick(index, cardIndex)}>
                            {card.etiqueta && (
                                <div className="etiqueta" style={{ background: card.etiquetaColor || 'linear-gradient(135deg, #B993D6 0%, #8CA6DB 100%)' }}>
                                  {card.etiqueta}
                                </div>
                            )}
                            {card.name}
                          </div>
                      ))}
                    </div>
                    {showCardInputIndex === index ? (
                        <div className="add-card-form">
                          <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                          />
                          <div className="add-card-buttons">
                            <button className="add-card-button" onClick={() => handleAddCard(index)}>Añadir tarjeta</button>
                            <button className="close-button" onClick={() => setShowCardInputIndex(null)}>X</button>
                          </div>
                        </div>
                    ) : (
                        <button className="add-card-button" onClick={() => setShowCardInputIndex(index)}>
                          <strong> + Añadir una tarjeta </strong>
                        </button>
                    )}
                  </div>
              ))}
              <div className={`add-list ${lists.length === 0 ? 'first-list' : ''}`}>
                {!showInput && (
                    <button onClick={() => setShowInput(true)}>
                      <i className="fas fa-plus"></i> Añade otra lista
                    </button>
                )}
                {showInput && (
                    <div className="add-list-form">
                      <input
                          type="text"
                          value={listName}
                          onChange={(e) => setListName(e.target.value)}
                          placeholder="Nombre de la lista..."
                      />
                      <div className="add-list-buttons">
                        <button className="add-list-button" onClick={handleAddList}>Añadir Lista</button>
                        <button className="close-button" onClick={() => setShowInput(false)}>X</button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Modal show={showModal} onClose={handleCloseModal}>
          <div className="tarjeta-detalle-container">
            {/* Botón "X" para cerrar el modal */}
            <button className="close-modal-button" onClick={handleCloseModal}>X</button>
            {warningMessage && (
                <div className="warning-message">
                  <p>{warningMessage}</p>
                </div>
            )}
            <div className="tarjeta-cabecera">
              <h2>{selectedCard?.name}</h2>  {/* Verifica que 'selectedCard' no sea null o undefined antes de acceder a 'name' */}
              <select
                  id="visibility"
                  name="visibility"
                  className={`input-field ${visibility.toLowerCase().replace(' ', '-')}`} // Generar la clase dinámica
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En   Curso">En Curso</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
            <div className="tarjeta-contenido">
              <div className="columna-izquierda">
                <div className="descripcion">
                  <h3>Descripción</h3>
                  <textarea
                      className="descripcion-textarea"
                      value={descripcion}
                      onChange={handleDescripcionChange}
                  />
                </div>
                <div className="subtareas">
                  <h3>Subtareas
                    <button className="add-subtarea-button" onClick={toggleSubtareaInput}>
                      + Agregar Subtarea
                    </button>
                  </h3>

                  {/* Solo muestra el input si showSubtareaInput es true */}
                  {showSubtareaInput && (
                      <div className="subtarea-input-container">
                        <input
                            type="text"
                            className="subtarea-input" // Para aplicar el estilo
                            value={newSubtarea}
                            onChange={(e) => setNewSubtarea(e.target.value)}
                            placeholder="Escribe una subtarea..."
                        />
                        {/* Botón para guardar la subtarea */}
                        <button className="crear-subtarea-button" onClick={handleAddSubtarea}>
                          Crear
                        </button>
                      </div>
                  )}

                  {/* Muestra las subtareas si hay alguna */}
                  {subtareas.length > 0 ? (
                      <ul>
                        {subtareas.map((subtarea, index) => (
                            <li key={index} onClick={() => handleSubtareaClick(subtarea)}> {/* Al hacer clic, abre el modal */}
                              <span>{subtarea.text}</span>
                              <span
                                  className={`estado-boton ${subtarea.estado.toLowerCase()}`} // Agrega una clase dinámica según el estado
                              >
                          {subtarea.estado}
                        </span>
                            </li>
                        ))}
                      </ul>
                  ) : (
                      // Si no hay subtareas y no se está mostrando el input, muestra el mensaje
                      !showSubtareaInput && <p>No hay subtareas.</p>
                  )}
                </div>
              </div>
              <div className="columna-derecha">
                <div className="detalles">
                  <h3>Detalles</h3>
                  <div>
                    <p1 htmlFor="personaAsignada">Persona Asignada:</p1>
                    <select
                        id="personaAsignada"
                        value={personaAsignada}
                        onChange={handlePersonaAsignadaChange}
                    >
                      <option value="">Seleccione una persona...</option>
                      {workspace.usuarios.map((usuario, index) => (
                          <option key={index} value={usuario.nombre}>
                            {usuario.nombre}
                          </option>
                      ))}
                    </select>
                  </div>

                  <p1>Creado el </p1>
                  <p>{createdDate}</p>
                  <p1>Vence el </p1>
                  <DatePicker
                      selected={modifiedDate instanceof Date ? modifiedDate : new Date()}
                      onChange={(date) => setModifiedDate(date instanceof Date ? date : new Date())}
                      dateFormat="dd/MM/yyyy HH:mm:ss"
                      showTimeSelect
                      timeFormat="HH:mm:ss"
                      placeholderText="Selecciona una fecha y hora"
                  />
                  <p1>Añadir Etiqueta
                    <input
                        type="text"
                        value={etiqueta} // Conecta el input con el estado "etiqueta"
                        onChange={(e) => setEtiqueta(e.target.value)} // Actualiza el estado cuando el usuario escribe
                        placeholder="Etiqueta"
                    />
                  </p1>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal show={showSubtareaModal} onClose={handleCloseSubtareaModal}>
          <div className="subtarea-detalle-container">
            <h2>{selectedSubtarea?.text || "Sin título"}</h2>

            {/* Dropdown para estado */}
            <div className="estado-dropdown">
              <label htmlFor="estado">Estado:</label>
              <select
                  id="estado"
                  value={selectedSubtarea?.estado || "Pendiente"}
                  onChange={(e) =>
                      setSelectedSubtarea({ ...selectedSubtarea, estado: e.target.value })
                  }
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Curso">En Curso</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            {/* Caja de texto editable para descripción */}
            <div className="descripcion-container">
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                  id="descripcion"
                  value={selectedSubtarea?.descripcion || ""}
                  onChange={(e) =>
                      setSelectedSubtarea({ ...selectedSubtarea, descripcion: e.target.value })
                  }
                  placeholder="Escribe una descripción..."
              />
            </div>

            {/* Lista desplegable para persona asignada */}
            <div className="persona-asignada-container">
              <label htmlFor="personaAsignada">Persona Asignada:</label>
              <select
                  id="personaAsignada"
                  value={selectedSubtarea?.persona || ""}
                  onChange={(e) =>
                      setSelectedSubtarea({ ...selectedSubtarea, persona: e.target.value })
                  }
              >
                <option value="">Selecciona un usuario</option>
                {workspace.usuarios.map((usuario, index) => (
                    <option key={index} value={usuario.nombre}>
                      {usuario.nombre}
                    </option>
                ))}
              </select>
            </div>

            {/* Selector de fecha ajustable */}
            <div className="fecha-vencimiento-container">
              <label htmlFor="fechaVencimiento">Vence el:</label>
              <DatePicker
                  id="fechaVencimiento"
                  selected={
                    selectedSubtarea?.fechaVencimiento
                        ? new Date(selectedSubtarea.fechaVencimiento)
                        : sumarDias(new Date(), 7)
                  }
                  onChange={(date) =>
                      setSelectedSubtarea({
                        ...selectedSubtarea,
                        fechaVencimiento: date.toISOString(),
                      })
                  }
                  dateFormat="dd/MM/yyyy HH:mm:ss"
                  showTimeSelect
                  timeFormat="HH:mm:ss"
              />
            </div>

            {/* Botón para cerrar */}
            <button onClick={handleCloseSubtareaModal} className="close-subtarea-modal">
              Cerrar
            </button>
          </div>
        </Modal>
        <footer className="tableros-footer">
          <p>© TaskFlow - 2024</p>
        </footer>
      </div>
  );
};

export default Tableros;