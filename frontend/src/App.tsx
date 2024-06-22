import React, { useState } from 'react';
import './App.css';
import PhotoUpload from './components/PhotoUpload';
import Map from './components/Map';
import ManagePoints from './components/ManagePoints';
import axios from 'axios';
import { API_URL } from './config';

const App: React.FC = () => {
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  const resetPhotos = async () => {
    try {
      await axios.delete(`${API_URL}/photos/reset`);
      alert('All photos deleted');
    } catch (error) {
      console.error('Error deleting photos:', error);
      alert('Failed to delete photos');
    }
  };

  const createRoute = async () => {
    try {
      const response = await axios.get(`${API_URL}/photos/route`);
      setRoute(response.data);
      console.log('Route created:', response.data);
    } catch (error) {
      console.error('Error creating route:', error);
      alert('Failed to create route');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Photo Geolocation Game</h1>
        <PhotoUpload />
        <button onClick={resetPhotos}>Reset Photos</button>
        <button onClick={createRoute}>Create Route</button>
      </header>
      <div className="App-content">
        <div className="Map-container">
          <Map route={route} />
        </div>
        <div className="ManagePoints-container">
          <ManagePoints setRoute={setRoute} />
        </div>
      </div>
    </div>
  );
};

export default App;
