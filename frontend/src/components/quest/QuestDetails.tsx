import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import QuestPhotoManagement from "./QuestPhotoManagement";
import { useDispatch } from "react-redux";
import { addQuest } from "../../redux/questsSlice";
import { setPhotos } from "../../redux/photosSlice";

const QuestDetails: React.FC = () => {
  const params = useParams();
  const questId = params.questId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        maxWidth={"md"}
      >
        <DialogTitle>Titile</DialogTitle>
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
