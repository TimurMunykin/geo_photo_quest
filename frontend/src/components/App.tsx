import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import QuestsManagement from './quest/QuestsManagement';
import MainLayout from './MainLayout';
import Auth from './auth/Auth';
import QuestDetails from './quest/QuestDetails';
import { routes } from '../routes';


const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={routes.auth}element={<Auth />} />
          <Route path={routes.login} element={<Auth />} />
          <Route path={routes.questManagement} element={<QuestsManagement />} />
          <Route path={routes.questDetails()} loader={({ params }) => ({ data: params.questId })} element={<QuestDetails />} />
        </Routes>
      </MainLayout>
    </Router>
  );

};

export default App;
