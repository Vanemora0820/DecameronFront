import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HotelManager = () => {
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    taxId: '',
    numberOfRooms: '',
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
    try {
      if (editHotelId) {
        await axios.put(`http://localhost:8000/api/hotels/${editHotelId}`, formData);
        setEditHotelId(null);
      } else {
        await axios.post('http://localhost:8000/api/hotels', formData);
      }
      fetchHotels();
      setFormData({
        name: '',
        address: '',
        city: '',
        taxId: '',
        numberOfRooms: '',
      });
    } catch (error) {
      console.error('Error saving hotel:', error);
    }
  };

  const handleEdit = (hotel) => {
    setFormData(hotel);
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
          name="taxId"
          placeholder="NIT"
          value={formData.taxId}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="numberOfRooms"
          placeholder="Número de habitaciones"
          value={formData.numberOfRooms}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editHotelId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <h2>Lista de Hoteles</h2>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            {hotel.name} - {hotel.address} - {hotel.city} - {hotel.taxId} - {hotel.numberOfRooms} habitaciones
            <button onClick={() => handleEdit(hotel)}>Editar</button>
            <button onClick={() => handleDelete(hotel.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelManager;
