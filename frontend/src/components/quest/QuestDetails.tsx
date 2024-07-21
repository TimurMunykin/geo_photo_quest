import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import QuestPhotoManagement from "./QuestPhotoManagement";
import { useDispatch, useSelector } from "react-redux";
import { addQuest, selectQuestById, updateQuquestTitle } from "../../redux/questsSlice";
import { setPhotos } from "../../redux/photosSlice";
import InputBase from '@mui/material/InputBase';

const QuestDetails: React.FC = () => {
  const params = useParams();
  const questId = params.questId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quest = useSelector(selectQuestById(questId!));
  console.log(quest);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/quests/${questId}/photos`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        dispatch(addQuest(response.data.quest));
        dispatch(setPhotos(response.data.photos));
        setTitle(response.data.quest.name);
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };
    fetchQuests();
  }, [dispatch]);

  const onTitleChange = (value: string) => {
    setTitle(value);
    dispatch(updateQuquestTitle({ questId: questId!, title: value }));
    const updateQuestName = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/quests/${questId}`, { name: value }, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Error updating quest name:', error);
      }
    }
    updateQuestName();
  }

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/quests/${questId}/photos`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        dispatch(addQuest(response.data.quest));
        dispatch(setPhotos(response.data.photos));
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    };
    fetchQuests();
  }, [dispatch]);

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle>
          <InputBase
            fullWidth={true}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </DialogTitle>
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => navigate(-1)}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText>
            <QuestPhotoManagement questId={questId!} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestDetails;
