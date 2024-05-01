import { FireStoreAdminType } from '@libs/firebase';
import { flushInfo, updateAdminInfo } from '@store/admin/slice';
import { RootStoreStateType } from '@store/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useAdmin() {
  const admin = useSelector<RootStoreStateType>(
    (state) => state.admin,
  ) as FireStoreAdminType;

  const dispatch = useDispatch();

  const __updateAdminInfo = useCallback(
    (info: FireStoreAdminType) => dispatch(updateAdminInfo(info)),
    [dispatch],
  );

  const __flushInfo = useCallback(() => dispatch(flushInfo()), [dispatch]);

  return { admin, __updateAdminInfo, __flushInfo };
}
