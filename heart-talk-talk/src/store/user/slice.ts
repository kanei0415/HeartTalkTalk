import { FireStoreUserType } from '@libs/firebase';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const INIT = {
  name: '',
  uid: '',
  image: null,
  days: 1,
  createdAt: 0,
} as FireStoreUserType;

const user = createSlice({
  name: 'user',
  initialState: INIT,
  reducers: {
    updateUserInfo: (_, action: PayloadAction<FireStoreUserType>) => {
      return action.payload;
    },
    flushInfo: () => {
      return INIT;
    },
  },
});

export const { updateUserInfo, flushInfo } = user.actions;
export default user.reducer;
