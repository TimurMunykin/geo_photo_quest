import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const PhotoUpload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i]);
      }

      try {
        const response = await axios.post(`${API_URL}/photos/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Photos uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading photos:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photos</button>
    </div>
  );
};

export default PhotoUpload;
