import {
  Box,
  Grid,
  Icon,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputBase,
  LinearProgress,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URL } from "../config";
import {
  removePhoto,
  selectPhotosByQuest,
  setPhotos,
  updateGeoLocation,
} from "../redux/photosSlice";
import { Quest } from "../redux/questsSlice";
import { useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";


const QuestPhotoManagement: React.FC<{questId: string}> = ({questId}) => {
  const dispatch = useDispatch();
  const photos = useSelector(selectPhotosByQuest(questId));
  const [uploadProgress, setUploadProgress] = useState(0);
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
      await axios.post(`${API_URL}/photos/${photoId}/geolocation/`, { latitude }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(updateGeoLocation({ photoId, latitude: parseFloat(latitude) }));
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };
  const handleUpdateLongitude = async (photoId: string, longitude: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/photos/${photoId}/geolocation/`, { longitude }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(updateGeoLocation({ photoId, longitude: parseFloat(longitude) }));
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: "20px" }}
        fullWidth={true}
      >
        Upload Files
        <input
          multiple
          hidden
          capture={true}
          type="file"
          onChange={(e) => handleUploadPhotos(e.target.files)}
          accept="image/*"
        />
      </Button>

      <LinearProgress variant="determinate" value={uploadProgress} />
      <ImageList variant="masonry" cols={2} gap={10}>
        {photos.map((item) => (
          <ImageListItem key={item._id}>
            <img
              srcSet={`${API_URL}/uploads/${item.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${API_URL}/uploads/${item.path}?w=248&fit=crop&auto=format`}
              loading="lazy"
            />
            <ImageListItemBar
              title={
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  value={item.path}
                  fullWidth={true}
                />
              }
              position="below"
            />
            <Grid container>
              <Grid xs>
                <TextField
                  label="Latitude"
                  size="small"
                  defaultValue={`${item.geolocation?.latitude || ""}`}
                  onBlur={(e) => handleUpdateLatitude(item._id, e.currentTarget.value)}
                />
              </Grid>
              <Grid xs>
                <TextField
                  label="Longitude"
                  size="small"
                  defaultValue={`${item.geolocation?.longitude || ""}`}
                  sx={{ ml: "5px" }}
                  onBlur={(e) => handleUpdateLongitude(item._id, e.currentTarget.value)}
                />
              </Grid>
              <Grid>
                <IconButton
                  color="info"
                  sx={{ ml: "25%" }}
                  onClick={() => console.log("Geolocation")}
                >
                  <GpsFixedIcon />
                </IconButton>
              </Grid>
              <Grid xs>
                <IconButton
                  color="error"
                  sx={{ ml: "20px" }}
                  onClick={() => handleDeletePhoto(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
};

export default QuestPhotoManagement;
