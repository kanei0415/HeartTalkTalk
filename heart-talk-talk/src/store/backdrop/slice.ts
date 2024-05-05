import { createSlice } from '@reduxjs/toolkit';

const backdrop = createSlice({
  name: 'backdrop',
  initialState: false,
  reducers: {
    backdropOn: () => {
      return true;
    },
    backdropOff: () => {
      return false;
    },
  },
});

export const { backdropOn, backdropOff } = backdrop.actions;
export default backdrop.reducer;
