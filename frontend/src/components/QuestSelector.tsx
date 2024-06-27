import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setQuests } from '../redux/questsSlice';
import { RootState } from '../redux/store';
import { API_URL } from '../config';
import { Select, MenuItem, Box, Typography } from '@mui/material';

interface QuestSelectorProps {
  selectedQuestId: string;
  setSelectedQuestId?: (id: string) => void;
}

const QuestSelector: React.FC<QuestSelectorProps> = ({ selectedQuestId, setSelectedQuestId }) => {
  const dispatch = useDispatch();
  const quests = useSelector((state: RootState) => state.quests.quests);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/quests`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        dispatch(setQuests(response.data));
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };
    fetchQuests();
  }, [dispatch]);

  return (
    <Select
      labelId="demo-simple-select-autowidth-label"
      id="demo-simple-select-autowidth"
      value={selectedQuestId}
      onChange={(e) => setSelectedQuestId && setSelectedQuestId(e.target.value as string)}
      size="small"
      label="Age"
      style={{ backgroundColor: "white", marginTop: "8px" }} // Adjust margin as needed
    >
      <MenuItem value="">Select a quest</MenuItem>
          {quests.map((quest) => (
           <MenuItem key={quest._id} value={quest._id}>
             {quest.name}
           </MenuItem>
         ))}
    </Select>
  );
};

export default QuestSelector;
