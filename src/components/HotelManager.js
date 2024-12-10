import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HotelManager.css';

const HotelManager = () => {
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    taxId: '',
    maxRooms: '', // Cambié 'numberOfRooms' por 'maxRooms'
  });

  const [editHotelId, setEditHotelId] = useState(null);

  // Fetch hoteles al cargar
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
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
    
    // Asegúrate de que los valores sean correctos
    const dataToSend = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      tax_id: formData.taxId,  // Usamos tax_id en lugar de taxId
      max_rooms: parseInt(formData.max_rooms, 10),  // Convertimos max_rooms a un número
    };
  
    try {
      if (editHotelId) {
        await axios.put(`http://localhost:8000/api/hotels/${editHotelId}`, dataToSend);
        setEditHotelId(null);
      } else {
        await axios.post('http://localhost:8000/api/hotels', dataToSend);
      }
      
      fetchHotels();
    
      setFormData({
        name: '',
        address: '',
        city: '',
        tax_Id: '',  // Asegúrate de que se llama taxId, no tax_id
        max_rooms: '',  // Max rooms se maneja como un número vacío
      });
    } catch (error) {
      console.error('Error saving hotel:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        const errors = error.response.data.errors;
        alert(`Error: ${JSON.stringify(errors)}`);
      }
    }
  };

  const handleEdit = (hotel) => {
    setFormData({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      tax_Id: hotel.tax_Id,
      max_Rooms: hotel.max_Rooms, 
    });
    setEditHotelId(hotel.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/hotels/${id}`);
      fetchHotels(); 
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  return (
    <div>
      <h1>Gestión de Hoteles</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre del hotel"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="tax_Id"
          placeholder="NIT"
          value={formData.taxId}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="max_Rooms" 
          placeholder="Número máximo de habitaciones"
          value={formData.maxRooms}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editHotelId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <h2>Lista de Hoteles</h2>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            {hotel.name} - {hotel.address} - {hotel.city} - {hotel.taxId} - {hotel.maxRooms} habitaciones
            <button onClick={() => handleEdit(hotel)}>Editar</button>
            <button onClick={() => handleDelete(hotel.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelManager;
