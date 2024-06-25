import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setPhotos, removePhoto, deleteAllPhotos } from '../redux/photosSlice';
import { RootState } from '../redux/store';
import { API_URL } from '../config';
import { Box, Button, Typography } from '@mui/material';

interface PhotoListProps {
  selectedQuestId: string;
}

const PhotoList: React.FC<PhotoListProps> = ({ selectedQuestId }) => {
  const dispatch = useDispatch();
  const photos = useSelector((state: RootState) => state.photos.photos);

  useEffect(() => {
    if (selectedQuestId) {
      const fetchPhotos = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/photos`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { questId: selectedQuestId },
          });
          dispatch(setPhotos(response.data));
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      };
      fetchPhotos();
    } else {
      dispatch(setPhotos([])); // Clear photos if no quest is selected
    }
  }, [selectedQuestId, dispatch]);

  const handleDeleteAllPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/photos/reset`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      dispatch(deleteAllPhotos());
    } catch (error) {
      console.error('Error deleting all photos:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Photos</Typography>
      <Button onClick={handleDeleteAllPhotos} variant="contained" color="secondary">
        Delete All Photos
      </Button>
      <ul>
        {photos.map((photo) => (
          <li key={photo._id}>
            <img src={`${API_URL}/uploads/${photo.path}`} alt={photo.path} width={50} />
            {photo.geolocation.longitude}, {photo.geolocation.latitude}
            <Button onClick={() => dispatch(removePhoto(photo._id))} variant="contained" color="secondary">
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default PhotoList;
