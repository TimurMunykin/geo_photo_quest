import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import ManagePoints from './components/ManagePoints';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import QuestManagement from './components/QuestManagement'; // Add this line

const App: React.FC = () => {
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Map route={route} />} />
          <Route path="/manage" element={<ManagePoints setRoute={setRoute} />} />
          <Route path="/quest-management" element={<QuestManagement />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
