import {
  Avatar,
  AvatarGroup,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { selectPhotosByQuest, setPhotos } from "../../redux/photosSlice";
import { Quest, removeQuest } from "../../redux/questsSlice";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

interface QuestItemProps {
  quest: Quest;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest }) => {
  const dispatch = useDispatch();
  const photos = useSelector(selectPhotosByQuest(quest._id));
  const navigate = useNavigate();

  const handleClickOpen = (e: { preventDefault: () => void; }) => {
    navigate(routes.questDetails(quest._id));
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/photos`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { questId: quest._id },
        });
        dispatch(setPhotos(response.data));
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  const handleDeleteClick = async (e: { stopPropagation: () => void; }) => {
    try {
      e.stopPropagation();
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/quests/${quest._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removeQuest(quest._id));
    } catch (error) {
      console.error("Error deleting quest:", error);
    }
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpen}>
        <ListItemAvatar>
          <AvatarGroup>
            {photos.map((photo) => (
              <Avatar
                key={photo._id}
                alt={photo.path}
                src={`${API_URL}/uploads/${photo.path}?w=248&fit=crop&auto=format&dpr=2`}
              />
            ))}
          </AvatarGroup>
        </ListItemAvatar>
        <ListItemText
          primary={quest.name}
          secondary='Description'
        />
        <IconButton color="error" onClick={handleDeleteClick}>
            <DeleteIcon />
            {/* todo: confirmation dialog */}
          </IconButton>
      </ListItemButton>
    </>
  );
};

export default QuestItem;
