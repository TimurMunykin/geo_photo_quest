import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  selectLocationMode: boolean;
}

const initialState: MapState = {
  selectLocationMode: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectLocationMode: (state, action: PayloadAction<boolean>) => {
      state.selectLocationMode = action.payload;
    },
  },
});

export const { setSelectLocationMode } = mapSlice.actions;
export default mapSlice.reducer;
