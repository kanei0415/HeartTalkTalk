import { backdropOff, backdropOn } from '@store/backdrop/slice';
import { RootStoreStateType } from '@store/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useBackdrop() {
  const backdrop = useSelector<RootStoreStateType>(
    (state) => state.backdrop,
  ) as boolean;

  const dispatch = useDispatch();

  const __backdropOn = useCallback(() => {
    dispatch(backdropOn());
  }, [dispatch]);

  const __backdropOff = useCallback(() => dispatch(backdropOff()), [dispatch]);

  return {
    backdrop,
    __backdropOn,
    __backdropOff,
  };
}
