import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URL } from "../config";
import { selectPhotosByQuest, setPhotos } from "../redux/photosSlice";
import { Quest } from "../redux/questsSlice";
import { useState } from "react";

interface QuestItemProps {
  quest: Quest;
}

const QuestPhotoManagement: React.FC<QuestItemProps> = ({ quest }) => {
  const dispatch = useDispatch();
  const photos = useSelector(selectPhotosByQuest(quest._id));
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleUploadPhotos = async (files: FileList | null) => {
    if (!files || !quest) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('photos', file));
    formData.append('questId', quest._id);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/photos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadProgress(percentCompleted);
        }
      });
      dispatch(setPhotos(response.data));
    } catch (error) {
      console.error('Failed to upload photos', error);
    }
  };

  return (
    <>
    <Button variant="contained" component="label" sx={{mb:'20px'}} fullWidth={true} >
      Upload Files
      <input
        multiple
        hidden
        capture={true}
        type="file"
        onChange={(e) => handleUploadPhotos(e.target.files)}
        accept="image/*"/>
    </Button>
    <LinearProgress variant="determinate" value={uploadProgress} />
    <ImageList variant="masonry" cols={2} gap={10}>
      {photos.map((item) => (
          <ImageListItem key={item._id}>
            <img
              srcSet={`${API_URL}/uploads/${item.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${API_URL}/uploads/${item.path}?w=248&fit=crop&auto=format`}
              alt={`${item.geolocation.latitude}, ${item.geolocation.longitude}`}
              height={"20px"}
              loading="lazy"
            />
            <ImageListItemBar
              title={`${item.geolocation.latitude}, ${item.geolocation.longitude}`}
              subtitle={<span>Path: {item.path}</span>}
              position="below"
            />
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </ImageListItem>
      ))}
    </ImageList>

    </>
  );
};

export default QuestPhotoManagement;
