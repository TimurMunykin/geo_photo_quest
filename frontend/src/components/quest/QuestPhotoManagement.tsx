import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  TextField,
  Tooltip,
  Zoom,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URL } from "../../config";
import {
  removePhoto,
  reorderPhotos,
  selectPhotosByQuest,
  setPhotos,
  updateGeoLocation,
} from "../../redux/photosSlice";
import { useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { setSelectLocationMode } from "../../redux/mapSlice";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const QuestPhotoManagement: React.FC<{ questId: string }> = ({ questId }) => {
  const dispatch = useDispatch();
  const photos = useSelector(selectPhotosByQuest(questId));
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const [order, setOrder] = useState<number[]>([]);

  const handleUploadPhotos = async (files: FileList | null) => {
    if (!files || !questId) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("photos", file));
    formData.append("questId", questId);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/photos/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        },
      });
      dispatch(setPhotos(response.data));
    } catch (error) {
      console.error("Failed to upload photos", error);
    }
  };
  const handleDeletePhoto = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removePhoto(photoId));
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };
  const handleUpdateLatitude = async (photoId: string, latitude: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/photos/${photoId}/geolocation/`,
        { latitude },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(updateGeoLocation({ photoId, latitude: parseFloat(latitude) }));
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };
  const handleUpdateLongitude = async (photoId: string, longitude: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/photos/${photoId}/geolocation/`,
        { longitude },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(
        updateGeoLocation({ photoId, longitude: parseFloat(longitude) })
      );
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };
  const handleGeoLocation = (photoId: string) => {
    const photo = photos.find((photo) => photo._id === photoId);
    if (!photo) return;
    dispatch(setSelectLocationMode(true));
    navigate(routes.selectLocation(photoId), { state: { photoId } });
  };

  const updatePhotoOrder = async (startIndex: number, endIndex: number) => {
    try {
      const token = localStorage.getItem("token");

      const updatedPhotos = Array.from(photos);
      const [movedPhoto] = updatedPhotos.splice(startIndex, 1);
      updatedPhotos.splice(endIndex, 0, movedPhoto);

      await axios.put(
        `${API_URL}/photos/order`,
        { order: updatedPhotos.map((photo) => photo._id) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(reorderPhotos({ startIndex, endIndex }));
    } catch (error) {
      console.error("Failed to update photo order", error);
    }
  }
  return (
    <>
      <List sx={{ width: "100%" }}>
        {photos.map((item) => (
          <ListItem key={item._id}>
            <Tooltip
              TransitionComponent={Zoom}
              placement="left"
              title={
                <Box
                  component="img"
                  src={`${API_URL}/uploads/${item.path}`}
                  sx={{ borderRadius: 2 }}
                />
              }
            >
              <Avatar
                src={`${API_URL}/uploads/${item.path}`}
                sx={{ width: 50, height: 50 }}
              />
            </Tooltip>

            <TextField
              label="Latitude"
              size="small"
              fullWidth={true}
              defaultValue={`${item.geolocation?.latitude || ""}`}
              sx={{ ml: "10px" }}
              onBlur={(e) =>
                handleUpdateLatitude(item._id, e.currentTarget.value)
              }
            />

            <TextField
              label="Longitude"
              size="small"
              fullWidth={true}
              defaultValue={`${item.geolocation?.longitude || ""}`}
              sx={{ ml: "10px" }}
              onBlur={(e) =>
                handleUpdateLongitude(item._id, e.currentTarget.value)
              }
            />

            <IconButton
              color="info"
              onClick={() => handleGeoLocation(item._id)}
            >
              <GpsFixedIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => handleDeletePhoto(item._id)}
            >
              <DeleteIcon />
            </IconButton>

            <IconButton onClick={() => updatePhotoOrder(photos.indexOf(item), photos.indexOf(item) - 1)}>
              <ArrowUpwardIcon/>
            </IconButton>

            <IconButton onClick={() => updatePhotoOrder(photos.indexOf(item), photos.indexOf(item) + 1)}>
              <ArrowDownwardIcon/>
            </IconButton>
          </ListItem>
        ))}
      </List>

      <LinearProgress sx={{height:"5px"}} variant="determinate" value={uploadProgress}/>

      <Button
        variant="contained"
        component="label"
        sx={{ mt: "10px" }}
        fullWidth={true}
      >
        Upload Files
        <input
          multiple
          hidden
          type="file"
          onChange={(e) => handleUploadPhotos(e.target.files)}
          accept="image/*"
        />
      </Button>
    </>
  );
};

export default QuestPhotoManagement;
