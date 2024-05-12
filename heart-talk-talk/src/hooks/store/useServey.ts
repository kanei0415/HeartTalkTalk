import { ServeyStateType, addServeyResult } from '@store/servey/slice';
import { RootStoreStateType } from '@store/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useServey() {
  const servey = useSelector<RootStoreStateType>(
    (root) => root.servey,
  ) as ServeyStateType;

  const dispatch = useDispatch();

  const __addServeyResult = useCallback(
    (id: string) => dispatch(addServeyResult(id)),
    [dispatch],
  );

  return {
    servey,
    __addServeyResult,
  };
}
