import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './QuestManagement.css';

interface Photo {
  _id: string;
  path: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

interface Quest {
  _id: string;
  name: string;
  token: string;
}

const QuestManagement: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');
  const [name, setName] = useState('');
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    if (selectedQuestId) {
      const fetchPhotos = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/photos`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              questId: selectedQuestId
            }
          });
          setUploadedPhotos(response.data);
          setOrder(response.data.map((photo: Photo, index: number) => index));
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      };
      fetchPhotos();
    } else {
      setUploadedPhotos([]);
      setOrder([]);
    }
  }, [selectedQuestId]);

  const handleCreateQuest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/quests`, { name }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuests([...quests, response.data]);
      setName('');
      setMessage(`Quest created with ID: ${response.data._id}`);
    } catch (error) {
      setMessage('Failed to create quest');
    }
  };

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
      const response = await axios.get(`${API_URL}/photos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          questId: selectedQuestId
        }
      });
      setUploadedPhotos(response.data);
      setOrder(response.data.map((photo: Photo, index: number) => index));
    } catch (error) {
      setMessage('Failed to upload photos');
    }
  };

  const handleDeleteQuest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/quests/${selectedQuestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuests(quests.filter(quest => quest._id !== selectedQuestId));
      setSelectedQuestId('');
    } catch (error) {
      console.error('Error deleting quest:', error);
    }
  }

  const reorder = (startIndex: number, endIndex: number) => {
    const result = Array.from(order);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setOrder(result);

    const orderedPhotos = result.map(index => uploadedPhotos[index]);
    const route = orderedPhotos.map(photo => ({
      latitude: photo.geolocation.latitude,
      longitude: photo.geolocation.longitude,
    }));
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/photos/${photoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedPhotos = uploadedPhotos.filter(photo => photo._id !== photoId);
      setUploadedPhotos(updatedPhotos);
      setOrder(updatedPhotos.map((_, index) => index));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const deleteAllPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/photos/reset`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUploadedPhotos([]);
      setOrder([]);
    } catch (error) {
      console.error('Error deleting all photos:', error);
    }
  };

  const getCurrentQuestToken = () => {
    const currentQuest = quests.find(quest => quest._id === selectedQuestId);
    return currentQuest?.token;
  }

  return (
    <div className="quest-management-container">
      <h2>Create Quest</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Quest Name"
      />
      <button onClick={handleCreateQuest}>Create Quest</button>
      <p>{message}</p>

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
      {getCurrentQuestToken()}
      <button onClick={handleDeleteQuest}>Delete Quest</button>
      <button onClick={handleUpload}>Upload Photos</button>
      <button onClick={deleteAllPhotos}>Delete All Photos</button>

      <h2>Manage Points</h2>
      <ul>
        {order.map((index, idx) => (
          <li key={uploadedPhotos[index]._id}>
            {idx + 1}. {uploadedPhotos[index].geolocation.longitude}, {uploadedPhotos[index].geolocation.latitude}
            <img src={`${API_URL}/uploads/${uploadedPhotos[index].path}`} alt={uploadedPhotos[index].path} width={50} />
            <button onClick={() => reorder(idx, idx - 1)} disabled={idx === 0}>Up</button>
            <button onClick={() => reorder(idx, idx + 1)} disabled={idx === order.length - 1}>Down</button>
            <button onClick={() => deletePhoto(uploadedPhotos[index]._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestManagement;
