import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface Quest {
  _id: string;
  name: string;
}

interface QuestSelectorProps {
  setSelectedQuestId: (questId: string) => void;
}

const QuestSelector: React.FC<QuestSelectorProps> = ({ setSelectedQuestId }) => {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/quests`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuests(response.data);
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };
    fetchQuests();
  }, []);

  return (
    <div>
      <label htmlFor="quest">Select Quest:</label>
      <select
        id="quest"
        onChange={(e) => setSelectedQuestId(e.target.value)}
      >
        <option value="">Select a quest</option>
        {quests.map(quest => (
          <option key={quest._id} value={quest._id}>{quest.name}</option>
        ))}
      </select>
    </div>
  );
};

export default QuestSelector;
