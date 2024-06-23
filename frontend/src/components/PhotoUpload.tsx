import React, { useEffect, useState } from 'react';
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

interface Quest {
  _id: string;
  name: string;
}

const PhotoUpload: React.FC = () => {
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [message, setMessage] = useState('');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState('');

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/quests`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setQuests(response.data);
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };
    fetchQuests();
  }, []);

  const handleUpload = async () => {
    if (!photos || !selectedQuestId) {
      setMessage('Please select photos and a quest.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }
    formData.append('questId', selectedQuestId);

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
      <select onChange={(e) => setSelectedQuestId(e.target.value)} value={selectedQuestId}>
        <option value="">Select Quest</option>
        {quests.map((quest) => (
          <option key={quest._id} value={quest._id}>{quest.name}</option>
        ))}
      </select>
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default PhotoUpload;
