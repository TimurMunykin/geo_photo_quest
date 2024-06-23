import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import PhotoUpload from './components/PhotoUpload';
import ManagePoints from './components/ManagePoints';
import Login from './components/Login';
import Register from './components/Register'; // Import Register component
import NavBar from './components/NavBar';

const App: React.FC = () => {
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Add Register route */}
          <Route path="/" element={<Map route={route} />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/manage" element={<ManagePoints setRoute={setRoute} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
