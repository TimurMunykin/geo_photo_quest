import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import QuestManagement from './components/QuestManagement';
import MainLayout from './components/MainLayout';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Map route={route} />} />
          <Route path="/quest-management" element={<QuestManagement />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
