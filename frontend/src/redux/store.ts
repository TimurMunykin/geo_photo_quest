import { configureStore } from '@reduxjs/toolkit';
import questsReducer from './questsSlice';
import photosReducer from './photosSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    quests: questsReducer,
    photos: photosReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
