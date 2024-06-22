import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './ManagePoints.css';

interface Photo {
  _id: string;
  path: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

interface ManagePointsProps {
  setRoute: (route: { latitude: number; longitude: number }[]) => void;
}

const ManagePoints: React.FC<ManagePointsProps> = ({ setRoute }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`${API_URL}/photos`);
        setPhotos(response.data);
        setOrder(response.data.map((photo: Photo, index: number) => index));
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
    fetchPhotos();
  }, []);

  const reorder = async (startIndex: number, endIndex: number) => {
    const result = Array.from(order);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setOrder(result);

    const orderedPhotos = result.map(index => photos[index]);
    const route = orderedPhotos.map(photo => ({
      latitude: photo.geolocation.latitude,
      longitude: photo.geolocation.longitude,
    }));
    setRoute(route);

    // Save the new order to the backend
    await axios.put(`${API_URL}/photos/order`, {
      order: orderedPhotos.map(photo => photo._id)
    });
  };

  return (
    <div>
      <h2>Manage Points</h2>
      <div className="points-container">
        {order.map((index, idx) => (
          <div key={photos[index]._id} className="point-card">
            <img src={`${API_URL}/uploads/${photos[index].path}`} alt={photos[index].path} className="point-image"/>
            <div className="point-info">
              <p>{idx + 1}. {photos[index].geolocation.longitude.toFixed(5)}, {photos[index].geolocation.latitude.toFixed(5)}</p>
              <button onClick={() => reorder(idx, idx - 1)} disabled={idx === 0} className="order-button">Up</button>
              <button onClick={() => reorder(idx, idx + 1)} disabled={idx === order.length - 1} className="order-button">Down</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePoints;
