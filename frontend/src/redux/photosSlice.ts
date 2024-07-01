import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from './store';

interface Photo {
  _id: string;
  path: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  quest: string;
}

interface PhotosState {
  photos: Photo[];
}

const initialState: PhotosState = {
  photos: [],
};

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    setPhotos: (state, action: PayloadAction<Photo[]>) => {
      const newPhotos = action.payload;
      const newPhotoIds = newPhotos.map(photo => photo._id);
      state.photos = [
        ...state.photos.filter(photo => !newPhotoIds.includes(photo._id)),
        ...newPhotos,
      ];
    },
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.photos.push(action.payload);
    },
    removePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter(photo => photo._id !== action.payload);
    },
    deleteAllPhotos: (state) => {
      state.photos = [];
    },
    reorderPhotos: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const [removed] = state.photos.splice(action.payload.startIndex, 1);
      state.photos.splice(action.payload.endIndex, 0, removed);
    },
  },
});

const selectPhotosState = (state: RootState) => state.photos;
export const selectPhotosByQuest = (quest: string) =>
  createSelector([selectPhotosState], (photosState) =>
    photosState.photos.filter((photo) => photo.quest === quest)
  );

export const { setPhotos, addPhoto, removePhoto, deleteAllPhotos, reorderPhotos } = photosSlice.actions;
export default photosSlice.reducer;
