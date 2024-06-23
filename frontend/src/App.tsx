import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import QuestManagement from './components/QuestManagement';
import QuestSelector from './components/QuestSelector';

const App: React.FC = () => {
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <>
                <QuestSelector setSelectedQuestId={setSelectedQuestId} />
                {selectedQuestId && <Map questId={selectedQuestId} />}
              </>
            }
          />
          <Route path="/quest-management" element={<QuestManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
