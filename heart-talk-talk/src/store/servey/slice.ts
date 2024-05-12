import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ServeyStateType = {
  id: string | null;
};

const servey = createSlice({
  name: 'servey',
  initialState: { id: null } as ServeyStateType,
  reducers: {
    addServeyResult: (_, action: PayloadAction<string>) => {
      return {
        id: action.payload,
      } satisfies ServeyStateType;
    },
  },
});

export const { addServeyResult } = servey.actions;
export default servey.reducer;
