import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Quest {
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
      state.quests.push(action.payload);
    },
    removeQuest: (state, action: PayloadAction<string>) => {
      state.quests = state.quests.filter(quest => quest._id !== action.payload);
    },
  },
});

export const { setQuests, addQuest, removeQuest, setCurrentQuest } = questsSlice.actions;
export default questsSlice.reducer;
