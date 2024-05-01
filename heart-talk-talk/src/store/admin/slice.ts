import { FireStoreAdminType } from '@libs/firebase';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const INIT = {
  name: '',
  uid: '',
  image: '',
} satisfies FireStoreAdminType;

const admin = createSlice({
  name: 'admin',
  initialState: INIT,
  reducers: {
    updateAdminInfo: (_, action: PayloadAction<FireStoreAdminType>) => {
      return action.payload;
    },
    flushInfo: (state) => {
      return INIT;
    },
  },
});

export const { updateAdminInfo, flushInfo } = admin.actions;
export default admin.reducer;
