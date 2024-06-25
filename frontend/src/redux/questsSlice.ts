import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Quest {
  _id: string;
  name: string;
  token: string;
}

interface QuestsState {
  quests: Quest[];
}

const initialState: QuestsState = {
  quests: [],
};

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
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

export const { setQuests, addQuest, removeQuest } = questsSlice.actions;
export default questsSlice.reducer;
