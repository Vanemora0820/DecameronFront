import React, { useState, useEffect } from 'react';  
import axios from 'axios';  
import './RoomManager.css'; 

const RoomManager = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]); 
    const [formData, setFormData] = useState({
      hotel_id: '',
      room_type_id: '',
      room_number: '',
      max_occupancy: '',
    });
  
    const [editRoomId, setEditRoomId] = useState(null);
  
    useEffect(() => {
      fetchRooms();
      fetchRoomTypes(); 
    }, []);
  
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/room_types'); // Suponiendo que esta es la ruta
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
        if (editRoomId) {
          await axios.put(`http://localhost:8000/api/rooms/${editRoomId}`, dataToSend);
          setEditRoomId(null);
        } else {
          await axios.post('http://localhost:8000/api/rooms', dataToSend);
        }
        fetchRooms();
        setFormData({
          hotel_id: '',
          room_type_id: '',
          room_number: '',
          max_occupancy: '',
        });
      } catch (error) {
        console.error('Error saving room:', error);
      }
    };
  
    const handleEdit = (room) => {
      setFormData(room);
      setEditRoomId(room.id);
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:8000/api/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    };
  
    return (
      <div>
        <h1>Gestión de Habitaciones</h1>
        <form onSubmit={handleSubmit}>
          <select
            name="hotel_id"
            value={formData.hotel_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona un hotel</option>
            {/* Aquí debes mapear las opciones de hoteles disponibles */}
          </select>
          <select
            name="room_type_id"
            value={formData.room_type_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona un tipo de habitación</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.type}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="room_number"
            placeholder="Número de habitación"
            value={formData.room_number}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="max_occupancy"
            placeholder="Máxima ocupación"
            value={formData.max_occupancy}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{editRoomId ? 'Actualizar' : 'Crear'}</button>
        </form>
  
        <h2>Lista de Habitaciones</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              Habitación {room.room_number} - Hotel: {room.hotel_name} - Tipo: {room.room_type_name}
              <button onClick={() => handleEdit(room)}>Editar</button>
              <button onClick={() => handleDelete(room.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default RoomManager;
