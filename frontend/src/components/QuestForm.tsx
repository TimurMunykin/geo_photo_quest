import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addQuest } from '../redux/questsSlice';
import { API_URL } from '../config';
import { Button, TextField, Box } from '@mui/material';

const QuestForm: React.FC = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateQuest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/quests`, { name }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      dispatch(addQuest(response.data));
      setName('');
      setMessage(`Quest created: ${response.data.name}`);
    } catch (error) {
      console.error('Failed to create quest', error);
      setMessage('Failed to create quest');
    }
  };

  return (
    <Box>
      <TextField
        label="Quest Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button onClick={handleCreateQuest} variant="contained" color="primary">
        Create Quest
      </Button>
      {message && <p>{message}</p>}
    </Box>
  );
};

export default QuestForm;
