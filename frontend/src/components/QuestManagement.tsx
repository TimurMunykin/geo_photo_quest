import {
  List,
  Paper,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import QuestItem from "./QuestItem";
import { addQuest } from "../redux/questsSlice";

export default function QuestManagement() {
  const dispatch = useDispatch();
  const quests = useSelector((state: RootState) => state.quests.quests);
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
    <div>
      <List dense={false}>
        {quests.map((quest) => (
          <QuestItem key={quest._id} quest={quest} />
        ))}
      </List>
      <Paper elevation={2} sx={{p:"10px",mt:"20px"}}>
        <TextField
          variant="outlined"
          label="Quest Name"
          fullWidth={true}
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button variant="contained" endIcon={<AddBoxIcon/>} sx={{mt:"10px"}} onClick={handleCreateQuest}>
          Create Quest
        </Button>
      </Paper>
    </div>
  );
}
