import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface Quest {
  _id: string;
  name: string;
  token: string;
}

export interface QuestsState {
  quests: Quest[];
  currentQuestId?: string;
}

const initialState: QuestsState = {
  quests: [],
};

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    setCurrentQuest: (state, action: PayloadAction<string>) => {
      state.currentQuestId = action.payload;
    },
    setQuests: (state, action: PayloadAction<Quest[]>) => {
      state.quests = action.payload;
    },
    addQuest: (state, action: PayloadAction<Quest>) => {
      const index = state.quests.findIndex(quest => quest._id === action.payload._id);
      if (index !== -1) {
        state.quests[index] = action.payload;
      } else {
        state.quests.push(action.payload);
      }
    },
    removeQuest: (state, action: PayloadAction<string>) => {
      state.quests = state.quests.filter(quest => quest._id !== action.payload);
    },
    updateQuquestTitle: (state, action: PayloadAction<{ questId: string, title: string }>) => {
      const index = state.quests.findIndex(quest => quest._id === action.payload.questId);
      if (index !== -1) {
        state.quests[index].name = action.payload.title;
      }
    }
  },
});

const selectQuestState = (state: RootState) => state.quests;
export const selectQuestById = (questId: string) =>
  (state: RootState) => selectQuestState(state).quests.find(quest => quest._id === questId);

export const { setQuests, addQuest, removeQuest, setCurrentQuest, updateQuquestTitle } = questsSlice.actions;
export default questsSlice.reducer;
