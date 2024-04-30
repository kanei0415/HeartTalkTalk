import { FireStoreUserType } from '@libs/firebase';
import { flushInfo, updateUserInfo } from '@store/user/slice';
import { RootStoreStateType } from '@store/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useUser() {
  const user = useSelector<RootStoreStateType>(
    (state) => state.user,
  ) as FireStoreUserType;

  const dispatch = useDispatch();

  const __updateUserInfo = useCallback(
    (info: FireStoreUserType) => dispatch(updateUserInfo(info)),
    [dispatch],
  );

  const __flushInfo = useCallback(() => dispatch(flushInfo()), [dispatch]);

  return { user, __updateUserInfo, __flushInfo };
}
