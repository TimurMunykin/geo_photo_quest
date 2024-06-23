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
    <div className="p-4 bg-white rounded shadow-md">
      <label htmlFor="quest" className="block text-sm font-medium text-gray-700">Select Quest:</label>
      <select
        id="quest"
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
