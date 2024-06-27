import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { LocationOn, ZoomIn, ZoomOut, Layers } from "@mui/icons-material";
import QuestManagement from './components/QuestManagement';
import MainLayout from './components/MainLayout';
import Auth from './components/Auth';


const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/quest-management" element={<QuestManagement />} />
        </Routes>
      </MainLayout>
    </Router>
  );

};

export default App;
