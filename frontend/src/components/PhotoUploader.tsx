import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setPhotos } from '../redux/photosSlice';
import { API_URL } from '../config';
import { Button, Box } from '@mui/material';

interface PhotoUploaderProps {
  selectedQuestId: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ selectedQuestId }) => {
  const dispatch = useDispatch();
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);

  const handleUploadPhotos = async () => {
    if (!photoFiles || !selectedQuestId) return;
    const formData = new FormData();
    Array.from(photoFiles).forEach((file) => formData.append('photos', file));
    formData.append('questId', selectedQuestId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/photos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
      });
      dispatch(setPhotos(response.data));
    } catch (error) {
      console.error('Failed to upload photos', error);
    }
  };

  return (
    <Box>
      <input type="file" multiple onChange={(e) => setPhotoFiles(e.target.files)} />
      <Button onClick={handleUploadPhotos} variant="contained" color="primary">
        Upload Photos
      </Button>
    </Box>
  );
};

export default PhotoUploader;
