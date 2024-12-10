import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoomManager.css';

const RoomTypeManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
  });

  const [editRoomTypeId, setEditRoomTypeId] = useState(null);

  // Cargar tipos de habitación
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/room-types');
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (editRoomTypeId) {
        await axios.put(`http://localhost:8000/api/room-types/${editRoomTypeId}`, dataToSend);
        setEditRoomTypeId(null);
      } else {
        await axios.post('http://localhost:8000/api/room-types', dataToSend);
      }
      fetchRoomTypes();
      setFormData({ type: '' });
    } catch (error) {
      console.error('Error saving room type:', error);
    }
  };

  const handleEdit = (roomType) => {
    setFormData(roomType);
    setEditRoomTypeId(roomType.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/room-types/${id}`);
      fetchRoomTypes();
    } catch (error) {
      console.error('Error deleting room type:', error);
    }
  };

  return (
    <div>
      <h1>Gestión de Tipos de Habitación</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="type"
          placeholder="Tipo de habitación"
          value={formData.type}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editRoomTypeId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <h2>Lista de Tipos de Habitación</h2>
      <ul>
        {roomTypes.map((roomType) => (
          <li key={roomType.id}>
            {roomType.type}
            <button onClick={() => handleEdit(roomType)}>Editar</button>
            <button onClick={() => handleDelete(roomType.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomTypeManager;
