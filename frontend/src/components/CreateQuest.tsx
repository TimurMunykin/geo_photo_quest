import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const CreateQuest = () => {
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [token, setToken] = useState('');

  const handleUpload = async () => {
    if (!photos) return;

    const formData = new FormData();
    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }

    try {
      const response = await axios.post(`${API_URL}/quests/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToken(response.data.token);
    } catch (error) {
      console.error('Error creating quest:', error);
    }
  };

  return (
    <div>
      <h2>Create Quest</h2>
      <input type="file" multiple onChange={(e) => setPhotos(e.target.files)} />
      <button onClick={handleUpload}>Create Quest</button>
      {token && <p>Quest created! Token: {token}</p>}
    </div>
  );
};

export default CreateQuest;
