import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import Login from './components/Login';
import Register from './components/Register';
import QuestManagement from './components/QuestManagement';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Map route={route} />} />
          <Route path="/quest-management" element={<QuestManagement />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
