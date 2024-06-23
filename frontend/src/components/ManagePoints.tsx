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

  const reorder = (startIndex: number, endIndex: number) => {
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
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await axios.delete(`${API_URL}/photos/${photoId}`);
      const updatedPhotos = photos.filter(photo => photo._id !== photoId);
      setPhotos(updatedPhotos);
      setOrder(updatedPhotos.map((_, index) => index));
      const route = updatedPhotos.map(photo => ({
        latitude: photo.geolocation.latitude,
        longitude: photo.geolocation.longitude,
      }));
      setRoute(route);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const deleteAllPhotos = async () => {
    try {
      await axios.delete(`${API_URL}/photos/reset`);
      setPhotos([]);
      setOrder([]);
      setRoute([]);
    } catch (error) {
      console.error('Error deleting all photos:', error);
    }
  };

  return (
    <div>
      <h2>Manage Points</h2>
      <button onClick={deleteAllPhotos}>Delete All Photos</button>
      <ul>
        {order.map((index, idx) => (
          <li key={photos[index]._id}>
            {idx + 1}. {photos[index].geolocation.longitude}, {photos[index].geolocation.latitude}
            <img src={`${API_URL}/uploads/${photos[index].path}`} alt={photos[index].path} width={50} />
            <button onClick={() => reorder(idx, idx - 1)} disabled={idx === 0}>Up</button>
            <button onClick={() => reorder(idx, idx + 1)} disabled={idx === order.length - 1}>Down</button>
            <button onClick={() => deletePhoto(photos[index]._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePoints;
