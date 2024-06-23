import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import PhotoUpload from './components/PhotoUpload';
import ManagePoints from './components/ManagePoints';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import CreateQuest from './components/CreateQuest'; // Import CreateQuest component

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Map route={[]} />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/manage" element={<ManagePoints setRoute={() => {}} />} />
          <Route path="/create-quest" element={<CreateQuest />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
