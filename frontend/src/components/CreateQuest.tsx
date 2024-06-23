import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const CreateQuest: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateQuest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/quests`, { name }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage(`Quest created with ID: ${response.data._id}`);
    } catch (error) {
      setMessage('Failed to create quest');
    }
  };

  return (
    <div className="create-quest-container">
      <h2>Create Quest</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Quest Name"
      />
      <button onClick={handleCreateQuest}>Create Quest</button>
      <p>{message}</p>
    </div>
  );
};

export default CreateQuest;
