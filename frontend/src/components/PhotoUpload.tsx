import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const PhotoUpload: React.FC = () => {
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!photos) return;

    const formData = new FormData();
    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]); // Ensure the field name is 'photos'
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/photos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setMessage('Photos uploaded successfully');
    } catch (error) {
      setMessage('Failed to upload photos');
    }
  };

  return (
    <div className="photo-upload-container">
      <h2>Upload Photos</h2>
      <input
        type="file"
        multiple
        onChange={(e) => setPhotos(e.target.files)}
      />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default PhotoUpload;