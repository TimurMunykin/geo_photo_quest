import React from 'react';
import { useSelector } from 'react-redux';
import { QuestsState } from '../redux/questsSlice';
import { RootState } from '../redux/store';

const DebuggerCmp: React.FC = () => {
  // const currentQuest = useSelector<QuestsState>((state) => JSON.stringify(state));
  const currentQuest = useSelector<RootState>((state) => state.quests.currentQuestId);
  return (
    <>
      {currentQuest}
    </>
  );
};

export default DebuggerCmp;
