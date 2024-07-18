import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import QuestManagement from './components/QuestManagement';
import MainLayout from './components/MainLayout';
import Auth from './components/Auth';
import DebuggerCmp from './components/Debugger';
import QuestDetails from './components/quest/QuestDetails';
import { routes } from './routes';


const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={routes.auth}element={<Auth />} />
          <Route path={routes.login} element={<Auth />} />
          <Route path={routes.questManagement} element={<QuestManagement />} />
          <Route path={routes.debugger} element={<DebuggerCmp />} />
          <Route path={routes.questDetails()} loader={({ params }) => ({ data: params.questId })} element={<QuestDetails />} />
        </Routes>
      </MainLayout>
    </Router>
  );

};

export default App;
