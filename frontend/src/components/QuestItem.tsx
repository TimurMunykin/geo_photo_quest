import {
  Avatar,
  AvatarGroup,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { selectPhotosByQuest, setPhotos } from "../redux/photosSlice";
import { Quest, removeQuest } from "../redux/questsSlice";
import EditIcon from "@mui/icons-material/Edit";
import QuestPhotoManagement from "./QuestPhotoManagement";
import CloseIcon from "@mui/icons-material/Close";
import MapIcon from '@mui/icons-material/Map';

interface QuestItemProps {
  quest: Quest;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest }) => {
  const dispatch = useDispatch();
  const photos = useSelector(selectPhotosByQuest(quest._id));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/photos`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { questId: quest._id },
        });
        console.log({ ...response.data, questId: quest._id });
        dispatch(setPhotos(response.data));
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  const handleDeleteClick = async () => {
    try {
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
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"md"}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{quest.name}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <QuestPhotoManagement quest={quest} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestItem;
